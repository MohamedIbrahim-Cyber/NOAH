import { StudentUser, Course, Lesson, PackageBundle, SignedVideoToken, AdminOverview, Order, SupportTicket } from '../types';

const API_BASE = '/api';

// Retrieve session token from localStorage if present
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('nohe_auth_token');
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    localStorage.setItem('nohe_auth_token', token);
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem('nohe_auth_token');
  } catch {}
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'حدث خطأ في معالجة الطلب');
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    signup: async (payload: {
      fullName: string;
      phone: string;
      email?: string;
      password: string;
      gradeLevel: string;
      track: string;
    }) => {
      const data = await fetchWithAuth('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    login: async (payload: { identifier: string; password: string }) => {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.token) {
        setAuthToken(data.token);
      }
      return data;
    },

    me: async () => {
      return fetchWithAuth('/auth/me');
    },

    logout: async () => {
      try {
        await fetchWithAuth('/logout', { method: 'POST' });
      } catch {}
      clearAuthToken();
    },

    forgotPassword: async (email: string) => {
      return fetchWithAuth('/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },

    resetPassword: async (payload: { email: string; token: string; password: string }) => {
      return fetchWithAuth('/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Courses & Lessons
  courses: {
    list: async (grade?: string, track?: string) => {
      const params = new URLSearchParams();
      if (grade && grade !== 'all') params.set('grade', grade);
      if (track && track !== 'all') params.set('track', track);
      return fetchWithAuth(`/courses?${params.toString()}`);
    },

    get: async (id: string) => {
      return fetchWithAuth(`/courses/${id}`);
    },

    getLessons: async (courseId: string) => {
      return fetchWithAuth(`/courses/${courseId}/lessons`);
    },

    getVideoToken: async (lessonId: string): Promise<{
      success: boolean;
      token: SignedVideoToken;
      lesson: Lesson;
      isPreview: boolean;
    }> => {
      return fetchWithAuth(`/lessons/${lessonId}/video-token`);
    },

    markLessonComplete: async (lessonId: string) => {
      return fetchWithAuth(`/lessons/${lessonId}/complete`, { method: 'POST' });
    },
  },

  // Payments & Checkout
  checkout: {
    createSession: async (payload: {
      itemType: 'course' | 'package';
      itemId: string;
      paymentMethod: string;
      couponCode?: string;
    }) => {
      return fetchWithAuth('/checkout/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    simulateSuccess: async (orderId: string) => {
      return fetchWithAuth('/checkout/simulate-success', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
      });
    },

    myOrders: async () => {
      return fetchWithAuth('/checkout/orders');
    },
  },

  // Exams
  exams: {
    list: async () => {
      return fetchWithAuth('/exams');
    },

    get: async (examId: string) => {
      return fetchWithAuth(`/exams/${examId}`);
    },

    submit: async (examId: string, answers: Record<number, number>) => {
      return fetchWithAuth(`/exams/${examId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers }),
      });
    },
  },

  // Student Dashboard Progress
  dashboard: {
    getProgress: async () => {
      return fetchWithAuth('/dashboard/progress');
    },
  },

  // Support
  support: {
    submitTicket: async (payload: {
      message: string;
      channel: 'whatsapp' | 'telegram' | 'in_app';
      userName?: string;
      userPhone?: string;
    }) => {
      return fetchWithAuth('/support/tickets', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // Admin Portal
  admin: {
    getOverview: async (): Promise<AdminOverview> => {
      return fetchWithAuth('/admin/overview');
    },

    getOrders: async () => {
      return fetchWithAuth('/admin/orders');
    },

    createCourse: async (courseData: Partial<Course> & { teacherName?: string }) => {
      return fetchWithAuth('/admin/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
      });
    },

    addLesson: async (lessonData: {
      courseId: string;
      title: string;
      videoProviderId?: string;
      durationSeconds?: number;
      isPreview?: boolean;
      attachmentTitle?: string;
      attachmentUrl?: string;
    }) => {
      return fetchWithAuth('/admin/lessons', {
        method: 'POST',
        body: JSON.stringify(lessonData),
      });
    },

    getTickets: async () => {
      return fetchWithAuth('/admin/tickets');
    },

    updateTicket: async (ticketId: string, status: 'open' | 'answered' | 'closed') => {
      return fetchWithAuth(`/admin/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
  },
};
