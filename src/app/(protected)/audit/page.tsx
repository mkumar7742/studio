
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-provider';
import type { AuditLog } from '@/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuditLogPage() {
    const { isAuthenticated } = useAppContext();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchLogs = async () => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('/api/audit', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch audit logs');
                    }
                    const data = await response.json();
                    setLogs(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLogs();
        }
    }, [isAuthenticated]);

    const getActionBadgeVariant = (action: string) => {
        if (action.includes('CREATE')) return 'default';
        if (action.includes('UPDATE')) return 'secondary';
        if (action.includes('DELETE')) return 'destructive';
        return 'outline';
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Audit Log" description="A log of all significant actions taken in the system." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>System Events</CardTitle>
                        <CardDescription>Review recent activity for security and compliance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    Array.from({ length: 10 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                                            <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : logs.length > 0 ? (
                                    logs.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>{format(new Date(log.timestamp), 'PPpp')}</TableCell>
                                            <TableCell>{log.memberName}</TableCell>
                                            <TableCell>
                                                <Badge variant={getActionBadgeVariant(log.action)}>{log.action.replace('_', ' ')}</Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">
                                                {JSON.stringify(log.details)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No audit logs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
