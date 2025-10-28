"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: "solid" | "dashed";
}

function Separator({
  className,
  orientation = "horizontal",
  variant = "solid",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        // Base styles
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        // Dashed variant
        // 0.5px dash, 0px gap
        "border-t border-dashed border-neutral-40 bg-transparent [border-image:repeating-linear-gradient(to_right,#C4C4C4_0,#C4C4C4_0.5px,transparent_0.5px,transparent_2.5px)_1]",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
