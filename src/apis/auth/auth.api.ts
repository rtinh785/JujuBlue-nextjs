import http from '@/apis/axios'

export const URL_LOGIN = 'auth/login'
export const URL_REGISTER = 'auth/register'
export const URL_LOGOUT = 'auth/logout'
export const URL_REFRESH_TOKEN = 'auth/refresh-access-token'
export const URL_FORGOT_PASSWORD = 'auth/forgot-password'
export const URL_RESET_PASSWORD = 'auth/reset-password'

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
        forgotPassword(body: { email: string }) {
        return http.post(URL_FORGOT_PASSWORD, body)
    },
    resetPassword(body: { new_password: string }, accessToken: string) {
        return http.post(URL_RESET_PASSWORD, body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
    },
}

export default authApi
