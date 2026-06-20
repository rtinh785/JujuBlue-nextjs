export const saveAccesTokenToLS = (acces_token: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('access_token', acces_token)
}

export const saveRefreshTokenToLS = (refresh_token: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('refresh_token', refresh_token)
}

export const clearLocalStorage = () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
}

export const getAccesTokenFromLS = () => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('access_token') || ''
}

export const getRefreshTokenFromLS = () => {
    if (typeof window === 'undefined') return ''
    return localStorage.getItem('refresh_token') || ''
}

export const getProfileFromLS = () => {
    if (typeof window === 'undefined') return null
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: unknown) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('profile', JSON.stringify(profile))
}
