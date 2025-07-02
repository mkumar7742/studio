
"use client";

import { useAppContext } from "@/context/app-provider";
import type { Permission } from "@/types";

export function usePermissions() {
    const { currentUserPermissions } = useAppContext();

    const hasPermission = (permission: Permission) => {
        return currentUserPermissions.includes(permission);
    };

    const hasAllPermissions = (permissions: Permission[]) => {
        return permissions.every(p => currentUserPermissions.includes(p));
    }
    
    const hasAnyPermission = (permissions: Permission[]) => {
        return permissions.some(p => currentUserPermissions.includes(p));
    }

    return { hasPermission, hasAllPermissions, hasAnyPermission, permissions: currentUserPermissions };
}
