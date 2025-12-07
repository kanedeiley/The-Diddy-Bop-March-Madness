import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ✅ Skip middleware for internal and system routes
  const pathname = request.nextUrl.pathname

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/favicon.ico') ||
    /\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/auth/')
  
  const isProfileCreateRoute = pathname === '/profile/create'

  // ✅ Allow unauthenticated users on auth pages
  if (!user && isAuthRoute) {
    return supabaseResponse
  }

  // ✅ Redirect unauthenticated users everywhere else
  if (!user && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ✅ Redirect logged-in users away from auth pages
  if (user && isAuthRoute && !pathname.startsWith('/auth/callback')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // ✅ Check profile status for authenticated users
  if (user && !isAuthRoute) {
    const { data: profile } = await supabase
      .from('profile')
      .select('id')
      .eq('user', user.id)
      .maybeSingle()

    // If user HAS a profile but is on create page, redirect to home
    if (profile && isProfileCreateRoute) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // If user has NO profile and is NOT on create page, redirect to create
    if (!profile && !isProfileCreateRoute) {
      return NextResponse.redirect(new URL('/profile/create', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/|api/|auth/|favicon.ico).*)'],
}