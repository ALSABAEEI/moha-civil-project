// ProTrack mock data — Arabic-first
// All user-visible strings are Arabic. IDs/codes stay ASCII.

// Engineers can be based in different cities — used by Assignments to filter / show base
const PEOPLE = [
  { id:'fa', name:'فيصل الحربي',     role:'مدير مشروع',        initials:'فح', color:'var(--navy-700)', city:'الرياض' },
  { id:'ms', name:'محمد سالم',       role:'مهندس',             initials:'مس', color:'var(--teal-600)', city:'الرياض' },
  { id:'ah', name:'أحمد حسين',       role:'مهندس',             initials:'أح', color:'var(--blue-600)', city:'جدة' },
  { id:'yk', name:'يوسف خليل',       role:'مهندس',             initials:'يخ', color:'var(--ink-700)', city:'الدمام' },
  { id:'na', name:'نورة العتيبي',    role:'مسؤول',             initials:'نع', color:'var(--navy-800)', city:'الرياض' },
  { id:'sl', name:'سارة اللحيدان',   role:'مسؤول مالي',         initials:'سل', color:'var(--teal-700)', city:'الرياض' },
];
const CITIES = ['الرياض','جدة','الدمام','الخبر','مكة المكرمة','المدينة المنورة'];

const VENDORS = [
  { id:'nec', name:'شركة نجد للأعمال الكهربائية',     discipline:'كهربائي',   status:'active',       contact:'+966 11 234 5678', projects:3 },
  { id:'afc', name:'الفيصل للأعمال المدنية',          discipline:'مدني',      status:'active',       contact:'+966 12 567 8901', projects:5 },
  { id:'mml', name:'الحديثة للأعمال الميكانيكية',     discipline:'ميكانيكي',  status:'awaiting',     contact:'+966 13 890 1234', projects:2 },
  { id:'gtl', name:'الخليج للخدمات الفنية',           discipline:'صيانة',     status:'prequalified', contact:'+966 11 456 7890', projects:0 },
  { id:'sce', name:'المهندسون السعوديون للإنشاءات',    discipline:'إنشاءات',   status:'suspended',    contact:'+966 13 321 6547', projects:1 },
];

const PROJECTS = [
  { id:'p1', code:'CIV-2026-014', name:'محطة الرياض الفرعية الشمالية',
    discipline:'كهربائي', status:'progress', progress:64,
    budget:1_250_000, spent:837_420, due:'18 يونيو 2026',
    pm:'fa', team:['fa','ms','ah'], client:'الشركة السعودية للكهرباء',
    location:'الرياض · الحي الشمالي' },
  { id:'p2', code:'MNT-2026-021', name:'صيانة ميناء جدة',
    discipline:'ميكانيكي', status:'risk', progress:38,
    budget:720_000, spent:412_300, due:'02 يونيو 2026',
    pm:'fa', team:['ah','yk'], client:'الهيئة العامة للموانئ',
    location:'جدة · الميناء الإسلامي' },
  { id:'p3', code:'CON-2025-098', name:'مركز الدمام اللوجستي — المرحلة الثانية',
    discipline:'إنشاءات', status:'progress', progress:78,
    budget:4_200_000, spent:2_980_000, due:'30 سبتمبر 2026',
    pm:'fa', team:['ms','yk','ah'], client:'تبادل اللوجستية',
    location:'الدمام · المدينة الصناعية' },
  { id:'p4', code:'CIV-2026-007', name:'توسعة طريق الملك سلمان',
    discipline:'مدني', status:'progress', progress:22,
    budget:6_800_000, spent:1_120_000, due:'14 ديسمبر 2026',
    pm:'fa', team:['ms','ah','yk'], client:'وزارة النقل',
    location:'الرياض · طريق الملك سلمان' },
  { id:'p5', code:'TSV-2026-002', name:'تجديد تكييف مقر أرامكو',
    discipline:'خدمة فنية', status:'review', progress:92,
    budget:940_000, spent:871_500, due:'25 مايو 2026',
    pm:'fa', team:['yk','ms'], client:'أرامكو السعودية',
    location:'الظهران' },
  { id:'p6', code:'CIV-2025-088', name:'محطة الخبر لمعالجة المياه',
    discipline:'مدني', status:'completed', progress:100,
    budget:3_100_000, spent:3_018_400, due:'12 مارس 2026',
    pm:'fa', team:['ah','yk'], client:'شركة المياه الوطنية',
    location:'الخبر' },
  { id:'p7', code:'MNT-2026-031', name:'صيانة محطة قطار الرياض رقم 12',
    discipline:'صيانة', status:'blocked', progress:14,
    budget:480_000, spent:92_000, due:'08 يوليو 2026',
    pm:'fa', team:['yk'], client:'شركة قطار الرياض',
    location:'الرياض · المحطة 12' },
];

const TASKS = [
  { id:'t1', code:'CIV-2026-014 · T-08', title:'صب أساس البلاطة — القسم ب', status:'progress', assignee:'ms', due:'14 مايو', priority:'normal', project:'p1' },
  { id:'t2', code:'CIV-2026-014 · T-09', title:'تسليم مخططات حديد التسليح للورشة', status:'progress', assignee:'ah', due:'12 مايو', priority:'high',   project:'p1' },
  { id:'t3', code:'CIV-2026-014 · T-10', title:'التنسيق مع نجد الكهربائية حول مسارات المواسير', status:'progress', assignee:'fa', due:'16 مايو', priority:'normal', project:'p1' },
  { id:'t4', code:'CIV-2026-014 · T-06', title:'تقرير فحص التربة — مختبر نجد', status:'review', assignee:'fa', due:'اليوم',  priority:'normal', project:'p1' },
  { id:'t5', code:'CIV-2026-014 · T-11', title:'تحديث خطة السلامة في الموقع', status:'todo',   assignee:'ms', due:'20 مايو', priority:'normal', project:'p1' },
  { id:'t6', code:'CIV-2026-014 · T-12', title:'توريد حديد التسليح 22مم — 80 طن', status:'todo',   assignee:'yk', due:'22 مايو', priority:'high',   project:'p1' },
  { id:'t7', code:'CIV-2026-014 · T-04', title:'تجهيز الموقع والتعبئة',     status:'done', assignee:'yk', due:'02 مايو', priority:'normal', project:'p1' },
  { id:'t8', code:'CIV-2026-014 · T-05', title:'رفع مساحي وتخطيط الحدود',   status:'done', assignee:'ah', due:'06 مايو', priority:'normal', project:'p1' },
  { id:'t9', code:'CIV-2026-014 · T-03', title:'الحصول على التراخيص',       status:'done', assignee:'fa', due:'28 أبريل', priority:'normal', project:'p1' },
];

const PAYMENTS = [
  { id:'INV-08842', vendor:'شركة نجد للأعمال الكهربائية',  project:'CIV-2026-014', amount:184500, status:'paid',    due:'02 مايو 2026' },
  { id:'INV-08843', vendor:'الفيصل للأعمال المدنية',       project:'CIV-2026-014', amount:312000, status:'pending', due:'11 مايو 2026' },
  { id:'INV-08847', vendor:'الحديثة للأعمال الميكانيكية',  project:'MNT-2026-021', amount:96750,  status:'overdue', due:'28 أبريل 2026' },
  { id:'INV-08851', vendor:'الفيصل للأعمال المدنية',       project:'CON-2025-098', amount:421000, status:'paid',    due:'03 مايو 2026' },
  { id:'INV-08854', vendor:'شركة نجد للأعمال الكهربائية',  project:'CIV-2026-007', amount:78000,  status:'pending', due:'19 مايو 2026' },
  { id:'INV-08858', vendor:'الخليج للخدمات الفنية',         project:'TSV-2026-002', amount:142300, status:'pending', due:'25 مايو 2026' },
  { id:'INV-08860', vendor:'الحديثة للأعمال الميكانيكية',  project:'MNT-2026-031', amount:38400,  status:'draft',   due:'—' },
];

const TERMS = [
  { id:1, title:'نطاق العمل',
    summary:'تصميم وتوريد وتركيب وتشغيل محطة فرعية جهد 33/13٫8 ك.ف، شاملةً المحولات وألواح التوزيع وأنظمة الحماية، وفق معايير الشركة السعودية للكهرباء.' },
  { id:2, title:'شروط الدفع',
    summary:'دفعة مقدمة 30٪ مقابل ضمان بنكي. 60٪ على فواتير تقدّم شهرية معتمدة من الاستشاري. 10٪ ضمان حسن التنفيذ تُفرج بعد الاستلام النهائي.' },
  { id:3, title:'مدة المشروع',
    summary:'14 شهراً من تاريخ المباشرة، مع 4 مراحل رئيسية (م1–م4). غرامة تأخير 0٫1٪ من قيمة العقد يومياً، بحد أقصى 5٪.' },
  { id:4, title:'الضمان والعيوب',
    summary:'24 شهراً من الاستلام الابتدائي. الاستجابة لإشعارات العيوب خلال 48 ساعة ومعالجتها خلال 14 يوماً تقويمياً.' },
  { id:5, title:'التأمين والسلامة',
    summary:'تأمين ضد جميع الأخطار بحد أدنى 5 مليون ر.س. مسؤولية تجاه الغير 2 مليون ر.س. خطة سلامة قبل المباشرة، واجتماعات أسبوعية.' },
];

const ACTIVITY = [
  { actor:'fa', verb:'اعتمد',         target:'الفاتورة INV-08842 — نجد الكهربائية',          when:'قبل 12 دقيقة' },
  { actor:'ms', verb:'أنهى',          target:'المهمة T-04 تجهيز الموقع',                       when:'قبل ساعة' },
  { actor:'sl', verb:'أبلغت عن',      target:'تأخر الفاتورة INV-08847',                        when:'قبل 3 ساعات' },
  { actor:'ah', verb:'رفع',           target:'مخططات حديد التسليح للمراجعة',                   when:'قبل 5 ساعات' },
  { actor:'na', verb:'أضافت موردًا',   target:'الخليج للخدمات الفنية إلى المعتمدين',             when:'أمس' },
  { actor:'fa', verb:'أنشأ مشروعًا',   target:'TSV-2026-002 تجديد تكييف مقر أرامكو',            when:'قبل يومين' },
];

const NOTIFICATIONS = [
  { id:'n1', kind:'finance', read:false, when:'قبل 8 دقائق',
    title:'فاتورة متأخرة',           body:'INV-08847 من الحديثة للأعمال الميكانيكية متأخرة منذ 14 يوماً.' },
  { id:'n2', kind:'project', read:false, when:'قبل 23 دقيقة',
    title:'مشروع في خطر',            body:'CIV-2026-014 تجاوز ميزانية القسم ب بنسبة 12٪.' },
  { id:'n3', kind:'task',    read:false, when:'قبل ساعة',
    title:'مهمة بانتظار المراجعة',    body:'محمد سالم رفع مخططات حديد التسليح للمراجعة.' },
  { id:'n4', kind:'mention', read:true,  when:'قبل 3 ساعات',
    title:'تمت الإشارة إليك',         body:'سارة اللحيدان أشارت إليك في تعليق على INV-08854.' },
  { id:'n5', kind:'vendor',  read:true,  when:'أمس',
    title:'مورد جديد بانتظار التأهيل', body:'الخليج للخدمات الفنية أكمل ملف التأهيل المسبق.' },
  { id:'n6', kind:'system',  read:true,  when:'قبل يومين',
    title:'تحديث صلاحيات',            body:'تم تحديث صلاحيات دور المهندس — راجع لوحة الصلاحيات.' },
];

const USERS = [
  { id:'u1', personId:'na', email:'nora@protrack.sa',    role:'admin',    department:'الإدارة',          status:'active',   lastSeen:'الآن' },
  { id:'u2', personId:'fa', email:'faisal@protrack.sa',  role:'pm',       department:'المشاريع',         status:'active',   lastSeen:'قبل 12 دقيقة' },
  { id:'u3', personId:'sl', email:'sara@protrack.sa',    role:'finance',  department:'المالية',           status:'active',   lastSeen:'قبل 40 دقيقة' },
  { id:'u4', personId:'ms', email:'mohammed@protrack.sa',role:'engineer', department:'الهندسة',          status:'active',   lastSeen:'قبل ساعتين' },
  { id:'u5', personId:'ah', email:'ahmad@protrack.sa',   role:'engineer', department:'الهندسة',          status:'invited',  lastSeen:'—' },
  { id:'u6', personId:'yk', email:'yousef@protrack.sa',  role:'engineer', department:'الهندسة',          status:'suspended',lastSeen:'قبل 4 أيام' },
];

const ROLE_LABEL = {
  admin:'مسؤول', pm:'مدير مشروع', engineer:'مهندس', finance:'مسؤول مالي', vendor:'مورد',
};
const ROLE_INFO = {
  admin:    { label:'مسؤول',        desc:'وصول كامل لجميع المشاريع، الموردين، المهندسين، المهام والتفاصيل المالية.', icon:'shield' },
  pm:       { label:'مدير مشروع',   desc:'متابعة المشاريع المعيّنة وتقدم الفِرق.', icon:'briefcase' },
  engineer: { label:'مهندس',        desc:'الاطلاع فقط على المشاريع والمهام المعيّنة لك.', icon:'hard-hat' },
  finance:  { label:'مسؤول مالي',    desc:'إدارة الميزانيات، الفواتير، والمدفوعات للموردين.', icon:'wallet' },
  vendor:   { label:'مورد',         desc:'وصول محدود إلى العمل المسند إليك وفواتيرك.', icon:'truck' },
};

Object.assign(window, {
  PEOPLE, VENDORS, PROJECTS, TASKS, PAYMENTS, TERMS, ACTIVITY,
  NOTIFICATIONS, USERS, ROLE_LABEL, ROLE_INFO, CITIES,
});
