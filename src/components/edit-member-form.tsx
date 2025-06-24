
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/app-provider";
import type { MemberProfile } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  roleId: z.string({ required_error: "Please select a role." }),
  phone: z.string().optional(),
  address: z.string().optional(),
  socials: z.array(
    z.object({
        platform: z.string().min(1, { message: "Platform is required." }),
        url: z.string().url({ message: "Please enter a valid URL." }),
    })
  ).optional(),
});

type EditMemberValues = z.infer<typeof formSchema>;

interface EditMemberFormProps {
    member: MemberProfile;
    onFinished?: () => void;
}

export function EditMemberForm({ member, onFinished }: EditMemberFormProps) {
    const { editMember, roles, currentUser } = useAppContext();
    const isCurrentUser = member.id === currentUser.id;

    const form = useForm<EditMemberValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: member.name || "",
            roleId: member.roleId,
            phone: member.phone || "",
            address: member.address || "",
            socials: member.socials || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "socials",
    });

    function onSubmit(values: EditMemberValues) {
        editMember(member.id, values);
        if (onFinished) {
            onFinished();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Label>Email</Label>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                                <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isCurrentUser}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={role.id}>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isCurrentUser && <p className="text-xs text-muted-foreground">You cannot change your own role.</p>}
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

                <Button type="submit" className="w-full">Save Changes</Button>
            </form>
        </Form>
    );
}
