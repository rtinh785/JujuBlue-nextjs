'use client'

import { messagesKeys } from '@/apis/messages/messages.key'
import { envConfig } from '@/core/configs/env.config'
import { MESSAGE_SOCKET_EVENT } from '@/core/constants/message.constant'
import { getAccesTokenFromLS } from '@/utils/auth'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { io } from 'socket.io-client'

type MessageSocketPayload = {
    message: {
        id: string
        conversation_id: string
        sender_id: string
        content: string
        created_at: string
    }
    conversation: {
        id: string
    }
}

type ConversationSocketPayload = {
    conversation: {
        id: string
    }
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

        const refreshConversationData = async (conversationId?: string) => {
            await queryClient.invalidateQueries({
                queryKey: messagesKeys.conversations(),
            })

            await queryClient.invalidateQueries({
                queryKey: messagesKeys.unreadCount(),
            })

            if (conversationId) {
                await queryClient.invalidateQueries({
                    queryKey: messagesKeys.conversationMessages(conversationId),
                })
            }
        }

        socket.on(MESSAGE_SOCKET_EVENT.NEW_MESSAGE, (payload: MessageSocketPayload) => {
            void refreshConversationData(payload.conversation.id)
        })

        socket.on(MESSAGE_SOCKET_EVENT.CONVERSATION_UPDATED, (payload: ConversationSocketPayload) => {
            void refreshConversationData(payload.conversation.id)
        })

        socket.on(MESSAGE_SOCKET_EVENT.UNREAD_COUNT_UPDATED, (payload: UnreadCountSocketPayload) => {
            queryClient.setQueryData(messagesKeys.unreadCount(), payload.unreadCount)
        })

        return () => {
            socket.disconnect()
        }
    }, [enabled, queryClient])
}
