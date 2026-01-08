"use client"

import Link from "next/link"
import { Camera, Sparkles, Users, Heart, Zap, Shield, Clock, Download, Share2, ImagePlus } from "lucide-react"
import { useState, useEffect } from "react"

const polaroidImages = [
  {
    src: "https://plus.unsplash.com/premium_photo-1681841695231-d674aa32f65b?q=80&w=843&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rotation: -9,
    x: -110,
    y: 40,
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rotation: 6,
    x: 90,
    y: -60,
  },
  {
    src: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rotation: -4,
    x: -60,
    y: 90,
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1661759013744-4754d402459d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rotation: 8,
    x: 120,
    y: 50,
  },
  {
    src: "/image-1.png",
    rotation: -7,
    x: 0,
    y: -100,
  },
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

function FloatingElement({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  return (
    <div
      className="animate-float"
      style={{
        animationDelay: `${delay}s`,
        animationDuration: '6s'
      }}
    >
      {children}
    </div>
  )
}

function StatCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById(`stat-${end}`)
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [end])

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, end, duration])

  return (
    <span id={`stat-${end}`} className="font-serif text-5xl md:text-6xl text-terracotta">
      {count}{suffix}
    </span>
  )
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[95vh] px-6 py-20 md:py-32 text-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-10 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-sand/30 rounded-full blur-3xl"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          />
        </div>

        <div className="max-w-4xl mx-auto z-10">
          <div className="animate-fade-in-up">
            <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-charcoal mb-6 tracking-tight leading-[0.9] font-normal">
              Aura
            </h1>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <p className="text-terracotta text-xl md:text-2xl mb-4 tracking-wide font-light max-w-2xl mx-auto leading-relaxed">
              Comparte momentos efímeros en tus eventos
            </p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            <p className="text-charcoal/60 text-base md:text-lg mb-16 tracking-wide font-light max-w-xl mx-auto leading-relaxed">
              Sin cuentas. Sin descargas. Solo escanea, captura y comparte.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
            <Link
              href="/event/boda-ana-luis-2026"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-terracotta text-cream rounded-sm cursor-pointer text-sm font-medium tracking-widest uppercase shadow-[0_4px_14px_rgba(89,70,58,0.2)] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(89,70,58,0.25)] active:translate-y-0 transition-all duration-300 max-w-[177px]"
            >
              <Camera size={18} className="group-hover:rotate-12 transition-transform duration-500" />
              <span>Ver Demo</span>
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-charcoal border-2 border-charcoal/20 rounded-sm cursor-pointer text-sm font-medium tracking-widest uppercase hover:bg-charcoal/5 hover:border-charcoal/40 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 max-w-[177px]"
            >
              <span className="whitespace-nowrap">Crear Evento</span>
            </Link>
          </div>
        </div>

        <div className="relative w-full max-w-4xl h-[28rem] mb-16 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            {polaroidImages.map((img, index) => (
              <PolaroidCard key={index} {...img} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-y border-terracotta/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group hover:scale-105 transition-transform duration-300">
            <StatCounter end={1000} suffix="+" />
            <p className="text-charcoal/60 text-sm font-light tracking-wide mt-2">Eventos Creados</p>
          </div>
          <div className="group hover:scale-105 transition-transform duration-300">
            <StatCounter end={50} suffix="K+" />
            <p className="text-charcoal/60 text-sm font-light tracking-wide mt-2">Fotos Compartidas</p>
          </div>
          <div className="group hover:scale-105 transition-transform duration-300">
            <StatCounter end={98} suffix="%" />
            <p className="text-charcoal/60 text-sm font-light tracking-wide mt-2">Satisfacción</p>
          </div>
          <div className="group hover:scale-105 transition-transform duration-300">
            <StatCounter end={24} suffix="h" />
            <p className="text-charcoal/60 text-sm font-light tracking-wide mt-2">Duración Media</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          <div className="bg-sand/40 backdrop-blur-sm rounded-sm p-12 border border-terracotta/10 hover:border-terracotta/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(193,134,106,0.15)] transition-all duration-500 group">
            <FloatingElement delay={0}>
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-terracotta/20 group-hover:scale-110 transition-all duration-500">
                <Camera size={28} className="text-terracotta" />
              </div>
            </FloatingElement>
            <h3 className="font-serif text-2xl text-charcoal mb-4 tracking-tight font-normal">Instantáneo</h3>
            <p className="text-charcoal/65 text-sm font-light leading-relaxed tracking-wide">
              Captura y comparte momentos en tiempo real sin complicaciones
            </p>
          </div>

          <div className="bg-sand/40 backdrop-blur-sm rounded-sm p-12 border border-terracotta/10 hover:border-terracotta/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(193,134,106,0.15)] transition-all duration-500 group">
            <FloatingElement delay={0.5}>
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-terracotta/20 group-hover:scale-110 transition-all duration-500">
                <Users size={28} className="text-terracotta" />
              </div>
            </FloatingElement>
            <h3 className="font-serif text-2xl text-charcoal mb-4 tracking-tight font-normal">Sin Registro</h3>
            <p className="text-charcoal/65 text-sm font-light leading-relaxed tracking-wide">
              Acceso inmediato escaneando un código QR, sin crear cuenta
            </p>
          </div>

          <div className="bg-sand/40 backdrop-blur-sm rounded-sm p-12 border border-terracotta/10 hover:border-terracotta/30 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(193,134,106,0.15)] transition-all duration-500 group">
            <FloatingElement delay={1}>
              <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-terracotta/20 group-hover:scale-110 transition-all duration-500">
                <Sparkles size={28} className="text-terracotta" />
              </div>
            </FloatingElement>
            <h3 className="font-serif text-2xl text-charcoal mb-4 tracking-tight font-normal">Efímero</h3>
            <p className="text-charcoal/65 text-sm font-light leading-relaxed tracking-wide">
              Experiencias únicas que viven solo durante el evento
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-sand/20 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4 tracking-tight font-normal text-center">
            ¿Por qué Aura?
          </h2>
          <p className="text-charcoal/60 text-base md:text-lg mb-16 font-light leading-relaxed text-center max-w-2xl mx-auto">
            La forma más natural de compartir recuerdos en tus eventos especiales
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Zap size={24} className="text-terracotta" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2 font-normal">Velocidad Extrema</h3>
                <p className="text-charcoal/65 text-sm font-light leading-relaxed">
                  Las fotos aparecen en tiempo real. Tus invitados ven los momentos segundos después de capturarlos.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Shield size={24} className="text-terracotta" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2 font-normal">Privacidad Total</h3>
                <p className="text-charcoal/65 text-sm font-light leading-relaxed">
                  Sin almacenamiento en la nube. Tus fotos permanecen solo durante el evento y luego desaparecen.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Share2 size={24} className="text-terracotta" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2 font-normal">Compartir Instantáneo</h3>
                <p className="text-charcoal/65 text-sm font-light leading-relaxed">
                  Todos los invitados acceden al mismo álbum colectivo. Una experiencia verdaderamente compartida.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <Clock size={24} className="text-terracotta" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2 font-normal">Cero Configuración</h3>
                <p className="text-charcoal/65 text-sm font-light leading-relaxed">
                  Crea tu evento en 30 segundos. Genera el QR. Listo. Sin apps, sin registros, sin complicaciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 tracking-tight font-normal">
          Tan simple como respirar
        </h2>
        <p className="text-charcoal/60 text-base md:text-lg mb-16 font-light leading-relaxed">
          Tres pasos para compartir la magia de tu evento
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="group relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-terracotta/5 rounded-full blur-2xl group-hover:bg-terracotta/10 transition-colors duration-500" />
            <FloatingElement delay={0}>
              <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:bg-terracotta/30 transition-all duration-500 relative z-10">
                <span className="font-serif text-3xl text-terracotta">1</span>
              </div>
            </FloatingElement>
            <h3 className="font-serif text-xl text-charcoal mb-3 font-normal">Escanea</h3>
            <p className="text-charcoal/60 text-sm font-light leading-relaxed">El código QR de tu evento</p>
          </div>

          <div className="group relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-terracotta/5 rounded-full blur-2xl group-hover:bg-terracotta/10 transition-colors duration-500" />
            <FloatingElement delay={0.3}>
              <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:bg-terracotta/30 transition-all duration-500 relative z-10">
                <span className="font-serif text-3xl text-terracotta">2</span>
              </div>
            </FloatingElement>
            <h3 className="font-serif text-xl text-charcoal mb-3 font-normal">Captura</h3>
            <p className="text-charcoal/60 text-sm font-light leading-relaxed">Momentos desde tu cámara</p>
          </div>

          <div className="group relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-terracotta/5 rounded-full blur-2xl group-hover:bg-terracotta/10 transition-colors duration-500" />
            <FloatingElement delay={0.6}>
              <div className="w-20 h-20 bg-terracotta/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:bg-terracotta/30 transition-all duration-500 relative z-10">
                <span className="font-serif text-3xl text-terracotta">3</span>
              </div>
            </FloatingElement>
            <h3 className="font-serif text-xl text-charcoal mb-3 font-normal">Comparte</h3>
            <p className="text-charcoal/60 text-sm font-light leading-relaxed">Con todos al instante</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gradient-to-b from-sand/10 to-transparent py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4 tracking-tight font-normal text-center">
            Perfecto para cualquier ocasión
          </h2>
          <p className="text-charcoal/60 text-base md:text-lg mb-16 font-light leading-relaxed text-center max-w-2xl mx-auto">
            Desde bodas íntimas hasta festivales masivos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: "Bodas", desc: "Captura cada sonrisa y lágrima de alegría" },
              { icon: Users, title: "Eventos Corporativos", desc: "Documenta conferencias y team buildings" },
              { icon: Sparkles, title: "Cumpleaños", desc: "Celebra con fotos espontáneas y genuinas" },
              { icon: Camera, title: "Festivales", desc: "Miles de perspectivas, una sola experiencia" },
              { icon: ImagePlus, title: "Graduaciones", desc: "Preserva el orgullo de ese momento único" },
              { icon: Download, title: "Reuniones Familiares", desc: "Conecta generaciones a través de imágenes" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/50 backdrop-blur-sm rounded-sm p-8 border border-terracotta/10 hover:border-terracotta/30 hover:shadow-[0_8px_30px_rgba(193,134,106,0.12)] hover:-translate-y-1 transition-all duration-300 group"
              >
                <item.icon size={32} className="text-terracotta mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-lg text-charcoal mb-2 font-normal">{item.title}</h3>
                <p className="text-charcoal/60 text-sm font-light leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-terracotta/10 to-sand/30 rounded-sm p-12 md:p-16 border border-terracotta/20">
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6 tracking-tight font-normal">
            Empieza a crear recuerdos
          </h2>
          <p className="text-charcoal/70 text-base md:text-lg mb-10 font-light leading-relaxed max-w-xl mx-auto">
            Únete a miles de personas que ya están capturando momentos únicos con Aura
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/admin"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-terracotta text-cream rounded-sm cursor-pointer text-sm font-medium tracking-widest uppercase shadow-[0_4px_14px_rgba(89,70,58,0.2)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(89,70,58,0.3)] active:translate-y-0 transition-all duration-300"
            >
              <Sparkles size={18} className="group-hover:rotate-12 transition-transform duration-500" />
              <span>Crear Mi Evento Gratis</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-terracotta/10 py-12 px-6 text-center mt-20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart size={16} className="text-terracotta fill-terracotta animate-pulse" />
        </div>
        <p className="text-charcoal/50 text-sm font-light tracking-wide">
          Aura — Compartiendo momentos, creando recuerdos
        </p>
        <div className="flex justify-center gap-6 mt-6 text-xs text-charcoal/40 font-light">
          <a href="#" className="hover:text-terracotta transition-colors duration-300">Términos</a>
          <a href="#" className="hover:text-terracotta transition-colors duration-300">Privacidad</a>
          <a href="#" className="hover:text-terracotta transition-colors duration-300">Contacto</a>
        </div>
      </footer>
    </div>
  )
}