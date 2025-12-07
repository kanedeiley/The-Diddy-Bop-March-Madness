'use client'
import { useEffect, useState } from 'react'
import { getDefaultPhotos } from '../actions/photos'
import Image from 'next/image'

interface DefaultPhotosProps {
  selectedPhoto: string
  onPhotoSelect: (photoUrl: string) => void
}

export function DefaultPhotos({ selectedPhoto, onPhotoSelect }: DefaultPhotosProps) {
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadPhotos() {
      try {
        const defaultPhotos = await getDefaultPhotos()

        if (!mounted) return

        setPhotos(defaultPhotos)

        if (!selectedPhoto && defaultPhotos.length > 0) {
          onPhotoSelect(defaultPhotos[0])
        }
      } catch (error) {
        console.error('Error loading photos:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadPhotos()
    return () => {
      mounted = false
    }
  }, [selectedPhoto, onPhotoSelect])

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {photos.map((photoUrl) => {
        const isSelected = selectedPhoto === photoUrl

        return (
          <button
            key={photoUrl}
            type="button"
            onClick={() => onPhotoSelect(photoUrl)}
            className={`relative aspect-square rounded-lg overflow-hidden transition-all ${
              isSelected
                ? 'ring-4 ring-blue-500 scale-105'
                : 'ring-2 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            <Image
              src={photoUrl}
              alt="Default avatar"
              fill
              className="object-cover bg-white"
              sizes="(max-width: 768px) 25vw, 150px"
              draggable={false}
            />
          </button>
        )
      })}
    </div>
  )
}
