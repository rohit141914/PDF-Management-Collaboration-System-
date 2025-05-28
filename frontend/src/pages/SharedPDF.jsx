import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography } from '@mui/material';
import PDFViewer from '../components/PDFViewer/PDFViewer';
import CommentSidebar from '../components/PDFViewer/CommentSidebar';
import CommentForm from '../components/PDFViewer/CommentForm';
import { getSharedDocument, getComments, createComment } from '../services/api';

const SharedPDF = () => {
  const { token } = useParams();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [commentPosition, setCommentPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await getSharedDocument(token);
        setPdfDoc(response.data);
      } catch (error) {
        console.error('Error fetching shared document:', error);
      }
    };
    fetchDocument();
  }, [token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments(pdfDoc?.id, { shared_access: token });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
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
      const response = await createComment(pdfDoc.id, {
        ...commentData,
        shared_access: token,
      });
      setComments([...comments, response.data]);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  if (!pdfDoc) {
    return <Typography>Loading shared document...</Typography>;
  }

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 64px)' }}>
      <Grid item xs={8}>
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {pdfDoc.title} (Shared)
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              position: 'relative',
              border: '1px solid #ccc',
            }}
            onClick={handleCanvasClick}
          >
            <PDFViewer
              fileUrl={pdfDoc.file}
              onPageRender={handlePageRender}
            />
          </Box>
          {commentPosition.x > 0 && commentPosition.y > 0 && (
            <CommentForm
              onSubmit={handleSubmitComment}
              pageNumber={currentPage}
              x={commentPosition.x}
              y={commentPosition.y}
              parentComment={replyingTo}
              onCancel={() => setCommentPosition({ x: 0, y: 0 })}
            />
          )}
        </Box>
      </Grid>
      <Grid item xs={4}>
        <CommentSidebar
          comments={comments}
          pageNumber={currentPage}
          onReply={setReplyingTo}
        />
      </Grid>
    </Grid>
  );
};

export default SharedPDF;