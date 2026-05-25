import http from '@/apis/axios'
import { UploadMediaRes } from '@/core/types/media.type'
import {
    CreateCommentReq,
    CreateCommentRes,
    DeletePostRes,
    FeedPosts,
    GetFeedPostsRes,
    GetCommentsRes,
    GetPostByIdRes,
    GetPostCountsRes,
    GetProfilePostsRes,
    MessPostRes,
    SharePostReq,
    SharePostRes,
    UpdatePostReq,
    UpdatePostRes,
    GetTrendingPostsRes,
} from '@/core/types/post.type'

const postsApi = {
    createPost(body: { content?: string; media?: unknown[] | null; visibility: 'public' | 'followers' | 'private' }) {
        return http.post('posts', body)
    },
    updatePost(postId: string, body: UpdatePostReq) {
        return http.patch<UpdatePostRes>(`posts/${postId}`, body)
    },
    deletePost(postId: string) {
        return http.delete<DeletePostRes>(`posts/${postId}`)
    },
    getFeed(params?: { limit?: number; cursor?: string | null }) {
        const searchParams = new URLSearchParams()

        if (params?.limit) {
            searchParams.set('limit', String(params.limit))
        }

        if (params?.cursor) {
            searchParams.set('cursor', params.cursor)
        }

        const queryString = searchParams.toString()

        return http.get<GetFeedPostsRes>(`posts/feed${queryString ? `?${queryString}` : ''}`)
    },
    getPostById(postId: string) {
        return http.get<GetPostByIdRes>(`posts/${postId}`)
    },
    getProfilePosts(userId: string) {
        return http.get<GetProfilePostsRes>(`posts/profile/${userId}`)
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
        return http.post<MessPostRes>(`posts/${postId}/like`)
    },
    unlikePost(postId: string) {
        return http.delete<MessPostRes>(`posts/${postId}/like`)
    },
    bookmarkPost(postId: string) {
        return http.post<MessPostRes>(`posts/${postId}/bookmark`)
    },

    unBookmarkPost(postId: string) {
        return http.delete<MessPostRes>(`posts/${postId}/bookmark`)
    },
    getPostCounts() {
        return http.get<GetPostCountsRes>('posts/counts')
    },
    getBookmarks() {
        return http.get<FeedPosts>('posts/bookmark')
    },
    getComments(postId: string) {
        return http.get<GetCommentsRes>(`posts/${postId}/comments`)
    },

    createComment(postId: string, body: CreateCommentReq) {
        return http.post<CreateCommentRes>(`posts/${postId}/comments`, body)
    },
    sharePost(postId: string, body: SharePostReq) {
        return http.post<SharePostRes>(`posts/${postId}/share`, body)
    },
    getTrendingPosts() {
        return http.get<GetTrendingPostsRes>('posts/trending')
    },
}

export default postsApi
