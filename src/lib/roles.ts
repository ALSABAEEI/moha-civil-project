import type { Role } from '@/types';

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'مسؤول',
  pm: 'مدير مشروع',
  engineer: 'مهندس',
  finance: 'مسؤول مالي',
  vendor: 'مورد',
};

export const ROLE_INFO: Record<Role, { label: string; desc: string; icon: string }> = {
  admin:    { label: 'مسؤول',        desc: 'وصول كامل لجميع المشاريع، الموردين، المهندسين، المهام والتفاصيل المالية.', icon: 'shield' },
  pm:       { label: 'مدير مشروع',   desc: 'متابعة المشاريع المعيّنة وتقدم الفِرق وتحديث المهام.', icon: 'briefcase' },
  engineer: { label: 'مهندس',        desc: 'الاطّلاع فقط على المشاريع والمهام المعيّنة لك.', icon: 'hard-hat' },
  finance:  { label: 'مسؤول مالي',   desc: 'إدارة الميزانيات، الفواتير، والمدفوعات للموردين.', icon: 'wallet' },
  vendor:   { label: 'مورد',         desc: 'وصول محدود إلى العمل المسند إليك وفواتيرك.', icon: 'truck' },
};
