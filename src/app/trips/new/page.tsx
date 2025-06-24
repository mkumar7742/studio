
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { X, PenSquare, Tag, BookText, Plane, CalendarDays, CircleDollarSign, BedDouble, PlaneTakeoff, PlaneLanding, CalendarPlus, CalendarMinus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewTripPage() {
    return (
        <div className="flex flex-col h-screen bg-background text-foreground p-6 md:p-8">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">New Trip</h1>
                <Link href="/trips">
                    <Button variant="ghost" size="icon">
                        <X className="size-6" />
                    </Button>
                </Link>
            </header>
             <Separator className="bg-border mb-8" />
            
            <form className="flex-1 overflow-y-auto space-y-8 pr-2">
                <div className="space-y-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                    {/* General Info */}
                    <Label htmlFor="name" className="flex items-center gap-4">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-500 text-white">
                            <PenSquare className="size-4" />
                        </div>
                        <span>Name*</span>
                    </Label>
                    <Input id="name" className="bg-card border-border" />

                    <Label className="flex items-center gap-4">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white">
                            <Tag className="size-4" />
                        </div>
                        <span>Type*</span>
                    </Label>
                    <RadioGroup defaultValue="international" className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="domestic" id="domestic" />
                            <Label htmlFor="domestic" className="font-normal text-muted-foreground">Domestic</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="international" id="international" className="text-cyan-400 border-cyan-400" />
                            <Label htmlFor="international" className="font-normal text-cyan-400">International</Label>
                        </div>
                    </RadioGroup>

                    <Label htmlFor="purpose" className="flex items-center gap-4 self-start pt-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-500 text-white">
                            <BookText className="size-4" />
                        </div>
                        <span>Purpose*</span>
                    </Label>
                    <Textarea id="purpose" className="bg-card border-border min-h-[80px]" />
                </div>
                
                {/* Itinerary */}
                <div className="space-y-6">
                    <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">ITINERARY</h2>
                    
                    <div className="space-y-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                        <Label className="font-semibold text-foreground flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white">
                                <Plane className="size-4" />
                            </div>
                            <span>FLIGHT</span>
                        </Label>
                        <RadioGroup defaultValue="roundtrip" className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="one-way" id="one-way" />
                                <Label htmlFor="one-way" className="font-normal text-muted-foreground">One-way</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="roundtrip" id="roundtrip" className="text-cyan-400 border-cyan-400" />
                                <Label htmlFor="roundtrip" className="font-normal text-cyan-400">Roundtrip</Label>
                            </div>
                        </RadioGroup>
                        
                        <Label htmlFor="depart-from" className="flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white">
                                <PlaneTakeoff className="size-4" />
                            </div>
                            <span>Depart from*</span>
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input id="depart-from" placeholder="City or Airport" className="bg-card border-border" />
                            <Input id="depart-date" type="date" className="bg-card border-border" />
                        </div>

                        <Label htmlFor="destination" className="flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-500 text-white">
                                <PlaneLanding className="size-4" />
                            </div>
                            <span>Destination*</span>
                        </Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input id="destination" placeholder="City or Airport" className="bg-card border-border" />
                            <Input id="return-date" type="date" className="bg-card border-border" />
                        </div>

                        <Label htmlFor="budget-limit" className="flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-green-500 text-white">
                                <CircleDollarSign className="size-4" />
                            </div>
                            <span>Budget limit*</span>
                        </Label>
                        <Input id="budget-limit" type="number" className="bg-card border-border" />
                    </div>
                </div>

                {/* Accommodation */}
                <div className="space-y-6">
                    <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">ACCOMMODATION</h2>
                    <div className="space-y-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                        <Label htmlFor="check-in" className="flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-500 text-white">
                                <CalendarPlus className="size-4" />
                            </div>
                            <span>Check-in*</span>
                        </Label>
                        <Input id="check-in" type="date" className="bg-card border-border" />

                        <Label htmlFor="check-out" className="flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-pink-500 text-white">
                                <CalendarMinus className="size-4" />
                            </div>
                            <span>Check-out*</span>
                        </Label>
                        <Input id="check-out" type="date" className="bg-card border-border" />
                        
                        <Label htmlFor="hotel" className="flex items-center gap-4">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white">
                                <BedDouble className="size-4" />
                            </div>
                            <span>Hotel*</span>
                        </Label>
                        <Input id="hotel" className="bg-card border-border" />
                    </div>
                </div>
            </form>

            <footer className="flex justify-end items-center mt-6 pt-6 gap-4">
                <Button type="button" className="bg-cyan-400 hover:bg-cyan-500 text-black border-none font-bold px-6">Save draft</Button>
                <Button type="submit" className="bg-card hover:bg-muted text-foreground font-bold px-6">Save</Button>
            </footer>
        </div>
    );
}
