import type { NotificationListItem, NotificationType } from '@/core/types/notification.type'

const GROUPED_NOTIFICATION_TYPES: NotificationType[] = ['like_post', 'follow_user']

export const isGroupedNotificationType = (type: NotificationType) => {
    return GROUPED_NOTIFICATION_TYPES.includes(type)
}

export const getNotificationMessage = (notification: NotificationListItem) => {
    const otherCount = notification.other_actor_count

    const groupedSuffix = notification.is_grouped && otherCount > 0 ? ` and ${otherCount} others` : ''

    switch (notification.type) {
        case 'like_post':
            return `${groupedSuffix} liked your post`

        case 'comment_post':
            return `${groupedSuffix} commented on your post`

        case 'reply_comment':
            return `${groupedSuffix} replied to your comment`

        case 'share_post':
            return 'shared one of your posts'

        case 'follow_user':
            return `${groupedSuffix} followed you`

        default:
            return 'sent you a notification'
    }
}

export const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) return ''

    const now = Date.now()
    const diffInSeconds = Math.floor((now - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    }).format(date)
}
