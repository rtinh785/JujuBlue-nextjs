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
    POSTS: '/posts',
} as const

export const ROUTE_BUILDER = {
    profileDetail: (userId: string) => `${ROUTE.PROFILE}/${userId}`,
    postDetail: (postId: string) => `${ROUTE.POSTS}/${postId}`,
} as const
