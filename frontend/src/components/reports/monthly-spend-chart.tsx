"use client";

import { useMemo } from "react";
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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

interface MonthlySpendChartProps {
    invoices: InvoiceWithRelations[];
    isLoading: boolean;
}

interface MonthData {
    month: string;
    total: number;
}

function CustomTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm text-muted-foreground">
                {formatCurrency(payload[0].value)}
            </p>
        </div>
    );
}

export function MonthlySpendChart({
    invoices,
    isLoading,
}: MonthlySpendChartProps) {
    const currentYear = new Date().getFullYear();

    const chartData = useMemo(() => {
        // Initialise all 12 months
        const data: MonthData[] = MONTHS.map((month) => ({
            month,
            total: 0,
        }));

        for (const inv of invoices) {
            const date = new Date(inv.issue_date);
            if (date.getFullYear() === currentYear) {
                data[date.getMonth()].total += Number(inv.total_gross);
            }
        }

        // Round values
        return data.map((d) => ({
            ...d,
            total: Math.round(d.total * 100) / 100,
        }));
    }, [invoices, currentYear]);

    const hasData = chartData.some((d) => d.total > 0);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Spending
                </CardTitle>
                <CardDescription>
                    Total gross spend per month in {currentYear}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                ) : !hasData ? (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center">
                        <BarChart3 className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            No spending data for {currentYear}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Upload invoices to see your monthly breakdown
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                className="stroke-border"
                            />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                className="fill-muted-foreground"
                                tickFormatter={(v: number) =>
                                    `€${(v / 1000).toFixed(0)}k`
                                }
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="total"
                                fill="hsl(221, 83%, 53%)"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}
