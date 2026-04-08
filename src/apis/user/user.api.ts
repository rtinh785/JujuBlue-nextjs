import http from '@/apis/axios'
import { ProfileUpdateData } from '@/core/types/request.type'
import { UpdateProfileResponse, UploadAvatarResponse, UploadCoverPhotoResponse } from '@/core/types/respone.type'

const userApi = {
    me() {
        return http.get('auth/me')
    },
    getMyProfile() {
        return http.get('profiles/me')
    },
    updateMyProfile(data: ProfileUpdateData) {
        return http.patch<UpdateProfileResponse>('profiles/me', data)
    },
    uploadAvatar(file: File) {
        const form = new FormData()
        form.append('file', file)
        return http.post<UploadAvatarResponse>('profiles/avatar', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
    uploadCoverPhoto(file: File) {
        const form = new FormData()
        form.append('file', file)
        return http.post<UploadCoverPhotoResponse>('profiles/cover', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
    },
}

export default userApi
