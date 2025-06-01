import React, { useState, useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import "./PDFViewer.css";

// Set worker path - using the version from the imported pdfjsLib
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl, onPageRender, scale = 1.5 }) => {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument({ url: fileUrl });

    loadingTask.promise.then(
      (loadedPdf) => {
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
        setIsLoading(false);
      },
      (error) => {
        setError("Failed to load PDF document");
        setIsLoading(false);
      }
    );

    return () => {
      // Cancel any ongoing render task
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [fileUrl]);

  useEffect(() => {
    if (!pdf || !canvasRef.current) return;

    // Cancel previous render task if it exists
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    pdf.getPage(currentPage).then(
      (page) => {
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // Store the render task
        renderTaskRef.current = page.render(renderContext);

        renderTaskRef.current.promise.then(
          () => {
            if (onPageRender) {
              onPageRender({
                pageNumber: currentPage,
                width: viewport.width,
                height: viewport.height,
                scale,
              });
            }
            renderTaskRef.current = null;
          },
          (renderError) => {
            if (renderError.name !== "RenderingCancelledException") {
              console.error("Page render error:", renderError);
            }
            renderTaskRef.current = null;
          }
        );
      },
      (pageError) => {
        console.error("Page loading error:", pageError);
      }
    );
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

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!pdf) {
    return <Typography>No PDF document loaded.</Typography>;
  }

  return (
    <div className="pdf-viewer-container">
      <canvas ref={canvasRef} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Typography variant="body1">
          Page {currentPage} of {numPages}
        </Typography>
        <Button
          variant="contained"
          onClick={goToNextPage}
          disabled={currentPage >= numPages}
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default PDFViewer;
