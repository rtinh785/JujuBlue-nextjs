import { setCookie } from '@/utils/cookie'
import { type SupportedLocale, LOCALE_KEY } from '@/core/constants/common.constant'
import { loadCatalog } from '@/translations/clientI18n'
import { i18n } from '@lingui/core'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
        return 'Chua cap nhat'
    }

    const [year, month, day] = dateOfBirth.split('-')

    if (!year || !month || !day) {
        return 'Chua cap nhat'
    }

    return `${day}/${month}/${year}`
}
