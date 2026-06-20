import { getAccesTokenFromLS } from '@/utils/auth'
import { toast } from 'sonner'

export const requireAuthAction = (onAuthenticated: () => void) => {
    const accessToken = getAccesTokenFromLS()

    if (!accessToken) {
        toast.error('Please log in to continue.', { position: 'top-left' })
        return
    }

    onAuthenticated()
}
