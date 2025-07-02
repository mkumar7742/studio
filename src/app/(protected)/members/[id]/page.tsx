
'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { MemberProfile, Transaction } from '@/types';
import { ArrowLeft, Mail, Phone, MapPin, Link as LinkIcon, Twitter, Linkedin, Pencil } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { RequirePermission } from '@/components/require-permission';
import { EditMemberDialog } from '@/components/edit-member-dialog';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';

const CategoryIcon = ({ categoryName }: { categoryName: string }) => {
    const { categories } = useAppContext();
    const category = categories.find((c) => c.name === categoryName);
    const Icon = category?.icon;
    return Icon ? (
      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
    ) : null;
};

const socialIconMap: { [key: string]: LucideIcon } = {
    twitter: Twitter,
    linkedin: Linkedin,
};

const SocialIcon = ({ platform }: { platform: string }) => {
    const Icon = socialIconMap[platform.toLowerCase()] || LinkIcon;
    return <Icon className="size-4 text-muted-foreground" />;
};


export default function MemberProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { id } = params as { id: string };
    const { members, transactions, getMemberRole } = useAppContext();
    const [memberToEdit, setMemberToEdit] = useState<MemberProfile | null>(null);

    const member = members.find(m => m.id === id);
    const memberTransactions = transactions.filter(t => t.member === member?.name);
    const role = member ? getMemberRole(member) : undefined;

    if (!member) {
        return (
            <div className="flex flex-col h-full">
                <PageHeader title="Member Not Found" description="Could not find the requested member." />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 text-center">
                    <p>The member you are looking for does not exist.</p>
                     <Button asChild variant="outline" className="mt-4" onClick={() => router.back()}>
                        <Link href="/members">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Family Members
                        </Link>
                    </Button>
                </main>
            </div>
        );
    }
    
    const isFamilyHead = role?.name === 'Family Head';

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Member Profile" description={`Details and activity for ${member.name}.`}>
                <RequirePermission permission="members:edit">
                    <Button variant="outline" onClick={() => setMemberToEdit(member)}>
                        <Pencil className="mr-2 size-4" /> Edit Profile
                    </Button>
                </RequirePermission>
            </PageHeader>
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column - Profile Details */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <Card>
                             <CardHeader className="items-center text-center">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.avatarHint} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-2xl">{member.name}</CardTitle>
                                {role && <Badge variant={isFamilyHead ? 'default' : 'secondary'} className={isFamilyHead ? 'bg-primary/80' : ''}>{role.name}</Badge>}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm text-muted-foreground">Contact Information</h3>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="size-4 text-muted-foreground" />
                                        <span>{member.email}</span>
                                    </div>
                                    {member.phone && (
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="size-4 text-muted-foreground" />
                                            <span>{member.phone}</span>
                                        </div>
                                    )}
                                     {member.address && (
                                        <div className="flex items-start gap-3 text-sm">
                                            <MapPin className="size-4 text-muted-foreground mt-1" />
                                            <span>{member.address}</span>
                                        </div>
                                    )}
                                </div>
                                {member.socials && member.socials.length > 0 && (
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-sm text-muted-foreground">Social Media</h3>
                                        {member.socials.map((social, index) => (
                                            <div key={index} className="flex items-center gap-3 text-sm">
                                                <SocialIcon platform={social.platform} />
                                                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                    {social.platform}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <Button asChild variant="outline" className="w-full mt-4">
                                    <Link href="/members">
                                        <ArrowLeft className="mr-2 size-4" />
                                        Back to Family Members
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Transaction History */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Transaction History</CardTitle>
                                <CardDescription>A complete log of all income and expenses for {member.name}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="hidden sm:table-cell">Date</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {memberTransactions.length > 0 ? (
                                            memberTransactions.map((txn: Transaction) => (
                                                <TableRow key={txn.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <CategoryIcon categoryName={txn.category} />
                                                            <div>
                                                                <div className="font-medium">{txn.description}</div>
                                                                <div className="text-sm text-muted-foreground">{txn.category}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">{format(new Date(txn.date), 'PPP')}</TableCell>
                                                    <TableCell
                                                        className={`text-right font-medium ${
                                                        txn.type === "income" ? "text-emerald-600" : "text-foreground"
                                                        }`}
                                                    >
                                                        {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount, txn.currency)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center">
                                                    No transactions found for this member.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <EditMemberDialog 
                member={memberToEdit}
                open={!!memberToEdit}
                onOpenChange={(isOpen) => !isOpen && setMemberToEdit(null)}
            />
        </div>
    );
}
