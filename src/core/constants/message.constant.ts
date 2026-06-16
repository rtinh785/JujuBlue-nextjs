import { msg } from '@lingui/core/macro'

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

export const CONVERSATIONS_SIDEBAR_TEXT = {
    TITLE: msg`Tin nhắn`,
    SUBTITLE: msg`Những người bạn đã trò chuyện`,

    LOADING: msg`Đang tải cuộc trò chuyện...`,
    EMPTY_TITLE: msg`Chưa có cuộc trò chuyện nào`,
    EMPTY_SUBTITLE: msg`Mở trang cá nhân của ai đó và bắt đầu nhắn tin.`,

    LOAD_MORE: msg`Đang tải thêm cuộc trò chuyện...`,
} as const

export const MESSAGE_THREAD_TEXT = {
    BACK_ARIA_LABEL: msg`Quay lại danh sách hội thoại`,

    SELECT_CONVERSATION: msg`Chọn một cuộc trò chuyện`,
    SELECT_CONVERSATION_HINT: msg`Tin nhắn của bạn sẽ hiển thị ở đây`,

    LOADING_MESSAGES: msg`Đang tải tin nhắn...`,
    LOADING_OLDER_MESSAGES: msg`Đang tải tin nhắn cũ hơn...`,

    EMPTY_TITLE: msg`Chưa có tin nhắn nào`,
    EMPTY_SUBTITLE: msg`Hãy gửi tin nhắn đầu tiên bên dưới.`,
} as const

export const MESSAGE_COMPOSER_TEXT = {
    PLACEHOLDER_ACTIVE: msg`Viết tin nhắn...`,
    PLACEHOLDER_INACTIVE: msg`Chọn một cuộc trò chuyện trước`,

    SEND_BUTTON: msg`Gửi`,
} as const
