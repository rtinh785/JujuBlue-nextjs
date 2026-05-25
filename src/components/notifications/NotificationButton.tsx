'use client'

import {
    useInfiniteGroupedNotifications,
    useMarkNotificationClicked,
    useMarkNotificationGroupClicked,
    useUnreadNotificationsCount,
} from '@/apis/notifications/notifications.query'
import { usePostById } from '@/apis/posts/posts.query'
import { useMyProfile } from '@/apis/user/user.query'
import { postsKeys } from '@/apis/posts/posts.key'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base/popover'
import { Skeleton } from '@/components/base/skeleton'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import { formatNotificationTime, getNotificationMessage, isGroupedNotificationType } from '@/utils/notification'
import { Bell } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import type { NotificationListItem } from '@/core/types/notification.type'
import { ROUTE_BUILDER } from '@/core/constants/route.constant'
import { useRouter } from 'next/navigation'
import FollowGroupDialog from '@/components/notifications/FollowGroupDialog'
import { useQueryClient } from '@tanstack/react-query'
import { useInfiniteScrollTrigger } from '@/hooks/useInfiniteScrollTrigger'

type Props = {
    enabled?: boolean
}

const NotificationButton = ({ enabled = true }: Props) => {
    const [open, setOpen] = useState(false)
    const [selectedFollowGroupKey, setSelectedFollowGroupKey] = useState<string | null>(null)
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
    const [shouldFocusComment, setShouldFocusComment] = useState(false)

    const router = useRouter()
    const queryClient = useQueryClient()
    const notificationsListRef = useRef<HTMLDivElement | null>(null)

    const { data: unreadCount = 0 } = useUnreadNotificationsCount(enabled)
    const {
        data: notificationsPages,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteGroupedNotifications(open && enabled)
    const { data: selectedPost } = usePostById(selectedPostId ?? undefined)
    const { data: myProfile } = useMyProfile()

    const { mutateAsync: markClicked } = useMarkNotificationClicked()
    const { mutateAsync: markGroupClicked } = useMarkNotificationGroupClicked()

    const { loadMoreTriggerRef } = useInfiniteScrollTrigger({
        enabled: open && enabled,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage: () => {
            void fetchNextPage()
        },
        rootRef: notificationsListRef,
    })

    const notifications = useMemo(
        () => notificationsPages?.pages.flatMap((page) => page.notifications) ?? [],
        [notificationsPages],
    )

    const openPostDetail = async (postId: string, focusComment = false) => {
        await Promise.all([
            queryClient.refetchQueries({
                queryKey: postsKeys.detail(postId),
                type: 'all',
            }),
            queryClient.refetchQueries({
                queryKey: postsKeys.comments(postId),
                type: 'all',
            }),
        ])

        setShouldFocusComment(focusComment)
        setSelectedPostId(postId)
    }

    const handleNotificationClick = async (notification: NotificationListItem) => {
        const shouldMarkGroup = isGroupedNotificationType(notification.type)

        setOpen(false)

        if (shouldMarkGroup) {
            await markGroupClicked(notification.group_key)
        } else {
            await markClicked(notification.id)
        }

        if (notification.type === 'follow_user') {
            if (notification.is_grouped) {
                setSelectedFollowGroupKey(notification.group_key)
                return
            }

            if (notification.target_user_id) {
                router.push(ROUTE_BUILDER.profileDetail(notification.target_user_id))
            }

            return
        }

        if (notification.type === 'share_post' && notification.share_post_id) {
            await openPostDetail(notification.share_post_id)
            return
        }

        if (notification.target_post_id) {
            await openPostDetail(
                notification.target_post_id,
                notification.type === 'comment_post' || notification.type === 'reply_comment',
            )
        }
    }

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className="relative flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        aria-label="Open notifications"
                    >
                        <Bell className="size-5" />

                        {unreadCount > 0 ? (
                            <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        ) : null}
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    sideOffset={10}
                    className="w-[360px] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl shadow-slate-200/70"
                >
                    <div className="border-b border-slate-100 px-4 py-3">
                        <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    </div>

                    <div ref={notificationsListRef} className="max-h-[420px] overflow-y-auto">
                        {isLoading && notifications.length === 0 ? (
                            <div className="space-y-3 px-4 py-4">
                                <Skeleton className="h-12 w-full rounded-xl" />
                                <Skeleton className="h-12 w-full rounded-xl" />
                                <Skeleton className="h-12 w-full rounded-xl" />
                            </div>
                        ) : notifications.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <button
                                        key={notification.id}
                                        type="button"
                                        className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        {notification.actor?.avatar_url ? (
                                            <img
                                                src={notification.actor.avatar_url}
                                                alt={notification.actor.display_name ?? 'Notification actor'}
                                                className="size-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="size-10 rounded-full bg-slate-200" />
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm leading-5 text-slate-700">
                                                <span className="font-semibold text-slate-900">
                                                    {notification.actor?.display_name ?? 'Someone'}
                                                </span>{' '}
                                                {getNotificationMessage(notification)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {formatNotificationTime(notification.created_at)}
                                            </p>
                                        </div>

                                        {!notification.clicked_at ? (
                                            <span className="mt-2 size-2 rounded-full bg-blue-500" />
                                        ) : null}
                                    </button>
                                ))}

                                {hasNextPage ? (
                                    <div ref={loadMoreTriggerRef} className="px-4 py-3">
                                        {isFetchingNextPage ? (
                                            <Skeleton className="h-10 w-full rounded-xl" />
                                        ) : (
                                            <div className="h-2" />
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <p className="text-sm font-medium text-slate-600">No notifications yet</p>
                                <p className="mt-1 text-xs text-slate-400">New activity will appear here.</p>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <FollowGroupDialog
                groupKey={selectedFollowGroupKey}
                open={!!selectedFollowGroupKey}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setSelectedFollowGroupKey(null)
                    }
                }}
            />

            <PostDetailDialog
                post={selectedPost ?? null}
                currentUserId={myProfile?.id}
                open={!!selectedPostId}
                shouldFocusComment={shouldFocusComment}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setSelectedPostId(null)
                        setShouldFocusComment(false)
                    }
                }}
            />
        </>
    )
}

export default NotificationButton
