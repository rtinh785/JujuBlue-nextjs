import FeedAction from '@/components/home/FeedAction'
import { MessageCircle, Repeat2, Heart, Share2 } from 'lucide-react'
import React from 'react'

type FeedPost = {
    id: number
    author: string
    handle: string
    avatar: string
    time: string
    content: string
    image?: string
    comments: number
    reposts: number
    likes: number
}

interface Prop {
    post: FeedPost
}

const FeedPostCard = ({ post }: Prop) => {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
                <img src={post.avatar} alt={post.author} className="size-11 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{post.author}</h3>
                        <span className="text-xs text-slate-400">{post.handle}</span>
                        <span className="text-xs text-slate-300">{post.time}</span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.content}</p>

                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.author}
                            className="mt-4 h-[260px] w-full rounded-2xl object-cover sm:h-[340px]"
                        />
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <FeedAction icon={<MessageCircle className="size-4" />} value={post.comments} />
                        <FeedAction icon={<Repeat2 className="size-4" />} value={post.reposts} />
                        <FeedAction icon={<Heart className="size-4 fill-current" />} value={post.likes} active />
                        <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
                            <Share2 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default FeedPostCard
