// TypeScript types mirroring the Supabase database schema

export interface Company {
    id: string;
    owner_user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Vendor {
    id: string;
    company_id: string;
    name: string;
    tax_id: string | null;
    email: string | null;
    address: string | null;
    created_at: string;
    updated_at: string;
}

export interface ExpenseCategory {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export type InvoiceStatus = "pending" | "processing" | "completed" | "error";

export interface Invoice {
    id: string;
    company_id: string;
    vendor_id: string;
    category_id: string | null;
    invoice_number: string;
    issue_date: string; // DATE stored as ISO string
    net_amount: number;
    tax_amount: number;
    total_gross: number;
    pdf_url: string | null;
    status: InvoiceStatus;
    raw_extracted_data: Record<string, unknown> | null;
    created_at: string;
    updated_at: string;
}

// Joined invoice row as returned by dashboard queries
export interface InvoiceWithRelations extends Invoice {
    vendors: Pick<Vendor, "name">;
    expense_categories: Pick<ExpenseCategory, "name"> | null;
}
