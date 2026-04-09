import AvatarUploader from '@/modules/Profile/components/ImagesUploader/Avatar/AvatarUploader'

type ProfileHeaderSectionProps = {
    isOwnProfile: boolean
    profileId?: string
    avatarUrl?: string
    avatarAlt: string
    isFollowed?: boolean
    onSelectAvatar: (file: File) => void
    onFollowUnfollow: () => void
    onOpenEditDialog: () => void
}

const ProfileHeaderSection = ({
    isOwnProfile,
    profileId,
    avatarUrl,
    avatarAlt,
    isFollowed,
    onSelectAvatar,
    onFollowUnfollow,
    onOpenEditDialog,
}: ProfileHeaderSectionProps) => {
    return (
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative z-10 flex flex-col items-start gap-3">
                {isOwnProfile ? (
                    <AvatarUploader avatarUrl={avatarUrl} alt={avatarAlt} onFileSelect={onSelectAvatar} />
                ) : avatarUrl ? (
                    <img src={avatarUrl} alt={avatarAlt} className="size-24 rounded-full object-cover sm:size-28" />
                ) : (
                    <div className="size-24 rounded-full bg-slate-100 sm:size-28" />
                )}
            </div>

            {profileId ? (
                <div className="flex items-center gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={onFollowUnfollow}
                        className={
                            isFollowed
                                ? 'rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-200 hover:border-red-300 hover:bg-red-100'
                                : 'rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50'
                        }
                    >
                        {isFollowed ? 'Unfollow' : 'Follow'}
                    </button>

                    <button
                        type="button"
                        className="bg-primary hover:bg-primary/90 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-white"
                    >
                        Message
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 sm:justify-end">
                    <button
                        type="button"
                        onClick={onOpenEditDialog}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    )
}

export default ProfileHeaderSection
