export const LOCALE_KEY = 'NEXT_LINGUI_LOCALE'

export const SUPPORTED_LOCALES = ['en', 'vi', 'nl', 'zh'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'vi'

export const COMMON_ACTION_LABEL = {
    CANCEL: 'Cancel',
} as const

export const COMMON_TEXT = {
    NOT_UPDATED: 'Not updated',
} as const

export const DATE_TIME_LOCALE = {
    POST_TIME: 'vi-VN',
} as const

export { POST_VISIBILITY_LABEL as VISIBILITY_LABEL_MAP } from './post.constant'
