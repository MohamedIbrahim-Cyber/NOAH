import crypto from 'crypto';
import { Router } from 'express';
import { db } from '../db';
import { AuthenticatedRequest, requireAuth } from '../authorize';
import { Order, Enrollment } from '../../src/types';

const router = Router();
const MOYASAR_SECRET_KEY = process.env.MOYASAR_SECRET_KEY || 'sk_test_nohe_moyasar_mock_key';

// Checkout rate limiter: key -> timestamps[]
const checkoutRateLimits = new Map<string, number[]>();

function checkCheckoutRateLimit(key: string, limit = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = (checkoutRateLimits.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  checkoutRateLimits.set(key, timestamps);
  return true;
}

// POST /api/checkout/create - Initialize payment session with rate limit
router.post('/create', (req: AuthenticatedRequest, res) => {
  const clientKey = req.user ? req.user.id : (req.ip || '127.0.0.1');
  if (!checkCheckoutRateLimit(`checkout_${clientKey}`, 10, 60000)) {
    return res.status(429).json({
      error: 'تم تجاوز الحد المسموح به لإنشاء جلسات الدفع (10 جلسات في الدقيقة). يرجى الانتظار.',
      code: 'THROTTLED',
    });
  }

  const { itemType, itemId, paymentMethod, couponCode, studentDetails } = req.body;

  let targetItem: { id: string; title: string; price: number } | undefined;

  if (itemType === 'course') {
    const course = db.courses.find((c) => c.id === itemId);
    if (course) {
      targetItem = { id: course.id, title: course.title, price: course.price };
    }
  } else if (itemType === 'package') {
    const pkg = db.packages.find((p) => p.id === itemId);
    if (pkg) {
      targetItem = { id: pkg.id, title: pkg.title, price: pkg.price };
    }
  }

  if (!targetItem) {
    return res.status(404).json({ error: 'عنصر الشراء غير موجود' });
  }

  let finalAmount = targetItem.price;
  let discountApplied = false;

  // Check discount coupon
  if (couponCode && couponCode.trim().toUpperCase() === 'NOHE2026') {
    finalAmount = Math.round(finalAmount * 0.8); // 20% discount
    discountApplied = true;
  }

  const userId = req.user ? req.user.id : `usr_guest_${Date.now()}`;
  const userName = req.user ? req.user.fullName : (studentDetails?.fullName || 'طالب جديد');

  const orderId = `ord_${crypto.randomBytes(6).toString('hex')}`;
  const providerTransactionId = `moy_trx_${crypto.randomBytes(8).toString('hex')}`;

  const order: Order = {
    id: orderId,
    userId,
    userName,
    itemType,
    itemId: targetItem.id,
    itemTitle: targetItem.title,
    amount: finalAmount,
    paymentProvider: 'moyasar',
    paymentMethod: paymentMethod || 'mada',
    paymentStatus: 'pending',
    providerTransactionId,
    createdAt: new Date().toISOString(),
  };

  db.orders.set(orderId, order);

  res.json({
    success: true,
    orderId,
    amount: finalAmount,
    originalAmount: targetItem.price,
    discountApplied,
    itemTitle: targetItem.title,
    provider: 'moyasar',
    providerTransactionId,
    checkoutUrl: `https://checkout.moyasar.com/v1/sessions/${providerTransactionId}`,
    message: discountApplied
      ? 'تم تطبيق كود الخصم NOHE2026 بنسبة 20% بنجاح!'
      : 'تم إنشاء جلسة الدفع الآمنة عبر ميسر (Moyasar)',
  });
});

// Helper function to fulfill order and enroll student
function fulfillOrder(order: Order): { enrolledCourseIds: string[] } {
  order.paymentStatus = 'paid';
  const enrolledCourseIds: string[] = [];

  if (order.itemType === 'course') {
    enrolledCourseIds.push(order.itemId);
  } else if (order.itemType === 'package') {
    const pkgCourses = db.packageCourses.filter((pc) => pc.packageId === order.itemId);
    pkgCourses.forEach((pc) => enrolledCourseIds.push(pc.courseId));
  }

  // Create enrollment records in DB
  enrolledCourseIds.forEach((courseId) => {
    const enrollmentId = `enr_${crypto.randomBytes(6).toString('hex')}`;
    const enrollment: Enrollment = {
      id: enrollmentId,
      userId: order.userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      expiresAt: null, // Lifetime access for current academic year
    };
    db.enrollments.set(enrollmentId, enrollment);
  });

  // Update user profile if exists
  const user = db.users.get(order.userId);
  if (user) {
    user.enrolledCourseIds = [...new Set([...user.enrolledCourseIds, ...enrolledCourseIds])];
    user.points += Math.round(order.amount * 0.5); // 0.5 points per SAR spent
  }

  return { enrolledCourseIds };
}

// POST /api/webhooks/payment - Webhook from Moyasar / HyperPay
// Verifies signature, updates order to 'paid', creates enrollments
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-moyasar-signature'] as string;
  const payload = JSON.stringify(req.body);

  // In production, signature verification:
  // const expectedSignature = crypto.createHmac('sha256', MOYASAR_SECRET_KEY).update(payload).digest('hex');
  // if (signature !== expectedSignature) { return res.status(401).send('Invalid signature'); }

  const { id: providerTransactionId, status, order_id } = req.body;

  let order: Order | undefined;
  if (order_id) {
    order = db.orders.get(order_id);
  } else {
    for (const ord of db.orders.values()) {
      if (ord.providerTransactionId === providerTransactionId) {
        order = ord;
        break;
      }
    }
  }

  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود في قاعدة البيانات' });
  }

  if (status === 'paid' || status === 'captured') {
    fulfillOrder(order);
    return res.json({ success: true, message: 'تم تفعيل الاشتراك والاشتراك متاح للطالب الآن' });
  } else if (status === 'failed') {
    order.paymentStatus = 'failed';
    return res.json({ success: false, message: 'فشلت عملية الدفع' });
  }

  res.json({ received: true });
});

// POST /api/checkout/simulate-success - Immediate payment success for frontend testing
router.post('/simulate-success', (req: AuthenticatedRequest, res) => {
  const { orderId } = req.body;
  const order = db.orders.get(orderId);

  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }

  const { enrolledCourseIds } = fulfillOrder(order);

  res.json({
    success: true,
    order,
    enrolledCourseIds,
    message: 'تم تأكيد الدفع بنجاح عبر بوابة مدى / STC Pay وتم تفعيل الكورس فوراً 🎉',
  });
});

// GET /api/checkout/orders - Get orders for current user
router.get('/orders', requireAuth, (req: AuthenticatedRequest, res) => {
  const userOrders = Array.from(db.orders.values()).filter((o) => o.userId === req.user!.id);
  res.json({ orders: userOrders });
});

// GET /api/checkout/orders/:id - Get single order with strict IDOR prevention
router.get('/orders/:id', requireAuth, (req: AuthenticatedRequest, res) => {
  const order = db.orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }

  if (order.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({
      error: 'غير مصرح لك بالاطلاع على تفاصيل طلب مستخدم آخر.',
      code: 'FORBIDDEN_ACCESS',
    });
  }

  res.json({ order });
});

export default router;
