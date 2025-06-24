
"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useAppContext } from "@/context/app-provider";
import type { Permission } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

interface PermissionsChecklistProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
}

export function PermissionsChecklist({ form }: PermissionsChecklistProps) {
  const { allPermissions } = useAppContext();
  const allPermissionIds = allPermissions.flatMap(g => g.permissions.map(p => p.id));

  return (
    <FormField
      control={form.control}
      name="permissions"
      render={({ field }) => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">Permissions</FormLabel>
          </div>
            <div className="flex items-center space-x-2 pb-4">
                <Checkbox
                    checked={field.value?.length === allPermissionIds.length}
                    onCheckedChange={(checked) => {
                        field.onChange(checked ? allPermissionIds : []);
                    }}
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Select All
                </label>
            </div>
            
            <Accordion type="multiple" className="w-full" defaultValue={allPermissions.map(p => p.group)}>
            {allPermissions.map((group) => (
                <AccordionItem value={group.group} key={group.group}>
                    <AccordionTrigger className="font-semibold">{group.group}</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4 pl-2">
                        {group.permissions.map((item: { id: Permission, label: string }) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value: Permission) => value !== item.id
                                            )
                                            );
                                    }}
                                />
                                <FormLabel className="font-normal">
                                    {item.label}
                                </FormLabel>
                            </div>
                         ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </FormItem>
      )}
    />
  );
}
