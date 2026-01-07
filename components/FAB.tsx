'use client'

import { Camera, Image as ImageIcon, Plus } from 'lucide-react'
import { ChangeEvent, useRef, useState } from 'react'

interface FABProps {
  onGallerySelect: (file: File) => void
  onCameraClick: () => void
}

export default function FAB({ onGallerySelect, onCameraClick }: FABProps) {
  const [isOpen, setIsOpen] = useState(false)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onGallerySelect(file)
      setIsOpen(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end gap-4 z-[100]">

        <div
          className={`flex items-center gap-3 transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
            }`}
        >
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[4px] shadow-sm text-xs font-medium uppercase tracking-wider text-charcoal">
            Galería
          </span>
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white text-charcoal border border-black/5 shadow-lg cursor-pointer flex items-center justify-center hover:bg-stone-50 active:scale-95 transition-all duration-200"
          >
            <ImageIcon size={20} />
          </button>
        </div>

        <div
          className={`flex items-center gap-3 transition-all duration-300 delay-75 origin-bottom-right ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'
            }`}
        >
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-[4px] shadow-sm text-xs font-medium uppercase tracking-wider text-charcoal">
            Cámara
          </span>
          <button
            onClick={() => {
              onCameraClick()
              setIsOpen(false)
            }}
            className="w-12 h-12 rounded-full bg-charcoal text-white shadow-lg cursor-pointer flex items-center justify-center hover:bg-black active:scale-95 transition-all duration-200"
          >
            <Camera size={20} />
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 md:w-16 md:h-16 rounded-full shadow-[0_8px_30px_rgba(26,26,26,0.25)] cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen ? 'bg-white text-charcoal rotate-45' : 'bg-charcoal text-white rotate-0'
            }`}
        >
          <Plus size={28} />
        </button>
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  )
}