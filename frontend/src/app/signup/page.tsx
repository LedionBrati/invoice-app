"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        // Sign up with company_name in metadata.
        // The handle_new_user() Postgres trigger automatically
        // creates the companies row server-side.
        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { company_name: companyName.trim() },
            },
        });

        if (authError) {
            toast.error("Signup failed", { description: authError.message });
            setIsLoading(false);
            return;
        }

        toast.success("Account created!", {
            description: "Welcome to Invoice App.",
        });
        router.push("/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
            <div className="w-full max-w-md space-y-8">
                {/* Logo / Brand */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
                        <FileText className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Invoice App
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account to get started
                    </p>
                </div>

                {/* Signup Card */}
                <Card className="border-0 shadow-xl shadow-zinc-200/50 dark:shadow-black/30">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl">
                            Create account
                        </CardTitle>
                        <CardDescription>
                            Set up your company and start processing invoices
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="company-name">
                                    Company name
                                </Label>
                                <Input
                                    id="company-name"
                                    type="text"
                                    placeholder="Acme Inc."
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(e.target.value)
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    minLength={6}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 6 characters
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account…
                                    </>
                                ) : (
                                    "Create account"
                                )}
                            </Button>
                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
