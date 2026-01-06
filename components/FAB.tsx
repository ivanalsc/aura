'use client'

import { Camera } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'

interface FABProps {
  onFileSelect: (file: File) => void
}

export default function FAB({ onFileSelect }: FABProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 rounded-full bg-charcoal text-white border-none shadow-[0_8px_30px_rgba(26,26,26,0.25)] cursor-pointer flex items-center justify-center hover:scale-105 hover:shadow-[0_12px_40px_rgba(26,26,26,0.35)] active:scale-95 transition-all duration-300 z-[100] group"
      >
        <Camera size={24} className="group-hover:rotate-12 transition-transform duration-300" />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  )
}