
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { FilePlus2, Loader2, X, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { extractExpenseFromReceipt } from '@/ai/flows/extract-expense-flow';
import type { ExpenseFormValues } from '@/app/expenses/new/page';
import { useToast } from '@/hooks/use-toast';
import { parseISO } from 'date-fns';

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function ExpenseReceiptScanner() {
    const { setValue, trigger } = useFormContext<ExpenseFormValues>();
    const [preview, setPreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const dataUri = await fileToDataUri(file);
            setPreview(dataUri);

            const result = await extractExpenseFromReceipt({ receiptDataUri: dataUri });
            
            if (result.merchant) {
                setValue('merchant', result.merchant, { shouldValidate: true });
            }
            if (result.amount) {
                setValue('amount', result.amount, { shouldValidate: true });
            }
            if (result.date) {
                // The AI returns YYYY-MM-DD. Date picker needs a Date object.
                // parseISO handles this correctly.
                setValue('date', parseISO(result.date), { shouldValidate: true });
            }
            
            toast({
                title: "Receipt Scanned",
                description: "We've filled in what we could find. Please review the details.",
            });

        } catch (err) {
            console.error("Error scanning receipt:", err);
            setError("Sorry, we couldn't read this receipt. Please enter the details manually.");
            setPreview(null); // Clear preview on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card className="h-64 lg:h-full bg-card flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col items-center justify-center">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center text-center">
                        <Loader2 className="size-10 animate-spin text-primary mb-4" />
                        <span className="text-base font-semibold">Scanning receipt...</span>
                        <span className="text-sm text-muted-foreground mt-1">AI is hard at work!</span>
                    </div>
                ) : preview ? (
                    <div className="relative w-full h-full rounded-md overflow-hidden">
                        <Image src={preview} alt="Receipt preview" fill className="object-contain" />
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full"
                            onClick={handleClear}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 rounded-lg border-2 border-dashed border-border p-6">
                        <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
                            <FilePlus2 className="size-10" />
                        </div>
                        <span className="text-base font-semibold">Upload a receipt</span>
                        <span className="text-sm text-muted-foreground mt-1">and let AI do the work</span>
                        <Input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                    </label>
                )}
                 {error && (
                    <div className="mt-4 flex items-center text-sm text-destructive">
                        <AlertCircle className="size-4 mr-2" />
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

