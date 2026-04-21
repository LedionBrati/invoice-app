"use client";

import type { VendorWithStats } from "@/hooks/use-vendors-data";
import { formatCurrency } from "@/lib/format";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, DollarSign } from "lucide-react";

interface VendorsCardGridProps {
    vendors: VendorWithStats[];
    isLoading: boolean;
}

export function VendorsCardGrid({ vendors, isLoading }: VendorsCardGridProps) {
    /* Loading skeleton */
    if (isLoading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-36 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    /* Empty state */
    if (vendors.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                    No vendors found
                </p>
                <p className="text-xs text-muted-foreground/70">
                    Vendors will appear here once invoices are processed
                </p>
            </div>
        );
    }

    /* Card grid */
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
                <Card
                    key={vendor.id}
                    className="transition-shadow hover:shadow-md"
                >
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold truncate">
                            {vendor.name}
                        </CardTitle>
                        {vendor.email && (
                            <CardDescription className="truncate">
                                {vendor.email}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span>
                                    <span className="font-medium text-foreground">
                                        {vendor.invoiceCount}
                                    </span>{" "}
                                    {vendor.invoiceCount === 1
                                        ? "invoice"
                                        : "invoices"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium text-foreground">
                                    {formatCurrency(vendor.totalSpend)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
