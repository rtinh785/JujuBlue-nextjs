import type { ConversationItem } from '@/core/types/message.type'

export const getConversationName = (conversation: ConversationItem) => {
    return conversation.other_user?.display_name || conversation.other_user?.username || 'Unknown user'
}

export const getConversationPreview = (conversation: ConversationItem) => {
    return conversation.last_message?.content || 'No messages yet'
}

export const formatMessageTime = (createdAt: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(createdAt))
}
