import Link from 'next/link'

import React from 'react'

interface MyButtonProps {
    href: string
    name: string
}

const MyButton = ({ href, name }: MyButtonProps) => {
   
    return (
        <Link
            href={href}
            className="cursor-pointer rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
            {name}
        </Link>
    )
}

export default MyButton
