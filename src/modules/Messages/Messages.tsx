'use client'

import { useCurrentUser } from '@/apis/user/user.query'
import { ROUTE } from '@/core/constants/route.constant'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
    useInfiniteConversations,
    useInfiniteMessages,
    useMarkConversationRead,
    useSendMessage,
} from '@/apis/messages/messages.query'
import { messagesKeys } from '@/apis/messages/messages.key'
import { ConversationItem } from '@/core/types/message.type'
import { cn } from '@/utils/helper'
import { useMessagesRealtime } from '@/hooks/useMessagesRealtime'
import { useQueryClient } from '@tanstack/react-query'

const getConversationName = (conversation: ConversationItem) => {
    return conversation.other_user?.display_name || conversation.other_user?.username || 'Unknown user'
}

const getConversationPreview = (conversation: ConversationItem) => {
    return conversation.last_message?.content || 'No messages yet'
}

const Messages = () => {
    const [hasMounted, setHasMounted] = useState(false)
    const [draft, setDraft] = useState('')
    const messagesListRef = useRef<HTMLDivElement | null>(null)
    const conversationsListRef = useRef<HTMLDivElement | null>(null)
    const isLoadingOlderMessagesRef = useRef(false)
    const previousMessagesScrollHeightRef = useRef(0)
    const previousMessagesScrollTopRef = useRef(0)
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    const { data: user, isLoading: isUserLoading } = useCurrentUser()

    const conversationId = searchParams.get('conversationId')
    const {
        data: conversationsPages,
        isLoading: isConversationsLoading,
        fetchNextPage: fetchNextConversationsPage,
        hasNextPage: hasNextConversationsPage,
        isFetchingNextPage: isFetchingNextConversationsPage,
    } = useInfiniteConversations(!!user)
    useMessagesRealtime(!!user)
    const conversations = useMemo(() => {
        return conversationsPages?.pages.flatMap((page) => page.conversations) ?? []
    }, [conversationsPages])
    useEffect(() => {
        setHasMounted(true)
    }, [])

    const activeConversation = conversations.find((conversation) => conversation.id === conversationId) ?? null
    const {
        data: messagesPages,
        isLoading: isMessagesLoading,
        fetchNextPage: fetchNextMessagesPage,
        hasNextPage: hasNextMessagesPage,
        isFetchingNextPage: isFetchingNextMessagesPage,
    } = useInfiniteMessages(conversationId ?? undefined)

    const messages = useMemo(() => {
        const pages = messagesPages?.pages ?? []

        return pages
            .slice()
            .reverse()
            .flatMap((page) => page.messages)
    }, [messagesPages])

    const sendMessageMutation = useSendMessage(conversationId ?? undefined)
    const markConversationReadMutation = useMarkConversationRead()
    const scrollMessagesToBottom = (behavior?: ScrollBehavior) => {
        const messagesList = messagesListRef.current

        if (!messagesList) return

        messagesList.scrollTo({
            top: messagesList.scrollHeight,
            behavior,
        })
    }

    const markConversationAsReadInCache = (targetConversationId: string) => {
        queryClient.setQueryData(messagesKeys.conversations(), (oldData: typeof conversationsPages) => {
            if (!oldData) return oldData

            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    conversations: page.conversations.map((conversation) =>
                        conversation.id === targetConversationId
                            ? {
                                  ...conversation,
                                  has_unread: false,
                              }
                            : conversation,
                    ),
                })),
            }
        })
    }

    const markConversationReadIfNeeded = async (conversation: ConversationItem | null) => {
        if (!conversation || !conversation.has_unread) return

        markConversationAsReadInCache(conversation.id)
        await markConversationReadMutation.mutateAsync(conversation.id)
    }

    const handleSelectConversation = async (conversation: ConversationItem) => {
        router.replace(`/messages?conversationId=${conversation.id}`)

        await markConversationReadIfNeeded(conversation)
    }

    const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const content = draft.trim()

        if (!conversationId || !content) return

        setDraft('')
        await sendMessageMutation.mutateAsync(content)

        window.requestAnimationFrame(() => {
            scrollMessagesToBottom('smooth')
        })
    }

    const handleFocusComposer = async () => {
        await markConversationReadIfNeeded(activeConversation)
    }

    const handleMessagesScroll = async () => {
        const messagesList = messagesListRef.current

        if (
            !messagesList ||
            !hasNextMessagesPage ||
            isFetchingNextMessagesPage ||
            isMessagesLoading ||
            messagesList.scrollTop > 80
        ) {
            return
        }

        isLoadingOlderMessagesRef.current = true
        previousMessagesScrollHeightRef.current = messagesList.scrollHeight
        previousMessagesScrollTopRef.current = messagesList.scrollTop

        await fetchNextMessagesPage()
    }

    const handleConversationsScroll = async () => {
        const conversationsList = conversationsListRef.current

        if (
            !conversationsList ||
            !hasNextConversationsPage ||
            isFetchingNextConversationsPage ||
            conversationsList.scrollHeight - conversationsList.scrollTop - conversationsList.clientHeight > 120
        ) {
            return
        }

        await fetchNextConversationsPage()
    }

    useEffect(() => {
        if (conversationId || conversations.length === 0) return

        router.replace(`/messages?conversationId=${conversations[0].id}`)
    }, [conversationId, conversations, router])

    useEffect(() => {
        if (!activeConversation || isMessagesLoading) return

        window.requestAnimationFrame(() => {
            if (isLoadingOlderMessagesRef.current) {
                const messagesList = messagesListRef.current

                if (messagesList) {
                    messagesList.scrollTop =
                        messagesList.scrollHeight -
                        previousMessagesScrollHeightRef.current +
                        previousMessagesScrollTopRef.current
                }

                isLoadingOlderMessagesRef.current = false
                previousMessagesScrollHeightRef.current = 0
                previousMessagesScrollTopRef.current = 0
                return
            }

            scrollMessagesToBottom()
        })
    }, [activeConversation, isMessagesLoading, messages.length])

    if (!hasMounted || isUserLoading) {
        return (
            <main className="flex h-screen items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">Checking login status...</p>
            </main>
        )
    }

    if (!user) {
        return (
            <main className="flex h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <h1 className="text-xl font-semibold text-slate-950">Messages</h1>
                    <p className="mt-2 text-sm text-slate-500">Please log in to view your messages.</p>

                    <Link
                        href={ROUTE.LOGIN}
                        className="mt-5 inline-flex rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white"
                    >
                        Log in
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="h-screen overflow-hidden bg-slate-100">
            <section className="grid h-full grid-cols-[360px_1fr]">
                <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-white">
                    <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
                        <Link
                            href={ROUTE.HOME}
                            className="flex size-10 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white"
                        >
                            J
                        </Link>

                        <div>
                            <h1 className="text-lg font-semibold text-slate-950">Messages</h1>
                            <p className="text-xs text-slate-400">People you have chatted with</p>
                        </div>
                    </div>

                    <div
                        ref={conversationsListRef}
                        onScroll={() => {
                            void handleConversationsScroll()
                        }}
                        className="min-h-0 flex-1 overflow-y-auto p-3"
                    >
                        {isConversationsLoading ? (
                            <p className="p-3 text-sm text-slate-500">Loading conversations...</p>
                        ) : conversations.length > 0 ? (
                            <div className="space-y-1">
                                {conversations.map((conversation) => {
                                    const isActive = conversation.id === conversationId

                                    return (
                                        <button
                                            key={conversation.id}
                                            type="button"
                                            onClick={() => {
                                                void handleSelectConversation(conversation)
                                            }}
                                            className={cn(
                                                'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition',
                                                isActive ? 'bg-blue-50' : 'hover:bg-slate-50',
                                            )}
                                        >
                                            {conversation.other_user?.avatar_url ? (
                                                <img
                                                    src={conversation.other_user.avatar_url}
                                                    alt={getConversationName(conversation)}
                                                    className="size-11 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-500">
                                                    {getConversationName(conversation).charAt(0).toUpperCase()}
                                                </div>
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-950">
                                                    {getConversationName(conversation)}
                                                </p>
                                                <p className="mt-0.5 truncate text-sm text-slate-500">
                                                    {getConversationPreview(conversation)}
                                                </p>
                                            </div>

                                            {conversation.has_unread ? (
                                                <span className="size-2.5 shrink-0 rounded-full bg-blue-500" />
                                            ) : null}
                                        </button>
                                    )
                                })}

                                {hasNextConversationsPage ? (
                                    <div className="flex h-10 items-center justify-center">
                                        <span className="text-xs text-slate-400">
                                            {isFetchingNextConversationsPage ? 'Loading more conversations...' : ''}
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="px-3 py-10 text-center">
                                <p className="text-sm font-medium text-slate-700">No conversations yet</p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Open someone&apos;s profile and start a message.
                                </p>
                            </div>
                        )}
                    </div>
                </aside>

                <section className="flex min-h-0 flex-col bg-slate-50">
                    <div className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-5">
                        {activeConversation ? (
                            <>
                                {activeConversation.other_user?.avatar_url ? (
                                    <img
                                        src={activeConversation.other_user.avatar_url}
                                        alt={getConversationName(activeConversation)}
                                        className="size-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-500">
                                        {getConversationName(activeConversation).charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-950">
                                        {getConversationName(activeConversation)}
                                    </p>
                                    <p className="truncate text-xs text-slate-400">
                                        @{activeConversation.other_user?.username ?? 'unknown'}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm font-medium text-slate-500">Select a conversation</p>
                        )}
                    </div>

                    <div
                        ref={messagesListRef}
                        onScroll={() => {
                            void handleMessagesScroll()
                        }}
                        onClick={() => {
                            void markConversationReadIfNeeded(activeConversation)
                        }}
                        className="min-h-0 flex-1 overflow-y-auto p-5"
                    >
                        {isMessagesLoading ? (
                            <p className="text-sm text-slate-500">Loading messages...</p>
                        ) : activeConversation ? (
                            messages.length > 0 ? (
                                <div className="flex min-h-full flex-col justify-end gap-3">
                                    {hasNextMessagesPage ? (
                                        <div className="flex justify-center py-2">
                                            <span className="text-xs text-slate-400">
                                                {isFetchingNextMessagesPage ? 'Loading older messages...' : ''}
                                            </span>
                                        </div>
                                    ) : null}

                                    {messages.map((message) => {
                                        const isMine = message.sender_id === user.id

                                        return (
                                            <div
                                                key={message.id}
                                                className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                                            >
                                                <div
                                                    className={cn(
                                                        'max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm',
                                                        isMine
                                                            ? 'rounded-br-md bg-blue-500 text-white'
                                                            : 'rounded-bl-md bg-white text-slate-800',
                                                    )}
                                                >
                                                    <p className="break-words whitespace-pre-wrap">{message.content}</p>
                                                    <p
                                                        className={cn(
                                                            'mt-1 text-[11px]',
                                                            isMine ? 'text-blue-100' : 'text-slate-400',
                                                        )}
                                                    >
                                                        {new Intl.DateTimeFormat('vi-VN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        }).format(new Date(message.created_at))}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-center">
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">No messages yet</p>
                                        <p className="mt-1 text-sm text-slate-400">Send the first message below.</p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="flex h-full items-center justify-center text-center">
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Select a conversation</p>
                                    <p className="mt-1 text-sm text-slate-400">Your chat history will appear here.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="border-t border-slate-200 bg-white p-4">
                        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                            <textarea
                                value={draft}
                                onChange={(event) => setDraft(event.target.value)}
                                rows={1}
                                disabled={!activeConversation || sendMessageMutation.isPending}
                                placeholder={activeConversation ? 'Write a message...' : 'Select a conversation first'}
                                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' && !event.shiftKey) {
                                        event.preventDefault()
                                        event.currentTarget.form?.requestSubmit()
                                    }
                                }}
                                onFocus={() => {
                                    void handleFocusComposer()
                                }}
                            />

                            <button
                                type="submit"
                                disabled={!activeConversation || !draft.trim() || sendMessageMutation.isPending}
                                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </section>
            </section>
        </main>
    )
}

export default Messages
