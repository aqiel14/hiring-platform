"use client";

import JobList from "@/components/admin/JobList";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useJobStore } from "@/store/jobStore";

export default function AdminJobListPage() {
  const { jobs, setJobs } = useJobStore();

  return (
    <>
      <ProtectedRoute role={"admin"}>
        <JobList jobs={jobs} />
      </ProtectedRoute>
    </>
  );
}
