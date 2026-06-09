export const POST_VISIBILITY = {
    PUBLIC: 'public',
    FOLLOWERS: 'followers',
    PRIVATE: 'private',
} as const

export type PostVisibility = (typeof POST_VISIBILITY)[keyof typeof POST_VISIBILITY]

export const POST_VISIBILITY_LABEL = {
    [POST_VISIBILITY.PUBLIC]: 'Public',
    [POST_VISIBILITY.FOLLOWERS]: 'Followers',
    [POST_VISIBILITY.PRIVATE]: 'Private',
} as const

export const POST_VISIBILITY_DESCRIPTION = {
    [POST_VISIBILITY.PUBLIC]: 'Everyone can see this post.',
    [POST_VISIBILITY.FOLLOWERS]: 'Only your followers can see this post.',
    [POST_VISIBILITY.PRIVATE]: 'Only you can see this post.',
} as const

export const POST_VISIBILITY_VALUES = [
    POST_VISIBILITY.PUBLIC,
    POST_VISIBILITY.FOLLOWERS,
    POST_VISIBILITY.PRIVATE,
] as const

export const POST_TEXT = {
    EDIT_MEDIA_ALT: 'Edit media',
    MEDIA_PREVIEW_ALT: 'Media preview',
    UNKNOWN_AUTHOR: 'Unknown',
    COMPOSER_PLACEHOLDER: "What's on your mind?",
    SHARE_PLACEHOLDER: 'What do you want to say about this post?',
    EDIT_DIALOG_TITLE_PREFIX: 'Edit post by',
    SHARE_DIALOG_TITLE: 'Share post',
    DETAIL_TITLE_PREFIX: 'Post by',
    MEDIA_ALT: 'Post media',
    ORIGINAL_POST_UNAVAILABLE_TITLE: 'Original post is no longer available',
    ORIGINAL_POST_UNAVAILABLE_DESCRIPTION: 'The shared content was deleted or is no longer available.',
} as const

export const POST_MESSAGE = {
    MISSING_CONTENT_OR_MEDIA: 'Post must have content or media.',
    SHARE_UNAVAILABLE: 'Cannot share because the original post was deleted.',
} as const

export const COMMENT_TEXT = {
    SECTION_TITLE: 'Comments',
    PLACEHOLDER: 'Write a comment...',
    REPLY_PLACEHOLDER_PREFIX: 'Reply to',
    REPLY_FALLBACK_TARGET: 'comment',
    COMMENT_MEDIA_ALT: 'Comment media',
    REPLY_MEDIA_ALT: 'Reply media',
    EMPTY_TITLE: 'No comments yet',
    EMPTY_DESCRIPTION: 'Be the first to comment.',
    LOADING: 'Loading comments...',
} as const

export const COMMENT_DIALOG = {
    DELETE_TITLE: 'Delete comment?',
    DELETE_DESCRIPTION: 'This comment will be permanently deleted. This action cannot be undone.',
    DELETE_CONFIRM: 'Delete comment',
    DELETE_LOADING: 'Deleting...',
} as const

export const POST_DIALOG = {
    DELETE_TITLE: 'Delete post?',
    DELETE_DESCRIPTION: 'This post will be permanently deleted. This action cannot be undone.',
    DELETE_CONFIRM: 'Delete post',
    DELETE_LOADING: 'Deleting...',
} as const

export const POST_ACTION_LABEL = {
    CANCEL: 'Cancel',
    COMMENT: 'Comment',
    DELETE: 'Delete',
    EDIT: 'Edit',
    POST: 'Post',
    POSTING: 'Posting...',
    SAVE_CHANGES: 'Save changes',
    SAVING: 'Saving...',
    REPLY: 'Reply',
    SENDING: 'Sending...',
    SHARE: 'Share',
    SHARING: 'Sharing...',
} as const

export const POST_VALIDATION_MESSAGE = {
    CONTENT_MAX_280: 'Content must be at most 280 characters.',
    MEDIA_TYPE_INVALID: 'Only image or video files are allowed.',
    POST_CONTENT_OR_MEDIA_REQUIRED: 'Post must have content or media.',
} as const

export const POST_MEDIA_INPUT = {
    ACCEPT: 'image/*,video/*',
} as const

export const POST_MEDIA_TYPE = {
    IMAGE: 'image',
    VIDEO: 'video',
    IMAGE_PREFIX: 'image/',
    VIDEO_PREFIX: 'video/',
} as const

export const FEED_QUERY = {
    INITIAL_LIMIT: 5,
    LOAD_MORE_LIMIT: 5,
} as const
