import React from "react";
import { Snackbar, Alert } from "@mui/material";
import "./Common.css";

const AlertSnackbar = ({
open,
onClose,
message,
severity = "info",
autoHideDuration = 4000,
anchorOrigin = { vertical: "top", horizontal: "center" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={severity} className="alert-snackbar">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertSnackbar;