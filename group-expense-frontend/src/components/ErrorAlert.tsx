import React from "react";
import { Alert, Button } from "@mantine/core";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className="mb-6">
      <Alert color="red" title="Error">
        {message}
        {onRetry && (
          <Button
            variant="light"
            color="red"
            size="xs"
            className="mt-2"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </Alert>
    </div>
  );
};
