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
                    className="w-full rounded-lg border-1 border-transparent bg-[#F8FAFC] px-[14.5] py-4 pr-12 focus:border focus:border-[#E2E8F0] focus:outline-none"
                    {...register(name)}
                />

                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#64748B]"
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
