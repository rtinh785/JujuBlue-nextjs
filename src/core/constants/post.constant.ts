
import { msg } from '@lingui/core/macro'


export const POST_VISIBILITY = {
    PUBLIC: 'public',
    FOLLOWERS: 'followers',
    PRIVATE: 'private',
} as const

export type PostVisibility = (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY]

export const POST_VISIBILITY_LABEL = {
    [POST_VISIBILITY.PUBLIC]: msg`Công khai`,
    [POST_VISIBILITY.FOLLOWERS]: msg`Người theo dõi`,
    [POST_VISIBILITY.PRIVATE]: msg`Chỉ mình tôi`,
} as const

export const POST_VISIBILITY_DESCRIPTION = {
    [POST_VISIBILITY.PUBLIC]: msg`Tất cả mọi người đều có thể xem bài viết này.`,
    [POST_VISIBILITY.FOLLOWERS]: msg`Chỉ những người theo dõi bạn mới có thể xem bài viết này.`,
    [POST_VISIBILITY.PRIVATE]: msg`Chỉ bạn mới có thể xem bài viết này.`,
} as const

export const POST_VISIBILITY_VALUES = [
    POST_VISIBILITY.PUBLIC,
    POST_VISIBILITY.FOLLOWERS,
    POST_VISIBILITY.PRIVATE,
] as const

export const POST_TEXT = {
    EDIT_MEDIA_ALT: msg`Chỉnh sửa phương tiện`,
    MEDIA_PREVIEW_ALT: msg`Xem trước phương tiện`,
    UNKNOWN_AUTHOR: msg`Không xác định`,
    COMPOSER_PLACEHOLDER: msg`Bạn đang nghĩ gì?`,
    SHARE_PLACEHOLDER: msg`Bạn muốn nói gì về bài viết này?`,
    EDIT_DIALOG_TITLE_PREFIX: msg`Chỉnh sửa bài viết của`,
    SHARE_DIALOG_TITLE: msg`Chia sẻ bài viết`,
    DETAIL_TITLE_PREFIX: msg`Bài viết của`,
    MEDIA_ALT: msg`Phương tiện của bài viết`,
    ORIGINAL_POST_UNAVAILABLE_TITLE: msg`Bài viết gốc không còn khả dụng`,
    ORIGINAL_POST_UNAVAILABLE_DESCRIPTION: msg`Nội dung được chia sẻ đã bị xoá hoặc không còn khả dụng.`,
} as const

export const POST_MESSAGE = {
    MISSING_CONTENT_OR_MEDIA: msg`Bài viết phải có nội dung hoặc phương tiện.`,
    SHARE_UNAVAILABLE: msg`Không thể chia sẻ vì bài viết gốc đã bị xoá.`,
} as const

export const COMMENT_TEXT = {
    SECTION_TITLE: msg`Bình luận`,
    PLACEHOLDER: msg`Viết bình luận...`,
    REPLY_PLACEHOLDER_PREFIX: msg`Trả lời`,
    REPLY_FALLBACK_TARGET: msg`bình luận`,
    COMMENT_MEDIA_ALT: msg`Phương tiện của bình luận`,
    REPLY_MEDIA_ALT: msg`Phương tiện của phản hồi`,
    EMPTY_TITLE: msg`Chưa có bình luận nào`,
    EMPTY_DESCRIPTION: msg`Hãy là người đầu tiên bình luận.`,
    LOADING: msg`Đang tải bình luận...`,
} as const

export const COMMENT_DIALOG = {
    DELETE_TITLE: msg`Xoá bình luận?`,
    DELETE_DESCRIPTION: msg`Bình luận này sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`,
    DELETE_CONFIRM: msg`Xoá bình luận`,
    DELETE_LOADING: msg`Đang xoá...`,
} as const

export const POST_DIALOG = {
    DELETE_TITLE: msg`Xoá bài viết?`,
    DELETE_DESCRIPTION: msg`Bài viết này sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.`,
    DELETE_CONFIRM: msg`Xoá bài viết`,
    DELETE_LOADING: msg`Đang xoá...`,
} as const

export const POST_ACTION_LABEL = {
    CANCEL: msg`Huỷ`,
    COMMENT: msg`Bình luận`,
    DELETE: msg`Xoá`,
    EDIT: msg`Chỉnh sửa`,
    POST: msg`Đăng`,
    POSTING: msg`Đang đăng...`,
    SAVE_CHANGES: msg`Lưu thay đổi`,
    SAVING: msg`Đang lưu...`,
    REPLY: msg`Trả lời`,
    SENDING: msg`Đang gửi...`,
    SHARE: msg`Chia sẻ`,
    SHARING: msg`Đang chia sẻ...`,
} as const

export const POST_VALIDATION_MESSAGE = {
    CONTENT_MAX_280: msg`Nội dung không được vượt quá 280 ký tự.`,
    MEDIA_TYPE_INVALID: msg`Chỉ cho phép tệp hình ảnh hoặc video.`,
    POST_CONTENT_OR_MEDIA_REQUIRED: msg`Bài viết phải có nội dung hoặc phương tiện.`,
} as const

export const POST_MEDIA_INPUT = {
    ACCEPT: 'image/*,video/*',
} as const

export const POST_MEDIA_TYPE = {
    IMAGE: 'image',
    VIDEO: 'video',
    IMAGE_PREFIX: 'image/',
    VIDEO_PREFIX: 'video/',
} as const

export const FEED_QUERY = {
    INITIAL_LIMIT: 5,
    LOAD_MORE_LIMIT: 5,
} as const


