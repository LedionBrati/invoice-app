"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Upload,
    Users,
    Tags,
    FileBarChart,
} from "lucide-react";
import { useCompanyStore } from "@/stores/company-store";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Invoices",
        href: "/invoices",
        icon: FileText,
    },
    {
        label: "Upload",
        href: "/upload",
        icon: Upload,
    },
    {
        label: "Vendors",
        href: "/vendors",
        icon: Users,
    },
    {
        label: "Categories",
        href: "/categories",
        icon: Tags,
    },
    {
        label: "Reports",
        href: "/reports",
        icon: FileBarChart,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const companyName = useCompanyStore((s) => s.companyName);
    const isLoading = useCompanyStore((s) => s.isLoading);

    return (
        <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-sidebar">
            {/* Brand / Company */}
            <div className="flex h-16 items-center gap-3 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-semibold text-sidebar-foreground">
                        Invoice App
                    </span>
                    {isLoading ? (
                        <Skeleton className="mt-0.5 h-3 w-24" />
                    ) : (
                        <span className="truncate text-xs text-muted-foreground">
                            {companyName ?? "No company"}
                        </span>
                    )}
                </div>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                            pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-border px-6 py-3">
                <p className="text-xs text-muted-foreground">
                    © 2026 Invoice App
                </p>
            </div>
        </aside>
    );
}
