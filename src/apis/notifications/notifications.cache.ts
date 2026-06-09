import type { InfiniteData, QueryClient } from '@tanstack/react-query'
import type { GetGroupedNotificationsRes, NotificationListItem } from '@/core/types/notification.type'
import { notificationsKeys } from '@/apis/notifications/notifications.key'

const markNotificationItemRead = (
    notification: NotificationListItem,
    target: NotificationListItem,
    shouldMarkGroup: boolean,
) => {
    const isTarget = shouldMarkGroup ? notification.group_key === target.group_key : notification.id === target.id

    if (!isTarget) return notification

    return {
        ...notification,
        clicked_at: notification.clicked_at ?? new Date().toISOString(),
    }
}

export const markNotificationReadInCache = (
    queryClient: QueryClient,
    target: NotificationListItem,
    shouldMarkGroup: boolean,
) => {
    const shouldDecreaseUnreadCount = !target.clicked_at

    if (shouldDecreaseUnreadCount) {
        queryClient.setQueryData<number>(notificationsKeys.unreadCount(), (oldCount = 0) => Math.max(oldCount - 1, 0))
    }

    queryClient.setQueryData<NotificationListItem[]>(notificationsKeys.grouped(), (oldNotifications) => {
        if (!oldNotifications) return oldNotifications

        return oldNotifications.map((notification) => markNotificationItemRead(notification, target, shouldMarkGroup))
    })

    queryClient.setQueryData<InfiniteData<GetGroupedNotificationsRes>>(
        notificationsKeys.groupedInfinite(),
        (oldData) => {
            if (!oldData) return oldData

            return {
                ...oldData,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    notifications: page.notifications.map((notification) =>
                        markNotificationItemRead(notification, target, shouldMarkGroup),
                    ),
                })),
            }
        },
    )
}
