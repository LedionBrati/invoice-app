-- Invoices table: one vendor has many invoices
CREATE TABLE public.invoices (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id         UUID NOT NULL REFERENCES public.companies (id)          ON DELETE CASCADE,
  vendor_id          UUID NOT NULL REFERENCES public.vendors   (id)          ON DELETE RESTRICT,
  category_id        UUID          REFERENCES public.expense_categories (id)  ON DELETE SET NULL,

  invoice_number     TEXT NOT NULL,
  issue_date         DATE NOT NULL,
  net_amount         NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount         NUMERIC(12,2) NOT NULL DEFAULT 0,     -- VAT / sales tax
  total_gross        NUMERIC(12,2) NOT NULL DEFAULT 0,

  pdf_url            TEXT,                                  -- Supabase Storage public URL
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending','processing','completed','error')),
  raw_extracted_data JSONB,                                 -- full AI extraction payload

  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (company_id, invoice_number)                      -- no duplicate invoice numbers per company
);

CREATE INDEX idx_invoices_company  ON public.invoices (company_id);
CREATE INDEX idx_invoices_vendor   ON public.invoices (vendor_id);
CREATE INDEX idx_invoices_category ON public.invoices (category_id);
CREATE INDEX idx_invoices_date     ON public.invoices (issue_date DESC);
