
'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, MessageSquare, Smile, Search } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';
import type { MemberProfile, ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Picker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { useTheme } from 'next-themes';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const DateSeparator = ({ date }: { date: number }) => (
    <div className="relative text-center my-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">
                {format(new Date(date), 'MMMM d, yyyy')}
            </span>
        </div>
    </div>
);

const ClientRelativeTime = ({ timestamp }: { timestamp: number }) => {
    const [relativeTime, setRelativeTime] = useState('');

    useEffect(() => {
        setRelativeTime(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));

        const interval = setInterval(() => {
            setRelativeTime(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [timestamp]);

    return (
        <time dateTime={new Date(timestamp).toISOString()} className="text-xs text-muted-foreground shrink-0">
            {relativeTime}
        </time>
    );
};


const ConversationView = ({ member, onBack }: { member: MemberProfile; onBack: () => void }) => {
    const { currentUser, sendMessage, members, chatMessages } = useAppContext();
    const [message, setMessage] = useState('');
    const { theme } = useTheme();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const conversationMessages = useMemo(() => {
        return chatMessages.filter(
            (msg) =>
                (msg.senderId === currentUser?.id && msg.receiverId === member.id) ||
                (msg.senderId === member.id && msg.receiverId === currentUser?.id)
        );
    }, [chatMessages, currentUser?.id, member.id]);
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [conversationMessages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            sendMessage(member.id, message.trim());
            setMessage('');
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setMessage(currentMessage => currentMessage + emojiData.emoji);
    };

    const messagesWithSeparators = useMemo(() => {
        const sortedMessages = [...conversationMessages].sort((a,b) => a.timestamp - b.timestamp);
        
        const result: (ChatMessage | { type: 'separator', date: number, id: string })[] = [];
        let lastDate: Date | null = null;
        
        sortedMessages.forEach(msg => {
            const msgDate = new Date(msg.timestamp);
            if (!lastDate || !isSameDay(lastDate, msgDate)) {
                result.push({ type: 'separator', date: msg.timestamp, id: `sep-${msg.timestamp}` });
            }
            result.push(msg);
            lastDate = msgDate;
        });

        return result;
    }, [conversationMessages]);


    const getSender = (senderId: string) => {
        return members.find(m => m.id === senderId);
    }

    return (
        <div className="flex flex-col h-full bg-card border rounded-lg">
            <header className="flex items-center gap-4 p-4 border-b">
                <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
                    <ArrowLeft />
                </Button>
                <Avatar className="size-10">
                    <AvatarImage src={member.avatar} data-ai-hint={member.avatarHint} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{member.name}</h3>
            </header>
            <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
                <div className="p-4 space-y-4">
                    {messagesWithSeparators.map(item => {
                        if (item.type === 'separator') {
                            return <DateSeparator key={item.id} date={item.date} />;
                        }

                        const msg = item as ChatMessage;
                        const isCurrentUser = msg.senderId === currentUser?.id;
                        const sender = getSender(msg.senderId);
                        return (
                            <div key={msg.id} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                                {!isCurrentUser && (
                                    <Avatar className="size-6 self-start">
                                        <AvatarImage src={sender?.avatar} data-ai-hint={sender?.avatarHint} />
                                        <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-xs md:max-w-md p-3 rounded-2xl", isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none")}>
                                    <p className="text-sm">{msg.text}</p>
                                    <div className={cn("text-xs mt-1 text-right block", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                        {format(new Date(msg.timestamp), 'p')}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
            <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t">
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0">
                            <Smile />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-none mb-2">
                        <Picker 
                            onEmojiClick={handleEmojiClick}
                            theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
                        />
                    </PopoverContent>
                </Popover>
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
                />
                <Button type="submit" size="icon" className="shrink-0">
                    <Send />
                </Button>
            </form>
        </div>
    );
};


const ConversationList = ({ onSelectMember }: { onSelectMember: (member: MemberProfile) => void; }) => {
    const { members, currentUser, chatMessages } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const membersWithChatInfo = useMemo(() => {
        if (!currentUser) return [];

        return members
            .filter(member => member.id !== currentUser.id)
            .map(member => {
                const conversationMessages = chatMessages.filter(
                    msg =>
                        (msg.senderId === currentUser.id && msg.receiverId === member.id) ||
                        (msg.senderId === member.id && msg.receiverId === currentUser.id)
                );
                
                const lastMessage = conversationMessages.length > 0 
                    ? [...conversationMessages].sort((a, b) => b.timestamp - a.timestamp)[0] 
                    : null;

                const unreadCount = conversationMessages.filter(
                    msg => msg.receiverId === currentUser.id && !msg.isRead
                ).length;
                
                return {
                    ...member,
                    lastMessage: lastMessage ? { text: lastMessage.text, timestamp: lastMessage.timestamp } : { text: "No messages yet", timestamp: null },
                    unreadCount,
                };
            })
            .sort((a, b) => (b.lastMessage.timestamp || 0) - (a.lastMessage.timestamp || 0));

    }, [members, currentUser, chatMessages]);

    const filteredMembers = useMemo(() => {
        if (!searchTerm) return membersWithChatInfo;
        return membersWithChatInfo.filter(member => 
            member.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, membersWithChatInfo]);

    return (
        <Card className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search members..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <ul className="divide-y divide-border">
                    {filteredMembers.map(member => {
                        return (
                            <li key={member.id}>
                                <button onClick={() => onSelectMember(member)} className="flex items-center gap-4 p-4 w-full text-left hover:bg-accent transition-colors">
                                    <Avatar className="size-12">
                                        <AvatarImage src={member.avatar} data-ai-hint={member.avatarHint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-semibold truncate">{member.name}</h3>
                                            {member.lastMessage.timestamp && (
                                                <ClientRelativeTime timestamp={member.lastMessage.timestamp} />
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-muted-foreground truncate">{member.lastMessage.text}</p>
                                            {member.unreadCount > 0 && (
                                                <Badge className="bg-primary text-primary-foreground rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs shrink-0">
                                                    {member.unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                     {filteredMembers.length === 0 && (
                        <p className="text-center text-muted-foreground p-8">No members found.</p>
                    )}
                </ul>
            </ScrollArea>
        </Card>
    );
};

const Placeholder = () => (
    <div className="hidden md:flex flex-col items-center justify-center h-full bg-card border rounded-lg text-center p-8">
        <MessageSquare className="size-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold">Select a conversation</h2>
        <p className="text-muted-foreground">Choose a family member from the list to start chatting.</p>
    </div>
)

export default function ChatPage() {
    const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);
    const { markConversationAsRead } = useAppContext();

    const handleSelectMember = useCallback((member: MemberProfile) => {
        setSelectedMember(member);
        markConversationAsRead(member.id);
    }, [markConversationAsRead]);

    useEffect(() => {
        if(selectedMember) {
            markConversationAsRead(selectedMember.id);
        }
    }, [selectedMember, markConversationAsRead]);

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Chat" description="Communicate with your family members." />
            <main className="flex-1 overflow-y-hidden p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-full">
                    <div className={cn("h-full", selectedMember ? "hidden md:block" : "block")}>
                       <ConversationList onSelectMember={handleSelectMember} />
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 h-full">
                        {selectedMember ? (
                            <ConversationView member={selectedMember} onBack={() => setSelectedMember(null)} />
                        ) : (
                           <Placeholder />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
