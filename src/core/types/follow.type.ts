export type SuggestProfile = {
    id: string
    username: string
    display_name: string
    avatar_url: string | null
}

export type FollowRespone = {
    message: string
}

export type CheckIsFollow = {
    isFollowing: boolean
}

export type UnFollowRespone = {
    message: string
}
