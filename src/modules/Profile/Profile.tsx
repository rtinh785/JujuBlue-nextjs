import { useEffect, useState } from 'react'
import { CalendarDays, MapPin } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/base/tabs'
import Aside from '@/components/layout/Header/components/Aside/Aside'
import {
    useCurrentUser,
    useGetProfile,
    useMyProfile,
    useUpdateAvatar,
    useUpdateCoverPhoto,
    useUpdateMyProfile,
} from '@/apis/user/user.query'
import { useProfileMedia } from '@/hooks/useProfileMedia'
import EditProfileDialog from '@/modules/Profile/components/EditProfile/EditProfileDialog'
import type { EditProfileFormValues } from '@/modules/Profile/components/EditProfile/editProfile.schema'
import DialogAvatar from '@/modules/Profile/components/ImagesUploader/Avatar/DialogAvatar'
import ProfileCoverSection from '@/modules/Profile/components/ProfileCoverSection/ProfileCoverSection'
import ProfileHeaderSection from '@/modules/Profile/components/ProfileHeaderSection/ProfileHeaderSection'
import ProfileLoadingState from '@/modules/Profile/components/ProfileLoadingState'
import FollowingTab from '@/modules/Profile/components/Tabs/FollowingTab'
import { clampCoverOffsetY, formatDateOfBirth } from '@/utils/helper'

import { useCheckFollowing, useFollow, useUnfollow } from '@/apis/follows/follows.query'
import { requireAuthAction } from '@/utils/requireAuthAction'
import PostsTab from '@/modules/Profile/components/Tabs/PostsTab'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import type { PostWithStatus } from '@/core/types/post.type'

interface ProfileProps {
    profileId?: string
}

const Profile = ({ profileId }: ProfileProps) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])
    // Profile queries
    const { data: currentUser, isLoading: isUserLoading } = useCurrentUser()
    const isOwnProfile = !!currentUser?.id && (!profileId || profileId === currentUser.id)
    const myProfileQuery = useMyProfile(isOwnProfile)
    const otherProfileQuery = useGetProfile(!isOwnProfile ? profileId : undefined)
    const profileData = isOwnProfile ? myProfileQuery.data : otherProfileQuery.data
    const isProfileLoading = isOwnProfile ? myProfileQuery.isLoading : otherProfileQuery.isLoading
    const profilePostsUserId = profileId ?? currentUser?.id

    // Mutations
    const updateProfileMutation = useUpdateMyProfile()
    const updateAvatarMutation = useUpdateAvatar()
    const updateCoverPhotoMutation = useUpdateCoverPhoto()

    // Local UI state
    const [openEditDialog, setOpenEditDialog] = useState(false)
    const [selectedPost, setSelectedPost] = useState<PostWithStatus | null>(null)
    const [shouldFocusComment, setShouldFocusComment] = useState(false)

    // Media state
    const {
        isAvatarDialogOpen,
        setIsAvatarDialogOpen,
        selectedAvatarSrc,
        setSelectedAvatarSrc,
        coverPhotoInputRef,
        selectedCoverPhotoSrc,
        isEditingCoverPhoto,
        setIsEditingCoverPhoto,
        coverPhotoOffsetX,
        coverPhotoOffsetY,
        savedCoverPhotoOffsetY,
        setSavedCoverPhotoOffsetY,
        selectedCoverPhotoFile,
        setSelectedCoverPhotoFile,
        handleSelectAvatar,
        handleCancelAvatarDialog,
        handleSelectCoverPhoto,
        handleCancelCoverPhoto,
        handleOpenCoverPhotoPicker,
        handleCoverCropChange,
    } = useProfileMedia()

    // Follow state
    const { data: checkFollow } = useCheckFollowing(currentUser?.id, profileId || '')
    const { mutate: followMutation } = useFollow(currentUser?.id)
    const { mutate: unfollowMutation } = useUnfollow(currentUser?.id)

    // Derived values
    const isPageLoading = isUserLoading || (!!currentUser && isProfileLoading)
    const currentCoverPhotoSrc = selectedCoverPhotoSrc ?? profileData?.cover_photo_url ?? null
    const currentCoverPhotoOffsetY =
        selectedCoverPhotoSrc && isEditingCoverPhoto
            ? coverPhotoOffsetY
            : (profileData?.cover_photo_offset_y ?? savedCoverPhotoOffsetY ?? 0)

    // Handlers
    const handleUpdateProfile = async (values: EditProfileFormValues) => {
        if (!currentUser?.id) return
        // Do db chỉ nhận null chứ k phải "" nên phải chuyển '' thành null nhen
        const cleaned = {
            ...values,
            date_of_birth: values.date_of_birth || null,
        }

        // bỏ field rỗng lun
        Object.keys(cleaned).forEach((key) => {
            const k = key as keyof typeof cleaned
            if (cleaned[k] === '' || cleaned[k] === undefined) {
                delete cleaned[k]
            }
        })

        await updateProfileMutation.mutateAsync(cleaned)
        setOpenEditDialog(false)
    }

    const handleSaveAvatarDialog = async (croppedFile: File) => {
        try {
            await updateAvatarMutation.mutateAsync(croppedFile)
            setIsAvatarDialogOpen(false)
            setSelectedAvatarSrc(null)
        } catch (error) {
            console.log('save avatar error:', error)
        }
    }

    const handleSaveCoverPhoto = async () => {
        if (!selectedCoverPhotoFile) {
            return
        }

        try {
            const profile = await updateCoverPhotoMutation.mutateAsync(selectedCoverPhotoFile)
            const nextOffsetY = clampCoverOffsetY(coverPhotoOffsetY)

            await updateProfileMutation.mutateAsync({
                cover_photo_url: profile.cover_photo_url,
                cover_photo_offset_y: nextOffsetY,
            })

            setSavedCoverPhotoOffsetY(nextOffsetY)
            setSelectedCoverPhotoFile(null)
            setIsEditingCoverPhoto(false)
        } catch (error) {
            console.log('save cover photo error:', error)
        }
    }

    const handleFollowUnfollow = () => {
        requireAuthAction(() => {
            if (checkFollow?.isFollowing) {
                unfollowMutation(profileId!)
            } else {
                followMutation(profileId!)
            }
        })
    }

    const handleOpenPostDetail = (post: PostWithStatus) => {
        setSelectedPost(post)
        setShouldFocusComment(false)
    }

    const handleOpenPostComments = (post: PostWithStatus) => {
        setSelectedPost(post)
        setShouldFocusComment(true)
    }

    if (!hasMounted || isPageLoading) {
        return <ProfileLoadingState />
    }

    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    <Tabs defaultValue="posts" orientation="horizontal" className="flex-col">
                        {/* Card profile + tab bar dính liền */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                            {/* Cover photo */}
                            <ProfileCoverSection
                                isOwnProfile={isOwnProfile}
                                isEditingCoverPhoto={isEditingCoverPhoto}
                                currentCoverPhotoSrc={currentCoverPhotoSrc}
                                currentCoverPhotoOffsetY={currentCoverPhotoOffsetY}
                                coverPhotoOffsetX={coverPhotoOffsetX}
                                coverPhotoOffsetY={coverPhotoOffsetY}
                                onCancelCoverPhoto={handleCancelCoverPhoto}
                                onSaveCoverPhoto={handleSaveCoverPhoto}
                                onOpenCoverPhotoPicker={handleOpenCoverPhotoPicker}
                                onCoverCropChange={handleCoverCropChange}
                            />

                            <div className="px-5 pb-0">
                                <ProfileHeaderSection
                                    isOwnProfile={isOwnProfile}
                                    profileId={profileId}
                                    avatarUrl={
                                        profileData?.avatar_url ?? currentUser?.user_metadata?.avatar_url ?? undefined
                                    }
                                    avatarAlt={profileData?.display_name ?? 'Avatar'}
                                    isFollowed={checkFollow?.isFollowing}
                                    onSelectAvatar={handleSelectAvatar}
                                    onFollowUnfollow={handleFollowUnfollow}
                                    onOpenEditDialog={() => setOpenEditDialog(true)}
                                />

                                {/* Profile info */}
                                <div className="mt-3">
                                    <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
                                        {profileData?.display_name}
                                    </h1>
                                    <p className="text-sm text-slate-400">{profileData?.username}</p>
                                </div>

                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{profileData?.bio}</p>

                                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                                    {profileData?.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="size-4" />
                                            <span>{profileData?.location}</span>
                                        </div>
                                    )}
                                    {profileData?.date_of_birth && (
                                        <div className="flex items-center gap-1.5">
                                            <CalendarDays className="size-4" />
                                            <span>{formatDateOfBirth(profileData?.date_of_birth)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Tab bar dính đáy card */}
                                <TabsList
                                    variant="line"
                                    className="mt-4 w-full justify-start rounded-none border-b border-slate-200 bg-transparent px-0"
                                >
                                    <TabsTrigger
                                        value="posts"
                                        className="mr-6 rounded-none border-0 bg-transparent px-0 py-3 text-sm font-medium text-slate-400 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
                                    >
                                        Posts
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="following"
                                        className="rounded-none border-0 bg-transparent px-0 py-3 text-sm font-medium text-slate-400 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-800 data-[state=active]:bg-transparent data-[state=active]:text-slate-900 data-[state=active]:shadow-none"
                                    >
                                        Following
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                        </section>

                        {/* Content bên dưới */}
                        <TabsContent value="posts">
                            <PostsTab
                                profileId={profilePostsUserId}
                                currentUserId={currentUser?.id}
                                onOpenDetail={handleOpenPostDetail}
                                onOpenComments={handleOpenPostComments}
                            />
                        </TabsContent>

                        <TabsContent value="following">
                            <FollowingTab currentUserId={currentUser?.id} isOwnProfile={isOwnProfile} />
                        </TabsContent>
                    </Tabs>
                </section>

                {isOwnProfile && profileData && (
                    <EditProfileDialog
                        open={openEditDialog}
                        onOpenChange={setOpenEditDialog}
                        profile={profileData}
                        onSubmit={handleUpdateProfile}
                        isPending={updateProfileMutation.isPending}
                    />
                )}

                <Aside showTrending={false} user={currentUser} />
            </div>

            {/* Hidden file picker for cover photo */}
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

            {/* Avatar crop dialog */}
            <DialogAvatar
                open={isAvatarDialogOpen}
                imageSrc={selectedAvatarSrc}
                onOpenChange={setIsAvatarDialogOpen}
                onCancel={handleCancelAvatarDialog}
                onSave={handleSaveAvatarDialog}
            />

            <PostDetailDialog
                post={selectedPost}
                currentUserId={currentUser?.id}
                open={!!selectedPost}
                shouldFocusComment={shouldFocusComment}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPost(null)
                        setShouldFocusComment(false)
                    }
                }}
                onDeleted={() => {
                    setSelectedPost(null)
                }}
            />
        </main>
    )
}

export default Profile
