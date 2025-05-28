import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

const CommentForm = ({ onSubmit, pageNumber, x, y, parentComment, onCancel }) => {
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      content,
      page_number: pageNumber,
      x_position: x,
      y_position: y,
      guest_name: guestName,
      parent_comment: parentComment?.id,
    });
    setContent('');
    setGuestName('');
    if (onCancel) onCancel();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {parentComment && (
        <Typography variant="subtitle2">
          Replying to {parentComment.author?.username || parentComment.guest_name}
        </Typography>
      )}
      {!localStorage.getItem('access_token') && (
        <TextField
          fullWidth
          label="Your Name"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          required
          margin="normal"
        />
      )}
      <TextField
        fullWidth
        multiline
        rows={3}
        label="Your Comment"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        margin="normal"
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;