
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, TrendingUp, Briefcase, CalendarDays, CircleDollarSign, Shapes, User, FilePlus2, Repeat } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

export default function NewIncomePage() {
    const { categories } = useAppContext();
    const [isRecurring, setIsRecurring] = useState(false);

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <header className="flex items-center justify-between p-6 border-b border-border">
                <h1 className="text-2xl font-bold tracking-tight">New income</h1>
                <Link href="/income">
                    <Button variant="ghost" size="icon">
                        <X className="size-5" />
                    </Button>
                </Link>
            </header>
            <form className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                            
                            <Label htmlFor="description" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white">
                                    <TrendingUp className="size-4" />
                                </div>
                                <span>Description*</span>
                            </Label>
                            <Input id="description" className="bg-card border-border" />
                            
                            <Label htmlFor="source" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white">
                                    <Briefcase className="size-4" />
                                </div>
                                <span>Source*</span>
                            </Label>
                            <Input id="source" className="bg-card border-border" />

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
                            
                            <Label htmlFor="category" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white">
                                    <Shapes className="size-4" />
                                </div>
                                <span>Category*</span>
                            </Label>
                            <Select>
                                <SelectTrigger className="bg-card border-border">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.filter(c => c.name === 'Income').map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <Label htmlFor="member" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-500 text-white">
                                    <User className="size-4" />
                                </div>
                                <span>Member*</span>
                            </Label>
                            <Input id="member" className="bg-card border-border" />

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
                                    <FilePlus2 className="size-10"/>
                                </div>
                                <span className="text-base font-semibold">Upload a document</span>
                                <span className="text-sm text-muted-foreground mt-1">e.g., payslip or contract</span>
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
