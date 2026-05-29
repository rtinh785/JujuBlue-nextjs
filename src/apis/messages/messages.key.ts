export const messagesKeys = {
    all: ['messages'] as const,

    conversations: () => [...messagesKeys.all, 'conversations'] as const,

    conversationMessagesRoot: () => [...messagesKeys.all, 'conversation-messages'] as const,

    conversationMessages: (conversationId: string) =>
        [...messagesKeys.conversationMessagesRoot(), conversationId] as const,

    unreadCount: () => [...messagesKeys.all, 'unread-count'] as const,
} as const
