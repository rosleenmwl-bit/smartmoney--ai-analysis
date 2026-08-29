# SmartMoney AI — Architecture

## Stack
- **Frontend:** Next.js 15 (App Router, TypeScript, Tailwind, shadcn/ui)
- **Charts:** Recharts (pie + bar)
- **Backend:** Supabase (Postgres, RLS, Storage for receipt images)
- **AI:** OpenAI via server route for receipt extraction + recommendations
- **Deploy:** Vercel

## Build Order (Now / Next / Later)
- **Now:** DB schema + budget/expense CRUD + dashboard with charts + manual expense entry + receipt upload with AI extraction + recommendation card
- **Next:** Weekly breakdown table + 8-week plan view + trend across 2 months
- **Later:** User auth + per-user RLS + historical trends + bank statement batch upload

## Key User Action Flow (Log an Expense)
1. User opens dashboard, clicks "Add Expense"
2. Chooses manual entry or receipt upload
3. If receipt: image uploaded to Supabase Storage → server route calls AI → returns amount/merchant/category → user reviews/edits → saves
4. Expense row written to Postgres
5. Dashboard re-fetches: pie chart, balance, top-3 table all update

## Responsive Nav Shell
Left sidebar on desktop (Dashboard, Expenses, Budget, Recommendations) collapsing to hamburger on mobile. Current section highlighted.

## Layer Plan
1. **Data layer** (`lib/data/`) — all Supabase reads/writes in one place
2. **App logic** (`lib/actions/`) — server actions for create/update expense, budget, confirm receipt
3. **AI module** (`lib/ai/`) — receipt extraction + recommendation generation, isolated from UI
4. **UI components** — feature-oriented folders under `app/` and `components/`

## Why Core Runs Without AI
Budget CRUD, expense entry, dashboard charts, and balance calc are pure Postgres queries. AI is only called for receipt extraction and recommendations — if AI is off, user enters data manually and no recommendation card renders. The app is fully functional.

## Repo Structure
```
app/
  dashboard/        # main spend vs budget view + charts
  expenses/         # list + add/edit/delete
  budget/           # set monthly category allocations
  recommendations/  # AI savings suggestions
api/
  extract-receipt/  # POST: image -> AI -> structured data
lib/
  data/             # queries.ts, mutations.ts
  actions/          # expense-actions.ts, budget-actions.ts
  ai/                # receipt-extract.ts, recommend.ts
components/
  charts/           # pie, bar, summary-table
  forms/            # expense-form, receipt-upload, budget-form
supabase/
  migrations/       # schema SQL
```

## Module Map
| Module | Responsibility | Data Owned | Build Order |
|--------|---------------|------------|-------------|
| budget | Set/get monthly category allocations | budgets | 1st |
| expense | CRUD expense entries | expenses, receipts | 2nd |
| dashboard | Aggregate + display spent vs budget | reads budgets + expenses | 3rd |
| receipt | Upload + AI extract + review | receipts | 4th |
| recommendation | Generate savings suggestions | recommendations | 5th |