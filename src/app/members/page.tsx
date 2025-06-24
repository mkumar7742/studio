
"use client";

import { useState } from "react";
import Link from 'next/link';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useAppContext } from "@/context/app-provider";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { RequirePermission } from "@/components/require-permission";
import type { MemberProfile } from "@/types";
import { EditMemberDialog } from "@/components/edit-member-dialog";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function MembersPage() {
    const { members, getMemberRole, deleteMember, currentUser } = useAppContext();
    const [memberToEdit, setMemberToEdit] = useState<MemberProfile | null>(null);
    const [memberToDelete, setMemberToDelete] = useState<MemberProfile | null>(null);

    const handleEditClick = (member: MemberProfile) => {
        setMemberToEdit(member);
    };

    const handleDeleteClick = (member: MemberProfile) => {
        setMemberToDelete(member);
    };

    const handleConfirmDelete = () => {
        if (memberToDelete) {
            deleteMember(memberToDelete.id);
            setMemberToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Members" description="Manage your team or family members." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Team Members ({members.length})</CardTitle>
                                <CardDescription>Invite and manage member access.</CardDescription>
                            </div>
                            <RequirePermission permission="members:create">
                                <AddMemberDialog />
                            </RequirePermission>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => {
                                    const role = getMemberRole(member);
                                    const isCurrentUser = member.id === currentUser.id;
                                    return (
                                        <TableRow key={member.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.avatarHint} />
                                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                     <Link href={`/members/${member.id}`} className="font-medium hover:underline">
                                                        {member.name}
                                                    </Link>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{member.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={role?.name === 'Administrator' ? 'default' : 'secondary'} className={role?.name === 'Administrator' ? 'bg-primary/80' : ''}>
                                                    {role ? role.name : 'Unknown Role'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/members/${member.id}`}>View Profile</Link>
                                                        </DropdownMenuItem>
                                                        <RequirePermission permission="members:edit">
                                                            <DropdownMenuItem onClick={() => handleEditClick(member)}>
                                                                Edit Member
                                                            </DropdownMenuItem>
                                                        </RequirePermission>
                                                        <RequirePermission permission="members:delete">
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="focus:bg-destructive/80 focus:text-destructive-foreground text-destructive"
                                                                onClick={() => handleDeleteClick(member)}
                                                                disabled={isCurrentUser}
                                                            >
                                                                Delete Member
                                                            </DropdownMenuItem>
                                                        </RequirePermission>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            <EditMemberDialog 
                member={memberToEdit}
                open={!!memberToEdit}
                onOpenChange={(isOpen) => !isOpen && setMemberToEdit(null)}
            />
            <DeleteConfirmationDialog
                open={!!memberToDelete}
                onOpenChange={(isOpen) => !isOpen && setMemberToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Member"
                description={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
            />
        </div>
    );
}
