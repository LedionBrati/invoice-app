"use client";

import { useCallback } from "react";
import type { InvoiceWithRelations } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CsvExportButtonProps {
    invoices: InvoiceWithRelations[];
    disabled?: boolean;
}

function escapeCsv(value: string): string {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

export function CsvExportButton({
    invoices,
    disabled,
}: CsvExportButtonProps) {
    const handleExport = useCallback(() => {
        const headers = [
            "Invoice #",
            "Vendor",
            "Date",
            "Net Amount",
            "Tax",
            "Total Gross",
            "Category",
            "Status",
        ];

        const rows = invoices.map((inv) => [
            inv.invoice_number,
            inv.vendors?.name ?? "",
            inv.issue_date,
            String(inv.net_amount),
            String(inv.tax_amount),
            String(inv.total_gross),
            inv.expense_categories?.name ?? "",
            inv.status,
        ]);

        const csv = [
            headers.map(escapeCsv).join(","),
            ...rows.map((row) => row.map(escapeCsv).join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoices-export-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [invoices]);

    return (
        <Button
            variant="outline"
            onClick={handleExport}
            disabled={disabled || invoices.length === 0}
        >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
        </Button>
    );
}
