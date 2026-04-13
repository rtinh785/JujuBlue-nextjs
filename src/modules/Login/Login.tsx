'use client'

import { LoginFormValues, loginSchema } from '@/modules/Login/login.schema'
import { AUTH_MESSAGES } from '@/core/constants/messages/auth/auth.messages'
import { yupResolver } from '@hookform/resolvers/yup'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import InputField from '@/components/form/InputField'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import http from '@/apis/axios'

import { saveAccesTokenToLS, saveRefreshTokenToLS } from '@/utils/auth'
import authApi from '@/apis/auth/auth.api'
import { useGuestGuard } from '@/hooks/useGuestGuard'

const Login = () => {
    useGuestGuard()
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const loginAccountMutation = useMutation({
        mutationFn: authApi.loginAccount,
    })
    const router = useRouter()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    const queryClient = useQueryClient()

    const onSubmit = async (values: LoginFormValues) => {
        await loginAccountMutation.mutateAsync(values, {
            onSuccess: () => {
                reset()
                router.push('/')
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || AUTH_MESSAGES.LOGIN_FAILED, { position: 'top-left' })
            },
        })
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)
        window.location.href = 'http://localhost:4000/auth/google'
    }

    useEffect(() => {
        if (typeof window === 'undefined') return

        const run = async () => {
            const hash = window.location.hash
            if (!hash) return

            const params = new URLSearchParams(hash.slice(1))
            const access_token = params.get('access_token')
            const refresh_token = params.get('refresh_token')

            if (access_token && refresh_token) {
                saveAccesTokenToLS(access_token)
                saveRefreshTokenToLS(refresh_token)
                window.history.replaceState(null, '', '/login')

                await http.get('profiles/me')

                router.push('/home')
            }
        }

        run()
    }, [router])

    return (
        <section className="flex items-center justify-center bg-white px-4 text-black sm:px-6 md:px-10 lg:w-1/2 lg:px-16 xl:px-24">
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
                <h1 className="pb-2 text-center text-3xl font-bold lg:text-left">Wellcome back</h1>
                <p className="mb-8 font-normal text-[#64748B]">Enter your details to sign in to your account.</p>

                <button
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-[13px] text-sm font-medium text-gray-500"
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={isGoogleLoading}
                >
                    <img src="/images/svg/google-icon.svg" alt="google-icon" className="size-5" />
                    <span className="font-semibold text-[#0F172A]">
                        {' '}
                        {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                    </span>
                </button>

                <div className="my-6 flex items-center gap-4 md:my-8">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-sm text-gray-400">or</span>
                    <hr className="flex-1 border-gray-200" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* email */}
                    <InputField<LoginFormValues>
                        label="Email address"
                        type="email"
                        placeholder="name@example.com"
                        name="email"
                        register={register}
                        errors={errors}
                    />
                    {/* password */}
                    <InputField<LoginFormValues>
                        label="Password"
                        type="password"
                        placeholder="........"
                        name="password"
                        register={register}
                        errors={errors}
                        rightNode={
                            <Link href="/forgot-password" className="text-primary text-sm font-medium hover:underline">
                                Forgot password?
                            </Link>
                        }
                    />

                    <button
                        disabled={isSubmitting}
                        className="bg-primary mt-[28px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white disabled:opacity-50"
                    >
                        {isSubmitting ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <div className="pt-12 text-center">
                    <span className="text-[14px] font-normal text-[#64748B]">Don't have an account?</span>
                    <Link href="/register" className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </section>
    )
}
export default Login
