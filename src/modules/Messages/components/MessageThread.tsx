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
        <section className="flex min-h-0 w-full flex-col bg-slate-50 lg:h-full">
            <div className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-5">
                <Link
                    href={ROUTE.MESSAGES}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 lg:hidden"
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
                    <p className="text-sm font-medium text-slate-500">{t(MESSAGE_THREAD_TEXT.SELECT_CONVERSATION)}</p>
                )}
            </div>

            <div
                ref={messagesListRef}
                onScroll={onMessagesScroll}
                onClick={onMessagesClick}
                className="min-h-0 flex-1 overflow-y-auto p-5"
            >
                {isLoading ? (
                    <p className="text-sm text-slate-500">{t(MESSAGE_THREAD_TEXT.LOADING_MESSAGES)}</p>
                ) : activeConversation ? (
                    messages.length > 0 ? (
                        <div className="flex min-h-full flex-col justify-end gap-3">
                            {hasNextPage ? (
                                <div className="flex justify-center py-2">
                                    <span className="text-xs text-slate-400">
                                        {isFetchingNextPage ? t(MESSAGE_THREAD_TEXT.LOADING_OLDER_MESSAGES) : ''}
                                    </span>
                                </div>
                            ) : null}

                            {messages.map((message) => {
                                const isMine = message.sender_id === currentUserId

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
                                <p className="text-sm font-medium text-slate-700">
                                    {t(MESSAGE_THREAD_TEXT.EMPTY_TITLE)}
                                </p>
                                <p className="mt-1 text-sm text-slate-400">{t(MESSAGE_THREAD_TEXT.EMPTY_SUBTITLE)}</p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex h-full items-center justify-center text-center">
                        <div>
                            <p className="text-sm font-medium text-slate-700">
                                {t(MESSAGE_THREAD_TEXT.SELECT_CONVERSATION)}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                                {t(MESSAGE_THREAD_TEXT.SELECT_CONVERSATION_HINT)}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-4">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={1}
                        disabled={!activeConversation || isSending}
                        placeholder={
                            activeConversation
                                ? t(MESSAGE_COMPOSER_TEXT.PLACEHOLDER_ACTIVE)
                                : t(MESSAGE_COMPOSER_TEXT.PLACEHOLDER_INACTIVE)
                        }
                        className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault()
                                event.currentTarget.form?.requestSubmit()
                            }
                        }}
                        onFocus={onComposerFocus}
                    />

                    <button
                        type="submit"
                        disabled={!activeConversation || !draft.trim() || isSending}
                        className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        {t(MESSAGE_COMPOSER_TEXT.SEND_BUTTON)}
                    </button>
                </div>
            </form>
        </section>
    )
}

export default MessageThread
