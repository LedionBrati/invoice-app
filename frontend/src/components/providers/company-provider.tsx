"use client";

import { useEffect } from "react";
import { useCompanyStore } from "@/stores/company-store";
import { createClient } from "@/lib/supabase/client";

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const setCompany = useCompanyStore((s) => s.setCompany);
    const clear = useCompanyStore((s) => s.clear);
    const setLoading = useCompanyStore((s) => s.setLoading);

    useEffect(() => {
        const supabase = createClient();

        async function fetchCompany(userId: string) {
            setLoading(true);
            const { data, error } = await supabase
                .from("companies")
                .select("id, name")
                .eq("owner_user_id", userId)
                .limit(1)
                .single();

            if (error || !data) {
                clear();
                return;
            }

            setCompany(data.id, data.name);
        }

        // Check for an existing session on mount
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                fetchCompany(user.id);
            } else {
                clear();
            }
        });

        // Subscribe to auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (
                event === "SIGNED_IN" ||
                event === "TOKEN_REFRESHED"
            ) {
                if (session?.user) {
                    fetchCompany(session.user.id);
                }
            } else if (event === "SIGNED_OUT") {
                clear();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [setCompany, clear, setLoading]);

    return <>{children}</>;
}
