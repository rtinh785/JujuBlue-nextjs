'use client'

import { useSearch } from '@/apis/search/search.query'
import { useCurrentUser } from '@/apis/user/user.query'
import { Skeleton } from '@/components/base/skeleton'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import PostCard from '@/components/post/PostCard'
import { ROUTE, ROUTE_BUILDER } from '@/core/constants/route.constant'
import { PostWithStatus } from '@/core/types/post.type'
import { SearchSort, SearchType, SearchUserItem } from '@/core/types/search.type'
import { getAccesTokenFromLS } from '@/utils/auth'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const SEARCH_TABS: { label: string; value: SearchType }[] = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Bài viết', value: 'posts' },
    { label: 'Mọi người', value: 'users' },
]

const SEARCH_SORTS: { label: string; value: SearchSort }[] = [
    { label: 'Mới nhất', value: 'latest' },
    { label: 'Cũ nhất', value: 'oldest' },
]

const SearchResultsSkeleton = () => (
    <div className="mt-6 space-y-4">
        {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex gap-3">
                    <Skeleton className="size-11 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32 rounded-full" />
                        <Skeleton className="h-3 w-48 rounded-full" />
                    </div>
                </div>
                <Skeleton className="mt-4 h-20 w-full rounded-xl" />
            </div>
        ))}
    </div>
)

const getSearchType = (value: string | null): SearchType => {
    if (value === 'posts' || value === 'users' || value === 'all') return value
    return 'all'
}

const getSearchSort = (value: string | null): SearchSort => {
    if (value === 'oldest' || value === 'latest') return value
    return 'latest'
}

const Search = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const hasAccessToken = !!getAccesTokenFromLS()
    const { data: user, isLoading: isUserLoading } = useCurrentUser()
    const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null)

    const keyword = searchParams.get('q') ?? ''
    const type = getSearchType(searchParams.get('type'))
    const sort = getSearchSort(searchParams.get('sort'))

    const { data, isLoading } = useSearch(
        {
            q: keyword,
            type,
            sort,
        },
        hasAccessToken,
    )

    const posts = data?.posts ?? []
    const users = data?.users ?? []

    const handleChangeType = (nextType: SearchType) => {
        router.push(ROUTE_BUILDER.search(keyword, nextType, sort))
    }

    const handleChangeSort = (nextSort: SearchSort) => {
        router.push(ROUTE_BUILDER.search(keyword, type, nextSort))
    }

    const handleOpenPostDetail = (post: PostWithStatus) => {
        setSelectedPost(post)
    }

    const handleOpenPostComments = (post: PostWithStatus) => {
        setSelectedPost(post)
    }

    if (hasAccessToken && isUserLoading && !user) {
        return (
            <div className="mx-auto w-full max-w-3xl px-4 py-6">
                <p className="text-sm text-slate-500">Checking login status...</p>
            </div>
        )
    }

    if (!hasAccessToken || (!isUserLoading && !user)) {
        return (
            <div className="mx-auto w-full max-w-3xl px-4 py-6">
                <h1 className="text-xl font-semibold text-slate-900">Search</h1>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-900">Please log in to search</p>
                    <p className="mt-1 text-sm text-slate-500">Search is only available for logged-in users.</p>

                    <Link
                        href={ROUTE.LOGIN}
                        className="mt-4 inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                    >
                        Log in
                    </Link>
                </div>
            </div>
        )
    }

    const renderEmpty = (text: string) => (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">{text}</p>
    )

    const renderPosts = () => {
        if (posts.length === 0) return renderEmpty('Không có bài viết phù hợp.')

        return (
            <div className="space-y-4">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        currentUserId={user?.id}
                        onOpenDetail={handleOpenPostDetail}
                        onOpenComments={handleOpenPostComments}
                    />
                ))}
            </div>
        )
    }

    const renderUsers = () => {
        if (users.length === 0) return renderEmpty('Không có người dùng phù hợp.')

        return (
            <div className="space-y-3">
                {users.map((searchUser: SearchUserItem) => (
                    <button
                        key={searchUser.id}
                        type="button"
                        onClick={() => router.push(ROUTE_BUILDER.profileDetail(searchUser.id))}
                        className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:bg-slate-50"
                    >
                        {searchUser.avatar_url ? (
                            <img
                                src={searchUser.avatar_url}
                                alt={searchUser.display_name ?? searchUser.username ?? 'User'}
                                className="size-11 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex size-11 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-500">
                                {(searchUser.display_name ?? searchUser.username ?? 'U').charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {searchUser.display_name ?? 'Unnamed user'}
                            </p>
                            <p className="truncate text-xs text-slate-400">@{searchUser.username ?? 'unknown'}</p>
                        </div>
                    </button>
                ))}
            </div>
        )
    }

    return (
        <main className="mx-auto w-full max-w-3xl px-4 py-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Search</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Results for <span className="font-semibold text-slate-700">{keyword || 'empty keyword'}</span>
                </p>
            </div>

            <div className="mt-5 flex gap-2 rounded-full bg-slate-100 p-1">
                {SEARCH_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        onClick={() => handleChangeType(tab.value)}
                        className={clsx(
                            'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition',
                            type === tab.value
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900',
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {type === 'posts' ? (
                <div className="mt-4 flex gap-2">
                    {SEARCH_SORTS.map((sortItem) => (
                        <button
                            key={sortItem.value}
                            type="button"
                            onClick={() => handleChangeSort(sortItem.value)}
                            className={clsx(
                                'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                                sort === sortItem.value
                                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                                    : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900',
                            )}
                        >
                            {sortItem.label}
                        </button>
                    ))}
                </div>
            ) : null}

            {isLoading ? (
                <SearchResultsSkeleton />
            ) : (
                <div className="mt-6 space-y-6">
                    {type === 'all' ? (
                        <>
                            <section>
                                <h2 className="mb-3 text-sm font-semibold text-slate-900">Bài viết</h2>
                                {renderPosts()}
                            </section>

                            <section>
                                <h2 className="mb-3 text-sm font-semibold text-slate-900">Mọi người</h2>
                                {renderUsers()}
                            </section>
                        </>
                    ) : null}

                    {type === 'posts' ? renderPosts() : null}
                    {type === 'users' ? renderUsers() : null}
                </div>
            )}

            <PostDetailDialog
                post={selectedPost}
                currentUserId={user?.id}
                open={!!selectedPost}
                onOpenChange={(open) => {
                    if (!open) setSelectedPost(null)
                }}
            />
        </main>
    )
}

export default Search
