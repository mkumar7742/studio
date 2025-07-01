
'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/app-provider";
import { format } from 'date-fns';
import { RequirePermission } from "@/components/require-permission";

export default function AuditLogPage() {
    const { auditLogs } = useAppContext();

    return (
        <RequirePermission permission="audit:view">
            <div className="flex flex-col h-full">
                <PageHeader title="Audit Log" description="Review important security and data change events." />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Events</CardTitle>
                            <CardDescription>A log of all significant actions performed in the system.</CardDescription>
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
                                    {auditLogs.map((log) => (
                                        <TableRow key={log._id}>
                                            <TableCell>{format(new Date(log.timestamp), 'PPpp')}</TableCell>
                                            <TableCell>{log.memberName} ({log.memberId})</TableCell>
                                            <TableCell>
                                                <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">{log.action}</span>
                                            </TableCell>
                                            <TableCell>
                                                {log.details && Object.keys(log.details).length > 0 ? (
                                                     <pre className="text-xs bg-muted p-2 rounded-md whitespace-pre-wrap break-all">{JSON.stringify(log.details, null, 2)}</pre>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">No details</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                     {auditLogs.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No audit events found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </RequirePermission>
    )
}
