"use client";

import GestureWebcamModal from "@/components/GestureWebcamModal";
import ProtectedRoute from "@/components/ProtectedRoute";
import JobApplicationForm from "@/components/applicant/JobApplicationForm";
import { useParams } from "next/navigation";

export default function ApplicantPage() {
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  if (!jobId) return <div>Job not found</div>;

  return (
    <ProtectedRoute>
      <div className="h-screen w-full bg-neutral-20 flex items-start justify-center">
        <JobApplicationForm jobId={jobId} />
      </div>
    </ProtectedRoute>
  );
}
