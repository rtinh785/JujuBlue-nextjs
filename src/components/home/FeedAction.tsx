import { PostWithStatus } from '@/core/types/post.type'
import React, { ReactNode } from 'react'

interface Prob {
    icon: ReactNode
    value?: number
    active?: boolean
    disabled?: boolean
    handleOnClick?: () => void
}

const FeedAction = ({ icon, value, active = false, disabled = false, handleOnClick }: Prob) => {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`flex items-center gap-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                active ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
            }`}
            onClick={handleOnClick}
        >
            {icon}
            <span>{value}</span>
        </button>
    )
}

export default FeedAction
