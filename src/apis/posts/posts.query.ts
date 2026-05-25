import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import postsApi from './posts.api'
import { postsKeys } from './posts.key'
import { CreateCommentReq, SharePostReq, UpdatePostReq } from '@/core/types/post.type'
import { FEED_QUERY } from '@/core/constants/post.constant'

export const useCreatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.createPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.feedInfinite() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.trending() })

            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })

            await queryClient.invalidateQueries({ queryKey: postsKeys.postCounts() })
        },
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, body }: { postId: string; body: UpdatePostReq; rootPostId?: string }) =>
            postsApi.updatePost(postId, body),
        onSuccess: async (_res, variables) => {
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feed(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feedInfinite(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.trending(),
            })

            await queryClient.invalidateQueries({
                queryKey: postsKeys.bookmarks(),
            })

            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.detail(variables.postId),
            })
            if (variables.rootPostId) {
                await queryClient.invalidateQueries({
                    queryKey: postsKeys.comments(variables.rootPostId),
                })
            }
        },
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId }: { postId: string; rootPostId?: string }) => postsApi.deletePost(postId),
        onSuccess: async (_res, variables) => {
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feed(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feedInfinite(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.trending(),
            })

            await queryClient.invalidateQueries({
                queryKey: postsKeys.bookmarks(),
            })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.postCounts(),
            })

            if (variables.rootPostId) {
                await queryClient.invalidateQueries({
                    queryKey: postsKeys.comments(variables.rootPostId),
                })
                await queryClient.invalidateQueries({
                    queryKey: postsKeys.detail(variables.rootPostId),
                })
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
        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: postsKeys.feed(),
            })
            await queryClient.refetchQueries({
                queryKey: postsKeys.feedInfinite(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.trending(),
            })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'detail'],
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
            await queryClient.refetchQueries({
                queryKey: postsKeys.feedInfinite(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.trending(),
            })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'detail'],
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
            await queryClient.invalidateQueries({ queryKey: postsKeys.feedInfinite() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.bookmarks() })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'detail'],
            })
        },
    })
}

export const useUnbookmarkPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postsApi.unBookmarkPost,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: postsKeys.feed() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.feedInfinite() })
            await queryClient.invalidateQueries({ queryKey: postsKeys.bookmarks() })
            await queryClient.invalidateQueries({ queryKey: ['posts', 'profile'] })
            await queryClient.invalidateQueries({
                queryKey: ['posts', 'detail'],
            })
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
                queryKey: postsKeys.feedInfinite(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.trending(),
            })

            await queryClient.invalidateQueries({
                queryKey: postsKeys.bookmarks(),
            })

            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.detail(postId ?? ''),
            })
        },
    })
}

export const useSharePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, body }: { postId: string; body: SharePostReq }) => postsApi.sharePost(postId, body),
        onSuccess: async (_res, variables) => {
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feed(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.feedInfinite(),
            })
            await queryClient.invalidateQueries({
                queryKey: postsKeys.trending(),
            })

            await queryClient.invalidateQueries({
                queryKey: ['posts', 'profile'],
            })

            await queryClient.invalidateQueries({
                queryKey: postsKeys.postCounts(),
            })

            await queryClient.invalidateQueries({
                queryKey: postsKeys.bookmarks(),
            })

            await queryClient.invalidateQueries({
                queryKey: postsKeys.detail(variables.postId),
            })
        },
    })
}
