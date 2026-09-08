export type BrandTheme = 'warm-earth' | 'dark';

export type SaudiGradeLevel = '1st_secondary' | '2nd_secondary' | '3rd_secondary';

export type SaudiTrack = 
  | 'shared_year' 
  | 'natural_sciences' 
  | 'computing_engineering' 
  | 'business_admin' 
  | 'sharia_islamic_studies';

export interface Course {
  id: string;
  title: string;
  shortTitle: string;
  level: string; // e.g., "الصف الثالث الثانوي"
  track: string; // e.g., "مسار الحوسبة والهندسة"
  gradeKey: SaudiGradeLevel;
  trackKey: SaudiTrack;
  subject: string; // "البرمجة والذكاء الاصطناعي", "اللغة العربية", "الرياضيات", "الفيزياء"
  teacher: {
    name: string;
    role: string;
    avatar: string;
  };
  price: number;
  originalPrice?: number;
  startDate: string;
  startTime: string;
  description: string;
  lecturesCount: number;
  bannerTheme: 'red-hex' | 'green-hex' | 'gold-hex' | 'navy-bookshelf';
  starburstBadge?: string;
  previewVideoId?: string;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  bunnyStreamUrl?: string;
  tags: string[];
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  subject: string;
  gradeLevels: string[];
  bannerGradient: string;
  avatarBg: string;
  photoUrl?: string;
  experienceYears: number;
  studentsCount: string;
}

export interface PackageBundle {
  id: string;
  title: string;
  type: 'term' | 'full_year' | 'combo';
  badge: string;
  tag1?: string;
  tag2?: string;
  price: number;
  originalPrice: number;
  savingsBadge?: string;
  description: string;
  checklist: string[];
  includedUnits?: string[];
  instructors?: string[];
  bannerType: 'bundle' | 'combo';
}

export interface Question {
  id: number;
  text: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface Exam {
  id: string;
  courseTitle: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 20 for 20% or 50 for 50 SAR
  scope: 'all' | 'course' | 'bundle';
  targetId?: string; // specific courseId or bundleId
  targetTitle?: string;
  teacherId?: string; // owner teacher
  teacherName?: string;
  usageCount: number;
  maxUses?: number;
  expiresAt: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'teacher' | 'assistant';
  subject?: string;
  assignedTeacherId?: string; // For assistants: only works for this teacher
  assignedTeacherName?: string;
  coursesCount: number;
  totalStudents?: number;
  totalRevenue?: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface StudentUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role?: 'student' | 'teacher' | 'assistant' | 'admin' | 'support';
  assignedTeacherId?: string;
  assignedTeacherName?: string;
  gradeLevel: SaudiGradeLevel;
  track: SaudiTrack;
  enrolledCourseIds: string[];
  points: number;
  token?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  videoProviderId: string;
  durationSeconds: number;
  isPreview: boolean;
  attachmentUrls: {
    title: string;
    url: string;
    size: string;
  }[];
  completed?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  itemType: 'course' | 'package';
  itemId: string;
  itemTitle: string;
  amount: number;
  paymentProvider: 'moyasar' | 'hyperpay';
  paymentMethod: 'mada' | 'stc_pay' | 'sarie' | 'card' | 'apple_pay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  providerTransactionId: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  expiresAt?: string | null;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  userId: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  answers: Record<number, number>;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  channel: 'whatsapp' | 'telegram' | 'in_app';
  userName?: string;
  userPhone?: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
}

export interface SignedVideoToken {
  lessonId: string;
  videoProviderId: string;
  signedUrl: string;
  expiresAt: number;
  watermarkText: string;
}

export interface AdminOverview {
  totalRevenue: number;
  paidOrdersCount: number;
  totalStudents: number;
  activeEnrollmentsCount: number;
  recentOrders: Order[];
  openTicketsCount: number;
}
