export const PROFILE_TAB = {
    POSTS: 'posts',
    FOLLOWING: 'following',
} as const

export const PROFILE_TAB_LABEL = {
    POSTS: 'Posts',
    FOLLOWING: 'Following',
} as const

export const PROFILE_ACTION_LABEL = {
    FOLLOW: 'Follow',
    UNFOLLOW: 'Unfollow',
    MESSAGE: 'Message',
    EDIT_PROFILE: 'Edit Profile',
    CANCEL: 'Cancel',
    SAVE_CHANGES: 'Save changes',
    SAVING: 'Saving...',
} as const

export const PROFILE_TEXT = {
    AVATAR_ALT: 'Avatar',
    COVER_PREVIEW_ALT: 'Cover preview',
    CHANGE_COVER_PHOTO: 'Change cover photo',
    POSTS_EMPTY_TITLE: 'No posts yet',
    POSTS_EMPTY_DESCRIPTION: "This user's posts will appear here.",
    FOLLOWING_EMPTY_TITLE: 'Not following anyone yet',
    FOLLOWING_EMPTY_DESCRIPTION: 'People you follow will appear here.',
    UNFOLLOW_TARGET_FALLBACK: 'this user',
    EDIT_DIALOG_TITLE: 'Edit profile',
    EDIT_DIALOG_DESCRIPTION: 'Update the basic information shown on your profile.',
    DISPLAY_NAME_LABEL: 'Display name',
    DISPLAY_NAME_PLACEHOLDER: 'Enter display name',
    BIO_LABEL: 'Bio',
    BIO_PLACEHOLDER: 'Write a short introduction about yourself',
    LOCATION_LABEL: 'Location',
    LOCATION_PLACEHOLDER: 'Ho Chi Minh City',
    DATE_OF_BIRTH_LABEL: 'Date of birth',
    WEBSITE_LABEL: 'Website',
    WEBSITE_PLACEHOLDER: 'https://example.com',
    AVATAR_DIALOG_TITLE: 'Choose profile photo',
} as const

export const PROFILE_DIALOG = {
    UNFOLLOW_TITLE_PREFIX: 'Unfollow',
    UNFOLLOW_DESCRIPTION: 'You will no longer see this user in your following list.',
    UNFOLLOW_CONFIRM: 'Unfollow',
    UNFOLLOW_LOADING: 'Unfollowing...',
} as const

export const PROFILE_VALIDATION_MESSAGE = {
    DISPLAY_NAME_REQUIRED: 'Display name is required',
    DISPLAY_NAME_MAX: 'Display name must be at most 50 characters',
    BIO_MAX: 'Bio must be at most 160 characters',
    LOCATION_MAX: 'Location must be at most 80 characters',
    WEBSITE_INVALID: 'URL must look like https://www.example.com',
} as const

export const PROFILE_UPLOAD = {
    MAX_IMAGE_SIZE_BYTES: 2 * 1024 * 1024,
    INVALID_IMAGE_TYPE: 'Please choose an image file.',
    IMAGE_TOO_LARGE: 'Image must be smaller than 2MB.',
    CANVAS_CREATE_FAILED: 'Unable to create canvas.',
    IMAGE_BLOB_CREATE_FAILED: 'Unable to create image blob.',
    DEFAULT_AVATAR_FILE_NAME: 'avatar.jpg',
    AVATAR_MIME_TYPE: 'image/jpeg',
} as const
