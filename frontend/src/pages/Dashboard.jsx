import React, { useState } from "react";
import { Container, Box, Button, Typography, TextField } from "@mui/material";
import DocumentList from "../components/Dashboard/DocumentList";
import UploadModal from "../components/Dashboard/UploadModal";
import ShareModal from "../components/Dashboard/ShareModal";
import AlertSnackbar from "../components/Common/AlertSnackbar";
import "./Pages.css";

const Dashboard = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const showAlert = (message, severity = "info") => {
    setAlertInfo({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, open: false });
  };

  const handleShare = (document) => {
    setSelectedDocument(document);
    setShareModalOpen(true);
  };

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    setRefreshList(!refreshList);
    showAlert("Document uploaded successfully!", "success");
  };

  const handleShareClose = () => {
    setSelectedDocument(null);
    setShareModalOpen(false);
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box className="dashboard-page-container">
          <Box className="dashboard-page-header">
            <Typography variant="h4">My Documents</Typography>
            <Box>

            <TextField
              placeholder="Search Documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              size="small"
              style={{ marginLeft: "1rem" }}
            />
            <Button
              variant="contained"
              onClick={() => setUploadModalOpen(true)}
              style={{ marginLeft: "1rem" }}
            >
              Upload PDF
            </Button>
            </Box>
          </Box>
          <DocumentList
            onShare={handleShare}
            refresh={refreshList}
            searchQuery={searchQuery}
          />
        </Box>
        <UploadModal
          key={uploadModalOpen ? "open" : "closed"}
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
        <ShareModal
          key={selectedDocument?.id || "no-document"}
          open={shareModalOpen}
          onClose={handleShareClose}
          document={selectedDocument}
        />
      </Container>

      <AlertSnackbar
        open={alertInfo.open}
        onClose={handleCloseAlert}
        message={alertInfo.message}
        severity={alertInfo.severity}
      />
    </>
  );
};

export default Dashboard;
