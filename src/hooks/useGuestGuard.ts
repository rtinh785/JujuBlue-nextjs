'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAccesTokenFromLS } from '@/utils/auth'

export const useGuestGuard = () => {
    const router = useRouter()

    useEffect(() => {
        const accessToken = getAccesTokenFromLS()

        if (accessToken) {
            router.replace('/')
        }
    }, [router])
}
