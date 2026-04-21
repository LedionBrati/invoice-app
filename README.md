# Invoice Intelligence Dashboard

A mini SaaS tool where you upload invoices as PDFs and the AI extracts, analyzes, and organizes everything into a clean dashboard — with vendor tracking, spending categories, and charts. Built to look and feel like a real product.

## What it does

- Upload invoices as PDFs through a drag-and-drop interface
- AI automatically extracts vendor, amount, date, and category from each invoice
- Dashboard displays spending trends, vendor breakdowns, and category charts
- Multi-company support with authentication
- Export reports as CSV

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI, Recharts |
| Auth & Database | Supabase (Postgres + Row Level Security) |
| Automation | n8n workflow (PDF → AI extraction → Database) |
| State Management | Zustand |

## Architecture

```
PDF Upload (Frontend)
      ↓
n8n Webhook
      ↓
Extract PDF Text → AI Agent (LLM)
      ↓
Structured Output (vendor, amount, date, category)
      ↓
Supabase Postgres
      ↓
Dashboard (Next.js)
```

## Project Structure

```
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # Pages (dashboard, invoices, vendors, reports, upload)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── types/
├── n8n/
│   ├── workflows/     # n8n pipeline JSON (import into your n8n instance)
│   └── prompts/       # AI extraction prompt
└── supabase/
    └── migrations/    # Database schema & RLS policies
```

## Getting Started

### 1. Supabase

- Create a project at [supabase.com](https://supabase.com)
- Run the migrations in `supabase/migrations/` in order

### 2. n8n

- Import `n8n/workflows/invoice_processing.json` into your n8n instance
- Add your Supabase Postgres credentials
- Copy the webhook URL

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_N8N_WEBHOOK_URL=your_n8n_webhook_url
```

```bash
npm run dev
```

---

Built with Next.js, Supabase, and n8n.
