'use client'

import type { ConversationItem, MessageItem } from '@/core/types/message.type'
import { cn } from '@/utils/helper'
import type { Dispatch, FormEvent, RefObject, SetStateAction } from 'react'
import { formatMessageTime, getConversationName } from '../utils/messageDisplay'

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
    return (
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

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                // vùng chat cần click để mark read ngay khi user tương tác
                ref={messagesListRef}
                onScroll={onMessagesScroll}
                onClick={onMessagesClick}
                className="min-h-0 flex-1 overflow-y-auto p-5"
            >
                {isLoading ? (
                    <p className="text-sm text-slate-500">Loading messages...</p>
                ) : activeConversation ? (
                    messages.length > 0 ? (
                        <div className="flex min-h-full flex-col justify-end gap-3">
                            {hasNextPage ? (
                                <div className="flex justify-center py-2">
                                    <span className="text-xs text-slate-400">
                                        {isFetchingNextPage ? 'Loading older messages...' : ''}
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

            <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-4">
                <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        rows={1}
                        disabled={!activeConversation || isSending}
                        placeholder={activeConversation ? 'Write a message...' : 'Select a conversation first'}
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
                        Send
                    </button>
                </div>
            </form>
        </section>
    )
}

export default MessageThread
