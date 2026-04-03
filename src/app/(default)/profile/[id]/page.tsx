'use client'

import Profile from '@/modules/Profile/Profile'
import { useParams } from 'next/navigation'

export default function ProfilePage() {
    const params = useParams<{ id: string }>()

    return <Profile profileId={params.id} />
}
