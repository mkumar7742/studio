
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, PenSquare, Store, CalendarDays, CircleDollarSign, Shapes, BookText, User, FilePlus2, Repeat } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

export default function NewExpensePage() {
    const { categories } = useAppContext();
    const [isRecurring, setIsRecurring] = useState(false);

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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                            
                            <Label htmlFor="subject" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <PenSquare className="size-4" />
                                </div>
                                <span>Subject*</span>
                            </Label>
                            <Input id="subject" className="bg-card border-border" />
                            
                            <Label htmlFor="merchant" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white">
                                    <Store className="size-4" />
                                </div>
                                <span>Merchant*</span>
                            </Label>
                            <Input id="merchant" className="bg-card border-border" />

                            <Label htmlFor="date" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white">
                                    <CalendarDays className="size-4" />
                                </div>
                                <span>Date*</span>
                            </Label>
                            <Input id="date" type="date" className="bg-card border-border" />

                            <Label htmlFor="total" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-green-500 text-white">
                                    <CircleDollarSign className="size-4" />
                                </div>
                                <span>Total*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-4">
                                <Input id="total" type="number" placeholder="0.00" className="col-span-2 bg-card border-border" />
                                <div className="col-span-1">
                                    <Select defaultValue="EUR">
                                        <SelectTrigger className="bg-card border-border">
                                            <SelectValue placeholder="Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUPPORTED_CURRENCIES.map(c => (
                                                <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            
                            <div />
                            <div className="flex items-center space-x-2">
                                <Checkbox id="reimbursable" defaultChecked />
                                <Label htmlFor="reimbursable" className="font-normal">Reimbursable</Label>
                            </div>
                            
                            <Label htmlFor="category" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white">
                                    <Shapes className="size-4" />
                                </div>
                                <span>Category*</span>
                            </Label>
                            <Select>
                                <SelectTrigger className="bg-card border-border">
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

                            <Label htmlFor="description" className="flex items-center gap-4 self-start pt-2">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-500 text-white">
                                    <BookText className="size-4" />
                                </div>
                                <span>Description</span>
                            </Label>
                            <Textarea id="description" className="bg-card border-border" />
                            
                            <Label htmlFor="member" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-500 text-white">
                                    <User className="size-4" />
                                </div>
                                <span>Member*</span>
                            </Label>
                            <Input id="member" className="bg-card border-border" />
                            
                            <Label className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-pink-500 text-white">
                                    <FilePlus2 className="size-4" />
                                </div>
                                <span>Add to Expense Report</span>
                            </Label>
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

                             <Label htmlFor="recurring" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white">
                                    <Repeat className="size-4" />
                                </div>
                                <span>Recurring</span>
                            </Label>
                            <div className="flex items-center gap-4">
                                <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
                                {isRecurring && (
                                    <Select>
                                        <SelectTrigger className="bg-card border-border w-[180px]">
                                            <SelectValue placeholder="Frequency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <label className="flex flex-col items-center justify-center w-full h-64 lg:h-full border-2 border-dashed border-border rounded-lg bg-card p-6 text-center cursor-pointer hover:bg-muted/50">
                                <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4">
                                    <Plus className="size-10"/>
                                </div>
                                <span className="text-base font-semibold">Upload a receipt or invoice</span>
                                <span className="text-sm text-muted-foreground mt-1">or drag and drop</span>
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
