-- Expense categories: extensible lookup table (not an ENUM)
CREATE TABLE public.expense_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed with common small-business categories
INSERT INTO public.expense_categories (name, description) VALUES
  ('Office Supplies',        'Paper, ink, stationery, etc.'),
  ('Software & SaaS',        'Subscriptions and licences'),
  ('Professional Services',  'Legal, accounting, consulting'),
  ('Travel & Transport',     'Flights, hotels, fuel, taxis'),
  ('Marketing & Advertising','Ads, events, sponsorships'),
  ('Utilities',              'Electricity, water, internet'),
  ('Rent & Facilities',      'Office rent and maintenance'),
  ('Equipment & Hardware',   'Computers, printers, furniture'),
  ('Insurance',              'Business & liability insurance'),
  ('Miscellaneous',          'Uncategorised expenses');
