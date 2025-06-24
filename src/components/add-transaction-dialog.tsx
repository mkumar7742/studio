"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddTransactionForm } from "./add-transaction-form";
import { useState } from "react";

export function AddTransactionDialog() {
    const [open, setOpen] = useState(false);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 size-4" /> Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Transaction</DialogTitle>
                    <DialogDescription>
                        Enter the details of your transaction below.
                    </DialogDescription>
                </DialogHeader>
                <AddTransactionForm onFinished={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
