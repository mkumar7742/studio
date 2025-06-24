
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/app-provider";
import type { MemberProfile } from "@/types";

const formSchema = z.object({
  roleId: z.string({ required_error: "Please select a role." }),
});

type EditMemberValues = z.infer<typeof formSchema>;

interface EditMemberFormProps {
    member: MemberProfile;
    onFinished?: () => void;
}

export function EditMemberForm({ member, onFinished }: EditMemberFormProps) {
    const { editMember, roles } = useAppContext();

    const form = useForm<EditMemberValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roleId: member.roleId,
        },
    });

    function onSubmit(values: EditMemberValues) {
        editMember(member.id, values);
        form.reset();
        if (onFinished) {
            onFinished();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{member.name}</p>
                </div>
                 <div className="space-y-2">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <FormField
                    control={form.control}
                    name="roleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Save Changes</Button>
            </form>
        </Form>
    );
}
