'use client'
import { supabase } from '@/libs/supabase/client'
import { requestResetPassword, RequestResetPasswordFormValues } from '@/modules/ResetPassword/resetPassword'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const ResetPassword = () => {
    const router = useRouter()
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
        const { error } = await supabase.auth.updateUser({
            password: values.newPassword,
        })

        if (error) {
            toast.error(error.message, { position: 'top-left' })
        } else {
            toast.success('Mật khẩu đã được đặt lại thành công', { position: 'top-left' })
        }
        reset()
        router.push('/login')
    }

    return (
        <div className="flex h-full w-full items-center justify-center">
            <section className="bg-primary hidden h-full text-white lg:block lg:w-1/2">
                <div className="align-center flex h-full flex-col items-center justify-center p-8">
                    <div className="flex size-[96px] items-center justify-center rounded-[12px] bg-white px-[16px] py-[8px]">
                        <img src="/images/svg/logo.svg" alt="Juju Blue Logo" className="h-10 w-auto object-cover" />
                    </div>
                    <h1 className="mt-6 text-4xl font-bold">Juju Blue</h1>
                    <p className="mt-6 text-[18px] font-[500]">Elevate your discourse.</p>
                </div>
            </section>
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
                    <h1 className="pb-2 text-center text-3xl font-bold lg:text-left">Reset your password</h1>
                    <p className="mb-8 font-normal text-[#64748B]">Entern your new password</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* email */}
                        <div className="flex flex-col">
                            <label className="mb-[6px] text-sm font-medium text-[#0F172A]">Your new password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 focus:border focus:border-[#E2E8F0] focus:outline-none"
                                {...register('newPassword')}
                            />
                            <p className="mt-1 min-h-[21px] text-sm text-red-500">
                                {errors.newPassword ? errors.newPassword.message : ''}
                            </p>
                        </div>

                        <button className="bg-primary mt-[28px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white">
                            Send
                        </button>
                    </form>

                    <div className="pt-8 text-center">
                        <Link href="/register" className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                            Go back to Sign up
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ResetPassword
