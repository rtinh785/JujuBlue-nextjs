import FeedAction from '@/components/home/FeedAction'
import { Post } from '@/core/types/post.type'
import { MessageCircle, Repeat2, Heart, Share2, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { formatPostTime } from '../../utils/helper'
import { VISIBILITY_LABEL_MAP } from '@/core/constants/common.constant'

type Props = {
    currentUserId?: string
    post: Post
    onEdit?: (post: Post) => void
    onDelete?: (postId: string) => void
}

const PostCard = ({ post, currentUserId, onEdit, onDelete }: Props) => {
    const isOwner = currentUserId === post.author?.id
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!menuOpen) return
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [menuOpen])

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
                {post.author?.avatar_url ? (
                    <img
                        src={post.author.avatar_url}
                        alt={post.author.display_name}
                        className="size-11 rounded-full object-cover"
                    />
                ) : (
                    <div className="size-11 rounded-full bg-slate-200" />
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900">
                                {post.author?.display_name ?? 'Unknown'}
                            </h3>

                            {post.author?.username ? (
                                <span className="text-xs text-slate-400">@{post.author.username}</span>
                            ) : null}

                            <span className="text-xs text-slate-300">{formatPostTime(post.created_at)}</span>
                        </div>

                        {isOwner && (
                            <div ref={menuRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                >
                                    <MoreHorizontal className="size-4" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute top-8 right-0 z-10 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-md">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onEdit?.(post)
                                                setMenuOpen(false)
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                        >
                                            <Pencil className="size-3.5" />
                                            Chỉnh sửa
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onDelete?.(post.id)
                                                setMenuOpen(false)
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="size-3.5" />
                                            Xoá
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="mt-[-4px] w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
                        {VISIBILITY_LABEL_MAP[post.visibility]}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.content}</p>
                    {post.media && post.media.length > 0 && (
                        <div className="mt-4 space-y-3">
                            {post.media.map((item, index) => {
                                if (item.type === 'image') {
                                    return (
                                        <img
                                            key={`${item.url}-${index}`}
                                            src={item.url}
                                            alt={post.author.display_name}
                                            className="max-h-[500px] min-h-[200px] w-full rounded-2xl object-cover"
                                        />
                                    )
                                }

                                return (
                                    <video
                                        key={`${item.url}-${index}`}
                                        src={item.url}
                                        controls
                                        className="max-h-[500px] min-h-[200px] w-full rounded-2xl object-cover"
                                    />
                                )
                            })}
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <FeedAction icon={<Heart className="size-4 fill-current" />} value={post.likes_count} active />
                        <FeedAction icon={<MessageCircle className="size-4" />} value={post.comments_count} />
                        <FeedAction icon={<Repeat2 className="size-4" />} value={0} />

                        <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
                            <Share2 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PostCard
