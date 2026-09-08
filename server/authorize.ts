import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db, DBUser } from './db';
import { Lesson, SignedVideoToken } from '../src/types';

// Extended Express request type with user session
export interface AuthenticatedRequest extends Request {
  user?: DBUser;
}

const STREAM_SIGNING_SECRET = process.env.STREAM_SIGNING_SECRET || 'nohe_stream_secret_2026_saudi';

/**
 * Reads token from Authorization header or cookies, and attaches the user to req.user
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7)
    : (req.headers['x-session-token'] as string);

  if (token) {
    const userId = db.tokens.get(token);
    if (userId) {
      const user = db.users.get(userId);
      if (user) {
        req.user = user;
      }
    }
  }

  next();
}

/**
 * Requires the user to be logged in
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      error: 'غير مصرح لك. يرجى تسجيل الدخول أولاً للوصول إلى هذا المحتوى.',
      code: 'AUTH_REQUIRED',
    });
  }
  next();
}

/**
 * Reusable middleware checking user role (e.g. 'admin')
 * Applied to all /api/admin/* endpoints
 */
export function requireRole(allowedRoles: ('admin' | 'teacher' | 'support' | 'student')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'يرجى تسجيل الدخول أولاً.',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'صلاحيات غير كافية للوصول إلى لوحة التحكم والإدارة.',
        code: 'FORBIDDEN_ROLE',
      });
    }

    next();
  };
}

/**
 * Checks enrollment for a given course
 */
export function isUserEnrolledInCourse(userId: string, courseId: string): boolean {
  const user = db.users.get(userId);
  if (!user) return false;
  if (user.role === 'admin') return true;

  // Direct check in enrolledCourseIds or enrollments table
  if (user.enrolledCourseIds.includes(courseId)) return true;

  for (const enrollment of db.enrollments.values()) {
    if (enrollment.userId === userId && enrollment.courseId === courseId) {
      if (!enrollment.expiresAt || new Date(enrollment.expiresAt) > new Date()) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Generates a signed, anti-piracy video token with dynamic watermarking
 * Overlays student's name and phone number on the stream to prevent screen recording resale
 */
export function generateSignedPlaybackToken(user: DBUser | null, lesson: Lesson): SignedVideoToken {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600 * 4; // 4 hours valid
  const studentInfo = user ? `${user.fullName} - ${user.phone}` : 'زائر منصة نوح التعليمية (معاينة تجريبية)';
  
  // Compute HMAC signature mimicking Bunny.net / Cloudflare Stream token signing
  const payloadToSign = `${lesson.videoProviderId}|${expiresAt}|${studentInfo}`;
  const signature = crypto.createHmac('sha256', STREAM_SIGNING_SECRET).update(payloadToSign).digest('hex');

  // Simulated signed video stream URL
  const signedUrl = `https://stream.noheacademy.sa/v1/${lesson.videoProviderId}/manifest.m3u8?token=${signature}&expires=${expiresAt}`;

  return {
    lessonId: lesson.id,
    videoProviderId: lesson.videoProviderId,
    signedUrl,
    expiresAt,
    watermarkText: studentInfo,
  };
}
