
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/app-provider";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    phone: z.string().optional(),
    address: z.string().optional(),
    bio: z.string().optional(),
    socials: z.array(
        z.object({
            platform: z.string().min(1, { message: "Platform is required." }),
            url: z.string().url({ message: "Please enter a valid URL." }),
        })
    ).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
    const { currentUser, getMemberRole, updateCurrentUser } = useAppContext();
    const { toast } = useToast();
    const role = getMemberRole(currentUser);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: currentUser.name || "",
            phone: currentUser.phone || "",
            address: currentUser.address || "",
            bio: "TrackWise user since 2024. Passionate about personal finance and budgeting.",
            socials: currentUser.socials || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "socials",
    });
    
    function onSubmit(data: ProfileFormValues) {
        updateCurrentUser(data);
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="User Profile" description="Manage your profile and account settings." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <CardHeader>
                                <CardTitle>Profile Details</CardTitle>
                                <CardDescription>Update your personal information here.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} data-ai-hint={currentUser.avatarHint} />
                                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline" type="button">Change Photo</Button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input id="email" type="email" defaultValue={currentUser.email} disabled />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <Input type="tel" placeholder="e.g. 123-456-7890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <div className="space-y-2">
                                        <Label>Role</Label>
                                        <div>
                                        {role && (
                                            <Badge variant={role?.name === 'Administrator' ? 'default' : 'secondary'} className={role?.name === 'Administrator' ? 'bg-primary/80' : ''}>
                                                {role.name}
                                            </Badge>
                                        )}
                                        </div>
                                    </div>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="bio"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bio</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Tell us a little about yourself" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Social Media</Label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => append({ platform: "", url: "" })}
                                        >
                                            <Plus className="mr-2 size-4" /> Add Link
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <div key={field.id} className="flex items-end gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`socials.${index}.platform`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel className="text-sm font-normal text-muted-foreground">Platform</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="e.g., Twitter" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`socials.${index}.url`}
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormLabel className="text-sm font-normal text-muted-foreground">URL</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="https://twitter.com/username" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-destructive hover:text-destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            </CardContent>
                        </form>
                    </Form>
                </Card>
            </main>
        </div>
    )
}
