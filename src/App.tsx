import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/stores/auth';
import { AppDataProvider } from '@/contexts/AppData';
import { SignIn } from '@/routes/SignIn';
import { AppLayout } from '@/routes/AppLayout';
import { Dashboard } from '@/routes/Dashboard';
import { ProjectsList } from '@/routes/ProjectsList';
import { ProjectDetail } from '@/routes/ProjectDetail';
import { Placeholder } from '@/routes/Placeholder';
import { TaskBoard } from '@/routes/TaskBoard';
import { Vendors } from '@/routes/Vendors';
import { Finance } from '@/routes/Finance';
import { Notifications } from '@/routes/Notifications';
import { Settings } from '@/routes/Settings';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { signedIn, bootstrapped } = useAuth();
  if (!bootstrapped) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-app)',
        color: 'var(--ink-500)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
      }}>
        جارٍ التحميل…
      </div>
    );
  }
  if (!signedIn) return <Navigate to="/signin" replace />;
  return <>{children}</>;
}

export default function App() {
  const bootstrap = useAuth((s) => s.bootstrap);
  useEffect(() => { bootstrap(); }, [bootstrap]);

  return (
    <AppDataProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />

        <Route path="/app" element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:projectId/*" element={<ProjectDetail />} />
          <Route path="tasks" element={<TaskBoard />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="finance" element={<Finance />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="assignments" element={<Placeholder title="التعيينات" subtitle="توزيع المهندسين والموردين على المشاريع" />} />
          <Route path="reports" element={<Placeholder title="التقارير" subtitle="تقارير دورية ومخصّصة" />} />
          <Route path="approvals" element={<Placeholder title="الاعتمادات" subtitle="الطلبات بانتظار اعتمادك" />} />
          <Route path="audit" element={<Placeholder title="سجل التدقيق" subtitle="حركة كل تغيير حسّاس في النظام" />} />
          <Route path="search" element={<Placeholder title="نتائج البحث" subtitle="النتائج عبر المشاريع والفواتير والمستندات" />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </AppDataProvider>
  );
}
