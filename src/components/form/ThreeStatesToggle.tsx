"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ThreeStateToggleProps {
  value: "mandatory" | "optional" | "off";
  onChange: (value: "mandatory" | "optional" | "off") => void;
  mandatories?: string[];
  fieldKey?: string;
}

export function ThreeStateToggle({
  value,
  onChange,
  mandatories = [],
  fieldKey,
}: ThreeStateToggleProps) {
  const states = [
    { key: "mandatory", label: "Mandatory" },
    { key: "optional", label: "Optional" },
    { key: "off", label: "Off" },
  ] as const;

  const isLockedMandatory = fieldKey && mandatories.includes(fieldKey);

  return (
    <div className="flex gap-2">
      {states.map((s) => {
        const disabled = isLockedMandatory && s.key !== "mandatory";
        return (
          <Button
            key={s.key}
            type="button"
            variant={"outline"}
            onClick={() => onChange(s.key)}
            disabled={disabled || false}
            className={cn(
              "flex-1 rounded-2xl font-normal",
              value === s.key && s.key === "mandatory" && " text-primary",
              value === s.key && s.key === "optional" && " text-primary",
              value === s.key && s.key === "off" && " text-primary",
              value !== s.key &&
                s.key === "mandatory" &&
                "hover:text-primary hover:bg-primary/10",
              value !== s.key &&
                s.key === "optional" &&
                "hover:text-primary hover:bg-primary/10",
              value !== s.key &&
                s.key === "off" &&
                "hover:text-primary hover:bg-gray-100"
            )}
          >
            {s.label}
          </Button>
        );
      })}
    </div>
  );
}
