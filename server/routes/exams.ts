import crypto from 'crypto';
import { Router } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAuth } from '../authorize';
import { ExamAttempt } from '../../src/types';

const router = Router();

// Rate limiter for exam submissions: ip/userId -> timestamps[]
const examSubmissionRateLimits = new Map<string, number[]>();

function checkExamRateLimit(key: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = (examSubmissionRateLimits.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  examSubmissionRateLimits.set(key, timestamps);
  return true;
}

// GET /api/exams - List all exams
router.get('/', (req, res) => {
  const exams = Array.from(db.exams.values()).map((ex) => {
    const course = db.courses.find((c) => c.id === ex.courseId);
    return {
      id: ex.id,
      title: ex.title,
      courseTitle: course ? course.title : 'اختبار عام',
      durationMinutes: ex.durationMinutes,
      questionsCount: ex.questionIds.length,
      isFinal: ex.isFinal,
    };
  });

  res.json({ exams });
});

// GET /api/exams/:id - Get exam questions (without answers for security)
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const exam = db.exams.get(req.params.id);
  if (!exam) {
    return res.status(404).json({ error: 'الاختبار غير موجود' });
  }

  const course = db.courses.find((c) => c.id === exam.courseId);

  // Fetch questions, stripping correctChoiceIndex
  const questions = exam.questionIds
    .map((qId) => db.questions.get(qId))
    .filter(Boolean)
    .map((q) => ({
      id: q!.id,
      text: q!.questionText,
      choices: q!.choices,
      difficulty: q!.difficulty,
      // correctChoiceIndex and explanation are deliberately omitted
    }));

  res.json({
    exam: {
      id: exam.id,
      title: exam.title,
      courseTitle: course ? course.title : 'اختبار عام',
      durationMinutes: exam.durationMinutes,
      questions,
    },
  });
});

// POST /api/exams/:id/submit - Grade on the server with strict authentication and rate limiting
router.post('/:id/submit', requireAuth, (req: AuthenticatedRequest, res) => {
  const examId = req.params.id;
  const exam = db.exams.get(examId);

  if (!exam) {
    return res.status(404).json({ error: 'الاختبار غير موجود' });
  }

  const user = req.user!;
  const throttleKey = `exam_sub_${user.id}_${req.ip}`;
  if (!checkExamRateLimit(throttleKey, 5, 60000)) {
    return res.status(429).json({
      error: 'تم تجاوز الحد المسموح به لتسليم الاختبارات (5 مرات في الدقيقة). يرجى الانتظار قليلاً.',
      code: 'THROTTLED',
    });
  }

  const { answers } = req.body; // { [questionId: number]: chosenIndex: number }

  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'لم يتم استلام إجابات صالحة' });
  }

  let correctCount = 0;
  const totalQuestions = exam.questionIds.length;
  const detailedBreakdown = [];

  for (const qId of exam.questionIds) {
    const question = db.questions.get(qId);
    if (!question) continue;

    const chosen = answers[qId];
    const isCorrect = chosen === question.correctChoiceIndex;
    if (isCorrect) {
      correctCount++;
    }

    detailedBreakdown.push({
      questionId: question.id,
      text: question.questionText,
      choices: question.choices,
      chosenIndex: chosen !== undefined ? chosen : null,
      correctIndex: question.correctChoiceIndex,
      isCorrect,
      explanation: question.explanation,
    });
  }

  const percentage = Math.round((correctCount / (totalQuestions || 1)) * 100);
  const earnedPoints = correctCount * 15;

  const attemptId = `att_${crypto.randomBytes(6).toString('hex')}`;

  const attempt: ExamAttempt = {
    id: attemptId,
    examId,
    userId: user.id,
    startedAt: new Date(Date.now() - exam.durationMinutes * 60 * 1000).toISOString(),
    submittedAt: new Date().toISOString(),
    score: correctCount,
    totalQuestions,
    answers,
  };

  db.examAttempts.push(attempt);

  // Award student points
  user.points += earnedPoints;

  res.json({
    success: true,
    attemptId,
    score: correctCount,
    total: totalQuestions,
    percentage,
    earnedPoints,
    passed: percentage >= 60,
    breakdown: detailedBreakdown,
    feedback:
      percentage >= 90
        ? 'ما شاء الله تبارك الله! أداء متميز وفهم عميق لمعايير مسارات الثانوية العامة 🌟'
        : percentage >= 70
        ? 'ممتاز! إجابات موفقة مع بعض النقاط التي تحتاج مراجعة بسيطة.'
        : 'أداء جيد، ننصحك بمراجعة محاضرات المنهج وحل بنك الأسئلة مجدداً.',
  });
});

// GET /api/exams/attempts/:id - Prevent IDOR: Student can only view their own exam attempt
router.get('/attempts/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const attempt = db.examAttempts.find((a) => a.id === req.params.id);
  if (!attempt) {
    return res.status(404).json({ error: 'محاولة الاختبار غير موجودة' });
  }

  if (attempt.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({
      error: 'غير مصرح لك بالاطلاع على نتيجة طالب آخر.',
      code: 'FORBIDDEN_ACCESS',
    });
  }

  res.json({ attempt });
});

export default router;
