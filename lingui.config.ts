import { formatter } from '@lingui/format-po'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './src/core/constants/common.constant'

const locales: string[] = [...SUPPORTED_LOCALES]

if (process.env.NODE_ENV !== 'production') {
    locales.push('pseudo')
}

const linguiConfig = {
    locales: locales,
    sourceLocale: DEFAULT_LOCALE,
    pseudoLocale: 'pseudo',
    fallbackLocales: {
        default: 'vi',
    },
    catalogs: [
        {
            // chổ lưu file dịch
            path: '<rootDir>/src/translations/locales/{locale}/messages',
            // chổ lấy file gốc để dịch
            include: ['<rootDir>/src/'],
            // chổ bỏ qua không dịch
            exclude: ['**/node_modules/**', '**/__tests__/**', '**/*.test.ts'],
        },
    ],
    // bỏ qua phần gốc khi dịch, chỉ lấy phần dịch để tránh bị lộ thông tin gốc khi dịch ra file .po, nếu muốn lấy phần gốc thì bỏ dòng này đi
    format: formatter({ origins: false }),
}

export default linguiConfig
