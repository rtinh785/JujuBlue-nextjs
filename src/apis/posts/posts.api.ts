import http from '@/apis/axios'

const postsApi = {
    createPost(body: { content?: string; media?: unknown[] | null; visibility: 'public' | 'followers' | 'private' }) {
        return http.post('posts', body)
    },
    getFeed() {
        return http.get('posts/feed')
    },
    getProfilePosts(userId: string) {
        return http.get(`posts/profile/${userId}`)
    },
}

export default postsApi
