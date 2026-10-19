# Invoice App

Upload a PDF invoice, an AI agent reads it, and a dashboard shows where the money goes.

## Why I built it

This was my first real project, in April 2026.

I wanted to solve a real problem. The honest part: I hadn't been close to anyone's real problems yet. So I picked one that sounded real. Small companies get invoices as PDFs, someone types the numbers into a spreadsheet by hand, and nobody sees the spending clearly.

I built the whole thing end to end to learn how the pieces of a real product fit together.

## How it works

```
Upload a PDF (Next.js page)
      ↓
n8n webhook
      ↓
Extract the text from the PDF
      ↓
AI agent pulls out: vendor, invoice number, date, net, tax, total, category
      ↓
Check: no vendor or no total? stop and return an error
      ↓
Save to Supabase (create the vendor if it's new, match the category)
      ↓
Dashboard: spending charts, vendors, categories, CSV export
```

The AI step uses a structured output parser, so the model has to return clean JSON in a fixed shape. The prompt (`n8n/prompts/invoice_extraction_prompt.md`) tells it to:

- take the vendor, not the company being billed
- write dates as `YYYY-MM-DD`
- strip currency symbols (`€1.200,50` becomes `1200.50`)
- check that net + tax = total
- pick one of 10 fixed categories, and use `Miscellaneous` when unsure instead of guessing

## Key decisions

- **n8n for the AI pipeline.** I could see every step and test each node on its own, instead of writing a backend from scratch.
- **Supabase with row level security.** Each user gets their own company on signup (a database trigger does it), and the database itself only lets them see their own invoices.
- **No duplicate invoices.** Invoice numbers are unique per company. Uploading the same invoice twice updates it instead of adding it again.
- **Fixed categories.** Free text categories from an LLM drift ("Software", "SaaS", "Software & SaaS"). A fixed list keeps the charts clean.

## What I learned

- **Start from a real user.** I built a full product for a problem I'd never actually seen. It works, but nobody asked for it. Now I try to start from a problem I've actually seen, like hosts in Santorini answering the same guest messages all day ([aurora-ai](https://github.com/LedionBrati/aurora-ai)).
- **The model is the easy part.** Most of the work was everything around it: auth, the database, permissions, handling a bad PDF, showing the data.
- **Don't trust what the AI gives you.** A bad PDF can come back with no vendor or no total. So the workflow checks that before anything touches the database.
- **Security is easy to skip when nobody is using it.** See the known gaps below.

## Run it

You need a Supabase project, an n8n instance, and an LLM API key.

1. **Supabase:** run the files in `supabase/migrations/` in order.
2. **n8n:** import `n8n/workflows/invoice_processing.json`. Connect a chat model to the AI Agent node, paste the prompt from `n8n/prompts/invoice_extraction_prompt.md` as its system message, add your Supabase Postgres credentials, and copy the webhook URL.
3. **Frontend:**

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

```bash
npm run dev
```

Stack: Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui, Recharts, Zustand, Supabase, n8n.

## Status

Finished as a learning project. Not deployed, not used by a real company.

Known gaps I'd fix before anyone used it:

- The n8n webhook has no auth and trusts the `company_id` sent with the upload. Anyone with the URL could add invoices to any company.
- The PDF itself isn't stored, only the extracted data.
