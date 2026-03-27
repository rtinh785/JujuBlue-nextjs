import React from 'react'
interface Prob {
    value: string
    label: string
}

const Stat = ({ value, label }: Prob) => {
    return (
        <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
        </div>
    )
}

export default Stat
