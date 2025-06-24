
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/app-provider";
import type { Permission, Role } from "@/types";
import { PermissionsChecklist } from "./permissions-checklist";

const formSchema = z.object({
  name: z.string().min(2, { message: "Role name must be at least 2 characters." }),
  permissions: z.array(z.string()).min(1, { message: "Please select at least one permission." }),
});

type RoleFormValues = z.infer<typeof formSchema>;

interface RoleFormProps {
    role?: Role | null;
    onFinished?: () => void;
}

export function RoleForm({ role, onFinished }: RoleFormProps) {
    const { addRole, editRole } = useAppContext();
    const isEditing = !!role;

    const form = useForm<RoleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: role?.name || "",
            permissions: (role?.permissions as Permission[] | undefined) || [],
        },
    });

    function onSubmit(values: RoleFormValues) {
        if (isEditing && role) {
            editRole(role.id, values as { name: string; permissions: Permission[]});
        } else {
            addRole(values as { name: string; permissions: Permission[]});
        }
        
        if (onFinished) {
            onFinished();
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Content Editor" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <PermissionsChecklist form={form} />

                <Button type="submit" className="w-full">
                    {isEditing ? "Save Changes" : "Create Role"}
                </Button>
            </form>
        </Form>
    );
}
