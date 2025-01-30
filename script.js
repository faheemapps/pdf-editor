const { PDFDocument, rgb } = PDFLib;

// DOM elements
const pdfInput = document.getElementById('pdfInput');
const pdfViewer = document.getElementById('pdfViewer');
const addTextButton = document.getElementById('addText');
const addImageButton = document.getElementById('addImage');
const highlightButton = document.getElementById('highlight');
const downloadButton = document.getElementById('download');

let pdfDoc = null;
let pdfBytes = null;

// Event: Upload PDF
pdfInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Load PDF using PDF.js
    const arrayBuffer = await file.arrayBuffer();
    pdfBytes = new Uint8Array(arrayBuffer);
    pdfDoc = await PDFDocument.load(pdfBytes);

    // Render PDF pages
    renderPdf(pdfBytes);
});

// Event: Add text to PDF
addTextButton.addEventListener('click', async () => {
    if (!pdfDoc) return;

    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add text to the page
    firstPage.drawText('Hello, PDF!', {
        x: 50,
        y: 50,
        size: 30,
        color: rgb(1, 0, 0), // Red color
    });

    // Re-render the PDF
    const modifiedPdfBytes = await pdfDoc.save();
    renderPdf(modifiedPdfBytes);
});

// Event: Add image to PDF
addImageButton.addEventListener('click', async () => {
    if (!pdfDoc) return;

    // Load an image (e.g., from a URL or file input)
    const imageUrl = 'https://example.com/image.png';
    const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);

    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Add image to the page
    firstPage.drawImage(image, {
        x: 50,
        y: 100,
        width: 100,
        height: 100,
    });

    // Re-render the PDF
    const modifiedPdfBytes = await pdfDoc.save();
    renderPdf(modifiedPdfBytes);
});

// Event: Highlight text
highlightButton.addEventListener('click', async () => {
    if (!pdfDoc) return;

    // Get the first page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Highlight text
    firstPage.drawRectangle({
        x: 50,
        y: 50,
        width: 200,
        height: 30,
        color: rgb(1, 1, 0), // Yellow color
        opacity: 0.5,
    });

    // Re-render the PDF
    const modifiedPdfBytes = await pdfDoc.save();
    renderPdf(modifiedPdfBytes);
});

// Event: Download edited PDF
downloadButton.addEventListener('click', async () => {
    if (!pdfDoc) return;

    // Save the edited PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited-pdf.pdf';
    link.click();
});

// Function: Render PDF pages
async function renderPdf(pdfBytes) {
    // Clear the viewer
    pdfViewer.innerHTML = '';

    // Load PDF using PDF.js
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    // Render each page
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page on the canvas
        const renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        await page.render(renderContext).promise;

        // Add the canvas to the viewer
        pdfViewer.appendChild(canvas);
    }
}
