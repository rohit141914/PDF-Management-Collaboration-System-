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
  Tooltip,
} from "@mui/material";
import { Delete, Share, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import AlertSnackbar from "../Common/AlertSnackbar";
import "./Dashboard.css";

const DocumentList = ({ onShare, refresh }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await getDocuments();
      setDocuments(response.data);
    } catch (err) {
      showAlert("Failed to load documents. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [refresh]);

  const showAlert = (message, severity = "info") => {
    setAlertInfo({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDocument(documentToDelete.id);
      setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id));
      showAlert("Document deleted successfully!", "success");
    } catch (error) {
      showAlert("Error deleting document. Please try again.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDocumentToDelete(null);
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (documents.length === 0) {
    return <Typography>No documents found. Upload your first PDF!</Typography>;
  }

  return (
    <>
      <Box>
        {documents.map((document) => (
          <Card key={document.id} className="document-card">
            <CardContent className="document-card-content">
              <Typography variant="h6">{document.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Uploaded on {new Date(document.created_at).toLocaleDateString()}
              </Typography>
            </CardContent>
            <CardActions>
              <Tooltip title="View Document">
                <IconButton
                  edge="end"
                  aria-label="view"
                  component={Link}
                  to={`/pdf/${document.id}`}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share Document">
                <IconButton
                  edge="end"
                  aria-label="share"
                  onClick={() => onShare(document)}
                >
                  <Share />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Document">
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteClick(document)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
      </Box>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Document"
        message={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        confirmVariant="contained"
      />

      <AlertSnackbar
        open={alertInfo.open}
        onClose={handleCloseAlert}
        message={alertInfo.message}
        severity={alertInfo.severity}
      />
    </>
  );
};

export default DocumentList;
