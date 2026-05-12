// Task board — Kanban (RTL: columns flow right-to-left naturally via flex)
const TaskBoard = () => {
  const COLS = [
    { id:'todo',     label:'لم يبدأ',     tone:'neutral' },
    { id:'progress', label:'قيد التنفيذ', tone:'progress' },
    { id:'review',   label:'قيد المراجعة', tone:'review' },
    { id:'done',     label:'مكتمل',        tone:'completed' },
  ];
  const colTasks = (id) => TASKS.filter(t => t.status === id);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <Card pad={0} style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <div style={{ fontSize:13, fontWeight:600, color:'var(--ink-700)' }}>المشروع:</div>
        <Chip tone="navy" dot={false}>CIV-2026-014 · محطة الرياض الشمالية</Chip>
        <div style={{ marginRight:'auto', display:'flex', gap:8 }}>
          <Button variant="secondary" size="sm" icon="filter">الجميع · مرشّحات</Button>
          <Button variant="secondary" size="sm" icon="users">المسندة لي</Button>
          <Button variant="primary" size="sm" icon="plus">مهمة</Button>
        </div>
      </Card>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        {COLS.map(col => (
          <div key={col.id} style={{ background:'var(--ink-050)', border:'1px solid var(--border-1)', borderRadius:12, padding:12, display:'flex', flexDirection:'column', gap:10, minHeight:520 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'2px 4px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <Chip tone={col.tone} dot>{col.label}</Chip>
                <span className="num" style={{ fontSize:12, color:'var(--ink-500)' }}>{colTasks(col.id).length}</span>
              </div>
              <Icon name="plus" size={16} style={{ color:'var(--ink-500)' }}/>
            </div>
            {colTasks(col.id).map(t => (
              <div key={t.id} style={{ background:'#fff', border:'1px solid var(--border-1)', borderRadius:10, padding:12, display:'flex', flexDirection:'column', gap:10, cursor:'pointer', boxShadow:'var(--shadow-xs)' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span className="num" style={{ fontSize:10.5, color:'var(--ink-500)', direction:'ltr', textAlign:'start' }}>{t.code}</span>
                  {t.priority === 'high' && <Chip tone="risk" dot={false} style={{ fontSize:10, padding:'2px 8px' }}>عاجل</Chip>}
                </div>
                <div style={{ fontSize:13.5, fontWeight:600, color:'var(--ink-900)', lineHeight:1.5 }}>{t.title}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:11, color:'var(--ink-500)', display:'inline-flex', alignItems:'center', gap:5 }}>
                    <Icon name="calendar" size={12}/>{t.due}
                  </span>
                  <Avatar person={t.assignee} size={22}/>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
window.TaskBoard = TaskBoard;
