import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button}
from "@mui/material";
import "./Common.css";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  confirmColor = "primary",
  confirmVariant = "contained",
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions className="confirmation-dialog-actions">
        <Button
          onClick={onClose}
          color="primary"
          className="confirmation-dialog-cancel-button"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant={confirmVariant}
          className={`confirmation-dialog-confirm-button ${
            confirmColor === "error" ? "error" : ""
          }`}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
