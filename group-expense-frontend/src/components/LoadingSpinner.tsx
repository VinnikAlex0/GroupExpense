import React from "react";
import { Loader } from "@mantine/core";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "lg",
}) => {
  return (
    <div className="flex justify-center py-8">
      <Loader size={size} />
    </div>
  );
};
