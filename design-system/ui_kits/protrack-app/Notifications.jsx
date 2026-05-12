// Notifications
const Notifications = () => {
  const [filter, setFilter] = React.useState('all');
  const TABS = [
    { id:'all',     label:'الكل' },
    { id:'unread',  label:'غير مقروء' },
    { id:'finance', label:'مالية' },
    { id:'project', label:'مشاريع' },
    { id:'task',    label:'مهام' },
    { id:'system',  label:'نظام' },
  ];
  const ICON = {
    finance:'wallet', project:'folder-kanban', task:'check-square',
    mention:'at-sign', vendor:'building-2', system:'settings',
  };
  const TONE = {
    finance:'risk', project:'navy', task:'progress',
    mention:'review', vendor:'completed', system:'neutral',
  };
  const list = filter === 'all'    ? NOTIFICATIONS
             : filter === 'unread' ? NOTIFICATIONS.filter(n => !n.read)
             : NOTIFICATIONS.filter(n => n.kind === filter);

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gap:16 }}>
      <Card pad={10}>
        <div style={{ padding:'8px 10px', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>التصنيف</div>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
              background: filter === t.id ? 'var(--navy-050)' : 'transparent',
              color:     filter === t.id ? 'var(--navy-800)' : 'var(--ink-700)',
              fontWeight: filter === t.id ? 700 : 500,
              border:'none', borderRadius:8, cursor:'pointer', fontSize:13, textAlign:'start', fontFamily:'var(--font-sans)',
            }}>
              <span style={{ flex:1 }}>{t.label}</span>
              <span className="num" style={{ fontSize:11, color:'var(--ink-500)' }}>
                {t.id === 'all' ? NOTIFICATIONS.length :
                 t.id === 'unread' ? NOTIFICATIONS.filter(n => !n.read).length :
                 NOTIFICATIONS.filter(n => n.kind === t.id).length}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <Card pad={0}>
        <div style={{ display:'flex', alignItems:'center', padding:'14px 20px', borderBottom:'1px solid var(--border-1)' }}>
          <div style={{ fontSize:15, fontWeight:700 }}>الإشعارات</div>
          <div style={{ marginRight:'auto', display:'flex', gap:8 }}>
            <Button variant="ghost" size="sm" icon="check-check">تعليم الكل كمقروء</Button>
            <Button variant="secondary" size="sm" icon="settings-2">إعدادات</Button>
          </div>
        </div>
        {list.map((n, i) => (
          <div key={n.id} style={{
            display:'flex', gap:14, padding:'16px 20px',
            borderBottom: i < list.length-1 ? '1px solid var(--border-1)' : 'none',
            background: n.read ? '#fff' : 'var(--teal-050)',
          }}>
            <div style={{ width:38, height:38, borderRadius:10, background:'#fff', border:'1px solid var(--border-1)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-700)', flexShrink:0 }}>
              <Icon name={ICON[n.kind] || 'bell'} size={18}/>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={{ fontSize:14, fontWeight:700, color:'var(--ink-900)' }}>{n.title}</span>
                <Chip tone={TONE[n.kind] || 'neutral'} dot={false} style={{ fontSize:10, padding:'2px 8px' }}>{TABS.find(t => t.id === n.kind)?.label || n.kind}</Chip>
                {!n.read && <span style={{ width:7, height:7, borderRadius:'50%', background:'var(--teal-500)' }}/>}
              </div>
              <div style={{ fontSize:13, color:'var(--ink-700)', lineHeight:1.65 }}>{n.body}</div>
              <div style={{ fontSize:11, color:'var(--ink-500)', marginTop:6 }}>{n.when}</div>
            </div>
            <Icon name="chevron-left" size={16} style={{ color:'var(--ink-400)' }}/>
          </div>
        ))}
      </Card>
    </div>
  );
};
window.Notifications = Notifications;
