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
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { PieChartIcon } from "lucide-react";

// Curated color palette for pie slices
const COLORS = [
    "hsl(221, 83%, 53%)",  // blue
    "hsl(142, 71%, 45%)",  // green
    "hsl(38, 92%, 50%)",   // amber
    "hsl(0, 84%, 60%)",    // red
    "hsl(262, 83%, 58%)",  // violet
    "hsl(187, 85%, 43%)",  // cyan
    "hsl(24, 95%, 53%)",   // orange
    "hsl(330, 81%, 60%)",  // pink
    "hsl(47, 96%, 53%)",   // yellow
    "hsl(173, 80%, 40%)",  // teal
];

interface ExpensePieChartProps {
    invoices: InvoiceWithRelations[];
    isLoading: boolean;
}

interface CategorySlice {
    name: string;
    value: number;
}

function CustomTooltip({
    active,
    payload,
}: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: CategorySlice }>;
}) {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    return (
        <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
            <p className="text-sm font-medium">{data.name}</p>
            <p className="text-sm text-muted-foreground">
                {formatCurrency(data.value)}
            </p>
        </div>
    );
}

export function ExpensePieChart({
    invoices,
    isLoading,
}: ExpensePieChartProps) {
    // Group by category
    const categoryMap = new Map<string, number>();
    for (const inv of invoices) {
        const catName = inv.expense_categories?.name ?? "Uncategorised";
        categoryMap.set(
            catName,
            (categoryMap.get(catName) ?? 0) + Number(inv.total_gross)
        );
    }

    const chartData: CategorySlice[] = Array.from(categoryMap.entries())
        .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
        .sort((a, b) => b.value - a.value);

    const isEmpty = chartData.length === 0;

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Expenses by Category
                </CardTitle>
                <CardDescription>
                    Distribution of total gross amounts
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {isLoading ? (
                    <div className="flex h-[280px] items-center justify-center">
                        <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                ) : isEmpty ? (
                    <div className="flex h-[280px] flex-col items-center justify-center text-center">
                        <PieChartIcon className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            No expense data yet
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Upload invoices to see your spending breakdown
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: "12px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
