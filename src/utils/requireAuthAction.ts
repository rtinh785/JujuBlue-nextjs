import { getAccesTokenFromLS } from '@/utils/auth'
import { toast } from 'sonner'

export const requireAuthAction = (onAuthenticated: () => void) => {
    const accessToken = getAccesTokenFromLS()

    if (!accessToken) {
        toast.error('Vui lòng đăng nhập để tiếp tục', { position: 'top-left' })
        return
    }

    onAuthenticated()
}
