// Search results — top-bar search lands here. Tabbed across entity types.
const SearchResults = ({ q = 'الفيصل' }) => {
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState(q);

  const RESULTS = {
    projects: [
      { id:'p2', code:'CON-2025-098', name:'مجمّع الفيصل التجاري', meta:'الرياض · قيد التنفيذ', icon:'folder-kanban' },
    ],
    vendors: [
      { id:'v1', code:'V-FCC-0012', name:'مجموعة الفيصل للمقاولات', meta:'مقاول رئيسي · معتمد', icon:'shield-check' },
    ],
    invoices: [
      { id:'INV-08851', code:'INV-08851', name:'فاتورة من مجموعة الفيصل للمقاولات', meta:'421,000 ر.س · 17/05/2026', icon:'receipt' },
      { id:'INV-08612', code:'INV-08612', name:'الدفعة 3 — الفيصل', meta:'مدفوعة · 02/04/2026', icon:'receipt' },
    ],
    tasks: [
      { id:'TSK-241', code:'TSK-241', name:'مراجعة عقد الفيصل — المرحلة 4', meta:'فيصل الحربي · 22/05/2026', icon:'list-checks' },
    ],
    people: [
      { id:'fa', code:'PM-009', name:'فيصل الحربي', meta:'مدير مشروع · الرياض', icon:'user' },
    ],
    documents: [
      { id:'doc1', code:'DOC-2241', name:'عقد الفيصل النهائي — مدفوع.pdf', meta:'12 صفحة · رُفع 02/04/2026', icon:'file-text' },
    ],
  };

  const COUNTS = Object.fromEntries(Object.entries(RESULTS).map(([k,v]) => [k, v.length]));
  const TOTAL = Object.values(COUNTS).reduce((s,n)=>s+n,0);

  const TABS = [
    { id:'all',       label:'الكل',         count:TOTAL,            kind:null },
    { id:'projects',  label:'المشاريع',     count:COUNTS.projects,  kind:'projects' },
    { id:'vendors',   label:'الموردون',     count:COUNTS.vendors,   kind:'vendors' },
    { id:'invoices',  label:'الفواتير',     count:COUNTS.invoices,  kind:'invoices' },
    { id:'tasks',     label:'المهام',       count:COUNTS.tasks,     kind:'tasks' },
    { id:'people',    label:'الأشخاص',      count:COUNTS.people,    kind:'people' },
    { id:'documents', label:'المستندات',    count:COUNTS.documents, kind:'documents' },
  ];

  const visible = tab === 'all'
    ? Object.entries(RESULTS).flatMap(([kind, items]) => items.map(it => ({ ...it, kind })))
    : RESULTS[tab].map(it => ({ ...it, kind: tab }));

  const KIND_LABEL = { projects:'مشروع', vendors:'مورد', invoices:'فاتورة', tasks:'مهمة', people:'شخص', documents:'مستند' };

  const Hi = ({ text }) => {
    if (!query) return text;
    const parts = text.split(query);
    return parts.flatMap((p, i) => i < parts.length - 1
      ? [p, <mark key={i} style={{ background:'var(--warning-100)', color:'var(--ink-900)', padding:'1px 3px', borderRadius:3 }}>{query}</mark>]
      : [p]);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <Card pad={18}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Icon name="search" size={20} style={{ color:'var(--ink-500)' }}/>
          <input value={query} onChange={e => setQuery(e.target.value)} style={{
            flex:1, border:'none', outline:'none', fontSize:18, fontWeight:600, color:'var(--ink-900)',
            background:'transparent', fontFamily:'var(--font-sans)',
          }}/>
          <span style={{ fontSize:12, color:'var(--ink-500)' }}>{TOTAL} نتيجة</span>
        </div>
      </Card>

      <Card pad={0}>
        <div style={{ display:'flex', padding:'0 22px', borderBottom:'1px solid var(--border-1)', overflowX:'auto' }}>
          {TABS.map(t => {
            const active = tab === t.id;
            return (
              <div key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'14px 14px 12px', cursor:'pointer', fontSize:13, whiteSpace:'nowrap',
                fontWeight: active ? 700 : 500, color: active ? 'var(--ink-900)' : 'var(--ink-600)',
                borderBottom: active ? '2px solid var(--teal-500)' : '2px solid transparent',
                marginBottom:-1, display:'flex', alignItems:'center', gap:8,
              }}>
                {t.label}
                <span className="num" style={{ fontSize:11, padding:'1px 7px', borderRadius:999, background: active ? 'var(--teal-500)' : 'var(--ink-150)', color: active ? '#fff' : 'var(--ink-700)', fontWeight:700 }}>{t.count}</span>
              </div>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <EmptyState icon="search-x" title="لا توجد نتائج" body={`لم نعثر على شيء يطابق “${query}”. جرّب كلمات أبسط أو افحص الإملاء.`}/>
        ) : visible.map((it, i) => (
          <div key={`${it.kind}-${it.id}`} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto auto', gap:14, padding:'14px 22px', alignItems:'center', borderBottom: i < visible.length-1 ? '1px solid var(--ink-100)' : 'none', cursor:'pointer' }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--ink-050)', color:'var(--ink-700)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Icon name={it.icon} size={17}/>
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                <span style={{ fontSize:10.5, fontWeight:700, color:'var(--ink-500)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{KIND_LABEL[it.kind]}</span>
                <span style={{ fontSize:11, color:'var(--ink-400)', fontFamily:'var(--font-mono)', direction:'ltr' }}>{it.code}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:600, color:'var(--ink-900)' }}><Hi text={it.name}/></div>
              <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:2 }}>{it.meta}</div>
            </div>
            <Button variant="ghost" size="sm">فتح</Button>
            <Icon name="chevron-left" size={16} style={{ color:'var(--ink-400)' }}/>
          </div>
        ))}
      </Card>
    </div>
  );
};
window.SearchResults = SearchResults;
