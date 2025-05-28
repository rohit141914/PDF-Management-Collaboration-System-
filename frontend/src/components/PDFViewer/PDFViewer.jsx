import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
import { Box, Typography } from '@mui/material';

// Load worker from nodefgh_modules

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl, onPageRender, scale = 1.5 }) => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadingTask = getDocument(fileUrl);
    loadingTask.promise.then((loadedPdf) => {
      setPdf(loadedPdf);
      setNumPages(loadedPdf.numPages);
    });
  }, [fileUrl]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    pdf.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      page.render(renderContext).promise.then(() => {
        if (onPageRender) {
          onPageRender({
            pageNumber: currentPage,
            width: viewport.width,
            height: viewport.height,
            scale,
          });
        }
      });
    });
  }, [pdf, currentPage, scale, onPageRender]);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!pdf) {
    return <Typography>Loading PDF...</Typography>;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <canvas ref={canvasRef} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <button onClick={goToPrevPage} disabled={currentPage <= 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {numPages}
        </span>
        <button onClick={goToNextPage} disabled={currentPage >= numPages}>
          Next
        </button>
      </Box>
    </Box>
  );
};

export default PDFViewer;