import crypto from 'crypto';
import { Router } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireRole } from '../authorize';
import { Course, Lesson, Order } from '../../src/types';

const router = Router();

// Apply role check middleware for admin
router.use(requireRole(['admin']));

// GET /api/admin/overview - Platform KPIs
router.get('/overview', (req: AuthenticatedRequest, res) => {
  const allOrders = Array.from(db.orders.values());
  const paidOrders = allOrders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  const students = Array.from(db.users.values()).filter((u) => u.role === 'student');
  const totalEnrollments = Array.from(db.enrollments.values()).length;
  const openTickets = db.supportTickets.filter((t) => t.status === 'open').length;

  const recentOrders = allOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  res.json({
    totalRevenue,
    paidOrdersCount: paidOrders.length,
    totalStudents: students.length,
    activeEnrollmentsCount: totalEnrollments,
    recentOrders,
    openTicketsCount: openTickets,
  });
});

// GET /api/admin/orders - Full orders list
router.get('/orders', (req, res) => {
  const orders = Array.from(db.orders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json({ orders });
});

// POST /api/admin/courses - Create course
router.post('/courses', (req, res) => {
  const { title, subject, gradeKey, trackKey, price, originalPrice, description, teacherName } = req.body;

  if (!title || !subject || !price) {
    return res.status(400).json({ error: 'يرجى إدخال اسم الكورس والمادة والسعر' });
  }

  const courseId = `c_${Date.now()}`;
  const newCourse: Course = {
    id: courseId,
    title,
    shortTitle: title.split(' ')[0] || title,
    level: gradeKey === '1st_secondary' ? 'الصف الأول الثانوي' : gradeKey === '2nd_secondary' ? 'الصف الثاني الثانوي' : 'الصف الثالث الثانوي',
    track: trackKey === 'computing_engineering' ? 'مسار الحوسبة والهندسة' : trackKey === 'natural_sciences' ? 'مسار العلوم الطبيعية' : 'السنة الأولى المشتركة',
    gradeKey: gradeKey || '3rd_secondary',
    trackKey: trackKey || 'computing_engineering',
    subject,
    teacher: {
      name: teacherName || 'أستاذ المادة',
      role: `معلم خبير في ${subject}`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.3),
    startDate: 'متاح فوراً',
    startTime: 'مسجل ومباشر أسبوعياً',
    description: description || 'شرح شامل للمنهج وحل التمارين وبنوك الأسئلة.',
    lecturesCount: 1,
    bannerTheme: 'gold-hex',
    tags: [subject, 'مسارات'],
  };

  db.courses.unshift(newCourse);

  // Add initial preview lecture
  const lessonId = `les_${courseId}_1`;
  const lesson: Lesson = {
    id: lessonId,
    courseId,
    title: `المحاضرة التأسيسية: مقدمة ${subject}`,
    orderIndex: 1,
    videoProviderId: `stream_asset_${courseId}_1`,
    durationSeconds: 2700,
    isPreview: true,
    attachmentUrls: [
      {
        title: 'مذكرة المحاضرة التأسيسية (PDF)',
        url: 'https://storage.noheacademy.sa/notes/sample.pdf',
        size: '3.2 MB',
      },
    ],
  };
  db.lessons.set(lessonId, lesson);

  res.status(201).json({ success: true, course: newCourse, message: 'تم إضافة الكورس بنجاح' });
});

// POST /api/admin/lessons - Add lesson to course
router.post('/lessons', (req, res) => {
  const { courseId, title, videoProviderId, durationSeconds, isPreview, attachmentTitle, attachmentUrl } = req.body;

  if (!courseId || !title) {
    return res.status(400).json({ error: 'يرجى تحديد الكورس وعنوان الدرس' });
  }

  const course = db.courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: 'الكورس غير موجود' });
  }

  const existingLessons = Array.from(db.lessons.values()).filter((l) => l.courseId === courseId);
  const orderIndex = existingLessons.length + 1;
  const lessonId = `les_${courseId}_${orderIndex}`;

  const lesson: Lesson = {
    id: lessonId,
    courseId,
    title,
    orderIndex,
    videoProviderId: videoProviderId || `stream_asset_${Date.now()}`,
    durationSeconds: durationSeconds ? Number(durationSeconds) : 2400,
    isPreview: Boolean(isPreview),
    attachmentUrls: attachmentUrl
      ? [{ title: attachmentTitle || 'مذكرة الشرح والواجب', url: attachmentUrl, size: '4.5 MB' }]
      : [],
  };

  db.lessons.set(lessonId, lesson);
  course.lecturesCount = existingLessons.length + 1;

  res.status(201).json({ success: true, lesson, message: 'تم إضافة المحاضرة إلى الكورس بنجاح' });
});

// GET /api/admin/tickets - View support tickets
router.get('/tickets', (req, res) => {
  res.json({ tickets: db.supportTickets });
});

// PATCH /api/admin/tickets/:id - Update ticket status
router.patch('/tickets/:id', (req, res) => {
  const ticket = db.supportTickets.find((t) => t.id === req.params.id);
  if (!ticket) {
    return res.status(404).json({ error: 'التذكرة غير موجودة' });
  }

  const { status } = req.body;
  if (status) {
    ticket.status = status;
  }

  res.json({ success: true, ticket });
});

export default router;
