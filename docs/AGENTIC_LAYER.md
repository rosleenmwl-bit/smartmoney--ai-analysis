# SmartMoney AI — Agentic Layer

## Draftable Actions (auto, low risk)
- **Receipt extraction** — AI parses image → fills amount/merchant/category. User reviews before save. Risk: **low** (auto-generate, human confirms).
- **Recommendation generation** — AI reads month's spend data → drafts suggestion text, primary/backup ideas, risks, next actions. Risk: **low** (advisory text only, no state change).
- **Category auto-suggestion** — AI suggests category from receipt text. Risk: **low** (user can override).

## Executable-After-Approval Actions (medium risk)
- **Save extracted expense** — user clicks confirm → expense row created. Risk: **medium** (write to DB, but user initiated).
- **Accept recommendation** — user marks recommendation as accepted. Risk: **medium** (no automatic budget change, just status).

## Human-Only Actions (high/critical risk)
- **Delete expense** — risk: **high** (data loss). Always manual, no AI auto-delete.
- **Modify budget allocation** — risk: **high**. Manual only.
- **Bulk delete receipts** — risk: **critical**. Human-only.

## Named Tools
- `extract_receipt` — input: image storage path → output: structured JSON. Server-side only.
- `generate_recommendation` — input: month, category spend summary → output: recommendation JSON. Server-side only.
- No raw `run_any` / `send_any` tools. AI cannot send messages, make payments, or access external accounts.

## Audit Log Fields
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| action | text | 'receipt.extracted', 'recommendation.generated', etc. |
| actor | text | 'ai' or user id |
| target_type | text | 'expense' / 'receipt' / 'recommendation' |
| target_id | uuid | nullable |
| metadata | jsonb | request + result summary |
| risk_level | text | 'low'/'medium'/'high'/'critical' |
| created_at | timestamptz | default now() |

## v1 vs Later
- **v1:** Receipt extraction + recommendation generation (both low-risk, human-reviewed)
- **Later:** Auto-categorize recurring expenses, auto-flag budget breaches, scheduled recommendation refresh