import * as yup from 'yup'

export const sharePostSchema = yup.object({
    content: yup.string().trim().max(5000).default(''),
    visibility: yup
        .mixed<'public' | 'followers' | 'private'>()
        .oneOf(['public', 'followers', 'private'])
        .required()
        .default('public'),
})

export type SharePostFormValues = yup.InferType<typeof sharePostSchema>
