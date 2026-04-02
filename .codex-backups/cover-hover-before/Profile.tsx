import type { Post } from '@/core/types/post.type'
import Aside from '@/components/layout/Aside'
import PostCard from '@/components/post/PostCard'
import { useCurrentUser } from '@/features/auth/auth.queries'
import { uploadAvatar } from '@/features/profile/profile.api'
import { useMyProfile, useUpdateMyProfile } from '@/features/profile/profile.queries'
import EditProfileDialog from '@/modules/Profile/components/EditProfile/EditProfileDialog'
import type { EditProfileFormValues } from '@/modules/Profile/components/EditProfile/editProfile.schema'
import AvatarUploader from '@/modules/Profile/components/ImagesUploader/Avatar/AvatarUploader'
import DialogAvatar from '@/modules/Profile/components/ImagesUploader/Avatar/DialogAvatar'
import ProfileLoadingState from '@/modules/Profile/components/ProfileLoadingState'
import { formatDateOfBirth } from '@/utils/helper'
import { CalendarDays, MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const profile = {
    name: 'Alex Rivera',
    handle: '@arivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    bio: 'Product Designer building clean interfaces. Obsessed with typography, whitespace, and systems that scale. Coffee enthusiast.',
    location: 'San Francisco, CA',
    joinedAt: 'Joined March 2023',
}

const profilePosts: Post[] = [
    {
        id: 1,
        content:
            'Just pushed the new design system update. Focusing entirely on structural clarity and stripping away non-essential visual noise. The new primary blue feels incredibly fresh.',
        time: '2h',
        comments: 12,
        reposts: 4,
        likes: 89,
    },
    {
        id: 2,
        content: 'Minimal desk setup check. Nothing but essentials.',
        time: 'Oct 12',
        image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80',
        comments: 45,
        reposts: 12,
        likes: 342,
    },
]

const Profile = () => {
    // avatar dialog states
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
    const [selectedAvatarSrc, setSelectedAvatarSrc] = useState<string | null>(null)

    // cover photo dialog states
    const coverPhotoInputRef = React.useRef<HTMLInputElement | null>(null)
    const [selectedCoverPhotoSrc, setSelectedCoverPhotoSrc] = useState<string | null>(null)

    // profile data states
    const { data: userReal, isLoading: isUserLoading } = useCurrentUser()
    const { data: profileReal, isLoading: isProfileLoading } = useMyProfile(userReal?.id || '')
    const updateProfileMutation = useUpdateMyProfile(userReal?.id || '')

    const isPageLoading = isUserLoading || (!!userReal && isProfileLoading)

    // update profile handler
    const handleUpdateProfile = async (values: EditProfileFormValues) => {
        if (!userReal?.id) {
            return
        }

        await updateProfileMutation.mutateAsync(values)
        setOpenEditDialog(false)
    }

    // avatar handlers
    const handleSelectAvatar = (file: File) => {
        setSelectedAvatarSrc(URL.createObjectURL(file))
        setIsAvatarDialogOpen(true)
    }

    const handleCancelAvatarDialog = () => {
        setIsAvatarDialogOpen(false)
        setSelectedAvatarSrc(null)
    }

    const handleSaveAvatarDialog = async (croppedFile: File) => {
        if (!userReal?.id) {
            return
        }

        try {
            const avatarUrl = await uploadAvatar(userReal.id, croppedFile)

            await updateProfileMutation.mutateAsync({
                avatar_url: avatarUrl,
            })

            setIsAvatarDialogOpen(false)
            setSelectedAvatarSrc(null)
        } catch (error) {
            console.log('save avatar error:', error)
        }
    }

    //  cover photo handlers
    const handleSelectCoverPhoto = (file: File) => {
        setSelectedCoverPhotoSrc(URL.createObjectURL(file))
    }

    const handleOpenCoverPhotoPicker = () => {
        coverPhotoInputRef.current?.click()
    }

    //  cleanup object URLs to prevent memory leaks
    useEffect(() => {
        return () => {
            if (selectedAvatarSrc) {
                URL.revokeObjectURL(selectedAvatarSrc)
            }
        }
    }, [selectedAvatarSrc])

    if (isPageLoading) {
        return <ProfileLoadingState />
    }

    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <button
                            type="button"
                            onClick={handleOpenCoverPhotoPicker}
                            className="block h-28 w-full overflow-hidden bg-slate-100 sm:h-36"
                        >
                            {selectedCoverPhotoSrc ? (
                                <img
                                    src={selectedCoverPhotoSrc}
                                    alt="Cover preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200" />
                            )}
                        </button>

                        <div className="px-5 pb-5">
                            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div className="flex flex-col items-start gap-3">
                                    <AvatarUploader
                                        avatarUrl={profileReal?.avatar_url}
                                        alt={profileReal?.display_name ?? 'Avatar'}
                                        onFileSelect={handleSelectAvatar}
                                    />
                                </div>

                                <div className="flex items-center gap-2 sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setOpenEditDialog(true)}
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
                                    {profileReal?.display_name}
                                </h1>
                                <p className="text-sm text-slate-400">{profileReal?.username}</p>
                            </div>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{profileReal?.bio}</p>

                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="size-4" />
                                    <span>{profileReal?.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="size-4" />
                                    <span>{formatDateOfBirth(profileReal?.date_of_birth)}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-6 border-b border-slate-200">
                                <button
                                    type="button"
                                    className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
                                >
                                    Posts
                                </button>
                                <button type="button" className="pb-3 text-sm font-medium text-slate-400">
                                    Replies
                                </button>
                                <button type="button" className="pb-3 text-sm font-medium text-slate-400">
                                    Likes
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        {profilePosts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                fallbackAuthor={profile.name}
                                fallbackHandle={profile.handle}
                                fallbackAvatar={profile.avatar}
                            />
                        ))}
                    </section>

                    <div className="flex justify-center pt-2">
                        <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                </section>
                {profileReal && (
                    <EditProfileDialog
                        open={openEditDialog}
                        onOpenChange={setOpenEditDialog}
                        profile={profileReal}
                        onSubmit={handleUpdateProfile}
                        isPending={updateProfileMutation.isPending}
                    />
                )}
                <Aside showTrending={false} user={userReal} />
            </div>

            <input
                ref={coverPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    handleSelectCoverPhoto(file)
                }}
            />

            <DialogAvatar
                open={isAvatarDialogOpen}
                imageSrc={selectedAvatarSrc}
                onOpenChange={setIsAvatarDialogOpen}
                onCancel={handleCancelAvatarDialog}
                onSave={handleSaveAvatarDialog}
            />
        </main>
    )
}

export default Profile
