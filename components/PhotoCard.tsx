'use client'

import { Heart, Sparkles, Trash2 } from 'lucide-react'
import { Photo } from '@/lib/types'

interface PhotoCardProps {
  photo: Photo
  onLike: (photoId: string, currentLikes: number) => void
  onDelete?: (photoId: string) => void
  isLiked?: boolean
  isOwner?: boolean
  showParticles: boolean
}

export default function PhotoCard({
  photo,
  onLike,
  onDelete,
  isLiked,
  isOwner,
  showParticles
}: PhotoCardProps) {
  return (
    <div className="break-inside-avoid mb-6 animate-[fadeIn_0.6s_ease-out] relative group">
      <div className="bg-white rounded-[4px] shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden border border-black/[0.03]">
        <img
          src={photo.image_url}
          alt="Momento del evento"
          className="w-full block object-cover"
          loading="lazy"
        />
        {photo.caption && (
          <div className="px-4 pt-4 pb-1">
            <p className="text-charcoal/80 text-sm font-light leading-relaxed break-words font-serif">
              {photo.caption}
            </p>
          </div>
        )}
        <div className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-sm">
          <button
            onClick={() => onLike(photo.id, photo.likes)}
            className={`border-none cursor-pointer flex items-center gap-2 text-sm px-3 py-2 rounded-full transition-all duration-200 active:scale-95 ${isLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-charcoal'
              }`}
          >
            <Heart
              size={18}
              fill={isLiked ? 'currentColor' : 'none'}
              className={`transition-all duration-300 ${isLiked ? 'scale-110' : 'scale-100'}`}
              strokeWidth={2}
            />
            <span className="font-medium font-sans">{photo.likes}</span>
          </button>

          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(photo.id)}
              className="border-none bg-transparent cursor-pointer p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Eliminar foto"
            >
              <Trash2 size={18} />
            </button>
          )}

          {showParticles && (
            <div className="absolute bottom-12 left-8 pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <Sparkles
                  key={i}
                  size={14}
                  className="absolute text-charcoal opacity-0"
                  style={{
                    animation: `sparkle${i} 1s ease-out forwards`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes sparkle0 {
          to {
            transform: translate(-12px, -18px) rotate(20deg);
            opacity: 1;
          }
        }
        @keyframes sparkle1 {
          to {
            transform: translate(12px, -18px) rotate(-20deg);
            opacity: 1;
          }
        }
        @keyframes sparkle2 {
          to {
            transform: translate(-18px, -8px) rotate(40deg);
            opacity: 1;
          }
        }
        @keyframes sparkle3 {
          to {
            transform: translate(18px, -8px) rotate(-40deg);
            opacity: 1;
          }
        }
        @keyframes sparkle4 {
          to {
            transform: translate(0, -24px) rotate(0deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}