"use client";

import JobListApplicant from "@/components/applicant/JobListApplicant";
import ProtectedRoute from "@/components/ProtectedRoute";

const ApplicantJobListPage = () => {
  return (
    <ProtectedRoute>
      <JobListApplicant />
    </ProtectedRoute>
  );
};

export default ApplicantJobListPage;
