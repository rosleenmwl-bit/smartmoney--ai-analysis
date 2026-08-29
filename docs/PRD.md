# SmartMoney AI — Product Requirements

## Problem
A retiree with a fixed MYR 6,000/month budget needs to track actual spending across 10 categories, see remaining balance at a glance, and get practical savings recommendations — without tedious manual data entry.

## Target User
Retiree managing personal finances in MYR. Wants transparency, low effort (snap a receipt), and clear visual feedback on weekly/monthly spend vs budget.

## Core Objects
- **Category** — one of 10 expense types (home loan, unifi, mobile, 2nd-home utilities, restaurant, online shopping, medical, grocery, car, ad-hoc)
- **Budget** — monthly allocation per category + total (default MYR 6,000)
- **Expense** — single spend: amount, category, date, capture method (manual/receipt), optional note
- **Receipt** — uploaded image + AI-extracted amount/merchant/category (with source/confidence/review_status)
- **Recommendation** — AI-generated savings suggestion (with source/confidence/review_status)

## MVP (v1) — Checklist
- [ ] Set monthly budget per category (default total 6,000 MYR)
- [ ] Log expense manually (amount, category, date, note)
- [ ] Upload receipt snapshot; AI extracts amount/category (editable before save)
- [ ] Dashboard: this month's spent vs budget, balance remaining (positive/negative)
- [ ] Weekly table: top-3 non-fixed expenses per week
- [ ] Pie chart: spend by category (week + month toggle)
- [ ] Actual vs Budget comparison table (residual or deficit shown)
- [ ] Simple recommendation card: top reducible category + 3 actionable tips
- [ ] Works without login (seeded demo data visible to anonymous visitors)

## Non-goals (v1)
- Multi-user / family sharing
- Bank/credit-card API integration
- Currency conversion
- Historical trend beyond current + previous month
- Email or push notifications

## Success Criteria
A visitor opens the app, sees this month's seeded expenses and budget dashboard with pie chart, balance remaining, and a recommendation card — then adds a new manual expense and watches the balance update in real time.