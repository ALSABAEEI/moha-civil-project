// Approvals inbox — "things waiting on me" queue. RTL Arabic-first.
// Types: invoice approval, change order, vendor onboarding, expense, budget override, task assignment.

const Approvals = () => {
  const [tab, setTab] = React.useState('mine');

  const KIND = {
    invoice:   { label:'فاتورة',          icon:'receipt',        tone:'navy' },
    change:    { label:'أمر تغيير',        icon:'file-pen-line',  tone:'review' },
    vendor:    { label:'تأهيل مورد',       icon:'shield-check',   tone:'progress' },
    expense:   { label:'طلب صرف',          icon:'wallet',         tone:'navy' },
    budget:    { label:'تجاوز ميزانية',    icon:'triangle-alert', tone:'risk' },
    timeoff:   { label:'إجازة',            icon:'calendar-off',   tone:'neutral' },
  };

  const ITEMS = [
    { id:'AP-2401', kind:'budget',  title:'تجاوز ميزانية القسم ب — CIV-2026-014',
      requester:'fa', amount:142000, project:'CIV-2026-014',
      when:'قبل 8 دقائق', priority:'high',
      detail:'محطة الرياض الفرعية الشمالية · بند الحديد المسلّح' },
    { id:'AP-2402', kind:'invoice', title:'فاتورة INV-08851 — الفيصل للأعمال المدنية',
      requester:'sl', amount:421000, project:'CON-2025-098',
      when:'قبل 25 دقيقة', priority:'normal',
      detail:'الدفعة 4 من 12 · معتمدة من الاستشاري' },
    { id:'AP-2403', kind:'change',  title:'أمر تغيير CO-014 — تحديث مسارات الكابلات',
      requester:'fa', amount:78500, project:'CIV-2026-014',
      when:'قبل ساعة', priority:'high',
      detail:'بطلب من الاستشاري · إضافة 240م كابل جهد متوسط' },
    { id:'AP-2404', kind:'vendor',  title:'تأهيل: الخليج للخدمات الفنية',
      requester:'na', amount:null, project:null,
      when:'قبل 3 ساعات', priority:'normal',
      detail:'ملف التأهيل مكتمل · شهادة سعودة سارية' },
    { id:'AP-2405', kind:'expense', title:'صرف عاجل — توريد إسمنت Type V',
      requester:'ms', amount:28400, project:'CIV-2026-014',
      when:'قبل 5 ساعات', priority:'normal',
      detail:'بديل لمورّد متأخر · 120 كيس · موقع جدة' },
    { id:'AP-2406', kind:'timeoff', title:'طلب إجازة — يوسف خليل',
      requester:'yk', amount:null, project:null,
      when:'أمس', priority:'low',
      detail:'5 أيام · 20–24 مايو 2026' },
  ];

  const MINE = ITEMS;
  const REQUESTED = ITEMS.slice(2, 4);

  const TABS = [
    { id:'mine',     label:'بانتظاري',  count:MINE.length },
    { id:'requested',label:'طلباتي',     count:REQUESTED.length },
    { id:'approved', label:'المعتمدة',   count:14 },
    { id:'rejected', label:'المرفوضة',   count:2 },
    { id:'all',      label:'الكل' },
  ];

  const visible = tab === 'mine' ? MINE
               : tab === 'requested' ? REQUESTED
               : tab === 'approved' ? [] : tab === 'rejected' ? [] : ITEMS;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {/* Summary band */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <Card pad={14}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--warning-050)', color:'var(--warning-700)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="clock-9" size={16}/></div>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)' }}>بانتظار اعتمادي</span>
          </div>
          <div className="num" style={{ fontSize:24, fontWeight:800, color:'var(--ink-900)' }}>{MINE.length}</div>
          <div style={{ fontSize:11.5, color:'var(--ink-500)', marginTop:4 }}>2 بأولوية عالية</div>
        </Card>
        <Card pad={14}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--teal-050)', color:'var(--teal-700)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="wallet" size={16}/></div>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)' }}>قيمة المبالغ بانتظاري</span>
          </div>
          <div className="money" style={{ fontSize:22, fontWeight:800, color:'var(--ink-900)' }}>669,900.00 ر.س</div>
          <div style={{ fontSize:11.5, color:'var(--ink-500)', marginTop:4 }}>عبر 4 طلبات</div>
        </Card>
        <Card pad={14}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--navy-050)', color:'var(--navy-700)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="timer" size={16}/></div>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)' }}>متوسط زمن الاعتماد</span>
          </div>
          <div className="num" style={{ fontSize:24, fontWeight:800, color:'var(--ink-900)' }}>3.2<span style={{ fontSize:14, color:'var(--ink-500)', marginInlineStart:6 }}>ساعة</span></div>
          <div style={{ fontSize:11.5, color:'var(--success-700)', marginTop:4 }}>أسرع بـ 18٪ من الشهر الماضي</div>
        </Card>
        <Card pad={14}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--danger-050)', color:'var(--danger-700)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name="alarm-clock" size={16}/></div>
            <span style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)' }}>متأخرة عن الاتفاقية</span>
          </div>
          <div className="num" style={{ fontSize:24, fontWeight:800, color:'var(--danger-700)' }}>1</div>
          <div style={{ fontSize:11.5, color:'var(--ink-500)', marginTop:4 }}>تجاوزت 24 ساعة</div>
        </Card>
      </div>

      {/* Tabs */}
      <Card pad={0}>
        <div style={{ display:'flex', alignItems:'center', padding:'0 22px', borderBottom:'1px solid var(--border-1)' }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <div key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'14px 14px 12px', cursor:'pointer', fontSize:13,
                fontWeight: active ? 700 : 500, color: active ? 'var(--ink-900)' : 'var(--ink-600)',
                borderBottom: active ? '2px solid var(--teal-500)' : '2px solid transparent',
                marginBottom:-1, display:'flex', alignItems:'center', gap:8,
              }}>
                {t.label}
                {t.count != null && (
                  <span className="num" style={{ fontSize:11, padding:'1px 7px', borderRadius:999, background: active ? 'var(--teal-500)' : 'var(--ink-150)', color: active ? '#fff' : 'var(--ink-700)', fontWeight:700 }}>{t.count}</span>
                )}
              </div>
            );
          })}
          <div style={{ marginInlineStart:'auto', display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" icon="filter">المرشّحات</Button>
            <Button variant="secondary" size="sm" icon="settings">قواعد الاعتماد</Button>
          </div>
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <div style={{ padding:'60px 20px', textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:14, background:'var(--ink-050)', margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name="check-check" size={26} style={{ color:'var(--ink-400)' }}/>
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:'var(--ink-800)' }}>لا توجد عناصر هنا</div>
            <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:4 }}>يظهر هنا ما يخص هذه الفئة عند توفّره.</div>
          </div>
        ) : (
          visible.map((it, i) => {
            const k = KIND[it.kind];
            const requester = PEOPLE.find(p => p.id === it.requester);
            const proj = it.project ? PROJECTS.find(p => p.code === it.project) : null;
            return (
              <div key={it.id} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto auto auto', gap:16, padding:'16px 22px', alignItems:'center', borderBottom: i < visible.length-1 ? '1px solid var(--ink-100)' : 'none' }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'var(--ink-050)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-700)' }}>
                  <Icon name={k.icon} size={18}/>
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <Chip tone={k.tone} dot={false}>{k.label}</Chip>
                    {it.priority === 'high' && <Chip tone="risk">أولوية عالية</Chip>}
                    <span style={{ fontSize:11, color:'var(--ink-400)', fontFamily:'var(--font-mono)', direction:'ltr' }}>{it.id}</span>
                    {proj && <span style={{ fontSize:11, color:'var(--ink-500)' }}>· {proj.name}</span>}
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--ink-900)', lineHeight:1.45 }}>{it.title}</div>
                  <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:3, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <span>{it.detail}</span>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Avatar person={it.requester} size={28}/>
                  <div style={{ display:'flex', flexDirection:'column', lineHeight:1.25 }}>
                    <span style={{ fontSize:12, fontWeight:600, color:'var(--ink-800)' }}>{requester?.name}</span>
                    <span style={{ fontSize:11, color:'var(--ink-500)' }}>{it.when}</span>
                  </div>
                </div>
                <div style={{ textAlign:'end', minWidth:130 }}>
                  {it.amount != null
                    ? <span className="money" style={{ fontSize:14, fontWeight:700, color:'var(--ink-900)' }}>{SAR(it.amount)}</span>
                    : <span style={{ fontSize:12, color:'var(--ink-400)' }}>—</span>}
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Button variant="danger" size="sm">رفض</Button>
                  <Button variant="ghost" size="sm">طلب توضيح</Button>
                  <Button variant="accent" size="sm" icon="check">اعتماد</Button>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
};
window.Approvals = Approvals;
