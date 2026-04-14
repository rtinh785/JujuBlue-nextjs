export const LOCALE_KEY = 'NEXT_LINGUI_LOCALE'

export const SUPPORTED_LOCALES = ['en', 'vi', 'nl', 'zh'] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'vi'

export const VISIBILITY_LABEL_MAP = {
    public: 'Public',
    followers: 'Followers',
    private: 'Private',
} as const
