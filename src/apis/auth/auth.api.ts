import http from '@/apis/axios'

export const URL_LOGIN = 'auth/login'
export const URL_REGISTER = 'auth/register'
export const URL_LOGOUT = 'auth/logout'
export const URL_REFRESH_TOKEN = 'auth/refresh-access-token'

const authApi = {
    registerAccount(body: { email: string; password: string }) {
        return http.post(URL_REGISTER, body)
    },
    loginAccount(body: { email: string; password: string }) {
        return http.post(URL_LOGIN, body)
    },
    logoutAccount() {
        return http.post(URL_LOGOUT)
    },
}

export default authApi
