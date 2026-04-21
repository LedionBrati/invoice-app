"use client";

import { useDashboardData } from "@/hooks/use-dashboard-data";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { InvoiceTable } from "@/components/dashboard/invoice-table";

export default function DashboardPage() {
    const { invoices, categories, isLoading, error, filters, setFilters } =
        useDashboardData();

    return (
        <div className="space-y-6">
            {/* Filters */}
            <DashboardFilters
                filters={filters}
                categories={categories}
                onFilterChange={setFilters}
            />

            {/* Error banner */}
            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Failed to load data: {error}
                </div>
            )}

            {/* Metric cards */}
            <MetricCards invoices={invoices} isLoading={isLoading} />

            {/* Chart + Table */}
            <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-2">
                    <ExpensePieChart
                        invoices={invoices}
                        isLoading={isLoading}
                    />
                </div>
                <div className="lg:col-span-3">
                    <InvoiceTable invoices={invoices} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
