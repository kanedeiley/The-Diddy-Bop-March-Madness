"use client"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Basketball } from "@/app/components/icons"
import { useAuth } from "../hooks/useAuth"

type AuthFormProps = Pick<
  ReturnType<typeof useAuth>,
  "isSignUp" | "formData" | "loading" | "handleChange" | "handleSubmit"
>

export function AuthForm({ isSignUp, formData, loading, handleChange, handleSubmit }: AuthFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Basketball className="h-4 w-4 animate-bounce" /> : isSignUp ? "Sign Up" : "Login"}
        </Button>
      </div>
    </form>
  )
}