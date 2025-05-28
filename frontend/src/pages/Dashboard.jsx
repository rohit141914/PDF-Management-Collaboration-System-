import React, { useState } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import DocumentList from '../components/Dashboard/DocumentList';
import UploadModal from '../components/Dashboard/UploadModal';
import ShareModal from '../components/Dashboard/ShareModal';

const Dashboard = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [refreshList, setRefreshList] = useState(false);

  const handleShare = (document) => {
    setSelectedDocument(document);
    setShareModalOpen(true);
  };

  const handleUploadSuccess = () => {
    setRefreshList(!refreshList);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">My Documents</Typography>
          <Button
            variant="contained"
            onClick={() => setUploadModalOpen(true)}
          >
            Upload PDF
          </Button>
        </Box>
        <DocumentList onShare={handleShare} refresh={refreshList} />
      </Box>
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        document={selectedDocument}
      />
    </Container>
  );
};

export default Dashboard;