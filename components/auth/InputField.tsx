"use client"
import { useMemo, useEffect } from "react"
import { Eye, EyeOff, BadgeAlert } from "lucide-react"
import { Field, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import Link from "next/link"
import { InputFieldProps } from "@/interfaces/auth"
import { usePasswordState, useUserState, useErrorState, useAuthLoadingState } from "@/atoms/AuthState"
import { validateField } from "@/zod/user"


export default function InputField({placeholder, name, ...props}: InputFieldProps){
    const baseType = useMemo(() => {
        if (name === "email") return "email"
        if (name === "password") return "password"
        if (name === "username") return "text"
    }, [name]);
    
    const {showPassword, setShowPassword} = usePasswordState()
    const { setState, ...data } = useUserState()
    const { setError } = useErrorState()
    const error = useErrorState((state) => state[name as keyof typeof state])
    const isPasswordField = name === "password"
    const inputType = isPasswordField && showPassword ? "text" : baseType
    
    // Debounced validation
    useEffect(() => {
        const timer = setTimeout(() => {
            const value = data[name] as string ?? ""
            if (value) {
                const validationError = validateField(name, value)
                setError(name as keyof typeof data, validationError)
            } else {
                setError(name as keyof typeof data, null)
            }
        }, 1000)

        return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data[name], name])

    const { loading } = useAuthLoadingState()
    
    return (
        <Field className="gap-1.5">
          {name === "password" ? (
            <div className="flex items-center">
                  <FieldLabel htmlFor="password" className="text-[#d1d0c5]">Password</FieldLabel>
                  {props.type && props.type === "Login" && <Link
                    href="/"
                    className="ml-auto text-sm text-[#e2b714] underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>}
                </div>
          ): (
            <FieldLabel htmlFor={name} className="text-[#d1d0c5]">{name.charAt(0).toUpperCase() + name.slice(1)}</FieldLabel>
          )}
          <div className="relative">
            <Input
              id={name}
              type={inputType}
              placeholder={placeholder}
              onChange={(e) => {
                e.preventDefault();
                if(error){
                    setError(name as keyof typeof data, null)
                }
                setState({[name]: e.target.value})
              }}
              disabled={loading}
              value={data[name]}
              className={
                error
                  ? "bg-[#323437] border-[#ca4754] text-[#d1d0c5] placeholder:text-[#97999c] focus:ring-[#ca4754] focus-visible:ring-[#ca4754] focus-visible:ring-[1.5px] focus-visible:border-[#ca4754]"
                  : `bg-[#323437] border-[#646669]/20 text-[#d1d0c5] placeholder:text-[#97999c] focus-visible:ring-[#e2b714] focus-visible:border-[#e2b714] focus-visible:ring-[1.5px] ${loading && 'cursor-not-allowed opacity-50'}`
              }
            />
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#97999c] hover:text-[#d1d0c5] ${error && 'text-[#ca4754] hover:text-[#ca4754]'}`}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            )}
          </div>
          {error && (
            <div className="flex flex-row gap-2 items-center">
                <BadgeAlert className="text-[#ca4754]" size={16} />
                <p className="text-sm text-[#ca4754]">{error as string}</p>
            </div>
          )}
        </Field>
    )
}
