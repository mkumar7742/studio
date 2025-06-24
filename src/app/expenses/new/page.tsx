'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, PenSquare, Store, CalendarDays, CircleDollarSign, Shapes, BookText, User, FilePlus2 } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';

export default function NewExpensePage() {
    const { categories } = useAppContext();

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <header className="flex items-center justify-between p-6 border-b border-border">
                <h1 className="text-2xl font-bold tracking-tight">New expense</h1>
                <Link href="/expenses">
                    <Button variant="ghost" size="icon">
                        <X className="size-5" />
                    </Button>
                </Link>
            </header>
            <form className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                            
                            <Label htmlFor="subject" className="flex items-center gap-2 md:justify-self-end">
                                <PenSquare className="size-4 text-muted-foreground" />
                                <span>Subject*</span>
                            </Label>
                            <Input id="subject" className="bg-muted border-border" />
                            
                            <Label htmlFor="merchant" className="flex items-center gap-2 md:justify-self-end">
                                <Store className="size-4 text-muted-foreground" />
                                <span>Merchant*</span>
                            </Label>
                            <Input id="merchant" className="bg-muted border-border" />

                            <Label htmlFor="date" className="flex items-center gap-2 md:justify-self-end">
                                <CalendarDays className="size-4 text-muted-foreground" />
                                <span>Date*</span>
                            </Label>
                            <Input id="date" type="date" className="bg-muted border-border" />

                            <Label htmlFor="total" className="flex items-center gap-2 md:justify-self-end">
                                <CircleDollarSign className="size-4 text-muted-foreground" />
                                <span>Total*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-4">
                                <Input id="total" type="number" placeholder="0.00" className="col-span-2 bg-muted border-border" />
                                <div className="col-span-1">
                                    <Select>
                                        <SelectTrigger className="bg-muted border-border">
                                            <SelectValue placeholder="Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="eur">EUR</SelectItem>
                                            <SelectItem value="usd">USD</SelectItem>
                                            <SelectItem value="gbp">GBP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div />
                            <div className="flex items-center space-x-2">
                                <Checkbox id="reimbursable" defaultChecked />
                                <Label htmlFor="reimbursable" className="font-normal">Reimbursable</Label>
                            </div>
                            
                            <Label htmlFor="category" className="flex items-center gap-2 md:justify-self-end">
                                <Shapes className="size-4 text-muted-foreground" />
                                <span>Category*</span>
                            </Label>
                            <Select>
                                <SelectTrigger className="bg-muted border-border">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c.name !== 'Income').map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Label htmlFor="description" className="flex items-center gap-2 md:justify-self-end self-start md:pt-2">
                                <BookText className="size-4 text-muted-foreground" />
                                <span>Description</span>
                            </Label>
                            <Textarea id="description" className="bg-muted border-border" />
                            
                            <Label htmlFor="member" className="flex items-center gap-2 md:justify-self-end">
                                <User className="size-4 text-muted-foreground" />
                                <span>Member*</span>
                            </Label>
                            <Input id="member" className="bg-muted border-border" />
                            
                            <div className="flex items-center gap-2 md:justify-self-end">
                                <FilePlus2 className="size-4 text-muted-foreground" />
                                <Label>Add to report</Label>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="report-yes" checked />
                                    <Label htmlFor="report-yes" className="font-normal">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="report-no" />
                                    <Label htmlFor="report-no" className="font-normal">No</Label>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <label className="flex flex-col items-center justify-center w-full h-64 lg:h-full border-2 border-dashed border-border rounded-lg bg-card p-6 text-center cursor-pointer hover:bg-muted/50">
                                <Plus className="size-10 text-muted-foreground mb-2"/>
                                <span className="text-base font-semibold">Upload an invoice</span>
                                <Input type="file" className="hidden" />
                            </label>
                        </div>
                    </div>
                </main>
                <footer className="flex justify-end items-center py-4 px-6 border-t border-border gap-4">
                    <Button type="button" variant="default">Save draft</Button>
                    <Button type="submit" variant="secondary" className="bg-muted hover:bg-border/50 text-muted-foreground">Save</Button>
                </footer>
            </form>
        </div>
    );
}
