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
    SEARCH: '/search',
} as const

export const ROUTE_BUILDER = {
    profileDetail: (userId: string) => `${ROUTE.PROFILE}/${userId}`,
    postDetail: (postId: string) => `${ROUTE.POSTS}/${postId}`,
    search: (keyword: string, type = 'all', sort = 'latest') => {
        const searchParams = new URLSearchParams()

        searchParams.set('q', keyword)
        searchParams.set('type', type)
        searchParams.set('sort', sort)

        return `${ROUTE.SEARCH}?${searchParams.toString()}`
    },
} as const
