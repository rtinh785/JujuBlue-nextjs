import React, { ReactNode } from 'react'

interface Prob {
    icon: ReactNode
    value?: number
    active?: boolean
    handleOnClick?: () => void
}

const FeedAction = ({ icon, value, active = false, handleOnClick }: Prob) => {
    return (
        <button
            type="button"
            className={`flex items-center gap-1.5 text-xs transition-colors ${
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
