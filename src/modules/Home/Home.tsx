'use client'
import ComposerCard from '@/components/home/ComposerCard'
import PostCard from '@/components/post/PostCard'
import Aside from '@/components/layout/Aside'
import type { Post } from '@/core/types/post.type'
import React from 'react'
import { useCurrentUser } from '@/apis/user/user.query'

const feedPosts: Post[] = [
    {
        id: 1,
        author: 'Marcus Webb',
        handle: '@mwebb',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
        time: '3h',
        content:
            "Just finished reading 'The Design of Everyday Things' again. It's amazing how much of our environment is shaped by invisible decisions. Good design is truly invisible.",
        comments: 12,
        reposts: 4,
        likes: 89,
    },
    {
        id: 2,
        author: 'Elena Rodriguez',
        handle: '@elenarod',
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80',
        time: '5h',
        content:
            'Weekend project complete! Finally got my minimal desk setup sorted. Sometimes less really is more when you need to focus.',
        image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80',
        comments: 24,
        reposts: 2,
        likes: 215,
    },
    {
        id: 3,
        author: 'David Chen',
        handle: '@dchen',
        avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=160&q=80',
        time: '4h',
        content: 'Looks incredibly clean! What monitor arm are you using there?',
        comments: 3,
        reposts: 1,
        likes: 12,
    },
]

const Home = () => {
    const { data: user } = useCurrentUser()

    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    {user && <ComposerCard />}

                    {/* list bai post */}
                    <div className="space-y-4">
                        {feedPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                    {/* loading cac bai post */}
                    <div className="flex justify-center pt-2">
                        <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                </section>

                <Aside user={user} />
            </div>
        </main>
    )
}

export default Home
