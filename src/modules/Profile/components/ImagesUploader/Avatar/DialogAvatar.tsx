import { Button } from '@/components/base/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/base/dialog'
import { PROFILE_ACTION_LABEL, PROFILE_TEXT, PROFILE_UPLOAD } from '@/core/constants/profile.constant'
import { getCroppedAvatarImage } from '@/modules/Profile/components/ImagesUploader/Avatar/avatarCrop.utils'
import Cropper, { type Area } from 'react-easy-crop'
import { useState } from 'react'

type DialogAvatarProps = {
    open: boolean
    imageSrc?: string | null
    onOpenChange: (open: boolean) => void
    onCancel: () => void
    onSave: (croppedFile: File) => void | Promise<void>
}

const DialogAvatar = ({ open, imageSrc, onOpenChange, onCancel, onSave }: DialogAvatarProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

    const handleSaveClick = async () => {
        if (!imageSrc || !croppedAreaPixels) {
            return
        }

        const croppedBlob = await getCroppedAvatarImage(imageSrc, croppedAreaPixels)
        const croppedFile = new File([croppedBlob], PROFILE_UPLOAD.DEFAULT_AVATAR_FILE_NAME, {
            type: PROFILE_UPLOAD.AVATAR_MIME_TYPE,
        })

        await onSave(croppedFile)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{PROFILE_TEXT.AVATAR_DIALOG_TITLE}</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="relative mx-auto h-[320px] w-[320px] overflow-hidden rounded-2xl bg-slate-100">
                        {imageSrc ? (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, nextCroppedAreaPixels) =>
                                    setCroppedAreaPixels(nextCroppedAreaPixels)
                                }
                            />
                        ) : null}
                    </div>

                    <div className="mx-auto flex w-[320px] items-center gap-3 pb-2">
                        <span className="text-lg text-slate-500">-</span>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(event) => setZoom(Number(event.target.value))}
                            className="w-full"
                        />
                        <span className="text-lg text-slate-500">+</span>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        {PROFILE_ACTION_LABEL.CANCEL}
                    </Button>
                    <Button type="button" onClick={handleSaveClick}>
                        {PROFILE_ACTION_LABEL.SAVE_CHANGES}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogAvatar
