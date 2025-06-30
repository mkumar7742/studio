
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { FilePlus2, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function ExpenseReceiptScanner() {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const dataUri = await fileToDataUri(file);
        setPreview(dataUri);
        
        toast({
            title: "Receipt Uploaded",
            description: "Receipt scanning is not enabled. Please enter details manually.",
        });
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card className="h-64 lg:h-full bg-card flex flex-col">
            <CardContent className="p-4 flex-grow flex flex-col items-center justify-center">
                {preview ? (
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
                        <span className="text-sm text-muted-foreground mt-1">Ready for your backend!</span>
                        <Input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                    </label>
                )}
            </CardContent>
        </Card>
    );
}
