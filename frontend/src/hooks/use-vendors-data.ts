"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCompanyStore } from "@/stores/company-store";
import type { Vendor } from "@/types/database";

export interface VendorWithStats extends Vendor {
    invoiceCount: number;
    totalSpend: number;
}

export interface VendorsData {
    vendors: VendorWithStats[];
    isLoading: boolean;
    error: string | null;
}

export function useVendorsData(): VendorsData {
    const companyId = useCompanyStore((s) => s.companyId);
    const [vendors, setVendors] = useState<VendorWithStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!companyId) {
            setVendors([]);
            setIsLoading(false);
            return;
        }

        async function fetchVendors() {
            setIsLoading(true);
            setError(null);

            const supabase = createClient();

            // Fetch vendors and invoices in parallel
            const [vendorsResult, invoicesResult] = await Promise.all([
                supabase
                    .from("vendors")
                    .select("*")
                    .eq("company_id", companyId)
                    .order("name"),
                supabase
                    .from("invoices")
                    .select("vendor_id, total_gross")
                    .eq("company_id", companyId),
            ]);

            if (vendorsResult.error) {
                setError(vendorsResult.error.message);
                setVendors([]);
                setIsLoading(false);
                return;
            }

            if (invoicesResult.error) {
                setError(invoicesResult.error.message);
                setVendors([]);
                setIsLoading(false);
                return;
            }

            // Aggregate invoice stats per vendor
            const statsMap = new Map<
                string,
                { count: number; total: number }
            >();

            for (const inv of invoicesResult.data ?? []) {
                const existing = statsMap.get(inv.vendor_id) ?? {
                    count: 0,
                    total: 0,
                };
                existing.count += 1;
                existing.total += Number(inv.total_gross);
                statsMap.set(inv.vendor_id, existing);
            }

            const vendorsWithStats: VendorWithStats[] = (
                vendorsResult.data ?? []
            ).map((vendor) => {
                const stats = statsMap.get(vendor.id) ?? {
                    count: 0,
                    total: 0,
                };
                return {
                    ...vendor,
                    invoiceCount: stats.count,
                    totalSpend: stats.total,
                };
            });

            setVendors(vendorsWithStats);
            setIsLoading(false);
        }

        fetchVendors();
    }, [companyId]);

    return { vendors, isLoading, error };
}
