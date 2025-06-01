import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import "./PDFViewer.css";

const CommentForm = ({onSubmit, pageNumber, x, y, parentComment, onCancel}) => {
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");

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
    setContent("");
    setGuestName("");
    if (onCancel) onCancel();
  };

  return (
    <Box className="comment-form-container">
      <Box
        component="form"
        onSubmit={handleSubmit}
        className="comment-form-content"
      >
        {parentComment && (
          <Typography variant="subtitle2">
            Replying to{" "}
            {parentComment.author?.username || parentComment.guest_name}
          </Typography>
        )}
        {!localStorage.getItem("access_token") && (
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
        <Box className="comment-form-actions">
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              className="comment-form-cancel-button"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            className="comment-form-submit-button"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CommentForm;
