import http from '@/apis/axios'
import {
    GetGroupedNotificationsRes,
    GetNotificationGroupActorsRes,
    GetUnreadNotificationsCountRes,
    MarkNotificationClickedRes,
} from '@/core/types/notification.type'

const notificationsApi = {
    getUnreadCount() {
        return http.get<GetUnreadNotificationsCountRes>('notifications/unread-count')
    },

    getGroupedNotifications(params?: { limit?: number; cursor?: string | null }) {
        const searchParams = new URLSearchParams()

        if (params?.limit) {
            searchParams.set('limit', String(params.limit))
        }

        if (params?.cursor) {
            searchParams.set('cursor', params.cursor)
        }

        const queryString = searchParams.toString()

        return http.get<GetGroupedNotificationsRes>(`notifications/grouped${queryString ? `?${queryString}` : ''}`)
    },

    markClicked(notificationId: string) {
        return http.patch<MarkNotificationClickedRes>(`notifications/${notificationId}/clicked`)
    },

    markGroupClicked(groupKey: string) {
        return http.patch<MarkNotificationClickedRes>(`notifications/groups/${encodeURIComponent(groupKey)}/clicked`)
    },
    getGroupActors(groupKey: string) {
        return http.get<GetNotificationGroupActorsRes>(`notifications/groups/${encodeURIComponent(groupKey)}/actors`)
    },
}

export default notificationsApi
