// Settings — Admin-focused, RTL Arabic-first
// Multi-section: general / roles & permissions / security / notifications /
// workflow / branding / integrations / data / audit. Permissions matrix is the
// hero — admin can toggle per role × per capability.

const Settings = () => {
  const [tab, setTab] = React.useState('permissions');

  const SECTIONS = [
    { group:'الحساب والمؤسسة', items:[
      { id:'general',     label:'البيانات العامة',     icon:'building-2' },
      { id:'branding',    label:'الهوية والمظهر',     icon:'palette' },
      { id:'localization',label:'اللغة والمنطقة',     icon:'languages' },
    ]},
    { group:'الوصول والصلاحيات', items:[
      { id:'permissions', label:'الأدوار والصلاحيات',  icon:'shield-check' },
      { id:'security',    label:'الأمان وتسجيل الدخول', icon:'lock-keyhole' },
      { id:'audit',       label:'سجل التدقيق',         icon:'file-clock' },
    ]},
    { group:'سير العمل', items:[
      { id:'approvals',   label:'الاعتمادات والحدود',  icon:'check-check' },
      { id:'notify',      label:'قنوات الإشعارات',     icon:'bell-ring' },
      { id:'integrations',label:'الربط والتكاملات',    icon:'plug' },
    ]},
    { group:'البيانات', items:[
      { id:'data',        label:'النسخ الاحتياطي والاستيراد', icon:'database' },
      { id:'billing',     label:'الاشتراك والفوترة',          icon:'credit-card' },
    ]},
  ];

  const PANES = {
    permissions: <PermissionsPane/>,
    general:     <GeneralPane/>,
    branding:    <BrandingPane/>,
    localization:<LocalizationPane/>,
    security:    <SecurityPane/>,
    audit:       <AuditPane/>,
    approvals:   <ApprovalsPane/>,
    notify:      <NotifyPane/>,
    integrations:<IntegrationsPane/>,
    data:        <DataPane/>,
    billing:     <BillingPane/>,
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:18, alignItems:'flex-start' }}>
      {/* Sub-nav */}
      <aside style={{ position:'sticky', top:0 }}>
        <Card pad={10}>
          {SECTIONS.map((g, gi) => (
            <div key={g.group} style={{ marginTop: gi === 0 ? 0 : 10 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--ink-500)', padding:'8px 10px 4px', letterSpacing:'0.02em' }}>{g.group}</div>
              {g.items.map(it => {
                const active = tab === it.id;
                return (
                  <div key={it.id} onClick={() => setTab(it.id)} style={{
                    display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8,
                    cursor:'pointer', fontSize:13, fontWeight: active ? 700 : 500,
                    background: active ? 'var(--navy-050)' : 'transparent',
                    color: active ? 'var(--navy-800)' : 'var(--ink-700)',
                    borderInlineEnd: active ? '3px solid var(--teal-500)' : '3px solid transparent',
                  }}>
                    <Icon name={it.icon} size={16}/>
                    <span>{it.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </Card>

        <Card pad={14} style={{ marginTop:14, background:'var(--navy-050)', border:'1px solid var(--navy-100)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <Icon name="shield" size={16} style={{ color:'var(--navy-700)' }}/>
            <span style={{ fontSize:12, fontWeight:700, color:'var(--navy-800)' }}>وضع المسؤول</span>
          </div>
          <div style={{ fontSize:11.5, color:'var(--ink-600)', lineHeight:1.6 }}>
            تعديل هذه الإعدادات يؤثّر على جميع المستخدمين فوراً. تُسجَّل كل تغيير في سجل التدقيق.
          </div>
        </Card>
      </aside>

      {/* Pane */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        {PANES[tab]}
      </div>
    </div>
  );
};

// ============== Helpers ==============
const Section = ({ title, sub, action, children }) => (
  <Card pad={0}>
    <div style={{ display:'flex', alignItems:'flex-start', padding:'18px 22px', borderBottom:'1px solid var(--border-1)' }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>{title}</div>
        {sub && <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:4, lineHeight:1.6 }}>{sub}</div>}
      </div>
      {action}
    </div>
    <div style={{ padding:'18px 22px' }}>{children}</div>
  </Card>
);

const Row = ({ label, hint, children }) => (
  <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:24, alignItems:'flex-start', padding:'12px 0', borderBottom:'1px solid var(--ink-100)' }}>
    <div>
      <div style={{ fontSize:13, fontWeight:600, color:'var(--ink-800)' }}>{label}</div>
      {hint && <div style={{ fontSize:11.5, color:'var(--ink-500)', marginTop:3, lineHeight:1.6 }}>{hint}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const TextInput = ({ value, placeholder, width='100%', ltr }) => (
  <input defaultValue={value} placeholder={placeholder} style={{
    width, padding:'9px 12px', borderRadius:8, border:'1px solid var(--border-2)',
    fontSize:13, fontFamily:'var(--font-sans)', color:'var(--ink-900)', background:'#fff',
    direction: ltr ? 'ltr' : 'rtl', textAlign: ltr ? 'start' : 'inherit',
  }}/>
);

const Select = ({ value, options, width=220 }) => (
  <select defaultValue={value} style={{
    width, padding:'9px 12px', borderRadius:8, border:'1px solid var(--border-2)',
    fontSize:13, fontFamily:'var(--font-sans)', color:'var(--ink-900)', background:'#fff',
  }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>
);

const Toggle = ({ on=false }) => {
  const [v, setV] = React.useState(on);
  return (
    <button onClick={() => setV(!v)} style={{
      width:38, height:22, borderRadius:999, border:'none', cursor:'pointer',
      background: v ? 'var(--teal-500)' : 'var(--ink-200)',
      position:'relative', padding:0, transition:'background var(--dur-2) var(--ease-out)',
    }}>
      <span style={{
        position:'absolute', top:2, [v ? 'left' : 'right']:2,
        width:18, height:18, borderRadius:'50%', background:'#fff',
        boxShadow:'0 1px 3px rgba(0,0,0,.2)', transition:'all var(--dur-2)',
      }}/>
    </button>
  );
};

// ============== Permissions Matrix ==============
const PermissionsPane = () => {
  const ROLES = [
    { id:'admin',    label:'مسؤول',       color:'var(--navy-800)' },
    { id:'pm',       label:'مدير مشروع',  color:'var(--teal-600)' },
    { id:'engineer', label:'مهندس',       color:'var(--blue-600)' },
    { id:'finance',  label:'مالي',        color:'var(--warning-700)' },
    { id:'vendor',   label:'مورد',        color:'var(--ink-600)' },
  ];

  // Permission map: a/r/w/m = admin/read/write/manage (we use checkmarks per cell)
  // Levels: '—' none · '◔' view · '◕' edit · '●' manage
  const SECTIONS = [
    { title:'المشاريع', rows:[
      ['عرض المشاريع',           ['●','●','◔','◕','◔']],
      ['إنشاء/حذف مشروع',         ['●','◕','—','—','—']],
      ['تعديل بنود المشروع',      ['●','●','—','◔','—']],
      ['اعتماد التغييرات',        ['●','◕','—','—','—']],
    ]},
    { title:'المهام والفِرَق', rows:[
      ['عرض المهام',              ['●','●','●','◔','◔']],
      ['إنشاء/تعديل المهام',       ['●','●','◕','—','—']],
      ['تعيين المهندسين',          ['●','●','—','—','—']],
      ['إغلاق المهام',             ['●','●','◕','—','◕']],
    ]},
    { title:'المتابعة المالية', rows:[
      ['عرض الفواتير',             ['●','◕','—','●','◔']],
      ['إصدار/تعديل الفاتورة',     ['●','—','—','●','◕']],
      ['اعتماد الدفع',              ['●','—','—','◕','—']],
      ['عرض الميزانيات',            ['●','●','—','●','—']],
    ]},
    { title:'الموردون', rows:[
      ['عرض الموردين',              ['●','●','◔','●','◔']],
      ['تأهيل/إيقاف مورد',          ['●','◕','—','◔','—']],
    ]},
    { title:'النظام', rows:[
      ['إدارة المستخدمين',          ['●','—','—','—','—']],
      ['تعديل الأدوار والصلاحيات',   ['●','—','—','—','—']],
      ['الاطلاع على سجل التدقيق',    ['●','◔','—','◔','—']],
    ]},
  ];

  const LEVEL_TONES = {
    '●': { bg:'var(--success-050)', fg:'var(--success-700)', label:'إدارة كاملة' },
    '◕': { bg:'var(--teal-050)',    fg:'var(--teal-700)',    label:'تحرير' },
    '◔': { bg:'var(--ink-100)',     fg:'var(--ink-700)',     label:'اطّلاع' },
    '—': { bg:'transparent',         fg:'var(--ink-300)',     label:'بدون وصول' },
  };

  return (
    <>
      {/* Roles overview */}
      <Section
        title="الأدوار والصلاحيات"
        sub="حدّد ما يمكن لكل دور رؤيته وتعديله عبر النظام. التغييرات تُطبَّق فوراً ويتم تسجيلها."
        action={
          <div style={{ display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" icon="download">تصدير المصفوفة</Button>
            <Button variant="primary"   size="sm" icon="plus">دور مخصّص</Button>
          </div>
        }
      >
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:6 }}>
          {ROLES.map(r => {
            const info = ROLE_INFO[r.id];
            const n = USERS.filter(u => u.role === r.id).length;
            return (
              <div key={r.id} style={{ padding:12, border:'1px solid var(--border-1)', borderRadius:10, background:'#fff' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:'var(--navy-050)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon name={info?.icon || 'shield'} size={14} style={{ color:r.color }}/>
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'var(--ink-900)' }}>{r.label}</span>
                </div>
                <div style={{ fontSize:11.5, color:'var(--ink-500)', lineHeight:1.55, minHeight:32 }}>{info?.desc}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, fontSize:11, color:'var(--ink-600)' }}>
                  <span><b className="num" style={{ color:'var(--ink-900)' }}>{n}</b> مستخدم</span>
                  <a style={{ color:'var(--teal-700)', fontWeight:600, cursor:'pointer' }}>تعديل</a>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Custom roles */}
      <Section
        title="أدوار مخصّصة"
        sub="أنشئ أدواراً تناسب فِرَقك. يمكن أن تُستخدم بالإضافة إلى الأدوار الافتراضية الخمسة."
        action={<Button variant="secondary" size="sm" icon="plus">إنشاء دور</Button>}
      >
        {[
          { name:'منسّق السلامة', base:'مهندس', users:3, desc:'وصول للمهام والتقارير + إدارة سجلات الحوادث' },
          { name:'مراقب الجودة',   base:'مهندس', users:2, desc:'اطّلاع على جميع المشاريع + تحرير قوائم التحقق' },
        ].map((r,i,a) => (
          <div key={r.name} style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 100px 1fr 90px', gap:14, alignItems:'center', padding:'12px 0', borderBottom: i < a.length-1 ? '1px solid var(--ink-100)' : 'none' }}>
            <div style={{ fontSize:13, fontWeight:700, color:'var(--ink-900)' }}>{r.name}</div>
            <Chip tone="navy" dot={false}>مبني على: {r.base}</Chip>
            <span style={{ fontSize:12, color:'var(--ink-600)' }}><b className="num" style={{ color:'var(--ink-900)' }}>{r.users}</b> مستخدم</span>
            <span style={{ fontSize:11.5, color:'var(--ink-500)', lineHeight:1.5 }}>{r.desc}</span>
            <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
              <Button variant="ghost" size="sm">تعديل</Button>
            </div>
          </div>
        ))}
      </Section>

      {/* Per-project override notice */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 16px', borderRadius:10, background:'var(--teal-050)', border:'1px solid var(--teal-100)' }}>
        <Icon name="info" size={16} style={{ color:'var(--teal-700)', marginTop:2 }}/>
        <div style={{ fontSize:12.5, color:'var(--ink-700)', lineHeight:1.6, flex:1 }}>
          <b style={{ color:'var(--ink-900)' }}>تجاوز خاص بكل مشروع متاح.</b> يمكنك منح أو سحب صلاحية معيّنة لمستخدم في سياق مشروع محدّد من <a style={{ color:'var(--teal-700)', fontWeight:700, cursor:'pointer' }}>صفحة المشروع · الفريق والصلاحيات</a> دون التأثير على دوره العام.
        </div>
      </div>

      {/* Matrix */}
      <Card pad={0}>
        <div style={{ display:'flex', alignItems:'center', padding:'16px 22px', borderBottom:'1px solid var(--border-1)' }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>مصفوفة الصلاحيات</div>
            <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:3 }}>اضغط على أي خلية لتدوير المستوى: اطّلاع → تحرير → إدارة كاملة → بدون.</div>
          </div>
          <div style={{ marginInlineStart:'auto', display:'flex', gap:12, alignItems:'center' }}>
            {Object.entries(LEVEL_TONES).map(([k,v]) => (
              <span key={k} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:11.5, color:'var(--ink-600)' }}>
                <span style={{ width:18, height:18, borderRadius:5, background:v.bg, color:v.fg, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, border: k==='—' ? '1px dashed var(--ink-200)' : 'none' }}>{k}</span>
                {v.label}
              </span>
            ))}
          </div>
        </div>

        <div>
          {/* Head */}
          <div style={{ display:'grid', gridTemplateColumns:`1.5fr repeat(${ROLES.length}, 1fr)`, padding:'10px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
            <span>الصلاحية</span>
            {ROLES.map(r => <span key={r.id} style={{ textAlign:'center' }}>{r.label}</span>)}
          </div>
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <div style={{ padding:'10px 22px 6px', fontSize:12, fontWeight:700, color:'var(--teal-700)', background:'#fff' }}>{s.title}</div>
              {s.rows.map(([name, levels], i) => (
                <div key={i} style={{
                  display:'grid', gridTemplateColumns:`1.5fr repeat(${ROLES.length}, 1fr)`,
                  padding:'10px 22px', alignItems:'center', borderTop:'1px solid var(--ink-100)', fontSize:13,
                }}>
                  <span style={{ color:'var(--ink-800)', fontWeight:500 }}>{name}</span>
                  {levels.map((lv, j) => {
                    const t = LEVEL_TONES[lv];
                    return (
                      <div key={j} style={{ display:'flex', justifyContent:'center' }}>
                        <span style={{
                          width:30, height:24, borderRadius:6, background:t.bg, color:t.fg,
                          display:'inline-flex', alignItems:'center', justifyContent:'center',
                          fontSize:13, fontWeight:700, cursor:'pointer',
                          border: lv==='—' ? '1px dashed var(--ink-200)' : 'none',
                        }}>{lv}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8, padding:'14px 22px', background:'var(--ink-050)', borderTop:'1px solid var(--border-1)' }}>
          <Button variant="ghost" size="sm">استعادة الافتراضي</Button>
          <Button variant="secondary" size="sm">إلغاء</Button>
          <Button variant="primary" size="sm" icon="check">حفظ التغييرات</Button>
        </div>
      </Card>
    </>
  );
};

// ============== General ==============
const GeneralPane = () => (
  <Section
    title="بيانات المؤسسة"
    sub="تظهر هذه البيانات على الفواتير والتقارير المُصدَّرة."
    action={<Button variant="primary" size="sm" icon="check">حفظ</Button>}
  >
    <Row label="اسم المؤسسة">           <TextInput value="مجموعة الفيصل للمقاولات"/></Row>
    <Row label="السجل التجاري" hint="10 أرقام"><TextInput value="1010234567" ltr width={220}/></Row>
    <Row label="الرقم الضريبي"><TextInput value="300123456700003" ltr width={260}/></Row>
    <Row label="الموقع الرئيسي"><TextInput value="الرياض · حي الورود · طريق الملك فهد"/></Row>
    <Row label="البريد الرسمي"><TextInput value="ops@alfaisal-group.sa" ltr/></Row>
    <Row label="الهاتف"><TextInput value="+966 11 488 9000" ltr width={220}/></Row>
  </Section>
);

// ============== Branding ==============
const BrandingPane = () => (
  <Section title="الهوية والمظهر" sub="استبدل الشعار وحدد الألوان الأساسية. تظهر في الشريط الجانبي وصفحة الدخول.">
    <Row label="الشعار الكامل" hint="PNG/SVG · بحد أقصى 1 ميجابايت">
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:120, height:60, borderRadius:8, border:'1px dashed var(--border-2)', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <img src="../../assets/logo-icon.svg" style={{ width:38, height:38 }}/>
        </div>
        <Button variant="secondary" size="sm" icon="upload">استبدال</Button>
        <Button variant="ghost" size="sm">إزالة</Button>
      </div>
    </Row>
    <Row label="اللون الأساسي" hint="لون التطبيق الرئيسي">
      <div style={{ display:'flex', gap:8 }}>
        {['#0F2A4A','#14385F','#1C4877','#285A8E'].map((c,i) => (
          <span key={c} style={{ width:32, height:32, borderRadius:8, background:c, border: i===0 ? '2px solid var(--teal-500)' : '2px solid transparent', cursor:'pointer' }}/>
        ))}
      </div>
    </Row>
    <Row label="اللون المميّز" hint="الأزرار النشطة، الروابط، التركيز">
      <div style={{ display:'flex', gap:8 }}>
        {['#17A2A2','#0E7A7A','#3FB6B6','#1F6FA6'].map((c,i) => (
          <span key={c} style={{ width:32, height:32, borderRadius:8, background:c, border: i===0 ? '2px solid var(--navy-800)' : '2px solid transparent', cursor:'pointer' }}/>
        ))}
      </div>
    </Row>
    <Row label="المظهر الافتراضي">
      <div style={{ display:'flex', gap:8 }}>
        {['فاتح','داكن','تلقائي'].map((m,i) => (
          <span key={m} style={{ padding:'6px 14px', borderRadius:999, border: i===0 ? '1px solid var(--navy-800)':'1px solid var(--border-2)', background: i===0 ? 'var(--navy-050)' : '#fff', color:'var(--ink-800)', fontSize:13, fontWeight: i===0 ? 700 : 500, cursor:'pointer' }}>{m}</span>
        ))}
      </div>
    </Row>
  </Section>
);

// ============== Localization ==============
const LocalizationPane = () => (
  <Section title="اللغة والمنطقة">
    <Row label="اللغة الافتراضية"><Select value="العربية" options={['العربية','English']}/></Row>
    <Row label="اتجاه الواجهة"><Select value="من اليمين إلى اليسار" options={['من اليمين إلى اليسار','من اليسار إلى اليمين']}/></Row>
    <Row label="المنطقة الزمنية"><Select value="آسيا/الرياض (GMT+3)" options={['آسيا/الرياض (GMT+3)','آسيا/دبي (GMT+4)']}/></Row>
    <Row label="تنسيق التاريخ" hint="يظهر في التقارير والفواتير">
      <div style={{ display:'flex', gap:8 }}>
        {['18 مايو 2026','18 مايو 2026','2026-05-18'].map((d,i) => (
          <span key={d} style={{ padding:'6px 14px', borderRadius:999, border: i===1 ? '1px solid var(--navy-800)':'1px solid var(--border-2)', background: i===1 ? 'var(--navy-050)' : '#fff', color:'var(--ink-800)', fontSize:13, fontWeight: i===1 ? 700 : 500, cursor:'pointer' }}>{d}</span>
        ))}
      </div>
    </Row>
    <Row label="العملة" hint="عملة العرض الافتراضية"><Select value="ريال سعودي (ر.س)" options={['ريال سعودي (ر.س)','درهم إماراتي','دولار أمريكي']}/></Row>
    <Row label="بداية السنة المالية"><Select value="1 يناير" options={['1 يناير','1 أبريل','1 يوليو']} width={160}/></Row>
  </Section>
);

// ============== Security ==============
const SecurityPane = () => (
  <>
    <Section title="سياسة كلمة المرور">
      <Row label="الحد الأدنى للأحرف"><Select value="12 حرفاً" options={['8 أحرف','10 أحرف','12 حرفاً','14 حرفاً']} width={160}/></Row>
      <Row label="تعقيد كلمة المرور" hint="أحرف كبيرة وصغيرة وأرقام ورموز">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}><Toggle on/><span style={{ fontSize:12, color:'var(--ink-600)' }}>مطلوب</span></div>
      </Row>
      <Row label="إعادة تعيين دورية"><Select value="كل 90 يوماً" options={['معطّل','كل 30 يوماً','كل 60 يوماً','كل 90 يوماً']} width={180}/></Row>
      <Row label="منع إعادة استخدام آخر"><Select value="5 كلمات" options={['كلمتان','3 كلمات','5 كلمات','10 كلمات']} width={160}/></Row>
    </Section>
    <Section title="المصادقة وتسجيل الدخول">
      <Row label="المصادقة الثنائية (2FA)" hint="مطلوب لجميع المسؤولين والمالية">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}><Toggle on/><span style={{ fontSize:12, color:'var(--ink-600)' }}>مفعّل · تطبيق مصادقة + رسالة نصية</span></div>
      </Row>
      <Row label="تسجيل الدخول الموحّد (SSO)" hint="عبر Microsoft Entra ID">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}><Toggle/><Button variant="ghost" size="sm">إعداد</Button></div>
      </Row>
      <Row label="مهلة الجلسة"><Select value="4 ساعات" options={['ساعة','ساعتان','4 ساعات','8 ساعات','24 ساعة']} width={160}/></Row>
      <Row label="محاولات الدخول الفاشلة"><Select value="بعد 5 محاولات يُقفل 30 دقيقة" options={['بعد 3 محاولات يُقفل 15 دقيقة','بعد 5 محاولات يُقفل 30 دقيقة','بعد 10 محاولات يُقفل ساعة']} width={300}/></Row>
      <Row label="عناوين IP المسموح بها" hint="اتركها فارغة للسماح من أي مكان"><TextInput value="" placeholder="مثال: 212.118.10.0/24" ltr/></Row>
    </Section>
  </>
);

// ============== Audit ==============
const AuditPane = () => {
  const LOG = [
    { who:'na', verb:'حدّثت',   what:'مصفوفة الصلاحيات — أضافت "اعتماد الدفع" للمدير المالي', when:'قبل 12 دقيقة', kind:'security' },
    { who:'na', verb:'دعت',     what:'أحمد حسين (مهندس)', when:'قبل 40 دقيقة', kind:'user' },
    { who:'fa', verb:'اعتمد',   what:'INV-08842 — 184,500 ر.س', when:'قبل ساعة', kind:'finance' },
    { who:'na', verb:'علّقت',   what:'حساب يوسف خليل', when:'قبل 4 ساعات', kind:'security' },
    { who:'sl', verb:'صدّرت',   what:'تقرير المتابعة المالية — أبريل', when:'أمس', kind:'export' },
    { who:'na', verb:'فعّلت',   what:'تكامل ZATCA للفوترة الإلكترونية', when:'قبل يومين', kind:'system' },
  ];
  const KIND_TONE = { security:'risk', user:'navy', finance:'progress', export:'review', system:'completed' };
  const KIND_LABEL = { security:'أمان', user:'مستخدمون', finance:'مالية', export:'تصدير', system:'نظام' };
  return (
    <Section
      title="سجل التدقيق"
      sub="كل تغيير حسّاس مسجَّل مع المنفّذ والوقت. غير قابل للحذف."
      action={
        <div style={{ display:'flex', gap:8 }}>
          <Button variant="secondary" size="sm" icon="filter">المرشّحات</Button>
          <Button variant="secondary" size="sm" icon="download">تصدير CSV</Button>
        </div>
      }
    >
      {LOG.map((l, i) => {
        const p = PEOPLE.find(x => x.id === l.who);
        return (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:14, alignItems:'center', padding:'12px 0', borderBottom: i < LOG.length-1 ? '1px solid var(--ink-100)' : 'none' }}>
            <Avatar person={l.who} size={32}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, color:'var(--ink-800)' }}>
                <b style={{ color:'var(--ink-900)' }}>{p?.name}</b> {l.verb} <span style={{ color:'var(--ink-600)' }}>{l.what}</span>
              </div>
            </div>
            <Chip tone={KIND_TONE[l.kind]} dot={false}>{KIND_LABEL[l.kind]}</Chip>
            <span style={{ fontSize:11.5, color:'var(--ink-500)' }}>{l.when}</span>
          </div>
        );
      })}
    </Section>
  );
};

// ============== Approvals ==============
const ApprovalsPane = () => (
  <>
    <Section title="حدود الاعتماد المالي" sub="فوق هذه الحدود يتطلّب الصرف موافقة المستوى الأعلى.">
      <Row label="مدير المشروع"><div style={{ display:'flex', alignItems:'center', gap:10 }}><TextInput value="50,000" ltr width={140}/><span style={{ fontSize:13, color:'var(--ink-600)' }}>ر.س لكل بند</span></div></Row>
      <Row label="المسؤول المالي"><div style={{ display:'flex', alignItems:'center', gap:10 }}><TextInput value="250,000" ltr width={140}/><span style={{ fontSize:13, color:'var(--ink-600)' }}>ر.س لكل بند</span></div></Row>
      <Row label="المسؤول"><div style={{ display:'flex', alignItems:'center', gap:10 }}><TextInput value="غير محدود" width={140}/></div></Row>
    </Section>
    <Section title="سلسلة اعتماد الفاتورة">
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 0' }}>
        {['مهندس الموقع','مدير المشروع','المسؤول المالي','المسؤول'].map((s,i,a) => (
          <React.Fragment key={s}>
            <div style={{ padding:'8px 14px', borderRadius:10, background: i===0 ? 'var(--teal-050)' : 'var(--ink-050)', border:'1px solid var(--border-1)', fontSize:13, fontWeight:600, color:'var(--ink-800)' }}>{s}</div>
            {i < a.length - 1 && <Icon name="arrow-left" size={16} mirror style={{ color:'var(--ink-400)' }}/>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:6 }}>اسحب الخطوات لإعادة ترتيبها، أو أضف خطوة موافقة جديدة.</div>
      <div style={{ marginTop:10 }}><Button variant="secondary" size="sm" icon="plus">إضافة خطوة</Button></div>
    </Section>
  </>
);

// ============== Notify channels ==============
const NotifyPane = () => {
  const ROWS = [
    ['فاتورة متأخّرة',         [true, true, true, false]],
    ['مشروع في خطر',           [true, true, false, true]],
    ['مهمة بانتظار المراجعة',   [true, false, false, false]],
    ['مورد جديد للتأهيل',       [true, true, false, false]],
    ['تغيير صلاحيات',           [true, false, true, false]],
    ['تنبيهات النظام',          [true, false, false, false]],
  ];
  return (
    <Section title="قنوات الإشعارات" sub="حدّد القناة المناسبة لكل نوع إشعار. يطبَّق على جميع المستخدمين كافتراضي.">
      <div style={{ display:'grid', gridTemplateColumns:'2fr repeat(4,1fr)', gap:0, padding:'10px 0', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
        <span>نوع الإشعار</span>
        <span style={{ textAlign:'center' }}>داخل التطبيق</span>
        <span style={{ textAlign:'center' }}>بريد إلكتروني</span>
        <span style={{ textAlign:'center' }}>SMS</span>
        <span style={{ textAlign:'center' }}>Webhook</span>
      </div>
      {ROWS.map(([name, vals], i) => (
        <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr repeat(4,1fr)', gap:0, padding:'12px 0', borderBottom: i < ROWS.length-1 ? '1px solid var(--ink-100)' : 'none', alignItems:'center' }}>
          <span style={{ fontSize:13, color:'var(--ink-800)', fontWeight:500 }}>{name}</span>
          {vals.map((on, j) => (
            <div key={j} style={{ display:'flex', justifyContent:'center' }}><Toggle on={on}/></div>
          ))}
        </div>
      ))}
    </Section>
  );
};

// ============== Integrations ==============
const IntegrationsPane = () => {
  const INT = [
    { name:'ZATCA — الفوترة الإلكترونية', desc:'إصدار الفواتير الإلكترونية والربط مع هيئة الزكاة والضريبة', icon:'file-check-2', on:true },
    { name:'SAP S/4HANA',                  desc:'مزامنة بنود المشاريع والميزانيات', icon:'database', on:true },
    { name:'Microsoft Entra ID (SSO)',     desc:'تسجيل دخول موحّد مع حسابات المؤسسة', icon:'key-round', on:false },
    { name:'WhatsApp Business',            desc:'إرسال إشعارات المهام والفواتير', icon:'message-circle', on:true },
    { name:'Google Drive',                 desc:'ربط مخططات وملفات المشاريع', icon:'folder', on:false },
    { name:'DocuSign',                     desc:'توقيع العقود إلكترونياً', icon:'pen-tool', on:false },
  ];
  return (
    <Section title="الربط والتكاملات">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
        {INT.map(it => (
          <div key={it.name} style={{ padding:14, border:'1px solid var(--border-1)', borderRadius:10, display:'flex', alignItems:'flex-start', gap:12, background:'#fff' }}>
            <div style={{ width:36, height:36, borderRadius:9, background:'var(--navy-050)', color:'var(--navy-700)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon name={it.icon} size={18}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--ink-900)' }}>{it.name}</div>
              <div style={{ fontSize:11.5, color:'var(--ink-500)', marginTop:3, lineHeight:1.55 }}>{it.desc}</div>
              <div style={{ marginTop:10, display:'flex', alignItems:'center', gap:8 }}>
                {it.on ? <Chip tone="completed">متصل</Chip> : <Chip tone="neutral" dot={false}>غير مفعّل</Chip>}
                <a style={{ marginInlineStart:'auto', color:'var(--teal-700)', fontSize:12, fontWeight:600, cursor:'pointer' }}>{it.on ? 'إعدادات' : 'تفعيل'}</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

// ============== Data ==============
const DataPane = () => (
  <>
    <Section title="النسخ الاحتياطي" sub="نسخة تلقائية يومياً إلى مستودع مشفّر.">
      <Row label="جدولة النسخ"><Select value="يومياً · 02:00 ص" options={['يدوياً','يومياً · 02:00 ص','كل 12 ساعة','أسبوعياً']} width={220}/></Row>
      <Row label="مدة الاحتفاظ"><Select value="90 يوماً" options={['30 يوماً','60 يوماً','90 يوماً','سنة']} width={160}/></Row>
      <Row label="آخر نسخة" hint="مكتملة بنجاح">
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <Chip tone="completed">ناجحة</Chip>
          <span style={{ fontSize:12, color:'var(--ink-600)' }}>اليوم · 02:04 ص · 214 ميجابايت</span>
          <Button variant="secondary" size="sm" icon="download" style={{ marginInlineStart:'auto' }}>تنزيل</Button>
        </div>
      </Row>
    </Section>
    <Section title="استيراد وتصدير">
      <Row label="استيراد المشاريع (CSV/Excel)"><Button variant="secondary" size="sm" icon="upload">رفع ملف</Button></Row>
      <Row label="تصدير كامل البيانات"><Button variant="secondary" size="sm" icon="download">طلب أرشيف ZIP</Button></Row>
      <Row label="حذف بيانات تجريبية" hint="إجراء لا يمكن التراجع عنه"><Button variant="danger" size="sm" icon="trash-2">حذف البيانات التجريبية</Button></Row>
    </Section>
  </>
);

// ============== Billing ==============
const BillingPane = () => (
  <>
    <Section title="خطة الاشتراك" action={<Button variant="secondary" size="sm">تغيير الخطة</Button>}>
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:'4px 0' }}>
        <div style={{ width:48, height:48, borderRadius:10, background:'var(--teal-050)', color:'var(--teal-700)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="zap" size={20}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:16, fontWeight:700, color:'var(--ink-900)' }}>خطة المؤسسة</div>
          <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:3 }}>غير محدود من المشاريع · حتى 250 مستخدماً · دعم مخصّص</div>
        </div>
        <div style={{ textAlign:'end' }}>
          <div className="num" style={{ fontSize:22, fontWeight:700, color:'var(--ink-900)' }}>4,800 ر.س</div>
          <div style={{ fontSize:11.5, color:'var(--ink-500)' }}>شهرياً · تجدّد 1 يونيو 2026</div>
        </div>
      </div>
    </Section>
    <Section title="استخدام الموارد">
      <Row label="المستخدمون النشطون">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, maxWidth:280 }}><Progress value={32} status="progress"/></div>
          <span className="num" style={{ fontSize:13, fontWeight:700 }}>48 / 250</span>
        </div>
      </Row>
      <Row label="المساحة التخزينية">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, maxWidth:280 }}><Progress value={61} status="progress"/></div>
          <span className="num" style={{ fontSize:13, fontWeight:700 }}>61.4 / 100 GB</span>
        </div>
      </Row>
      <Row label="رسائل SMS هذا الشهر">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, maxWidth:280 }}><Progress value={83} status="risk"/></div>
          <span className="num" style={{ fontSize:13, fontWeight:700 }}>2,488 / 3,000</span>
        </div>
      </Row>
    </Section>
  </>
);

window.Settings = Settings;
