// Vendor portal — slim view for the مورد role. Only their work, invoices, docs.
// Used when role === 'vendor' (replaces the full app shell in App.jsx).

const VendorPortal = ({ onSignOut }) => {
  const [tab, setTab] = React.useState('overview');

  // Pretend the signed-in vendor is "شركة نجد للأعمال الكهربائية"
  const VENDOR = { name:'شركة نجد للأعمال الكهربائية', code:'V-NEC-0034', discipline:'كهربائي' };
  const MY_PROJECTS = PROJECTS.filter(p => ['p1','p4'].includes(p.id));
  const MY_INVOICES = PAYMENTS.filter(p => p.vendor === VENDOR.name);
  const MY_TASKS = [
    { id:'VT-1', title:'تركيب لوحات التوزيع — الطابق الأرضي', project:'CIV-2026-014', due:'18 مايو 2026', status:'progress' },
    { id:'VT-2', title:'اختبار العزل الكهربائي — القسم أ',     project:'CIV-2026-014', due:'22 مايو 2026', status:'todo'     },
    { id:'VT-3', title:'تسليم تقرير المرحلة الأولى',           project:'CIV-2026-007', due:'25 مايو 2026', status:'todo'     },
  ];

  const NAV = [
    { id:'overview',  label:'النظرة العامة', icon:'layout-dashboard' },
    { id:'projects',  label:'مشاريعي',       icon:'folder-kanban', count:MY_PROJECTS.length },
    { id:'tasks',     label:'مهامي',          icon:'list-checks',    count:MY_TASKS.length },
    { id:'invoices',  label:'فواتيري',        icon:'receipt',        count:MY_INVOICES.length },
    { id:'docs',      label:'مستنداتي',        icon:'folder-archive' },
    { id:'profile',   label:'بياناتي',         icon:'user-cog' },
  ];

  const PAY_STATUS = {
    paid:    { label:'مدفوعة',  tone:'completed' },
    pending: { label:'قيد المعالجة', tone:'review' },
    overdue: { label:'متأخرة',  tone:'blocked' },
    draft:   { label:'مسوّدة',  tone:'neutral' },
  };

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-app)' }}>
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Slim top bar */}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 24px', background:'#fff', borderBottom:'1px solid var(--border-1)' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:'var(--teal-700)', letterSpacing:'0.04em' }}>بوابة المورد</div>
            <div style={{ fontSize:17, fontWeight:700, color:'var(--ink-900)' }}>{VENDOR.name}</div>
          </div>
          <div style={{ marginInlineStart:'auto', display:'flex', alignItems:'center', gap:10 }}>
            <Chip tone="completed">معتمد</Chip>
            <span style={{ fontSize:12, color:'var(--ink-500)', fontFamily:'var(--font-mono)', direction:'ltr' }}>{VENDOR.code}</span>
            <Button variant="secondary" size="sm" icon="log-out" onClick={onSignOut}>خروج</Button>
          </div>
        </div>

        <div style={{ flex:1, overflow:'auto', padding:'22px 26px' }}>
          {tab === 'overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
                <KPI label="مشاريع نشطة"      value={<span className="num">{MY_PROJECTS.length}</span>}/>
                <KPI label="مهام مفتوحة"      value={<span className="num">{MY_TASKS.filter(t=>t.status!=='done').length}</span>} sub="2 خلال 7 أيام"/>
                <KPI label="فواتير قيد المعالجة" value={<span className="money">{SAR(MY_INVOICES.filter(i=>i.status==='pending').reduce((s,i)=>s+i.amount,0))}</span>}/>
                <KPI label="مدفوع هذا الربع"    value={<span className="money">{SAR(MY_INVOICES.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0))}</span>} delta="12%" deltaUp/>
              </div>

              <Card pad={0}>
                <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center' }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>أحدث المهام المسندة لي</span>
                  <a onClick={() => setTab('tasks')} style={{ marginInlineStart:'auto', color:'var(--teal-700)', fontSize:12, fontWeight:600, cursor:'pointer' }}>عرض الكل</a>
                </div>
                {MY_TASKS.map((t, i) => (
                  <div key={t.id} style={{ display:'grid', gridTemplateColumns:'1fr 160px 110px 120px', gap:14, padding:'14px 22px', borderBottom: i < MY_TASKS.length-1 ? '1px solid var(--ink-100)' : 'none', alignItems:'center', fontSize:13 }}>
                    <span style={{ fontWeight:600, color:'var(--ink-900)' }}>{t.title}</span>
                    <span style={{ fontSize:11.5, color:'var(--ink-500)', fontFamily:'var(--font-mono)', direction:'ltr' }}>{t.project}</span>
                    <StatusChip status={t.status}/>
                    <span style={{ fontSize:12, color:'var(--ink-700)' }}>{t.due}</span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {tab === 'invoices' && (
            <Card pad={0}>
              <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center' }}>
                <span style={{ fontSize:15, fontWeight:700 }}>فواتيري</span>
                <Button variant="primary" size="sm" icon="plus" style={{ marginInlineStart:'auto' }}>إصدار فاتورة جديدة</Button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 140px 140px 130px', padding:'12px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
                <span>الرقم</span><span>المشروع</span><span>القيمة</span><span>الاستحقاق</span><span>الحالة</span>
              </div>
              {MY_INVOICES.map((inv, i) => (
                <div key={inv.id} style={{ display:'grid', gridTemplateColumns:'120px 1fr 140px 140px 130px', padding:'14px 22px', borderBottom: i < MY_INVOICES.length-1 ? '1px solid var(--ink-100)' : 'none', alignItems:'center', fontSize:13 }}>
                  <span style={{ fontFamily:'var(--font-mono)', direction:'ltr', fontSize:12, color:'var(--ink-700)' }}>{inv.id}</span>
                  <span style={{ color:'var(--ink-800)', fontFamily:'var(--font-mono)', direction:'ltr', fontSize:12 }}>{inv.project}</span>
                  <span className="money" style={{ fontWeight:700 }}>{SAR(inv.amount)}</span>
                  <span style={{ color:'var(--ink-600)' }}>{inv.due}</span>
                  <Chip tone={PAY_STATUS[inv.status].tone}>{PAY_STATUS[inv.status].label}</Chip>
                </div>
              ))}
            </Card>
          )}

          {(tab === 'projects' || tab === 'tasks' || tab === 'docs' || tab === 'profile') && (
            <EmptyState
              icon={NAV.find(n => n.id === tab).icon}
              title={`${NAV.find(n => n.id === tab).label}`}
              body="هذه الصفحة قيد التطوير في بوابة المورد. سيظهر هنا ما يخص أعمالك ومستنداتك."
            />
          )}
        </div>
      </main>

      {/* Slim right sidebar */}
      <aside style={{ width:220, background:'var(--navy-800)', flexShrink:0, padding:'14px 12px 18px', display:'flex', flexDirection:'column', borderLeft:'1px solid var(--navy-900)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 8px 14px', borderBottom:'1px solid rgba(255,255,255,.06)', marginBottom:6 }}>
          <img src="../../assets/logo-icon.svg" style={{ width:28, height:28 }}/>
          <span style={{ color:'#fff', fontWeight:800, fontSize:16 }}>ProTrack</span>
        </div>
        {NAV.map(it => {
          const active = tab === it.id;
          return (
            <div key={it.id} onClick={() => setTab(it.id)} style={{
              display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8,
              cursor:'pointer', fontSize:13.5, fontWeight: active ? 700 : 500,
              background: active ? 'var(--teal-500)' : 'transparent',
              color: active ? '#fff' : '#A9B6C7', marginBottom:2,
            }}>
              <Icon name={it.icon} size={17}/>
              <span style={{ flex:1 }}>{it.label}</span>
              {it.count != null && (
                <span className="num" style={{ fontSize:11, padding:'1px 7px', borderRadius:999, background:'rgba(255,255,255,.15)', color:'#fff', fontWeight:700 }}>{it.count}</span>
              )}
            </div>
          );
        })}
      </aside>
    </div>
  );
};
window.VendorPortal = VendorPortal;
