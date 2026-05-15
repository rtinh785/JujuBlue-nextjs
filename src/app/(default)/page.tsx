import { ROUTE } from '@/core/constants/route.constant'
import { redirect } from 'next/navigation'

export default function Home() {
    redirect(ROUTE.HOME)
}
