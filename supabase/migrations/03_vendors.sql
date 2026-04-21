-- Vendors table: one company has many vendors
CREATE TABLE public.vendors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID NOT NULL REFERENCES public.companies (id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  tax_id      TEXT,                         -- VAT / Tax registration number
  email       TEXT,
  address     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (company_id, name)                 -- prevent duplicate vendor names per company
);

CREATE INDEX idx_vendors_company ON public.vendors (company_id);
