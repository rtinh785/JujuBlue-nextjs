import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import postsApi from './posts.api'
import { postsKeys } from './posts.key'
import { CreateCommentReq } from '@/core/types/post.type'

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.createPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.postCounts() })
        },
    })
}

export const useFeedPosts = () => {
    return useQuery({
        queryKey: postsKeys.feed(),
        queryFn: async () => {
            const res = await postsApi.getFeed()
            return res.data
        },
        staleTime: 0,
    })
}

export const useProfilePosts = (userId?: string) => {
    return useQuery({
        queryKey: postsKeys.profile(userId ?? ''),
        queryFn: async () => {
            const res = await postsApi.getProfilePosts(userId ?? '')
            return res.data.posts
        },
        enabled: !!userId,
    })
}

export const useUploadPostMedia = () => {
    return useMutation({
        mutationFn: postsApi.uploadMedia,
    })
}

export const useLikePost = (commentPostId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.likePost,
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: postsKeys.feed(),
            })

            if (commentPostId) {
                await queryClient.refetchQueries({
                    queryKey: postsKeys.comments(commentPostId),
                })
            }
        },
    })
}

export const useUnlikePost = (commentPostId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.unlikePost,
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: postsKeys.feed(),
            })

            if (commentPostId) {
                await queryClient.refetchQueries({
                    queryKey: postsKeys.comments(commentPostId),
                })
            }
        },
    })
}

export const useBookmarkPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.bookmarkPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.bookmarks() })
        },
    })
}

export const useUnbookmarkPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.unBookmarkPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.bookmarks() })
        },
    })
}

export const useGetPostCounts = () => {
    return useQuery({
        queryKey: postsKeys.postCounts(),
        queryFn: async () => {
            const res = await postsApi.getPostCounts()
            return res.data
        },
        staleTime: 1000 * 60 * 5,
    })
}

export const useBookmarkedPosts = () => {
    return useQuery({
        queryKey: postsKeys.bookmarks(),
        queryFn: async () => {
            const res = await postsApi.getBookmarks()
            return res.data
        },
        staleTime: 0,
        refetchOnMount: 'always',
    })
}

export const useComments = (postId?: string) => {
    return useQuery({
        queryKey: postsKeys.comments(postId ?? ''),
        queryFn: async () => {
            const res = await postsApi.getComments(postId ?? '')
            return res.data.comments
        },
        enabled: !!postId,
    })
}

export const useCreateComment = (postId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (body: CreateCommentReq) => postsApi.createComment(postId ?? '', body),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: postsKeys.comments(postId ?? ''),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feed(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.bookmarks(),
            })
        },
    })
}
