'use client'

import { POST_ACTION_LABEL } from '@/core/constants/post.constant'
import { useLingui } from '@lingui/react/macro'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Props = {
    isDeleting?: boolean
    onEdit: () => void
    onDelete: () => void
}

const OwnerActionMenu = ({ isDeleting = false, onEdit, onDelete }: Props) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const { t } = useLingui()
    useEffect(() => {
        if (!menuOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [menuOpen])

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
                <MoreHorizontal className="size-4" />
            </button>

            {menuOpen && (
                <div className="absolute top-8 right-0 z-10 w-36 rounded-xl border border-slate-200 bg-white py-1 shadow-md">
                    <button
                        type="button"
                        onClick={() => {
                            onEdit()
                            setMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Pencil className="size-3.5" />
                        {t(POST_ACTION_LABEL.EDIT)}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onDelete()
                            setMenuOpen(false)
                        }}
                        disabled={isDeleting}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Trash2 className="size-3.5" />
                        {t(POST_ACTION_LABEL.DELETE)}
                    </button>
                </div>
            )}
        </div>
    )
}

export default OwnerActionMenu
