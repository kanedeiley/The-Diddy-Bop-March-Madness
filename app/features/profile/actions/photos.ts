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