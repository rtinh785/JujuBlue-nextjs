'use client'
import Link from 'next/link'
import { supabase } from '@/libs/supabase/client'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterFormValues } from './register.schema'
import { toast } from 'sonner'
import { useState } from 'react'

const Register = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async (values: RegisterFormValues) => {
        const { error } = await supabase.auth.signUp({
            email: values.email,
            password: values.password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
            },
        })

        if (error) {
            toast.error(error.message, { position: 'top-left' })
            return
        }

        toast.success('Dang ky thanh cong, vui long kiem tra email de xac thuc tai khoan', { position: 'top-left' })
        reset()
    }

    const handleGoogleRegister = async () => {
        setIsGoogleLoading(true)

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            },
        })

        if (error) {
            toast.error(error.message, { position: 'top-left' })
            setIsGoogleLoading(false)
        }
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
                    <h1 className="pb-2 text-center text-2xl font-bold lg:text-left lg:text-3xl">Nice to meet you!</h1>
                    <p className="mb-5 font-normal text-[#64748B]">Enter your details to create an account.</p>

                    <button
                        type="button"
                        onClick={handleGoogleRegister}
                        disabled={isGoogleLoading}
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-[13px] text-sm font-medium text-gray-500 disabled:opacity-50"
                    >
                        <img src="/images/svg/google-icon.svg" alt="google-icon" className="size-5" />
                        <span className="font-semibold text-[#0F172A]">
                            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                        </span>
                    </button>

                    <div className="my-3 flex items-center gap-4 md:my-6">
                        <hr className="flex-1 border-gray-200" />
                        <span className="text-sm text-gray-400">or</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        {/* email */}
                        <div className="flex flex-col">
                            <label className="mb-[6px] text-sm font-medium text-[#0F172A]">Email address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 focus:border focus:border-[#E2E8F0] focus:outline-none"
                                {...register('email')}
                            />

                            <p className="mt-1 min-h-[21px] text-sm text-red-500">
                                {errors.email ? errors.email.message : ''}
                            </p>
                        </div>
                        {/* password */}
                        <div className="mt-[10px] flex flex-col">
                            <div className="flex justify-between">
                                <label className="mb-[6px] text-sm font-medium text-[#0F172A]">Password</label>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 focus:border focus:border-[#E2E8F0] focus:outline-none"
                                {...register('password')}
                            />

                            <p className="mt-1 min-h-[21px] text-sm text-red-500">
                                {errors.password ? errors.password.message : ''}
                            </p>
                        </div>

                        <div className="mt-[10px] flex flex-col">
                            <div className="flex justify-between">
                                <label className="mb-[6px] text-sm font-medium text-[#0F172A]">Confirm Password</label>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 focus:border focus:border-[#E2E8F0] focus:outline-none"
                                {...register('confirmPassword')}
                            />

                            <p className="mt-1 min-h-[21px] text-sm text-red-500">
                                {errors.confirmPassword ? errors.confirmPassword.message : ''}
                            </p>
                        </div>
                        <button
                            className="bg-primary mt-[18px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-[14px] font-normal text-[#64748B]">Already have an account?</span>
                        <Link href="/login" className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Register
