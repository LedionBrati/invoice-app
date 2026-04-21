"use client";

import { useMemo, useState } from "react";
import type { InvoiceWithRelations } from "@/types/database";
import { formatCurrency } from "@/lib/format";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tags } from "lucide-react";

interface CategoryBreakdownTableProps {
    invoices: InvoiceWithRelations[];
    isLoading: boolean;
}

interface CategoryRow {
    name: string;
    invoiceCount: number;
    totalSpend: number;
    share: number;
}

export function CategoryBreakdownTable({
    invoices,
    isLoading,
}: CategoryBreakdownTableProps) {
    const currentYear = new Date().getFullYear();

    // Determine available years from invoice data
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        for (const inv of invoices) {
            years.add(new Date(inv.issue_date).getFullYear());
        }
        // Always include the current year
        years.add(currentYear);
        return Array.from(years).sort((a, b) => b - a);
    }, [invoices, currentYear]);

    const [selectedYear, setSelectedYear] = useState(String(currentYear));

    const rows = useMemo(() => {
        const year = Number(selectedYear);
        const filtered = invoices.filter(
            (inv) => new Date(inv.issue_date).getFullYear() === year
        );

        const catMap = new Map<
            string,
            { count: number; total: number }
        >();
        let grandTotal = 0;

        for (const inv of filtered) {
            const catName =
                inv.expense_categories?.name ?? "Uncategorised";
            const existing = catMap.get(catName) ?? {
                count: 0,
                total: 0,
            };
            existing.count += 1;
            existing.total += Number(inv.total_gross);
            catMap.set(catName, existing);
            grandTotal += Number(inv.total_gross);
        }

        const result: CategoryRow[] = Array.from(catMap.entries())
            .map(([name, stats]) => ({
                name,
                invoiceCount: stats.count,
                totalSpend: Math.round(stats.total * 100) / 100,
                share: grandTotal > 0 ? stats.total / grandTotal : 0,
            }))
            .sort((a, b) => b.totalSpend - a.totalSpend);

        return result;
    }, [invoices, selectedYear]);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Category Breakdown
                        </CardTitle>
                        <CardDescription>
                            Spend by expense category
                        </CardDescription>
                    </div>
                    <Select
                        value={selectedYear}
                        onValueChange={setSelectedYear}
                    >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableYears.map((y) => (
                                <SelectItem key={y} value={String(y)}>
                                    {y}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : rows.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Tags className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            No data for {selectedYear}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">
                                        Invoices
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total Spend
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Share
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell className="font-medium">
                                            {row.name}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {row.invoiceCount}
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            {formatCurrency(row.totalSpend)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(row.share * 100).toFixed(1)}%
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
