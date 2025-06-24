
"use client";

import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCategoryItem } from './sortable-category-item';
import type { Category } from '@/types';

interface SortableCategoryListProps {
  items: Category[];
  setItems: (items: Category[]) => void;
  categoryCounts: Map<string, number>;
}

export function SortableCategoryList({ items, setItems, categoryCounts }: SortableCategoryListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((currentItems) => {
        const oldIndex = currentItems.findIndex((item) => item.id === active.id);
        const newIndex = currentItems.findIndex((item) => item.id === over.id);
        return arrayMove(currentItems, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableCategoryItem key={item.id} id={item.id} item={item} count={categoryCounts.get(item.name) || 0} />
          ))}
           {items.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-4xl font-bold">0</p>
              <p className="mt-2 text-sm">No categories yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
}
