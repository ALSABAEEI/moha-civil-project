# ProTrack

**Arabic-first · RTL-only** project tracking and management platform for contracting and engineering companies — civil, electrical, mechanical, construction, maintenance, and technical-service projects.

Built on the ProTrack design system in [`/design-system`](./design-system) — Cairo + JetBrains Mono, Navy `#0F2A4A` + Teal `#17A2A2`, RTL throughout.

---

## Getting started

```bash
npm install
npm run dev
```

The dev server runs on **http://localhost:5185**.

### Build

```bash
npm run build    # type-check + production build → dist/
npm run preview  # preview the production build locally
npm run lint     # type-check only (tsc --noEmit)
```

---

## Stack

| Concern              | Choice                                          |
|----------------------|-------------------------------------------------|
| Build                | Vite 5                                          |
| Language             | TypeScript 5                                    |
| UI                   | React 18                                        |
| Routing              | React Router v6                                 |
| State                | Zustand (`src/stores/auth.ts`)                  |
| Icons                | `lucide-react` (kebab-case `<Icon name="…" />`) |
| Styling              | Inline styles + CSS variables from `/design-system/colors_and_type.css` |
| Backend (placeholder)| Supabase JS client (`src/lib/supabase.ts`)      |

---

## Project layout

```
design-system/              Reference design system — tokens, assets, preview cards, full kit
src/
  main.tsx                  React entry + BrowserRouter
  App.tsx                   Route table + RequireAuth gate
  index.css                 Imports design-system tokens + base rules
  components/               Reusable atoms — Icon, Button, Chip, Card, Avatar, Progress, KPI, Modal, Sidebar, TopBar
  routes/
    SignIn.tsx, Onboarding.tsx
    AppLayout.tsx           Sidebar + TopBar shell, role-aware nav
    Dashboard.tsx, ProjectsList.tsx, ProjectDetail.tsx (9-tab page)
    TaskBoard.tsx, Vendors.tsx, Finance.tsx, Notifications.tsx, Users.tsx
    Placeholder.tsx         For modules not yet built (settings, reports, audit, etc.)
  data/mock.ts              Typed mock data — projects, terms, expenses, tasks, vendors, payments…
  lib/
    format.ts               SAR(), SARw(), toArabicDigits(), formatDateArabic()
    finance.ts              computeProjectFinance() — single source of truth for project finance math
    supabase.ts             Placeholder client (null until env vars are set)
  stores/auth.ts            Zustand auth store — signedIn, role, personId
  types/index.ts            Project, Term, Expense, Task, Vendor, User, Role, …
```

---

## Roles

Mock auth, switchable from the top bar:

| Role           | Sees                                                              |
|----------------|-------------------------------------------------------------------|
| `admin`        | Everything                                                        |
| `pm`           | Own projects (`pm === personId`)                                  |
| `engineer`     | Only assigned projects (`team.includes(personId)`)                |
| `finance`      | All projects, finance/approval/vendor modules                     |
| `vendor`       | Projects where their company has work                             |

Filter is in `visibleProjects(role, personId)` in `src/data/mock.ts`. Sidebar items are filtered by role in `src/components/Sidebar.tsx`.

---

## Project Details — the priority module

`/app/projects/:id` has **9 tabs**, matching the brief:

1. **نظرة عامة** — timeline + team
2. **بنود المشروع** — full CRUD (add/edit/delete) with all 8 fields the brief calls for
3. **المهام** — task list filtered to the project
4. **الموردون** — vendors table
5. **الفريق** — team members
6. **مصروفات المشروع** — full CRUD with 10 fields (name, type, amount, date, vendor, term, method, invoice no, attachment, notes)
7. **المتابعة المالية** — 8 finance KPIs + invoice table
8. **المستندات** — placeholder for Supabase Storage
9. **النشاطات** — activity log

### Live financial calculation

`computeProjectFinance()` in `src/lib/finance.ts` runs on **every** expense or term mutation (via React's `useMemo`). The header KPIs and Finance tab cards update immediately when you add/edit/delete an expense. Currently the data is in component state; switching to Supabase only requires replacing the source — the math is unchanged.

Computed values:
- إجمالي ميزانية المشروع
- إجمالي البنود
- إجمالي المصروفات
- المدفوع (paid invoices)
- المتبقي
- نسبة الصرف من الميزانية
- الفرق بين الميزانية والمصروفات
- حالة الدفع المالية (healthy / tight / over)
- آخر مصروف مضاف

---

## RTL & numbers

- `<html lang="ar" dir="rtl">` is set in `index.html`.
- `colors_and_type.css` applies `direction: rtl` to `html` globally.
- Sidebar is on the **right** (`AppLayout.tsx`).
- All numbers/money/codes wrap in `.num` or `.money` spans which set `direction: ltr` + tabular numerals so figures align in tables.
- Currency: `SAR(184500)` → `184,500.00 ر.س`. `SARw(184500)` → `184,500 ر.س` (no halalas, for compact KPIs).
- Western digits in tables/IDs; Arabic digits available via `toArabicDigits()` for narrative copy.

---

## Supabase

Currently a placeholder. Fill in `.env.local` to enable:

```bash
cp .env.example .env.local
# then edit VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

The client lives at `src/lib/supabase.ts`. Until env vars are set, it exports `supabase = null` and the app uses mock data. To switch over, replace the data getters in `src/data/mock.ts` (e.g. `visibleProjects()`) with Supabase queries — none of the components import data directly from Supabase.
