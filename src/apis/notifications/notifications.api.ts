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

    getGroupedNotifications() {
        return http.get<GetGroupedNotificationsRes>('notifications/grouped')
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
