import {
    POST_VALIDATION_MESSAGE,
    POST_VISIBILITY,
    POST_VISIBILITY_VALUES,
    type PostVisibility,
} from '@/core/constants/post.constant'
import * as yup from 'yup'

export const editPostSchema = yup.object({
    content: yup.string().trim().max(280, POST_VALIDATION_MESSAGE.CONTENT_MAX_280).default(''),
    visibility: yup
        .mixed<PostVisibility>()
        .oneOf([...POST_VISIBILITY_VALUES])
        .default(POST_VISIBILITY.PUBLIC),
})

export type EditPostFormValues = yup.InferType<typeof editPostSchema>
