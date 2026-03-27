import React, { ReactNode } from 'react'

interface Prob {
    icon: ReactNode
    value: number
    active?: boolean
}

const FeedAction = ({ icon, value, active = false }: Prob) => {
    return (
        <button
            type="button"
            className={`flex items-center gap-1.5 text-xs transition-colors ${
                active ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
            {icon}
            <span>{value}</span>
        </button>
    )
}

export default FeedAction
