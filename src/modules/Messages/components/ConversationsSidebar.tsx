'use client'

import type { ConversationItem } from '@/core/types/message.type'
import { cn } from '@/utils/helper'
import type { RefObject } from 'react'
import { getConversationName, getConversationPreview } from '../utils/messageDisplay'
import { CONVERSATIONS_SIDEBAR_TEXT } from '@/core/constants/message.constant'
import { useLingui } from '@lingui/react/macro'

interface ConversationsSidebarProps {
    conversations: ConversationItem[]
    conversationId: string | null
    conversationsListRef: RefObject<HTMLDivElement | null>
    isLoading: boolean
    hasNextPage: boolean
    isFetchingNextPage: boolean
    onScroll: () => void
    onSelectConversation: (conversation: ConversationItem) => void
}

const ConversationsSidebar = ({
    conversations,
    conversationId,
    conversationsListRef,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    onScroll,
    onSelectConversation,
}: ConversationsSidebarProps) => {
    const { t } = useLingui()

    return (
        <aside className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex min-h-0 w-full flex-col border-r border-gray-200 bg-white">
            {/* Header sidebar */}
            <div className="flex h-14 shrink-0 items-center border-b border-gray-100 px-4">
                <h2 className="text-sm font-semibold text-slate-800">{t(CONVERSATIONS_SIDEBAR_TEXT.TITLE)}</h2>
            </div>

            {/* Danh sách conversations */}
            <div
                ref={conversationsListRef}
                onScroll={onScroll}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0 flex-1 overflow-y-auto p-2"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                ) : conversations.length > 0 ? (
                    <div className="space-y-0.5">
                        {conversations.map((conversation) => {
                            const isActive = conversation.id === conversationId

                            return (
                                <button
                                    key={conversation.id}
                                    type="button"
                                    onClick={() => onSelectConversation(conversation)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                                        isActive ? 'bg-blue-50' : 'hover:bg-gray-50',
                                    )}
                                >
                                    {conversation.other_user?.avatar_url ? (
                                        <img
                                            src={conversation.other_user.avatar_url}
                                            alt={getConversationName(conversation)}
                                            className="size-10 shrink-0 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-500">
                                            {getConversationName(conversation).charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={cn(
                                                'truncate text-sm',
                                                conversation.has_unread
                                                    ? 'font-semibold text-slate-900'
                                                    : 'font-medium text-slate-700',
                                            )}
                                        >
                                            {getConversationName(conversation)}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-slate-400">
                                            {getConversationPreview(conversation)}
                                        </p>
                                    </div>

                                    {conversation.has_unread && (
                                        <span className="size-2 shrink-0 rounded-full bg-blue-500" />
                                    )}
                                </button>
                            )
                        })}

                        {hasNextPage && (
                            <div className="flex h-8 items-center justify-center">
                                {isFetchingNextPage && (
                                    <div className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="px-3 py-10 text-center">
                        <p className="text-sm font-medium text-slate-600">
                            {t(CONVERSATIONS_SIDEBAR_TEXT.EMPTY_TITLE)}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">{t(CONVERSATIONS_SIDEBAR_TEXT.EMPTY_SUBTITLE)}</p>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default ConversationsSidebar
