"use client";

import { useCategoriesData } from "@/hooks/use-categories-data";
import { CategoriesCardGrid } from "@/components/categories/categories-card-grid";

export default function CategoriesPage() {
    const { categories, isLoading, error } = useCategoriesData();

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    Categories
                </h1>
                <p className="text-sm text-muted-foreground">
                    Expense categories and their spending breakdown
                </p>
            </div>

            {/* Error banner */}
            {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    Failed to load categories: {error}
                </div>
            )}

            {/* Category cards */}
            <CategoriesCardGrid
                categories={categories}
                isLoading={isLoading}
            />
        </div>
    );
}
