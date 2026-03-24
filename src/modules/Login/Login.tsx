import { InputField } from '@/components/form/input-field'

const Login = () => {
    return (
        <div className="flex h-full w-full flex-row">
            <section className="bg-primary w-1/2 text-white">
                <div className="align-center flex h-full w-full flex-col items-center justify-center p-8">
                    <div className="flex size-[96px] items-center justify-center rounded-[12px] bg-white px-[16px] py-[8px]">
                        <img src="/images/svg/logo.svg" alt="Juju Blue Logo" className="h-10 w-auto object-cover" />
                    </div>
                    <h1 className="mt-6 text-4xl font-bold">Juju Blue</h1>
                    <p className="mt-6 text-[18px] font-[500]">Elevate your discourse.</p>
                </div>
            </section>
            <section className="flex w-1/2 items-center justify-center bg-white px-[190px] py-[120px] text-black">
                <div className="flex w-full max-w-[400px] min-w-[350px] flex-col">
                    <h1 className="pb-2 text-3xl font-bold">Wellcome back</h1>
                    <p className="mb-8 font-normal text-[#64748B]">Enter your details to sign in to your account.</p>

                    <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-500">
                        <img src="/images/svg/google-icon.svg" alt="google-icon" className="size-5" />
                        <span className="font-semibold text-[#0F172A]">Continue with Google</span>
                    </button>

                    <div className="my-8 flex items-center gap-4">
                        <hr className="flex-1 border-gray-200" />
                        <span className="text-sm text-gray-400">or</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    <form action="">    
                        {/* email */}
                        <div className="flex flex-col">
                            <label className="mb-[6px] text-sm font-medium text-[#0F172A]">Email address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 focus:border focus:border-[#E2E8F0] focus:outline-none"
                            />
                        </div>
                        {/* password */}
                        <div className="mt-[20px] flex flex-col">
                            <div className="flex justify-between">
                                <label className="mb-[6px] text-sm font-medium text-[#0F172A]">Password</label>
                                <a href="#" className="text-primary text-sm font-medium hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 focus:border focus:border-[#E2E8F0] focus:outline-none"
                            />
                        </div>

                        <button className="bg-primary mt-[28px] w-full rounded-lg px-2 py-4 text-[14px] font-semibold text-white">
                            Log in
                        </button>
                    </form>

                    <div className="pt-12 text-center">
                        <span className="text-[14px] font-normal text-[#64748B]">Don't have an account?</span>
                        <a href="#" className="text-primary pl-1 text-[14px] font-semibold hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Login
