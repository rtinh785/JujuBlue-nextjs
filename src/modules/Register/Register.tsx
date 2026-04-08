'use client'
import Link from 'next/link'
import { AUTH_MESSAGES } from '@/core/constants/messages/auth/auth.messages'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { registerSchema, type RegisterFormValues } from './register.schema'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import InputField from '@/components/form/InputField'
import { useMutation } from '@tanstack/react-query'
import authApi from '@/apis/auth/auth.api'
import { saveAccesTokenToLS, saveRefreshTokenToLS } from '@/utils/auth'
import { useRouter } from 'next/navigation'
import http from '@/apis/axios'
const Register = () => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const registerAccountMutation = useMutation({
        mutationFn: authApi.registerAccount,
    })
    const router = useRouter()
    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: yupResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = async ({ email, password }: RegisterFormValues) => {
        registerAccountMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    toast('Bạn đã đăng ký thành công hãy check email xác để thực')
                    reset()
                },
                onError: (error: any) => {
                    setError('email', {
                        message: error.response?.data?.message || AUTH_MESSAGES.REGISTER_FAILED,
                    })
                },
            },
        )
    }

    const handleGoogleRegister = async () => {
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
                <h1 className="py-3 pb-2 text-center text-2xl font-bold lg:text-left lg:text-3xl lg:whitespace-nowrap">
                    Nice to meet you!
                </h1>
                <p className="mb-5 font-normal text-[#64748B]">Create an account.</p>

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

                <div className="my-2 flex items-center gap-4 md:my-6">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-sm text-gray-400">or</span>
                    <hr className="flex-1 border-gray-200" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* email */}
                    <InputField<RegisterFormValues>
                        label="Email address"
                        type="email"
                        placeholder="name@example.com"
                        name="email"
                        register={register}
                        errors={errors}
                    />
                    {/* password */}
                    <InputField<RegisterFormValues>
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        name="password"
                        register={register}
                        errors={errors}
                    />
                    {/* confirm password */}
                    <InputField<RegisterFormValues>
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        name="confirmPassword"
                        register={register}
                        errors={errors}
                    />
                    <button
                        className="bg-primary mt-[18px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create account'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <span className="text-[14px] font-normal text-[#64748B]">Already have an account?</span>
                    <Link href="/login" className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Register
