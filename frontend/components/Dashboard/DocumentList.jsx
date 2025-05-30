import React, { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../../services/api";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
} from "@mui/material";
import { Delete, Share, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";

const DocumentList = ({ onShare, refresh }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // New function to confirm deletion and handle errors
  const confirmDeleteDocument = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await handleDelete(id);
      } catch (error) {
        alert("Error deleting document.");
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (documents.length === 0) {
    return <Typography>No documents found. Upload your first PDF!</Typography>;
  }

  return (
    <Box>
      {documents.map((document) => (
        <Card
          key={document.id}
          sx={{
            mb: 2,
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h6">{document.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Uploaded on {new Date(document.created_at).toLocaleDateString()}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton
              edge="end"
              aria-label="view"
              component={Link}
              to={`/pdf/${document.id}`}
            >
              <Visibility />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="share"
              onClick={() => onShare(document)}
            >
              <Share />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => confirmDeleteDocument(document.id)}
            >
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default DocumentList;
