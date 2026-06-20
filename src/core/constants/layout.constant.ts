import { msg } from '@lingui/core/macro'

export const LAYOUT_ASSET = {
    LOGO: '/images/svg/logo-new.svg',
    MENU: '/images/svg/bar-menu.svg',
    CLOSE: '/images/svg/x.svg',
    HOME: '/images/svg/home.svg',
    MESSAGE: '/images/svg/message.svg',
    LOG_OUT: '/images/svg/log-out.svg',
    SEARCH: '/images/svg/search.svg',
} as const

export const LAYOUT_ALT = {
    LOGO: 'Juju Blue Logo',
    AVATAR: 'Avatar',
    OPEN_MENU: 'Open menu',
    CLOSE: 'Close',
    HOME: 'Home',
    MESSAGES: 'Messages',
    SIGN_OUT: 'Sign out',
    SEARCH: 'Search',
} as const

export const NAV_LABEL = {
    NAVIGATION_TITLE: msg`Điều hướng`,
    MENU_SECTION: msg`Menu`,
    SETTINGS_SECTION: msg`Cài đặt`,
    MY_ACCOUNT: msg`Tài khoản của tôi`,
    VIEW_PROFILE: msg`Xem hồ sơ`,
    PROFILE: msg`Hồ sơ`,
    LANGUAGE: msg`Ngôn ngữ`,
    HOME: msg`Trang chủ`,
    MESSAGES: msg`Tin nhắn`,
    SIGN_OUT: msg`Đăng xuất`,
    SIGN_UP: msg`Đăng ký`,
    LOG_IN: msg`Đăng nhập`,
    SEARCH_PLACEHOLDER: msg`Tìm kiếm`,
    TOGGLE_LANGUAGE: msg`Tiếng Việt`,
} as const

export const ASIDE_TEXT = {
    TERMS: msg`Điều khoản - Quyền riêng tư - Cookies`,
    COPYRIGHT: msg`(c) 2024 Juju Blue`,
    WHO_TO_FOLLOW: msg`Gợi ý theo dõi`,
    TRENDING: msg`Xu hướng`,
    TRENDING_DESCRIPTION: msg`Các bài viết phổ biến bạn có thể mở`,
    SHOW_MORE: msg`Xem thêm`,
} as const

export const ASIDE_STAT_LABEL = {
    FOLLOWING: msg`Đang theo dõi`,
    FOLLOWERS: msg`Người theo dõi`,
    POSTS: msg`Bài viết`,
} as const

export const ASIDE_ACTION_LABEL = {
    FOLLOW: msg`Theo dõi`,
} as const
