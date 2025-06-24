
"use client";

import { PageHeader } from "@/components/page-header";
import { AddCategoryDialog } from "@/components/add-category-dialog";
import { SortableCategoryList } from "@/components/sortable-category-list";
import { useAppContext } from "@/context/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
    const { categories, setCategories } = useAppContext();

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
                        <SortableCategoryList items={categories} setItems={setCategories} />
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
