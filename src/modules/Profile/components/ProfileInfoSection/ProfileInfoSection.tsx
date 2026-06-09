import { CalendarDays, MapPin } from 'lucide-react'
import type { Profile } from '@/modules/Profile/profile.type'
import { formatDateOfBirth } from '@/utils/helper'

type ProfileInfoSectionProps = {
    profile?: Profile | null
}

const ProfileInfoSection = ({ profile }: ProfileInfoSectionProps) => {
    return (
        <>
            <div className="mt-3">
                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">{profile?.display_name}</h1>
                <p className="text-sm text-slate-400">{profile?.username}</p>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{profile?.bio}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                {profile?.location && (
                    <div className="flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        <span>{profile.location}</span>
                    </div>
                )}

                {profile?.date_of_birth && (
                    <div className="flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        <span>{formatDateOfBirth(profile.date_of_birth)}</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default ProfileInfoSection
