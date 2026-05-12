---
name: protrack-design
description: Use this skill to generate well-branded interfaces and assets for ProTrack — an Arabic-first, RTL-only project tracking platform for contracting and engineering teams. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read `README.md` within this skill, then explore:

- `colors_and_type.css` — tokens. Cairo + JetBrains Mono. Sets `html { direction: rtl }`.
- `assets/` — brand marks (full, icon, monochrome).
- `preview/` — reference cards for the Design System tab.
- `ui_kits/protrack-app/` — Arabic-first React UI kit: SignIn → Onboarding → App (Dashboard, Projects, ProjectDetail, TaskBoard, Vendors, Assignments, Finance, Reports, Notifications, Users).

## Non-negotiables

- **RTL-only.** Every artifact starts with `<html lang="ar" dir="rtl">`. Sidebar lives on the **right**.
- **Cairo** for all UI. **JetBrains Mono** only inside `.num` / `.money` spans (money, codes, dates).
- **Navy `#0F2A4A` + Teal `#17A2A2`** are locked brand colors.
- **No emoji. No decorative gradients.** Lucide icons only — directional ones flip via `.icon-mirror` (the `<Icon>` component handles known names automatically).
- **Money** — `SAR(n)` → `184,500 ر.س`. **Dates** — `18 مايو 2026`.
- **Arabic typography rules** — line-height ≥ 1.30, no negative letter-spacing, body ≥ 13 px.

## When invoked without context

Ask: which screen, which role (Admin / PM / Engineer / Finance / Vendor), high-fidelity prototype or production-shaped code, and whether the user has new Arabic copy to use. Then either produce static HTML referencing `colors_and_type.css`, or extend the JSX in `ui_kits/protrack-app/`.
