# SmartMoney AI — Security

## Secret Handling
- OpenAI API key stored in Vercel env vars (`OPENAI_API_KEY`), never exposed to client.
- Supabase service-role key in server env only (`SUPABASE_SERVICE_ROLE_KEY`); anon key safe for client.
- Receipt images stored in Supabase Storage (private bucket, signed URLs for read).
- No secrets in frontend code, env, or committed files.

## Permission Model
- **v1 (demo-first):** RLS enabled but permissive — anonymous reads and writes allowed so the app renders without login. Seeded demo data is visible to all visitors.
- **Lock-down sprint (later):** Replace permissive policies with `auth.uid() = user_id` owner-scoped policies. Users see only their own budgets, expenses, receipts, and recommendations.
- AI actions inherit the calling user's permissions — AI never has broader access than the user.

## Approved-Tools Rule
- Only two named AI tools: `extract_receipt` and `generate_recommendation`.
- No generic `run_any` / `send_any` / file-system access / shell execution.
- AI cannot initiate payments, send emails, or modify budgets autonomously.

## Audit Principle
- Every AI-generated result (receipt extraction, recommendation) is logged with action, actor, risk level, and metadata.
- User can review, edit, accept, or dismiss any AI output before it persists as final data.
- No AI output is committed to the database without a human action (confirm/save click).