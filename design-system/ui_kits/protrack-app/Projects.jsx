// Projects — grid of cards + filters
const Projects = ({ onOpenProject }) => {
  const [filter, setFilter] = React.useState('all');
  const TABS = [
    { id:'all',       label:'الكل',         count: PROJECTS.length },
    { id:'progress',  label:'قيد التنفيذ',   count: PROJECTS.filter(p => p.status === 'progress').length },
    { id:'risk',      label:'في خطر',        count: PROJECTS.filter(p => p.status === 'risk').length },
    { id:'review',    label:'قيد المراجعة',  count: PROJECTS.filter(p => p.status === 'review').length },
    { id:'completed', label:'مكتمل',         count: PROJECTS.filter(p => p.status === 'completed').length },
  ];
  const list = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === filter);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <Card pad={0} style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px',
            background: filter === t.id ? 'var(--navy-050)' : 'transparent',
            color:     filter === t.id ? 'var(--navy-800)' : 'var(--ink-600)',
            border:    filter === t.id ? '1px solid var(--navy-100)' : '1px solid transparent',
            borderRadius:999, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-sans)',
          }}>
            {t.label}
            <span className="num" style={{ fontSize:11, padding:'1px 7px', background: filter === t.id ? 'var(--navy-100)' : 'var(--ink-100)', color: filter === t.id ? 'var(--navy-800)' : 'var(--ink-600)', borderRadius:999 }}>{t.count}</span>
          </button>
        ))}
        <div style={{ marginRight:'auto', display:'flex', gap:8 }}>
          <Button variant="secondary" size="sm" icon="filter">المرشّحات</Button>
          <Button variant="secondary" size="sm" icon="arrow-up-down">الترتيب</Button>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:16 }}>
        {list.map(p => (
          <Card key={p.id} pad={0} style={{ cursor:'pointer', display:'flex', flexDirection:'column' }}>
            <div onClick={() => onOpenProject && onOpenProject(p.id)} style={{ padding:18, display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className="num" style={{ fontSize:11, color:'var(--ink-500)' }}>{p.code}</span>
                    <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--ink-300)' }}/>
                    <span style={{ fontSize:11, color:'var(--ink-500)' }}>{p.discipline}</span>
                  </div>
                  <div style={{ fontSize:16, fontWeight:700, color:'var(--ink-900)', lineHeight:1.35 }}>{p.name}</div>
                  <div style={{ fontSize:12, color:'var(--ink-500)' }}>{p.client}</div>
                </div>
                <StatusChip status={p.status}/>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                  <span style={{ color:'var(--ink-600)' }}>التقدّم</span>
                  <span className="num" style={{ color:'var(--ink-900)', fontWeight:700 }}>{p.progress}٪</span>
                </div>
                <Progress value={p.progress} status={p.status} height={8}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  <span style={{ fontSize:10.5, color:'var(--ink-500)', fontWeight:600 }}>الميزانية</span>
                  <span className="money" style={{ fontSize:12.5, color:'var(--ink-900)', fontWeight:700 }}>{SAR(p.budget)}</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  <span style={{ fontSize:10.5, color:'var(--ink-500)', fontWeight:600 }}>المصروف</span>
                  <span className="money" style={{ fontSize:12.5, color:'var(--ink-900)', fontWeight:700 }}>{SAR(p.spent)}</span>
                </div>
              </div>
            </div>
            <div style={{ padding:'12px 18px', borderTop:'1px solid var(--border-1)', display:'flex', alignItems:'center', justifyContent:'space-between', background:'var(--ink-050)', borderRadius:'0 0 12px 12px' }}>
              <AvatarStack ids={p.team} size={22}/>
              <span style={{ fontSize:11, color:'var(--ink-600)' }}>التسليم {p.due}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
window.Projects = Projects;
