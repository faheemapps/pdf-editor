import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = 
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PDFEditor() {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  function onFileChange(event) {
    setFile(event.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    `<div class="p-4">
      <input type="file" id="fileInput" class="mb-4" />
      <div id="pdfContainer"></div>
      <button class="mt-4" id="saveButton">Save & Download</button>
    </div>`
  );
}

document.getElementById("fileInput").addEventListener("change", function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const pdfData = new Uint8Array(event.target.result);
      pdfjs.getDocument({ data: pdfData }).promise.then(pdf => {
        const pdfContainer = document.getElementById("pdfContainer");
        pdfContainer.innerHTML = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          pdf.getPage(i).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            pdfContainer.appendChild(canvas);
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            page.render(renderContext);
          });
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
});
