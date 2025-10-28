// src/components/ui/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  size?: number; // width & height in px
  color?: string; // Tailwind color class
}

const LoadingSpinner = ({
  size = 24,
  color = "text-primary",
}: LoadingSpinnerProps) => {
  return (
    <div
      className={`border-4 border-t-transparent border-solid rounded-full animate-spin ${color}`}
      style={{ width: size, height: size }}
    />
  );
};

export default LoadingSpinner;
