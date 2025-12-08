'use client'

import { createClient } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SignOutProps {
  variant?: 'default' | 'menu' | 'minimal'
  className?: string
}

export default function SignOut({ 
  variant = 'default', 
  className = ''
}: SignOutProps) {
  const supabase = createClient()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const baseStyles = "transition-all"
  
  const variants = {
    default: "text-sm py-2 px-4 rounded text-gray-600 hover:bg-gray-100/50",
    menu: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md",
    minimal: "text-sm text-gray-600 hover:text-gray-900"
  }

  return (
    <button
      onClick={handleSignOut}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      Sign out
    </button>
  )
}