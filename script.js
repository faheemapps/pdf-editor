import { PDFDocument } from 'https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js';

const pdfInput = document.getElementById('pdfInput');
const pdfCanvas = document.getElementById('pdfCanvas');
const addTextButton = document.getElementById('addText');
const downloadButton = document.getElementById('download');

let pdfDoc = null;

pdfInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    pdfDoc = await PDFDocument.load(arrayBuffer);
    renderPdf(pdfDoc);
});

addTextButton.addEventListener('click', async () => {
    if (!pdfDoc) return;
    const page = pdfDoc.getPages()[0];
    page.drawText('Hello, PDF!', {
        x: 50,
        y: 50,
        size: 30,
        color: rgb(1, 0, 0),
    });
    renderPdf(pdfDoc);
});

downloadButton.addEventListener('click', async () => {
    if (!pdfDoc) return;
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited-pdf.pdf';
    link.click();
});

async function renderPdf(pdfDoc) {
    const pdfBytes = await pdfDoc.save();
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const context = pdfCanvas.getContext('2d');
    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;
    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };
    await page.render(renderContext).promise;
}
