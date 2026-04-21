"use client";

import type { ExpenseCategory } from "@/types/database";
import type { DashboardFilters } from "@/hooks/use-dashboard-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface DashboardFiltersProps {
    filters: DashboardFilters;
    categories: ExpenseCategory[];
    onFilterChange: (filters: Partial<DashboardFilters>) => void;
}

export function DashboardFilters({
    filters,
    categories,
    onFilterChange,
}: DashboardFiltersProps) {
    const hasActiveFilters =
        filters.dateFrom || filters.dateTo || filters.categoryId;

    return (
        <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1.5">
                <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                    From
                </Label>
                <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                        onFilterChange({ dateFrom: e.target.value })
                    }
                    className="w-40"
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                    To
                </Label>
                <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                        onFilterChange({ dateTo: e.target.value })
                    }
                    className="w-40"
                />
            </div>
            <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                    Category
                </Label>
                <Select
                    value={filters.categoryId || "all"}
                    onValueChange={(value) =>
                        onFilterChange({
                            categoryId: value === "all" ? "" : value,
                        })
                    }
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                        onFilterChange({
                            dateFrom: "",
                            dateTo: "",
                            categoryId: "",
                        })
                    }
                    className="text-muted-foreground"
                >
                    <X className="mr-1 h-3 w-3" />
                    Clear
                </Button>
            )}
        </div>
    );
}
