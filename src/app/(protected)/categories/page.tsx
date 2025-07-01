
"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { AddCategoryDialog } from "@/components/add-category-dialog";
import { SortableCategoryList } from "@/components/sortable-category-list";
import { useAppContext } from "@/context/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category } from "@/types";
import { EditCategoryDialog } from "@/components/edit-category-dialog";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";


export default function CategoriesPage() {
    const { categories, setCategories, transactions, deleteCategory } = useAppContext();
    const { toast } = useToast();
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);


    const categoryCounts = useMemo(() => {
        return transactions.reduce((acc, t) => {
            acc.set(t.category, (acc.get(t.category) || 0) + 1);
            return acc;
        }, new Map<string, number>());
    }, [transactions]);

    const handleEdit = (category: Category) => {
        setCategoryToEdit(category);
    };

    const handleDelete = (category: Category) => {
        setCategoryToDelete(category);
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            deleteCategory(categoryToDelete.id);
            setCategoryToDelete(null);
            toast({
                title: "Category Deleted",
                description: `The "${categoryToDelete.name}" category has been deleted.`,
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader
                title="Categories"
                description="Organize your transaction categories."
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Your Categories ({categories.length})</CardTitle>
                                <CardDescription>Drag and drop to reorder.</CardDescription>
                            </div>
                            <AddCategoryDialog />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <SortableCategoryList 
                            items={categories} 
                            setItems={setCategories} 
                            categoryCounts={categoryCounts}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </CardContent>
                </Card>
            </main>
            <EditCategoryDialog
                category={categoryToEdit}
                open={!!categoryToEdit}
                onOpenChange={(isOpen) => !isOpen && setCategoryToEdit(null)}
            />
            <DeleteConfirmationDialog
                open={!!categoryToDelete}
                onOpenChange={(isOpen) => !isOpen && setCategoryToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Category"
                description={`Are you sure you want to delete the "${categoryToDelete?.name}" category? This action cannot be undone.`}
            />
        </div>
    );
}
