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

  const contentWidth = 794
  const contentHeight = 1123

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

    const styleContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Lato:wght@300;400&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        background: #F9F7F2;
        font-family: 'Lato', sans-serif;
        -webkit-font-smoothing: antialiased;
        color: #1A1A1A;
      }
      * { box-sizing: border-box; }
      
      .page-container {
        width: ${contentWidth}px;
        height: ${contentHeight}px;
        background: #F9F7F2;
        position: relative;
        overflow: hidden;
      }

    
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        box-shadow: 2px 4px 12px rgba(0,0,0,0.08); /* "Pegadas al papel" effect */
      }

     
      .serif { font-family: 'Playfair Display', serif; }
      .sans { font-family: 'Lato', sans-serif; }
      .caption {
        font-size: 10px;
        line-height: 1.5;
        color: #4A4A4A;
        font-weight: 300;
        margin-top: 8px;
        letter-spacing: 0.02em;
      }

   
      .layout-a {
        display: grid;
        grid-template-columns: 72% 28%;
        height: 100%;
        padding: 60px 50px;
      }
      .layout-a-main {
        position: relative;
        height: 85%;
        align-self: flex-start;
      }
      .layout-a-main img.big-img {
        height: 100%;
      }
      .layout-a-overlay {
        position: absolute;
        bottom: -40px;
        right: -30px;
        width: 240px;
        height: 300px;
        border: 8px solid #F9F7F2;
        box-shadow: 4px 8px 24px rgba(0,0,0,0.12);
        z-index: 10;
      }
      .layout-a-sidebar {
        padding-left: 25px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding-bottom: 120px;
      }

    
      .layout-b {
        padding: 80px 60px;
        height: 100%;
        display: flex;
        gap: 25px;
        align-items: center;
      }
      .layout-b-col-left {
        flex: 1;
        height: 650px;
      }
      .layout-b-col-right {
        flex: 1;
        height: 650px;
        display: flex;
        flex-direction: column;
        gap: 25px;
      }
      .layout-b-item-small {
        flex: 1;
        position: relative;
      }

 
      .layout-c {
        padding: 100px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .layout-c-frame {
        width: 450px;
        height: 550px;
        margin-bottom: 30px;
      }
      .layout-c-text {
        max-width: 400px;
        text-align: center;
        font-size: 11px;
        color: #666;
        letter-spacing: 0.05em;
      }

    
      .page-footer {
        position: absolute;
        bottom: 40px;
        right: 45px;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
        opacity: 0.6;
      }
 
      .page-number {
        font-family: 'Playfair Display', serif;
        font-size: 12px;
        color: #1A1A1A;
        line-height: 1; /* Ensure no extra height */
      }
    `


    const captureFrame = async (html: string) => {
      if (!doc) return ''
      doc.open()
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head><style>${styleContent}</style></head>
          <body>${html}</body>
        </html>
      `)
      doc.close()


      const images = doc.body.querySelectorAll('img')
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise(resolve => {
          img.onload = resolve
          img.onerror = resolve
        })
      }))

      await new Promise(r => setTimeout(r, 150))

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


    const coverHtml = `
      <div class="page-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div style="text-align: center; color: #1A1A1A;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 90px; margin-bottom: 25px; font-weight: 400; color: #2A2A2A;">AURA</h1>
          <div style="width: 50px; height: 1px; background: #C1866A; margin: 0 auto 35px auto;"></div>
          <h2 style="font-family: 'Lato', sans-serif; font-size: 16px; text-transform: uppercase; letter-spacing: 0.4em; font-weight: 300; margin-bottom: 15px; color: #4A4A4A;">${eventName}</h2>
          <p style="font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; letter-spacing: 0.1em; color: #888;">${eventDate}</p>
        </div>
      </div>
    `
    const coverData = await captureFrame(coverHtml)
    pdf.addImage(coverData, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight())

    const base64Images = await Promise.all(photos.map(p => toBase64(p.image_url)))


    let currentIndex = 0
    const layoutPattern = ['A', 'B', 'C']
    let patternIdx = 0
    let pageNum = 1

    while (currentIndex < photos.length) {
      const layoutType = layoutPattern[patternIdx % layoutPattern.length]
      let batchSize = 1

      if (layoutType === 'A') batchSize = 2
      if (layoutType === 'B') batchSize = 3
      if (layoutType === 'C') batchSize = 1

      const remaining = photos.length - currentIndex
      if (remaining < batchSize) {
        if (remaining === 2) batchSize = 2
        else batchSize = 1
      }

      const batchPhotos = photos.slice(currentIndex, currentIndex + batchSize)
      const batchImages = base64Images.slice(currentIndex, currentIndex + batchSize)

      let pageHtml = ''
      const footerHtml = `
        <div class="page-footer">
          
          <span class="page-number">${pageNum}</span>
        </div>
      `

      if (batchSize === 2) {
        pageHtml = `
          <div class="page-container">
            <div class="layout-a">
              <div class="layout-a-main">
                <img src="${batchImages[0]}" class="big-img" />
                <div class="layout-a-overlay">
                  <img src="${batchImages[1]}" />
                </div>
              </div>
              <div class="layout-a-sidebar">
                ${batchPhotos[0].caption ? `<div class="caption"><strong>01.</strong> ${batchPhotos[0].caption}</div>` : ''}
                ${batchPhotos[1].caption ? `<div class="caption" style="margin-top:20px;"><strong>02.</strong> ${batchPhotos[1].caption}</div>` : ''}
              </div>
            </div>
            ${footerHtml}
          </div>
        `
      }
      else if (batchSize === 3) {
        pageHtml = `
          <div class="page-container">
            <div class="layout-b">
              <div class="layout-b-col-left">
                <img src="${batchImages[0]}" />
              </div>
              <div class="layout-b-col-right">
                <div class="layout-b-item-small"><img src="${batchImages[1]}" /></div>
                <div class="layout-b-item-small"><img src="${batchImages[2]}" /></div>
              </div>
            </div>
            <div style="position: absolute; bottom: 85px; left: 60px; width: calc(100% - 120px); display: flex; gap: 20px;">
               ${batchPhotos.map((p, idx) => p.caption ? `<div class="caption" style="flex:1;"><strong>0${idx + 1}.</strong> ${p.caption}</div>` : '').join('')}
            </div>
            ${footerHtml}
          </div>
        `
      }
      else {
        pageHtml = `
          <div class="page-container">
            <div class="layout-c">
              <div class="layout-c-frame">
                <img src="${batchImages[0]}" />
              </div>
              ${batchPhotos[0].caption ? `
                <div class="layout-c-text serif">
                  "${batchPhotos[0].caption}"
                </div>
              ` : ''}
            </div>
            ${footerHtml}
          </div>
        `
      }

      pdf.addPage()
      const pageCanvas = await captureFrame(pageHtml)
      pdf.addImage(pageCanvas, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight())

      currentIndex += batchSize
      patternIdx++
      pageNum++
    }

    const outputBlob = pdf.output('blob')
    const url = URL.createObjectURL(outputBlob)
    const filename = `Aura_${eventName.replace(/[^a-z0-9]/gi, '_')}_Journal.pdf`

    return { url, filename }

  } finally {
    document.body.removeChild(iframe)
  }
}
