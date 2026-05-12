import { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { getProject } from '@/data/api';

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
  const [projectTitle, setProjectTitle] = useState<{ t: string; s: string } | null>(null);

  const segments = location.pathname.split('/').filter(Boolean);
  const screen = segments[1];
  const isProjectDetail = screen === 'projects' && (params as { projectId?: string }).projectId;
  const projectId = (params as { projectId?: string }).projectId;

  useEffect(() => {
    if (!isProjectDetail || !projectId) {
      setProjectTitle(null);
      return;
    }
    let cancelled = false;
    getProject(projectId).then((p) => {
      if (!cancelled) {
        if (p) setProjectTitle({ t: p.name, s: p.code });
        else setProjectTitle({ t: 'مشروع', s: '' });
      }
    });
    return () => { cancelled = true; };
  }, [isProjectDetail, projectId]);

  let title = 'ProTrack';
  let subtitle: string | undefined;
  if (isProjectDetail && projectTitle) {
    title = projectTitle.t;
    subtitle = projectTitle.s;
  } else if (screen && TITLES[screen]) {
    title = TITLES[screen].t;
    subtitle = TITLES[screen].s;
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
