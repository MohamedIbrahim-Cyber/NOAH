import { Router } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, isUserEnrolledInCourse, generateSignedPlaybackToken } from '../authorize';

const router = Router();

// GET /api/courses - List all courses with optional grade/track filtering
router.get('/', (req, res) => {
  const { grade, track } = req.query;

  let results = db.courses;

  if (grade && grade !== 'all') {
    results = results.filter((c) => c.gradeKey === grade);
  }

  if (track && track !== 'all') {
    results = results.filter((c) => c.trackKey === track);
  }

  res.json({ courses: results });
});

// GET /api/courses/:id - Course detail with syllabus & teacher
router.get('/:id', (req: AuthenticatedRequest, res) => {
  const course = db.courses.find((c) => c.id === req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'الكورس غير موجود' });
  }

  const lessons = Array.from(db.lessons.values())
    .filter((l) => l.courseId === course.id)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const isEnrolled = req.user ? isUserEnrolledInCourse(req.user.id, course.id) : false;

  res.json({
    course,
    lessons: lessons.map((l) => ({
      ...l,
      isLocked: !isEnrolled && !l.isPreview,
    })),
    isEnrolled,
  });
});

// GET /api/courses/:id/lessons
router.get('/:id/lessons', (req: AuthenticatedRequest, res) => {
  const courseId = req.params.id;
  const isEnrolled = req.user ? isUserEnrolledInCourse(req.user.id, courseId) : false;

  const lessons = Array.from(db.lessons.values())
    .filter((l) => l.courseId === courseId)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  // Check completions
  const completedIds = req.user
    ? db.lessonCompletions
        .filter((c) => c.userId === req.user!.id)
        .map((c) => c.lessonId)
    : [];

  res.json({
    lessons: lessons.map((l) => ({
      ...l,
      isLocked: !isEnrolled && !l.isPreview,
      completed: completedIds.includes(l.id),
    })),
    isEnrolled,
  });
});

// GET /api/lessons/:id/video-token - Gated video token delivery
// Access control logic:
// 1. Read session.user
// 2. If lesson.isPreview = true, allow
// 3. Else query enrollments; reject with 403 if none exists
// 4. Return signed playback URL + anti-piracy watermark text
router.get('/lessons/:id/video-token', (req: AuthenticatedRequest, res) => {
  const lessonId = req.params.id;
  const lesson = db.lessons.get(lessonId);

  if (!lesson) {
    return res.status(404).json({ error: 'الدرس غير موجود' });
  }

  // Preview lessons are free to everyone
  if (lesson.isPreview) {
    const signedToken = generateSignedPlaybackToken(req.user || null, lesson);
    return res.json({
      success: true,
      token: signedToken,
      lesson,
      isPreview: true,
      message: 'معاينة مجانية للمحاضرة الأولى',
    });
  }

  // Not preview: requires authenticated user and enrollment
  if (!req.user) {
    return res.status(401).json({
      error: 'هذه المحاضرة تتطلب تسجيل الدخول والاشتراك في الكورس.',
      code: 'AUTH_REQUIRED',
    });
  }

  const isEnrolled = isUserEnrolledInCourse(req.user.id, lesson.courseId);
  if (!isEnrolled) {
    return res.status(403).json({
      error: 'عفواً، هذه المحاضرة مقفلة. يرجى الاشتراك في الكورس لمشاهدة المحتوى وتحميل المذكرات.',
      code: 'ENROLLMENT_REQUIRED',
      courseId: lesson.courseId,
    });
  }

  const signedToken = generateSignedPlaybackToken(req.user, lesson);
  return res.json({
    success: true,
    token: signedToken,
    lesson,
    isPreview: false,
    message: 'تم التحقق من الاشتراك بنجاح، جاري بث الفيديو المشفر',
  });
});

// POST /api/lessons/:id/complete - Mark lesson complete
router.post('/lessons/:id/complete', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'يرجى تسجيل الدخول أولاً' });
  }

  const lessonId = req.params.id;
  const lesson = db.lessons.get(lessonId);
  if (!lesson) {
    return res.status(404).json({ error: 'الدرس غير موجود' });
  }

  const existing = db.lessonCompletions.find(
    (c) => c.userId === req.user!.id && c.lessonId === lessonId
  );

  if (!existing) {
    db.lessonCompletions.push({
      userId: req.user.id,
      lessonId,
      completedAt: new Date().toISOString(),
    });

    // Reward with 10 points
    req.user.points += 10;
  }

  res.json({
    success: true,
    message: 'أحسنت! تم إنهاء الدرس وإضافة 10 نقاط إلى حسابك 🌟',
    points: req.user.points,
  });
});

export default router;
