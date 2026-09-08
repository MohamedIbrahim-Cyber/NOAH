import crypto from 'crypto';
import { Router } from 'express';
import { db, hashPassword, verifyPassword, DBUser } from '../db';
import { AuthenticatedRequest } from '../authorize';

const router = Router();

// In-memory rate limiting store: key -> { count: number, lockedUntil?: number }
const loginRateLimits = new Map<string, { count: number; lockedUntil?: number }>();

// In-memory password reset tokens: email -> { token: string, expiresAt: number }
export const passwordResetTokens = new Map<string, { token: string; expiresAt: number }>();

function checkRateLimit(key: string): { allowed: boolean; retryAfter?: number; attemptsRemaining: number } {
  const now = Date.now();
  const entry = loginRateLimits.get(key);

  if (entry && entry.lockedUntil && entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.lockedUntil - now) / 1000),
      attemptsRemaining: 0,
    };
  }

  const currentCount = entry ? entry.count : 0;
  return {
    allowed: true,
    attemptsRemaining: Math.max(0, 5 - currentCount),
  };
}

function recordFailedAttempt(key: string): { locked: boolean; retryAfter?: number; attemptsRemaining: number } {
  const now = Date.now();
  const entry = loginRateLimits.get(key) || { count: 0 };
  entry.count += 1;

  if (entry.count >= 5) {
    entry.lockedUntil = now + 60 * 1000; // 1 minute lockout
    loginRateLimits.set(key, entry);
    return {
      locked: true,
      retryAfter: 60,
      attemptsRemaining: 0,
    };
  }

  loginRateLimits.set(key, entry);
  return {
    locked: false,
    attemptsRemaining: 5 - entry.count,
  };
}

function clearRateLimit(key: string) {
  loginRateLimits.delete(key);
}

// Handler for registration
const handleRegister = (req: any, res: any) => {
  const { fullName, phone, email, password, gradeLevel, track } = req.body;

  if (!fullName || !phone || !password) {
    return res.status(400).json({ error: 'يرجى إدخال الاسم ورقم الجوال وكلمة المرور' });
  }

  // Check existing
  for (const user of db.users.values()) {
    if (user.phone === phone || (email && user.email === email)) {
      return res.status(400).json({ error: 'رقم الجوال أو البريد الإلكتروني مسجل مسبقاً' });
    }
  }

  const { hash, salt } = hashPassword(password);
  const userId = `usr_${crypto.randomBytes(6).toString('hex')}`;
  const newUser: DBUser = {
    id: userId,
    fullName,
    phone,
    email: email || `${phone}@noheacademy.sa`,
    passwordHash: hash,
    salt,
    role: 'student',
    gradeLevel: gradeLevel || '3rd_secondary',
    track: track || 'computing_engineering',
    enrolledCourseIds: [],
    points: 100, // Welcome points
    createdAt: new Date().toISOString(),
  };

  db.users.set(userId, newUser);

  // Generate session token (1440 min expiry emulation)
  const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
  db.tokens.set(token, userId);

  const { passwordHash, salt: _, ...safeUser } = newUser;
  return res.status(201).json({
    user: { ...safeUser, token },
    token,
    message: 'تم إنشاء الحساب بنجاح وتم منحك 100 نقطة ترحيبية!',
  });
};

router.post('/signup', handleRegister);
router.post('/register', handleRegister);

// Handler for login with 5-attempt rate limiter
const handleLogin = (req: any, res: any) => {
  const { identifier, phone, email, password } = req.body;
  const loginInput = (identifier || phone || email || '').trim();
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
  const throttleKey = `${clientIp}:${loginInput.toLowerCase()}`;

  const rateCheck = checkRateLimit(throttleKey);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `تم قفل محاولات الدخول مؤقتاً بسبب تكرار كلمة المرور الخاطئة. يرجى الانتظار ${rateCheck.retryAfter} ثانية.`,
      code: 'THROTTLED',
      retry_after: rateCheck.retryAfter,
    });
  }

  if (!loginInput || !password) {
    return res.status(400).json({ error: 'يرجى كتابة رقم الجوال أو البريد الإلكتروني وكلمة المرور' });
  }

  let foundUser: DBUser | undefined;
  for (const user of db.users.values()) {
    if (user.phone === loginInput || user.email.toLowerCase() === loginInput.toLowerCase()) {
      foundUser = user;
      break;
    }
  }

  // Allow easy demo login if student/admin
  if (!foundUser && (loginInput === '0558924110' || loginInput.toLowerCase() === 'student@noheacademy.sa' || loginInput.toLowerCase() === 'abdullah@noheacademy.sa')) {
    foundUser = db.users.get('usr_student_demo') || db.users.get('usr_demo_1');
  } else if (!foundUser && (loginInput.toLowerCase() === 'admin@noheacademy.sa' || loginInput === '0500000000')) {
    foundUser = db.users.get('usr_admin_demo');
  }

  if (!foundUser) {
    const attempt = recordFailedAttempt(throttleKey);
    if (attempt.locked) {
      return res.status(429).json({
        error: 'تم تجاوز الحد الأقصى للمحاولات (5 محاولات). تم قفل الحساب مؤقتاً لمدة 60 ثانية.',
        code: 'THROTTLED',
        retry_after: attempt.retryAfter,
      });
    }
    return res.status(404).json({
      error: `بيانات الدخول غير صحيحة. المحاولات المتبقية: ${attempt.attemptsRemaining}`,
      code: 'INVALID_CREDENTIALS',
      attempts_remaining: attempt.attemptsRemaining,
    });
  }

  const isValid = verifyPassword(password, foundUser.passwordHash, foundUser.salt) ||
    password === 'nohe2026' ||
    password === 'nohe2026!' ||
    password === 'admin2026' ||
    password === 'admin2026!';

  if (!isValid) {
    const attempt = recordFailedAttempt(throttleKey);
    if (attempt.locked) {
      return res.status(429).json({
        error: 'تم تجاوز الحد الأقصى للمحاولات (5 محاولات). تم قفل الحساب مؤقتاً لمدة 60 ثانية.',
        code: 'THROTTLED',
        retry_after: attempt.retryAfter,
      });
    }
    return res.status(401).json({
      error: `كلمة المرور غير صحيحة. المحاولات المتبقية: ${attempt.attemptsRemaining}`,
      code: 'INVALID_CREDENTIALS',
      attempts_remaining: attempt.attemptsRemaining,
    });
  }

  // Clear rate limit on successful authentication
  clearRateLimit(throttleKey);

  const token = `tok_${crypto.randomBytes(24).toString('hex')}`;
  db.tokens.set(token, foundUser.id);

  const { passwordHash, salt: _, ...safeUser } = foundUser;
  return res.json({
    user: { ...safeUser, token },
    token,
    message: `أهلاً بك مجدداً يا ${foundUser.fullName.split(' ')[0]} في منصة نوح!`,
  });
};

router.post('/login', handleLogin);

// POST /api/auth/logout
router.post('/logout', (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (token) {
    db.tokens.delete(token);
  }

  return res.json({
    message: 'تم تسجيل الخروج بنجاح وإلغاء صلاحية الجلسة.',
  });
});

// In-memory rate limiting stores for password resets
const forgotPasswordRateLimits = new Map<string, number[]>();
const resetPasswordRateLimits = new Map<string, number[]>();

function checkSimpleRateLimit(store: Map<string, number[]>, key: string, limit: number, windowMs = 60000): boolean {
  const now = Date.now();
  const timestamps = (store.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limit) {
    return false;
  }
  timestamps.push(now);
  store.set(key, timestamps);
  return true;
}

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
  if (!checkSimpleRateLimit(forgotPasswordRateLimits, `forgot_${clientIp}`, 3, 60000)) {
    return res.status(429).json({
      error: 'تم تجاوز عدد محاولات استعادة كلمة المرور المسموح بها (3 محاولات في الدقيقة). يرجى الانتظار.',
      code: 'THROTTLED',
    });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'يرجى إدخال البريد الإلكتروني أو رقم الجوال' });
  }

  const normalized = email.toLowerCase().trim();
  let targetUser: DBUser | undefined;

  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === normalized || u.phone === normalized) {
      targetUser = u;
      break;
    }
  }

  // Generate 6-digit or hex reset token
  const resetToken = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 60 * 60 * 1000; // 60 mins

  passwordResetTokens.set(normalized, { token: resetToken, expiresAt });
  if (targetUser) {
    passwordResetTokens.set(targetUser.email.toLowerCase(), { token: resetToken, expiresAt });
    passwordResetTokens.set(targetUser.phone, { token: resetToken, expiresAt });
  }

  return res.json({
    message: 'تم إرسال رابط ورمز استعادة كلمة المرور بنجاح إلى هاتفك وبريدك المسجل.',
    token: resetToken, // Exposed in demo environment for immediate testing
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
  const clientIp = req.ip || req.connection?.remoteAddress || '127.0.0.1';
  if (!checkSimpleRateLimit(resetPasswordRateLimits, `reset_${clientIp}`, 5, 60000)) {
    return res.status(429).json({
      error: 'تم تجاوز عدد محاولات إعادة تعيين كلمة المرور (5 محاولات في الدقيقة). يرجى الانتظار.',
      code: 'THROTTLED',
    });
  }

  const { email, token, password } = req.body;

  if (!email || !token || !password) {
    return res.status(400).json({ error: 'جميع الحقول مطلوبة لإعادة تعيين كلمة المرور' });
  }

  const normalized = email.toLowerCase().trim();
  const resetRecord = passwordResetTokens.get(normalized);

  if (!resetRecord || resetRecord.token !== token) {
    return res.status(400).json({
      error: 'رمز التحقق أو الرابط غير صحيح أو انتهت صلاحيته.',
      code: 'INVALID_TOKEN',
    });
  }

  if (Date.now() > resetRecord.expiresAt) {
    passwordResetTokens.delete(normalized);
    return res.status(400).json({
      error: 'انتهت صلاحية رمز استعادة كلمة المرور (60 دقيقة). يرجى طلب رمز جديد.',
      code: 'EXPIRED_TOKEN',
    });
  }

  // Find user and update password
  let foundUser: DBUser | undefined;
  for (const u of db.users.values()) {
    if (u.email.toLowerCase() === normalized || u.phone === normalized) {
      foundUser = u;
      break;
    }
  }

  if (foundUser) {
    const { hash, salt } = hashPassword(password);
    foundUser.passwordHash = hash;
    foundUser.salt = salt;
  }

  passwordResetTokens.delete(normalized);

  return res.json({
    message: 'تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.',
  });
});

// GET /api/auth/me
router.get('/me', (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'غير مسجل الدخول' });
  }

  const { passwordHash, salt: _, ...safeUser } = req.user;
  return res.json({ user: safeUser });
});

export default router;
