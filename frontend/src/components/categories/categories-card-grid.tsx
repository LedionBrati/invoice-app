"use client";

import type { CategoryWithStats } from "@/hooks/use-categories-data";
import { formatCurrency } from "@/lib/format";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tags, FileText, DollarSign } from "lucide-react";

interface CategoriesCardGridProps {
    categories: CategoryWithStats[];
    isLoading: boolean;
}

export function CategoriesCardGrid({
    categories,
    isLoading,
}: CategoriesCardGridProps) {
    /* Loading skeleton */
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    /* Empty state */
    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Tags className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                    No categories found
                </p>
                <p className="text-xs text-muted-foreground/70">
                    Categories will appear here once invoices are categorised
                </p>
            </div>
        );
    }

    /* Card grid */
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
                <Card
                    key={cat.id}
                    className="transition-shadow hover:shadow-md"
                >
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold truncate">
                            {cat.name}
                        </CardTitle>
                        {cat.description && (
                            <p className="text-xs text-muted-foreground truncate">
                                {cat.description}
                            </p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>
                                    <span className="font-medium text-foreground">
                                        {cat.invoiceCount}
                                    </span>{" "}
                                    {cat.invoiceCount === 1
                                        ? "invoice"
                                        : "invoices"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium text-foreground">
                                    {formatCurrency(cat.totalSpend)}
                                </span>
                            </div>
                        </div>

                        {/* Spend share progress bar */}
                        <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>Share of total spend</span>
                                <span className="font-medium text-foreground">
                                    {(cat.spendShare * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    className="h-full rounded-full bg-primary transition-all"
                                    style={{
                                        width: `${Math.max(
                                            cat.spendShare * 100,
                                            0
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
