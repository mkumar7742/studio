
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
import { Briefcase, Car, Film, GraduationCap, HeartPulse, Home, Landmark, PawPrint, Pizza, Plane, Receipt, ShoppingCart, Sprout, UtensilsCrossed, Gift, Shirt, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Shapes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Category } from "@/types";

const availableIcons: { name: string; icon: LucideIcon }[] = [
    { name: "Briefcase", icon: Briefcase },
    { name: "Landmark", icon: Landmark },
    { name: "UtensilsCrossed", icon: UtensilsCrossed },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "HeartPulse", icon: HeartPulse },
    { name: "Car", icon: Car },
    { name: "GraduationCap", icon: GraduationCap },
    { name: "Film", icon: Film },
    { name: "Gift", icon: Gift },
    { name: "Plane", icon: Plane },
    { name: "Home", icon: Home },
    { name: "PawPrint", icon: PawPrint },
    { name: "Receipt", icon: Receipt },
    { name: "Pizza", icon: Pizza },
    { name: "Shirt", icon: Shirt },
    { name: "Sprout", icon: Sprout },
    { name: "Dumbbell", icon: Dumbbell },
    { name: "Wrench", icon: Wrench },
    { name: "Sofa", icon: Sofa },
    { name: "Popcorn", icon: Popcorn },
    { name: "Store", icon: Store },
    { name: "Baby", icon: Baby },
    { name: "Train", icon: Train },
    { name: "Wifi", icon: Wifi },
    { name: "PenSquare", icon: PenSquare },
    { name: "ClipboardCheck", icon: ClipboardCheck },
];

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
  icon: z.string({ required_error: "Please select an icon." }),
});

type EditCategoryValues = z.infer<typeof formSchema>;

const getIconName = (IconComponent: LucideIcon) => {
    for (const { name, icon } of availableIcons) {
        if (icon === IconComponent) {
            return name;
        }
    }
    return 'Shapes'; // fallback
};


interface EditCategoryFormProps {
  category: Category;
  onFinished?: () => void;
}

export function EditCategoryForm({ category, onFinished }: EditCategoryFormProps) {
  const { editCategory } = useAppContext();

  const form = useForm<EditCategoryValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: category.name,
        color: category.color,
        icon: getIconName(category.icon),
    },
  });

  function onSubmit(values: EditCategoryValues) {
    editCategory(category.id, values);
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
            <FormItem className="grid grid-cols-4 items-center gap-x-4">
              <FormLabel className="text-right">Name</FormLabel>
              <div className="col-span-3">
                <FormControl>
                  <Input placeholder="e.g., Groceries" {...field} />
                </FormControl>
                <FormMessage className="mt-2" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-start gap-x-4 pt-2">
              <FormLabel className="text-right mt-2">Color</FormLabel>
              <div className="col-span-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-8 gap-2"
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
                <FormMessage className="mt-2" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-start gap-x-4 pt-2">
              <FormLabel className="text-right mt-2">Icon</FormLabel>
              <div className="col-span-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-8 gap-2"
                  >
                    {availableIcons.map(({ name, icon: Icon }) => (
                      <FormItem key={name} className="flex items-center justify-center">
                        <FormControl>
                          <RadioGroupItem value={name} className="sr-only" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-transparent bg-accent/50",
                            "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            field.value === name && "ring-2 ring-ring ring-offset-2 bg-accent"
                          )}
                        >
                          <Icon className="size-5 text-accent-foreground" />
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="mt-2" />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Save Changes</Button>
      </form>
    </Form>
  );
}
