'use client'

import PostCard from '@/components/home/FeedPostCard'
import { Post } from '@/core/types/post.type'
const profile = {
    name: 'Alex Rivera',
    handle: '@arivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    bio: 'Product Designer building clean interfaces. Obsessed with typography, whitespace, and systems that scale. Coffee enthusiast.',
    location: 'San Francisco, CA',
}

const profilePosts: Post[] = [
    {
        id: 1,
        content:
            'Just pushed the new design system update. Focusing entirely on structural clarity and stripping away non-essential visual noise. The new primary blue feels incredibly fresh.',
        time: '2h',
        comments: 12,
        reposts: 4,
        likes: 89,
    },
    {
        id: 2,
        content: 'Minimal desk setup check. Nothing but essentials.',
        time: 'Oct 12',
        image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80',
        comments: 45,
        reposts: 12,
        likes: 342,
    },
]
const PostsTab = () => {
    return (
        <section className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            {profilePosts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    fallbackAuthor={profile.name}
                    fallbackHandle={profile.handle}
                    fallbackAvatar={profile.avatar}
                />
            ))}
        </section>
    )
}

export default PostsTab
