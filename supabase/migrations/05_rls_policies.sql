-- ─── Helper: resolve current user → their company ───
CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT id FROM public.companies
  WHERE owner_user_id = auth.uid()
  LIMIT 1;
$$;

-- ═══════════════════════════════════════════════════════
-- COMPANIES
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own company"
  ON public.companies FOR SELECT
  USING (owner_user_id = auth.uid());

CREATE POLICY "Users update own company"
  ON public.companies FOR UPDATE
  USING (owner_user_id = auth.uid());

-- ═══════════════════════════════════════════════════════
-- EXPENSE CATEGORIES  (global, read-only for all users)
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.expense_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON public.expense_categories FOR SELECT
  USING (true);

-- ═══════════════════════════════════════════════════════
-- VENDORS
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors: select own"
  ON public.vendors FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Vendors: insert own"
  ON public.vendors FOR INSERT
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Vendors: update own"
  ON public.vendors FOR UPDATE
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Vendors: delete own"
  ON public.vendors FOR DELETE
  USING (company_id = public.get_user_company_id());

-- ═══════════════════════════════════════════════════════
-- INVOICES
-- ═══════════════════════════════════════════════════════
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Invoices: select own"
  ON public.invoices FOR SELECT
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Invoices: insert own"
  ON public.invoices FOR INSERT
  WITH CHECK (company_id = public.get_user_company_id());

CREATE POLICY "Invoices: update own"
  ON public.invoices FOR UPDATE
  USING (company_id = public.get_user_company_id());

CREATE POLICY "Invoices: delete own"
  ON public.invoices FOR DELETE
  USING (company_id = public.get_user_company_id());
