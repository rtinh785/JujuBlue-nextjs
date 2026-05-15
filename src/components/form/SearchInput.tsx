import React from 'react'
import { LAYOUT_ALT, LAYOUT_ASSET, NAV_LABEL } from '@/core/constants/layout.constant'

interface SearchInputProps {
    mobileOnly?: boolean
    desktopOnly?: boolean
}

const SearchInput = ({ mobileOnly = false, desktopOnly = false }: SearchInputProps) => {
    const visibilityClass = desktopOnly ? 'hidden lg:block' : mobileOnly ? 'block lg:hidden' : 'block'

    return (
        <div className={`relative mx-3 w-full flex-1 ${visibilityClass}`}>
            <img
                src={LAYOUT_ASSET.SEARCH}
                alt={LAYOUT_ALT.SEARCH}
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <input
                type="text"
                placeholder={NAV_LABEL.SEARCH_PLACEHOLDER}
                className="h-9 w-full rounded-full border border-gray-300 bg-white pr-3 pl-10 text-sm outline-none placeholder:text-gray-400 focus:border-gray-400"
            />
        </div>
    )
}

export default SearchInput
