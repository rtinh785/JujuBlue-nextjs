import * as yup from 'yup'

export const composerSchema = yup.object({
    content: yup.string().default(''),
    visibility: yup
        .mixed<'public' | 'followers' | 'private'>()
        .oneOf(['public', 'followers', 'private'])
        .required()
        .default('public'),
    media: yup
        .mixed<FileList>()
        .test('content-or-media', 'Post must have content or media', function (value) {
            const content = this.parent.content?.trim()
            const hasMedia = !!value && value.length > 0
            return !!content || hasMedia
        })
        .test('file-type', 'Only image or video files are allowed', (value) => {
            if (!value || value.length === 0) return true

            return Array.from(value).every(
                (file) => file.type.startsWith('image/') || file.type.startsWith('video/'),
            )
        })
        .nullable()
        .default(null),
})

export type ComposerFormValues = yup.InferType<typeof composerSchema>
