import { PROFILE_UPLOAD } from '@/core/constants/profile.constant'
import { useLingui } from '@lingui/react/macro'
import type { Area } from 'react-easy-crop'

export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })

export const getCroppedAvatarImage = async (imageSrc: string, pixelCrop: Area) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const { t } = useLingui()
    if (!ctx) {
        throw new Error(t(PROFILE_UPLOAD.CANVAS_CREATE_FAILED))
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
    )

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((file) => {
            if (!file) {
                reject(new Error(t(PROFILE_UPLOAD.IMAGE_BLOB_CREATE_FAILED)))
                return
            }

            resolve(file)
        }, PROFILE_UPLOAD.AVATAR_MIME_TYPE)
    })
}
