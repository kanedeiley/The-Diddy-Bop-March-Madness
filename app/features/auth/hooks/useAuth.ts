'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createClient } from "@/app/lib/supabase/client"

export function useAuth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email: formData.email, password: formData.password })
      : await supabase.auth.signInWithPassword({ email: formData.email, password: formData.password })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isSignUp ? "Account created!" : "Welcome back!")
      router.push("/")
      router.refresh()
    }

    setLoading(false)
  }

  return {
    isSignUp,
    setIsSignUp,
    formData,
    loading,
    handleChange,
    handleSubmit,
  }
}