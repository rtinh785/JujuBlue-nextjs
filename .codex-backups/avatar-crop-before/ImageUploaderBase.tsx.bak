'use client'

import { useRef } from 'react'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'

type ImageUploaderBaseProps = {
    imageUrl?: string | null
    alt: string
    variant: 'avatar' | 'cover'
    onFileSelect?: (file: File) => void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

const ImageUploaderBase = ({ imageUrl, alt, variant, onFileSelect }: ImageUploaderBaseProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null)

    const currentImage = imageUrl ?? ''

    const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Vui long chon file anh')
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error('Anh phai nho hon 2MB')
            return
        }

        onFileSelect?.(file)
    }

    const imageClassName =
        variant === 'avatar'
            ? 'size-24 rounded-full object-cover sm:size-28'
            : 'h-36 w-full rounded-2xl object-cover sm:h-44'

    const overlayClassName = variant === 'avatar' ? 'rounded-full' : 'rounded-2xl'

    return (
        <div className="group relative inline-block">
            {currentImage ? (
                <img src={currentImage} alt={alt} className={imageClassName} />
            ) : (
                <div className={`bg-slate-100 ${imageClassName}`} />
            )}

            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100 ${overlayClassName}`}
            >
                <span className="flex size-10 items-center justify-center rounded-full bg-white/90 text-slate-800">
                    <Pencil className="size-4" />
                </span>
            </button>

            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleSelectFile} />
        </div>
    )
}

export default ImageUploaderBase
