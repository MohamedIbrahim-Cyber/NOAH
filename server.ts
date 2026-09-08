import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authenticateToken } from './server/authorize';
import authRoutes from './server/routes/auth';
import coursesRoutes from './server/routes/courses';
import checkoutRoutes from './server/routes/checkout';
import examsRoutes from './server/routes/exams';
import dashboardRoutes from './server/routes/dashboard';
import adminRoutes from './server/routes/admin';
import supportRoutes from './server/routes/support';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(authenticateToken);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Nohe Academy Backend (Saudi High School EdTech)',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  });

  // API Routes Mounts
  app.use('/api/auth', authRoutes);
  app.use('/api', authRoutes); // for direct /api/login, /api/register, /api/logout, /api/forgot-password, /api/reset-password
  app.use('/api/courses', coursesRoutes);
  app.use('/api', coursesRoutes); // for /api/lessons/:id/video-token & complete
  app.use('/api/checkout', checkoutRoutes);
  app.use('/api/webhooks', checkoutRoutes); // for /api/webhooks/webhook
  app.use('/api/exams', examsRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/support', supportRoutes);

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Nohe Academy] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
