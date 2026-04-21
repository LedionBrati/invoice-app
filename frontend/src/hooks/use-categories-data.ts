"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCompanyStore } from "@/stores/company-store";
import type { ExpenseCategory } from "@/types/database";

export interface CategoryWithStats extends ExpenseCategory {
    invoiceCount: number;
    totalSpend: number;
    /** Share of total spend across all categories, 0‑1 */
    spendShare: number;
}

export interface CategoriesData {
    categories: CategoryWithStats[];
    isLoading: boolean;
    error: string | null;
}

export function useCategoriesData(): CategoriesData {
    const companyId = useCompanyStore((s) => s.companyId);
    const [categories, setCategories] = useState<CategoryWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyId) {
            setCategories([]);
            setIsLoading(false);
            return;
        }

        async function fetchData() {
            setIsLoading(true);
            setError(null);

            const supabase = createClient();

            const [catsResult, invoicesResult] = await Promise.all([
                supabase
                    .from("expense_categories")
                    .select("*")
                    .order("name"),
                supabase
                    .from("invoices")
                    .select("category_id, total_gross")
                    .eq("company_id", companyId),
            ]);

            if (catsResult.error) {
                setError(catsResult.error.message);
                setCategories([]);
                setIsLoading(false);
                return;
            }

            if (invoicesResult.error) {
                setError(invoicesResult.error.message);
                setCategories([]);
                setIsLoading(false);
                return;
            }

            // Aggregate per category
            const statsMap = new Map<
                string,
                { count: number; total: number }
            >();
            let grandTotal = 0;

            for (const inv of invoicesResult.data ?? []) {
                if (!inv.category_id) continue;
                const existing = statsMap.get(inv.category_id) ?? {
                    count: 0,
                    total: 0,
                };
                existing.count += 1;
                existing.total += Number(inv.total_gross);
                statsMap.set(inv.category_id, existing);
                grandTotal += Number(inv.total_gross);
            }

            const result: CategoryWithStats[] = (
                catsResult.data ?? []
            ).map((cat) => {
                const stats = statsMap.get(cat.id) ?? {
                    count: 0,
                    total: 0,
                };
                return {
                    ...cat,
                    invoiceCount: stats.count,
                    totalSpend: stats.total,
                    spendShare:
                        grandTotal > 0 ? stats.total / grandTotal : 0,
                };
            });

            // Sort by total spend descending
            result.sort((a, b) => b.totalSpend - a.totalSpend);

            setCategories(result);
            setIsLoading(false);
        }

        fetchData();
    }, [companyId]);

    return { categories, isLoading, error };
}
