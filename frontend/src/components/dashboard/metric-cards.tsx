"use client";

import type { InvoiceWithRelations } from "@/types/database";
import { formatCurrency } from "@/lib/format";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, FileText, Tag } from "lucide-react";

interface MetricCardsProps {
    invoices: InvoiceWithRelations[];
    isLoading: boolean;
}

export function MetricCards({ invoices, isLoading }: MetricCardsProps) {
    // Calculate metrics
    const totalExpenses = invoices.reduce(
        (sum, inv) => sum + Number(inv.total_gross),
        0
    );
    const invoiceCount = invoices.length;

    // Find top category
    const categoryTotals = new Map<string, number>();
    for (const inv of invoices) {
        const catName = inv.expense_categories?.name ?? "Uncategorised";
        categoryTotals.set(
            catName,
            (categoryTotals.get(catName) ?? 0) + Number(inv.total_gross)
        );
    }
    let topCategory = "—";
    let topAmount = 0;
    for (const [name, amount] of categoryTotals) {
        if (amount > topAmount) {
            topCategory = name;
            topAmount = amount;
        }
    }

    const metrics = [
        {
            title: "Total Expenses",
            value: formatCurrency(totalExpenses),
            description: "Gross amount across all invoices",
            icon: DollarSign,
        },
        {
            title: "Invoice Count",
            value: invoiceCount.toString(),
            description: invoiceCount === 1 ? "1 invoice" : `${invoiceCount} invoices`,
            icon: FileText,
        },
        {
            title: "Top Category",
            value: topCategory,
            description:
                topAmount > 0
                    ? formatCurrency(topAmount)
                    : "No data yet",
            icon: Tag,
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
                <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {metric.title}
                        </CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-8 w-32" />
                        ) : (
                            <>
                                <div className="text-2xl font-bold">
                                    {metric.value}
                                </div>
                                <CardDescription className="mt-1 text-xs">
                                    {metric.description}
                                </CardDescription>
                            </>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
