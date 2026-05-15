import { POST_VISIBILITY, POST_VISIBILITY_VALUES, type PostVisibility } from '@/core/constants/post.constant'
import * as yup from 'yup'

export const sharePostSchema = yup.object({
    content: yup.string().trim().max(5000).default(''),
    visibility: yup
        .mixed<PostVisibility>()
        .oneOf([...POST_VISIBILITY_VALUES])
        .required()
        .default(POST_VISIBILITY.PUBLIC),
})

export type SharePostFormValues = yup.InferType<typeof sharePostSchema>
