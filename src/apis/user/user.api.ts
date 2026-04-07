import http from '@/apis/axios'

const userApi = {
    me() {
        return http.get('auth/me')
    },
}

export default userApi
