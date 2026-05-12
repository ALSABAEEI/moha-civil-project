// Right-side sidebar (RTL) — Arabic labels, role-aware
const Sidebar = ({ screen, setScreen, role }) => {
  const NAV = [
    { id:'dashboard',  label:'الرئيسية',     icon:'layout-dashboard' },
    { id:'projects',   label:'المشاريع',      icon:'folder-kanban', count:7, roles:['admin','pm','engineer','vendor'] },
    { id:'tasks',      label:'المهام',        icon:'list-checks',   count:9, roles:['admin','pm','engineer'] },
    { id:'vendors',    label:'الموردون',      icon:'shield-check',  roles:['admin','pm','finance'] },
    { id:'engineers',  label:'المهندسون',     icon:'hard-hat',      roles:['admin','pm'] },
    { id:'assignments',label:'التعيينات',     icon:'split',         roles:['admin','pm'] },
  ];
  const MONEY = [
    { id:'finance', label:'المتابعة المالية', icon:'wallet',     count:6 },
    { id:'reports', label:'التقارير',          icon:'bar-chart-3' },
  ];
  const SYS = [
    { id:'approvals',     label:'الاعتمادات',         icon:'check-check', count:6, roles:['admin','pm','finance'] },
    { id:'audit',         label:'سجل التدقيق',         icon:'scroll-text', roles:['admin'] },
    { id:'notifications', label:'الإشعارات',         icon:'bell',        count:3 },
    { id:'users',         label:'إدارة المستخدمين',  icon:'users-round', roles:['admin'] },
    { id:'settings',      label:'الإعدادات',          icon:'settings-2' },
  ];
  const allowed = (item) => !item.roles || item.roles.includes(role);

  const Item = ({ item }) => {
    const active = screen === item.id;
    return (
      <div onClick={() => setScreen(item.id)} style={{
        display:'flex', alignItems:'center', gap:12, padding:'9px 12px', borderRadius:8,
        fontSize:14, fontWeight: active ? 700 : 500, cursor:'pointer',
        background: active ? 'var(--teal-500)' : 'transparent',
        color: active ? '#fff' : '#A9B6C7',
      }}>
        <Icon name={item.icon} size={18} stroke={1.75}/>
        <span style={{ flex:1 }}>{item.label}</span>
        {item.count != null && (
          <span style={{
            fontSize:11, padding:'1px 7px', borderRadius:999, minWidth:20, textAlign:'center',
            background: active ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.10)',
            color:'#fff', fontFamily:'var(--font-mono)', direction:'ltr',
          }}>{item.count}</span>
        )}
      </div>
    );
  };
  const Group = ({ label, items }) => {
    const visible = items.filter(allowed);
    if (!visible.length) return null;
    return (
      <>
        <div style={{ fontSize:11, fontWeight:700, color:'#5C6F89', padding:'14px 12px 6px' }}>{label}</div>
        {visible.map(it => <Item key={it.id} item={it}/>)}
      </>
    );
  };
  const me = PEOPLE.find(p => (role === 'admin' && p.id === 'na') ||
                              (role === 'finance' && p.id === 'sl') ||
                              (role === 'engineer' && p.id === 'ms') ||
                              (role === 'vendor' && p.id === 'ah') || p.id === 'fa');
  return (
    <aside style={{
      width:248, background:'var(--navy-800)', flexShrink:0,
      display:'flex', flexDirection:'column', padding:'14px 12px 18px',
      borderLeft:'1px solid var(--navy-900)', overflowY:'auto',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 8px 14px', borderBottom:'1px solid rgba(255,255,255,.06)', marginBottom:6 }}>
        <img src="../../assets/logo-icon.svg" style={{ width:30, height:30 }}/>
        <span style={{ color:'#fff', fontWeight:800, fontSize:18 }}>ProTrack</span>
      </div>
      <Group label="مساحة العمل" items={NAV}/>
      <Group label="المالية"       items={MONEY}/>
      <Group label="النظام"        items={SYS}/>
      <div style={{ marginTop:'auto', padding:'12px 8px 4px', display:'flex', gap:10, alignItems:'center' }}>
        <Avatar person={me?.id || 'fa'} size={34}/>
        <div style={{ display:'flex', flexDirection:'column', minWidth:0, flex:1 }}>
          <span style={{ color:'#fff', fontSize:13, fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{me?.name || 'فيصل الحربي'}</span>
          <span style={{ color:'#7A8AA0', fontSize:11 }}>{ROLE_LABEL[role]}</span>
        </div>
        <Icon name="chevron-left" size={16} style={{ color:'#7A8AA0' }}/>
      </div>
    </aside>
  );
};
window.Sidebar = Sidebar;
