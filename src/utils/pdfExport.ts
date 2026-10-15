import html2canvas from 'html2canvas';
import { toCanvas, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Robust element-to-canvas rendering engine with 3 fallbacks.
 * Uses html2canvas first (which handles Bengali fonts, CORS, and full CSS without foreignObject crashes).
 */
export async function captureElementToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  // Strategy 1: html2canvas (Primary, highest reliability for text, typography, and styling)
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution for crisp PDF and JPG
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollY: 0,
      scrollX: 0,
      windowWidth: Math.max(element.scrollWidth, 800),
    });
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (errHtml2Canvas) {
    console.warn('html2canvas capture failed, trying html-to-image toCanvas:', errHtml2Canvas);
  }

  // Strategy 2: html-to-image toCanvas
  try {
    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      skipFonts: true,
      fontEmbedCSS: '',
    });
    if (canvas && canvas.width > 0 && canvas.height > 0) {
      return canvas;
    }
  } catch (errToCanvas) {
    console.warn('toCanvas failed, trying toJpeg fallback:', errToCanvas);
  }

  // Strategy 3: toJpeg to Image then draw onto canvas
  const imgData = await toJpeg(element, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    skipFonts: true,
    fontEmbedCSS: '',
  });

  const img = new Image();
  img.src = imgData;
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
  });

  const fallbackCanvas = document.createElement('canvas');
  fallbackCanvas.width = img.width;
  fallbackCanvas.height = img.height;
  const ctx = fallbackCanvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);
  }
  return fallbackCanvas;
}

/**
 * Exports DOM element to a clean, standard 1-page A4 PDF.
 * Proportional scaling ensures all content, tables, headers, and footer
 * fit gracefully on one page with ample margins (no clipping at the bottom!).
 */
export async function exportElementToPDF(
  element: HTMLElement,
  fileName: string = 'Monthly_Statement.pdf'
): Promise<boolean> {
  try {
    const canvas = await captureElementToCanvas(element);
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (canvasWidth <= 0 || canvasHeight <= 0) {
      throw new Error('Canvas has invalid dimensions');
    }

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in mm: 210 x 297
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Generous, professional document margins
    const marginX = 10; // 10mm left and right
    const marginTop = 12; // 12mm top
    const marginBottom = 14; // 14mm bottom (guarantees clear bottom breathing room!)
    const printableWidth = pdfWidth - marginX * 2; // 190mm
    const printableHeight = pdfHeight - marginTop - marginBottom; // 271mm

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Calculate natural rendered height when fitted to printableWidth
    const naturalHeight = (canvasHeight * printableWidth) / canvasWidth;

    // Fit on 1 single page:
    // If naturalHeight <= printableHeight, scale is 1. If it's taller, scale it down proportionally
    // so that everything is visible on exactly 1 single page!
    if (naturalHeight <= printableHeight * 1.5) {
      const scale = naturalHeight > printableHeight ? printableHeight / naturalHeight : 1;
      const finalW = printableWidth * scale;
      const finalH = naturalHeight * scale;

      // Center horizontally and vertically within printable area
      const xOffset = marginX + (printableWidth - finalW) / 2;
      const yOffset = marginTop + (printableHeight - finalH) / 2;

      pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalW, finalH, undefined, 'FAST');
    } else {
      // For extraordinarily long month ledgers (e.g. 50+ entries), paginate cleanly
      let heightLeft = naturalHeight;
      let position = marginTop;

      pdf.addImage(imgData, 'JPEG', marginX, position, printableWidth, naturalHeight, undefined, 'FAST');
      heightLeft -= printableHeight;

      while (heightLeft > 0) {
        position = heightLeft - naturalHeight + marginTop;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', marginX, position, printableWidth, naturalHeight, undefined, 'FAST');
        heightLeft -= printableHeight;
      }
    }

    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('exportElementToPDF error:', err);
    return false;
  }
}

/**
 * Exports the statement element directly as a high-resolution JPG image file.
 */
export async function exportElementToImage(
  element: HTMLElement,
  fileName: string = 'Monthly_Statement.jpg'
): Promise<boolean> {
  try {
    const canvas = await captureElementToCanvas(element);
    
    // Convert canvas to JPG Blob/DataURL
    const dataUrl = canvas.toDataURL('image/jpeg', 0.98);

    if (!dataUrl || dataUrl.length < 50) {
      throw new Error('Image data generation failed');
    }

    const link = document.createElement('a');
    link.download = fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') ? fileName : `${fileName}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('exportElementToImage error:', err);
    return false;
  }
}
