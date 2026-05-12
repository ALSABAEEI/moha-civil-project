# ProTrack Design System

**Arabic-first · RTL-only** project tracking and management platform for contracting and engineering teams. Manages civil, electrical, mechanical, construction, maintenance, and technical-service projects across **Admin · Project Manager · Engineer · Finance Officer · Vendor** roles.

> The entire platform is built for Arabic right-to-left reading flow from day one. There is no LTR / English variant — Arabic is the product, not a translation.

---

## Sources

- **Brand mark** — `uploads/ChatGPT Image May 12, 2026, 01_34_38 PM.png` (color + icon-only + monochrome variants of the ProTrack logo).
- **Reference repo** — `github.com/ALSABAEEI/moha-civil-project` was provided but **was inaccessible at design time** (404 on `main`/`master` — likely empty or private). Tokens and components below are derived from the brand prompt and uploaded mark, not from real source code. Re-attach the repo to re-anchor everything.

---

## Index — files in this design system

| Path | What's there |
|---|---|
| `colors_and_type.css` | All tokens — colors, Cairo + Mono type, scale, spacing, radii, shadows, motion. Sets `html { direction: rtl }`. |
| `assets/` | Logo lockup, icon, monochrome variants, sharp SVG mark. |
| `preview/` | Small reference cards for the Design System tab (one concept per card). |
| `ui_kits/protrack-app/` | Full Arabic-first React UI kit — sign-in, onboarding, dashboard, projects, project detail, tasks, vendors, assignments, finance, reports, notifications, users. |
| `SKILL.md` | Agent skill manifest — read first when invoking the design system as a skill. |

---

## Content fundamentals

Tone: **سعودي محترف، واضح، مباشر، وموجز.** Saudi-professional Arabic — short, calm, operational. No marketing language inside the app.

- **Voice** — institutional second-person where needed (`اختر دورك`, `راجع تفضيلاتك`), but most labels are nouns (`المشاريع`, `الموردون`, `المهام`). Avoid imperatives unless guiding a step.
- **Case** — N/A in Arabic. Latin codes (`CIV-2026-014`, `INV-08842`) stay uppercase, isolated in `dir:ltr` runs.
- **Numerals** — Western digits (1, 2, 3) by default for tabular money/codes because they align cleanly in tables. Eastern Arabic digits (٠–٩) used in narrative copy where the brief calls for it (notifications, onboarding stats, scale captions). The helper `toArabicDigits()` is available in `Components.jsx` when you want to switch a specific number.
- **Currency** — `184,500 ر.س` (Western numerals + Arabic SAR symbol after the amount). Implemented by `SAR()` in `Components.jsx`. The whole money run is `.money` (LTR-isolated + tabular numerals) so it doesn't reorder inside RTL flow.
- **Dates** — `18 مايو 2026` is the canonical format. Time uses the `.num` LTR-isolated class.
- **No emoji.** Period.
- **Sample copy** —
  - Empty state: *"لا توجد فواتير متأخرة. الوضع المالي تحت السيطرة."*
  - Risk banner: *"تجاوز ميزانية القسم ب بنسبة ١٢٪."*
  - Activity item: *"اعتمد فيصل الحربي الفاتورة INV-08842 — نجد الكهربائية."*

---

## Visual foundations

**Brand colors** — Deep Navy `#0F2A4A` (locked) + Teal `#17A2A2` (locked). Navy carries chrome and primary actions. Teal carries focus, links, active states, and progress fills. Soft tints (`--navy-050`, `--teal-050`) are used freely for backgrounds and selected rows.

**Neutrals** — a 10-step ink ramp from `#FFFFFF` to `#0B1320`. App canvas is `#F7F9FC`. Surfaces are pure white. Borders are `#E6EAF0` / `#DDE3EA`.

**Semantic** — green / amber / red / blue, each with a 700/500/100/050 ramp so we can compose chips, banners, and progress states without ever inventing colors.

**Type** — **Cairo** for everything UI (400/500/600/700/800/900). **JetBrains Mono** is reserved for numerals (money, IDs, dates, table data) inside `.num` / `.money` spans — those spans flip to `direction: ltr` and `font-variant-numeric: tabular-nums` so figures align in tables. Cairo's Latin glyphs handle mixed Arabic/Latin runs without an extra Latin face.

**Type rules for Arabic** —
- Line-height is **looser** than a Latin scale (1.30 tight → 1.85 relaxed) — Arabic descenders need air.
- **No negative letter-spacing.** Arabic shaping breaks under tight tracking.
- Base body is **15 px**, dense table body **13 px**. Don't go below 12 px for Arabic text — strokes fall apart.

**Layout** — 8-px grid. Sidebar is **on the right** (RTL). Top bar at 60 px. Cards: 12-px radius, white surface, 1-px `--border-1`, `--shadow-sm`. Tables: 14-px row padding, 22-px horizontal padding.

**Directional flow** — every list, table, and grid reads right-to-left. Avatar stacks lean toward the right edge (`margin-right: -8px` overlap). Progress bars anchor to the right (`direction: rtl` on the track). Sidebar collapse chevron, "next" arrow, "back" arrow are all flipped via the `.icon-mirror` class — applied automatically by the `<Icon>` component for the names in the `DIRECTIONAL_ICONS` set.

**Borders, shadows, radii** — single shadow system (`--shadow-xs` → `--shadow-xl`). Cards get `--shadow-sm`. Hover lifts to `--shadow-md`. Focus ring is `--shadow-focus` (3 px teal at 30 % alpha). Radii: chips `4`, inputs `6`, buttons/badges `8`, cards `12`, modals `16`, pill `999`.

**Backgrounds** — no decorative gradients in the app. The sign-in marketing panel uses a single dark-navy radial gradient and a soft teal glow — the only gradient surface in the system.

**Hover / press** — buttons darken (`--navy-800` → `--navy-900`); ghost buttons get a `--ink-050` background. Rows get `--ink-100` on hover. Press shrinks by `transform: scale(0.98)` on primary buttons. Transitions are `var(--dur-2) var(--ease-out)` (180 ms, soft).

**Imagery** — there is no decorative photography in the product. The sign-in marketing panel is colored chrome only.

---

## Iconography

- **Library** — [Lucide](https://lucide.dev), loaded from CDN. Stroke `1.75`, color `currentColor`, sizes `14 / 16 / 18 / 22`.
- **No emoji. No unicode pictographs. No hand-drawn SVGs.** If an icon doesn't exist in Lucide, document the gap rather than invent.
- **RTL mirroring** — direction-dependent icons (arrows, chevrons, back/next, send, reply, trending, log-in/out, undo/redo) flip horizontally via `.icon-mirror` (the `<Icon>` component applies this automatically for a known set of names). Non-directional icons (`bell`, `building-2`, `wallet`, `shield-check`, `hard-hat`) stay as-is.
- **Logo** — `assets/logo-full.svg` (full color lockup), `assets/logo-icon.svg` (square mark), `assets/logo-mono.svg` (monochrome). The wordmark "ProTrack" stays Latin even in Arabic contexts — it is a brand name, not a translatable word.

---

## Open caveats

- The provided GitHub repo (`ALSABAEEI/moha-civil-project`) was inaccessible. If real source becomes available, we should re-anchor data shapes and component names to it.
- Cairo + JetBrains Mono are loaded from Google Fonts. Drop licensed `.woff2` files into `fonts/` if you have them and we'll wire them in.
- The system uses Western digits in tabular contexts and Arabic digits in narrative copy — confirm if you want one or the other globally.
