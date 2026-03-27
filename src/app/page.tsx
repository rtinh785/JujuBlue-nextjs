import ComposerCard from '@/components/home/ComposerCard'
import FeedPostCard from '@/components/home/FeedPostCard'
import ProfileSummaryCard from '@/components/home/ProfileSummaryCard'
import TrendingCard from '@/components/home/TrendingCard'
import SuggestedUsersCard from '@/components/home/SuggestedUsersCard'

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

const feedPosts: FeedPost[] = [
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

export default function Home() {
    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    {/* dang bai post */}
                    <ComposerCard />

                    {/* list bai post */}
                    <div className="space-y-4">
                        {feedPosts.map((post) => (
                            <FeedPostCard key={post.id} post={post} />
                        ))}
                    </div>
                    {/* loading cac bai post */}
                    <div className="flex justify-center pt-2">
                        <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                </section>

                <aside className="hidden space-y-4 lg:fixed lg:top-[88px] lg:right-[max(1rem,calc((100vw-1180px)/2+1rem))] lg:block lg:h-[calc(100vh-108px)] lg:w-[320px] lg:overflow-y-auto lg:pr-1">
                    {/* Profile Stats */}
                    <ProfileSummaryCard />
                    {/* Trending Topics */}
                    <TrendingCard />
                    {/* Suggested Users */}
                    <SuggestedUsersCard />

                    <div className="px-1 text-xs text-slate-400">
                        <p>Terms · Privacy · Cookies</p>
                        <p className="mt-1">© 2024 Juju Blue</p>
                    </div>
                </aside>
            </div>
        </main>
    )
}
