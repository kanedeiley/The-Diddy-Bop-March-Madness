// Navbar.tsx
'use client'
import { usePathname } from "next/navigation"
import SignOut from "@/app/components/auth/sign-out"
import Link from "next/link"
import { Logo } from "@/app/components/icons"
import ProfilePhoto from "../../profile/components/ProfilePhoto"
import { Button } from "@/app/components/ui/button"

interface NavbarProps {
  profile: any // Or your Profile type
}

export default function Navbar({ profile }: NavbarProps) {
  const path = usePathname()

  if (path === "/login" || path === "/profile/create") return null

  return (
    <div>
      <nav className="flex w-full border-b border-gray-700/20 align-center items-center justify-between h-auto py-4 px-8"
      >
        <Link href={'/'}>
          <Logo className="h-6 stroke-black fill-black text-gray-700" />

        </Link>
        <div className="flex w-auto gap-6 items-center align-center">
          <Button className="h-6 w-6" >
            -
          </Button>
          <Link href={'/profile'}>
          <ProfilePhoto profile={profile} />
          </Link>
      </div>
      </nav>
    </div>
  )
}