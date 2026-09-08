<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Exam;
use App\Models\Lesson;
use App\Models\Package;
use App\Models\Question;
use App\Models\Reward;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (Demo Student & Demo Admin)
        $admin = User::create([
            'full_name' => 'مشرف منصة نوح الأكاديمي',
            'email' => 'admin@noheacademy.sa',
            'phone' => '0550000000',
            'password' => Hash::make('admin2026!'),
            'role' => 'admin',
            'grade_level' => '3rd_secondary',
            'track' => 'computing_engineering',
        ]);

        $student = User::create([
            'full_name' => 'سارة الشمري',
            'email' => 'sara@noheacademy.sa',
            'phone' => '0558924110',
            'password' => Hash::make('nohe2026!'),
            'role' => 'student',
            'grade_level' => '3rd_secondary',
            'track' => 'computing_engineering',
        ]);

        Reward::create([
            'user_id' => $student->id,
            'points' => 380,
            'reason' => 'مكافأة التسجيل واجتياز التحديات الأسبوعية',
        ]);

        // 2. Seed Subjects
        $subjectsData = [
            'الرياضيات 3 (مسارات)',
            'الفيزياء 3 (مسارات)',
            'الكيمياء 2-2',
            'علم البيانات والذكاء الاصطناعي',
            'القدرات العامة (الكمي واللفظي)',
            'التحصيلي العلمي الشامل',
        ];

        $subjects = [];
        foreach ($subjectsData as $name) {
            $subjects[$name] = Subject::create(['name' => $name]);
        }

        // 3. Seed Teachers
        $teachersData = [
            [
                'display_name' => 'د. فهد القحطاني',
                'subject' => 'خبير الرياضيات والقدرات الكمية',
                'bio' => 'مؤلف سلسلة التميز ومدرّب معتمد لأكثر من 50 ألف طالب في اختبارات قياس ومسارات الثانوي.',
                'banner_color_theme' => 'fresh',
            ],
            [
                'display_name' => 'أ. نورة الحربي',
                'subject' => 'كبيرة معلمي علوم الحاسب والذكاء الاصطناعي',
                'bio' => 'ماجستير علوم حاسب، مشرفة ومطورة حقائب مسار الحوسبة والهندسة.',
                'banner_color_theme' => 'warm',
            ],
            [
                'display_name' => 'د. خالد الدوسري',
                'subject' => 'أستاذ الكيمياء والتحصيلي',
                'bio' => 'أكثر من 15 عاماً في تدريس كيمياء الثانوية العامة وتبسيط المفاهيم المعقدة.',
                'banner_color_theme' => 'fresh',
            ],
        ];

        $teachers = [];
        foreach ($teachersData as $t) {
            $teachers[] = Teacher::create($t);
        }

        // 4. Seed Courses
        $coursesData = [
            [
                'title' => 'المعسكر المكثف لاختبار التحصيلي العلمي 2026',
                'slug' => 'tahsili-scientific-intensive-2026',
                'teacher_id' => $teachers[0]->id,
                'subject_id' => $subjects['التحصيلي العلمي الشامل']->id,
                'grade_level' => '3rd_secondary',
                'track' => 'natural_sciences',
                'description' => 'تغطية متكاملة لجميع تجميعات وأسئلة التحصيلي في الرياضيات، الفيزياء، الكيمياء، والأحياء مع اختبارات محاكية وتكنيكات الحل في 60 ثانية.',
                'short_description' => 'دليلك لتحقيق +95 في اختبار التحصيلي العلمي مع شروحات بنك أسئلة قياس المعتمدة.',
                'price' => 399.00,
                'original_price' => 599.00,
                'start_date' => now()->addDays(3),
            ],
            [
                'title' => 'علم البيانات والذكاء الاصطناعي (مسار الحوسبة والهندسة)',
                'slug' => 'data-science-ai-computing-engineering',
                'teacher_id' => $teachers[1]->id,
                'subject_id' => $subjects['علم البيانات والذكاء الاصطناعي']->id,
                'grade_level' => '3rd_secondary',
                'track' => 'computing_engineering',
                'description' => 'شرح عملي ومبسط لمقرر علم البيانات الجديد: لغة بايثون، هياكل البيانات، تدريب نماذج تعلم الآلة ومشاريع التخرج الوزارية.',
                'short_description' => 'أتقن مفاهيم خوارزميات الذكاء الاصطناعي وبايثون وفق منهج وزارة التعليم المعتمد.',
                'price' => 299.00,
                'original_price' => 450.00,
                'start_date' => now()->addDays(5),
            ],
            [
                'title' => 'القدرات العامة: أسرار واستراتيجيات التقفيل 100%',
                'slug' => 'qudurat-masterclass-2026',
                'teacher_id' => $teachers[0]->id,
                'subject_id' => $subjects['القدرات العامة (الكمي واللفظي)']->id,
                'grade_level' => '2nd_secondary',
                'track' => 'shared_year',
                'description' => 'معسكر تأسيس وتدريب مكثف على نماذج المحوسب 120 نموذج الأخيرة، التناسب، الهندسة، الجبر، واستيعاب المقروء.',
                'short_description' => 'من الصفر إلى الدرجة الكاملة في القدرات العامة مع خرائط المفاهيم واختبارات قياس.',
                'price' => 349.00,
                'original_price' => 499.00,
                'start_date' => now()->addDays(2),
            ],
        ];

        $seededCourses = [];
        foreach ($coursesData as $c) {
            $course = Course::create($c);
            $seededCourses[] = $course;

            // Seed Lessons
            for ($i = 1; $i <= 5; $i++) {
                Lesson::create([
                    'course_id' => $course->id,
                    'title' => "المحاضرة {$i}: استراتيجيات الحل الذكي وتطبيقات المنهج الوزاري",
                    'order_index' => $i,
                    'video_provider_id' => "bunny_vid_{$course->id}_{$i}",
                    'duration_seconds' => 2700, // 45 minutes
                    'is_preview' => ($i === 1), // Lesson 1 is always free preview!
                    'attachment_urls' => [
                        "https://cdn.noheacademy.sa/notes/course-{$course->id}-lesson-{$i}.pdf",
                    ],
                ]);
            }

            // Seed Exam
            $exam = Exam::create([
                'course_id' => $course->id,
                'title' => "الاختبار الدوري الأول: تقييم المفاهيم الأساسية",
                'duration_minutes' => 20,
                'is_final' => false,
            ]);

            // Seed Questions
            $q1 = Question::create([
                'course_id' => $course->id,
                'subject_id' => $course->subject_id,
                'question_text' => 'في مسار الحوسبة والهندسة، أي مما يلي يُعتبر الهيكل الأساسي لتمثيل البيانات في بايثون ويقبل عناصر غير متجانسة وقابلة للتعديل؟',
                'choices' => ['القائمة (List)', 'الصف (Tuple)', 'المجموعة (Set)', 'السلسلة النصية (String)'],
                'correct_choice_index' => 0,
                'explanation' => 'القوائم (Lists) في بايثون هي هياكل بيانات متسلسلة، مرتبة، وتقبل عناصر من أنواع مختلفة وتسمح بالتعديل (Mutable).',
                'difficulty' => 'medium',
            ]);

            $q2 = Question::create([
                'course_id' => $course->id,
                'subject_id' => $course->subject_id,
                'question_text' => 'أي من البروتوكولات التالية يُستخدم لتأمين الاتصال ونقل البيانات المشفرة بين متصفح الطالب وخادم منصة نوح؟',
                'choices' => ['HTTP', 'HTTPS (SSL/TLS)', 'FTP', 'SMTP'],
                'correct_choice_index' => 1,
                'explanation' => 'بروتوكول HTTPS يعتمد على طبقة التشفير SSL/TLS لضمان سرية وسلامة البيانات ومنع اعتراضها.',
                'difficulty' => 'easy',
            ]);

            $exam->questions()->attach([
                $q1->id => ['order_index' => 1],
                $q2->id => ['order_index' => 2],
            ]);
        }

        // Enroll Student in first course
        Enrollment::create([
            'user_id' => $student->id,
            'course_id' => $seededCourses[1]->id, // Enrolled in Data Science & AI
            'enrolled_at' => now()->subDays(10),
            'expires_at' => null,
        ]);

        // Seed Packages
        $termPackage = Package::create([
            'title' => 'باقة الفصل الدراسي الشاملة (مسار الحوسبة والهندسة)',
            'type' => 'term',
            'description' => 'تشمل جميع مقررات المسار للفصل الدراسي الحالي بالإضافة إلى تدريبات التحصيلي وبنك أسئلة قياس.',
            'price' => 549.00,
            'original_price' => 850.00,
        ]);

        $termPackage->courses()->attach([$seededCourses[0]->id, $seededCourses[1]->id]);
    }
}
