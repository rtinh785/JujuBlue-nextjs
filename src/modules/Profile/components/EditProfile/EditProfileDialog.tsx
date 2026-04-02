'use client'

import { Button } from '@/components/base/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/base/dialog'
import { Textarea } from '@/components/base/textarea'
import { EditProfileFormValues, editProfileSchema } from '@/modules/Profile/components/EditProfile/editProfile.schema'
import type { Profile } from '@/modules/Profile/profile.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const inputClassName =
    'w-full rounded-lg border border-slate-200 !bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:bg-white'

const inputErrorClassName =
    'w-full rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-red-500 focus:bg-white'

const labelClassName = 'text-xs font-medium text-slate-500'

type EditProfileDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: Profile
    onSubmit: (values: EditProfileFormValues) => Promise<void> | void
    isPending?: boolean
}

const EditProfileDialog = ({ open, onOpenChange, profile, isPending, onSubmit }: EditProfileDialogProps) => {
    const {
        register,
        handleSubmit,
        reset,

        formState: { errors, isSubmitting, isDirty },
    } = useForm<EditProfileFormValues>({
        resolver: yupResolver(editProfileSchema),
        defaultValues: {
            display_name: profile.display_name ?? '',
            bio: profile.bio ?? '',
            location: profile.location ?? '',
            website: profile.website ?? '',
            date_of_birth: profile.date_of_birth ?? '',
        },
    })

    useEffect(() => {
        if (open) {
            reset({
                display_name: profile.display_name ?? '',
                bio: profile.bio ?? '',
                location: profile.location ?? '',
                website: profile.website ?? '',
                date_of_birth: profile.date_of_birth ?? '',
            })
        }
    }, [open, profile, reset])

    const onFormSubmit = async (values: EditProfileFormValues) => {
        if (!isDirty) {
            onOpenChange(false)
            return
        }

        await onSubmit(values)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-2xl border border-slate-200 p-0 sm:max-w-[560px]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 px-5 py-4">
                    <DialogTitle className="text-sm font-semibold text-slate-900">Edit profile</DialogTitle>
                    <DialogDescription className="text-xs text-slate-400">
                        Cập nhật thông tin cơ bản hiển thị trên trang cá nhân.
                    </DialogDescription>
                </DialogHeader>

                <form className="pr-3 pb-4" onSubmit={handleSubmit(onFormSubmit)} noValidate>
                    <div className="grid gap-3 px-5 py-4">
                        {/* Display name */}
                        <div className="grid gap-1.5">
                            <label htmlFor="display_name" className={labelClassName}>
                                Tên hiển thị
                            </label>
                            <input
                                id="display_name"
                                type="text"
                                className={errors.display_name ? inputErrorClassName : inputClassName}
                                placeholder="Nhập tên hiển thị"
                                {...register('display_name')}
                            />
                            {errors.display_name && (
                                <p className="text-xs text-red-500">{errors.display_name.message}</p>
                            )}
                        </div>

                        {/* Bio */}
                        <div className="grid gap-1.5">
                            <label htmlFor="bio" className={labelClassName}>
                                Bio
                            </label>
                            <Textarea
                                id="bio"
                                className={`${errors.bio ? inputErrorClassName : inputClassName} min-h-[88px] resize-none focus-visible:ring-0`}
                                placeholder="Giới thiệu ngắn gọn về bạn"
                                {...register('bio')}
                            />
                            {errors.bio && <p className="text-xs text-red-500">{errors.bio.message}</p>}
                        </div>

                        {/* Location + Date of birth */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <label htmlFor="location" className={labelClassName}>
                                    Địa điểm
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    className={errors.location ? inputErrorClassName : inputClassName}
                                    placeholder="Ho Chi Minh City"
                                    {...register('location')}
                                />
                                {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                            </div>

                            <div className="grid gap-1.5">
                                <label htmlFor="date_of_birth" className={labelClassName}>
                                    Ngày sinh
                                </label>
                                <input
                                    id="date_of_birth"
                                    type="date"
                                    className={errors.date_of_birth ? inputErrorClassName : inputClassName}
                                    {...register('date_of_birth')}
                                />
                                {errors.date_of_birth && (
                                    <p className="text-xs text-red-500">{errors.date_of_birth.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Website */}
                        <div className="grid gap-1.5">
                            <label htmlFor="website" className={labelClassName}>
                                Website
                            </label>
                            <input
                                id="website"
                                type="url"
                                className={errors.website ? inputErrorClassName : inputClassName}
                                placeholder="https://example.com"
                                {...register('website')}
                            />
                            {errors.website && <p className="text-xs text-red-500">{errors.website.message}</p>}
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="border-t border-slate-100 bg-white px-5 py-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={!isDirty || isSubmitting || isPending}>
                            {isSubmitting || isPending ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog
