// Dashboard — role-aware Arabic summary
const Dashboard = ({ role, onOpenProject }) => {
  const totalBudget = PROJECTS.reduce((s,p) => s + p.budget, 0);
  const totalSpent  = PROJECTS.reduce((s,p) => s + p.spent, 0);
  const utilization = Math.round((totalSpent / totalBudget) * 100);
  const atRisk = PROJECTS.filter(p => p.status === 'risk' || p.status === 'blocked').length;
  const active = PROJECTS.filter(p => p.status !== 'completed').length;
  const overdueInv = PAYMENTS.filter(p => p.status === 'overdue').length;

  // Role-specific scope
  const scoped = role === 'engineer'
    ? PROJECTS.filter(p => p.team.includes('ms'))
    : role === 'vendor'
    ? PROJECTS.filter(p => ['p1','p3'].includes(p.id))
    : PROJECTS;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
        <KPI label="مشاريع نشطة"     value={active} sub={`من أصل ${PROJECTS.length}`} delta="2" deltaUp/>
        <KPI label="معدّل الإنجاز"   value={`${utilization}٪`} sub="ميزانية مستهلكة" delta="4٪" deltaUp/>
        <KPI label="مشاريع في خطر"   value={atRisk} sub="تحتاج متابعة" delta="1" deltaUp={false} valueColor="var(--warning-700)"/>
        <KPI label="فواتير متأخرة"   value={overdueInv} sub={SAR(96750)} delta={overdueInv} deltaUp={false} valueColor="var(--danger-700)"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
        <Card pad={0}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>المشاريع النشطة</div>
              <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:2 }}>التقدّم، الميزانية، والفِرَق</div>
            </div>
            <Button variant="ghost" size="sm" iconAfter="chevron-left" onClick={() => onOpenProject && onOpenProject('p1')}>عرض الكل</Button>
          </div>
          <div>
            {scoped.slice(0,5).map((p, i) => (
              <div key={p.id} onClick={() => onOpenProject && onOpenProject(p.id)} style={{
                display:'grid', gridTemplateColumns:'1fr 100px 120px 100px', gap:16, alignItems:'center',
                padding:'14px 20px', borderBottom: i < 4 ? '1px solid var(--border-1)' : 'none', cursor:'pointer',
              }}>
                <div style={{ display:'flex', flexDirection:'column', gap:6, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                    <span className="num" style={{ fontSize:11, color:'var(--ink-500)' }}>{p.code}</span>
                    <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--ink-300)' }}/>
                    <span style={{ fontSize:11, color:'var(--ink-500)' }}>{p.discipline}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:'var(--ink-900)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--ink-600)' }}>
                    <span>{p.progress}٪</span>
                    <span>{p.due}</span>
                  </div>
                  <Progress value={p.progress} status={p.status} height={6}/>
                </div>
                <span className="money" style={{ fontSize:12, color:'var(--ink-700)' }}>{SAR(p.spent)} / {SAR(p.budget)}</span>
                <div style={{ display:'flex', justifyContent:'flex-end' }}><StatusChip status={p.status}/></div>
              </div>
            ))}
          </div>
        </Card>

        <Card pad={0}>
          <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border-1)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>آخر النشاطات</div>
            <Icon name="activity" size={16} style={{ color:'var(--ink-500)' }}/>
          </div>
          <div style={{ padding:'4px 0' }}>
            {ACTIVITY.map((a, i) => {
              const p = PEOPLE.find(x => x.id === a.actor);
              return (
                <div key={i} style={{ display:'flex', gap:10, padding:'12px 20px', alignItems:'flex-start', borderBottom: i < ACTIVITY.length-1 ? '1px solid var(--border-1)' : 'none' }}>
                  <Avatar person={a.actor} size={28}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, color:'var(--ink-800)', lineHeight:1.55 }}>
                      <span style={{ fontWeight:700 }}>{p?.name}</span>
                      <span style={{ color:'var(--ink-600)' }}> {a.verb} </span>
                      <span style={{ color:'var(--ink-900)' }}>{a.target}</span>
                    </div>
                    <div style={{ fontSize:11, color:'var(--ink-500)', marginTop:2 }}>{a.when}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <Card>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>الميزانية مقابل المصروف</div>
              <div style={{ fontSize:12, color:'var(--ink-500)', marginTop:2 }}>إجمالي محفظة المشاريع</div>
            </div>
            <Chip tone="navy" dot={false}>محفظة كاملة</Chip>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                <span style={{ color:'var(--ink-600)' }}>الميزانية</span>
                <span className="money" style={{ color:'var(--ink-900)', fontWeight:700 }}>{SAR(totalBudget)}</span>
              </div>
              <div style={{ height:10, background:'var(--ink-100)', borderRadius:999 }}>
                <div style={{ width:'100%', height:'100%', background:'var(--navy-700)', borderRadius:999 }}/>
              </div>
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                <span style={{ color:'var(--ink-600)' }}>المصروف الفعلي</span>
                <span className="money" style={{ color:'var(--ink-900)', fontWeight:700 }}>{SAR(totalSpent)}</span>
              </div>
              <div style={{ height:10, background:'var(--ink-100)', borderRadius:999, direction:'rtl' }}>
                <div style={{ width:`${utilization}%`, height:'100%', background:'var(--teal-500)', borderRadius:999 }}/>
              </div>
            </div>
            <div style={{ fontSize:12, color:'var(--ink-600)' }}>تم استهلاك <strong className="num" style={{ color:'var(--ink-900)' }}>{utilization}٪</strong> من الميزانية الإجمالية للمحفظة.</div>
          </div>
        </Card>

        <Card>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>مهامي اليوم</div>
            <Chip tone="progress" dot={false}>{TASKS.filter(t => t.status === 'progress').length} نشطة</Chip>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {TASKS.slice(0,4).map((t,i) => (
              <div key={t.id} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom: i < 3 ? '1px solid var(--border-1)' : 'none' }}>
                <input type="checkbox" defaultChecked={t.status === 'done'} style={{ width:16, height:16, accentColor:'var(--teal-500)' }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--ink-900)' }}>{t.title}</div>
                  <div style={{ fontSize:11, color:'var(--ink-500)', marginTop:2, fontFamily:'var(--font-mono)', direction:'ltr', textAlign:'start' }}>{t.code}</div>
                </div>
                <span style={{ fontSize:11, color: t.priority === 'high' ? 'var(--danger-700)' : 'var(--ink-500)', fontWeight:600 }}>{t.due}</span>
                <Avatar person={t.assignee} size={24}/>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
window.Dashboard = Dashboard;
