import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/stores/auth';
import { ROLE_INFO } from '@/data/mock';
import type { Role } from '@/types';
import logoIcon from '../../design-system/assets/logo-icon.svg';

const ROLES: Role[] = ['admin', 'pm', 'engineer', 'finance', 'vendor'];

export function Onboarding() {
  const [chosen, setChosen] = useState<Role>('admin');
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const confirm = () => {
    setRole(chosen);
    navigate('/app/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <img src={logoIcon} alt="ProTrack" style={{ width: 34, height: 34 }} />
        <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--navy-800)' }}>ProTrack</span>
      </div>

      <div style={{ textAlign: 'center', maxWidth: 560, marginBottom: 28 }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>
          اختر دورك
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-500)', lineHeight: 1.7 }}>
          سنُفصّل لك مساحة العمل والصلاحيات بناءً على دورك في الشركة. يمكنك تبديل الدور لاحقًا من القائمة العلوية لأغراض المعاينة.
        </div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: 980,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
        marginBottom: 28,
      }}>
        {ROLES.map((r) => {
          const info = ROLE_INFO[r];
          const active = chosen === r;
          return (
            <Card
              key={r}
              pad={18}
              style={{
                cursor: 'pointer',
                border: active ? '2px solid var(--teal-500)' : '1px solid var(--border-1)',
                boxShadow: active ? 'var(--shadow-focus)' : 'var(--shadow-sm)',
                transition: 'all var(--dur-2) var(--ease-out)',
              }}
            >
              <div onClick={() => setChosen(r)} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: active ? 'var(--teal-050)' : 'var(--ink-050)',
                  color: active ? 'var(--teal-700)' : 'var(--ink-600)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon name={info.icon} size={20} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)' }}>{info.label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--ink-600)', lineHeight: 1.6 }}>{info.desc}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="secondary" onClick={() => navigate('/signin')}>رجوع</Button>
        <Button onClick={confirm} icon="arrow-right">المتابعة كـ {ROLE_INFO[chosen].label}</Button>
      </div>
    </div>
  );
}
