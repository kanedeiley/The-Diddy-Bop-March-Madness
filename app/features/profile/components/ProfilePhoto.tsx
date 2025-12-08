
'use client'
import Image from "next/image"

interface ProfilePhotoProps {
  profile: any 
}

export default function ProfilePhoto({ profile }: ProfilePhotoProps) {

  return (
    <div className="h-6 w-6 border rounded border-gray-700/20 hover:border-blue-700/60">
      {!profile.avatar_url ? (
        <p className="animate-bounce bg-black">?</p>
      ) : (
        <Image 
          alt="profile photo" 
          src={profile.avatar_url}
          width={24}
          height={24}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  )
}