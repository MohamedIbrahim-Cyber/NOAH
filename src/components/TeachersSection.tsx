import React, { useState } from 'react';
import { Teacher, BrandTheme } from '../types';
import { getThemeColors } from '../lib/theme';
import { Filter, ChevronDown, Check } from 'lucide-react';

interface TeachersSectionProps {
  teachers: Teacher[];
  currentTheme: BrandTheme;
  onSelectTeacher?: (teacher: Teacher) => void;
}

export const TeachersSection: React.FC<TeachersSectionProps> = ({
  teachers,
  currentTheme,
  onSelectTeacher,
}) => {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isGradeMenuOpen, setIsGradeMenuOpen] = useState(false);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);

  const colors = getThemeColors(currentTheme);

  const gradeOptions = [
    { value: 'all', label: 'الصف الدراسي: الكل' },
    { value: '1st', label: 'الصف الأول الثانوي' },
    { value: '2nd', label: 'الصف الثاني الثانوي' },
    { value: '3rd', label: 'الصف الثالث الثانوي' },
  ];

  const subjectOptions = [
    { value: 'all', label: 'المادة الدراسية: الكل' },
    { value: 'arabic', label: 'اللغة العربية' },
    { value: 'programming', label: 'البرمجة والذكاء الاصطناعي' },
    { value: 'philosophy', label: 'الفلسفة وعلم النفس' },
    { value: 'math', label: 'الرياضيات' },
  ];

  const filteredTeachers = teachers.filter((teacher) => {
    if (selectedSubject === 'arabic' && !teacher.subject.includes('العربية')) return false;
    if (selectedSubject === 'programming' && !teacher.subject.includes('البرمجة')) return false;
    if (selectedSubject === 'philosophy' && !teacher.subject.includes('الفلسفة')) return false;
    if (selectedSubject === 'math' && !teacher.subject.includes('الرياضيات')) return false;
    return true;
  });

  return (
    <section
      id="teachers-section"
      className="py-12 sm:py-16 px-3 sm:px-6 my-8 sm:my-10 relative overflow-hidden transition-colors"
      style={{
        backgroundColor: currentTheme === 'dark' ? '#0F172A' : currentTheme === 'fresh' ? '#FDF2F4' : '#F7ECE8',
      }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-camel text-xl sm:text-3xl font-black text-neutral-900 dark:text-slate-100 mb-2">
            اختر المدرسين
          </h2>

          {/* Decorative Curved Dashed Line under Heading */}
          <div className="flex justify-center items-center my-3">
            <svg width="180" height="20" viewBox="0 0 180 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 15C50 3 130 3 175 15"
                stroke={currentTheme === 'dark' ? '#38BDF8' : currentTheme === 'fresh' ? '#6F384F' : '#3A3028'}
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="font-ui text-xs sm:text-sm text-neutral-600 dark:text-slate-300">
            نخبة من كبار معلمي المملكة والمشرفين الأكاديميين لتقديم الشروحات النظرية والعملية
          </p>

          {/* Two Filter Dropdown Pills Side by Side */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-5 sm:mt-6">
            {/* Grade Filter Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsGradeMenuOpen(!isGradeMenuOpen);
                  setIsSubjectMenuOpen(false);
                }}
                className="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold border shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.textPrimary,
                  borderColor: colors.borderColor,
                }}
              >
                <Filter className="w-3.5 h-3.5 text-neutral-500 dark:text-slate-400" />
                <span>{gradeOptions.find((g) => g.value === selectedGrade)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {isGradeMenuOpen && (
                <div
                  className="absolute top-full mt-2 right-0 border rounded-xl shadow-lg py-1 z-30 min-w-44 text-right"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                  }}
                >
                  {gradeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedGrade(opt.value);
                        setIsGradeMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between"
                      style={{ color: colors.textPrimary }}
                    >
                      <span>{opt.label}</span>
                      {selectedGrade === opt.value && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subject Filter Pill */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSubjectMenuOpen(!isSubjectMenuOpen);
                  setIsGradeMenuOpen(false);
                }}
                className="px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold border shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.textPrimary,
                  borderColor: colors.borderColor,
                }}
              >
                <span>{subjectOptions.find((s) => s.value === selectedSubject)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {isSubjectMenuOpen && (
                <div
                  className="absolute top-full mt-2 right-0 border rounded-xl shadow-lg py-1 z-30 min-w-48 text-right"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.borderColor,
                  }}
                >
                  {subjectOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSelectedSubject(opt.value);
                        setIsSubjectMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between"
                      style={{ color: colors.textPrimary }}
                    >
                      <span>{opt.label}</span>
                      {selectedSubject === opt.value && <Check className="w-3.5 h-3.5 text-emerald-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Teacher Cards Grid (3-Column) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="rounded-3xl p-5 border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center cursor-pointer group relative overflow-hidden"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.borderColor,
              }}
              onClick={() => onSelectTeacher && onSelectTeacher(teacher)}
            >
              {/* Banner Strip at Top */}
              <div
                className="w-full border rounded-2xl py-2.5 sm:py-3 px-4 mb-5 shadow-2xs"
                style={{
                  backgroundColor: currentTheme === 'dark' ? '#1E293B' : '#FFE4E6',
                  borderColor: currentTheme === 'dark' ? '#334155' : '#FECDD3',
                }}
              >
                <h3 className="font-qahwa text-lg sm:text-xl font-bold text-neutral-900 dark:text-slate-100 mb-0.5 group-hover:text-amber-500 transition-colors">
                  {teacher.name}
                </h3>
                <p className="font-ui text-xs font-medium text-rose-900 dark:text-sky-300 line-clamp-1">
                  {teacher.role}
                </p>
              </div>

              {/* Circular Cropped Photo of Teacher */}
              <div className="relative mb-5">
                <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-full bg-[#1D4ED8] p-1.5 shadow-md flex items-center justify-center overflow-hidden border-4 border-white/20 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                    <svg className="w-18 sm:w-20 h-18 sm:h-20 text-white/80 translate-y-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>

                {/* Subject Badge overlay */}
                <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-amber-400 text-neutral-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow border border-amber-300 whitespace-nowrap">
                  {teacher.subject}
                </div>
              </div>

              {/* Teacher Stats & Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 dark:text-slate-400 font-semibold mb-3">
                <span>{teacher.studentsCount}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-slate-700" />
                <span>خبرة {teacher.experienceYears} عاماً</span>
              </div>

              <button
                className="mt-auto w-full py-2 rounded-xl text-xs font-bold border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{
                  borderColor: colors.borderColor,
                  color: colors.textPrimary,
                }}
              >
                عرض كورسات المدرس
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
