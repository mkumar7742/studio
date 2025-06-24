
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditCategoryForm } from "./edit-category-form";
import type { Category } from "@/types";

interface EditCategoryDialogProps {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditCategoryDialog({ category, open, onOpenChange }: EditCategoryDialogProps) {
    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit "{category.name}"</DialogTitle>
                </DialogHeader>
                <EditCategoryForm category={category} onFinished={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}
