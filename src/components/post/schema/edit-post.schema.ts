import * as yup from 'yup'

export const editPostSchema = yup.object({
    content: yup.string().trim().max(280, 'Nội dung tối đa 280 ký tự').default(''),
    visibility: yup
        .mixed<'public' | 'followers' | 'private'>()
        .oneOf(['public', 'followers', 'private'])
        .default('public'),
})

export type EditPostFormValues = yup.InferType<typeof editPostSchema>
