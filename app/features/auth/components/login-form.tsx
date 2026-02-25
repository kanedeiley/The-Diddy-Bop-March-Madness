"use client"

import { cn } from "@/app/lib/utils"
import { Basketball } from "@/app/components/icons"
import { AuthForm } from "./auth-form"
import { useAuth } from "../hooks/useAuth"

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const auth = useAuth()
  const { isSignUp, setIsSignUp } = auth

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <Basketball className="h-4 w-4" />
          </div>
          <h1 className="text-xl text-center font-bold">Diddy Bop March Madness</h1>
          <div className="text-center text-sm">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="underline underline-offset-4 cursor-pointer"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>

        <AuthForm
          isSignUp={auth.isSignUp}
          formData={auth.formData}
          loading={auth.loading}
          handleChange={auth.handleChange}
          handleSubmit={auth.handleSubmit}
        />
      </div>

      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}