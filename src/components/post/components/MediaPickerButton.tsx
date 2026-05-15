'use client'

import { POST_MEDIA_INPUT } from '@/core/constants/post.constant'
import { ImagePlus } from 'lucide-react'

type Props = {
    disabled?: boolean
    multiple?: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const MediaPickerButton = ({ disabled = false, multiple = true, onChange }: Props) => {
    return (
        <label
            className={`flex size-8 cursor-pointer items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 ${
                disabled ? 'pointer-events-none opacity-50' : ''
            }`}
        >
            <ImagePlus className="size-4" />
            <input
                type="file"
                accept={POST_MEDIA_INPUT.ACCEPT}
                multiple={multiple}
                className="hidden"
                onChange={onChange}
                disabled={disabled}
            />
        </label>
    )
}

export default MediaPickerButton
