import { useEffect, useState } from 'react'
import { Tabs, TabsContent } from '@/components/base/tabs'
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
import type { EditProfileFormValues } from '@/schema/editProfile.schema'
import DialogAvatar from '@/modules/Profile/components/ImagesUploader/Avatar/DialogAvatar'
import ProfileCoverSection from '@/modules/Profile/components/ProfileCoverSection/ProfileCoverSection'
import ProfileHeaderSection from '@/modules/Profile/components/ProfileHeaderSection/ProfileHeaderSection'
import ProfileInfoSection from '@/modules/Profile/components/ProfileInfoSection/ProfileInfoSection'
import ProfileLoadingState from '@/modules/Profile/components/ProfileLoadingState'
import ProfileTabsNav from '@/modules/Profile/components/ProfileTabsNav/ProfileTabsNav'
import FollowingTab from '@/modules/Profile/components/Tabs/FollowingTab'
import { clampCoverOffsetY } from '@/utils/helper'
import { useCheckFollowing, useFollow, useUnfollow } from '@/apis/follows/follows.query'
import { requireAuthAction } from '@/utils/requireAuthAction'
import PostsTab from '@/modules/Profile/components/Tabs/PostsTab'
import PostDetailDialog from '@/components/post/components/PostDetailDialog'
import type { PostWithStatus } from '@/core/types/post.type'
import { PROFILE_TAB, PROFILE_TEXT } from '@/core/constants/profile.constant'
import { useRouter } from 'next/navigation'
import { useCreateOrGetConversation } from '@/apis/messages/messages.query'
import { ROUTE } from '@/core/constants/route.constant'
import { cleanProfileUpdatePayload } from '@/modules/Profile/utils/profile.utils'

import { useLingui } from '@lingui/react/macro'

interface ProfileProps {
    profileId?: string
}

const Profile = ({ profileId }: ProfileProps) => {
    const [hasMounted, setHasMounted] = useState(false)
    const router = useRouter()
    const { t } = useLingui()
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
    const createOrGetConversationMutation = useCreateOrGetConversation()
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
    const isSavingAvatar = updateAvatarMutation.isPending
    const isSavingCoverPhoto = updateCoverPhotoMutation.isPending || updateProfileMutation.isPending

    // Handlers
    const handleUpdateProfile = async (values: EditProfileFormValues) => {
        if (!currentUser?.id) return

        await updateProfileMutation.mutateAsync(cleanProfileUpdatePayload(values))
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

    const handleMessage = () => {
        requireAuthAction(async () => {
            if (!profileId) return

            const conversation = await createOrGetConversationMutation.mutateAsync(profileId)

            router.push(`${ROUTE.MESSAGES}?conversationId=${conversation.data.conversation.id}`)
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
                    <Tabs defaultValue={PROFILE_TAB.POSTS} orientation="horizontal" className="flex-col">
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
                                isSavingCoverPhoto={isSavingCoverPhoto}
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
                                    avatarAlt={profileData?.display_name ?? t(PROFILE_TEXT.AVATAR_ALT)}
                                    isFollowed={checkFollow?.isFollowing}
                                    onSelectAvatar={handleSelectAvatar}
                                    onFollowUnfollow={handleFollowUnfollow}
                                    onMessage={handleMessage}
                                    onOpenEditDialog={() => setOpenEditDialog(true)}
                                />

                                <ProfileInfoSection profile={profileData} />
                                <ProfileTabsNav />
                            </div>
                        </section>

                        {/* Content bên dưới */}
                        <TabsContent value={PROFILE_TAB.POSTS}>
                            <PostsTab
                                profileId={profilePostsUserId}
                                currentUserId={currentUser?.id}
                                onOpenDetail={handleOpenPostDetail}
                                onOpenComments={handleOpenPostComments}
                            />
                        </TabsContent>

                        <TabsContent value={PROFILE_TAB.FOLLOWING}>
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
                    if (isSavingCoverPhoto) return
                    handleSelectCoverPhoto(file)
                }}
            />

            {/* Avatar crop dialog */}
            <DialogAvatar
                open={isAvatarDialogOpen}
                imageSrc={selectedAvatarSrc}
                isSaving={isSavingAvatar}
                onOpenChange={(open) => {
                    if (isSavingAvatar && !open) return
                    setIsAvatarDialogOpen(open)
                }}
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
