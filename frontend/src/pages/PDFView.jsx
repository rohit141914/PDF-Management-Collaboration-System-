import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

const PDFView = () => {
  const { id } = useParams();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await getDocument(id);
        setPdfDoc(response.data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchDocument();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(id);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [id]);

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
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(pdfDoc.id, commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
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
    } catch (error) {
      console.error("Error updating comment marked seen status:", error);
    }
  };

  if (!pdfDoc) {
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
  console.log(pdfDoc);

  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: "calc(100vh - 64px)",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid item xs={8}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {pdfDoc.title}
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              position: "relative",
              border: "1px solid #ccc",
            }}
            onClick={handleCanvasClick}
          >
            <PDFViewer fileUrl={pdfDoc.file} onPageRender={handlePageRender} />
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
      <Grid item xs={4} sx={{ alignSelf: "flex-start", mt: "56px" }}>
        <CommentSidebar
          comments={comments}
          pageNumber={currentPage}
          onDelete={handleDeleteComment}
          onMarkSeen={handleMarkSeen}
        />
      </Grid>
    </Grid>
  );
};

export default PDFView;
