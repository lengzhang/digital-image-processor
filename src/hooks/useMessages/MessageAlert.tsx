import React, { useEffect } from "react";

import Alert, { AlertProps } from "@material-ui/lab/Alert";

interface MessageAlertProps {
  duration: number;
  message: string;
  severity: Required<AlertProps["severity"]>;
  onClose: () => void;
}

const MessageAlert: React.FC<MessageAlertProps> = ({
  duration,
  message,
  onClose,
  severity,
}) => {
  useEffect(
    () => {
      if (duration > 0 && !!onClose) {
        setTimeout(() => {
          onClose();
        }, duration);
      }
    },
    // eslint-disable-next-line
    []
  );
  return (
    <Alert severity={severity} onClose={onClose}>
      {message}
    </Alert>
  );
};

export default MessageAlert;
