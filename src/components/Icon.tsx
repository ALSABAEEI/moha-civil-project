/**
 * Icon — name-based wrapper around lucide-react that auto-mirrors directional icons in RTL.
 *
 * Usage: <Icon name="folder-kanban" size={18} />
 *
 * To add a new icon: import it from lucide-react and add it to ICONS below.
 */
import {
  AlertTriangle, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck,
  BarChart3, Bell, Briefcase, Building2, Calendar, Check, CheckCheck, CheckCircle2,
  ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CircleAlert,
  CircleDollarSign, Clock, Construction, Copy, CornerUpLeft, CornerUpRight, Download,
  Edit3, ExternalLink, Eye, EyeOff, FileText, Filter, FolderKanban, HardHat, Inbox, Info,
  BookUser, KeyRound, LayoutDashboard, ListChecks, Lock, LogIn, LogOut, Mail,
  MapPin, Menu,
  MoreHorizontal, MoreVertical,
  Paperclip, Pause, Pencil, Plus, Receipt, RefreshCw, Reply, Save, ScrollText, Search,
  Send, Settings2, Share2, Shield, ShieldCheck, Split, Star, Tag, Trash2, TrendingDown,
  TrendingUp, Truck, Undo2, UserPlus, Users, UsersRound, Wallet, X,
  type LucideIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';

const ICONS: Record<string, LucideIcon> = {
  'alert-triangle': AlertTriangle,
  'arrow-down-right': ArrowDownRight,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'badge-check': BadgeCheck,
  'bar-chart-3': BarChart3,
  bell: Bell,
  briefcase: Briefcase,
  'building-2': Building2,
  calendar: Calendar,
  check: Check,
  'check-check': CheckCheck,
  'check-circle-2': CheckCircle2,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,
  'circle-alert': CircleAlert,
  'circle-dollar-sign': CircleDollarSign,
  clock: Clock,
  construction: Construction,
  copy: Copy,
  'corner-up-left': CornerUpLeft,
  'corner-up-right': CornerUpRight,
  download: Download,
  'edit-3': Edit3,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  'file-text': FileText,
  filter: Filter,
  'folder-kanban': FolderKanban,
  'hard-hat': HardHat,
  inbox: Inbox,
  info: Info,
  'book-user': BookUser,
  'key-round': KeyRound,
  'layout-dashboard': LayoutDashboard,
  'list-checks': ListChecks,
  lock: Lock,
  'log-in': LogIn,
  'log-out': LogOut,
  mail: Mail,
  'map-pin': MapPin,
  menu: Menu,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  paperclip: Paperclip,
  pause: Pause,
  pencil: Pencil,
  plus: Plus,
  receipt: Receipt,
  'refresh-cw': RefreshCw,
  reply: Reply,
  save: Save,
  'scroll-text': ScrollText,
  search: Search,
  send: Send,
  'settings-2': Settings2,
  'share-2': Share2,
  shield: Shield,
  'shield-check': ShieldCheck,
  split: Split,
  star: Star,
  tag: Tag,
  'trash-2': Trash2,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  truck: Truck,
  undo2: Undo2,
  'user-plus': UserPlus,
  users: Users,
  'users-round': UsersRound,
  wallet: Wallet,
  x: X,
};

const DIRECTIONAL = new Set<string>([
  'arrow-left', 'arrow-right', 'arrow-up-right', 'arrow-down-right',
  'chevron-left', 'chevron-right', 'chevrons-left', 'chevrons-right',
  'corner-up-left', 'corner-up-right', 'log-in', 'log-out', 'undo2',
  'send', 'reply', 'trending-up', 'trending-down',
]);

export interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  mirror?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 18, stroke = 1.75, mirror, style, className }: IconProps) {
  const Component = ICONS[name];
  if (!Component) {
    // Fall back silently — render an empty span sized to the requested box.
    return <span style={{ display: 'inline-block', width: size, height: size, ...style }} />;
  }
  const shouldMirror = mirror ?? DIRECTIONAL.has(name);
  return (
    <Component
      size={size}
      strokeWidth={stroke}
      style={{
        display: 'inline-block',
        flexShrink: 0,
        transform: shouldMirror ? 'scaleX(-1)' : undefined,
        ...style,
      }}
      className={className}
    />
  );
}
