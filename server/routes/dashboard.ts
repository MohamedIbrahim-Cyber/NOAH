import { Router } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAuth } from '../authorize';

const router = Router();

// GET /api/dashboard/progress - Aggregate student's enrollments, completions, and exam history
router.get('/progress', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;

  // 1. Get Enrolled Courses with completion statistics
  const enrolledCourses = user.enrolledCourseIds
    .map((cId) => db.courses.find((c) => c.id === cId))
    .filter(Boolean)
    .map((course) => {
      const courseLessons = Array.from(db.lessons.values()).filter((l) => l.courseId === course!.id);
      const totalLessons = courseLessons.length;

      const completedInThisCourse = db.lessonCompletions.filter(
        (c) => c.userId === user.id && courseLessons.some((l) => l.id === c.lessonId)
      );
      const completedCount = completedInThisCourse.length;
      const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      // Find next uncompleted lesson
      const completedIds = completedInThisCourse.map((c) => c.lessonId);
      const nextLesson = courseLessons.find((l) => !completedIds.includes(l.id)) || courseLessons[0];

      return {
        ...course,
        totalLessons,
        completedCount,
        progressPercent,
        nextLessonId: nextLesson ? nextLesson.id : null,
        nextLessonTitle: nextLesson ? nextLesson.title : 'تم إكمال جميع المحاضرات',
      };
    });

  // 2. Get Student's Exam Attempts
  const studentAttempts = db.examAttempts
    .filter((a) => a.userId === user.id)
    .map((att) => {
      const exam = db.exams.get(att.examId);
      return {
        ...att,
        examTitle: exam ? exam.title : 'اختبار تجريبي',
      };
    });

  // 3. User Orders / Receipts
  const studentOrders = Array.from(db.orders.values())
    .filter((o) => o.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 4. Overall platform stats for student
  const totalCompletedLessons = db.lessonCompletions.filter((c) => c.userId === user.id).length;

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gradeLevel: user.gradeLevel,
      track: user.track,
      points: user.points,
      role: user.role,
    },
    enrolledCourses,
    totalCompletedLessons,
    examAttempts: studentAttempts,
    orders: studentOrders,
    certificates: enrolledCourses
      .filter((c) => c.progressPercent === 100)
      .map((c) => ({
        courseId: c.id,
        courseTitle: c.title,
        issuedDate: new Date().toLocaleDateString('ar-SA'),
      })),
  });
});

export default router;
