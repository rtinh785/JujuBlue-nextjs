'use client'

import { useEffect, useRef } from 'react'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const AutoResizeTextarea = ({ value, onChange, className = '', rows = 1, ...props }: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    const resizeTextarea = () => {
        const textarea = textareaRef.current
        if (!textarea) return

        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    useEffect(() => {
        resizeTextarea()
    }, [value])

    return (
        <textarea
            ref={textareaRef}
            rows={rows}
            value={value}
            onChange={(event) => {
                onChange?.(event)
                resizeTextarea()
            }}
            className={`resize-none outline-none ${className}`}
            {...props}
        />
    )
}

export default AutoResizeTextarea
