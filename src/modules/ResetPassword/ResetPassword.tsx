'use client'

import InputField from '@/components/form/InputField'
import { useResetPasswordMutation } from '@/apis/auth/auth.query'
import { RequestResetPasswordFormValues, requestResetPassword } from '@/schema/resetPassword.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getResetAccessToken } from '@/utils'
import { useGuestGuard } from '@/hooks/useGuestGuard'
import { AUTH_LABEL, AUTH_MESSAGE, AUTH_TEXT } from '@/core/constants/auth.constant'
import { ROUTE } from '@/core/constants/route.constant'
import { useLingui } from '@lingui/react/macro'
import { useLocale } from '@/contexts/LocaleContext'

const ResetPassword = () => {
    useGuestGuard()
    const { t } = useLingui()
    const router = useRouter()
    const { mutateAsync: resetPasswordMutation } = useResetPasswordMutation()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RequestResetPasswordFormValues>({
        resolver: yupResolver(requestResetPassword),
        defaultValues: {
            newPassword: '',
        },
    })

    const onSubmit = async (values: RequestResetPasswordFormValues) => {
        const accessToken = getResetAccessToken()

        if (!accessToken) {
            toast.error(t(AUTH_MESSAGE.RESET_LINK_INVALID), { position: 'top-left' })
            return
        }

        try {
            await resetPasswordMutation({
                body: { new_password: values.newPassword },
                accessToken,
            })

            toast.success(t(AUTH_MESSAGE.RESET_PASSWORD_SUCCESS), { position: 'top-left' })
            reset()
            router.push(ROUTE.LOGIN)
        } catch (error) {
            console.log('reset password error:', error)
            toast.error(t(AUTH_MESSAGE.RESET_PASSWORD_FAILED), { position: 'top-left' })
        }
    }

    return (
        <section className="flex items-center justify-center bg-white px-4 py-8 text-black sm:px-6 md:px-10 lg:w-1/2 lg:px-16 xl:px-24">
            <div className="flex w-full max-w-[400px] flex-col px-4 md:min-w-[250px] md:px-0">
                <div className="mb-8 flex w-full items-center justify-center lg:hidden">
                    <div className="bg-primary flex size-[96px] items-center justify-center rounded-[12px] px-[16px] py-[8px]">
                        <img
                            src="/images/svg/logo-new.svg"
                            alt="Juju Blue Logo"
                            className="h-10 w-auto fill-[#fff] object-cover"
                        />
                    </div>
                </div>
                <h1 className="pb-2 text-center text-3xl font-bold whitespace-nowrap lg:text-left">
                    {t(AUTH_TEXT.RESET_PASSWORD_TITLE)}
                </h1>
                <p className="mb-8 font-normal text-[#64748B]">{t(AUTH_TEXT.RESET_PASSWORD_DESCRIPTION)}</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label={t(AUTH_TEXT.NEW_PASSWORD_LABEL)}
                        type="password"
                        placeholder={AUTH_TEXT.PASSWORD_PLACEHOLDER}
                        name="newPassword"
                        register={register}
                        errors={errors}
                    />

                    <button
                        disabled={isSubmitting}
                        className="bg-primary mt-[28px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white disabled:opacity-50"
                    >
                        {isSubmitting ? t(AUTH_LABEL.SAVING) : t(AUTH_LABEL.SEND)}
                    </button>
                </form>

                <div className="pt-8 text-center">
                    <Link href={ROUTE.REGISTER} className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                        {t(AUTH_LABEL.BACK_TO_SIGN_UP)}
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword
