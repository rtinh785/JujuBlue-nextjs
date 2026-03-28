import FeedAction from '@/components/home/FeedAction'
import Aside from '@/components/layout/Aside'
import { CalendarDays, Heart, MapPin, MessageCircle, Repeat2, Share2 } from 'lucide-react'

type Connection = {
    id: number
    name: string
    handle: string
    avatar: string
}

type ProfilePost = {
    id: number
    content: string
    time: string
    image?: string
    comments: number
    reposts: number
    likes: number
}

const profile = {
    name: 'Alex Rivera',
    handle: '@arivera',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    bio: 'Product Designer building clean interfaces. Obsessed with typography, whitespace, and systems that scale. Coffee enthusiast.',
    location: 'San Francisco, CA',
    joinedAt: 'Joined March 2023',
}

const glanceStats = [
    { value: '1,248', label: 'Followers' },
    { value: '842', label: 'Following' },
    { value: '342', label: 'Posts' },
    { value: '89', label: 'Connections' },
]

const mutualConnections: Connection[] = [
    {
        id: 1,
        name: 'Sarah Jenkins',
        handle: '@sjenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    },
    {
        id: 2,
        name: 'David Chen',
        handle: '@dchen_design',
        avatar: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=160&q=80',
    },
    {
        id: 3,
        name: 'Maya Patel',
        handle: '@mayap',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=160&q=80',
    },
]

const profilePosts: ProfilePost[] = [
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

function AtGlanceCard() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">At a Glance</h2>

            <div className="mt-4 grid grid-cols-2 gap-4">
                {glanceStats.map((stat) => (
                    <div key={stat.label}>
                        <p className="text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
                        <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}

function MutualConnectionsCard() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
            <h2 className="text-sm font-semibold text-slate-900">Mutual Connections</h2>

            <div className="mt-4 space-y-4">
                {mutualConnections.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.handle}</p>
                            </div>
                        </div>

                        <button type="button" className="text-sm font-semibold text-blue-500 hover:text-blue-600">
                            Follow
                        </button>
                    </div>
                ))}
            </div>

            <button type="button" className="mt-4 text-sm font-medium text-blue-500 hover:text-blue-600">
                Show more
            </button>
        </section>
    )
}

function ProfilePostCard({ post }: { post: ProfilePost }) {
    return (
        <article className="border-b border-slate-200 px-5 py-5 last:border-none">
            <div className="flex items-start gap-3">
                <img src={profile.avatar} alt={profile.name} className="size-11 rounded-full object-cover" />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{profile.name}</h3>
                        <span className="text-xs text-slate-400">{profile.handle}</span>
                        <span className="text-xs text-slate-300">{post.time}</span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.content}</p>

                    {post.image && (
                        <img
                            src={post.image}
                            alt={profile.name}
                            className="mt-4 h-[260px] w-full rounded-2xl object-cover sm:h-[340px]"
                        />
                    )}

                    <div className="mt-4 flex items-center gap-8">
                        <FeedAction icon={<MessageCircle className="size-4" />} value={post.comments} />
                        <FeedAction icon={<Repeat2 className="size-4" />} value={post.reposts} />
                        <FeedAction icon={<Heart className="size-4 fill-current" />} value={post.likes} />
                        <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
                            <Share2 className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default function ProfilePage() {
    return (
        <main className="mx-auto w-full max-w-[1180px] px-3 pt-4 pb-10 lg:px-4">
            <div className="relative lg:pr-[344px]">
                <section className="space-y-4">
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        <div className="h-28 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 sm:h-36" />

                        <div className="px-5 pb-5">
                            <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="size-20 rounded-full object-cover ring-4 ring-white sm:size-24"
                                />

                                <div className="flex items-center gap-2 sm:justify-end">
                                    <button
                                        type="button"
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        type="button"
                                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                                    >
                                        Message
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3">
                                <h1 className="text-[28px] font-semibold tracking-tight text-slate-900">
                                    {profile.name}
                                </h1>
                                <p className="text-sm text-slate-400">{profile.handle}</p>
                            </div>

                            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{profile.bio}</p>

                            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="size-4" />
                                    <span>{profile.location}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CalendarDays className="size-4" />
                                    <span>{profile.joinedAt}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center gap-6 border-b border-slate-200">
                                <button
                                    type="button"
                                    className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900"
                                >
                                    Posts
                                </button>
                                <button type="button" className="pb-3 text-sm font-medium text-slate-400">
                                    Replies
                                </button>
                                <button type="button" className="pb-3 text-sm font-medium text-slate-400">
                                    Likes
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                        {profilePosts.map((post) => (
                            <ProfilePostCard key={post.id} post={post} />
                        ))}
                    </section>

                    <div className="flex justify-center pt-2">
                        <div className="size-7 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                    </div>
                </section>
                <Aside showTrending={false} />
            </div>
        </main>
    )
}
