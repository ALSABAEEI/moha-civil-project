import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { PROJECTS } from '@/data/mock';

const TITLES: Record<string, { t: string; s?: string }> = {
  'dashboard':    { t: 'الرئيسية',           s: 'نظرة شاملة على مشاريعك ومهامك' },
  'projects':     { t: 'المشاريع',           s: 'متابعة محفظة المشاريع وحالة كل مشروع' },
  'tasks':        { t: 'المهام',             s: 'لوحة كانبان للمهام الفعّالة' },
  'vendors':      { t: 'الموردون',           s: 'إدارة الموردين وحالة التأهيل' },
  'engineers':    { t: 'المهندسون',          s: 'فِرَق التنفيذ والتوزيع' },
  'assignments':  { t: 'التعيينات',          s: 'توزيع المهندسين والموردين على المشاريع' },
  'finance':      { t: 'المتابعة المالية',   s: 'الميزانية، المدفوعات، والفواتير' },
  'reports':      { t: 'التقارير',           s: 'تقارير دورية ومخصّصة' },
  'notifications':{ t: 'الإشعارات',          s: 'كل التحديثات في مكان واحد' },
  'approvals':    { t: 'الاعتمادات',          s: 'الطلبات بانتظار اعتمادك' },
  'audit':        { t: 'سجل التدقيق',         s: 'حركة كل تغيير حسّاس في النظام' },
  'search':       { t: 'نتائج البحث',         s: 'النتائج عبر المشاريع والفواتير والمستندات' },
  'users':        { t: 'إدارة المستخدمين',   s: 'الصلاحيات، الأدوار، والدعوات' },
  'settings':     { t: 'الإعدادات',           s: 'تفضيلات الحساب والنظام' },
};

export function AppLayout() {
  const location = useLocation();
  const params = useParams();

  // Resolve page title — handles /app/<screen> and /app/projects/:id
  const segments = location.pathname.split('/').filter(Boolean);
  let title = 'ProTrack';
  let subtitle: string | undefined;

  if (segments[0] === 'app') {
    const screen = segments[1];
    if (screen === 'projects' && (params as { projectId?: string }).projectId) {
      const id = (params as { projectId: string }).projectId;
      const p = PROJECTS.find((x) => x.id === id);
      if (p) { title = p.name; subtitle = p.code; }
      else { title = 'مشروع'; }
    } else if (screen && TITLES[screen]) {
      title = TITLES[screen].t;
      subtitle = TITLES[screen].s;
    }
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bg-app)',
    }}>
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      }}>
        <TopBar title={title} subtitle={subtitle} />
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 26px' }}>
          <Outlet />
        </div>
      </main>
      <Sidebar />
    </div>
  );
}
