'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { extractReceiptInfo, type ExtractReceiptInfoOutput } from '@/ai/flows/extract-receipt-info-flow';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ScanReceiptPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            await processFile(file);
        }
    };
    
    const processFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const dataUri = reader.result as string;

            try {
                const result: ExtractReceiptInfoOutput = await extractReceiptInfo({ photoDataUri: dataUri });
                
                const queryParams = new URLSearchParams({
                    description: `Purchase at ${result.merchant}`,
                    merchant: result.merchant,
                    date: result.date,
                    amount: String(result.amount),
                    currency: result.currency || 'USD',
                }).toString();
                
                router.push(`/expenses/new?${queryParams}`);
            } catch (err) {
                console.error("Receipt processing failed:", err);
                setError("Sorry, the AI could not read this receipt. Please try another image or enter the details manually.");
                setIsLoading(false);
            }
        };
        reader.onerror = (error) => {
            console.error("File reading failed:", error);
            setError("Failed to read the file. Please try again.");
            setIsLoading(false);
        };
    }, [router]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
           processFile(file);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Scan Receipt" description="Upload a receipt and let AI do the work." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Upload Receipt Image</CardTitle>
                        <CardDescription>Drag & drop or click to upload an image of your receipt.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg bg-card p-6 text-center cursor-pointer hover:bg-muted/50"
                            onClick={handleUploadClick}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="size-10 animate-spin text-primary" />
                                    <p className="text-muted-foreground">Analyzing receipt...</p>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud className="size-10 text-muted-foreground" />
                                    <span className="mt-2 text-base font-semibold">Click to upload or drag & drop</span>
                                    <span className="text-sm text-muted-foreground mt-1">PNG, JPG, or WEBP</span>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={handleFileChange}
                                        disabled={isLoading}
                                    />
                                </>
                            )}
                        </div>
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <Button variant="outline" onClick={() => router.push('/expenses/new')} className="w-full">
                           Enter Manually Instead
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
