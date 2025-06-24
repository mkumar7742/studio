
"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SortableCategoryItemProps {
  id: string;
  item: Category;
  count: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableCategoryItem({ id, item, count, onEdit, onDelete }: SortableCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
  };

  const Icon = item.icon;
  const isDeletable = count === 0;

  const deleteButton = (
    <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={onDelete}
        disabled={!isDeletable}
    >
        <Trash2 className="size-4" />
    </Button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex items-center gap-4 rounded-lg border bg-card p-3 shadow-sm", isDragging && "shadow-lg")}
    >
        <Button variant="ghost" size="icon" className="cursor-grab touch-none h-8 w-8" {...attributes} {...listeners}>
            <GripVertical className="size-4 text-muted-foreground" />
        </Button>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: item.color }}>
            <Icon className="size-4 text-primary-foreground" />
        </div>
      <span className="flex-grow font-medium truncate">{item.name}</span>
      <span className="text-sm font-semibold text-muted-foreground">{count}</span>
      <div className="ml-auto flex items-center gap-1">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href={`/categories/${item.id}`}>
            <Eye className="size-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
            <Pencil className="size-4" />
        </Button>
        {isDeletable ? (
            deleteButton
        ) : (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>{deleteButton}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Cannot delete a category that is in use.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )}
      </div>
    </div>
  );
}
