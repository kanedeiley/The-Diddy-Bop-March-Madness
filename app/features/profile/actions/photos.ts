'use server'

import { createClient } from '@/app/lib/supabase/server'

export async function getDefaultPhotos() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .storage
    .from('profile-photos')
    .list('defaults', {
      sortBy: { column: 'name', order: 'asc' },
    })

  if (error) throw error

  if (!data || data.length === 0) {
    return []
  }

  const photos = data.map((file) => {
    const { data } = supabase
      .storage
      .from('profile-photos')
      .getPublicUrl(`defaults/${file.name}`)

    return data.publicUrl
  })

  return photos
}

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

  // Don't revalidate here, let client handle it
  return { success: true }
}