import { ProfileForm } from "@/app/features/profile/components/ProfileForm"
import { getProfile } from "../features/profile/actions/profile"

export default async function ProfilePage() {
  const profile = await getProfile()  
  if (!profile) {
    return (
      <div>
        loading... 
      </div>
    )
  }
  return (
    <div className="flex min-h-svh flex-col items-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}