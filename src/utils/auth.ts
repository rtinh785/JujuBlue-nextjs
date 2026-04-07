export const saveAccesTokenToLS = (acces_token: string) => {
    localStorage.setItem('access_token', acces_token)
}

export const saveRefreshTokenToLS = (refresh_token: string) => {
    localStorage.setItem('refresh_token', refresh_token)
}

export const clearLocalStorage = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
}

export const getAccesTokenFromLS = () => localStorage.getItem('access_token') || ''
export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: any) => {
    localStorage.setItem('profile', JSON.stringify(profile))
}
