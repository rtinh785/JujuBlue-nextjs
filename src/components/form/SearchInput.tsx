'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LAYOUT_ALT, LAYOUT_ASSET, NAV_LABEL } from '@/core/constants/layout.constant'
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
                aria-label={isPending ? 'Searching' : LAYOUT_ALT.SEARCH}
                className="absolute top-1/2 left-3 -translate-y-1/2"
                disabled={isPending}
            >
                {isPending ? (
                    <span className="block size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
                ) : (
                    <img src={LAYOUT_ASSET.SEARCH} alt={LAYOUT_ALT.SEARCH} className="size-4" />
                )}
            </button>
            <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={t(NAV_LABEL.SEARCH_PLACEHOLDER)}
                className="h-9 w-full rounded-full border border-gray-300 bg-white pr-3 pl-10 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
        </form>
    )
}

export default SearchInput
