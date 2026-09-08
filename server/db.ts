import crypto from 'crypto';
import { Course, Teacher, PackageBundle, SaudiGradeLevel, SaudiTrack, Lesson, Order, Enrollment, ExamAttempt, SupportTicket } from '../src/types';
import { COURSES, TEACHERS, PACKAGES } from '../src/data/mockData';

export interface DBUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'student' | 'teacher' | 'admin' | 'support';
  gradeLevel: SaudiGradeLevel;
  track: SaudiTrack;
  enrolledCourseIds: string[];
  points: number;
  createdAt: string;
}

export interface DBQuestion {
  id: number;
  courseId?: string;
  subjectId?: string;
  questionText: string;
  choices: string[];
  correctChoiceIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DBExam {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  isFinal: boolean;
  questionIds: number[];
}

export interface DBLessonCompletion {
  userId: string;
  lessonId: string;
  completedAt: string;
}

// Password hashing utilities using native Node.js crypto
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString('hex')): { hash: string; salt: string } {
  const hash = crypto.scryptSync(password, salt, 32).toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const check = crypto.scryptSync(password, salt, 32).toString('hex');
  return check === hash;
}

// In-Memory Database Store (Simulating PostgreSQL tables on Hostinger VPS)
class InMemoryDatabase {
  users: Map<string, DBUser> = new Map();
  teachers: Teacher[] = [];
  courses: Course[] = [];
  lessons: Map<string, Lesson> = new Map();
  packages: PackageBundle[] = [];
  packageCourses: { packageId: string; courseId: string }[] = [];
  orders: Map<string, Order> = new Map();
  enrollments: Map<string, Enrollment> = new Map();
  questions: Map<number, DBQuestion> = new Map();
  exams: Map<string, DBExam> = new Map();
  examAttempts: ExamAttempt[] = [];
  lessonCompletions: DBLessonCompletion[] = [];
  supportTickets: SupportTicket[] = [];
  tokens: Map<string, string> = new Map(); // token -> userId

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // 1. Seed Demo Admin & Student Users
    const studentPass = hashPassword('nohe2026!');
    const studentUser: DBUser = {
      id: 'usr_student_demo',
      fullName: 'عبدالله بن راشد الشمري',
      phone: '0558924110',
      email: 'student@noheacademy.sa',
      passwordHash: studentPass.hash,
      salt: studentPass.salt,
      role: 'student',
      gradeLevel: '3rd_secondary',
      track: 'computing_engineering',
      enrolledCourseIds: ['c1', 'c3'],
      points: 240,
      createdAt: new Date().toISOString(),
    };
    this.users.set(studentUser.id, studentUser);
    // Alias usr_demo_1 and abdullah@ to studentUser for client compatibility
    this.users.set('usr_demo_1', { ...studentUser, id: 'usr_demo_1' });

    const adminPass = hashPassword('admin2026!');
    const adminUser: DBUser = {
      id: 'usr_admin_demo',
      fullName: 'المدير الأكاديمي لمنصة نوح',
      phone: '0500000000',
      email: 'admin@noheacademy.sa',
      passwordHash: adminPass.hash,
      salt: adminPass.salt,
      role: 'admin',
      gradeLevel: '3rd_secondary',
      track: 'computing_engineering',
      enrolledCourseIds: ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'],
      points: 9999,
      createdAt: new Date().toISOString(),
    };
    this.users.set(adminUser.id, adminUser);

    // Pre-seed demo tokens
    this.tokens.set('demo_student_token', studentUser.id);
    this.tokens.set('demo_admin_token', adminUser.id);

    // 2. Seed Teachers & Courses from mockData
    this.teachers = [...TEACHERS];
    this.courses = [...COURSES];
    this.packages = [...PACKAGES];

    // Seed package courses
    this.packageCourses = [
      { packageId: 'pkg-c1', courseId: 'c1' },
      { packageId: 'pkg-c1', courseId: 'c2' },
      { packageId: 'pkg-c1', courseId: 'c3' },
      { packageId: 'pkg-c2', courseId: 'c3' },
      { packageId: 'pkg-c2', courseId: 'c4' },
      { packageId: 'pkg-combo-full', courseId: 'c1' },
      { packageId: 'pkg-combo-full', courseId: 'c2' },
      { packageId: 'pkg-combo-full', courseId: 'c3' },
      { packageId: 'pkg-combo-full', courseId: 'c4' },
      { packageId: 'pkg-combo-full', courseId: 'c5' },
      { packageId: 'pkg-combo-full', courseId: 'c6' },
    ];

    // 3. Seed Lessons for Courses with Cloudflare/Bunny video provider IDs
    this.courses.forEach((course) => {
      const lessonTitles = [
        `المحاضرة التأسيسية الأولى: مدخل ومفاهيم المنهج - ${course.subject}`,
        `المحاضرة 2: القوانين الذهبية والتطبيقات العملية`,
        `المحاضرة 3: نماذج اختبارات الوزارة وتكنيكات الحل السريع`,
        `المحاضرة 4: ورشة حل تدريبات بنك الأسئلة والمسارات`,
        `المحاضرة 5: مراجعة ليلة الامتحان والموجز النهائي`,
      ];

      lessonTitles.forEach((title, idx) => {
        const lessonId = `les_${course.id}_${idx + 1}`;
        const isPreview = idx === 0; // First lesson is preview
        const lesson: Lesson = {
          id: lessonId,
          courseId: course.id,
          title,
          orderIndex: idx + 1,
          videoProviderId: `stream_asset_${course.id}_${idx + 1}`,
          durationSeconds: 2400 + idx * 300,
          isPreview,
          attachmentUrls: [
            {
              title: `مذكرة الشرح والتدريبات (PDF) - ${title}`,
              url: `https://storage.noheacademy.sa/notes/${course.id}_les_${idx + 1}.pdf`,
              size: '4.8 MB',
            },
            {
              title: `ملف حلول المسائل ونماذج الإجابة النموذجية`,
              url: `https://storage.noheacademy.sa/solutions/${course.id}_solutions_${idx + 1}.pdf`,
              size: '2.1 MB',
            },
          ],
        };
        this.lessons.set(lessonId, lesson);
      });
    });

    // 4. Seed Enrollments for Demo Student
    this.enrollments.set('enr_1', {
      id: 'enr_1',
      userId: studentUser.id,
      courseId: 'c1',
      enrolledAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      expiresAt: null,
    });
    this.enrollments.set('enr_2', {
      id: 'enr_2',
      userId: studentUser.id,
      courseId: 'c3',
      enrolledAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      expiresAt: null,
    });

    // Mark 2 lessons completed
    this.lessonCompletions.push({
      userId: studentUser.id,
      lessonId: 'les_c1_1',
      completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    });
    this.lessonCompletions.push({
      userId: studentUser.id,
      lessonId: 'les_c3_1',
      completedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    });

    // 5. Seed Questions Bank
    const qList: DBQuestion[] = [
      {
        id: 1,
        courseId: 'c1',
        questionText: 'في شبكات الحاسب، ما هو البروتوكول المسؤول عن نقل البيانات بشكل موثوق وخالٍ من الأخطاء في طبقة النقل (Transport Layer)؟',
        choices: ['UDP', 'TCP', 'IP', 'DNS'],
        correctChoiceIndex: 1,
        explanation: 'بروتوكول TCP يعتمد أسلوب المصافحة الثلاثية (Three-way handshake) لضمان وصول كافة حزم البيانات بالترتيب وخالية من الأخطاء.',
        difficulty: 'medium',
      },
      {
        id: 2,
        courseId: 'c1',
        questionText: 'أي من هياكل البيانات التالية يعمل وفق مبدأ "الداخل أولاً يخرج أولاً" (FIFO)؟',
        choices: ['المكدس (Stack)', 'الطابور (Queue)', 'شجرة البحث الثنائية', 'الرسم البياني (Graph)'],
        correctChoiceIndex: 1,
        explanation: 'الطابور (Queue) يعمل بمبدأ First-In First-Out، بينما المكدس (Stack) يعمل بمبدأ LIFO.',
        difficulty: 'easy',
      },
      {
        id: 3,
        courseId: 'c2',
        questionText: 'ما إعراب كلمة "طالباً" في جملة: "حضر عشرون طالباً إلى منصة نوح التعليمية"؟',
        choices: ['مفعول به منصوب', 'تمييز ملفوظ منصوب بالفتحة', 'حال منصوب بالفتحة', 'مضاف إليه مجرور'],
        correctChoiceIndex: 1,
        explanation: 'الاسم النكرة المنصوب الواقع بعد ألفاظ العقود (من 20 إلى 90) يُعرب تمييزاً ملفوظاً منصوباً.',
        difficulty: 'easy',
      },
      {
        id: 4,
        courseId: 'c3',
        questionText: 'ما هي نهاية الدالة f(x) = (x² - 9) / (x - 3) عندما تقترب x من القيمة 3؟',
        choices: ['0', '3', '6', 'غير معرّفة'],
        correctChoiceIndex: 2,
        explanation: 'بتحليل البسط كفرق بين مربعين: (x - 3)(x + 3) / (x - 3) = (x + 3)، وعند التعويض عن x=3 نحصل على 6.',
        difficulty: 'medium',
      },
      {
        id: 5,
        courseId: 'c4',
        questionText: 'وحدة قياس المجال الكهربائي في النظام الدولي للوحدات (SI) هي:',
        choices: ['فولت (V)', 'نيوتن / كولوم (N/C)', 'تسلا (T)', 'جول (J)'],
        correctChoiceIndex: 1,
        explanation: 'المجال الكهربائي يساوي القوة المؤثرة على شحنة اختبار (E = F / q)، بالتالي وحدته نيوتن لكل كولوم (N/C) أو فولت لكل متر (V/m).',
        difficulty: 'medium',
      },
      {
        id: 6,
        courseId: 'c1',
        questionText: 'ما هو الهدف الأساسي من خوارزمية التعلم الآلي "الانحدار الخطي" (Linear Regression)؟',
        choices: ['تصنيف الصور إلى فئات غير رقمية', 'التنبؤ بقيمة رقمية مستمرة بناءً على متغيرات مستقلة', 'تشفير كلمات المرور', 'ضغط الملفات الصوتية'],
        correctChoiceIndex: 1,
        explanation: 'الانحدار الخطي يُستخدم للتنبؤ بالقيم العددية المستمرة (Continuous Values) مثل التنبؤ بالدرجات أو الأسعار.',
        difficulty: 'medium',
      },
    ];

    qList.forEach((q) => this.questions.set(q.id, q));

    // 6. Seed Exams
    this.exams.set('exam-1', {
      id: 'exam-1',
      courseId: 'c1',
      title: 'اختبار تجريبي شامل: الذكاء الاصطناعي وهندسة البرمجيات (مسار الحوسبة)',
      durationMinutes: 20,
      isFinal: false,
      questionIds: [1, 2, 6],
    });

    this.exams.set('exam-2', {
      id: 'exam-2',
      courseId: 'c3',
      title: 'اختبار التفاضل والتكامل السريع - مراجعة المنتصف',
      durationMinutes: 15,
      isFinal: false,
      questionIds: [4],
    });

    this.exams.set('exam-all', {
      id: 'exam-all',
      courseId: 'c1',
      title: 'اختبار محاكاة اختبارات الوزارة والقدرات التخصصية',
      durationMinutes: 25,
      isFinal: true,
      questionIds: [1, 2, 3, 4, 5, 6],
    });

    // 7. Seed Sample Orders
    this.orders.set('ord_demo_1', {
      id: 'ord_demo_1',
      userId: studentUser.id,
      userName: studentUser.fullName,
      itemType: 'course',
      itemId: 'c1',
      itemTitle: 'البرمجة والذكاء الاصطناعي المتقدم',
      amount: 176,
      paymentProvider: 'moyasar',
      paymentMethod: 'mada',
      paymentStatus: 'paid',
      providerTransactionId: 'moy_trx_8921473210',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    });

    this.orders.set('ord_demo_2', {
      id: 'ord_demo_2',
      userId: studentUser.id,
      userName: studentUser.fullName,
      itemType: 'course',
      itemId: 'c3',
      itemTitle: 'الرياضيات المتقدمة 3 (التفاضل والتكامل)',
      amount: 199,
      paymentProvider: 'moyasar',
      paymentMethod: 'apple_pay',
      paymentStatus: 'paid',
      providerTransactionId: 'moy_trx_8921473999',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    });

    // 8. Seed Support Tickets
    this.supportTickets.push({
      id: 'tkt_1',
      userId: studentUser.id,
      userName: studentUser.fullName,
      userPhone: studentUser.phone,
      channel: 'whatsapp',
      message: 'السلام عليكم، هل مذكرات مسار الحوسبة والهندسة شاملة ملخصات الوزارة لعام 1447؟',
      status: 'answered',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    });

    this.supportTickets.push({
      id: 'tkt_2',
      channel: 'telegram',
      userName: 'سارة العتيبي',
      userPhone: '0567789012',
      message: 'استفسار عن موعد انطلاق حصص المراجعة النهائية لكورس الكيمياء 3.',
      status: 'open',
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    });
  }
}

export const db = new InMemoryDatabase();
