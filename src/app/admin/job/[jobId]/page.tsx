"use client";

import ManageJobList from "@/components/admin/ManageJobList";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ManageJobPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  if (!jobId) return <div>Job not found</div>;

  return (
    <ProtectedRoute role="admin">
      <div className="h-screen w-full bg-neutral-20 flex items-start justify-center">
        <ManageJobList jobId={jobId} />
      </div>
    </ProtectedRoute>
  );
}
