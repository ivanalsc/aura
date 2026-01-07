'use client'

import { X, Upload, Loader2, Check } from 'lucide-react'
import { useState } from 'react'

interface UploadModalProps {
  preview: string | null
  uploading: boolean
  onClose: () => void
  onUpload: (caption: string) => void
}

export default function UploadModal({
  preview,
  uploading,
  onClose,
  onUpload,
}: UploadModalProps) {
  const [caption, setCaption] = useState('')

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 md:p-6 z-[1000] backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white/95 backdrop-blur-sm rounded-[4px] max-w-[500px] w-full max-h-[90vh] overflow-hidden shadow-2xl border border-black/5 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-charcoal/5 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-serif text-2xl md:text-3xl text-charcoal m-0 tracking-tight">
            Compartir Momento
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={uploading}
            className="border-none bg-transparent cursor-pointer p-2 text-stone-500 hover:text-charcoal hover:bg-black/5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {preview && (
            <div className="mb-6 rounded-[4px] overflow-hidden shadow-lg border border-black/5 relative aspect-[4/3] bg-stone-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="caption" className="block text-xs font-medium text-charcoal uppercase tracking-widest mb-2">
              Pie de foto (Opcional)
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="w-full p-4 bg-white border border-black/10 rounded-[4px] text-charcoal placeholder:text-stone-400 focus:outline-none focus:border-charcoal/30 focus:shadow-[0_0_0_2px_rgba(26,26,26,0.05)] transition-all duration-200 resize-none text-sm leading-relaxed"
              rows={3}
              disabled={uploading}
            />
          </div>

          <button
            type="button"
            onClick={() => onUpload(caption)}
            disabled={uploading}
            className="w-full p-4 bg-charcoal disabled:bg-stone-400 text-white border-none rounded-[4px] text-base font-medium cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-3 tracking-widest uppercase hover:bg-black/90 active:scale-[0.99] transition-all duration-200"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Subiendo...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>Compartir en Aura</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}