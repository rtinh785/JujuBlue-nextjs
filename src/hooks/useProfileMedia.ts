import { useEffect, useRef, useState } from 'react'
import { clampCoverOffsetY } from '@/utils/helper'

export const useProfileMedia = () => {
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false)
    const [selectedAvatarSrc, setSelectedAvatarSrc] = useState<string | null>(null)

    const coverPhotoInputRef = useRef<HTMLInputElement | null>(null)
    const [selectedCoverPhotoSrc, setSelectedCoverPhotoSrc] = useState<string | null>(null)
    const [isEditingCoverPhoto, setIsEditingCoverPhoto] = useState(false)
    const [coverPhotoOffsetX, setCoverPhotoOffsetX] = useState(0)
    const [coverPhotoOffsetY, setCoverPhotoOffsetY] = useState(0)
    const [savedCoverPhotoOffsetY, setSavedCoverPhotoOffsetY] = useState(0)
    const [selectedCoverPhotoFile, setSelectedCoverPhotoFile] = useState<File | null>(null)

    const handleSelectAvatar = (file: File) => {
        setSelectedAvatarSrc(URL.createObjectURL(file))
        setIsAvatarDialogOpen(true)
    }

    const handleCancelAvatarDialog = () => {
        setIsAvatarDialogOpen(false)
        setSelectedAvatarSrc(null)
    }

    const handleSelectCoverPhoto = (file: File) => {
        setSelectedCoverPhotoFile(file)
        setCoverPhotoOffsetX(0)
        setSelectedCoverPhotoSrc(URL.createObjectURL(file))
        setCoverPhotoOffsetY(0)
        setSavedCoverPhotoOffsetY(0)
        setIsEditingCoverPhoto(true)
    }

    const handleCancelCoverPhoto = () => {
        setSelectedCoverPhotoSrc(null)
        setCoverPhotoOffsetX(0)
        setCoverPhotoOffsetY(0)
        setSavedCoverPhotoOffsetY(0)
        setIsEditingCoverPhoto(false)
        setSelectedCoverPhotoFile(null)
    }

    const handleOpenCoverPhotoPicker = () => {
        coverPhotoInputRef.current?.click()
    }

    const handleCoverCropChange = (nextCrop: { x: number; y: number }) => {
        setCoverPhotoOffsetX(nextCrop.x)
        setCoverPhotoOffsetY(clampCoverOffsetY(nextCrop.y))
    }

    useEffect(() => {
        return () => {
            if (selectedAvatarSrc) {
                URL.revokeObjectURL(selectedAvatarSrc)
            }

            if (selectedCoverPhotoSrc) {
                URL.revokeObjectURL(selectedCoverPhotoSrc)
            }
        }
    }, [selectedAvatarSrc, selectedCoverPhotoSrc])

    return {
        isAvatarDialogOpen,
        setIsAvatarDialogOpen,
        selectedAvatarSrc,
        setSelectedAvatarSrc,
        coverPhotoInputRef,
        selectedCoverPhotoSrc,
        isEditingCoverPhoto,
        setIsEditingCoverPhoto,
        coverPhotoOffsetX,
        coverPhotoOffsetY,
        savedCoverPhotoOffsetY,
        setSavedCoverPhotoOffsetY,
        selectedCoverPhotoFile,
        setSelectedCoverPhotoFile,
        handleSelectAvatar,
        handleCancelAvatarDialog,
        handleSelectCoverPhoto,
        handleCancelCoverPhoto,
        handleOpenCoverPhotoPicker,
        handleCoverCropChange,
    }
}
