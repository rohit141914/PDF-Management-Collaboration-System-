import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import PDFViewer from "../components/PDFViewer/PDFViewer";
import CommentSidebar from "../components/PDFViewer/CommentSidebar";
import CommentForm from "../components/PDFViewer/CommentForm";
import {
  getDocument,
  getComments,
  createComment,
  deleteComment,
  updataMarkedSeenStatus,
} from "../services/api";
import { isAuthenticated } from "../services/auth";
import AlertSnackbar from "../components/Common/AlertSnackbar";
import "./Pages.css";

const PDFView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });
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
      const response = await getDocument(id);
      setPdfDoc(response.data);
    } catch (error) {
      showAlert("Failed to load document. Please try again.", "error");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      showAlert("Failed to load comments. Please try again.", "error");
    }
  };

  useEffect(() => {
    fetchDocument();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [id]);

  // New authentication check
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);

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
      const response = await createComment(id, commentData);
      setComments([...comments, response.data]);
      showAlert("Comment added successfully!", "success");
    } catch (error) {
      showAlert("Failed to add comment. Please try again.", "error");
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

  if (!pdfDoc) {
    return (
      <Box className="pdf-view-loading-container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2} className="pdf-view-grid-container">
        <Grid item xs={8}>
          <Box className="pdf-view-content">
            <Typography variant="h5" gutterBottom>
              {pdfDoc.title}
            </Typography>
            <Box
              className="pdf-view-viewer-container"
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
        <Grid item xs={4} className="pdf-view-sidebar">
          <CommentSidebar
            comments={comments}
            pageNumber={currentPage}
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
      />
    </>
  );
};

export default PDFView;
