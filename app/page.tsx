"use client"

import Link from "next/link"
import { Camera, Sparkles, Users, Heart } from "lucide-react"
import { useState } from "react"

const polaroidImages = [
  { src: "/image-1.png", rotation: -8, x: -40, y: 20 },
  { src: "/image-1.png", rotation: 5, x: 20, y: -10 },
  { src: "/image-1.png", rotation: -3, x: -20, y: 30 },
  { src: "/image-1.png", rotation: 7, x: 30, y: 10 },
  { src: "/image-1.png", rotation: -6, x: 0, y: -20 },
]

function PolaroidCard({
  src,
  rotation,
  x,
  y,
  index,
}: { src: string; rotation: number; x: number; y: number; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute transition-all duration-700 ease-out"
      style={{
        transform: `translate(${isHovered ? x * 1.5 : x}px, ${isHovered ? y * 1.5 : y}px) rotate(${isHovered ? rotation * 1.2 : rotation}deg) scale(${isHovered ? 1.05 : 1})`,
        zIndex: isHovered ? 20 : 10 - index,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="bg-[#faf8f5] p-4 pb-12 shadow-[0_8px_30px_rgba(89,70,58,0.15)] cursor-pointer"
        style={{
          boxShadow: isHovered ? "0 20px 60px rgba(89, 70, 58, 0.3)" : "0 8px 30px rgba(89, 70, 58, 0.15)",
        }}
      >
        <img
          src={src || "/placeholder.svg"}
          alt={`Momento de evento ${index + 1}`}
          className="w-64 h-72 object-cover"
        />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[95vh] px-6 py-20 md:py-32 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto z-10">
          <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-charcoal mb-6 tracking-tight leading-[0.9] font-normal">
            Aura
          </h1>
          <p className="text-terracotta text-xl md:text-2xl mb-4 tracking-wide font-light max-w-2xl mx-auto leading-relaxed">
            Comparte momentos efímeros en tus eventos
          </p>
          <p className="text-charcoal/60 text-base md:text-lg mb-16 tracking-wide font-light max-w-xl mx-auto leading-relaxed">
            Sin cuentas. Sin descargas. Solo escanea, captura y comparte.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <Link
              href="/event/boda-ana-luis-2026"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-terracotta text-cream rounded-sm cursor-pointer text-sm font-medium tracking-widest uppercase shadow-[0_4px_14px_rgba(89,70,58,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(89,70,58,0.25)] active:translate-y-0 transition-all duration-300"
            >
              <Camera size={18} className="group-hover:rotate-12 transition-transform duration-500" />
              <span>Ver Demo</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-charcoal border-2 border-charcoal/20 rounded-sm cursor-pointer text-sm font-medium tracking-widest uppercase hover:bg-charcoal/5 hover:border-charcoal/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
            >
              <span>Crear Evento</span>
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-4xl h-96 mb-16 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            {polaroidImages.map((img, index) => (
              <PolaroidCard key={index} {...img} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div className="bg-sand/40 backdrop-blur-sm rounded-sm p-12 border border-terracotta/10 hover:border-terracotta/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(193,134,106,0.15)] transition-all duration-500 group">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-terracotta/20 group-hover:scale-110 transition-all duration-500">
              <Camera size={28} className="text-terracotta" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4 tracking-tight font-normal">Instantáneo</h3>
            <p className="text-charcoal/65 text-sm font-light leading-relaxed tracking-wide">
              Captura y comparte momentos en tiempo real sin complicaciones
            </p>
          </div>

          <div className="bg-sand/40 backdrop-blur-sm rounded-sm p-12 border border-terracotta/10 hover:border-terracotta/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(193,134,106,0.15)] transition-all duration-500 group">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-terracotta/20 group-hover:scale-110 transition-all duration-500">
              <Users size={28} className="text-terracotta" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4 tracking-tight font-normal">Sin Registro</h3>
            <p className="text-charcoal/65 text-sm font-light leading-relaxed tracking-wide">
              Acceso inmediato escaneando un código QR, sin crear cuenta
            </p>
          </div>

          <div className="bg-sand/40 backdrop-blur-sm rounded-sm p-12 border border-terracotta/10 hover:border-terracotta/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(193,134,106,0.15)] transition-all duration-500 group">
            <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-terracotta/20 group-hover:scale-110 transition-all duration-500">
              <Sparkles size={28} className="text-terracotta" />
            </div>
            <h3 className="font-serif text-2xl text-charcoal mb-4 tracking-tight font-normal">Efímero</h3>
            <p className="text-charcoal/65 text-sm font-light leading-relaxed tracking-wide">
              Experiencias únicas que viven solo durante el evento
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 tracking-tight font-normal">
          Tan simple como respirar
        </h2>
        <p className="text-charcoal/60 text-base md:text-lg mb-16 font-light leading-relaxed">
          Tres pasos para compartir la magia de tu evento
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group">
            <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
              <span className="font-serif text-3xl text-terracotta">1</span>
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-3 font-normal">Escanea</h3>
            <p className="text-charcoal/60 text-sm font-light leading-relaxed">El código QR de tu evento</p>
          </div>

          <div className="group">
            <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
              <span className="font-serif text-3xl text-terracotta">2</span>
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-3 font-normal">Captura</h3>
            <p className="text-charcoal/60 text-sm font-light leading-relaxed">Momentos desde tu cámara</p>
          </div>

          <div className="group">
            <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500">
              <span className="font-serif text-3xl text-terracotta">3</span>
            </div>
            <h3 className="font-serif text-xl text-charcoal mb-3 font-normal">Comparte</h3>
            <p className="text-charcoal/60 text-sm font-light leading-relaxed">Con todos al instante</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-terracotta/10 py-12 px-6 text-center mt-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart size={16} className="text-terracotta fill-terracotta" />
        </div>
        <p className="text-charcoal/50 text-sm font-light tracking-wide">
          Aura — Compartiendo momentos, creando recuerdos
        </p>
      </footer>
    </div>
  )
}
