'use client'

import { ROUTE } from '@/core/constants/route.constant'
import { LAYOUT_ALT, LAYOUT_ASSET } from '@/core/constants/layout.constant'
import type { ConversationItem } from '@/core/types/message.type'
import { cn } from '@/utils/helper'
import Link from 'next/link'
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
        <aside className="flex min-h-0 w-full flex-col border-r border-slate-200 bg-white lg:h-full">
            <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
                <Link
                    href={ROUTE.HOME}
                    className="bg-primary flex size-10 items-center justify-center rounded-[12px] px-2 py-1"
                >
                    <img src={LAYOUT_ASSET.LOGO} alt={LAYOUT_ALT.LOGO} className="h-1/2 w-[13px] object-cover" />
                </Link>

                <div>
                    <h1 className="text-lg font-semibold text-slate-950">{t(CONVERSATIONS_SIDEBAR_TEXT.TITLE)}</h1>
                    <p className="text-xs text-slate-400">{t(CONVERSATIONS_SIDEBAR_TEXT.SUBTITLE)}</p>
                </div>
            </div>

            <div ref={conversationsListRef} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto p-3">
                {isLoading ? (
                    <p className="p-3 text-sm text-slate-500">{t(CONVERSATIONS_SIDEBAR_TEXT.LOADING)}</p>
                ) : conversations.length > 0 ? (
                    <div className="space-y-1">
                        {conversations.map((conversation) => {
                            const isActive = conversation.id === conversationId

                            return (
                                <button
                                    key={conversation.id}
                                    type="button"
                                    onClick={() => onSelectConversation(conversation)}
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

                        {hasNextPage ? (
                            <div className="flex h-10 items-center justify-center">
                                <span className="text-xs text-slate-400">
                                    {isFetchingNextPage ? t(CONVERSATIONS_SIDEBAR_TEXT.LOADING) : ''}
                                </span>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="px-3 py-10 text-center">
                        <p className="text-sm font-medium text-slate-700">
                            {t(CONVERSATIONS_SIDEBAR_TEXT.EMPTY_TITLE)}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">{t(CONVERSATIONS_SIDEBAR_TEXT.EMPTY_SUBTITLE)}</p>
                    </div>
                )}
            </div>
        </aside>
    )
}

export default ConversationsSidebar
