'use server'

import { createClient } from '@/app/lib/supabase/server'
export async function createProfile(data: { username: string; avatar_url: string }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profile')
    .insert({
      user: user.id,
      username: data.username,
      avatar_url: data.avatar_url,
      created_at: new Date().toISOString(),
    })

  if (error) throw error

  return { success: true }
}


export async function updateProfile(data: { username: string; avatar_url: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { error } = await supabase
    .from('profile')
    .upsert(
      {
        user: user.id,
        username: data.username,
        avatar_url: data.avatar_url,
      },
      {
        onConflict: 'user'  // Specify which column has the unique constraint
      }
    )

  if (error) throw error
    return { success: true }
}


export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  try {
    const { data: profile, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user', user.id)
      .maybeSingle()

    if (error) {
      console.error('Supabase error fetching profile:', error)
      const e = new Error(error.message || 'Failed to fetch profile')
      ;(e as any).status = (error as any)?.status ?? 500
      throw e
    }

    if (!profile) {
      const e = new Error('Profile not found')
      ;(e as any).status = 404
      throw e
    }

    return profile
  } catch (err) {
    throw err
  }
}