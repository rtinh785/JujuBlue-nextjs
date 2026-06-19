import Messages from '@/modules/Messages/Messages'
import { Suspense } from 'react'

export default function MessagesPage() {
    return (
        <Suspense fallback={null}>
            <Messages />
        </Suspense>
    )
}
