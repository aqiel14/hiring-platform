import { cn } from "@/lib/utils";
import { CircleSmall } from "lucide-react";

interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
  helperText?: string;
  maxLength?: number;
  errorMessage?: string;
  disabled?: boolean;
}

function Input({
  className,
  type,
  error,
  maxLength,
  helperText,
  errorMessage,
  disabled = false,
  ...props
}: InputProps) {
  const valueLength = (props.value as string | undefined)?.length || 0;

  return (
    <div className="flex flex-col  w-full">
      {/* Input field */}
      <input
        type={type}
        data-slot="input"
        aria-invalid={error ? "true" : undefined}
        maxLength={maxLength}
        disabled={disabled}
        className={cn(
          "file:text-foreground placeholder:text-neutral-60 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-neutral-40 h-9 w-full min-w-0 rounded-md border-2 bg-transparent px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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

export { Input };
