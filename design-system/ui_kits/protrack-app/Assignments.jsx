// Assignments — assign engineers/vendors to projects
const Assignments = () => {
  const ASSIGNMENTS = [
    { project:'p1', engineers:['ms','ah'], vendors:['nec','afc'] },
    { project:'p2', engineers:['ah','yk'], vendors:['mml'] },
    { project:'p3', engineers:['ms','yk','ah'], vendors:['afc'] },
    { project:'p4', engineers:['ms','ah','yk'], vendors:['afc','nec'] },
    { project:'p5', engineers:['yk','ms'], vendors:['gtl'] },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <Card style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:42, height:42, borderRadius:10, background:'var(--teal-050)', color:'var(--teal-700)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="split" size={20}/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>التعيينات</div>
          <div style={{ fontSize:12.5, color:'var(--ink-600)', marginTop:2 }}>توزيع المهندسين والموردين على المشاريع وفق التخصص والتحميل.</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Button variant="secondary" icon="users">إدارة المهندسين</Button>
          <Button variant="primary" icon="plus">تعيين جديد</Button>
        </div>
      </Card>

      <Card pad={0}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.4fr 1.4fr 100px', gap:14, padding:'12px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
          <span>المشروع</span><span>المهندسون</span><span>الموردون</span><span style={{ textAlign:'start' }}>الإجراء</span>
        </div>
        {ASSIGNMENTS.map((a, i) => {
          const p = PROJECTS.find(x => x.id === a.project);
          return (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 1.4fr 1.4fr 100px', gap:14, padding:'16px 22px', alignItems:'center', borderBottom: i < ASSIGNMENTS.length-1 ? '1px solid var(--border-1)' : 'none' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:4, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className="num" style={{ fontSize:11, color:'var(--ink-500)' }}>{p.code}</span>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--ink-300)' }}/>
                  <span style={{ fontSize:11, color:'var(--ink-500)' }}>{p.discipline}</span>
                </div>
                <span style={{ fontSize:14, fontWeight:700, color:'var(--ink-900)' }}>{p.name}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <AvatarStack ids={a.engineers} size={26}/>
                <span style={{ fontSize:12, color:'var(--ink-600)' }}>{a.engineers.length} مهندس</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {a.vendors.map(vid => {
                  const v = VENDORS.find(x => x.id === vid);
                  return <span key={vid} style={{ fontSize:12.5, color:'var(--ink-800)', display:'inline-flex', alignItems:'center', gap:6 }}><Icon name="building-2" size={12} style={{ color:'var(--ink-500)' }}/>{v?.name}</span>;
                })}
              </div>
              <Button variant="ghost" size="sm" iconAfter="chevron-left">تعديل</Button>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
window.Assignments = Assignments;
