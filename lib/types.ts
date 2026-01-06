export interface Photo {
  id: string
  event_id: string
  image_url: string
  likes: number
  created_at: string
  device_id?: string
}

export interface Particle {
  id: number
  photoId: string
}