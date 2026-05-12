# ProTrack — App UI Kit

The primary surface: the **ProTrack web application**. Multi-tenant, role-aware, single-page.

Open `index.html` for an interactive click-through. The left sidebar switches between five screens:

1. **Dashboard** — role-aware overview (KPIs, my projects, recent activity)
2. **Projects** — list + filters
3. **Project detail** — header, terms, tabs (overview / tasks / vendors / finance)
4. **Tasks** — kanban board
5. **Financial tracking** — KPIs + payments table

You can also switch the active **role** in the top bar to see what an Admin / PM / Engineer / Vendor sees. (Access is mocked client-side; same UI surface, filtered data + hidden modules.)

## Files

```
index.html         entry — loads React, design tokens, and components
data.jsx           mock data (projects, tasks, vendors, payments, people)
Components.jsx     shared atoms — Button, Chip, Avatar, Progress, Card, etc.
Sidebar.jsx        left nav
TopBar.jsx         search + role switcher + notifications + me
Dashboard.jsx      KPIs + my projects + recent activity
Projects.jsx       projects list view (table + filters)
ProjectDetail.jsx  one project's overview / terms / vendors
TaskBoard.jsx      kanban with 4 columns
Finance.jsx        budget KPIs + payments table
```

## Coverage

Built from the brief — no production code was available, so this is a **best-effort** recreation of what ProTrack should look like given the brand brief, role model, and module list. When the real codebase is available, swap in real component structure.

Visual tokens (color, type, radii, shadows) come straight from `../../colors_and_type.css`. Icons from Lucide via CDN.
