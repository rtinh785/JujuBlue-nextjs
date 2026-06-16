import { msg } from '@lingui/core/macro'

export const PROFILE_TAB = {
    POSTS: 'posts',
    FOLLOWING: 'following',
} as const

export const PROFILE_TAB_LABEL = {
    POSTS: msg`Bài viết`,
    FOLLOWING: msg`Đang theo dõi`,
} as const

export const PROFILE_ACTION_LABEL = {
    FOLLOW: msg`Theo dõi`,
    UNFOLLOW: msg`Bỏ theo dõi`,
    MESSAGE: msg`Nhắn tin`,
    EDIT_PROFILE: msg`Chỉnh sửa hồ sơ`,
    CANCEL: msg`Huỷ`,
    SAVE_CHANGES: msg`Lưu thay đổi`,
    SAVING: msg`Đang lưu...`,
} as const

export const PROFILE_TEXT = {
    AVATAR_ALT: msg`Ảnh đại diện`,
    COVER_PREVIEW_ALT: msg`Xem trước ảnh bìa`,
    CHANGE_COVER_PHOTO: msg`Thay đổi ảnh bìa`,

    POSTS_EMPTY_TITLE: msg`Chưa có bài viết nào`,
    POSTS_EMPTY_DESCRIPTION: msg`Các bài viết của người dùng này sẽ xuất hiện ở đây.`,

    FOLLOWING_EMPTY_TITLE: msg`Chưa theo dõi ai`,
    FOLLOWING_EMPTY_DESCRIPTION: msg`Những người bạn theo dõi sẽ xuất hiện ở đây.`,

    UNFOLLOW_TARGET_FALLBACK: msg`người dùng này`,

    EDIT_DIALOG_TITLE: msg`Chỉnh sửa hồ sơ`,
    EDIT_DIALOG_DESCRIPTION: msg`Cập nhật thông tin cơ bản hiển thị trên hồ sơ của bạn.`,

    DISPLAY_NAME_LABEL: msg`Tên hiển thị`,
    DISPLAY_NAME_PLACEHOLDER: msg`Nhập tên hiển thị`,

    BIO_LABEL: msg`Tiểu sử`,
    BIO_PLACEHOLDER: msg`Viết một đoạn giới thiệu ngắn về bản thân`,

    LOCATION_LABEL: msg`Địa điểm`,
    LOCATION_PLACEHOLDER: msg`Thành phố Hồ Chí Minh`,

    DATE_OF_BIRTH_LABEL: msg`Ngày sinh`,

    WEBSITE_LABEL: msg`Website`,
    WEBSITE_PLACEHOLDER: 'https://example.com',

    AVATAR_DIALOG_TITLE: msg`Chọn ảnh đại diện`,
} as const

export const PROFILE_DIALOG = {
    UNFOLLOW_TITLE_PREFIX: msg`Bỏ theo dõi`,
    UNFOLLOW_DESCRIPTION: msg`Bạn sẽ không còn thấy người dùng này trong danh sách đang theo dõi.`,
    UNFOLLOW_CONFIRM: msg`Bỏ theo dõi`,
    UNFOLLOW_LOADING: msg`Đang bỏ theo dõi...`,
} as const

export const PROFILE_VALIDATION_MESSAGE = {
    DISPLAY_NAME_REQUIRED: msg`Tên hiển thị là bắt buộc`,
    DISPLAY_NAME_MAX: msg`Tên hiển thị không được vượt quá 50 ký tự`,
    BIO_MAX: msg`Tiểu sử không được vượt quá 160 ký tự`,
    LOCATION_MAX: msg`Địa điểm không được vượt quá 80 ký tự`,
    WEBSITE_INVALID: msg`URL phải có dạng https://www.example.com`,
} as const

export const PROFILE_UPLOAD = {
    MAX_IMAGE_SIZE_BYTES: 2 * 1024 * 1024,

    INVALID_IMAGE_TYPE: msg`Vui lòng chọn tệp hình ảnh.`,
    IMAGE_TOO_LARGE: msg`Hình ảnh phải nhỏ hơn 2MB.`,
    CANVAS_CREATE_FAILED: msg`Không thể tạo canvas.`,
    IMAGE_BLOB_CREATE_FAILED: msg`Không thể tạo dữ liệu hình ảnh.`,

    DEFAULT_AVATAR_FILE_NAME: 'avatar.jpg',
    AVATAR_MIME_TYPE: 'image/jpeg',
} as const
