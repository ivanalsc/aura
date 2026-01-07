'use client'

import { useParams } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import EventLanding from '@/components/EventLanding'
import PhotoFeed from '@/components/PhotoFeed'
import { Lock, ArrowRight } from 'lucide-react'

export default function EventPage() {
  const params = useParams()
  const eventId = params.eventId as string

  const [loading, setLoading] = useState(true)
  const [eventName, setEventName] = useState('')
  const [description, setDescription] = useState('')
  const [requiresPassword, setRequiresPassword] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    checkEvent()
  }, [eventId])

  const checkEvent = async () => {
    try {
      // Check session storage first
      const storedAuth = sessionStorage.getItem(`aura_auth_${eventId}`)
      if (storedAuth === 'true') {
        setIsAuthenticated(true)
      }

      const { data, error } = await supabase
        .from('events')
        .select('name, description, password')
        .eq('id', eventId)
        .single()

      if (error) {
        // Fallback for demo/legacy events
        if (eventId === 'boda-ana-luis-2026') {
          setEventName('Ana & Luis')
          setLoading(false)
          // Default legacy events don't have password
          setIsAuthenticated(true)
          return
        }
        console.error('Error fetching event:', error)
        // If event not found, we still show the page but maybe with generic title,
        // or we could show 404. For now, let's assume it's a valid ID for PhotoFeed.
        setEventName('Evento')
        setIsAuthenticated(true)
        setLoading(false)
        return
      }

      if (data) {
        setEventName(data.name)
        setDescription(data.description)
        if (data.password) {
          setRequiresPassword(true)
          // If we already authenticated from session
          if (storedAuth === 'true') {
            setIsAuthenticated(true)
          }
        } else {
          setIsAuthenticated(true)
        }
      }
    } catch (err) {
      console.error(err)
      setIsAuthenticated(true) // Fail open if something critical breaks? Or closed?
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsChecking(true)
    setError('')

    try {
      const { data } = await supabase
        .from('events')
        .select('password')
        .eq('id', eventId)
        .single()

      if (data && data.password === passwordInput) {
        setIsAuthenticated(true)
        sessionStorage.setItem(`aura_auth_${eventId}`, 'true')
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (err) {
      setError('Error al verificar')
    } finally {
      setIsChecking(false)
    }
  }

  const handleCaptureClick = () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fileInput?.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated && requiresPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-6">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-black/[0.03] p-10 md:p-14">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={24} className="text-charcoal" />
            </div>
            <h1 className="font-serif text-3xl text-charcoal mb-3 font-normal">
              {eventName || 'Evento Privado'}
            </h1>
            <p className="text-charcoal/60 text-sm font-light tracking-wide">
              Este evento está protegido por contraseña
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="w-full px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-center text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all duration-200 font-light text-xl tracking-widest"
                maxLength={6}
                inputMode="numeric"
              />
              {error && (
                <p className="text-red-500 text-xs text-center mt-3 font-medium animate-pulse">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isChecking || !passwordInput}
              className="w-full px-8 py-4 bg-charcoal text-white rounded-[4px] cursor-pointer text-sm font-medium tracking-[0.15em] uppercase shadow-[0_2px_8px_rgba(26,26,26,0.15)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,26,26,0.2)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(26,26,26,0.15)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isChecking ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <EventLanding
        eventName={eventName}
        eventDescription={description}
        onCaptureClick={handleCaptureClick}
      />
      <PhotoFeed eventId={eventId} />
    </div>
  )
}