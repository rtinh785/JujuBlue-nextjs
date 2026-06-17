'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { NAV_LABEL } from '@/core/constants/layout.constant'
import { ROUTE, ROUTE_BUILDER } from '@/core/constants/route.constant'
import { useLingui } from '@lingui/react/macro'

interface SearchInputProps {
    mobileOnly?: boolean
    desktopOnly?: boolean
}

const SearchInput = ({ mobileOnly = false, desktopOnly = false }: SearchInputProps) => {
    const [keyword, setKeyword] = useState('')
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const visibilityClass = desktopOnly ? 'hidden lg:block' : mobileOnly ? 'block lg:hidden' : 'block'
    const { t } = useLingui()
    useEffect(() => {
        router.prefetch(ROUTE.SEARCH)
    }, [router])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const trimmedKeyword = keyword.trim()

        if (!trimmedKeyword) {
            return
        }

        startTransition(() => {
            router.push(ROUTE_BUILDER.search(trimmedKeyword))
        })
    }

    return (
        <form className={`relative mx-3 w-full flex-1 ${visibilityClass}`} onSubmit={handleSubmit}>
            <button
                type="submit"
                aria-label={isPending ? 'Searching' : t(NAV_LABEL.SEARCH_PLACEHOLDER)}
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-gray-600"
                disabled={isPending}
            >
                {isPending ? (
                    <span className="block size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                ) : (
                    <Search className="size-4" />
                )}
            </button>
            <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={t(NAV_LABEL.SEARCH_PLACEHOLDER)}
                className="h-10 w-full rounded-xl border border-transparent bg-gray-50 pr-3 pl-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:bg-gray-100 focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-gray-100"
            />
        </form>
    )
}

export default SearchInput
