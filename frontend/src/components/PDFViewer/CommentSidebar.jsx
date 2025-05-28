import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper, Divider } from '@mui/material';
import { format } from 'date-fns';

const CommentSidebar = ({ comments, pageNumber, onReply }) => {
  const filteredComments = comments.filter(
    (comment) => comment.page_number === pageNumber
  );

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Comments (Page {pageNumber})
      </Typography>
      <Divider sx={{ my: 2 }} />
      {filteredComments.length === 0 ? (
        <Typography>No comments yet</Typography>
      ) : (
        <List>
          {filteredComments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <>
                      <Typography fontWeight="bold">
                        {comment.author?.username || comment.guest_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(comment.created_at), 'MMM d, yyyy h:mm a')}
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      <Typography>{comment.content}</Typography>
                      <button onClick={() => onReply(comment)}>Reply</button>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CommentSidebar;