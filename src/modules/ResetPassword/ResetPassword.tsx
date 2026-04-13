'use client'

import InputField from '@/components/form/InputField'
import { AUTH_MESSAGES } from '@/core/constants/messages/auth/auth.messages'
import { useResetPasswordMutation } from '@/apis/auth/auth.query'
import { RequestResetPasswordFormValues, requestResetPassword } from '@/modules/ResetPassword/resetPassword.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getResetAccessToken } from '@/utils'
import { useGuestGuard } from '@/hooks/useGuestGuard'

const ResetPassword = () => {
    useGuestGuard()
    const router = useRouter()
    const { mutateAsync: resetPasswordMutation, isPending } = useResetPasswordMutation()

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
        toast.error('Link reset không hợp lệ hoặc đã hết hạn', { position: 'top-left' })
        return
    }

    try {
        await resetPasswordMutation({
            body: { new_password: values.newPassword },
            accessToken,
        })

        toast.success(AUTH_MESSAGES.resetPasswordSuccess, { position: 'top-left' })
        reset()
        router.push('/login')
    } catch (error) {
        console.log('reset password error:', error)
        toast.error('Đổi mật khẩu thất bại', { position: 'top-left' })
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
                    Reset your password
                </h1>
                <p className="mb-8 font-normal text-[#64748B]">Enter your new password</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="Your new password"
                        type="password"
                        placeholder="........"
                        name="newPassword"
                        register={register}
                        errors={errors}
                    />

                    <button
                        disabled={isSubmitting}
                        className="bg-primary mt-[28px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white disabled:opacity-50"
                    >
                        {isSubmitting ? 'Saving...' : 'Send'}
                    </button>
                </form>

                <div className="pt-8 text-center">
                    <Link href="/register" className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                        Go back to Sign up
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default ResetPassword
