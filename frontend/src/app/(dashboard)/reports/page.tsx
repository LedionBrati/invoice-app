"use client";

import { useReportsData } from "@/hooks/use-reports-data";
import { MonthlySpendChart } from "@/components/reports/monthly-spend-chart";
import { CategoryBreakdownTable } from "@/components/reports/category-breakdown-table";
import { CsvExportButton } from "@/components/reports/csv-export-button";

export default function ReportsPage() {
    const { invoices, isLoading, error } = useReportsData();

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reports
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Spending insights and data export
                    </p>
                </div>
                <CsvExportButton
                    invoices={invoices}
                    disabled={isLoading}
                />
            </div>

            {/* Error banner */}
            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Failed to load report data: {error}
                </div>
            )}

            {/* Monthly bar chart */}
            <MonthlySpendChart invoices={invoices} isLoading={isLoading} />

            {/* Category breakdown */}
            <CategoryBreakdownTable
                invoices={invoices}
                isLoading={isLoading}
            />
        </div>
    );
}
