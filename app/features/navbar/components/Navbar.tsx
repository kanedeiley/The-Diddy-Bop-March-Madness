'use client'
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/app/components/icons"
import ProfileHover from "./ProfileHover"
import PageNav from "./PageNav"
import { Button } from "@/app/components/ui/button"

interface NavbarProps {
  profile: any 
}

export default function Navbar({ profile }: NavbarProps) {
  const path = usePathname()

  if (path === "/login" || path === "/profile/create") return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex w-full border-b border-gray-700/20 items-center justify-between py-4 px-8 bg-white">
      <div className="flex items-center gap-8">
        <Link href={'/'}>
          <Logo className="h-6 stroke-black fill-black text-gray-700" />
        </Link>
      </div>
      
      <div className="flex gap-6 items-center">
        <PageNav />
        <ProfileHover profile={profile} />
      </div>
    </nav>
  )
}