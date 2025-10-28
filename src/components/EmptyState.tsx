import Image from "next/image";
import React, { ReactNode } from "react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  cta?: ReactNode;
}

const EmptyState = ({ title, description, cta }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Image src="/empty-icon.svg" alt="Search" width={300} height={300} />
      <div className="text-center">
        <p className="font-bold text-xl">{title}</p>
        <p className="font-normal text-md">{description}</p>
      </div>
      {cta && <div>{cta}</div>}
    </div>
  );
};

export default EmptyState;
