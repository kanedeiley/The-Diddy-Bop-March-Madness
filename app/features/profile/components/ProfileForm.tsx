"use client"
import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { createProfile, updateProfile } from "../actions/profile"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DefaultPhotos } from "./DefaultPhotos"

interface profileFormProps {
    profile: any
}


export function ProfileForm(props: profileFormProps) {
  const [formData, setFormData] = useState(props.profile)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePhotoSelect = (photoUrl: string) => {
    setFormData({ ...formData, avatar_url: photoUrl })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile({
        username: formData.username,
        avatar_url: formData.avatar_url,
      })
      
      toast.success("Profile Updated!")
          setLoading(false)
    } catch (error: any) {
      toast.error("Failed to update profile")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="Update Username"
            required
            value={formData.username}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label>Choose Your Avatar</Label>
          <DefaultPhotos
            selectedPhoto={formData.avatar_url}
            onPhotoSelect={handlePhotoSelect}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !formData.avatar_url}
        >
          {loading ? "Loading..." : "Update Profile"}
        </Button>
      </div>
    </form>
  )
}