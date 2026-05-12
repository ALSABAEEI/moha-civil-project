import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/stores/auth';
import logoIcon from '../../design-system/assets/logo-icon.svg';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock — no validation. Real auth lands when Supabase is wired up.
    signIn();
    navigate('/onboarding');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fff' }}>
      {/* Form panel */}
      <div style={{
        flex: '1 1 540px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 8vw',
        maxWidth: 640,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <img src={logoIcon} alt="ProTrack" style={{ width: 34, height: 34 }} />
          <span style={{ fontWeight: 800, fontSize: 22, color: 'var(--navy-800)' }}>ProTrack</span>
        </div>

        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 8 }}>
          أهلًا بعودتك
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-500)', marginBottom: 32 }}>
          سجّل دخولك لمتابعة مشاريعك ومهامك اليوم.
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="field-label">البريد الإلكتروني</label>
            <input
              type="email"
              required
              autoComplete="email"
              className="input"
              placeholder="name@protrack.sa"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingInlineStart: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: 'absolute',
                  insetInlineStart: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-500)',
                  padding: 4,
                  display: 'inline-flex',
                  borderRadius: 4,
                }}
                aria-label={showPw ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                <Icon name={showPw ? 'eye-off' : 'eye'} size={16} />
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-700)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--teal-500)' }} />
              تذكّرني على هذا الجهاز
            </label>
            <a href="#" style={{ fontSize: 13, color: 'var(--teal-700)', fontWeight: 600 }}>
              نسيت كلمة المرور؟
            </a>
          </div>
          <Button type="submit" size="lg" block>تسجيل الدخول</Button>
        </form>

        <div style={{
          marginTop: 28,
          padding: 14,
          background: 'var(--info-050)',
          border: '1px solid var(--info-100)',
          borderRadius: 10,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <Icon name="info" size={16} style={{ color: 'var(--info-700)', marginTop: 2 }} />
          <div style={{ fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.6 }}>
            <b>نسخة تجريبية:</b> أي بريد وكلمة مرور تعمل — ستختار دورك في الخطوة التالية.
          </div>
        </div>
      </div>

      {/* Marketing panel — only gradient surface in the system */}
      <div style={{
        flex: '1 1 0',
        background: 'radial-gradient(at 70% 30%, rgba(23,162,162,0.25), transparent 50%), radial-gradient(at 30% 80%, rgba(40,90,142,0.35), transparent 50%), #07172B',
        color: '#fff',
        padding: '60px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        minHeight: '100vh',
      }}>
        <div style={{ fontSize: 13, color: '#7BD3D3', fontWeight: 600, marginBottom: 18 }}>
          ProTrack — منصة الشركات المقاولة والهندسية
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>
          مشاريعك، بنودها، مصروفاتها — في مكان واحد.
        </div>
        <div style={{ fontSize: 15, color: '#A9B6C7', lineHeight: 1.7, maxWidth: 480 }}>
          أنشئ المشاريع، أضف البنود والمصروفات، عيّن المهندسين والموردين،
          وتابع الميزانية لحظة بلحظة — للمشاريع المدنية والكهربائية والميكانيكية والصيانة.
        </div>
      </div>
    </div>
  );
}
