export const MESSAGE_QUERY = {
    CONVERSATIONS_LIMIT: 20,
    MESSAGES_INITIAL_LIMIT: 20,
    MESSAGES_LOAD_MORE_LIMIT: 20,
} as const

export const MESSAGE_SOCKET_EVENT = {
    NEW_MESSAGE: 'message:new',
    CONVERSATION_UPDATED: 'conversation:updated',
    UNREAD_COUNT_UPDATED: 'messages:unread-count-updated',
} as const
