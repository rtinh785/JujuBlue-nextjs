import { RefObject, useEffect, useRef } from 'react'

type UseInfiniteScrollTriggerParams = {
    enabled?: boolean
    hasNextPage?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage: () => void
    rootRef?: RefObject<HTMLElement | null>
}

export const useInfiniteScrollTrigger = ({
    enabled = true,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    rootRef,
}: UseInfiniteScrollTriggerParams) => {
    const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const loadMoreTrigger = loadMoreTriggerRef.current
        const rootElement = rootRef?.current ?? null

        if (!enabled || !loadMoreTrigger || !hasNextPage) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return

                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            {
                root: rootElement,
                threshold: 1,
            },
        )

        observer.observe(loadMoreTrigger)

        return () => observer.disconnect()
    }, [enabled, fetchNextPage, hasNextPage, isFetchingNextPage, rootRef])

    return {
        loadMoreTriggerRef,
    }
}
