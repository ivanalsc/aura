'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Photo, Particle } from '@/lib/types'
import PhotoCard from './PhotoCard'
import FAB from './FAB'
import UploadModal from './UploadModal'
import CameraModal from './CameraModal'
import DigitalJournalButton from './DigitalJournalButton'
import { STORAGE_BUCKET } from '@/lib/constants'

interface PhotoFeedProps {
  eventId: string
}

export default function PhotoFeed({ eventId }: PhotoFeedProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [deviceId, setDeviceId] = useState<string>('')
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Initialize device ID
    let id = localStorage.getItem('aura_device_id')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('aura_device_id', id)
    }
    setDeviceId(id)

    // Load liked photos from local storage
    const liked = JSON.parse(localStorage.getItem('aura_liked_photos') || '[]')
    setLikedPhotos(new Set(liked))
  }, [])

  // Fetch photos from Supabase
  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (data) setPhotos(data)
    if (error) console.error('Error fetching photos:', error)
  }

  useEffect(() => {
    fetchPhotos()

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`photos-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('New photo inserted:', payload)
          setPhotos(prev => {
            if (prev.some(p => p.id === payload.new.id)) return prev
            return [payload.new as Photo, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('Photo updated:', payload)
          setPhotos(prev =>
            prev.map(p => p.id === payload.new.id ? payload.new as Photo : p)
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'photos',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          console.log('Photo deleted:', payload)
          setPhotos(prev => prev.filter(p => p.id !== payload.old.id))
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status)
      })

    return () => {
      console.log('Unsubscribing from channel')
      supabase.removeChannel(channel)
    }
  }, [eventId])

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setShowUpload(true)
    setShowCamera(false)
  }

  const handleUpload = async (caption: string) => {
    if (!selectedFile) return

    setUploading(true)

    try {
      // Upload to Supabase Storage
      const fileName = `${eventId}/${Date.now()}-${selectedFile.name}`
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(fileName)

      // Insert into database and get returned data
      const { data: insertedData, error: dbError } = await supabase
        .from('photos')
        .insert([
          {
            event_id: eventId,
            image_url: publicUrl,
            likes: 0,
            device_id: deviceId,
            caption: caption
          }
        ])
        .select()
        .single()

      if (dbError) throw dbError

      // Manually update state for immediate feedback
      if (insertedData) {
        setPhotos(prev => [insertedData as Photo, ...prev])
      }

      // Success - wait a bit before closing for better UX
      await new Promise(resolve => setTimeout(resolve, 500))

      // Close modal
      handleCloseModal()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error al subir la foto. Por favor intenta de nuevo.')
      setUploading(false) // Solo reset uploading en caso de error
    }
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) return

    // Optimistic update
    setPhotos(prev => prev.filter(p => p.id !== photoId))

    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photoId)
      .eq('device_id', deviceId)

    if (error) {
      console.error('Error deleting photo:', error)
      alert('Error al eliminar la foto')
      fetchPhotos() // Revert by refetching
    }
  }

  const handleLike = async (photoId: string, currentLikes: number) => {
    const isLiked = likedPhotos.has(photoId)
    const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1

    // Optimistic update
    setPhotos(prev => prev.map(p =>
      p.id === photoId ? { ...p, likes: newLikes } : p
    ))

    // Update local state
    const newLiked = new Set(likedPhotos)
    if (isLiked) {
      newLiked.delete(photoId)
    } else {
      newLiked.add(photoId)
    }
    setLikedPhotos(newLiked)
    localStorage.setItem('aura_liked_photos', JSON.stringify([...newLiked]))

    // Update in Supabase
    const { error } = await supabase
      .from('photos')
      .update({ likes: newLikes })
      .eq('id', photoId)

    if (error) {
      console.error('Error updating likes:', error)
      // Revert optimistic update
      setPhotos(prev => prev.map(p =>
        p.id === photoId ? { ...p, likes: currentLikes } : p
      ))
      setLikedPhotos(likedPhotos) // Revert local state
      return
    }

    // Trigger particle animation only on like
    if (!isLiked) {
      const newParticle: Particle = {
        id: Date.now(),
        photoId
      }
      setParticles(prev => [...prev, newParticle])
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id))
      }, 1000)
    }
  }

  const handleCloseModal = () => {
    setShowUpload(false)
    setSelectedFile(null)
    setPreview(null)
    setUploading(false)
  }



  return (
    <>
      {/* Actions Header */}
      <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-end animate-[fadeIn_0.5s_ease-out]">
        <DigitalJournalButton eventName={eventId} photos={photos} />
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {photos.length > 0 ? (
          <div
            className="columns-2 md:columns-3 gap-6"
            style={{ columnGap: '24px' }}
          >
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onLike={handleLike}
                onDelete={handleDelete}
                isLiked={likedPhotos.has(photo.id)}
                isOwner={photo.device_id === deviceId}
                showParticles={particles.some(p => p.photoId === photo.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg font-light tracking-wide">
              Aún no hay fotos
            </p>
            <p className="text-gray-400 text-sm mt-2">
              ¡Sé el primero en compartir un momento!
            </p>
          </div>
        )}
      </div>

      {/* FAB */}
      <FAB
        onGallerySelect={handleFileSelect}
        onCameraClick={() => setShowCamera(true)}
      />

      {/* Camera Modal */}
      {showCamera && (
        <CameraModal
          onCapture={handleFileSelect}
          onClose={() => setShowCamera(false)}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          preview={preview}
          uploading={uploading}
          onClose={handleCloseModal}
          onUpload={handleUpload}
        />
      )}
    </>
  )
}