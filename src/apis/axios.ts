import axios from 'axios'
import { envConfig } from '@/core/configs/env.config'
import {
    getAccesTokenFromLS,
    saveAccesTokenToLS,
    saveRefreshTokenToLS,
    setProfileToLS,
    clearLocalStorage,
} from '@/utils/auth'

const http = axios.create({
    baseURL: envConfig.BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use(
    (config) => {
        const access_token = getAccesTokenFromLS()
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

http.interceptors.response.use(
    (response) => {
        const { url } = response.config

        if (url?.includes('login') || url?.includes('register')) {
            const { session, user } = response.data

            if (session?.access_token) {
                saveAccesTokenToLS(session.access_token)
            }
            if (session?.refresh_token) {
                saveRefreshTokenToLS(session.refresh_token)
            }
            if (user) {
                setProfileToLS(user)
            }
        } else if (url?.includes('logout')) {
            clearLocalStorage()
        }

        return response
    },
    (error) => Promise.reject(error),
)

export default http
