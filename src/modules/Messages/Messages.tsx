'use client'

import { markConversationReadInCache, type ConversationsInfiniteData } from '@/apis/messages/messages.cache'
import { messagesKeys } from '@/apis/messages/messages.key'
import {
    useInfiniteConversations,
    useInfiniteMessages,
    useMarkConversationRead,
    useSendMessage,
} from '@/apis/messages/messages.query'
import { useCurrentUser } from '@/apis/user/user.query'
import { ROUTE } from '@/core/constants/route.constant'
import type { ConversationItem } from '@/core/types/message.type'
import { useMessagesRealtime } from '@/hooks/useMessagesRealtime'
import { useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import ConversationsSidebar from './components/ConversationsSidebar'
import MessageThread from './components/MessageThread'

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

    const {
        data: messagesPages,
        isLoading: isMessagesLoading,
        fetchNextPage: fetchNextMessagesPage,
        hasNextPage: hasNextMessagesPage,
        isFetchingNextPage: isFetchingNextMessagesPage,
    } = useInfiniteMessages(conversationId ?? undefined)

    useMessagesRealtime(!!user)

    const conversations = useMemo(() => {
        return conversationsPages?.pages.flatMap((page) => page.conversations) ?? []
    }, [conversationsPages])

    const messages = useMemo(() => {
        const pages = messagesPages?.pages ?? []

        return pages
            .slice()
            .reverse()
            .flatMap((page) => page.messages)
    }, [messagesPages])

    const activeConversation = conversations.find((conversation) => conversation.id === conversationId) ?? null
    const sendMessageMutation = useSendMessage(conversationId ?? undefined)
    const markConversationReadMutation = useMarkConversationRead()

    useEffect(() => {
        setHasMounted(true)
    }, [])

    const scrollMessagesToBottom = (behavior?: ScrollBehavior) => {
        const messagesList = messagesListRef.current

        if (!messagesList) return

        messagesList.scrollTo({
            top: messagesList.scrollHeight,
            behavior,
        })
    }

    const markConversationAsReadInCache = (targetConversationId: string) => {
        queryClient.setQueryData<ConversationsInfiniteData>(messagesKeys.conversations(), (oldData) =>
            markConversationReadInCache(oldData, targetConversationId),
        )
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
                <ConversationsSidebar
                    conversations={conversations}
                    conversationId={conversationId}
                    conversationsListRef={conversationsListRef}
                    isLoading={isConversationsLoading}
                    hasNextPage={!!hasNextConversationsPage}
                    isFetchingNextPage={isFetchingNextConversationsPage}
                    onScroll={() => {
                        void handleConversationsScroll()
                    }}
                    onSelectConversation={(conversation) => {
                        void handleSelectConversation(conversation)
                    }}
                />

                <MessageThread
                    activeConversation={activeConversation}
                    currentUserId={user.id}
                    draft={draft}
                    hasNextPage={!!hasNextMessagesPage}
                    isFetchingNextPage={isFetchingNextMessagesPage}
                    isLoading={isMessagesLoading}
                    isSending={sendMessageMutation.isPending}
                    messages={messages}
                    messagesListRef={messagesListRef}
                    setDraft={setDraft}
                    onComposerFocus={() => {
                        void markConversationReadIfNeeded(activeConversation)
                    }}
                    onMessagesClick={() => {
                        void markConversationReadIfNeeded(activeConversation)
                    }}
                    onMessagesScroll={() => {
                        void handleMessagesScroll()
                    }}
                    onSubmit={handleSendMessage}
                />
            </section>
        </main>
    )
}

export default Messages
