import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { InfiniteData, QueryClient, QueryKey } from '@tanstack/react-query'
import { searchKeys } from '@/apis/search/search.key'
import { FEED_QUERY } from '@/core/constants/post.constant'
import {
    CreateCommentReq,
    GetFeedPostsRes,
    PostWithStatus,
    SharePostReq,
    UpdatePostReq,
    UpdatePostRes,
} from '@/core/types/post.type'
import postsApi from './posts.api'
import { postsKeys } from './posts.key'

type FeedInfiniteData = InfiniteData<GetFeedPostsRes, string | null>

const invalidateQueries = (queryClient: QueryClient, queryKeys: QueryKey[]) => {
    queryKeys.forEach((queryKey) => {
        void queryClient.invalidateQueries({ queryKey })
    })
}

const invalidateFeedCaches = (queryClient: QueryClient) => {
    invalidateQueries(queryClient, [postsKeys.feed(), postsKeys.feedInfinite()])
}

const invalidateCommonPostCaches = (queryClient: QueryClient) => {
    invalidateQueries(queryClient, [postsKeys.trending(), postsKeys.profileAll(), postsKeys.postCounts()])
}

const invalidatePostDetail = (queryClient: QueryClient, postId?: string) => {
    if (!postId) return

    void queryClient.invalidateQueries({ queryKey: postsKeys.detail(postId) })
}

const updatePostLikeStatus = (post: PostWithStatus, postId: string, isLiked: boolean) => {
    if (post.id !== postId) return post
    if (post.is_liked === isLiked) return post

    return {
        ...post,
        is_liked: isLiked,
        likes_count: Math.max(post.likes_count + (isLiked ? 1 : -1), 0),
    }
}

const updatePostsListLikeStatus = (posts: PostWithStatus[], postId: string, isLiked: boolean) => {
    return posts.map((post) => updatePostLikeStatus(post, postId, isLiked))
}

const updateInfiniteFeedLikeStatus = (queryClient: QueryClient, postId: string, isLiked: boolean) => {
    queryClient.setQueryData<FeedInfiniteData>(postsKeys.feedInfinite(), (oldData) => {
        if (!oldData) return oldData

        return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
                ...page,
                posts: updatePostsListLikeStatus(page.posts, postId, isLiked),
            })),
        }
    })
}

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.createPost,
        onSuccess: () => {
            invalidateFeedCaches(queryClient)
            invalidateCommonPostCaches(queryClient)
            void queryClient.invalidateQueries({ queryKey: searchKeys.all() })
        },
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ postId, body }: { postId: string; body: UpdatePostReq; rootPostId?: string }) => {
            const res = await postsApi.updatePost(postId, body)
            return res.data.post
        },
        onSuccess: (_updatedPost: UpdatePostRes['post'], variables) => {
            invalidateFeedCaches(queryClient)
            invalidateQueries(queryClient, [
                postsKeys.trending(),
                postsKeys.bookmarks(),
                postsKeys.profileAll(),
                postsKeys.detail(variables.postId),
            ])

            if (variables.rootPostId) {
                void queryClient.invalidateQueries({ queryKey: postsKeys.comments(variables.rootPostId) })
            }
        },
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId }: { postId: string; rootPostId?: string }) => postsApi.deletePost(postId),
        onSuccess: (_res, variables) => {
            invalidateFeedCaches(queryClient)
            invalidateQueries(queryClient, [postsKeys.trending(), postsKeys.bookmarks(), postsKeys.profileAll()])
            void queryClient.invalidateQueries({ queryKey: postsKeys.postCounts() })

            if (variables.rootPostId) {
                invalidateQueries(queryClient, [
                    postsKeys.comments(variables.rootPostId),
                    postsKeys.detail(variables.rootPostId),
                ])
            }
        },
    })
}

export const useFeedPosts = () => {
    return useQuery({
        queryKey: postsKeys.feed(),
        queryFn: async () => {
            const res = await postsApi.getFeed()
            return res.data.posts
        },
        staleTime: 0,
    })
}

export const useTrendingPosts = () => {
    return useQuery({
        queryKey: postsKeys.trending(),
        queryFn: async () => {
            const res = await postsApi.getTrendingPosts()
            return res.data.posts
        },
    })
}

export const useInfiniteFeedPosts = () => {
    return useInfiniteQuery({
        queryKey: postsKeys.feedInfinite(),
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam }) => {
            const res = await postsApi.getFeed({
                limit: pageParam ? FEED_QUERY.LOAD_MORE_LIMIT : FEED_QUERY.INITIAL_LIMIT,
                cursor: pageParam,
            })

            return res.data
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined
        },
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
        staleTime: 1000 * 60 * 5,
    })
}

export const useUploadPostMedia = () => {
    return useMutation({
        mutationFn: postsApi.uploadMedia,
    })
}

export const usePostById = (postId?: string) => {
    return useQuery({
        queryKey: postsKeys.detail(postId ?? ''),
        queryFn: async () => {
            const res = await postsApi.getPostById(postId ?? '')
            return res.data.post
        },
        enabled: !!postId,
    })
}

export const useLikePost = (commentPostId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.likePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: postsKeys.all() })

            const previousFeedInfinite = queryClient.getQueryData<FeedInfiniteData>(postsKeys.feedInfinite())
            updateInfiniteFeedLikeStatus(queryClient, postId, true)

            return {
                previousFeedInfinite,
            }
        },
        onError: (_error, _postId, context) => {
            queryClient.setQueryData(postsKeys.feedInfinite(), context?.previousFeedInfinite)
        },
        onSettled: (_data, _error, postId) => {
            void queryClient.invalidateQueries({ queryKey: postsKeys.trending() })
            invalidatePostDetail(queryClient, postId)

            if (commentPostId) {
                void queryClient.invalidateQueries({ queryKey: postsKeys.comments(commentPostId) })
            }
        },
    })
}

export const useUnlikePost = (commentPostId?: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.unlikePost,
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: postsKeys.all() })

            const previousFeedInfinite = queryClient.getQueryData<FeedInfiniteData>(postsKeys.feedInfinite())
            updateInfiniteFeedLikeStatus(queryClient, postId, false)

            return {
                previousFeedInfinite,
            }
        },
        onError: (_error, _postId, context) => {
            queryClient.setQueryData(postsKeys.feedInfinite(), context?.previousFeedInfinite)
        },
        onSettled: (_data, _error, postId) => {
            void queryClient.invalidateQueries({ queryKey: postsKeys.trending() })
            invalidatePostDetail(queryClient, postId)

            if (commentPostId) {
                void queryClient.invalidateQueries({ queryKey: postsKeys.comments(commentPostId) })
            }
        },
    })
}

export const useBookmarkPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.bookmarkPost,
        onSuccess: (_res, postId) => {
            invalidateFeedCaches(queryClient)
            invalidateQueries(queryClient, [postsKeys.bookmarks(), postsKeys.profileAll(), postsKeys.detail(postId)])
        },
    })
}

export const useUnbookmarkPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.unBookmarkPost,
        onSuccess: (_res, postId) => {
            invalidateFeedCaches(queryClient)
            invalidateQueries(queryClient, [postsKeys.bookmarks(), postsKeys.profileAll(), postsKeys.detail(postId)])
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
        onSuccess: () => {
            invalidateQueries(queryClient, [
                postsKeys.comments(postId ?? ''),
                postsKeys.trending(),
                postsKeys.bookmarks(),
                postsKeys.profileAll(),
                postsKeys.detail(postId ?? ''),
            ])
            invalidateFeedCaches(queryClient)
        },
    })
}

export const useSharePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, body }: { postId: string; body: SharePostReq }) => postsApi.sharePost(postId, body),
        onSuccess: (_res, variables) => {
            invalidateQueries(queryClient, [
                postsKeys.profileAll(),
                postsKeys.postCounts(),
                postsKeys.detail(variables.postId),
            ])
        },
    })
}
