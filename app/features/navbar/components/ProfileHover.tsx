'use client'

import Link from 'next/link'
import ProfilePhoto from '../../profile/components/ProfilePhoto'
import SignOut from '@/app/components/auth/sign-out'
import Dropdown from './Dropdown'

interface ProfileHoverProps {
  profile: any // Or your Profile type
}

export default function ProfileHover({ profile }: ProfileHoverProps) {
  return (
    <Dropdown
      trigger={
        <button 
          className="focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-full transition-all flex items-center justify-center"
          aria-label="Profile menu"
        >
          <ProfilePhoto profile={profile} />
        </button>
      }
      align="right"
      className="w-56"
    >
      {/* Profile Info Section */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">
          {profile?.name || profile?.email || 'User'}
        </p>
        {profile?.email && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {profile.email}
          </p>
        )}
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          href="/profile"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Profile
        </Link>

        <div className="px-1 pt-1">
          <SignOut variant="menu" />
        </div>
      </div>
    </Dropdown>
  )
}