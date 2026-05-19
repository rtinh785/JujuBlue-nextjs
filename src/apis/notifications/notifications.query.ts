import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { NOTIFICATION_QUERY } from '@/core/constants/notification.constant'
import notificationsApi from './notifications.api'
import { notificationsKeys } from './notifications.key'

export const useUnreadNotificationsCount = (enabled = true) => {
    return useQuery({
        queryKey: notificationsKeys.unreadCount(),
        queryFn: async () => {
            const res = await notificationsApi.getUnreadCount()
            return res.data.unreadCount
        },
        enabled,
        refetchInterval: 5_000,
    })
}

export const useGroupedNotifications = (enabled = true) => {
    return useQuery({
        queryKey: notificationsKeys.grouped(),
        queryFn: async () => {
            const res = await notificationsApi.getGroupedNotifications()
            return res.data.notifications
        },
        enabled,
        refetchInterval: 5_000,
    })
}

export const useInfiniteGroupedNotifications = (enabled = true) => {
    return useInfiniteQuery({
        queryKey: notificationsKeys.groupedInfinite(),
        initialPageParam: null as string | null,
        queryFn: async ({ pageParam }) => {
            const res = await notificationsApi.getGroupedNotifications({
                limit: pageParam ? NOTIFICATION_QUERY.LOAD_MORE_LIMIT : NOTIFICATION_QUERY.INITIAL_LIMIT,
                cursor: pageParam,
            })

            return res.data
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore ? lastPage.nextCursor : undefined
        },
        enabled,
    })
}

export const useMarkNotificationClicked = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: notificationsApi.markClicked,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() })
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.grouped() })
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.groupedInfinite() })
        },
    })
}

export const useMarkNotificationGroupClicked = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: notificationsApi.markGroupClicked,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount() })
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.grouped() })
            await queryClient.invalidateQueries({ queryKey: notificationsKeys.groupedInfinite() })
        },
    })
}

export const useNotificationGroupActors = (groupKey?: string) => {
    return useQuery({
        queryKey: notificationsKeys.groupActors(groupKey ?? ''),
        queryFn: async () => {
            const res = await notificationsApi.getGroupActors(groupKey ?? '')
            return res.data.actors
        },
        enabled: !!groupKey,
    })
}
