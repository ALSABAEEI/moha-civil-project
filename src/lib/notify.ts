/**
 * Centralized SweetAlert2 helpers for the whole app.
 *
 * - `toast.success/error/info/warning(text)` → top-start toast with timer bar
 * - `confirmDelete({ title, text, confirmText })` → returns a Promise<boolean>
 *
 * Everything uses RTL automatically because the document is `dir="rtl"`,
 * and we apply the Cairo font + brand radii via the `protrack-swal` and
 * `protrack-toast` custom classes (see index.css).
 */
import Swal, { type SweetAlertIcon } from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-start', // top-right in RTL
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'protrack-toast',
    title: 'protrack-toast-title',
    timerProgressBar: 'protrack-toast-progress',
  },
  didOpen: (el) => {
    el.addEventListener('mouseenter', Swal.stopTimer);
    el.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

function fire(icon: SweetAlertIcon, title: string) {
  return Toast.fire({ icon, title });
}

export const toast = {
  success: (title: string) => fire('success', title),
  error:   (title: string) => fire('error', title),
  info:    (title: string) => fire('info', title),
  warning: (title: string) => fire('warning', title),
};

export interface ConfirmDeleteOptions {
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}

export async function confirmDelete(opts: ConfirmDeleteOptions = {}): Promise<boolean> {
  const result = await Swal.fire({
    title: opts.title || 'هل أنت متأكد؟',
    text: opts.text || 'لا يمكن التراجع عن هذا الإجراء.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: opts.confirmText || 'نعم، احذف',
    cancelButtonText: opts.cancelText || 'إلغاء',
    confirmButtonColor: '#D63B3B',   // var(--danger-500)
    cancelButtonColor: '#6B7689',    // var(--ink-500)
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: 'protrack-swal',
      title: 'protrack-swal-title',
      htmlContainer: 'protrack-swal-body',
      confirmButton: 'protrack-swal-confirm',
      cancelButton: 'protrack-swal-cancel',
    },
  });
  return result.isConfirmed;
}
