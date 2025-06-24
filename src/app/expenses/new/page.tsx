'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X } from 'lucide-react';
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
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <Label htmlFor="subject">Subject*</Label>
                                <Input id="subject" className="mt-1 bg-muted border-border" />
                            </div>
                            <div>
                                <Label htmlFor="merchant">Merchant*</Label>
                                <Input id="merchant" className="mt-1 bg-muted border-border" />
                            </div>
                            <div>
                                <Label htmlFor="date">Date*</Label>
                                <Input id="date" type="date" className="mt-1 bg-muted border-border" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 items-end">
                                <div className="col-span-2">
                                    <Label htmlFor="total">Total*</Label>
                                    <Input id="total" type="number" placeholder="0.00" className="mt-1 bg-muted border-border" />
                                </div>
                                <div>
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
                            <div className="flex items-center space-x-2 pt-2">
                                <Checkbox id="reimbursable" defaultChecked />
                                <Label htmlFor="reimbursable" className="font-normal">Reimbursable</Label>
                            </div>
                            <div>
                                <Label htmlFor="category">Category*</Label>
                                <Select>
                                    <SelectTrigger className="mt-1 bg-muted border-border">
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
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" className="mt-1 bg-muted border-border" />
                            </div>
                            <div>
                                <Label htmlFor="member">Member*</Label>
                                <Input id="member" className="mt-1 bg-muted border-border" />
                            </div>
                            <div>
                                <Label className="mb-2 block">Add to report</Label>
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
                        </div>

                        <div className="lg:col-span-1">
                            <label className="flex flex-col items-center justify-center w-full h-full min-h-[240px] border-2 border-dashed border-border rounded-lg bg-card p-6 text-center cursor-pointer hover:bg-muted/50">
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
