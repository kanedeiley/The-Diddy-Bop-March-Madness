import { CreateProfileForm } from "@/app/features/profile/components/CreateProfileForm"
export default function CreateProfilePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-8">
          <div className="flex flex-col items-center gap-2 mb-6">
            <h1 className="text-2xl font-bold text-center">
              Create Your Profile
            </h1>
            <p className="text-sm text-gray-600 text-center">
              Let's set up your profile to get started!
            </p>
          </div>
          <CreateProfileForm />
        </div>
      </div>
    </div>
  )
}