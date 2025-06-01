import React, { useState, useEffect } from "react";
import { shareDocument } from "../../services/api";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { CopyAll } from "@mui/icons-material";
import AlertSnackbar from "../Common/AlertSnackbar";
import "./Dashboard.css";

const ShareModal = ({ open, onClose, document }) => {
  const [email, setEmail] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Reset state when modal opens or document changes
  useEffect(() => {
    if (open) {
      setEmail("");
      setShareLink("");
      setCopied(false);
      setAlertInfo({ open: false, message: "", severity: "info" });
    }
  }, [open, document?.id]);

  const handleClose = () => {
    setEmail("");
    setShareLink("");
    setCopied(false);
    setAlertInfo({ open: false, message: "", severity: "info" });
    onClose();
  };

  const showAlert = (message, severity = "info") => {
    setAlertInfo({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleShare = async () => {
    try {
      const response = await shareDocument(document.id, email);
      setShareLink(response.data.share_link);
      if (response.data.email_sent === false) {
        showAlert(
          "Share link generated, but email not sent. You can copy the link manually.",
          "warning"
        );
      } else if (email && response.data.email_sent === true) {
        showAlert(
          "Share link generated and email sent successfully!",
          "success"
        );
      } else {
        showAlert("Share link generated successfully!", "success");
      }
    } catch (error) {
      showAlert(
        error.response?.data?.error ||
          "Failed to generate share link. Please try again.",
        "error"
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // Extended to 3 seconds
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Share "{document?.title}"</DialogTitle>
        <DialogContent>
          <Box className="share-modal-content">
            {!shareLink ? (
              <>
                <TextField
                  label="Recipient Email (optional)"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="contained" onClick={handleShare}>
                  Generate Share Link
                </Button>
              </>
            ) : (
              <>
                <Typography>Share this link with others:</Typography>
                <Box className="share-link-container">
                  <Typography className="share-link-text share-instruction-text">
                    {shareLink}
                  </Typography>
                  <IconButton onClick={copyToClipboard}>
                    <CopyAll />
                  </IconButton>
                </Box>
                {copied && (
                  <Typography className="copied-success-text">
                    Copied to clipboard!
                  </Typography>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="close-upload-button">
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

export default ShareModal;
