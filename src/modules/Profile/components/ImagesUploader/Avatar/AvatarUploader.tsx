import ImageUploaderBase from '@/modules/Profile/components/ImagesUploader/ImageUploaderBase'

type AvatarUploaderProps = {
    avatarUrl?: string | null
    alt: string
    onFileSelect?: (file: File) => void
}

const AvatarUploader = ({ avatarUrl, alt, onFileSelect }: AvatarUploaderProps) => {
    return <ImageUploaderBase imageUrl={avatarUrl} alt={alt} variant="avatar" onFileSelect={onFileSelect} />
}

export default AvatarUploader
