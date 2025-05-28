import React, { useState } from 'react';
import { shareDocument } from '../../services/api';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box, Typography, IconButton } from '@mui/material';
import { CopyAll } from '@mui/icons-material';

const ShareModal = ({ open, onClose, document }) => {
  const [email, setEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const response = await shareDocument(document.id, email);
      setShareLink(response.data.share_link);
    } catch (error) {
      console.error('Error sharing document:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Share "{document?.title}"</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
                  {shareLink}
                </Typography>
                <IconButton onClick={copyToClipboard}>
                  <CopyAll />
                </IconButton>
              </Box>
              {copied && <Typography color="primary">Copied to clipboard!</Typography>}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareModal;