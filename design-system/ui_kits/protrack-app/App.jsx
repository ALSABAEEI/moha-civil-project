// App shell — RTL, Arabic-first
const App = () => {
  const [mode, setMode] = React.useState('signin'); // signin | onboarding | app
  const [role, setRole] = React.useState('admin');
  const [screen, setScreen] = React.useState('dashboard');
  const [openProject, setOpenProject] = React.useState(null);

  const goProject = (id) => { setScreen('projects'); setOpenProject(id); };

  const TITLES = {
    dashboard:    { t:'الرئيسية',          s:'نظرة شاملة على مشاريعك ومهامك' },
    projects:     { t:'المشاريع',          s:'متابعة محفظة المشاريع وحالة كل مشروع' },
    tasks:        { t:'المهام',             s:'لوحة كانبان للمهام الفعّالة' },
    vendors:      { t:'الموردون',           s:'إدارة الموردين وحالة التأهيل' },
    engineers:    { t:'المهندسون',          s:'فِرَق التنفيذ والتوزيع' },
    assignments:  { t:'التعيينات',          s:'توزيع المهندسين والموردين على المشاريع' },
    finance:      { t:'المتابعة المالية',   s:'الميزانية، المدفوعات، والفواتير' },
    reports:      { t:'التقارير',            s:'تقارير دورية ومخصّصة' },
    notifications:{ t:'الإشعارات',          s:'كل التحديثات في مكان واحد' },
    approvals:    { t:'الاعتمادات',          s:'الطلبات بانتظار اعتمادك' },
    audit:        { t:'سجل التدقيق',          s:'حركة كل تغيير حسّاس في النظام' },
    search:       { t:'نتائج البحث',          s:'النتائج عبر المشاريع والفواتير والمستندات' },
    users:        { t:'إدارة المستخدمين',   s:'الصلاحيات، الأدوار، والدعوات' },
    settings:     { t:'الإعدادات',           s:'تفضيلات الحساب والنظام' },
    engineers_:   { t:'المهندسون',          s:'' },
  };

  let content;
  if (screen === 'dashboard')      content = <Dashboard role={role} onOpenProject={goProject}/>;
  else if (screen === 'projects' && openProject) content = <ProjectDetail projectId={openProject} onBack={() => setOpenProject(null)}/>;
  else if (screen === 'projects')  content = <Projects onOpenProject={goProject}/>;
  else if (screen === 'tasks')     content = <TaskBoard/>;
  else if (screen === 'finance')   content = <Finance/>;
  else if (screen === 'vendors')   content = <Vendors/>;
  else if (screen === 'reports')   content = <Reports/>;
  else if (screen === 'notifications') content = <Notifications/>;
  else if (screen === 'approvals') content = <Approvals/>;
  else if (screen === 'audit')     content = <AuditLog/>;
  else if (screen === 'search')    content = <SearchResults/>;
  else if (screen === 'users')     content = <Users/>;
  else if (screen === 'assignments') content = <Assignments/>;
  else if (screen === 'settings')  content = <Settings/>;
  else content = (
    <Card>
      <div style={{ padding:'40px 20px', textAlign:'center' }}>
        <Icon name="construction" size={28} style={{ color:'var(--ink-400)' }}/>
        <div style={{ fontSize:14, color:'var(--ink-700)', marginTop:10, fontWeight:700 }}>وحدة {TITLES[screen]?.t}</div>
        <div style={{ fontSize:13, color:'var(--ink-500)', marginTop:4 }}>قيد التطوير في حزمة الواجهات الحالية.</div>
      </div>
    </Card>
  );

  let pageTitle = TITLES[screen]?.t || screen;
  let pageSub   = TITLES[screen]?.s;
  if (screen === 'projects' && openProject) {
    const p = PROJECTS.find(x => x.id === openProject);
    if (p) { pageTitle = p.name; pageSub = p.code; }
  }

  // Onboarding/sign-in modes
  if (mode === 'signin') return <SignIn onSignIn={() => setMode('onboarding')}/>;
  if (mode === 'onboarding') return <Onboarding onComplete={(r) => { setRole(r); setMode('app'); }}/>;
  if (role === 'vendor') return <VendorPortal onSignOut={() => setMode('signin')}/>;

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-app)' }}>
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <TopBar role={role} setRole={setRole} title={pageTitle} subtitle={pageSub}/>
        <div style={{ flex:1, overflow:'auto', padding:'22px 26px' }}>
          {content}
        </div>
      </main>
      <Sidebar screen={screen} setScreen={(s) => { setScreen(s); setOpenProject(null); }} role={role}/>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
