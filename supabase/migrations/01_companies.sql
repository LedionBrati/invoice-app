-- Companies table: tenant root for multi-tenant isolation
CREATE TABLE public.companies (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_user_id UUID NOT NULL,              -- references auth.users(id)
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast lookup when RLS resolves the user's company
CREATE INDEX idx_companies_owner ON public.companies (owner_user_id);
