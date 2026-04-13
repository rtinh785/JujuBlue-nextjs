'use client'

import InputField from '@/components/form/InputField'
import { AUTH_MESSAGES } from '@/core/constants/messages/auth/auth.messages'
import { envConfig } from '@/core/configs/env.config'

import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/modules/ForgotPassword/forgotPassword.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useForgotPasswordMutation } from '@/apis/auth/auth.query'
import { useGuestGuard } from '@/hooks/useGuestGuard'

const ForgotPassword = () => {
    useGuestGuard()
    const { mutateAsync: forgotPasswordMutation, isPending } = useForgotPasswordMutation()

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
        toast.success('Đã gửi email khôi phục mật khẩu', { position: 'top-left' })
        reset()
    } catch (error) {
        console.log('forgot password error:', error)
        toast.error('Gửi email thất bại', { position: 'top-left' })
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
                <h1 className="pb-2 text-center text-3xl font-bold lg:text-left lg:whitespace-nowrap">
                    Forgot Password?
                </h1>
                <p className="mb-8 font-normal text-[#64748B]">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField
                        label="Email address"
                        type="email"
                        placeholder="name@example.com"
                        name="email"
                        register={register}
                        errors={errors}
                    />

                    <button
                        disabled={isSubmitting}
                        className="bg-primary mt-[28px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white disabled:opacity-50"
                    >
                        {isSubmitting ? 'Sending...' : 'Send'}
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

export default ForgotPassword
