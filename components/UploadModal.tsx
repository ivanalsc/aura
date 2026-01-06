'use client'

import { X, Upload, Loader2, Check } from 'lucide-react'

interface UploadModalProps {
  preview: string | null
  uploading: boolean
  onClose: () => void
  onUpload: () => void
}

export default function UploadModal({
  preview,
  uploading,
  onClose,
  onUpload,
}: UploadModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 md:p-6 z-[1000] backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-white/80 backdrop-blur-xl rounded-2xl max-w-[500px] w-full max-h-[90vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-white/20 animate-[slideUp_0.4s_cubic-bezier(0.16,1,0.3,1)]"
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
            <div className="mb-6 rounded-xl overflow-hidden shadow-lg border border-black/5 relative aspect-[4/3] bg-stone-100">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <button
            type="button"
            onClick={onUpload}
            disabled={uploading}
            className="w-full p-4 bg-charcoal disabled:bg-stone-400 text-white border-none rounded-xl text-base font-medium cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-3 tracking-wide hover:shadow-lg hover:shadow-charcoal/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
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