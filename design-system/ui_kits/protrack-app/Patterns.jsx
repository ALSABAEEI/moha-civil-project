// Reusable patterns — Modal, Toast, EmptyState, ConfirmDialog
// Loaded after Components.jsx, available globally.

const Modal = ({ open, onClose, title, sub, children, footer, width=560 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed', inset:0, background:'rgba(11,19,32,0.55)', zIndex:1300,
      display:'flex', alignItems:'center', justifyContent:'center', padding:20,
      animation:'fadeIn .15s var(--ease-out)',
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'#fff', borderRadius:14, width, maxWidth:'100%', maxHeight:'90vh',
        display:'flex', flexDirection:'column', boxShadow:'var(--shadow-xl)', overflow:'hidden',
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', padding:'18px 22px', borderBottom:'1px solid var(--border-1)' }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16, fontWeight:700, color:'var(--ink-900)' }}>{title}</div>
            {sub && <div style={{ fontSize:12.5, color:'var(--ink-500)', marginTop:4, lineHeight:1.6 }}>{sub}</div>}
          </div>
          <Icon name="x" size={18} style={{ color:'var(--ink-500)', cursor:'pointer' }} onClick={onClose}/>
        </div>
        <div style={{ padding:'20px 22px', overflow:'auto', flex:1 }}>{children}</div>
        {footer && <div style={{ display:'flex', gap:8, justifyContent:'flex-end', padding:'14px 22px', borderTop:'1px solid var(--border-1)', background:'var(--ink-050)' }}>{footer}</div>}
      </div>
    </div>
  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, tone='primary', title, body, confirmLabel='تأكيد', cancelLabel='إلغاء' }) => (
  <Modal open={open} onClose={onClose} title={title} width={460} footer={
    <>
      <Button variant="secondary" size="sm" onClick={onClose}>{cancelLabel}</Button>
      <Button variant={tone === 'danger' ? 'danger' : 'primary'} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
    </>
  }>
    <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
      <div style={{
        width:40, height:40, borderRadius:10, flexShrink:0,
        background: tone === 'danger' ? 'var(--danger-050)' : 'var(--navy-050)',
        color:    tone === 'danger' ? 'var(--danger-700)' : 'var(--navy-700)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name={tone === 'danger' ? 'triangle-alert' : 'help-circle'} size={20}/>
      </div>
      <div style={{ fontSize:13.5, color:'var(--ink-700)', lineHeight:1.7 }}>{body}</div>
    </div>
  </Modal>
);

const Toast = ({ tone='success', title, body, onClose }) => {
  const map = {
    success: { bg:'#fff', bar:'var(--success-500)', icon:'check-circle-2', ic:'var(--success-700)' },
    info:    { bg:'#fff', bar:'var(--info-500)',    icon:'info',             ic:'var(--info-700)' },
    warning: { bg:'#fff', bar:'var(--warning-500)', icon:'triangle-alert',   ic:'var(--warning-700)' },
    error:   { bg:'#fff', bar:'var(--danger-500)',  icon:'x-circle',         ic:'var(--danger-700)' },
  };
  const t = map[tone];
  return (
    <div style={{
      minWidth:320, maxWidth:420, background:t.bg, borderRadius:10,
      boxShadow:'var(--shadow-lg)', border:'1px solid var(--border-1)',
      display:'flex', overflow:'hidden',
    }}>
      <span style={{ width:4, background:t.bar }}/>
      <div style={{ display:'flex', gap:10, padding:'12px 14px', flex:1 }}>
        <Icon name={t.icon} size={18} style={{ color:t.ic, flexShrink:0, marginTop:2 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'var(--ink-900)' }}>{title}</div>
          {body && <div style={{ fontSize:12, color:'var(--ink-600)', marginTop:3, lineHeight:1.55 }}>{body}</div>}
        </div>
        {onClose && <Icon name="x" size={14} style={{ color:'var(--ink-400)', cursor:'pointer' }} onClick={onClose}/>}
      </div>
    </div>
  );
};

const ToastStack = ({ toasts }) => (
  <div style={{ position:'fixed', bottom:20, insetInlineStart:20, display:'flex', flexDirection:'column', gap:10, zIndex:1400 }}>
    {toasts.map((t, i) => <Toast key={i} {...t}/>)}
  </div>
);

const EmptyState = ({ icon='inbox', title, body, action, tone='neutral' }) => {
  const colors = {
    neutral: { bg:'var(--ink-050)',     fg:'var(--ink-400)' },
    success: { bg:'var(--success-050)', fg:'var(--success-700)' },
    warning: { bg:'var(--warning-050)', fg:'var(--warning-700)' },
    info:    { bg:'var(--info-050)',    fg:'var(--info-700)' },
  }[tone] || { bg:'var(--ink-050)', fg:'var(--ink-400)' };
  return (
    <div style={{
      padding:'56px 24px', textAlign:'center', background:'#fff',
      border:'1px dashed var(--border-2)', borderRadius:14,
    }}>
      <div style={{
        width:64, height:64, borderRadius:16, background:colors.bg, color:colors.fg,
        margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon name={icon} size={28}/>
      </div>
      <div style={{ fontSize:15, fontWeight:700, color:'var(--ink-900)' }}>{title}</div>
      {body && <div style={{ fontSize:13, color:'var(--ink-500)', marginTop:6, maxWidth:420, marginInline:'auto', lineHeight:1.6 }}>{body}</div>}
      {action && <div style={{ marginTop:14 }}>{action}</div>}
    </div>
  );
};

Object.assign(window, { Modal, ConfirmDialog, Toast, ToastStack, EmptyState });
