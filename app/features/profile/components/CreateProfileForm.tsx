"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { createProfile } from "../actions/photos"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { DefaultPhotos } from "./DefaultPhotos"

export function CreateProfileForm() {
  const [formData, setFormData] = useState({ username: "", avatar_url: "" })
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
      await createProfile({
        username: formData.username,
        avatar_url: formData.avatar_url,
      })
      
      toast.success("Profile created!")
      
      // Use window.location for a hard refresh to clear all caches
      window.location.href = '/'
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile")
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
            placeholder="Choose a username"
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
          {loading ? "Creating..." : "Create Profile"}
        </Button>
      </div>
    </form>
  )
}