'use client'

import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Plus, Copy, Check, Lock, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Event creation state
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventId, setEventId] = useState('')
  const [createdEventId, setCreatedEventId] = useState<string | null>(null)
  const [eventPassword, setEventPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check session storage on mount
    const auth = sessionStorage.getItem('aura_admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'auraadmin2025' && password === 'auraadmin2025') {
      setIsAuthenticated(true)
      setLoginError('')
      sessionStorage.setItem('aura_admin_auth', 'true')
    } else {
      setLoginError('Credenciales incorrectas')
    }
  }

  const generateEventId = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString().slice(-6)
  }

  const generatePassword = () => {
    // Generar contraseña de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      alert('Por favor ingresa un nombre para el evento')
      return
    }

    setLoading(true)
    const newEventId = eventId || generateEventId(eventName)
    const password = generatePassword()

    try {
      const { error } = await supabase
        .from('events')
        .insert([
          {
            id: newEventId,
            name: eventName,
            description: eventDescription,
            password: password
          }
        ])

      if (error) throw error

      setCreatedEventId(newEventId)
      setEventPassword(password)
      setCopied(false)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error al crear el evento. Asegúrate de haber ejecutado el script SQL.')
    } finally {
      setLoading(false)
    }
  }

  const getEventUrl = (id: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/event/${id}`
    }
    return ''
  }

  const handleCopyUrl = () => {
    if (createdEventId) {
      const url = getEventUrl(createdEventId)
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownloadQR = () => {
    if (!createdEventId) return

    const svg = document.getElementById('qrcode-svg')
    if (!svg) return

    try {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.download = `aura-qr-${createdEventId}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }

      img.onerror = () => {
        alert('Error al generar la imagen del QR. Por favor intenta de nuevo.')
      }

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    } catch (error) {
      console.error('Error downloading QR:', error)
      alert('Error al descargar el código QR. Por favor intenta de nuevo.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16 md:py-20 px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md rounded-[4px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-black/[0.03] p-10 md:p-14">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={24} className="text-charcoal" />
            </div>
            <h1 className="font-serif text-3xl text-charcoal mb-3 font-normal">
              Acceso Admin
            </h1>
            <p className="text-charcoal/60 text-sm font-light tracking-wide">
              Ingresa tus credenciales para administrar
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-charcoal text-xs font-medium mb-3 tracking-[0.1em] uppercase">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all duration-200 font-light text-base"
              />
            </div>

            <div>
              <label className="block text-charcoal text-xs font-medium mb-3 tracking-[0.1em] uppercase">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all duration-200 font-light text-base"
              />
            </div>

            {loginError && (
              <p className="text-red-500 text-xs text-center font-medium animate-pulse">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-8 py-4 bg-charcoal text-white rounded-[4px] cursor-pointer text-sm font-medium tracking-[0.15em] uppercase shadow-[0_2px_8px_rgba(26,26,26,0.15)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,26,26,0.2)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(26,26,26,0.15)] transition-all duration-200 flex items-center justify-center gap-3"
            >
              <span>Ingresar</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 md:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-5 tracking-tight font-normal">
            Crear Nuevo Evento
          </h1>
          <p className="text-charcoal/65 text-lg font-light tracking-wide">
            Genera un código QR y contraseña para tu evento
          </p>
        </div>

        {!createdEventId ? (
          <div className="bg-white/70 backdrop-blur-md rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/[0.03] p-10 md:p-14 mb-8">
            <div className="space-y-8">
              <div>
                <label className="block text-charcoal text-xs font-medium mb-3 tracking-[0.1em] uppercase">
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value)
                    if (!eventId) {
                      setEventId(generateEventId(e.target.value))
                    }
                  }}
                  placeholder="Ej: Boda Ana & Luis"
                  className="w-full px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all duration-200 font-light text-base"
                />
              </div>

              <div>
                <label className="block text-charcoal text-xs font-medium mb-3 tracking-[0.1em] uppercase">
                  Descripción (Opcional)
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Comparte tus momentos favoritos"
                  rows={4}
                  className="w-full px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all duration-200 font-light resize-none text-base leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-charcoal text-xs font-medium mb-3 tracking-[0.1em] uppercase">
                  ID del Evento (URL)
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    placeholder="boda-ana-luis-2026"
                    className="flex-1 px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-charcoal/25 focus:bg-white focus:shadow-[0_0_0_3px_rgba(26,26,26,0.05)] transition-all duration-200 font-light font-mono text-sm"
                  />
                  <button
                    onClick={() => setEventId(generateEventId(eventName || 'evento'))}
                    className="px-5 py-4 bg-charcoal/6 hover:bg-charcoal/10 text-charcoal border border-black/[0.08] rounded-[4px] transition-all duration-200 hover:border-charcoal/15"
                    title="Generar ID automático"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="text-charcoal/45 text-xs mt-3 font-light">
                  Este será el identificador único de tu evento en la URL
                </p>
              </div>

              <button
                onClick={handleCreateEvent}
                disabled={loading || !eventName.trim()}
                className="w-full px-10 py-5 bg-charcoal text-white rounded-[4px] cursor-pointer text-sm font-medium tracking-[0.15em] uppercase shadow-[0_2px_8px_rgba(26,26,26,0.15)] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(26,26,26,0.2)] active:translate-y-0 active:shadow-[0_2px_8px_rgba(26,26,26,0.15)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_2px_8px_rgba(26,26,26,0.15)] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Plus size={20} />
                    <span>Crear Evento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-md rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-black/[0.03] p-10 md:p-14 animate-[fadeIn_0.5s_ease-out]">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-8 tracking-tight text-center font-normal">
              Tu Evento está Listo
            </h2>

            <div className="flex flex-col md:flex-row gap-10 items-center justify-center mb-10">
              <div className="bg-white p-8 rounded-[4px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-black/[0.02]">
                <QRCodeSVG
                  id="qrcode-svg"
                  value={getEventUrl(createdEventId)}
                  size={200}
                  level="H"
                  includeMargin={true}
                  fgColor="#1A1A1A"
                  bgColor="#FFFFFF"
                />
              </div>

              <div className="flex-1 space-y-5 w-full md:w-auto">
                <div className="p-4 bg-terracotta/5 border border-terracotta/20 rounded-[4px] mb-2">
                  <p className="text-charcoal/60 text-xs font-medium tracking-[0.1em] uppercase mb-2">
                    Contraseña del Evento
                  </p>
                  <p className="font-serif text-3xl text-terracotta tracking-wider">
                    {eventPassword}
                  </p>
                  <p className="text-charcoal/40 text-[10px] mt-2">
                    Comparte esta contraseña con tus invitados
                  </p>
                </div>

                <div>
                  <label className="block text-charcoal text-xs font-medium mb-3 tracking-[0.1em] uppercase">
                    URL del Evento
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={getEventUrl(createdEventId)}
                      readOnly
                      className="flex-1 px-5 py-4 bg-white/90 border border-black/[0.08] rounded-[4px] text-charcoal font-mono text-sm focus:outline-none"
                    />
                    <button
                      onClick={handleCopyUrl}
                      className="px-5 py-4 bg-charcoal/6 hover:bg-charcoal/10 text-charcoal border border-black/[0.08] rounded-[4px] transition-all duration-200 hover:border-charcoal/15"
                      title="Copiar URL"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleDownloadQR}
                  className="w-full px-8 py-4 bg-white/90 backdrop-blur-sm text-charcoal border border-charcoal/15 rounded-[4px] cursor-pointer text-sm font-medium tracking-[0.15em] uppercase shadow-[0_1px_4px_rgba(26,26,26,0.08)] hover:bg-white hover:border-charcoal/25 hover:-translate-y-0.5 hover:shadow-[0_2px_8px_rgba(26,26,26,0.12)] active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Download size={18} />
                  <span>Descargar QR</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-black/[0.03]">
              <a
                href={`/event/${createdEventId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-charcoal/60 hover:text-charcoal text-sm font-light tracking-wide underline underline-offset-3 transition-colors"
              >
                Ver página del evento →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

