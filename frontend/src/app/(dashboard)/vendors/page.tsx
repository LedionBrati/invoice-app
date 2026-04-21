"use client";

import { useVendorsData } from "@/hooks/use-vendors-data";
import { VendorsCardGrid } from "@/components/vendors/vendors-card-grid";

export default function VendorsPage() {
    const { vendors, isLoading, error } = useVendorsData();

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Vendors
                </h1>
                <p className="text-sm text-muted-foreground">
                    All vendors associated with your company
                </p>
            </div>

            {/* Error banner */}
            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Failed to load vendors: {error}
                </div>
            )}

            {/* Vendor cards */}
            <VendorsCardGrid vendors={vendors} isLoading={isLoading} />
        </div>
    );
}
