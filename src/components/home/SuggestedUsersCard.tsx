import React from 'react'

type SuggestedUser = {
    id: number
    name: string
    handle: string
    avatar: string
}

const suggestedUsers: SuggestedUser[] = [
    {
        id: 1,
        name: 'Alex Rivera',
        handle: '@arivera_design',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    },
    {
        id: 2,
        name: 'Samira Khan',
        handle: '@samira.k',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
    },
]

const SuggestedUsersCard = () => {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">Who to follow</h2>

            <div className="mt-4 space-y-4">
                {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.handle}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SuggestedUsersCard
