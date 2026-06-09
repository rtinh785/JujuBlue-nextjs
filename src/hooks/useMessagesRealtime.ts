'use client'

import { appendMessageInCache, upsertConversationInCache } from '@/apis/messages/messages.cache'
import { messagesKeys } from '@/apis/messages/messages.key'
import { envConfig } from '@/core/configs/env.config'
import { MESSAGE_SOCKET_EVENT } from '@/core/constants/message.constant'
import type { ConversationItem, MessageItem } from '@/core/types/message.type'
import { getAccesTokenFromLS } from '@/utils/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

type MessageSocketPayload = {
    message: MessageItem
}

type ConversationSocketPayload = {
    conversation: ConversationItem
}

type UnreadCountSocketPayload = {
    unreadCount: number
}

export const useMessagesRealtime = (enabled = true) => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const token = getAccesTokenFromLS()

        if (!enabled || !token) return

        const socket = io(envConfig.API_URL, {
            auth: {
                token,
            },
            transports: ['websocket'],
        })

        socket.on(MESSAGE_SOCKET_EVENT.NEW_MESSAGE, (payload: MessageSocketPayload) => {
            const conversationId = payload.message.conversation_id

            queryClient.setQueryData(messagesKeys.conversationMessages(conversationId), (oldData) =>
                appendMessageInCache(oldData, payload.message),
            )
        })

        socket.on(MESSAGE_SOCKET_EVENT.CONVERSATION_UPDATED, (payload: ConversationSocketPayload) => {
            queryClient.setQueryData(messagesKeys.conversations(), (oldData) =>
                upsertConversationInCache(oldData, payload.conversation),
            )
        })

        socket.on(MESSAGE_SOCKET_EVENT.UNREAD_COUNT_UPDATED, (payload: UnreadCountSocketPayload) => {
            queryClient.setQueryData(messagesKeys.unreadCount(), payload.unreadCount)
        })

        return () => {
            socket.disconnect()
        }
    }, [enabled, queryClient])
}
