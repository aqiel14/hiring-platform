import * as React from "react";

import { cn } from "@/lib/utils";
import { CircleSmall } from "lucide-react";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  errorMessage?: string;
  disabled?: boolean;
}

function Textarea({
  className,

  error,
  maxLength,
  helperText,
  errorMessage,
  disabled = false,
  ...props
}: TextareaProps) {
  const valueLength = (props.value as string | undefined)?.length || 0;
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-neutral-60 flex field-sizing-content min-h-16 border-neutral-40 w-full rounded-md border-2 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-transparent focus-visible:ring-primary focus-visible:ring-2",
          "active-visible:border-[#01959F] active-visible:ring-[#01959F] active-visible:ring-2",
          "aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger",
          error && "border-2 border-danger focus-visible:ring-danger/30",
          disabled &&
            "bg-neutral-30 border-neutral-40 border-2 text-neutral-60",
          className
        )}
        {...props}
      />

      {/* Helper text + character counter */}
      <div className="flex items-center justify-between text-sm mt-1">
        {/* Left side */}
        <div className="flex items-center gap-1 text-neutral-70">
          {(error || helperText) && !disabled && (
            <CircleSmall className="w-3 h-3" />
          )}
          <span className="text-danger text-xs">
            {error ? errorMessage : helperText}
          </span>
        </div>

        {/* Right side: character counter */}
        {maxLength && (
          <span className="text-neutral-70">
            {valueLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
}

export { Textarea };
