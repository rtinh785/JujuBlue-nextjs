import MyButton from '@/components/MyButton'
import { ImagePlus } from 'lucide-react'
import React from 'react'

const currentProfile = {
    name: 'Sarah Jenkins',
    handle: '@sjenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    following: '248',
    followers: '1.2k',
    posts: '89',
}

const ComposerCard = () => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
                <img
                    src={currentProfile.avatar}
                    alt={currentProfile.name}
                    className="size-11 rounded-full object-cover"
                />

                <div className="min-w-0 flex-1">
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <div className="mt-5 flex items-center justify-between">
                        <button
                            type="button"
                            className="flex size-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                            <ImagePlus className="size-4" />
                        </button>

                        <MyButton href="/post" name="Post" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComposerCard
