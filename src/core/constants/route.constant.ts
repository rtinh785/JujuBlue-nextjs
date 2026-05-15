export const ROUTE = {
    ROOT: '/',
    HOME: '/home',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    PROFILE: '/profile',
    BOOKMARK: '/bookmark',
    MESSAGES: '/messages',
    LANGUAGE: '/#',
} as const

export const ROUTE_BUILDER = {
    profileDetail: (userId: string) => `${ROUTE.PROFILE}/${userId}`,
} as const
