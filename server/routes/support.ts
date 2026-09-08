import crypto from 'crypto';
import { Router } from 'express';
import { db } from '../db';
import { AuthenticatedRequest } from '../authorize';
import { SupportTicket } from '../../src/types';

const router = Router();

// POST /api/support/tickets - Submit ticket/inquiry
router.post('/tickets', (req: AuthenticatedRequest, res) => {
  const { message, channel, userName, userPhone } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'يرجى كتابة نص الرسالة أو الاستفسار' });
  }

  const ticketId = `tkt_${crypto.randomBytes(6).toString('hex')}`;
  const newTicket: SupportTicket = {
    id: ticketId,
    userId: req.user ? req.user.id : undefined,
    channel: channel || 'in_app',
    userName: req.user ? req.user.fullName : (userName || 'طالب أو زائر'),
    userPhone: req.user ? req.user.phone : userPhone,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  db.supportTickets.unshift(newTicket);

  res.status(201).json({
    success: true,
    ticketId,
    message: 'تم استلام استفسارك بنجاح وسيتواصل معك مشرف الدعم الأكاديمي قريباً.',
  });
});

export default router;
