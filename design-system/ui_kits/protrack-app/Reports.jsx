// Reports
const Reports = () => {
  const REPORTS = [
    { id:'r1', icon:'building-2',    title:'تقرير المشاريع الشهري',     desc:'ملخص شامل لتقدم جميع المشاريع، الميزانية، والمخاطر.', updated:'18 مايو 2026', frequency:'شهري'   },
    { id:'r2', icon:'wallet',         title:'تقرير المصروفات والميزانية', desc:'تحليل الميزانية مقابل المصروف الفعلي حسب المشروع والمورد.', updated:'17 مايو 2026', frequency:'أسبوعي'  },
    { id:'r3', icon:'shield-check',  title:'أداء الموردين',              desc:'مؤشرات التزام الموردين بالجودة والمواعيد والسلامة.', updated:'15 مايو 2026', frequency:'ربع سنوي' },
    { id:'r4', icon:'hard-hat',       title:'إنتاجية المهندسين',         desc:'المهام المنجزة، ساعات العمل، ومعدّل الاستجابة.', updated:'18 مايو 2026', frequency:'أسبوعي'   },
    { id:'r5', icon:'alert-triangle', title:'سجل المخاطر',                desc:'المخاطر النشطة، حالة المعالجة، وأولوية المتابعة.', updated:'10 مايو 2026', frequency:'شهري'  },
    { id:'r6', icon:'file-text',      title:'الامتثال والتراخيص',         desc:'حالة الوثائق التنظيمية والتراخيص لكل مشروع.', updated:'05 مايو 2026', frequency:'ربع سنوي'  },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <KPI label="تقارير جاهزة"   value="12" sub="هذا الشهر"/>
        <KPI label="تقارير مجدولة"  value="4"  sub="القادم: يوم الأحد"/>
        <KPI label="تقارير مفصّلة"  value="7"  sub="مخصّصة"/>
        <KPI label="عمليات التصدير" value="28" delta="6" deltaUp/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(360px, 1fr))', gap:16 }}>
        {REPORTS.map(r => (
          <Card key={r.id} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:10, background:'var(--teal-050)', color:'var(--teal-700)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon name={r.icon} size={22}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)', marginBottom:4 }}>{r.title}</div>
                <div style={{ fontSize:12.5, color:'var(--ink-600)', lineHeight:1.6 }}>{r.desc}</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid var(--border-1)' }}>
              <div style={{ display:'flex', gap:14, fontSize:11, color:'var(--ink-500)' }}>
                <span>محدّث {r.updated}</span>
                <Chip tone="navy" dot={false} style={{ fontSize:10, padding:'2px 8px' }}>{r.frequency}</Chip>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <Button variant="ghost" size="sm" icon="download">PDF</Button>
                <Button variant="ghost" size="sm" icon="external-link">فتح</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
window.Reports = Reports;
