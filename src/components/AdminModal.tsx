import React, { useState, useEffect } from 'react';
import { BrandTheme, StudentUser, AdminOverview, Order, SupportTicket } from '../types';
import { api } from '../lib/api';
import { X, ShieldAlert, BarChart3, ShoppingBag, BookOpen, MessageSquare, Plus, CheckCircle2, Clock, DollarSign, Users, Sparkles, RefreshCw, Send, Loader2 } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: BrandTheme;
  currentUser: StudentUser | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'courses' | 'tickets'>('overview');
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // New Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('الرياضيات');
  const [newGrade, setNewGrade] = useState('3rd_secondary');
  const [newTrack, setNewTrack] = useState('computing_engineering');
  const [newPrice, setNewPrice] = useState('180');
  const [newTeacher, setNewTeacher] = useState('');
  const [courseCreatedMsg, setCourseCreatedMsg] = useState<string | null>(null);

  // New Lesson Form State
  const [targetCourseId, setTargetCourseId] = useState('c1');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newVideoId, setNewVideoId] = useState('');
  const [lessonCreatedMsg, setLessonCreatedMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ovData, ordData, tktData] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getOrders(),
        api.admin.getTickets(),
      ]);
      setOverview(ovData);
      setOrders(ordData.orders || []);
      setTickets(tktData.tickets || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.createCourse({
        title: newTitle,
        subject: newSubject,
        gradeKey: newGrade as any,
        trackKey: newTrack as any,
        price: Number(newPrice),
        teacherName: newTeacher || undefined,
      });
      setCourseCreatedMsg('تم إنشاء الكورس بنجاح وتخصيص المحاضرة التمهيدية الأولى!');
      setNewTitle('');
      loadData();
      setTimeout(() => setCourseCreatedMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'فشل إنشاء الكورس');
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.addLesson({
        courseId: targetCourseId,
        title: newLessonTitle,
        videoProviderId: newVideoId || `bunny_stream_${Date.now()}`,
        durationSeconds: 2700,
        isPreview: false,
        attachmentTitle: 'مذكرة الشرح والتمارين الوزارية',
        attachmentUrl: 'https://storage.noheacademy.sa/notes/custom.pdf',
      });
      setLessonCreatedMsg('تمت إضافة المحاضرة إلى الكورس وربطها ببث الفيديو المشفر!');
      setNewLessonTitle('');
      setNewVideoId('');
      loadData();
      setTimeout(() => setLessonCreatedMsg(null), 4000);
    } catch (err: any) {
      alert(err.message || 'فشل إضافة المحاضرة');
    }
  };

  const handleUpdateTicketStatus = async (id: string, status: 'open' | 'answered' | 'closed') => {
    try {
      await api.admin.updateTicket(id, status);
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const primaryColor = currentTheme === 'fresh' ? '#6F384F' : '#3A3028';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md" dir="rtl">
      <div className="w-full max-w-5xl max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-camel text-lg font-bold">بوابة الإدارة الأكاديمية (Admin Portal)</h2>
                <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Hostinger VPS Backend
                </span>
              </div>
              <p className="font-ui text-xs text-neutral-400">
                إدارة الكورسات، مراقبة إيرادات مدى و STC Pay، وتذاكر الدعم والامتحانات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b flex gap-4 bg-neutral-50 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs sm:text-sm font-camel font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>نظرة عامة والمؤشرات</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 text-xs sm:text-sm font-camel font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>الطلبات والمدفوعات ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-3 px-3 text-xs sm:text-sm font-camel font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'courses'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>إضافة كورس ومحاضرات</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-3 px-3 text-xs sm:text-sm font-camel font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'tickets'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>تذاكر الدعم الأكاديمي ({tickets.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-center justify-between text-amber-800 text-xs font-bold mb-2">
                    <span>إجمالي الإيرادات (ريال)</span>
                    <DollarSign className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="font-impact text-2xl sm:text-3xl font-black text-neutral-900" dir="ltr">
                    {overview?.totalRevenue || 375} ر.س
                  </div>
                  <span className="text-[11px] text-neutral-500 font-ui mt-1 block">
                    عبر مدى و STC Pay و Apple Pay
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
                    <span>الطلبات المدفوعة</span>
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-impact text-2xl sm:text-3xl font-black text-neutral-900">
                    {overview?.paidOrdersCount || 2}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-ui mt-1 block">
                    معدل نجاح الدفع 100%
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center justify-between text-blue-800 text-xs font-bold mb-2">
                    <span>الطلاب المسجلين</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="font-impact text-2xl sm:text-3xl font-black text-neutral-900">
                    {overview?.totalStudents || 1}
                  </div>
                  <span className="text-[11px] text-blue-700 font-ui mt-1 block">
                    {overview?.activeEnrollmentsCount || 2} اشتراك كورس نشط
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <div className="flex items-center justify-between text-purple-800 text-xs font-bold mb-2">
                    <span>تذاكر الدعم المفتوحة</span>
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="font-impact text-2xl sm:text-3xl font-black text-neutral-900">
                    {overview?.openTicketsCount || 1}
                  </div>
                  <span className="text-[11px] text-purple-700 font-ui mt-1 block">
                    واتساب، تلجرام، والتطبيق
                  </span>
                </div>
              </div>

              {/* Recent Orders table preview */}
              <div className="bg-neutral-50 rounded-2xl border p-5">
                <h3 className="font-camel text-base font-bold text-neutral-900 mb-4">
                  أحدث العمليات والاشتراكات المسجلة
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="text-neutral-500 border-b">
                        <th className="pb-2 font-bold">رقم الطلب</th>
                        <th className="pb-2 font-bold">الطالب</th>
                        <th className="pb-2 font-bold">الكورس / الباقة</th>
                        <th className="pb-2 font-bold">المبلغ</th>
                        <th className="pb-2 font-bold">وسيلة الدفع</th>
                        <th className="pb-2 font-bold">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {(overview?.recentOrders || orders).map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/50">
                          <td className="py-2.5 font-mono text-[11px] font-semibold text-neutral-600">
                            #{ord.id}
                          </td>
                          <td className="py-2.5 font-bold text-neutral-900">{ord.userName || 'طالب'}</td>
                          <td className="py-2.5 text-neutral-700">{ord.itemTitle}</td>
                          <td className="py-2.5 font-bold font-mono text-emerald-800">
                            {ord.amount} ر.س
                          </td>
                          <td className="py-2.5 font-semibold text-neutral-600">
                            {ord.paymentMethod.toUpperCase()}
                          </td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {ord.paymentStatus === 'paid' ? 'مدفوع ومفعل ✓' : ord.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-camel text-base font-bold text-neutral-900">
                  سجل طلبات الاشتراكات وقاعدة بيانات الفواتير
                </h3>
                <span className="text-xs text-neutral-500 font-ui">
                  إجمالي العمليات: {orders.length}
                </span>
              </div>

              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-neutral-500">#{ord.id}</span>
                        <span className="font-bold text-sm text-neutral-900">{ord.itemTitle}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {ord.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-600 font-ui flex items-center gap-3">
                        <span>الطالب: <strong>{ord.userName || ord.userId}</strong></span>
                        <span>•</span>
                        <span>بوابة: <strong>{ord.paymentProvider} ({ord.paymentMethod})</strong></span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-neutral-400">Trx: {ord.providerTransactionId}</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="font-impact text-lg font-bold text-emerald-700">
                        {ord.amount} ر.س
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {new Date(ord.createdAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add New Course Form */}
              <div className="p-5 rounded-2xl border bg-neutral-50/60">
                <h3 className="font-camel text-base font-bold text-neutral-900 mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  <span>إضافة كورس مسارات جديد</span>
                </h3>
                <p className="font-ui text-xs text-neutral-500 mb-4">
                  سيتم حفظ الكورس في جدول `courses` وعرضه فوراً في الكتالوج.
                </p>

                {courseCreatedMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{courseCreatedMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">اسم الكورس</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: الأمن السيبراني والذكاء الاصطناعي 2"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">المادة</label>
                      <input
                        type="text"
                        required
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">السعر (ر.س)</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">المرحلة الدراسية</label>
                      <select
                        value={newGrade}
                        onChange={(e) => setNewGrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                      >
                        <option value="3rd_secondary">الصف الثالث الثانوي</option>
                        <option value="2nd_secondary">الصف الثاني الثانوي</option>
                        <option value="1st_secondary">الصف الأول الثانوي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">المسار التخصصي</label>
                      <select
                        value={newTrack}
                        onChange={(e) => setNewTrack(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                      >
                        <option value="computing_engineering">مسار الحوسبة والهندسة</option>
                        <option value="natural_sciences">مسار العلوم الطبيعية</option>
                        <option value="shared_year">السنة الأولى المشتركة</option>
                        <option value="business_admin">مسار إدارة الأعمال</option>
                        <option value="sharia_islamic_studies">مسار الشريعة والقانون</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">اسم المعلم</label>
                    <input
                      type="text"
                      placeholder="أ. نوح أو أستاذ المادة"
                      value={newTeacher}
                      onChange={(e) => setNewTeacher(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer mt-2"
                  >
                    حفظ ونشر الكورس في المنصة
                  </button>
                </form>
              </div>

              {/* Add Lesson to Course Form */}
              <div className="p-5 rounded-2xl border bg-neutral-50/60">
                <h3 className="font-camel text-base font-bold text-neutral-900 mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>إضافة محاضرة لكورس موجود</span>
                </h3>
                <p className="font-ui text-xs text-neutral-500 mb-4">
                  ربط كود فيديو Bunny/Cloudflare وتوليد روابط التشفير والعلامة المائية.
                </p>

                {lessonCreatedMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{lessonCreatedMsg}</span>
                  </div>
                )}

                <form onSubmit={handleAddLesson} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">اختر الكورس المستهدف</label>
                    <select
                      value={targetCourseId}
                      onChange={(e) => setTargetCourseId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                    >
                      <option value="c1">البرمجة والذكاء الاصطناعي المتقدم</option>
                      <option value="c2">اللغة العربية 3 (الكفايات اللغوية)</option>
                      <option value="c3">الرياضيات المتقدمة 3</option>
                      <option value="c4">الفيزياء 3 للثانوية</option>
                      <option value="c5">الكيمياء 3 للثانوية</option>
                      <option value="c6">الأحياء 3 وتطبيقاتها</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">عنوان المحاضرة</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: المحاضرة 6: حل نماذج اختبارات الوزارة"
                      value={newLessonTitle}
                      onChange={(e) => setNewLessonTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">معرّف مزود الفيديو (Video Provider ID)</label>
                    <input
                      type="text"
                      placeholder="stream_cf_asset_992147"
                      value={newVideoId}
                      onChange={(e) => setNewVideoId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer mt-2"
                  >
                    حفظ المحاضرة وتشفير الرابط
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-camel text-base font-bold text-neutral-900">
                  تذاكر استفسارات الطلاب وأولياء الأمور
                </h3>
              </div>

              <div className="space-y-3">
                {tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    className="p-4 rounded-2xl border bg-neutral-50/60 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900">{tkt.userName || 'طالب'}</span>
                        {tkt.userPhone && (
                          <span className="text-xs font-mono text-neutral-500">({tkt.userPhone})</span>
                        )}
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-700 uppercase">
                          قناة: {tkt.channel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tkt.status === 'answered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : tkt.status === 'closed'
                              ? 'bg-neutral-200 text-neutral-700'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {tkt.status === 'answered' ? 'تم الرد' : tkt.status === 'closed' ? 'مغلقة' : 'بانتظار الرد'}
                        </span>
                      </div>
                      <p className="font-ui text-xs text-neutral-700 leading-relaxed bg-white p-3 rounded-xl border border-black/5">
                        "{tkt.message}"
                      </p>
                      <div className="text-[10px] text-neutral-400 font-ui">
                        تاريخ الإرسال: {new Date(tkt.createdAt).toLocaleString('ar-SA')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {tkt.status === 'open' && (
                        <button
                          onClick={() => handleUpdateTicketStatus(tkt.id, 'answered')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          تحديد كـ "تم الرد"
                        </button>
                      )}
                      <button
                        onClick={() => handleUpdateTicketStatus(tkt.id, 'closed')}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
