
"use client";

import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/types";

interface RequirePermissionProps {
    children: React.ReactNode;
    permission: Permission;
}

/**
 * A client component that only renders its children if the current user has the required permission.
 */
export function RequirePermission({ children, permission }: RequirePermissionProps) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
}
