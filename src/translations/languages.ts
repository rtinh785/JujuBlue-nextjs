import { MessageDescriptor } from '@lingui/core'
import { msg } from '@lingui/core/macro'
import { type SupportedLocale } from '@/core/constants/common.constant'

export interface Language {
    locale: SupportedLocale | 'pseudo'
    name: MessageDescriptor
    rtl: boolean
}

export const languages: Language[] = [
    {
        locale: 'en',
        name: msg`English`,
        rtl: false,
    },
    {
        locale: 'vi',
        name: msg`Tiếng Việt`,
        rtl: false,
    },
]

if (process.env.NODE_ENV !== 'production') {
    languages.push({
        locale: 'pseudo',
        name: msg`Pseudo`,
        rtl: false,
    })
}
