import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import PDFViewer from "../components/PDFViewer/PDFViewer";
import CommentSidebar from "../components/PDFViewer/CommentSidebar";
import CommentForm from "../components/PDFViewer/CommentForm";
import {
  getSharedDocument,
  getComments,
  createComment,
  updataMarkedSeenStatus,
  deleteComment,
} from "../services/api";
import AlertSnackbar from "../components/Common/AlertSnackbar";
import "./Pages.css";

const SharedPDF = () => {
  const { token } = useParams();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showAlert = (message, severity = "info") => {
    setAlertInfo({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getSharedDocument(token);
      setPdfDoc(response.data);
    } catch (error) {
      setError(true);
      showAlert(
        "Failed to load shared document. Please check the link and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(pdfDoc?.id, {
        shared_access: token,
      });
      setComments(response.data);
    } catch (error) {
      showAlert("Failed to load comments. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [token]);

  useEffect(() => {
    if (pdfDoc) fetchComments();
  }, [pdfDoc, token]);

  const handlePageRender = (pageInfo) => {
    setCurrentPage(pageInfo.pageNumber);
  };

  const handleCanvasClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCommentPosition({ x, y });
    setReplyingTo(null);
  };

  const handleSubmitComment = async (commentData) => {
    try {
      const tokenVal = token;
      const response = await createComment(pdfDoc.id, {
        ...commentData,
        shared_access: tokenVal,
      });
      setComments([...comments, response.data]);
      showAlert("Comment added successfully!", "success");
    } catch (error) {
      showAlert("Failed to add comment. Please try again.", "error");
    }
  };
  const handleMarkSeen = async (commentId, newStatus) => {
    try {
      await updataMarkedSeenStatus(pdfDoc.id, commentId, newStatus);
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, marked_seen: newStatus } : c
        )
      );
      showAlert("Comment status updated successfully!", "success");
    } catch (error) {
      showAlert("Failed to update comment status. Please try again.", "error");
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(pdfDoc.id, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      showAlert("Comment deleted successfully!", "success");
    } catch (error) {
      showAlert("Failed to delete comment. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <Box className="shared-pdf-loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !pdfDoc) {
    return (
      <>
        <Box className="shared-pdf-error-container">
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load document
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please check the link and try again
          </Typography>
        </Box>

        <AlertSnackbar
          open={alertInfo.open}
          onClose={handleCloseAlert}
          message={alertInfo.message}
          severity={alertInfo.severity}
          autoHideDuration={6000}
        />
      </>
    );
  }

  return (
    <>
      <Grid container spacing={2} className="shared-pdf-grid-container">
        <Grid item xs={8}>
          <Box className="shared-pdf-content">
            <Typography variant="h5" gutterBottom>
              {pdfDoc.title} (Shared)
            </Typography>
            <Box
              className="shared-pdf-viewer-container"
              onClick={handleCanvasClick}
            >
              <PDFViewer
                fileUrl={pdfDoc.file}
                onPageRender={handlePageRender}
              />
            </Box>
            <CommentForm
              onSubmit={handleSubmitComment}
              pageNumber={currentPage}
              x={commentPosition.x}
              y={commentPosition.y}
              parentComment={replyingTo}
              onCancel={() => setCommentPosition({ x: 0, y: 0 })}
            />
          </Box>
        </Grid>
        <Grid item xs={4} className="shared-pdf-sidebar">
          <CommentSidebar
            comments={comments}
            pageNumber={currentPage}
            onReply={setReplyingTo}
            onDelete={handleDeleteComment}
            onMarkSeen={handleMarkSeen}
          />
        </Grid>
      </Grid>

      <AlertSnackbar
        open={alertInfo.open}
        onClose={handleCloseAlert}
        message={alertInfo.message}
        severity={alertInfo.severity}
        autoHideDuration={6000}
      />
    </>
  );
};

export default SharedPDF;
