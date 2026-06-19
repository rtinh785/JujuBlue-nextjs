'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ROUTE } from '@/core/constants/route.constant'
import type { ConversationItem, MessageItem } from '@/core/types/message.type'
import { cn } from '@/utils/helper'
import type { Dispatch, FormEvent, RefObject, SetStateAction } from 'react'
import { formatMessageTime, getConversationName } from '../utils/messageDisplay'
import { MESSAGE_COMPOSER_TEXT, MESSAGE_THREAD_TEXT } from '@/core/constants/message.constant'
import { useLingui } from '@lingui/react/macro'

interface MessageThreadProps {
    activeConversation: ConversationItem | null
    currentUserId: string
    draft: string
    hasNextPage: boolean
    isFetchingNextPage: boolean
    isLoading: boolean
    isSending: boolean
    messages: MessageItem[]
    messagesListRef: RefObject<HTMLDivElement | null>
    setDraft: Dispatch<SetStateAction<string>>
    onComposerFocus: () => void
    onMessagesClick: () => void
    onMessagesScroll: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const MessageThread = ({
    activeConversation,
    currentUserId,
    draft,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSending,
    messages,
    messagesListRef,
    setDraft,
    onComposerFocus,
    onMessagesClick,
    onMessagesScroll,
    onSubmit,
}: MessageThreadProps) => {
    const { t } = useLingui()

    return (
        <section className="flex min-h-0 w-full flex-col bg-white lg:h-full">
            {/* Header thread */}
            <div className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-100 bg-white px-4">
                <Link
                    href={ROUTE.MESSAGES}
                    className="inline-flex size-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
                    aria-label={t(MESSAGE_THREAD_TEXT.BACK_ARIA_LABEL)}
                >
                    <ArrowLeft className="size-4" />
                </Link>

                {activeConversation ? (
                    <>
                        {activeConversation.other_user?.avatar_url ? (
                            <img
                                src={activeConversation.other_user.avatar_url}
                                alt={getConversationName(activeConversation)}
                                className="size-9 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-500">
                                {getConversationName(activeConversation).charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {getConversationName(activeConversation)}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                @{activeConversation.other_user?.username ?? 'unknown'}
                            </p>
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-slate-400">{t(MESSAGE_THREAD_TEXT.SELECT_CONVERSATION)}</p>
                )}
            </div>

            {/* Messages list */}
            <div
                ref={messagesListRef}
                onScroll={onMessagesScroll}
                onClick={onMessagesClick}
                className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0 flex-1 overflow-y-auto bg-gray-50 p-4"
            >
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="size-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                ) : activeConversation ? (
                    messages.length > 0 ? (
                        <div className="flex min-h-full flex-col justify-end gap-2">
                            {hasNextPage && (
                                <div className="flex justify-center py-2">
                                    {isFetchingNextPage && (
                                        <div className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                                    )}
                                </div>
                            )}

                            {messages.map((message) => {
                                const isMine = message.sender_id === currentUserId

                                return (
                                    <div
                                        key={message.id}
                                        className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                                    >
                                        <div
                                            className={cn(
                                                'max-w-[68%] rounded-2xl px-3.5 py-2 text-sm',
                                                isMine
                                                    ? 'rounded-br-sm bg-blue-500 text-white'
                                                    : 'rounded-bl-sm bg-white text-slate-800 shadow-sm ring-1 ring-gray-100',
                                            )}
                                        >
                                            <p className="leading-relaxed break-words whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                            <p
                                                className={cn(
                                                    'mt-1 text-[10px]',
                                                    isMine ? 'text-blue-100' : 'text-slate-400',
                                                )}
                                            >
                                                {formatMessageTime(message.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-center">
                            <div>
                                <p className="text-sm font-medium text-slate-600">
                                    {t(MESSAGE_THREAD_TEXT.EMPTY_TITLE)}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">{t(MESSAGE_THREAD_TEXT.EMPTY_SUBTITLE)}</p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex h-full items-center justify-center text-center">
                        <div>
                            <p className="text-sm font-medium text-slate-600">
                                {t(MESSAGE_THREAD_TEXT.SELECT_CONVERSATION)}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                                {t(MESSAGE_THREAD_TEXT.SELECT_CONVERSATION_HINT)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Composer */}
            <form onSubmit={onSubmit} className="shrink-0 border-t border-gray-100 bg-white p-3">
                <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus-within:border-gray-300 focus-within:bg-white">
                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={1}
                        disabled={!activeConversation || isSending}
                        placeholder={
                            activeConversation
                                ? t(MESSAGE_COMPOSER_TEXT.PLACEHOLDER_ACTIVE)
                                : t(MESSAGE_COMPOSER_TEXT.PLACEHOLDER_INACTIVE)
                        }
                        className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                e.currentTarget.form?.requestSubmit()
                            }
                        }}
                        onFocus={onComposerFocus}
                    />

                    <button
                        type="submit"
                        disabled={!activeConversation || !draft.trim() || isSending}
                        className="mb-0.5 shrink-0 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                    >
                        {t(MESSAGE_COMPOSER_TEXT.SEND_BUTTON)}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default MessageThread
