import { msg } from '@lingui/core/macro'

export const BOOKMARK_TEXT = {
    PAGE_TITLE: msg`Đã lưu`,
    PAGE_DESCRIPTION: msg`Các bài viết bạn đã đánh dấu lưu.`,
    EMPTY_POST_CONTENT: msg`Bài viết này không có nội dung`,
    POST_TYPE_LABEL: msg`Bài viết`,
    SAVED_FROM_AUTHOR_PREFIX: msg`Được lưu từ bài viết của`,
} as const

export const BOOKMARK_DIALOG = {
    REMOVE_TITLE: msg`Xoá bookmark?`,
    REMOVE_DESCRIPTION: msg`Bài viết này sẽ bị xoá khỏi danh sách đã lưu.`,
    REMOVE_CONFIRM: msg`Xoá bookmark`,
    REMOVE_LOADING: msg`Đang xoá...`,
} as const
