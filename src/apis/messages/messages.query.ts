import { MESSAGE_QUERY } from '@/core/constants/message.constant'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import messagesApi from './messages.api'
import { messagesKeys } from './messages.key'

export const useInfiniteConversations = (enabled = true) => {
    return useInfiniteQuery({
        queryKey: messagesKeys.conversations(),
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam }) => {
            const res = await messagesApi.getConversations({
                cursor: pageParam,
                limit: MESSAGE_QUERY.CONVERSATIONS_LIMIT,
            })

            return res.data
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined
        },
        enabled,
    })
}

export const useInfiniteMessages = (conversationId?: string) => {
    return useInfiniteQuery({
        queryKey: messagesKeys.conversationMessages(conversationId ?? ''),
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam }) => {
            const res = await messagesApi.getMessages(conversationId ?? '', {
                cursor: pageParam,
                limit: pageParam ? MESSAGE_QUERY.MESSAGES_LOAD_MORE_LIMIT : MESSAGE_QUERY.MESSAGES_INITIAL_LIMIT,
            })

            return res.data
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined
        },
        enabled: !!conversationId,
    })
}

export const useUnreadMessagesCount = (enabled = true) => {
    return useQuery({
        queryKey: messagesKeys.unreadCount(),
        queryFn: async () => {
            const res = await messagesApi.getUnreadCount()

            return res.data.unreadCount
        },
        enabled,
    })
}

export const useCreateOrGetConversation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: messagesApi.createOrGetConversation,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() })
        },
    })
}

export const useSendMessage = (conversationId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (content: string) => messagesApi.sendMessage(conversationId ?? '', content),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() })

            if (conversationId) {
                await queryClient.invalidateQueries({
                    queryKey: messagesKeys.conversationMessages(conversationId),
                })
            }

            await queryClient.invalidateQueries({ queryKey: messagesKeys.unreadCount() })
        },
    })
}

export const useMarkConversationRead = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: messagesApi.markConversationRead,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: messagesKeys.conversations() })
            await queryClient.invalidateQueries({ queryKey: messagesKeys.unreadCount() })
        },
    })
}
