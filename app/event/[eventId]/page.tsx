'use client'

import { useParams } from 'next/navigation'
import { useRef } from 'react'
import EventLanding from '@/components/EventLanding'
import PhotoFeed from '@/components/PhotoFeed'

// Mapeo de eventos (después lo haremos dinámico)
const EVENT_NAMES: Record<string, string> = {
  'boda-ana-luis-2026': 'Ana & Luis',
  'festival-musica-2026': 'Festival de Música 2026',
}

export default function EventPage() {
  const params = useParams()
  const eventId = params.eventId as string
  const fabRef = useRef<HTMLInputElement>(null)

  const eventName = EVENT_NAMES[eventId] || 'Evento'

  const handleCaptureClick = () => {
    // Trigger el input file del FAB
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fileInput?.click()
  }

  return (
    <div className="min-h-screen">
      <EventLanding 
        eventName={eventName}
        onCaptureClick={handleCaptureClick}
      />
      <PhotoFeed eventId={eventId} />
    </div>
  )
}