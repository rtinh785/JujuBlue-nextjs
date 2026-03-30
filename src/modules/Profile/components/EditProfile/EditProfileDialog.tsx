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
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300 focus:bg-white'
const labelClassName = 'text-sm font-medium text-slate-800'

type EditProfileDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: Profile
}

const EditProfileDialog = ({ open, onOpenChange, profile }: EditProfileDialogProps) => {
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

    const onSubmit = (values: EditProfileFormValues) => {
        if (!isDirty) {
            onOpenChange(false)
            return
        }

        console.log('Edit profile values:', values)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-3xl border border-slate-200 p-0 sm:max-w-[680px]">
                <DialogHeader className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
                    <DialogTitle className="text-lg font-semibold text-slate-900">Edit profile</DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Cap nhat thong tin co ban se hien tren trang ca nhan cua ban.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-5 py-5 sm:px-6" noValidate>
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <label htmlFor="display_name" className={labelClassName}>
                                Ten hien thi
                            </label>
                            <input
                                id="display_name"
                                type="text"
                                className={inputClassName}
                                placeholder="Nhap ten hien thi"
                                {...register('display_name')}
                            />
                            <p className="min-h-5 text-xs text-red-500">{errors.display_name?.message ?? ''}</p>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="bio" className={labelClassName}>
                                Bio
                            </label>
                            <Textarea
                                id="bio"
                                className="min-h-[120px] resize-none rounded-xl border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus-visible:border-slate-300"
                                placeholder="Gioi thieu ngan gon ve ban"
                                {...register('bio')}
                            />
                            <p className="min-h-5 text-xs text-red-500">{errors.bio?.message ?? ''}</p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <label htmlFor="location" className={labelClassName}>
                                    Dia diem
                                </label>
                                <input
                                    id="location"
                                    type="text"
                                    className={inputClassName}
                                    placeholder="Vi du: Ho Chi Minh City"
                                    {...register('location')}
                                />
                                <p className="min-h-5 text-xs text-red-500">{errors.location?.message ?? ''}</p>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="date_of_birth" className={labelClassName}>
                                    Ngay sinh
                                </label>
                                <input
                                    id="date_of_birth"
                                    type="date"
                                    className={inputClassName}
                                    {...register('date_of_birth')}
                                />
                                <p className="min-h-5 text-xs text-red-500">{errors.date_of_birth?.message ?? ''}</p>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="website" className={labelClassName}>
                                Website
                            </label>
                            <input
                                id="website"
                                type="url"
                                className={inputClassName}
                                placeholder="https://example.com"
                                {...register('website')}
                            />
                            <p className="min-h-5 text-xs text-red-500">{errors.website?.message ?? ''}</p>
                        </div>
                    </div>

                    <DialogFooter className="mx-0 mb-0 rounded-none border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!isDirty || isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditProfileDialog
