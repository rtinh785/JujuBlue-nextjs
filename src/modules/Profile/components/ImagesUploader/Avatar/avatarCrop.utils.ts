import { PROFILE_UPLOAD } from '@/core/constants/profile.constant'
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

    if (!ctx) {
        throw new Error('Cannot create canvas.')
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
                reject(new Error('Failed to create image blob.'))
                return
            }

            resolve(file)
        }, PROFILE_UPLOAD.AVATAR_MIME_TYPE)
    })
}
