'use client'

import InputField from '@/components/form/InputField'
import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/schema/forgotPassword.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { useForgotPasswordMutation } from '@/apis/auth/auth.query'
import { useGuestGuard } from '@/hooks/useGuestGuard'
import { AUTH_LABEL, AUTH_MESSAGE, AUTH_TEXT } from '@/core/constants/auth.constant'
import { ROUTE } from '@/core/constants/route.constant'
import { useLingui } from '@lingui/react/macro'

const ForgotPassword = () => {
    useGuestGuard()

    const { mutateAsync: forgotPasswordMutation } = useForgotPasswordMutation()
    const { t } = useLingui()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        resolver: yupResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (values: { email: string }) => {
        try {
            await forgotPasswordMutation({ email: values.email })
            toast.success(t(AUTH_MESSAGE.FORGOT_PASSWORD_SUCCESS), { position: 'top-left' })
            reset()
        } catch (error) {
            console.log('forgot password error:', error)
            toast.error(t(AUTH_MESSAGE.FORGOT_PASSWORD_FAILED), { position: 'top-left' })
        }
    }

    return (
        <div
            className={`flex w-full max-w-[465px] flex-col px-4 transition-all duration-500 ease-out md:min-w-[280px] md:px-0 ${
                isMounted ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
        >
            <div className="mb-8 flex w-full items-center justify-center lg:hidden">
                <div className="bg-primary flex size-[96px] items-center justify-center rounded-[12px] px-[16px] py-[8px]">
                    <img
                        src="/images/svg/logo-new.svg"
                        alt="Juju Blue Logo"
                        className="h-10 w-auto fill-[#fff] object-cover"
                    />
                </div>
            </div>
            <h1 className="pb-2 text-center text-2xl font-bold tracking-tight lg:text-left lg:text-[28px] lg:whitespace-nowrap">
                {t(AUTH_TEXT.FORGOT_PASSWORD_TITLE)}
            </h1>
            <p className="mb-7 text-sm leading-relaxed font-normal text-[#64748B]">
                {t(AUTH_TEXT.FORGOT_PASSWORD_DESCRIPTION)}
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
                <InputField
                    label={t(AUTH_TEXT.EMAIL_LABEL)}
                    type="email"
                    placeholder={AUTH_TEXT.EMAIL_PLACEHOLDER}
                    name="email"
                    register={register}
                    errors={errors}
                />

                <button
                    disabled={isSubmitting}
                    className="bg-primary mt-5 w-full rounded-lg px-2 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                >
                    {isSubmitting ? t(AUTH_LABEL.SENDING) : t(AUTH_LABEL.SEND)}
                </button>
            </form>

            <div className="pt-7 text-center">
                <Link
                    href={ROUTE.REGISTER}
                    className="text-primary pl-1 text-sm font-semibold transition-opacity hover:underline hover:opacity-80"
                >
                    {t(AUTH_LABEL.BACK_TO_SIGN_UP)}
                </Link>
            </div>
        </div>
    )
}

export default ForgotPassword
