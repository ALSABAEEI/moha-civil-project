// Project detail — overview, tasks, terms, financial summary
const ProjectDetail = ({ projectId, onBack }) => {
  const p = PROJECTS.find(x => x.id === projectId) || PROJECTS[0];
  const [tab, setTab] = React.useState('overview');
  const projectTasks = TASKS.filter(t => t.project === p.id);
  const TABS = [
    { id:'overview', label:'نظرة عامة' },
    { id:'tasks',    label:'المهام' },
    { id:'terms',    label:'بنود المشروع' },
    { id:'finance',  label:'المالية' },
    { id:'team',     label:'الفريق والصلاحيات' },
  ];

  const Header = () => (
    <Card pad={0}>
      <div style={{ padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>
        <button onClick={onBack} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'transparent', border:'none', cursor:'pointer', color:'var(--ink-600)', fontSize:12, padding:0, fontFamily:'var(--font-sans)', alignSelf:'flex-start' }}>
          <Icon name="chevron-right" size={14}/>
          العودة إلى المشاريع
        </button>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:8, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="num" style={{ fontSize:12, color:'var(--ink-500)' }}>{p.code}</span>
              <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--ink-300)' }}/>
              <span style={{ fontSize:12, color:'var(--ink-500)' }}>{p.discipline}</span>
              <StatusChip status={p.status}/>
            </div>
            <div style={{ fontSize:22, fontWeight:700, color:'var(--ink-900)' }}>{p.name}</div>
            <div style={{ display:'flex', gap:18, fontSize:13, color:'var(--ink-600)', flexWrap:'wrap' }}>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="building-2" size={14}/>{p.client}</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="map-pin" size={14}/>{p.location}</span>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="calendar" size={14}/>التسليم {p.due}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Button variant="secondary" icon="share-2">مشاركة</Button>
            <Button variant="primary" icon="plus">مهمة جديدة</Button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:18, paddingTop:14, borderTop:'1px solid var(--border-1)' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <span style={{ fontSize:11, fontWeight:600, color:'var(--ink-500)' }}>تقدّم المشروع</span>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span className="num" style={{ fontSize:20, fontWeight:700, color:'var(--ink-900)' }}>{p.progress}٪</span>
              <Progress value={p.progress} status={p.status} height={8}/>
            </div>
          </div>
          <Stat label="الميزانية" value={SAR(p.budget)}/>
          <Stat label="المصروف"   value={SAR(p.spent)} tone={p.spent/p.budget > 0.9 ? 'danger' : null}/>
          <Stat label="المتبقي"   value={SAR(p.budget - p.spent)} tone="success"/>
        </div>
      </div>
      <div style={{ display:'flex', gap:4, padding:'0 22px', borderTop:'1px solid var(--border-1)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'12px 14px', fontSize:13.5, fontWeight:600, cursor:'pointer',
            background:'transparent', border:'none', borderBottom: tab === t.id ? '2px solid var(--teal-500)' : '2px solid transparent',
            color: tab === t.id ? 'var(--navy-800)' : 'var(--ink-600)', fontFamily:'var(--font-sans)',
          }}>{t.label}</button>
        ))}
      </div>
    </Card>
  );

  const Stat = ({ label, value, tone }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <span style={{ fontSize:11, fontWeight:600, color:'var(--ink-500)' }}>{label}</span>
      <span className="money" style={{ fontSize:16, fontWeight:700, color: tone === 'success' ? 'var(--success-700)' : tone === 'danger' ? 'var(--danger-700)' : 'var(--ink-900)' }}>{value}</span>
    </div>
  );

  let body;
  if (tab === 'terms') {
    body = (
      <Card>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {TERMS.map((t,i) => (
            <div key={t.id} style={{ padding:'18px 0', borderBottom: i < TERMS.length-1 ? '1px solid var(--border-1)' : 'none', display:'flex', gap:16, alignItems:'flex-start' }}>
              <div style={{ width:36, height:36, borderRadius:8, background:'var(--navy-050)', color:'var(--navy-700)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14, flexShrink:0 }} className="num">{t.id}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)', marginBottom:6 }}>{t.title}</div>
                <div style={{ fontSize:13.5, color:'var(--ink-700)', lineHeight:1.75 }}>{t.summary}</div>
              </div>
              <Button variant="ghost" size="sm" icon="edit-3">تحرير</Button>
            </div>
          ))}
        </div>
      </Card>
    );
  } else if (tab === 'tasks') {
    body = (
      <Card pad={0}>
        {projectTasks.map((t,i) => (
          <div key={t.id} style={{ display:'grid', gridTemplateColumns:'24px 1fr 110px 100px 30px', gap:14, alignItems:'center', padding:'12px 18px', borderBottom: i < projectTasks.length-1 ? '1px solid var(--border-1)' : 'none' }}>
            <input type="checkbox" defaultChecked={t.status === 'done'} style={{ width:16, height:16, accentColor:'var(--teal-500)' }}/>
            <div>
              <div style={{ fontSize:13.5, fontWeight:600, color:'var(--ink-900)' }}>{t.title}</div>
              <div className="num" style={{ fontSize:11, color:'var(--ink-500)', marginTop:2, direction:'ltr', textAlign:'start' }}>{t.code}</div>
            </div>
            <StatusChip status={t.status}/>
            <span style={{ fontSize:12, color: t.priority === 'high' ? 'var(--danger-700)' : 'var(--ink-600)' }}>{t.due}</span>
            <Avatar person={t.assignee} size={26}/>
          </div>
        ))}
      </Card>
    );
  } else if (tab === 'team') {
    const CAPS = [
      { id:'view',    label:'الاطّلاع على المشروع' },
      { id:'edit',    label:'تحرير بيانات المشروع' },
      { id:'tasks',   label:'إدارة المهام' },
      { id:'finance', label:'الاطّلاع على المالية' },
      { id:'approve', label:'اعتماد المصروفات' },
      { id:'docs',    label:'رفع وحذف المستندات' },
    ];
    const LEVELS = [
      { id:'inherit', label:'من الدور', tone:'#6B7E97', bg:'var(--ink-100)' },
      { id:'grant',   label:'مُمنوحة',   tone:'var(--success-700)', bg:'var(--success-050)' },
      { id:'revoke',  label:'مسحوبة',   tone:'var(--danger-700)',  bg:'var(--danger-050)' },
    ];
    body = (
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <Card pad={0}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>أعضاء الفريق</div>
              <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:3 }}>صلاحياتهم الأساسية تأتي من دورهم العام. يمكنك تجاوزها هنا لهذا المشروع فقط.</div>
            </div>
            <Button variant="primary" size="sm" icon="user-plus" style={{ marginInlineStart:'auto' }}>إضافة عضو</Button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:`260px repeat(${CAPS.length}, 1fr) 40px`, padding:'10px 20px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11, fontWeight:700, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'0.04em', alignItems:'center' }}>
            <span>العضو</span>
            {CAPS.map(c => <span key={c.id} style={{ textAlign:'center' }}>{c.label}</span>)}
            <span></span>
          </div>
          {p.team.map((id, ri) => {
            const person = PEOPLE.find(x => x.id === id);
            return (
              <div key={id} style={{ display:'grid', gridTemplateColumns:`260px repeat(${CAPS.length}, 1fr) 40px`, padding:'12px 20px', borderBottom: ri < p.team.length-1 ? '1px solid var(--ink-100)' : 'none', alignItems:'center', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar person={id} size={34}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--ink-900)' }}>{person?.name}</div>
                    <div style={{ fontSize:11.5, color:'var(--ink-500)' }}>{person?.role}</div>
                  </div>
                </div>
                {CAPS.map((c, ci) => {
                  // mocked level assignment
                  const lv = (ri === 0 && ci === 4) ? LEVELS[1]
                          : (ri === 1 && ci === 3) ? LEVELS[2]
                          : (ri === 2 && ci === 5) ? LEVELS[1]
                          : LEVELS[0];
                  return (
                    <div key={c.id} style={{ display:'flex', justifyContent:'center' }}>
                      <span style={{
                        fontSize:11, padding:'4px 9px', borderRadius:999, fontWeight:700,
                        background:lv.bg, color:lv.tone, whiteSpace:'nowrap',
                      }}>{lv.label}</span>
                    </div>
                  );
                })}
                <Icon name="more-horizontal" size={16} style={{ color:'var(--ink-400)', cursor:'pointer', margin:'0 auto' }}/>
              </div>
            );
          })}
        </Card>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 16px', borderRadius:10, background:'var(--info-050)', border:'1px solid var(--info-100)' }}>
          <Icon name="info" size={16} style={{ color:'var(--info-700)', marginTop:2 }}/>
          <div style={{ fontSize:12.5, color:'var(--ink-700)', lineHeight:1.6, flex:1 }}>
            <b style={{ color:'var(--ink-900)' }}>التجاوزات تنطبق على هذا المشروع فقط.</b> الصلاحيات العامة للأدوار تُدار من <a style={{ color:'var(--info-700)', fontWeight:700, cursor:'pointer' }}>الإعدادات · الأدوار والصلاحيات</a>.
          </div>
        </div>
      </div>
    );
  } else {
    // overview
    body = (
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:14, color:'var(--ink-900)' }}>الجدول الزمني</div>
          <Timeline phases={[
            { id:'m1', label:'التصميم والتراخيص', start:0,  end:18, status:'completed' },
            { id:'m2', label:'التجهيز والمباشرة', start:14, end:32, status:'completed' },
            { id:'m3', label:'الأعمال المدنية',   start:28, end:62, status:'progress' },
            { id:'m4', label:'التركيب والتشغيل',  start:58, end:88, status:'todo' },
            { id:'m5', label:'الاستلام النهائي',  start:86, end:100, status:'todo' },
          ]}/>
        </Card>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:14, color:'var(--ink-900)' }}>الفريق</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {p.team.map(id => {
              const person = PEOPLE.find(x => x.id === id);
              return (
                <div key={id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar person={id} size={36}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'var(--ink-900)' }}>{person?.name}</div>
                    <div style={{ fontSize:12, color:'var(--ink-500)' }}>{person?.role}</div>
                  </div>
                  <Icon name="more-horizontal" size={16} style={{ color:'var(--ink-500)' }}/>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <Header/>
      {body}
    </div>
  );
};

const Timeline = ({ phases }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
    {phases.map(ph => (
      <div key={ph.id} style={{ display:'grid', gridTemplateColumns:'140px 1fr 80px', gap:14, alignItems:'center' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--ink-800)' }}>{ph.label}</div>
        <div style={{ position:'relative', height:18, background:'var(--ink-100)', borderRadius:999 }}>
          <div style={{
            position:'absolute', top:0, bottom:0, right:`${ph.start}%`, width:`${ph.end - ph.start}%`,
            background: ph.status === 'completed' ? 'var(--success-500)' : ph.status === 'progress' ? 'var(--teal-500)' : 'var(--ink-300)',
            borderRadius:999,
          }}/>
        </div>
        <StatusChip status={ph.status}/>
      </div>
    ))}
  </div>
);

window.ProjectDetail = ProjectDetail;
