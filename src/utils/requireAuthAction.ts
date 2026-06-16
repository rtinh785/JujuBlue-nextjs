import { AUTH_MESSAGE } from '@/core/constants/auth.constant'
import { getAccesTokenFromLS } from '@/utils/auth'
import { useLingui } from '@lingui/react/macro'
import { toast } from 'sonner'

export const requireAuthAction = (onAuthenticated: () => void) => {
    const accessToken = getAccesTokenFromLS()
    const { t } = useLingui()
    if (!accessToken) {
        toast.error(t(AUTH_MESSAGE.LOGIN_REQUIRED), { position: 'top-left' })
        return
    }

    onAuthenticated()
}
