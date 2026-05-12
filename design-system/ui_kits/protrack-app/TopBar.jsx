// TopBar — Arabic labels, RTL flow, role switcher
const TopBar = ({ role, setRole, title, subtitle, onNewProject }) => {
  const ROLES = [
    { id:'admin',    label:'مسؤول' },
    { id:'pm',       label:'مدير مشروع' },
    { id:'engineer', label:'مهندس' },
    { id:'finance',  label:'مالي' },
    { id:'vendor',   label:'مورد' },
  ];
  return (
    <header style={{
      height:60, background:'#fff', borderBottom:'1px solid var(--border-2)',
      display:'flex', alignItems:'center', gap:16, padding:'0 24px', flexShrink:0,
    }}>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        <div style={{ fontSize:17, fontWeight:700, color:'var(--ink-900)' }}>{title}</div>
        {subtitle && <div style={{ fontSize:12, color:'var(--ink-500)' }}>{subtitle}</div>}
      </div>

      <div style={{ marginRight:'auto', display:'flex', alignItems:'center', gap:10, flex:'0 1 360px' }}>
        <div style={{
          display:'flex', alignItems:'center', gap:8, height:36, padding:'0 12px',
          background:'var(--ink-050)', border:'1px solid var(--border-1)', borderRadius:8, flex:1,
        }}>
          <Icon name="search" size={15} stroke={1.9} style={{ color:'var(--ink-500)' }}/>
          <input placeholder="ابحث عن مشاريع، مهام، موردين…" style={{
            flex:1, border:'none', outline:'none', background:'transparent',
            fontSize:13, color:'var(--ink-900)', fontFamily:'var(--font-sans)', textAlign:'start',
          }}/>
          <kbd style={{ fontSize:10, color:'var(--ink-500)', fontFamily:'var(--font-mono)', background:'#fff', border:'1px solid var(--border-1)', padding:'1px 5px', borderRadius:4, direction:'ltr' }}>⌘K</kbd>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px', background:'var(--ink-050)', border:'1px solid var(--border-1)', borderRadius:8 }}>
        {ROLES.map(r => (
          <button key={r.id} onClick={() => setRole(r.id)} style={{
            padding:'5px 12px', fontSize:12, fontWeight: role === r.id ? 700 : 500,
            border:'none', borderRadius:6, cursor:'pointer',
            background: role === r.id ? '#fff' : 'transparent',
            color: role === r.id ? 'var(--navy-800)' : 'var(--ink-600)',
            boxShadow: role === r.id ? 'var(--shadow-xs)' : 'none',
            fontFamily:'var(--font-sans)',
          }}>{r.label}</button>
        ))}
      </div>

      <button style={{ width:38, height:38, borderRadius:8, border:'1px solid var(--border-1)', background:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'var(--ink-700)', position:'relative', cursor:'pointer' }}>
        <Icon name="bell" size={17}/>
        <span style={{ position:'absolute', top:6, left:6, width:7, height:7, borderRadius:'50%', background:'var(--teal-500)', border:'1.5px solid #fff' }}/>
      </button>
      <Button variant="primary" icon="plus" size="sm" onClick={onNewProject}>مشروع جديد</Button>
    </header>
  );
};
window.TopBar = TopBar;
