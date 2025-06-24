
"use client";

import { useAppContext } from "@/context/app-provider";
import type { Permission } from "@/types";

export function usePermissions() {
    const { currentUserPermissions } = useAppContext();

    const hasPermission = (permission: Permission) => {
        // Admins can do anything
        if (currentUserPermissions.includes('roles:manage')) return true;
        return currentUserPermissions.includes(permission);
    };

    const hasAllPermissions = (permissions: Permission[]) => {
        if (currentUserPermissions.includes('roles:manage')) return true;
        return permissions.every(p => currentUserPermissions.includes(p));
    }
    
    const hasAnyPermission = (permissions: Permission[]) => {
        if (currentUserPermissions.includes('roles:manage')) return true;
        return permissions.some(p => currentUserPermissions.includes(p));
    }

    return { hasPermission, hasAllPermissions, hasAnyPermission, permissions: currentUserPermissions };
}
