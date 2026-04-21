"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useCompanyStore } from "@/stores/company-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Upload,
    FileText,
    Loader2,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

type UploadState = "idle" | "uploading" | "success" | "error";

export function PdfUploader() {
    const companyId = useCompanyStore((s) => s.companyId);
    const [uploadState, setUploadState] = useState<UploadState>("idle");
    const [fileName, setFileName] = useState<string | null>(null);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            if (!companyId) {
                toast.error("Upload failed", {
                    description:
                        "Company not loaded yet. Please try again in a moment.",
                });
                return;
            }

            const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
            if (!webhookUrl) {
                toast.error("Configuration error", {
                    description: "Webhook URL is not configured.",
                });
                return;
            }

            setFileName(file.name);
            setUploadState("uploading");

            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("company_id", companyId);

                const response = await fetch(webhookUrl, {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || `HTTP ${response.status}`);
                }

                setUploadState("success");
                toast.success("Invoice uploaded!", {
                    description: `${file.name} has been sent for processing.`,
                });
            } catch (err) {
                setUploadState("error");
                toast.error("Upload failed", {
                    description:
                        err instanceof Error
                            ? err.message
                            : "An unexpected error occurred.",
                });
            }
        },
        [companyId]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        disabled: uploadState === "uploading",
    });

    function reset() {
        setUploadState("idle");
        setFileName(null);
    }

    return (
        <Card className="mx-auto max-w-xl">
            <CardHeader>
                <CardTitle>Upload Invoice</CardTitle>
                <CardDescription>
                    Drop a PDF invoice and we&apos;ll extract the data
                    automatically
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Drop zone */}
                <div
                    {...getRootProps()}
                    className={cn(
                        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors",
                        isDragActive
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 hover:bg-muted/50",
                        uploadState === "uploading" &&
                        "pointer-events-none opacity-60"
                    )}
                >
                    <input {...getInputProps()} />

                    {uploadState === "uploading" ? (
                        <>
                            <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm font-medium">
                                Uploading {fileName}…
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Sending to processing pipeline
                            </p>
                        </>
                    ) : uploadState === "success" ? (
                        <>
                            <CheckCircle2 className="mb-3 h-10 w-10 text-green-500" />
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                                {fileName} uploaded successfully!
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                The invoice is being processed
                            </p>
                        </>
                    ) : (
                        <>
                            {isDragActive ? (
                                <Upload className="mb-3 h-10 w-10 text-primary" />
                            ) : (
                                <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
                            )}
                            <p className="text-sm font-medium">
                                {isDragActive
                                    ? "Drop your PDF here"
                                    : "Drag & drop a PDF invoice"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                or click to browse · PDF files only
                            </p>
                        </>
                    )}
                </div>

                {/* Actions after upload */}
                {uploadState === "success" && (
                    <div className="flex items-center justify-between gap-3">
                        <Button variant="outline" onClick={reset}>
                            Upload another
                        </Button>
                        <Button asChild>
                            <Link href="/dashboard">
                                View Dashboard
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                )}

                {uploadState === "error" && (
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={reset}>
                            Try again
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
