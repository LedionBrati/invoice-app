"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCompanyStore } from "@/stores/company-store";
import type { InvoiceWithRelations } from "@/types/database";

export interface ReportsData {
    invoices: InvoiceWithRelations[];
    isLoading: boolean;
    error: string | null;
}

export function useReportsData(): ReportsData {
    const companyId = useCompanyStore((s) => s.companyId);
    const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyId) {
            setInvoices([]);
            setIsLoading(false);
            return;
        }

        async function fetchInvoices() {
            setIsLoading(true);
            setError(null);

            const supabase = createClient();
            const { data, error: err } = await supabase
                .from("invoices")
                .select(
                    `
                    *,
                    vendors ( name ),
                    expense_categories ( name )
                `
                )
                .eq("company_id", companyId)
                .order("issue_date", { ascending: false });

            if (err) {
                setError(err.message);
                setInvoices([]);
            } else {
                setInvoices((data as InvoiceWithRelations[]) ?? []);
            }
            setIsLoading(false);
        }

        fetchInvoices();
    }, [companyId]);

    return { invoices, isLoading, error };
}
