export type NotificationType = 'like_post' | 'comment_post' | 'reply_comment' | 'share_post' | 'follow_user'

export type NotificationActor = {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
}

export type NotificationListItem = {
    id: string
    type: NotificationType
    group_key: string
    clicked_at: string | null
    created_at: string
    is_grouped: boolean
    actor_count: number
    other_actor_count: number
    actor: NotificationActor | null
    target_post_id: string | null
    target_comment_id: string | null
    target_reply_id: string | null
    target_user_id: string | null
    share_post_id: string | null
    metadata: Record<string, unknown> | null
}

export type GetUnreadNotificationsCountRes = {
    unreadCount: number
}

export type GetGroupedNotificationsRes = {
    notifications: NotificationListItem[]
    nextCursor: string | null
    hasMore: boolean
}
export type MarkNotificationClickedRes = {
    message: string
}

export type GetNotificationGroupActorsRes = {
    actors: NotificationActor[]
}
