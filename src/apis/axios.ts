import axios from 'axios'
import { envConfig } from '@/core/configs/env.config'
import {
    getAccesTokenFromLS,
    getRefreshTokenFromLS,
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

        if (!config.headers.Authorization && access_token) {
            config.headers.Authorization = `Bearer ${access_token}`
        }

        return config
    },
    (error) => Promise.reject(error),
)

http.interceptors.response.use(
    (response) => {
        const { url } = response.config

        if (url?.includes('login') || url?.includes('register') || url?.includes('refresh-access-token')) {
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
    async (error) => {
        const originalRequest = error.config as typeof error.config & { _retry?: boolean }

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('auth/refresh-access-token') &&
            !originalRequest.url?.includes('auth/login')
        ) {
            originalRequest._retry = true

            try {
                const refreshToken = getRefreshTokenFromLS()

                if (!refreshToken) {
                    clearLocalStorage()
                    return Promise.reject(error)
                }

                const refreshResponse = await axios.post(
                    `${envConfig.BASE_URL}auth/refresh-access-token`,
                    {
                        refresh_token: refreshToken,
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                )

                const { session, user } = refreshResponse.data

                if (session?.access_token) {
                    saveAccesTokenToLS(session.access_token)
                    originalRequest.headers.Authorization = `Bearer ${session.access_token}`
                }

                if (session?.refresh_token) {
                    saveRefreshTokenToLS(session.refresh_token)
                }

                if (user) {
                    setProfileToLS(user)
                }

                return http(originalRequest)
            } catch (refreshError) {
                clearLocalStorage()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

export default http
