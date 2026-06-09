import type { InfiniteData } from '@tanstack/react-query'
import type {
    ConversationItem,
    GetConversationsResponse,
    GetMessagesResponse,
    MessageItem,
} from '@/core/types/message.type'

type ConversationsInfiniteData = InfiniteData<GetConversationsResponse, string | null>
type MessagesInfiniteData = InfiniteData<GetMessagesResponse, string | null>

export const upsertConversationInCache = (
    oldData: ConversationsInfiniteData | undefined,
    conversation: ConversationItem,
): ConversationsInfiniteData => {
    if (!oldData) {
        return {
            pages: [
                {
                    conversations: [conversation],
                    nextCursor: null,
                    hasMore: false,
                },
            ],
            pageParams: [null],
        }
    }

    const pagesWithoutConversation = oldData.pages.map((page) => ({
        ...page,
        conversations: page.conversations.filter((item) => item.id !== conversation.id),
    }))

    return {
        ...oldData,
        pages: pagesWithoutConversation.map((page, index) =>
            index === 0
                ? {
                      ...page,
                      conversations: [conversation, ...page.conversations],
                  }
                : page,
        ),
    }
}

export const markConversationReadInCache = (
    oldData: ConversationsInfiniteData | undefined,
    conversationId: string,
): ConversationsInfiniteData | undefined => {
    if (!oldData) return oldData

    return {
        ...oldData,
        pages: oldData.pages.map((page) => ({
            ...page,
            conversations: page.conversations.map((conversation) =>
                conversation.id === conversationId
                    ? {
                          ...conversation,
                          has_unread: false,
                      }
                    : conversation,
            ),
        })),
    }
}

export const appendMessageInCache = (
    oldData: MessagesInfiniteData | undefined,
    message: MessageItem,
): MessagesInfiniteData | undefined => {
    if (!oldData) return oldData

    const alreadyExists = oldData.pages.some((page) =>
        page.messages.some((currentMessage) => currentMessage.id === message.id),
    )

    if (alreadyExists) return oldData

    return {
        ...oldData,
        pages: oldData.pages.map((page, index) =>
            index === 0
                ? {
                      ...page,
                      messages: [...page.messages, message],
                  }
                : page,
        ),
    }
}
