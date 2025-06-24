
"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';

interface SortableCategoryItemProps {
  id: string;
  item: Category;
  count: number;
}

export function SortableCategoryItem({ id, item, count }: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  const Icon = item.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm", isDragging && "shadow-lg")}
    >
        <Button variant="ghost" size="icon" className="cursor-grab touch-none" {...attributes} {...listeners}>
            <GripVertical className="size-5 text-muted-foreground" />
        </Button>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: item.color }}>
            <Icon className="size-4 text-primary-foreground" />
        </div>
      <span className="flex-grow font-medium truncate">{item.name}</span>
      <span className="text-sm font-semibold text-muted-foreground">{count}</span>
    </div>
  );
}
