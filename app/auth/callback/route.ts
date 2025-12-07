import { createClient } from '@/app/lib/supabase/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // User is now logged in, redirect to home
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If there's an error, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}