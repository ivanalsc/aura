import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Photo } from './types'

// Helper para convertir imagen a Base64
const toBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { mode: 'cors' })
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading image:', error)
    return url // Fallback
  }
}

export const generateJournalBlob = async (
  eventName: string,
  eventDate: string,
  photos: Photo[]
): Promise<{ url: string; filename: string }> => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Dimensiones A4 en mm y px (aprox para canvas)
  const wMm = pdf.internal.pageSize.getWidth()
  const hMm = pdf.internal.pageSize.getHeight()
  // Usamos 2x para calidad (794px ancho es ~96dpi A4, x2 = 1588)
  const contentWidth = 794
  const contentHeight = 1123

  // --- 1. PREPARAR IFRAME AISLADO ---
  // Usamos un iframe para asegurar que NO herede estilos globales (oklch)
  const iframe = document.createElement('iframe')
  Object.assign(iframe.style, {
    position: 'fixed',
    left: '-9999px',
    top: '0',
    width: `${contentWidth}px`,
    height: `${contentHeight}px`,
    border: 'none',
    zIndex: '-1'
  })
  document.body.appendChild(iframe)

  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) throw new Error("No se pudo acceder al documento del iframe")

    // Definimos estilos seguros (HEX) dentro del iframe
    const styleContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Lato:wght@300;400&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background: #F9F7F2;
        font-family: 'Lato', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      * {
        box-sizing: border-box;
      }
      .page-container {
        width: ${contentWidth}px;
        height: ${contentHeight}px;
        background: #F9F7F2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      h1 { font-family: 'Playfair Display', serif; }
      .photo-frame {
        padding: 15px; 
        background: #fff; 
        box-shadow: 0 4px 20px rgba(0,0,0,0.06); 
        border: 1px solid rgba(0,0,0,0.03);
        display: flex; 
        align-items: center; 
        justify-content: center;
        margin-bottom: 30px;
      }
    `

    // Función helper para renderizar y capturar dentro del iframe
    const captureFrame = async (html: string) => {
      if (!doc) return ''

      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>${styleContent}</style>
          </head>
          <body>${html}</body>
        </html>
      `)
      doc.close()

      // Esperar carga de imágenes internas
      const imgs = doc.body.querySelectorAll('img')
      if (imgs.length > 0) {
        await Promise.all(Array.from(imgs).map(img => {
          if (img.complete) return Promise.resolve()
          return new Promise(resolve => {
            img.onload = resolve
            img.onerror = resolve
          })
        }))
      }

      // Breve espera para fuentes/layout
      await new Promise(r => setTimeout(r, 100))

      const canvas = await html2canvas(doc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#F9F7F2',
        width: contentWidth,
        height: contentHeight,
        windowWidth: contentWidth,
        windowHeight: contentHeight
      })

      return canvas.toDataURL('image/jpeg', 0.85)
    }

    // --- 1. PORTADA ---
    const coverHtml = `
      <div class="page-container">
        <div style="text-align: center; color: #1A1A1A;">
          <h1 style="font-size: 80px; margin-bottom: 20px; font-weight: 400; color: #333;">AURA</h1>
          <div style="width: 40px; height: 1px; background: #C1866A; margin: 0 auto 30px auto;"></div>
          <h2 style="font-size: 24px; text-transform: uppercase; letter-spacing: 0.3em; font-weight: 300; margin-bottom: 12px; color: #333;">${eventName}</h2>
          <p style="font-size: 14px; letter-spacing: 0.1em; color: #666;">${eventDate}</p>
        </div>
      </div>
    `
    const coverData = await captureFrame(coverHtml)
    pdf.addImage(coverData, 'JPEG', 0, 0, wMm, hMm)

    // --- 2. PRECARGAR FOTOS Y GENERAR PÁGINAS ---
    const base64Images = await Promise.all(photos.map(p => toBase64(p.image_url)))

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      const base64Src = base64Images[i]

      pdf.addPage()

      const pageHtml = `
        <div class="page-container" style="padding: 80px 75px; position: relative;">
          <div class="photo-frame">
            <img 
              src="${base64Src}" 
              style="max-width: 550px; max-height: 650px; object-fit: contain; display: block;"
            />
          </div>
          
          ${photo.caption ? `
            <div style="width: 100%; max-width: 580px; text-align: left; margin-top: 10px;">
              <p style="font-size: 14px; color: #333; font-weight: 300; line-height: 1.6; letter-spacing: 0.02em; margin: 0;">
                ${photo.caption}
              </p>
            </div>
          ` : ''}

          <div style="position: absolute; bottom: 40px; right: 40px; font-size: 10px; color: #999;">
            ${i + 1}
          </div>
        </div>
      `

      const pageData = await captureFrame(pageHtml)
      pdf.addImage(pageData, 'JPEG', 0, 0, wMm, hMm)
    }

    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)
    const filename = `Aura_${eventName.replace(/[^a-z0-9]/gi, '_')}_Journal.pdf`

    return { url, filename }

  } finally {
    document.body.removeChild(iframe)
  }
}
