import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { useAuth } from '@/stores/auth';
import logoIcon from '../../design-system/assets/logo-icon.svg';

export function SignIn() {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
      navigate('/app/dashboard', { replace: true });
    } catch (err: any) {
      setError(arabicError(err?.message));
    } finally {
      setSubmitting(false);
    }
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
              disabled={submitting}
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
                disabled={submitting}
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

          {error && (
            <div style={{
              padding: '10px 12px',
              borderRadius: 8,
              background: 'var(--danger-050)',
              border: '1px solid var(--danger-100)',
              color: 'var(--danger-700)',
              fontSize: 13,
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}>
              <Icon name="circle-alert" size={14} />
              {error}
            </div>
          )}

          <Button type="submit" size="lg" block disabled={submitting}>
            {submitting ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}
          </Button>
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
          <div style={{ fontSize: 12.5, color: 'var(--ink-700)', lineHeight: 1.7 }}>
            <b>حساب تجريبي:</b> <span className="num" dir="ltr">admin@gmail.com</span> / <span className="num" dir="ltr">12345678</span><br />
            فريق العرض (مهندسون/مالية/مدير مشروع): كلمة مرور <span className="num" dir="ltr">demo1234</span>
          </div>
        </div>
      </div>

      {/* Marketing panel */}
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

function arabicError(msg: string | undefined): string {
  if (!msg) return 'تعذّر تسجيل الدخول.';
  if (/invalid login/i.test(msg)) return 'البريد أو كلمة المرور غير صحيحة.';
  if (/email not confirmed/i.test(msg)) return 'لم يتم تأكيد البريد الإلكتروني بعد.';
  if (/network/i.test(msg)) return 'تعذّر الاتصال بالخادم.';
  return msg;
}
