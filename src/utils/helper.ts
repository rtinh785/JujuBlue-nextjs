import { setCookie } from '@/utils/cookie'
import { type SupportedLocale, LOCALE_KEY } from '@/core/constants/common.constant'
import { loadCatalog } from '@/translations/clientI18n'
import { i18n } from '@lingui/core'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { msg } from '@lingui/core/macro'

export const changeLanguage = async (lang: SupportedLocale) => {
    const messages = await loadCatalog(lang)
    setCookie(LOCALE_KEY, lang)
    i18n.loadAndActivate({ locale: lang, messages })
    // window.location.reload()
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatDateOfBirth = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) {
        return i18n._(msg`Chưa cập nhật`)
    }

    const [year, month, day] = dateOfBirth.split('-')

    if (!year || !month || !day) {
        return 'Chua cap nhat'
    }

    return `${day}/${month}/${year}`
}

export const formatPostTime = (dateString?: string | null) => {
    if (!dateString) return ''

    const date = new Date(dateString)

    if (Number.isNaN(date.getTime())) return ''

    return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date)
}

const COVER_MAX_OFFSET_Y = 120

export const clampCoverOffsetY = (value: number) => {
    return Math.max(-COVER_MAX_OFFSET_Y, Math.min(COVER_MAX_OFFSET_Y, value))
}

export const getResetAccessToken = () => {
    if (typeof window === 'undefined') return ''

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const searchParams = new URLSearchParams(window.location.search)

    return hashParams.get('access_token') || searchParams.get('access_token') || ''
}
