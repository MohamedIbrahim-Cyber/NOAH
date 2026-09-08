import React, { useState, useEffect } from 'react';
import { BrandTheme, StudentUser, Course, PackageBundle, SaudiGradeLevel } from './types';
import { COURSES, TEACHERS, PACKAGES, COMBO_PACKAGE } from './data/mockData';
import { AnnouncementBar, Navbar } from './components/Navbar';
import { FloatingSocialSidebar } from './components/FloatingSocialSidebar';
import { HeroSection } from './components/HeroSection';
import { FeaturedCoursesSection } from './components/FeaturedCoursesSection';
import { TeachersSection } from './components/TeachersSection';
import { FeaturesGrids } from './components/FeaturesGrids';
import { PackagesSection } from './components/PackagesSection';
import { FooterAndCta } from './components/FooterAndCta';
import { api, setAuthToken, clearAuthToken } from './lib/api';

// Dedicated Full-Page Components
import CoursesCatalogPage from './pages/courses/page';
import CourseDetailPage from './pages/course-detail/page';
import AdminDashboardPage from './pages/admin/page';
import StudentProfilePage from './pages/profile/page';
import CheckoutPage from './pages/checkout/page';

// Interactive Modals
import { AuthModal } from './components/AuthModal';
import { CourseDetailModal } from './components/CourseDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ExamModal } from './components/ExamModal';
import { StudentDashboardModal } from './components/StudentDashboardModal';
import { WatchLessonModal } from './components/WatchLessonModal';
import { AdminModal } from './components/AdminModal';

type PageRoute =
  | { type: 'home' }
  | { type: 'courses' }
  | { type: 'course-detail'; course: Course }
  | { type: 'admin' }
  | { type: 'profile' }
  | { type: 'checkout'; cartItems?: Course[] };

export default function App() {
  // Theme state: defaults to 'warm-earth' (أرضي) as requested
  const [currentTheme, setCurrentTheme] = useState<BrandTheme>('warm-earth');

  // Active Top-Level Page Route
  const [currentRoute, setCurrentRoute] = useState<PageRoute>({ type: 'home' });

  // Authentication & Current Student User
  const [currentUser, setCurrentUser] = useState<StudentUser | null>({
    id: 'usr_demo_1',
    fullName: 'عبدالله بن راشد الشمري',
    phone: '0558924110',
    email: 'abdullah@noheacademy.sa',
    gradeLevel: '3rd_secondary',
    track: 'computing_engineering',
    enrolledCourseIds: ['c1', 'c2', 'c3'],
    points: 480,
    role: 'admin', // enables admin portal demo
  });

  // Modal visibility states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [itemForCheckout, setItemForCheckout] = useState<Course | PackageBundle | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [watchingLesson, setWatchingLesson] = useState<{ lessonId: string; courseId: string } | null>(null);

  // Cart items state for checkout
  const [cartItems, setCartItems] = useState<Course[]>([COURSES[0]]);

  // Grade filter state for course section
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<SaudiGradeLevel | 'all'>('all');

  // Sync data-theme attribute on document root and initialize token if demo user is loaded
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (currentUser && !localStorage.getItem('nohe_auth_token')) {
      setAuthToken('demo_student_token');
    }
  }, [currentUser]);

  const handleToggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'warm-earth' : 'dark'));
  };

  const handleSelectTheme = (theme: BrandTheme) => {
    setCurrentTheme(theme);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleOpenSignup = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {}
    clearAuthToken();
    setCurrentUser(null);
    setIsDashboardOpen(false);
    setCurrentRoute({ type: 'home' });
  };

  const handleCourseSelect = (course: Course) => {
    setCurrentRoute({ type: 'course-detail', course });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = (item: Course | PackageBundle) => {
    if ('lecturesCount' in item) {
      setCartItems([item]);
      setCurrentRoute({ type: 'checkout', cartItems: [item] });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setItemForCheckout(item);
    }
  };

  const handleAddToCart = (course: Course) => {
    setCartItems((prev) => {
      if (prev.some((c) => c.id === course.id)) return prev;
      return [...prev, course];
    });
  };

  const handlePaymentComplete = (enrolledIds: string[]) => {
    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          enrolledCourseIds: [...new Set([...prev.enrolledCourseIds, ...enrolledIds])],
          points: prev.points + 100,
        };
      });
    }
  };

  const handleCompleteExam = (score: number, total: number) => {
    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: prev.points + score * 15,
        };
      });
    }
  };

  const scrollToCourses = () => {
    if (currentRoute.type !== 'home') {
      setCurrentRoute({ type: 'courses' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById('courses-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigatePage = (page: string, params?: any) => {
    if (page === 'home') setCurrentRoute({ type: 'home' });
    else if (page === 'courses') setCurrentRoute({ type: 'courses' });
    else if (page === 'admin') setCurrentRoute({ type: 'admin' });
    else if (page === 'profile') setCurrentRoute({ type: 'profile' });
    else if (page === 'checkout') setCurrentRoute({ type: 'checkout', cartItems });
    else if (page === 'course-detail' && params?.course) {
      setCurrentRoute({ type: 'course-detail', course: params.course });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen relative flex flex-col selection:bg-amber-300 selection:text-neutral-900 transition-colors duration-300"
      data-theme={currentTheme}
      dir="rtl"
    >
      {/* Top Announcement Bar (hidden on admin route) */}
      {currentRoute.type !== 'admin' && <AnnouncementBar currentTheme={currentTheme} />}

      {/* Floating Vertical Social & Support Sidebar (Fixed on right edge, hidden on admin route) */}
      {currentRoute.type !== 'admin' && <FloatingSocialSidebar currentTheme={currentTheme} />}

      {/* Sticky Pill Navbar (hidden on admin route to give clean dedicated admin top bar) */}
      {currentRoute.type !== 'admin' && (
        <Navbar
          currentTheme={currentTheme}
          onToggleTheme={handleToggleTheme}
          onChangeTheme={handleSelectTheme}
          currentUser={currentUser}
          onOpenLogin={handleOpenLogin}
          onOpenSignup={handleOpenSignup}
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setIsAuthModalOpen(true);
          }}
          onOpenDashboard={() => handleNavigatePage('profile')}
          onOpenExam={() => setIsExamModalOpen(true)}
          onOpenAdmin={() => handleNavigatePage('admin')}
          currentPage={currentRoute.type}
          onNavigatePage={handleNavigatePage}
          onLogout={handleLogout}
          cartCount={cartItems.length}
          onNavigateSection={(sectionId) => {
            if (currentRoute.type !== 'home') {
              setCurrentRoute({ type: 'home' });
              setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            } else {
              const el = document.getElementById(sectionId);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      )}

      {/* ===================== PAGE ROUTING RENDER ===================== */}
      <main className="flex-grow">
        {/* Page 1: Dedicated Courses Catalog Page */}
        {currentRoute.type === 'courses' && (
          <CoursesCatalogPage
            currentTheme={currentTheme}
            currentUser={currentUser}
            onSelectCourse={(course) => handleCourseSelect(course)}
            onEnroll={(course) => handleCheckout(course)}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Page 2: Dedicated Course Detail Page */}
        {currentRoute.type === 'course-detail' && (
          <CourseDetailPage
            course={currentRoute.course}
            currentTheme={currentTheme}
            currentUser={currentUser}
            onEnroll={(course) => handleCheckout(course)}
            onAddToCart={handleAddToCart}
            onWatchLesson={(lessonId, courseId) => setWatchingLesson({ lessonId, courseId })}
            onNavigateBack={() => setCurrentRoute({ type: 'courses' })}
          />
        )}

        {/* Page 3: Dedicated Admin Dashboard Page */}
        {currentRoute.type === 'admin' && (
          <AdminDashboardPage
            currentTheme={currentTheme}
            currentUser={currentUser}
            onPreviewCourse={(course) => handleCourseSelect(course)}
            onNavigateHome={() => setCurrentRoute({ type: 'home' })}
            onToggleTheme={handleToggleTheme}
            onLogout={handleLogout}
            onNavigateProfile={() => setCurrentRoute({ type: 'profile' })}
          />
        )}

        {/* Page 4: Dedicated Student Profile Page */}
        {currentRoute.type === 'profile' && (
          <StudentProfilePage
            currentUser={currentUser}
            currentTheme={currentTheme}
            onOpenWatchLesson={(lessonId, courseId) => setWatchingLesson({ lessonId, courseId })}
            onOpenCourseDetail={(course) => handleCourseSelect(course)}
            onNavigateHome={() => setCurrentRoute({ type: currentUser?.role === 'admin' ? 'admin' : 'home' })}
            onUpdateUser={(updated) => {
              if (currentUser) setCurrentUser({ ...currentUser, ...updated });
            }}
            onLogout={handleLogout}
          />
        )}

        {/* Page 5: Dedicated Checkout Page */}
        {currentRoute.type === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            currentUser={currentUser}
            currentTheme={currentTheme}
            onRemoveCartItem={(id) => setCartItems((prev) => prev.filter((c) => c.id !== id))}
            onPaymentSuccess={(ids) => handlePaymentComplete(ids)}
            onNavigateHome={() => setCurrentRoute({ type: 'home' })}
            onStartLearning={(courseId) => {
              const matching = COURSES.find((c) => c.id === courseId) || COURSES[0];
              handleCourseSelect(matching);
            }}
          />
        )}

        {/* Default: Main Landing Home Page */}
        {currentRoute.type === 'home' && (
          <>
            {/* Step 2: Hero Section with Stats & "عن المنصة" Card */}
            <HeroSection
              currentTheme={currentTheme}
              onCtaClick={handleOpenSignup}
              onExploreCourses={scrollToCourses}
            />

            {/* Step 3: Featured Course Cards Grid + Year Picker Callout */}
            <FeaturedCoursesSection
              courses={COURSES}
              currentTheme={currentTheme}
              onSelectCourse={handleCourseSelect}
              onSelectGradeFilter={setSelectedGradeFilter}
              selectedGrade={selectedGradeFilter}
            />

            {/* Step 4: Teachers Section (Pink Band + Filters) */}
            <TeachersSection
              teachers={TEACHERS}
              currentTheme={currentTheme}
              onSelectTeacher={(teacher) => {
                const matchingCourse = COURSES.find(
                  (c) => c.teacher.name.includes(teacher.name) || teacher.name.includes(c.teacher.name)
                );
                if (matchingCourse) {
                  handleCourseSelect(matchingCourse);
                } else {
                  scrollToCourses();
                }
              }}
            />

            {/* Step 5: Feature Grids (6-item laptop grid + asymmetric grid) */}
            <FeaturesGrids currentTheme={currentTheme} />

            {/* Step 6: Packages & Bundles (Term packages + Combo package) */}
            <PackagesSection
              packages={PACKAGES}
              comboPackage={COMBO_PACKAGE}
              currentTheme={currentTheme}
              onSelectPackage={handleCheckout}
            />

            {/* Step 8: Track Filters, Bottom CTA Banner & 4-Column Footer */}
            <FooterAndCta
              currentTheme={currentTheme}
              onOpenSignup={handleOpenSignup}
              onOpenLogin={handleOpenLogin}
              onHelpClick={() => {
                window.open(
                  'https://wa.me/966558924110?text=السلام%20عليكم%20أحتاج%20مساعدة%20في%20منصة%20نوح%20أكاديمي',
                  '_blank'
                );
              }}
              onSelectTrackChip={() => {
                scrollToCourses();
              }}
            />
          </>
        )}
      </main>

      {/* Interactive Modals */}
      {/* 1. Auth Modal (Login / Sign up) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        currentTheme={currentTheme}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* 2. Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourseForDetail}
        isOpen={!!selectedCourseForDetail && currentRoute.type === 'home'}
        onClose={() => setSelectedCourseForDetail(null)}
        currentTheme={currentTheme}
        currentUser={currentUser}
        onEnroll={(course) => {
          setSelectedCourseForDetail(null);
          handleCheckout(course);
        }}
        onOpenWatchLesson={(lessonId, courseId) => {
          setSelectedCourseForDetail(null);
          setWatchingLesson({ lessonId, courseId });
        }}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={!!itemForCheckout}
        onClose={() => setItemForCheckout(null)}
        item={itemForCheckout}
        currentTheme={currentTheme}
        currentUser={currentUser}
        onPaymentComplete={(itemId) => handlePaymentComplete([itemId])}
      />

      {/* 4. Exam Simulator Modal */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        currentTheme={currentTheme}
        currentUser={currentUser}
        onCompleteExam={handleCompleteExam}
      />

      {/* 5. Student Dashboard Modal */}
      {currentUser && (
        <StudentDashboardModal
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
          currentUser={currentUser}
          courses={COURSES}
          currentTheme={currentTheme}
          onOpenCourse={(course) => {
            setIsDashboardOpen(false);
            handleCourseSelect(course);
          }}
          onOpenExam={() => {
            setIsDashboardOpen(false);
            setIsExamModalOpen(true);
          }}
          onOpenWatchLesson={(lessonId, courseId) => {
            setIsDashboardOpen(false);
            setWatchingLesson({ lessonId, courseId });
          }}
          onLogout={handleLogout}
        />
      )}

      {/* 6. Secure Video Player Modal with Signed URL Token & Anti-piracy Watermarking */}
      {watchingLesson && (
        <WatchLessonModal
          isOpen={!!watchingLesson}
          onClose={() => setWatchingLesson(null)}
          lessonId={watchingLesson.lessonId}
          courseId={watchingLesson.courseId}
          currentUser={currentUser}
          currentTheme={currentTheme}
          onOpenCheckout={(cId) => {
            setWatchingLesson(null);
            const course = COURSES.find((c) => c.id === cId) || COURSES[0];
            handleCheckout(course);
          }}
        />
      )}

      {/* 7. Admin Portal Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentTheme={currentTheme}
        currentUser={currentUser}
      />
    </div>
  );
}
