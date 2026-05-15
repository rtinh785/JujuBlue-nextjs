import ProfileSummaryCard from '@/components/layout/Header/components/Aside/components/ProfileSummaryCard'
import SuggestedUsersCard from '@/components/layout/Header/components/Aside/components/SuggestedUsersCard'
import TrendingCard from '@/components/layout/Header/components/Aside/components/TrendingCard'
import { ASIDE_TEXT } from '@/core/constants/layout.constant'
import { User } from '@supabase/supabase-js'
import React from 'react'

interface AsideProps {
    showTrending?: boolean
    user: User | undefined
}

const Aside = ({ showTrending = true, user }: AsideProps) => {
    return (
        <aside className="hidden space-y-4 lg:fixed lg:top-[88px] lg:right-[max(1rem,calc((100vw-1180px)/2+1rem))] lg:block lg:h-[calc(100vh-108px)] lg:w-[320px] lg:overflow-y-auto lg:pr-1">
            {user && <ProfileSummaryCard />}
            {showTrending && <TrendingCard />}
            {user && <SuggestedUsersCard user={user} />}

            <div className="px-1 text-xs text-slate-400">
                <p>{ASIDE_TEXT.TERMS}</p>
                <p className="mt-1">{ASIDE_TEXT.COPYRIGHT}</p>
            </div>
        </aside>
    )
}

export default Aside
