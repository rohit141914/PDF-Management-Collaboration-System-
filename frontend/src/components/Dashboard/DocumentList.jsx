import React, { useEffect, useState } from 'react';
import { getDocuments, deleteDocument } from '../../services/api';
import { List, ListItem, ListItemText, IconButton, Typography, Box, Paper } from '@mui/material';
import { Delete, Share, Visibility } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const DocumentList = ({ onShare }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await getDocuments();
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (documents.length === 0) {
    return <Typography>No documents found. Upload your first PDF!</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <List>
        {documents.map((document) => (
          <ListItem
            key={document.id}
            secondaryAction={
              <Box>
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
                  onClick={() => handleDelete(document.id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={document.title}
              secondary={`Uploaded on ${new Date(document.created_at).toLocaleDateString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DocumentList;