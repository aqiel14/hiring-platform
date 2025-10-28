import { CircleSmall } from "lucide-react";
import React from "react";

interface ErrorMessageFormProps {
  error?: boolean;
  errorMessage?: string;
}

const ErrorMessageForm = ({ error, errorMessage }: ErrorMessageFormProps) => {
  if (!error || !errorMessage) return null;
  return (
    <div className="flex items-center justify-between text-sm mt-1">
      {/* Left side */}
      <div className="flex gap-1 text-neutral-70">
        {error && <CircleSmall className="w-3 h-3" />}
        <span className="text-danger text-xs">{error ? errorMessage : ""}</span>
      </div>
    </div>
  );
};

export default ErrorMessageForm;
