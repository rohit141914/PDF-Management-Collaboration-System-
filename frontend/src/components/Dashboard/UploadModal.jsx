import React, { useState, useEffect, useRef } from "react";
import { uploadDocument } from "../../services/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  LinearProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import Typography from "@mui/material/Typography";

const UploadModal = ({ open, onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const fileInputRef = useRef(null);

  // Reset state when modal opens or closes
  useEffect(() => {
    if (open) {
      setTitle("");
      setFile(null);
      setUploading(false);
      setError("");
      setAlertInfo({ open: false, message: "", severity: "info" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [open]);

  const showAlert = (message, severity = "info") => {
    setAlertInfo({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleClose = () => {
    setTitle("");
    setFile(null);
    setUploading(false);
    setError("");
    setAlertInfo({ open: false, message: "", severity: "info" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!title || !file) {
      setError("Please provide both title and file");
      showAlert("Please provide both title and file", "warning");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      await uploadDocument(formData);
        handleClose();
        onUploadSuccess();
    } catch (err) {
      setError("Upload failed. Please try again.");
      showAlert("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload PDF Document</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Document Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button variant="contained" component="label">
              Select PDF File
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".pdf"
                onChange={handleFileChange}
              />
            </Button>
            {file && <Typography>{file.name}</Typography>}
            {uploading && <LinearProgress />}
            {error && <Typography color="error">{error}</Typography>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="close-upload-button">Cancel</Button>
          <Button onClick={handleSubmit} disabled={uploading} className="close-upload-button">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={alertInfo.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertInfo.severity}
          sx={{ width: "100%" }}
        >
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UploadModal;
