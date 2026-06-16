'use client'

import { DEFAULT_LOCALE, LOCALE_KEY, type SupportedLocale } from '@/core/constants/common.constant'
import { getCookie, setCookie } from '@/utils/cookie'
import { useEffect, useState } from 'react'
import { loadCatalog } from '@/translations/clientI18n'
import { i18n } from '@lingui/core'
type ToggleLocale = Extract<SupportedLocale, 'en' | 'vi'>

const LANGUAGE_LABELS: Record<ToggleLocale, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
}

const isToggleLocale = (value: string | undefined): value is ToggleLocale => {
    return value === 'en' || value === 'vi'
}

export const useCurrentLocale = () => {
    const [locale, setLocale] = useState<ToggleLocale>(DEFAULT_LOCALE)

    useEffect(() => {
        const cookieLocale = getCookie(LOCALE_KEY)

        if (isToggleLocale(cookieLocale)) {
            setLocale(cookieLocale)
        }
    }, [])

    const toggleLocale = async () => {
        const nextLocale = locale === 'vi' ? 'en' : 'vi'
        const messages = await loadCatalog(nextLocale)

        i18n.loadAndActivate({
            locale: nextLocale,
            messages,
        })
        setCookie(LOCALE_KEY, nextLocale)
        setLocale(nextLocale)
    }

    return {
        locale,
        languageLabel: LANGUAGE_LABELS[locale],
        toggleLocale,
    }
}
