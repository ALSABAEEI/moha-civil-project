// Sign-in screen
const SignIn = ({ onSignIn }) => {
  return (
    <div style={{
      minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr',
      background:'var(--bg-app)',
    }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        <div style={{ width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src="../../assets/logo-icon.svg" style={{ width:36, height:36 }}/>
            <span style={{ fontSize:20, fontWeight:800, color:'var(--navy-800)' }}>ProTrack</span>
          </div>
          <div>
            <div style={{ fontSize:26, fontWeight:700, color:'var(--ink-900)', marginBottom:6 }}>مرحبًا بعودتك</div>
            <div style={{ fontSize:14, color:'var(--ink-600)' }}>سجّل الدخول للوصول إلى مساحة عملك في ProTrack.</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Field label="البريد الإلكتروني"   icon="mail"  placeholder="name@protrack.sa" type="email" defaultValue="faisal@protrack.sa"/>
            <Field label="كلمة المرور"          icon="lock"  placeholder="••••••••"          type="password" defaultValue="••••••••"  trailing="نسيت؟"/>
            <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'var(--ink-700)' }}>
              <input type="checkbox" defaultChecked style={{ accentColor:'var(--teal-500)' }}/>
              أبقني مسجّلاً
            </label>
            <Button variant="primary" size="lg" iconAfter="arrow-left" onClick={onSignIn} style={{ width:'100%', justifyContent:'center' }}>
              تسجيل الدخول
            </Button>
            <div style={{ display:'flex', alignItems:'center', gap:10, color:'var(--ink-400)', fontSize:12 }}>
              <div style={{ flex:1, height:1, background:'var(--border-1)' }}/>
              أو
              <div style={{ flex:1, height:1, background:'var(--border-1)' }}/>
            </div>
            <Button variant="secondary" size="lg" icon="key-round" style={{ width:'100%', justifyContent:'center' }}>
              الدخول بالهوية الوطنية (نفاذ)
            </Button>
          </div>
          <div style={{ fontSize:12, color:'var(--ink-500)', textAlign:'center' }}>
            بالدخول فإنك توافق على <a style={{ color:'var(--teal-600)', fontWeight:600 }}>الشروط</a> و<a style={{ color:'var(--teal-600)', fontWeight:600 }}>سياسة الخصوصية</a>.
          </div>
        </div>
      </div>

      <div style={{
        background:'linear-gradient(220deg, var(--navy-800) 0%, var(--navy-900) 60%, #050D1A 100%)',
        color:'#fff', padding:'48px 56px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, left:-80, width:340, height:340, borderRadius:'50%', background:'rgba(23,162,162,0.18)', filter:'blur(4px)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,.7)', position:'relative' }}>
          <Icon name="shield-check" size={16}/>
          منصة آمنة لإدارة المشاريع الهندسية والمقاولات
        </div>
        <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:22 }}>
          <div style={{ fontSize:36, fontWeight:800, lineHeight:1.4 }}>أَدِر مشاريعك من<br/>الترخيص إلى الاستلام<br/><span style={{ color:'var(--teal-400)' }}>في مساحة واحدة آمنة</span></div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.8, maxWidth:440 }}>
            تتبّع مالي حيّ، صلاحيات دقيقة لكل دور، وإدارة كاملة للموردين والمهندسين عبر فِرَق متعددة المواقع.
          </div>
          <div style={{ display:'flex', gap:18, marginTop:8 }}>
            <Stat n="42" l="مشروعاً نشطاً"/>
            <Stat n="160+" l="مهندساً"/>
            <Stat n="24" l="مورّداً معتمَداً"/>
          </div>
        </div>
        <div style={{ position:'relative', fontSize:12, color:'rgba(255,255,255,.5)' }}>© 2026 ProTrack. جميع الحقوق محفوظة.</div>
      </div>
    </div>
  );
};

const Field = ({ label, icon, type='text', placeholder, defaultValue, trailing }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
      <label style={{ fontSize:13, fontWeight:600, color:'var(--ink-800)' }}>{label}</label>
      {trailing && <a style={{ fontSize:12, color:'var(--teal-600)', fontWeight:600, cursor:'pointer' }}>{trailing}</a>}
    </div>
    <div style={{ display:'flex', alignItems:'center', gap:10, height:42, padding:'0 14px', background:'#fff', border:'1px solid var(--border-2)', borderRadius:8 }}>
      {icon && <Icon name={icon} size={16} style={{ color:'var(--ink-500)' }}/>}
      <input type={type} placeholder={placeholder} defaultValue={defaultValue} style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, fontFamily:'var(--font-sans)', textAlign:'start' }}/>
    </div>
  </div>
);

const Stat = ({ n, l }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
    <span style={{ fontSize:24, fontWeight:800, color:'var(--teal-400)' }}>{n}</span>
    <span style={{ fontSize:12, color:'rgba(255,255,255,.7)' }}>{l}</span>
  </div>
);

window.SignIn = SignIn;
window.Field = Field;
