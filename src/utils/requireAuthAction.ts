import { AUTH_MESSAGE } from '@/core/constants/auth.constant'
import { getAccesTokenFromLS } from '@/utils/auth'
import { toast } from 'sonner'

export const requireAuthAction = (onAuthenticated: () => void) => {
    const accessToken = getAccesTokenFromLS()

    if (!accessToken) {
        toast.error(AUTH_MESSAGE.LOGIN_REQUIRED, { position: 'top-left' })
        return
    }

    onAuthenticated()
}
