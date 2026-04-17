import http from '@/apis/axios'
import { UploadMediaRes } from '@/core/types/media.type'
import { FeedPosts } from '@/core/types/post.type'

const postsApi = {
    createPost(body: { content?: string; media?: unknown[] | null; visibility: 'public' | 'followers' | 'private' }) {
        return http.post('posts', body)
    },
    getFeed() {
        return http.get<FeedPosts>('posts/feed')
    },
    getProfilePosts(userId: string) {
        return http.get(`posts/profile/${userId}`)
    },
    uploadMedia(files: File[]) {
        const formData = new FormData()

        files.forEach((file) => {
            formData.append('files', file)
        })

        return http.post<UploadMediaRes>('posts/upload-media', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    likePost(postId: string) {
        return http.post(`posts/${postId}/like`)
    },

    unlikePost(postId: string) {
        return http.delete(`posts/${postId}/like`)
    },

    bookmarkPost(postId: string) {
        return http.post(`posts/${postId}/bookmark`)
    },

    unBookmarkPost(postId: string) {
        return http.delete(`posts/${postId}/bookmark`)
    },
}

export default postsApi
