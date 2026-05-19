export const notificationsKeys = {
    all: () => ['notifications'] as const,
    unreadCount: () => ['notifications', 'unread-count'] as const,
    grouped: () => ['notifications', 'grouped'] as const,
    groupedInfinite: () => ['notifications', 'grouped', 'infinite'] as const,
    groupActors: (groupKey: string) => ['notifications', 'groups', groupKey, 'actors'] as const,
}
