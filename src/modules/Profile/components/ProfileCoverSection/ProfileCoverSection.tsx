import { Pencil } from 'lucide-react'
import Cropper from 'react-easy-crop'
import { PROFILE_ACTION_LABEL, PROFILE_TEXT } from '@/core/constants/profile.constant'

type ProfileCoverSectionProps = {
    isOwnProfile: boolean
    isEditingCoverPhoto: boolean
    currentCoverPhotoSrc: string | null
    currentCoverPhotoOffsetY: number
    coverPhotoOffsetX: number
    coverPhotoOffsetY: number
    onCancelCoverPhoto: () => void
    onSaveCoverPhoto: () => void
    onOpenCoverPhotoPicker: () => void
    onCoverCropChange: (nextCrop: { x: number; y: number }) => void
}

const ProfileCoverSection = ({
    isOwnProfile,
    isEditingCoverPhoto,
    currentCoverPhotoSrc,
    currentCoverPhotoOffsetY,
    coverPhotoOffsetX,
    coverPhotoOffsetY,
    onCancelCoverPhoto,
    onSaveCoverPhoto,
    onOpenCoverPhotoPicker,
    onCoverCropChange,
}: ProfileCoverSectionProps) => {
    return (
        <div className="group relative h-28 min-h-[170px] w-full overflow-hidden bg-slate-100 sm:h-36 lg:min-h-[231px]">
            {isOwnProfile && isEditingCoverPhoto && (
                <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-end gap-2 bg-black/25 px-4 py-3">
                    <button
                        type="button"
                        onClick={onCancelCoverPhoto}
                        className="rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white"
                    >
                        {PROFILE_ACTION_LABEL.CANCEL}
                    </button>
                    <button
                        type="button"
                        onClick={onSaveCoverPhoto}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white"
                    >
                        {PROFILE_ACTION_LABEL.SAVE_CHANGES}
                    </button>
                </div>
            )}

            {currentCoverPhotoSrc ? (
                isEditingCoverPhoto ? (
                    <Cropper
                        image={currentCoverPhotoSrc}
                        crop={{ x: coverPhotoOffsetX, y: coverPhotoOffsetY }}
                        zoom={1}
                        minZoom={1}
                        maxZoom={1}
                        aspect={4.4}
                        cropShape="rect"
                        showGrid={false}
                        objectFit="horizontal-cover"
                        restrictPosition
                        zoomWithScroll={false}
                        onCropChange={onCoverCropChange}
                    />
                ) : (
                    <img
                        src={currentCoverPhotoSrc}
                        alt={PROFILE_TEXT.COVER_PREVIEW_ALT}
                        className="h-full w-full object-cover"
                        style={{
                            objectPosition: `center calc(50% + ${currentCoverPhotoOffsetY}px)`,
                        }}
                    />
                )
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200" />
            )}

            {isOwnProfile && !isEditingCoverPhoto && (
                <button
                    type="button"
                    onClick={onOpenCoverPhotoPicker}
                    className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={PROFILE_TEXT.CHANGE_COVER_PHOTO}
                >
                    <Pencil className="size-4" />
                </button>
            )}
        </div>
    )
}

export default ProfileCoverSection
