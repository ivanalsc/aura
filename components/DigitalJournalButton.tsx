'use client'

import { useState } from 'react'
import { BookOpen, Loader2 } from 'lucide-react'
import { Photo } from '@/lib/types'
import { generateJournalBlob } from '@/lib/journal'
import JournalPreviewModal from './JournalPreviewModal'

interface DigitalJournalButtonProps {
    eventName: string
    photos: Photo[]
}

export default function DigitalJournalButton({ eventName, photos }: DigitalJournalButtonProps) {
    const [generating, setGenerating] = useState(false)

    // Preview State
    const [showPreview, setShowPreview] = useState(false)
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [pdfFilename, setPdfFilename] = useState<string>('')

    const handleGenerate = async () => {
        if (photos.length === 0) return

        setGenerating(true)
        try {
            const date = new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })

            const { url, filename } = await generateJournalBlob(eventName, date, photos)

            setPdfUrl(url)
            setPdfFilename(filename)
            setShowPreview(true)
        } catch (error) {
            console.error('Error generating journal:', error)
            alert('Hubo un error al generar el libro. Por favor intenta de nuevo.')
        } finally {
            setGenerating(false)
        }
    }

    const handleDownload = () => {
        if (pdfUrl && pdfFilename) {
            const link = document.createElement('a')
            link.href = pdfUrl
            link.download = pdfFilename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Cerrar modal después de descargar
            handleClose()
        }
    }

    const handleClose = () => {
        setShowPreview(false)
        // Limpiar URL del blob para liberar memoria
        if (pdfUrl) URL.revokeObjectURL(pdfUrl)
        setPdfUrl(null)
    }

    return (
        <>
            <button
                onClick={handleGenerate}
                disabled={generating || photos.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-charcoal/60 border border-charcoal/10 rounded-sm cursor-pointer text-xs font-medium tracking-widest uppercase hover:bg-white hover:text-charcoal hover:border-charcoal/30 active:translate-y-[1px] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="Generar Libro PDF"
            >
                {generating ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <BookOpen size={14} />
                )}
                <span>{generating ? 'Maquetando...' : 'Libro de Recuerdos'}</span>
            </button>

            {showPreview && pdfUrl && (
                <JournalPreviewModal
                    pdfUrl={pdfUrl}
                    filename={pdfFilename}
                    onClose={handleClose}
                    onDownload={handleDownload}
                />
            )}
        </>
    )
}
