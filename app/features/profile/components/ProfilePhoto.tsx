
'use client'
import Image from "next/image"

interface ProfilePhotoProps {
  profile?: any 
}

export default function ProfilePhoto({ profile }: ProfilePhotoProps) {

  const avatar = profile?.avatar_url

  return (
    <div className="h-6 w-6 border rounded border-gray-700/20 hover:border-blue-700/60">
      {!avatar ? (
        <div className="flex items-center justify-center w-full h-full text-sm font-bold text-white bg-gray-800">?</div>
      ) : (
        <Image
          alt="profile photo"
          src={avatar}
          width={24}
          height={24}
          className="w-full h-full rounded object-cover"
        />
      )}
    </div>
  )
}