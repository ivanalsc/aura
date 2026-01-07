'use client'

import { X, Camera, RefreshCw, Zap, ZapOff } from 'lucide-react'
import { useRef, useState, useCallback, useEffect } from 'react'

interface CameraModalProps {
    onCapture: (file: File) => void
    onClose: () => void
}

export default function CameraModal({ onCapture, onClose }: CameraModalProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
    const [flash, setFlash] = useState(false)
    const [error, setError] = useState<string>('')

    const startCamera = useCallback(async () => {
        try {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }

            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    aspectRatio: { ideal: 4 / 3 } // Standard photo aspect ratio
                }
            })

            setStream(newStream)
            if (videoRef.current) {
                videoRef.current.srcObject = newStream
            }
            setError('')
        } catch (err) {
            console.error('Error accessing camera:', err)
            setError('No se pudo acceder a la cámara. Por favor verifica los permisos.')
        }
    }, [facingMode])

    useEffect(() => {
        startCamera()
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
        }
    }, [startCamera])

    const handleCapture = () => {
        if (!videoRef.current) return

        const canvas = document.createElement('canvas')
        const video = videoRef.current

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (ctx) {
            if (facingMode === 'user') {
                ctx.translate(canvas.width, 0)
                ctx.scale(-1, 1)
            }
            ctx.drawImage(video, 0, 0)

            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' })
                    onCapture(file)
                    onClose()
                }
            }, 'image/jpeg', 0.9)
        }
    }

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
    }

    return (
        <div className="fixed inset-0 bg-black z-[2000] flex flex-col animate-[fadeIn_0.3s_ease-out]">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <button
                    onClick={onClose}
                    className="p-2 text-white rounded-full hover:bg-white/20 transition-all"
                >
                    <X size={28} />
                </button>
                <button
                    onClick={() => setFlash(!flash)}
                    className={`p-2 rounded-full transition-all ${flash ? 'text-yellow-400' : 'text-white'}`}
                >
                    {flash ? <Zap size={24} /> : <ZapOff size={24} />}
                </button>
            </div>

            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                {error ? (
                    <div className="text-white text-center p-6">
                        <p>{error}</p>
                        <button
                            onClick={() => startCamera()}
                            className="mt-4 px-6 py-2 bg-white text-black rounded-full text-sm font-medium"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-transform duration-500 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                )}
            </div>

            <div className="bg-black/90 p-8 pb-12 flex justify-around items-center">
                <div className="w-12" /> {/* Spacer */}

                <button
                    onClick={handleCapture}
                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-all"
                >
                    <div className="w-16 h-16 bg-white rounded-full group-hover:scale-90 transition-all" />
                </button>

                <button
                    onClick={toggleCamera}
                    className="w-12 h-12 flex items-center justify-center text-white rounded-full bg-white/10 hover:bg-white/20 active:rotate-180 transition-all duration-500"
                >
                    <RefreshCw size={24} />
                </button>
            </div>
        </div>
    )
}
