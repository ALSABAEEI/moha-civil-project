// Audit log — top-level filterable page (also embedded as tab in Settings)
const AuditLog = () => {
  const [scope, setScope] = React.useState('all');

  const EVENTS = [
    { id:'e1', when:'12 مايو 2026 · 14:22', actor:'na', action:'تعديل صلاحيات', target:'مهندس ميداني', kind:'security', detail:'منح صلاحية اعتماد المصروفات حتى 50,000 ر.س' },
    { id:'e2', when:'12 مايو 2026 · 11:48', actor:'fa', action:'اعتماد فاتورة', target:'INV-08851', kind:'finance',  detail:'421,000 ر.س — الفيصل للأعمال المدنية' },
    { id:'e3', when:'12 مايو 2026 · 09:15', actor:'sl', action:'رفض طلب صرف',  target:'EXP-2417',  kind:'finance',  detail:'نقص في المستندات المرفقة' },
    { id:'e4', when:'11 مايو 2026 · 16:33', actor:'na', action:'تفعيل 2FA',     target:'الحساب',    kind:'security', detail:'مطلوب لجميع مستخدمي دور المسؤول' },
    { id:'e5', when:'11 مايو 2026 · 10:02', actor:'na', action:'إنشاء دور',     target:'منسّق السلامة', kind:'system', detail:'مبني على دور: مهندس' },
    { id:'e6', when:'10 مايو 2026 · 18:11', actor:'fa', action:'تجاوز ميزانية', target:'CIV-2026-014', kind:'finance', detail:'+142,000 ر.س — قسم ب' },
    { id:'e7', when:'10 مايو 2026 · 13:54', actor:'ms', action:'رفع مستند',     target:'IFC-Drawings-v3.pdf', kind:'project', detail:'مشروع CON-2025-098' },
    { id:'e8', when:'09 مايو 2026 · 17:28', actor:'na', action:'حذف مستخدم',     target:'temp.user@external.sa', kind:'security', detail:'حساب مؤقت منتهي' },
    { id:'e9', when:'09 مايو 2026 · 09:00', actor:'sys',action:'نسخة احتياطية',  target:'القاعدة كاملة', kind:'system',  detail:'تلقائي · 2.4 جيجا' },
  ];

  const KIND = {
    security:{ label:'أمان',    tone:'risk',      icon:'shield' },
    finance: { label:'مالية',    tone:'navy',      icon:'wallet' },
    system:  { label:'نظام',    tone:'neutral',   icon:'settings-2' },
    project: { label:'مشروع',   tone:'progress',  icon:'folder-kanban' },
  };
  const SCOPE_TABS = [
    { id:'all', label:'الكل', count:EVENTS.length },
    { id:'security', label:'أمان', count:EVENTS.filter(e=>e.kind==='security').length },
    { id:'finance',  label:'مالية', count:EVENTS.filter(e=>e.kind==='finance').length },
    { id:'system',   label:'نظام', count:EVENTS.filter(e=>e.kind==='system').length },
    { id:'project',  label:'مشاريع', count:EVENTS.filter(e=>e.kind==='project').length },
  ];
  const visible = scope === 'all' ? EVENTS : EVENTS.filter(e => e.kind === scope);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <Card pad={0}>
        <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center', gap:10 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700 }}>سجل التدقيق</div>
            <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:2 }}>محفوظ لمدة 365 يوماً · غير قابل للتعديل</div>
          </div>
          <div style={{ marginInlineStart:'auto', display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" icon="calendar">آخر 30 يوم</Button>
            <Button variant="secondary" size="sm" icon="user">الفاعل</Button>
            <Button variant="secondary" size="sm" icon="download">CSV</Button>
          </div>
        </div>
        <div style={{ display:'flex', padding:'0 22px', borderBottom:'1px solid var(--border-1)' }}>
          {SCOPE_TABS.map(t => {
            const active = scope === t.id;
            return (
              <div key={t.id} onClick={() => setScope(t.id)} style={{
                padding:'12px 14px 10px', cursor:'pointer', fontSize:13,
                fontWeight: active ? 700 : 500, color: active ? 'var(--ink-900)' : 'var(--ink-600)',
                borderBottom: active ? '2px solid var(--teal-500)' : '2px solid transparent', marginBottom:-1,
                display:'flex', alignItems:'center', gap:8,
              }}>
                {t.label}
                <span className="num" style={{ fontSize:11, padding:'1px 7px', borderRadius:999, background: active ? 'var(--teal-500)' : 'var(--ink-150)', color: active ? '#fff' : 'var(--ink-700)', fontWeight:700 }}>{t.count}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'150px 140px 1fr 1fr 1fr 32px', padding:'10px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11, fontWeight:700, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'0.04em' }}>
          <span>الوقت</span><span>الفاعل</span><span>الإجراء</span><span>الهدف</span><span>التفاصيل</span><span></span>
        </div>
        {visible.map((e, i) => {
          const actor = PEOPLE.find(p => p.id === e.actor);
          const k = KIND[e.kind];
          return (
            <div key={e.id} style={{ display:'grid', gridTemplateColumns:'150px 140px 1fr 1fr 1fr 32px', padding:'14px 22px', borderBottom: i < visible.length-1 ? '1px solid var(--ink-100)' : 'none', alignItems:'center', fontSize:13, gap:10 }}>
              <span style={{ fontSize:11.5, color:'var(--ink-500)' }}>{e.when}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                {e.actor === 'sys' ? (
                  <><div style={{ width:24, height:24, borderRadius:6, background:'var(--ink-100)', color:'var(--ink-700)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="server" size={13}/></div><span style={{ fontSize:12, fontWeight:600 }}>النظام</span></>
                ) : (<><Avatar person={e.actor} size={24}/><span style={{ fontSize:12, fontWeight:600 }}>{actor?.name}</span></>)}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Chip tone={k.tone} dot={false}>{k.label}</Chip>
                <span style={{ fontWeight:600, color:'var(--ink-900)' }}>{e.action}</span>
              </div>
              <span style={{ color:'var(--ink-700)', fontFamily:e.target.match(/^[A-Z0-9\-]+$/)?'var(--font-mono)':'inherit', direction:e.target.match(/^[A-Z0-9\-]+$/)?'ltr':'rtl', fontSize:12 }}>{e.target}</span>
              <span style={{ color:'var(--ink-500)', fontSize:12 }}>{e.detail}</span>
              <Icon name="external-link" size={14} style={{ color:'var(--ink-400)', cursor:'pointer' }}/>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
window.AuditLog = AuditLog;
