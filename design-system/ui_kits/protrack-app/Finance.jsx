// Financial tracking
const Finance = () => {
  const totalPaid    = PAYMENTS.filter(p => p.status === 'paid').reduce((s,p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter(p => p.status === 'pending').reduce((s,p) => s + p.amount, 0);
  const totalOverdue = PAYMENTS.filter(p => p.status === 'overdue').reduce((s,p) => s + p.amount, 0);

  const STATUS = {
    paid:    { label:'مدفوعة', tone:'completed' },
    pending: { label:'معلّقة',  tone:'risk' },
    overdue: { label:'متأخّرة', tone:'blocked' },
    draft:   { label:'مسوّدة',  tone:'neutral' },
  };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14 }}>
        <KPI label="إجمالي الميزانية"      value={SAR(PROJECTS.reduce((s,p)=>s+p.budget,0))} sub="هذا الربع"/>
        <KPI label="مصروف معتمد"           value={SAR(totalPaid)} delta="8٪" deltaUp valueColor="var(--success-700)"/>
        <KPI label="فواتير معلّقة"         value={SAR(totalPending)} sub={`${PAYMENTS.filter(p=>p.status==='pending').length} فواتير`} valueColor="var(--warning-700)"/>
        <KPI label="فواتير متأخرة"         value={SAR(totalOverdue)} sub={`${PAYMENTS.filter(p=>p.status==='overdue').length} فاتورة`} valueColor="var(--danger-700)"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>الميزانية مقابل المصروف حسب المشروع</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {PROJECTS.slice(0,5).map(p => {
              const util = Math.round((p.spent/p.budget)*100);
              return (
                <div key={p.id} style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:13, color:'var(--ink-800)', fontWeight:600 }}>{p.name}</span>
                    <span className="money" style={{ fontSize:12, color:'var(--ink-600)' }}>{SAR(p.spent)} / {SAR(p.budget)}</span>
                  </div>
                  <div style={{ height:8, background:'var(--ink-100)', borderRadius:999, direction:'rtl' }}>
                    <div style={{ width:`${util}%`, height:'100%', background: util > 90 ? 'var(--danger-500)' : util > 75 ? 'var(--warning-500)' : 'var(--teal-500)', borderRadius:999 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:14 }}>توزيع التدفقات النقدية</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:160, padding:'10px 0', borderBottom:'1px solid var(--border-1)' }}>
            {[{m:'يناير',v:62},{m:'فبراير',v:74},{m:'مارس',v:48},{m:'أبريل',v:88},{m:'مايو',v:96},{m:'يونيو',v:71}].map((b,i)=>(
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <div style={{ width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', height:'100%' }}>
                  <div style={{ height:`${b.v}%`, background:'var(--teal-500)', borderRadius:'6px 6px 0 0' }}/>
                </div>
                <span style={{ fontSize:11, color:'var(--ink-500)' }}>{b.m}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:18, marginTop:14, fontSize:12, color:'var(--ink-600)' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><span style={{ width:10, height:10, background:'var(--teal-500)', borderRadius:2 }}/>صادر</span>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}><span style={{ width:10, height:10, background:'var(--ink-200)', borderRadius:2 }}/>متوقع</span>
          </div>
        </Card>
      </div>

      <Card pad={0}>
        <div style={{ padding:'14px 22px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ fontSize:14, fontWeight:700 }}>جدول المدفوعات</div>
          <div style={{ marginRight:'auto', display:'flex', gap:8 }}>
            <Button variant="secondary" size="sm" icon="download">تصدير</Button>
            <Button variant="primary" size="sm" icon="plus">فاتورة</Button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'130px 1.8fr 140px 140px 140px 110px', gap:14, padding:'12px 22px', background:'var(--ink-050)', borderBottom:'1px solid var(--border-2)', fontSize:11.5, fontWeight:700, color:'var(--ink-500)' }}>
          <span>رقم الفاتورة</span><span>المورد</span><span>المشروع</span><span>المبلغ</span><span>تاريخ الاستحقاق</span><span>الحالة</span>
        </div>
        {PAYMENTS.map((p,i) => (
          <div key={p.id} style={{ display:'grid', gridTemplateColumns:'130px 1.8fr 140px 140px 140px 110px', gap:14, padding:'14px 22px', alignItems:'center', borderBottom: i < PAYMENTS.length-1 ? '1px solid var(--border-1)' : 'none', fontSize:13, color:'var(--ink-800)' }}>
            <span className="num" style={{ fontSize:12, color:'var(--ink-700)', direction:'ltr', textAlign:'start' }}>{p.id}</span>
            <span style={{ fontWeight:600 }}>{p.vendor}</span>
            <span className="num" style={{ fontSize:12, color:'var(--ink-600)', direction:'ltr', textAlign:'start' }}>{p.project}</span>
            <span className="money" style={{ fontWeight:700 }}>{SAR(p.amount)}</span>
            <span style={{ fontSize:12, color:'var(--ink-600)' }}>{p.due}</span>
            <Chip tone={STATUS[p.status].tone} dot>{STATUS[p.status].label}</Chip>
          </div>
        ))}
      </Card>
    </div>
  );
};
window.Finance = Finance;
