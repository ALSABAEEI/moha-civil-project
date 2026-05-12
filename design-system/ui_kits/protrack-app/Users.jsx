// User management
const Users = () => {
  const STATUS = {
    active:    { label:'نشط',     tone:'completed' },
    invited:   { label:'مدعو',    tone:'review' },
    suspended: { label:'موقوف',    tone:'blocked' },
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14 }}>
        {Object.entries(ROLE_INFO).map(([k, info]) => {
          const n = USERS.filter(u => u.role === k).length;
          return (
            <Card key={k} pad={16}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'var(--navy-050)', color:'var(--navy-700)', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon name={info.icon} size={16}/></div>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--ink-900)' }}>{info.label}</div>
              </div>
              <div className="num" style={{ fontSize:22, fontWeight:700, color:'var(--ink-900)' }}>{n}</div>
              <div style={{ fontSize:11, color:'var(--ink-500)', marginTop:4, lineHeight:1.5 }}>{info.desc}</div>
            </Card>
          );
        })}
      </div>

      <Card pad={0}>
        <div style={{ display:'flex', alignItems:'center', padding:'14px 22px', borderBottom:'1px solid var(--border-1)' }}>
          <div style={{ fontSize:15, fontWeight:700 }}>المستخدمون والصلاحيات</div>
          <div style={{ marginRight:'auto', display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" icon="filter">المرشّحات</Button>
            <Button variant="secondary" size="sm" icon="upload">استيراد</Button>
            <Button variant="primary" size="sm" icon="user-plus">دعوة مستخدم</Button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1.4fr 110px 140px 110px 120px 32px', gap:14, padding:'12px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
          <span>المستخدم</span><span>البريد الإلكتروني</span><span>الدور</span><span>القسم</span><span>الحالة</span><span>آخر دخول</span><span/>
        </div>
        {USERS.map((u, i) => {
          const p = PEOPLE.find(x => x.id === u.personId);
          return (
            <div key={u.id} style={{ display:'grid', gridTemplateColumns:'1.6fr 1.4fr 110px 140px 110px 120px 32px', gap:14, padding:'14px 22px', alignItems:'center', borderBottom: i < USERS.length-1 ? '1px solid var(--border-1)' : 'none', fontSize:13 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Avatar person={u.personId} size={32}/>
                <span style={{ fontWeight:700, color:'var(--ink-900)' }}>{p?.name}</span>
              </div>
              <span className="num" style={{ fontSize:12, color:'var(--ink-600)', direction:'ltr', textAlign:'start' }}>{u.email}</span>
              <Chip tone="navy" dot={false}>{ROLE_LABEL[u.role]}</Chip>
              <span style={{ color:'var(--ink-700)' }}>{u.department}</span>
              <Chip tone={STATUS[u.status].tone} dot>{STATUS[u.status].label}</Chip>
              <span style={{ fontSize:12, color:'var(--ink-500)' }}>{u.lastSeen}</span>
              <Icon name="more-horizontal" size={16} style={{ color:'var(--ink-500)', cursor:'pointer' }}/>
            </div>
          );
        })}
      </Card>
    </div>
  );
};
window.Users = Users;
