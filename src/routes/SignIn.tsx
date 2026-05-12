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
    <div className="signin-grid" style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      background: 'var(--bg-app)',
    }}>
      {/* ============================================
          Form panel — appears on the RIGHT in RTL
          ============================================ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={logoIcon} alt="ProTrack" style={{ width: 36, height: 36 }} />
            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy-800)' }}>ProTrack</span>
          </div>

          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--ink-900)', marginBottom: 6 }}>
              مرحبًا بعودتك
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-600)', lineHeight: 1.7 }}>
              سجّل دخولك للوصول إلى مساحة عملك في ProTrack.
            </div>
          </div>

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field
              label="البريد الإلكتروني"
              icon="mail"
              type="email"
              placeholder="name@protrack.sa"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              disabled={submitting}
            />
            <Field
              label="كلمة المرور"
              icon="lock"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              disabled={submitting}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--ink-500)',
                    display: 'inline-flex',
                    padding: 0,
                  }}
                  aria-label={showPw ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  <Icon name={showPw ? 'eye-off' : 'eye'} size={16} />
                </button>
              }
              trailingLabel={<a style={{ color: 'var(--teal-600)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>نسيت؟</a>}
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-700)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--teal-500)' }} />
              أبقني مسجّلاً
            </label>

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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              iconAfter="arrow-left"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'جارٍ تسجيل الدخول…' : 'تسجيل الدخول'}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-400)', fontSize: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-1)' }} />
              أو
              <div style={{ flex: 1, height: 1, background: 'var(--border-1)' }} />
            </div>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              icon="key-round"
              disabled
              title="قيد التطوير"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              الدخول بالهوية الوطنية (نفاذ)
            </Button>
          </form>

          <div style={{
            padding: 12,
            background: 'var(--info-050)',
            border: '1px solid var(--info-100)',
            borderRadius: 10,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}>
            <Icon name="info" size={14} style={{ color: 'var(--info-700)', marginTop: 3, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: 'var(--ink-700)', lineHeight: 1.8 }}>
              <b>حساب تجريبي:</b>{' '}
              <span className="num" dir="ltr">admin@gmail.com</span>{' / '}
              <span className="num" dir="ltr">12345678</span>
              <br />
              <b>فريق العرض:</b> كلمة المرور{' '}
              <span className="num" dir="ltr">demo1234</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center', lineHeight: 1.7 }}>
            بالدخول فإنك توافق على{' '}
            <a style={{ color: 'var(--teal-600)', fontWeight: 600, cursor: 'pointer' }}>الشروط</a>
            {' '}و{' '}
            <a style={{ color: 'var(--teal-600)', fontWeight: 600, cursor: 'pointer' }}>سياسة الخصوصية</a>.
          </div>
        </div>
      </div>

      {/* ============================================
          Marketing panel — appears on the LEFT in RTL
          ============================================ */}
      <div className="signin-marketing" style={{
        background: 'linear-gradient(220deg, var(--navy-800) 0%, var(--navy-900) 60%, #050D1A 100%)',
        color: '#fff',
        padding: '48px 56px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative teal glow blob */}
        <div style={{
          position: 'absolute',
          top: -80,
          left: -80,
          width: 340,
          height: 340,
          borderRadius: '50%',
          background: 'rgba(23, 162, 162, 0.18)',
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }} />
        {/* Second subtle teal accent bottom-right */}
        <div style={{
          position: 'absolute',
          bottom: -120,
          right: -120,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'rgba(40, 90, 142, 0.35)',
          filter: 'blur(20px)',
          pointerEvents: 'none',
        }} />

        {/* Top */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          color: 'rgba(255,255,255,.7)',
          position: 'relative',
        }}>
          <Icon name="shield-check" size={16} />
          منصة آمنة لإدارة المشاريع الهندسية والمقاولات
        </div>

        {/* Middle */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.45 }}>
            أَدِر مشاريعك من<br />
            الترخيص إلى الاستلام<br />
            <span style={{ color: 'var(--teal-400)' }}>في مساحة واحدة آمنة</span>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', lineHeight: 1.85, maxWidth: 440 }}>
            تتبّع مالي حيّ، صلاحيات دقيقة لكل دور، وإدارة كاملة للموردين
            والمهندسين عبر فِرَق متعددة المواقع — من المشاريع المدنية
            والكهربائية والميكانيكية إلى الصيانة والخدمات الفنية.
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 8, flexWrap: 'wrap' }}>
            <Stat n="9" l="وحدات تشغيلية" />
            <Stat n="5" l="أدوار صلاحيات" />
            <Stat n="100٪" l="عربي · RTL" />
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          position: 'relative',
          fontSize: 12,
          color: 'rgba(255,255,255,.5)',
        }}>
          © 2026 ProTrack. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  icon?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  disabled?: boolean;
  trailing?: React.ReactNode;
  trailingLabel?: React.ReactNode;
}

function Field({ label, icon, type = 'text', placeholder, value, onChange, autoComplete, disabled, trailing, trailingLabel }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-800)' }}>{label}</label>
        {trailingLabel}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 44,
        padding: '0 14px',
        background: '#fff',
        border: '1px solid',
        borderColor: focused ? 'var(--teal-500)' : 'var(--border-2)',
        borderRadius: 8,
        boxShadow: focused ? 'var(--shadow-focus)' : 'none',
        transition: 'border-color var(--dur-1) var(--ease-out), box-shadow var(--dur-1) var(--ease-out)',
      }}>
        {icon && <Icon name={icon} size={16} style={{ color: 'var(--ink-500)' }} />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 14,
            fontFamily: 'var(--font-sans)',
            textAlign: 'start',
            color: 'var(--ink-900)',
            minWidth: 0,
          }}
        />
        {trailing}
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span className="num" style={{ fontSize: 24, fontWeight: 800, color: 'var(--teal-400)' }}>{n}</span>
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>{l}</span>
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
