// Shared atoms — Arabic-first, RTL-aware
const { useState, useMemo, useEffect } = React;

// Icons whose meaning depends on direction. These get flipped via CSS in RTL.
const DIRECTIONAL_ICONS = new Set([
  'arrow-left','arrow-right','arrow-up-right','arrow-down-right',
  'chevron-left','chevron-right','chevrons-left','chevrons-right',
  'corner-up-left','corner-up-right','log-in','log-out','undo','redo',
  'send','reply','trending-up','trending-down','move-right','move-left',
]);

const Icon = ({ name, size = 18, stroke = 1.75, style, mirror }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': stroke } });
    }
  }, [name, size, stroke]);
  const shouldMirror = mirror ?? DIRECTIONAL_ICONS.has(name);
  return <span ref={ref} className={shouldMirror ? 'icon-mirror' : ''} style={{ display:'inline-flex', width:size, height:size, color:'currentColor', ...style }} />;
};

const Button = ({ variant='primary', size='md', icon, iconAfter, children, onClick, disabled, style }) => {
  const variantStyles = {
    primary:   { background:'var(--navy-800)', color:'#fff' },
    secondary: { background:'#fff', color:'var(--navy-800)', border:'1px solid var(--border-2)' },
    accent:    { background:'var(--teal-500)', color:'#fff' },
    ghost:     { background:'transparent', color:'var(--ink-700)' },
    danger:    { background:'#fff', color:'var(--danger-700)', border:'1px solid var(--danger-100)' },
  };
  const pad = { sm:'6px 12px', md:'9px 16px', lg:'12px 20px' }[size];
  const fs  = { sm:13, md:14, lg:15 }[size];
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display:'inline-flex', alignItems:'center', gap:8, padding:pad, borderRadius:8,
      fontFamily:'var(--font-sans)', fontSize:fs, fontWeight:600, lineHeight:1.4,
      border:'1px solid transparent', cursor:'pointer',
      opacity: disabled ? .4 : 1, pointerEvents: disabled ? 'none' : 'auto',
      transition:'background var(--dur-2) var(--ease-out)',
      ...variantStyles[variant], ...style,
    }}>
      {icon && <Icon name={icon} size={14} stroke={2.1}/>}
      {children}
      {iconAfter && <Icon name={iconAfter} size={14} stroke={2.1}/>}
    </button>
  );
};

const Chip = ({ tone='neutral', children, dot=true, style }) => {
  const map = {
    neutral:  { bg:'var(--ink-100)',     fg:'var(--ink-700)',     d:'var(--ink-500)' },
    progress: { bg:'var(--teal-050)',    fg:'var(--teal-700)',    d:'var(--teal-500)' },
    review:   { bg:'var(--info-050)',    fg:'var(--info-700)',    d:'var(--info-500)' },
    risk:     { bg:'var(--warning-050)', fg:'var(--warning-700)', d:'var(--warning-500)' },
    blocked:  { bg:'var(--danger-050)',  fg:'var(--danger-700)',  d:'var(--danger-500)' },
    completed:{ bg:'var(--success-050)', fg:'var(--success-700)', d:'var(--success-500)' },
    navy:     { bg:'var(--navy-100)',    fg:'var(--navy-800)',    d:'var(--navy-700)' },
  };
  const c = map[tone] || map.neutral;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6, padding:'3px 10px',
      borderRadius:999, fontSize:11.5, fontWeight:600, background:c.bg, color:c.fg,
      fontFamily:'var(--font-sans)', whiteSpace:'nowrap', ...style,
    }}>
      {dot && <span style={{ width:6, height:6, borderRadius:'50%', background:c.d }}/>}
      {children}
    </span>
  );
};

const STATUS_LABEL = {
  progress:'قيد التنفيذ', review:'قيد المراجعة', risk:'في خطر',
  blocked:'متوقف', completed:'مكتمل', todo:'لم يبدأ', done:'مكتمل',
};
const STATUS_TONE = {
  progress:'progress', review:'review', risk:'risk',
  blocked:'blocked', completed:'completed', todo:'neutral', done:'completed',
};
const StatusChip = ({ status }) => <Chip tone={STATUS_TONE[status] || 'neutral'}>{STATUS_LABEL[status] || status}</Chip>;

const Avatar = ({ person, size=28, ring=false }) => {
  const p = typeof person === 'string' ? window.PEOPLE.find(x => x.id === person) : person;
  if (!p) return null;
  const fs = size <= 22 ? 10 : size <= 28 ? 11 : size <= 36 ? 12 : 14;
  return (
    <span style={{
      width:size, height:size, borderRadius:'50%', display:'inline-flex',
      alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700,
      background:p.color, fontSize:fs, fontFamily:'var(--font-sans)', flexShrink:0,
      border: ring ? '2px solid #fff' : 'none', boxSizing:'border-box',
    }}>{p.initials}</span>
  );
};

const AvatarStack = ({ ids, size=24, max=4 }) => {
  const shown = ids.slice(0, max);
  const overflow = ids.length - shown.length;
  return (
    <div style={{ display:'flex' }}>
      {shown.map((id, i) => (
        <span key={id} style={{ marginRight: i === 0 ? 0 : -8, border:'2px solid #fff', borderRadius:'50%', display:'inline-flex' }}>
          <Avatar person={id} size={size}/>
        </span>
      ))}
      {overflow > 0 && (
        <span style={{ marginRight:-8, width:size, height:size, borderRadius:'50%', background:'var(--ink-200)', color:'var(--ink-700)', fontSize:10, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' }}>+{overflow}</span>
      )}
    </div>
  );
};

const Progress = ({ value=0, status='progress', height=8 }) => {
  const fillColor = {
    progress: 'var(--teal-500)',
    risk:     'var(--warning-500)',
    blocked:  'var(--danger-500)',
    completed:'var(--success-500)',
    review:   'var(--info-500)',
  }[status] || 'var(--teal-500)';
  // Progress fills RTL: anchor right side
  return (
    <div style={{ height, background:'var(--ink-150)', borderRadius:999, overflow:'hidden', direction:'rtl' }}>
      <div style={{ width:`${value}%`, height:'100%', background:fillColor, borderRadius:999, transition:'width var(--dur-3) var(--ease-out)' }}/>
    </div>
  );
};

const Card = ({ children, style, pad=20 }) => (
  <div style={{ background:'#fff', border:'1px solid var(--border-1)', borderRadius:12, boxShadow:'var(--shadow-sm)', padding:pad, ...style }}>
    {children}
  </div>
);

const KPI = ({ label, value, delta, deltaUp, sub, valueColor }) => (
  <Card pad={18}>
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <span style={{ fontSize:12, fontWeight:600, color:'var(--ink-500)' }}>{label}</span>
      <span className="money" style={{ fontSize:24, fontWeight:700, color: valueColor || 'var(--ink-900)', lineHeight:1.1 }}>{value}</span>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {delta && (
          <span style={{ fontSize:11, fontWeight:600, padding:'1px 6px', borderRadius:4,
            color: deltaUp ? 'var(--success-700)' : 'var(--danger-700)',
            background: deltaUp ? 'var(--success-050)' : 'var(--danger-050)',
            direction:'ltr',
          }}>{deltaUp ? '+' : ''}{delta}</span>
        )}
        {sub && <span style={{ fontSize:11, color:'var(--ink-500)' }}>{sub}</span>}
      </div>
    </div>
  </Card>
);

// SAR money formatting — Arabic style with halalas: "184,500.00 ر.س"
// Western digits throughout for tabular alignment; Arabic riyal symbol.
const SAR = (n, opts = {}) => {
  const { halalas = true } = opts;
  const v = (n || 0).toLocaleString('en-US', {
    minimumFractionDigits: halalas ? 2 : 0,
    maximumFractionDigits: halalas ? 2 : 0,
  });
  return `${v} ر.س`;
};
// SARw = whole-riyal variant (use in compact KPIs where halalas would crowd)
const SARw = (n) => SAR(n, { halalas:false });

// Arabic Eastern digits utility (use sparingly — only where the brief demands)
const toArabicDigits = (s) => String(s).replace(/[0-9]/g, d => '0123456789'[d]);

Object.assign(window, {
  Icon, Button, Chip, StatusChip, Avatar, AvatarStack,
  Progress, Card, KPI, SAR, SARw, toArabicDigits,
});
