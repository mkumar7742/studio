
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "@/context/app-provider";

const categoryColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(221, 83%, 53%)",
  "hsl(35, 92%, 55%)",
  "hsl(150, 70%, 45%)",
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  color: z.string({ required_error: "Please select a color." }),
});

type AddCategoryValues = z.infer<typeof formSchema>;

interface AddCategoryFormProps {
  onFinished?: () => void;
}

export function AddCategoryForm({ onFinished }: AddCategoryFormProps) {
  const { addCategory } = useAppContext();

  const form = useForm<AddCategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", color: categoryColors[0] },
  });

  function onSubmit(values: AddCategoryValues) {
    addCategory(values);
    form.reset({ name: "", color: categoryColors[0] });
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
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-8 gap-2 pt-2"
                >
                  {categoryColors.map((color) => (
                    <FormItem key={color} className="flex items-center justify-center">
                      <FormControl>
                        <RadioGroupItem value={color} className="sr-only" />
                      </FormControl>
                      <FormLabel
                        className={cn(
                          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-transparent",
                          "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          field.value === color && "ring-2 ring-ring ring-offset-2"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Create Category</Button>
      </form>
    </Form>
  );
}
