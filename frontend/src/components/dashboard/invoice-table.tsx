"use client";

import type { InvoiceWithRelations } from "@/types/database";
import { formatCurrency, formatDateShort } from "@/lib/format";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";

interface InvoiceTableProps {
    invoices: InvoiceWithRelations[];
    isLoading: boolean;
}

const statusVariant: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
> = {
    completed: "default",
    pending: "secondary",
    processing: "outline",
    error: "destructive",
};

export function InvoiceTable({ invoices, isLoading }: InvoiceTableProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    Recent Invoices
                </CardTitle>
                <CardDescription>
                    {invoices.length > 0
                        ? `Showing ${invoices.length} invoice${invoices.length === 1 ? "" : "s"}`
                        : "Your processed invoices will appear here"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            No invoices found
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                            Upload your first invoice to see it here
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead className="text-right">
                                        Net
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Tax
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Total
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium">
                                            {invoice.invoice_number}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.vendors?.name ?? "—"}
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            {formatDateShort(
                                                invoice.issue_date
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {invoice.expense_categories
                                                ?.name ?? (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            {formatCurrency(
                                                Number(invoice.net_amount)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            {formatCurrency(
                                                Number(invoice.tax_amount)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap font-medium">
                                            {formatCurrency(
                                                Number(invoice.total_gross)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={
                                                    statusVariant[
                                                    invoice.status
                                                    ] ?? "secondary"
                                                }
                                                className="capitalize"
                                            >
                                                {invoice.status}
                                            </Badge>
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
