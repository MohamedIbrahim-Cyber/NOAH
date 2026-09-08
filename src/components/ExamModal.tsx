import React, { useState, useEffect } from 'react';
import { BrandTheme, StudentUser } from '../types';
import { api } from '../lib/api';
import { X, Clock, CheckCircle2, AlertCircle, Award, ArrowLeft, ArrowRight, RotateCcw, Loader2, Sparkles } from 'lucide-react';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BrandTheme;
  currentUser: StudentUser | null;
  examId?: string;
  onCompleteExam?: (score: number, total: number) => void;
}

const DEFAULT_FALLBACK_QUESTIONS = [
  {
    id: 1,
    text: 'في مسار الحوسبة والهندسة، أي مما يلي يُعتبر الهيكل الأساسي لتمثيل البيانات في بايثون ويقبل عناصر غير متجانسة وقابلة للتعديل؟',
    choices: ['القائمة (List)', 'الصف (Tuple)', 'المجموعة (Set)', 'السلسلة النصية (String)'],
    difficulty: 'medium',
  },
  {
    id: 2,
    text: 'أي من البروتوكولات التالية يُستخدم لتأمين الاتصال ونقل البيانات المشفرة بين متصفح الطالب وخادم منصة نوح؟',
    choices: ['HTTP', 'HTTPS (SSL/TLS)', 'FTP', 'SMTP'],
    difficulty: 'easy',
  },
  {
    id: 6,
    text: 'ما هو الهدف الأساسي من خوارزمية التعلم الآلي "الانحدار الخطي" (Linear Regression)؟',
    choices: [
      'تصنيف الصور إلى فئات غير رقمية',
      'التنبؤ بقيمة رقمية مستمرة بناءً على متغيرات مستقلة',
      'تشفير كلمات المرور',
      'ضغط الملفات الصوتية'
    ],
    difficulty: 'medium',
  }
];

export const ExamModal: React.FC<ExamModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentUser,
  examId = 'exam-1',
  onCompleteExam,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [examData, setExamData] = useState<any>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(20 * 60);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Fetch exam from backend
  useEffect(() => {
    if (!isOpen) return;

    const loadExam = async () => {
      setLoading(true);
      try {
        const res = await api.exams.get(examId);
        if (res?.exam?.questions && res.exam.questions.length > 0) {
          setExamData(res.exam);
          setSecondsRemaining(res.exam.durationMinutes * 60);
        } else {
          setExamData({
            id: examId,
            title: 'اختبار تجريبي في المسارات الثانوية',
            durationMinutes: 20,
            questions: DEFAULT_FALLBACK_QUESTIONS,
          });
          setSecondsRemaining(20 * 60);
        }
        setSelectedAnswers({});
        setIsSubmitted(false);
        setSubmissionResult(null);
        setCurrentQuestionIdx(0);
      } catch (err: any) {
        console.warn('Using offline questions bank for exam:', err);
        setExamData({
          id: examId,
          title: 'اختبار تجريبي في المسارات الثانوية (وضع الاستجابة السريعة)',
          durationMinutes: 20,
          questions: DEFAULT_FALLBACK_QUESTIONS,
        });
        setSecondsRemaining(20 * 60);
        setSelectedAnswers({});
        setIsSubmitted(false);
        setSubmissionResult(null);
        setCurrentQuestionIdx(0);
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [isOpen, examId]);

  // Timer
  useEffect(() => {
    if (!isOpen || isSubmitted || !examData) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, examData]);

  if (!isOpen) return null;

  const primaryBrandColor = currentTheme === 'fresh' ? '#6F384F' : '#3A3028';
  const questions = examData?.questions || [];
  const currentQuestion = questions[currentQuestionIdx];

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins}:${remainderSecs < 10 ? '0' : ''}${remainderSecs}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted || !currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  // Server-side grading submission
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const result = await api.exams.submit(examId, selectedAnswers);
      setSubmissionResult(result);
      setIsSubmitted(true);
      if (onCompleteExam) {
        onCompleteExam(result.score, result.total);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setSubmissionResult(null);
    setCurrentQuestionIdx(0);
    if (examData) setSecondsRemaining(examData.durationMinutes * 60);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border relative my-8 animate-in fade-in zoom-in-95 duration-200 text-right">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Exam Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b mb-6">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-1">
              بنك أسئلة قياس والمسارات (تصحيح خادم نوح الآمن)
            </div>
            <h3 className="font-camel text-xl font-bold text-neutral-900">
              {examData?.title || 'اختبار تجريبي في المسارات الثانوية'}
            </h3>
          </div>

          {/* Countdown Timer */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 bg-neutral-100 px-3.5 py-1.5 rounded-full font-impact text-base text-neutral-800" dir="ltr">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-neutral-500 font-ui text-sm flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-amber-500" />
            <span>جاري استدعاء بنك الأسئلة المشفر من الخادم...</span>
          </div>
        ) : isSubmitted && submissionResult ? (
          /* Result Summary & Explanations from Server */
          <div>
            <div className="text-center py-4 bg-neutral-50 rounded-2xl border mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-md"
                style={{ backgroundColor: submissionResult.percentage >= 75 ? '#10B981' : '#F59E0B' }}
              >
                <Award className="w-8 h-8" />
              </div>
              <h4 className="font-camel text-2xl font-black text-neutral-900 mb-1">
                {submissionResult.percentage >= 75 ? 'ممتاز! نتيجة رائعة 🌟' : 'محاولة جيدة، راجع الإجابات النموذجية'}
              </h4>
              <p className="font-ui text-sm text-neutral-600 mb-2">
                حصلت على <span className="font-impact text-xl font-bold text-neutral-900">{submissionResult.score}</span> من <span className="font-impact text-xl font-bold text-neutral-900">{submissionResult.total}</span> ({submissionResult.percentage}%)
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>تم منحك +{submissionResult.earnedPoints} نقطة في حسابك!</span>
              </div>
              <p className="font-ui text-xs text-neutral-600 max-w-md mx-auto mb-4 bg-white p-3 rounded-xl border border-black/5">
                {submissionResult.feedback}
              </p>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-neutral-200 hover:bg-neutral-300 text-neutral-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة الاختبار مرة أخرى</span>
              </button>
            </div>

            {/* Question by question feedback returned from server */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {submissionResult.breakdown?.map((item: any, idx: number) => {
                return (
                  <div
                    key={item.questionId || idx}
                    className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                      item.isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <div className="font-camel font-bold text-neutral-900 mb-2 flex items-center justify-between">
                      <span>س {idx + 1}: {item?.text || item?.questionText || `سؤال ${idx + 1}`}</span>
                      {item.isCorrect ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> إجابة صحيحة (+15 نقطة)
                        </span>
                      ) : (
                        <span className="text-rose-700 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> إجابة غير دقيقة
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-600 font-ui text-xs mb-1">
                      إجابتك: <span className="font-semibold">{item?.chosenIndex !== null && item?.chosenIndex !== undefined && item?.choices ? item.choices[item.chosenIndex] : 'لم تجب'}</span>
                    </div>
                    <div className="text-emerald-700 font-ui text-xs font-bold mb-1">
                      الإجابة النموذجية المعتمدة: {item?.choices && item?.correctIndex !== undefined ? item.choices[item.correctIndex] : '—'}
                    </div>
                    {item.explanation && (
                      <div className="text-neutral-500 font-ui text-[11px] pt-1 border-t border-black/5 mt-1">
                        💡 شرح المعلم: {item.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
            <h4 className="font-camel text-lg font-bold text-neutral-800 mb-1">
              جاري تجهيز أسئلة الاختبار من خادم نوح...
            </h4>
            <p className="text-xs text-neutral-500 font-ui">
              يتم مطابقة أسئلة مسارات الثانوية العامة وتوليد نموذج الإجابة الآمن
            </p>
          </div>
        ) : !currentQuestion ? (
          <div className="py-12 text-center">
            <p className="text-sm text-neutral-600 mb-4">لا توجد أسئلة متاحة حالياً لهذا الاختبار.</p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        ) : (
          /* Active Question view */
          <div>
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-neutral-500 font-bold mb-3">
              <span>السؤال {currentQuestionIdx + 1} من {questions.length}</span>
              <span>درجة السؤال: 1 درجة</span>
            </div>

            <div className="w-full h-1.5 bg-neutral-100 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="font-camel text-lg font-bold text-neutral-900 mb-6 bg-neutral-50 p-4 rounded-2xl border">
              {currentQuestion?.text || ''}
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion?.choices?.map((option: string, optIdx: number) => {
                const isSelected = selectedAnswers[currentQuestion.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-xs ring-1 ring-amber-400 font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-800'
                    }`}
                  >
                    <span className="font-ui text-sm">{option}</span>
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                        isSelected ? 'border-amber-600 bg-amber-500 text-white' : 'border-neutral-300'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <button
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-neutral-200 disabled:opacity-30 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              {currentQuestionIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: primaryBrandColor }}
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  disabled={submitting}
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-neutral-950 shadow-md transition-transform hover:scale-102 flex items-center gap-1.5 cursor-pointer bg-amber-400 hover:bg-amber-300 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري التصحيح الأكاديمي...</span>
                    </>
                  ) : (
                    <>
                      <span>تسليم الإجابات وإنهاء الاختبار</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
