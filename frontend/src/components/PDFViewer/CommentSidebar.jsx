import React, { useState } from "react";
import { List, ListItem, Typography, Paper, Divider, Button, Box}
from "@mui/material";
import { format } from "date-fns";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import "./PDFViewer.css";

const CommentSidebar = ({ comments, pageNumber, onDelete, onMarkSeen }) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const filteredComments = comments.filter(
    (comment) => comment.page_number === pageNumber
  );

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (commentToDelete) {
      onDelete(commentToDelete.id);
      setDeleteConfirmOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setCommentToDelete(null);
  };

  return (
    <>
      <Paper elevation={3} className="comment-sidebar-container">
        <Typography
          variant="h6"
          gutterBottom
          className="comment-sidebar-header"
        >
          Comments (Page {pageNumber})
        </Typography>
        <Divider sx={{ my: 2 }} />
        {filteredComments.length === 0 ? (
          <Typography>No comments yet</Typography>
        ) : (
          <List>
            {filteredComments.map((comment) => {
              return (
                <React.Fragment key={comment.id}>
                  <ListItem alignItems="flex-start" className="comment-item">
                    <Box sx={{ width: "100%" }}>
                      {comment.guest_name ? (
                        <Typography component="div" className="guest-name">
                          By Guest User = {comment.guest_name}
                        </Typography>
                      ): (
                        <Typography component="div" className="guest-name">
                          By Admin
                        </Typography>
                      )}
                      <Typography
                        component="div"
                        variant="caption"
                        className="comment-timestamp"
                      >
                        {format(
                          new Date(comment.created_at),
                          "MMM d, yyyy h:mm a"
                        )}
                      </Typography>
                      <Typography
                        component="div"
                        className="comment-content"
                      >
                        {comment.content}
                      </Typography>
                      <div className="comment-actions">
                        <Button
                          variant="outlined"
                          size="small"
                          className={`comment-status-button ${
                            comment.marked_seen ? "done" : "in-progress"
                          }`}
                          onClick={() =>
                            onMarkSeen(comment.id, !comment.marked_seen)
                          }
                        >
                          {comment.marked_seen ? "Done" : "In progress"}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className="comment-delete-button"
                          onClick={() => handleDeleteClick(comment)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Box>
                  </ListItem>
                  <Divider
                    variant="inset"
                    component="li"
                    className="comment-divider"
                  />
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Paper>

      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Comment"
        message={`Are you sure you want to delete this comment? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
        confirmVariant="contained"
      />
    </>
  );
};

export default CommentSidebar;
