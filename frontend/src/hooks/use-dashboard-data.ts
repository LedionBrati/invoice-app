"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCompanyStore } from "@/stores/company-store";
import type { InvoiceWithRelations, ExpenseCategory } from "@/types/database";

export interface DashboardFilters {
    dateFrom: string;
    dateTo: string;
    categoryId: string; // "" means "all"
}

export interface DashboardData {
    invoices: InvoiceWithRelations[];
    categories: ExpenseCategory[];
    isLoading: boolean;
    error: string | null;
    filters: DashboardFilters;
    setFilters: (filters: Partial<DashboardFilters>) => void;
}

export function useDashboardData(): DashboardData {
    const companyId = useCompanyStore((s) => s.companyId);
    const [invoices, setInvoices] = useState<InvoiceWithRelations[]>([]);
    const [categories, setCategories] = useState<ExpenseCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFiltersState] = useState<DashboardFilters>({
        dateFrom: "",
        dateTo: "",
        categoryId: "",
    });

    const setFilters = useCallback(
        (partial: Partial<DashboardFilters>) => {
            setFiltersState((prev) => ({ ...prev, ...partial }));
        },
        []
    );

    // Fetch categories once
    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("expense_categories")
            .select("*")
            .order("name")
            .then(({ data, error: err }) => {
                if (err) {
                    console.error("Failed to fetch categories:", err);
                    return;
                }
                setCategories(data ?? []);
            });
    }, []);

    // Fetch invoices when companyId or filters change
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
            let query = supabase
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

            if (filters.dateFrom) {
                query = query.gte("issue_date", filters.dateFrom);
            }
            if (filters.dateTo) {
                query = query.lte("issue_date", filters.dateTo);
            }
            if (filters.categoryId) {
                query = query.eq("category_id", filters.categoryId);
            }

            const { data, error: err } = await query;

            if (err) {
                setError(err.message);
                setInvoices([]);
            } else {
                setInvoices((data as InvoiceWithRelations[]) ?? []);
            }
            setIsLoading(false);
        }

        fetchInvoices();
    }, [companyId, filters]);

    return { invoices, categories, isLoading, error, filters, setFilters };
}
