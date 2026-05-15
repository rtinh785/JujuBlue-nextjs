import {
    POST_MEDIA_TYPE,
    POST_VALIDATION_MESSAGE,
    POST_VISIBILITY,
    POST_VISIBILITY_VALUES,
    type PostVisibility,
} from '@/core/constants/post.constant'
import * as yup from 'yup'

export const composerSchema = yup.object({
    content: yup.string().default(''),
    visibility: yup
        .mixed<PostVisibility>()
        .oneOf([...POST_VISIBILITY_VALUES])
        .required()
        .default(POST_VISIBILITY.PUBLIC),
    media: yup
        .mixed<FileList>()
        .test('content-or-media', POST_VALIDATION_MESSAGE.POST_CONTENT_OR_MEDIA_REQUIRED, function (value) {
            const content = this.parent.content?.trim()
            const hasMedia = !!value && value.length > 0

            return !!content || hasMedia
        })
        .test('file-type', POST_VALIDATION_MESSAGE.MEDIA_TYPE_INVALID, (value) => {
            if (!value || value.length === 0) return true

            return Array.from(value).every(
                (file) =>
                    file.type.startsWith(POST_MEDIA_TYPE.IMAGE_PREFIX) ||
                    file.type.startsWith(POST_MEDIA_TYPE.VIDEO_PREFIX),
            )
        })
        .nullable()
        .default(null),
})

export type ComposerFormValues = yup.InferType<typeof composerSchema>
