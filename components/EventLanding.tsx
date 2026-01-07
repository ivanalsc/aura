'use client'

import { Camera } from 'lucide-react'

interface EventLandingProps {
  eventName: string
  eventDescription?: string
  onCaptureClick: () => void
}

export default function EventLanding({
  eventName,
  eventDescription = "Comparte tus momentos favoritos",
  onCaptureClick
}: EventLandingProps) {
  return (
    <header className="px-6 py-16 md:py-24 text-center border-b border-black/[0.03] bg-white/70 backdrop-blur-md sticky top-0 z-20 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal mb-6 tracking-tight leading-[0.95] font-normal">
        {eventName}
      </h1>
      <p className="text-charcoal/70 mb-10 tracking-wide text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
        {eventDescription}
      </p>

    </header>
  )
}