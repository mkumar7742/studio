
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FormRow = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-x-4 gap-y-2", className)}>
        {children}
    </div>
);

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
                {/* General Info */}
                <div className="space-y-6">
                    <FormRow>
                        <Label htmlFor="name">Name*</Label>
                        <Input id="name" className="bg-card border-border" />
                    </FormRow>
                    <FormRow>
                        <Label>Type*</Label>
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
                    </FormRow>
                     <FormRow>
                        <Label htmlFor="purpose" className="self-start pt-2">Purpose*</Label>
                        <Textarea id="purpose" className="bg-card border-border min-h-[80px]" />
                    </FormRow>
                </div>
                
                {/* Itinerary */}
                <div className="space-y-6">
                    <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">ITNERATY</h2>
                    
                    <div className="space-y-6">
                        <FormRow>
                             <Label className="font-semibold text-foreground">FLIGHT</Label>
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
                        </FormRow>
                        
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-8 gap-y-6">
                            <FormRow>
                                <Label htmlFor="depart-from">Depart from*</Label>
                                <Input id="depart-from" className="bg-card border-border" />
                            </FormRow>
                            <div className="flex items-center gap-4">
                                <Label htmlFor="depart-date">Date</Label>
                                <Input id="depart-date" type="date" className="bg-card border-border w-full md:w-48" />
                            </div>
                        </div>
                        
                       <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-x-8 gap-y-6">
                             <FormRow>
                                <Label htmlFor="destination">Destination*</Label>
                                <Input id="destination" className="bg-card border-border" />
                            </FormRow>
                            <div className="flex items-center gap-4">
                                <Label htmlFor="return-date">Date</Label>
                                <Input id="return-date" type="date" className="bg-card border-border w-full md:w-48" />
                            </div>
                        </div>

                        <FormRow>
                            <Label htmlFor="budget-limit">Budget limit*</Label>
                            <Input id="budget-limit" type="number" className="bg-card border-border" />
                        </FormRow>
                    </div>
                </div>

                {/* Accommodation */}
                <div className="space-y-6">
                     <h3 className="font-semibold text-foreground">ACCOMODATION</h3>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <FormRow>
                                <Label htmlFor="check-in">Check-in*</Label>
                                <Input id="check-in" type="date" className="bg-card border-border" />
                            </FormRow>
                             <FormRow>
                                <Label htmlFor="check-out">Check-out*</Label>
                                <Input id="check-out" type="date" className="bg-card border-border" />
                            </FormRow>
                        </div>
                        <FormRow>
                            <Label htmlFor="hotel">Hotel*</Label>
                            <Input id="hotel" className="bg-card border-border" />
                        </FormRow>
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
