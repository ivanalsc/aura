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
    <header className="px-6 py-12 md:py-20 text-center border-b border-black/5 bg-white/40 backdrop-blur-md sticky top-0 z-20">
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4 tracking-tight leading-tight">
        {eventName}
      </h1>
      <p className="text-stone-600 mb-8 tracking-wide text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">
        {eventDescription}
      </p>
      <button
        onClick={onCaptureClick}
        className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-full cursor-pointer text-sm md:text-base font-medium tracking-wide shadow-[0_8px_20px_rgba(26,26,26,0.15)] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(26,26,26,0.2)] active:translate-y-0 active:scale-95 transition-all duration-300 group"
      >
        <Camera size={20} className="group-hover:rotate-12 transition-transform duration-300" />
        <span>Capturar Momento</span>
      </button>
    </header>
  )
}