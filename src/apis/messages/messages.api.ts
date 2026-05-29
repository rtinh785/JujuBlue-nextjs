import http from '@/apis/axios'
import {
    CreateConversationResponse,
    GetConversationsResponse,
    GetMessagesResponse,
    MarkConversationReadResponse,
    SendMessageResponse,
    UnreadMessagesCountResponse,
} from '@/core/types/message.type'

type MessageListParams = {
    cursor?: string | null
    limit?: number
}

const buildQueryString = (params?: MessageListParams) => {
    const searchParams = new URLSearchParams()

    if (params?.cursor) {
        searchParams.set('cursor', params.cursor)
    }

    if (params?.limit) {
        searchParams.set('limit', String(params.limit))
    }

    const queryString = searchParams.toString()

    return queryString ? `?${queryString}` : ''
}

const messagesApi = {
    getConversations(params?: MessageListParams) {
        return http.get<GetConversationsResponse>(`messages/conversations${buildQueryString(params)}`)
    },

    getUnreadCount() {
        return http.get<UnreadMessagesCountResponse>('messages/unread-count')
    },

    createOrGetConversation(receiverId: string) {
        return http.post<CreateConversationResponse>('messages/conversations', {
            receiverId,
        })
    },

    getMessages(conversationId: string, params?: MessageListParams) {
        return http.get<GetMessagesResponse>(
            `messages/conversations/${conversationId}/messages${buildQueryString(params)}`,
        )
    },

    sendMessage(conversationId: string, content: string) {
        return http.post<SendMessageResponse>(`messages/conversations/${conversationId}/messages`, {
            content,
        })
    },

    markConversationRead(conversationId: string) {
        return http.patch<MarkConversationReadResponse>(`messages/conversations/${conversationId}/read`)
    },
}

export default messagesApi
