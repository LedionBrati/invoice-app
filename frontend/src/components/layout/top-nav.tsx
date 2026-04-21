"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/layout/user-menu";
import { Separator } from "@/components/ui/separator";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/invoices": "Invoices",
    "/upload": "Upload Invoice",
    "/vendors": "Vendors",
    "/categories": "Categories",
    "/reports": "Reports",
};

function getPageTitle(pathname: string): string {
    // Exact match first
    if (pageTitles[pathname]) return pageTitles[pathname];
    // Check prefix match for nested routes (e.g. /invoices/123)
    for (const [path, title] of Object.entries(pageTitles)) {
        if (pathname.startsWith(path)) return title;
    }
    return "Invoice App";
}

export function TopNav() {
    const pathname = usePathname();
    const title = getPageTitle(pathname);

    return (
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-lg font-semibold tracking-tight">
                    {title}
                </h1>
                <div className="flex items-center gap-2">
                    <UserMenu />
                </div>
            </div>
            <Separator />
        </header>
    );
}
