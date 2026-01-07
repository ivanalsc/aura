'use client'

import { X, Download, ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

interface JournalPreviewModalProps {
    pdfUrl: string
    filename: string
    onClose: () => void
    onDownload: () => void
}

export default function JournalPreviewModal({ pdfUrl, filename, onClose, onDownload }: JournalPreviewModalProps) {
    // Bloquear scroll al abrir
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-[#F9F7F2] w-full max-w-5xl h-[90vh] rounded-[4px] shadow-2xl flex flex-col overflow-hidden animate-[slideUp_0.4s_ease-out]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white/50 border-b border-black/5 backdrop-blur-sm">
                    <h2 className="text-charcoal font-serif text-xl tracking-wide">
                        Vista Previa del Libro
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors text-charcoal/60 hover:text-charcoal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 bg-stone-100 p-4 md:p-8 flex items-center justify-center overflow-auto">
                    <div className="shadow-[0_8px_30px_rgba(0,0,0,0.12)] max-w-full h-full">
                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0`}
                            className="w-full h-full md:w-[60vh] md:aspect-[1/1.414] bg-white"
                            title="PDF Preview"
                        />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-5 bg-white border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-charcoal/50 text-xs font-light tracking-wide hidden md:block">
                        {filename}
                    </div>

                    <div className="flex w-full md:w-auto gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 md:flex-none px-6 py-3 border border-charcoal/20 rounded-[2px] text-charcoal text-xs font-medium tracking-widest uppercase hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={14} />
                            <span>Volver</span>
                        </button>

                        <button
                            onClick={onDownload}
                            className="flex-1 md:flex-none px-8 py-3 bg-charcoal text-white rounded-[2px] text-xs font-medium tracking-widest uppercase shadow-lg hover:bg-black active:translate-y-[1px] transition-all flex items-center justify-center gap-2"
                        >
                            <Download size={14} />
                            <span>Confirmar y Descargar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
