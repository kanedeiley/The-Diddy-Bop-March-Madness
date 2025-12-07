"use client"

import { useState } from "react"
import { cn } from "@/app/lib/utils"
import { SignIn } from "./sign-in"
import { SignUp } from "./sign-up"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <a href="#" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={32}
                height={32}
                viewBox="0 0 24 24"
                fill="orange"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-basketball animate-bounce"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2.1 13.4A10.1 10.1 0 0 0 13.4 2.1" />
                <path d="m5 4.9 14 14.2" />
                <path d="M21.9 10.6a10.1 10.1 0 0 0-11.3 11.3" />
              </svg>
            </div>
            <span className="sr-only">Diddy Bop March Madness</span>
          </a>
          <h1 className="text-xl text-center font-bold">
            Diddy Bop March Madness
          </h1>
          <div className="text-center text-sm">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            {isSignUp ? (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="underline underline-offset-4 cursor-pointer"
              >
                Login
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="underline underline-offset-4 cursor-pointer"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>

        {isSignUp ? <SignUp /> : <SignIn />}
      </div>

      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}