// Role onboarding — choose your role and primary scope
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = React.useState(0);
  const [role, setRole] = React.useState('pm');
  const [scope, setScope] = React.useState(['p1','p3']);

  const toggle = (id) => setScope(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const Steps = () => (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
      {[0,1,2].map(i => (
        <span key={i} style={{
          height:6, flex: i === step ? 4 : 1, borderRadius:999,
          background: i <= step ? 'var(--teal-500)' : 'var(--ink-200)',
          transition:'flex var(--dur-3) var(--ease-out), background var(--dur-2)',
        }}/>
      ))}
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px', background:'var(--bg-app)' }}>
      <Card style={{ width:'100%', maxWidth:680, padding:32, display:'flex', flexDirection:'column', gap:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <img src="../../assets/logo-icon.svg" style={{ width:30, height:30 }}/>
          <span style={{ fontSize:16, fontWeight:800, color:'var(--navy-800)' }}>ProTrack</span>
          <span style={{ marginRight:'auto', fontSize:12, color:'var(--ink-500)' }}>الإعداد المبدئي · الخطوة {step+1} من 3</span>
        </div>
        <Steps/>

        {step === 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--ink-900)', marginBottom:6 }}>ما دورك في الفريق؟</div>
              <div style={{ fontSize:13.5, color:'var(--ink-600)' }}>سنُخصّص لوحاتك وصلاحياتك بناءً على دورك. يمكنك تغييره لاحقاً من إدارة المستخدمين.</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {Object.entries(ROLE_INFO).map(([k, info]) => (
                <button key={k} onClick={() => setRole(k)} style={{
                  display:'flex', alignItems:'flex-start', gap:14, padding:16, textAlign:'start',
                  background: role === k ? 'var(--teal-050)' : '#fff',
                  border:'1.5px solid', borderColor: role === k ? 'var(--teal-500)' : 'var(--border-1)',
                  borderRadius:12, cursor:'pointer', fontFamily:'var(--font-sans)',
                }}>
                  <div style={{ width:36, height:36, borderRadius:8, background: role === k ? 'var(--teal-500)' : 'var(--navy-050)', color: role === k ? '#fff' : 'var(--navy-700)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon name={info.icon} size={18}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14.5, fontWeight:700, color:'var(--ink-900)', marginBottom:4 }}>{info.label}</div>
                    <div style={{ fontSize:12, color:'var(--ink-600)', lineHeight:1.65 }}>{info.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--ink-900)', marginBottom:6 }}>المشاريع التي تتابعها</div>
              <div style={{ fontSize:13.5, color:'var(--ink-600)' }}>اختر المشاريع التي تظهر على لوحتك الرئيسية. تستطيع تعديل ذلك في أي وقت.</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {PROJECTS.slice(0,5).map(p => (
                <button key={p.id} onClick={() => toggle(p.id)} style={{
                  display:'flex', alignItems:'center', gap:12, padding:'12px 14px', textAlign:'start',
                  background: scope.includes(p.id) ? 'var(--teal-050)' : '#fff',
                  border:'1.5px solid', borderColor: scope.includes(p.id) ? 'var(--teal-500)' : 'var(--border-1)',
                  borderRadius:10, cursor:'pointer', fontFamily:'var(--font-sans)',
                }}>
                  <div style={{ width:20, height:20, borderRadius:6, background: scope.includes(p.id) ? 'var(--teal-500)' : '#fff', border:'1.5px solid', borderColor: scope.includes(p.id) ? 'var(--teal-500)' : 'var(--border-2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                    {scope.includes(p.id) && <Icon name="check" size={13} stroke={3}/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink-900)' }}>{p.name}</div>
                    <div style={{ fontSize:11.5, color:'var(--ink-500)', marginTop:2 }}>
                      <span className="num" style={{ direction:'ltr' }}>{p.code}</span> · {p.discipline}
                    </div>
                  </div>
                  <StatusChip status={p.status}/>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--ink-900)', marginBottom:6 }}>تأكيد التفضيلات</div>
              <div style={{ fontSize:13.5, color:'var(--ink-600)' }}>راجِع إعداداتك قبل الدخول إلى مساحة العمل.</div>
            </div>
            <div style={{ background:'var(--ink-050)', border:'1px solid var(--border-1)', borderRadius:10, padding:18, display:'flex', flexDirection:'column', gap:14 }}>
              <Row label="الدور" value={ROLE_INFO[role].label} icon={ROLE_INFO[role].icon}/>
              <Row label="المشاريع المتابَعة" value={`${scope.length} مشروع`} icon="folder-kanban"/>
              <Row label="التنبيهات" value="مالية، مهام، وذكر مباشر" icon="bell"/>
              <Row label="اللغة" value="العربية (افتراضي) · من اليمين إلى اليسار" icon="languages"/>
            </div>
          </div>
        )}

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10 }}>
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(s => s-1)} icon="chevron-right">السابق</Button>
          {step < 2
            ? <Button variant="primary" iconAfter="chevron-left" onClick={() => setStep(s => s+1)}>التالي</Button>
            : <Button variant="accent" iconAfter="arrow-left" onClick={() => onComplete && onComplete(role)}>دخول إلى ProTrack</Button>}
        </div>
      </Card>
    </div>
  );
};

const Row = ({ label, value, icon }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
    <div style={{ width:32, height:32, borderRadius:8, background:'#fff', border:'1px solid var(--border-1)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--teal-600)' }}>
      <Icon name={icon} size={16}/>
    </div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:11.5, color:'var(--ink-500)', fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:13.5, color:'var(--ink-900)', fontWeight:600 }}>{value}</div>
    </div>
    <Button variant="ghost" size="sm">تعديل</Button>
  </div>
);

window.Onboarding = Onboarding;
