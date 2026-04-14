type PostMediaItem = {
    url: string
    type: 'image' | 'video'
}
export type UploadMediaRes = { media: PostMediaItem[] }
