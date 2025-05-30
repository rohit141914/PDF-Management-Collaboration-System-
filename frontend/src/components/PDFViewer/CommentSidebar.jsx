import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { format } from "date-fns";

const CommentSidebar = ({ comments, pageNumber, onDelete, onMarkSeen }) => {
  const filteredComments = comments.filter(
    (comment) => comment.page_number === pageNumber
  );

  return (
    <Paper elevation={3} sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Comments (Page {pageNumber})
      </Typography>
      <Divider sx={{ my: 2 }} />
      {filteredComments.length === 0 ? (
        <Typography>No comments yet</Typography>
      ) : (
        <List>
          {filteredComments.map((comment) => {
            console.log(comment);
            return (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        {comment.guest_name && (
                          <Typography component="div" fontWeight="bold">
                            Guest Name = {comment.guest_name}
                          </Typography>
                        )}
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {format(
                            new Date(comment.created_at),
                            "MMM d, yyyy h:mm a"
                          )}
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{
                            display: "block",
                            maxWidth: "400px",
                            wordWrap: "break-word",
                          }}
                        >
                          {comment.content}
                        </Typography>
                        <div>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              mt: 1,
                              color: "white",
                              backgroundColor: comment.marked_seen
                                ? "green"
                                : "#0768cf",
                              "&:hover": { opacity: 0.8 },
                            }}
                            onClick={() =>
                              onMarkSeen(comment.id, !comment.marked_seen)
                            }
                          >
                            {comment.marked_seen
                              ? "Marked as Seen"
                              : "Mark as Seen"}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              mt: 1,
                              ml: 1,
                              color: "white",
                              backgroundColor: "crimson",
                              "&:hover": { opacity: 0.8 },
                            }}
                            onClick={() => onDelete(comment.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" sx={{ ml: 0 }} />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default CommentSidebar;
