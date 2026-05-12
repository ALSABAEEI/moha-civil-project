// Vendors module
const Vendors = () => {
  const STATUS = {
    active:       { label:'نشط',           tone:'completed' },
    awaiting:     { label:'بانتظار مستندات', tone:'risk' },
    suspended:    { label:'موقوف',          tone:'blocked' },
    prequalified: { label:'مؤهَّل مسبقاً',   tone:'navy' },
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <KPI label="إجمالي الموردين" value={VENDORS.length} sub="4 تخصصات"/>
        <KPI label="موردون نشطون"    value={VENDORS.filter(v=>v.status==='active').length} delta="1" deltaUp/>
        <KPI label="بانتظار التأهيل"  value={VENDORS.filter(v=>v.status==='awaiting').length} sub="مستندات ناقصة"/>
        <KPI label="موقوفون"          value={VENDORS.filter(v=>v.status==='suspended').length} valueColor="var(--danger-700)"/>
      </div>

      <Card pad={0}>
        <div style={{ display:'flex', alignItems:'center', padding:'12px 18px', borderBottom:'1px solid var(--border-1)', gap:10 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'var(--ink-900)' }}>قائمة الموردين</div>
          <div style={{ marginRight:'auto', display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" icon="filter">المرشّحات</Button>
            <Button variant="primary" size="sm" icon="plus">إضافة مورد</Button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1.1fr 80px 90px 130px', gap:14, padding:'12px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
          <span>المورد</span><span>التخصص</span><span>التواصل</span><span style={{ textAlign:'start' }}>المشاريع</span><span/><span>الحالة</span>
        </div>
        {VENDORS.map((v, i) => (
          <div key={v.id} style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1.1fr 80px 90px 130px', gap:14, padding:'14px 22px', alignItems:'center', borderBottom: i < VENDORS.length-1 ? '1px solid var(--border-1)' : 'none', fontSize:13, color:'var(--ink-800)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:34, height:34, borderRadius:8, background:'var(--navy-050)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--navy-700)' }}>
                <Icon name="building-2" size={16}/>
              </div>
              <span style={{ fontWeight:700, color:'var(--ink-900)' }}>{v.name}</span>
            </div>
            <span>{v.discipline}</span>
            <span className="num" style={{ fontSize:12, color:'var(--ink-600)' }}>{v.contact}</span>
            <span className="num" style={{ fontWeight:600 }}>{v.projects}</span>
            <Button variant="ghost" size="sm">فتح</Button>
            <Chip tone={STATUS[v.status].tone} dot>{STATUS[v.status].label}</Chip>
          </div>
        ))}
      </Card>
    </div>
  );
};
window.Vendors = Vendors;
