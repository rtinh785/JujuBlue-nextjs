'use client'
import { useState } from 'react'
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'

interface InputFieldProps<T extends FieldValues> {
    type: string
    placeholder: string
    name: Path<T>
    label: string
    register: UseFormRegister<T>
    errors: FieldErrors<T>
    rightNode?: React.ReactNode
}

const InputField = <T extends FieldValues>({
    type,
    placeholder,
    name,
    label,
    register,
    errors,
    rightNode,
}: InputFieldProps<T>) => {
    const [showPassword, setShowPassword] = useState(false)
    const errorMessage = errors[name]?.message as string | undefined
    const inputType = type === 'password' && showPassword ? 'text' : type
    const hasError = Boolean(errorMessage)

    return (
        <div className="flex flex-col">
            <div className="mb-[6px] flex items-center justify-between gap-3">
                <label className="text-sm font-medium text-[#0F172A]">{label}</label>
                {rightNode}
            </div>

            <div className="relative">
                <input
                    type={inputType}
                    placeholder={placeholder}
                    className={`h-11 w-full rounded-lg border bg-[#F8FAFC] px-4 pr-12 text-sm transition-colors duration-150 outline-none placeholder:text-[#94A3B8] focus:bg-white focus:ring-2 ${
                        hasError
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-transparent focus:border-[#E2E8F0] focus:ring-[#E2E8F0]'
                    }`}
                    {...register(name)}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#64748B] transition-colors hover:text-[#0F172A]"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                )}
            </div>

            <p className="mt-1 min-h-[21px] text-sm text-red-500">{errorMessage ?? ''}</p>
        </div>
    )
}

export default InputField
