import { useJobApplicationStore } from "@/store/jobApplicationStore";
import { useJobStore } from "@/store/jobStore";
import { Job } from "@/types/job";
import React, { useMemo } from "react";
import EmptyState from "../EmptyState";
import DataTable from "../data-table/DataTable";
import { Column } from "../data-table/types";

interface ManageJobListProps {
  jobId: string;
}

const ManageJobList = ({ jobId }: ManageJobListProps) => {
  const { jobs } = useJobStore();
  const { jobApplications } = useJobApplicationStore();

  const job = jobs.find((j) => j.id === jobId) as Job;

  const applicationsForJob = useMemo(() => {
    return jobApplications.filter((app) => app.jobId === jobId);
  }, [jobApplications, jobId]);

  const columns: Column[] = useMemo(
    () => [
      {
        id: "name",
        label: "Name",
        width: 180,
        accessor: (app) => app.fullName || "-",
      },
      {
        id: "email",
        label: "Email",
        width: 220,
        accessor: (app) => app.email || "-",
      },
      {
        id: "phone",
        label: "Phone",
        width: 150,
        accessor: (app) => app.phoneNumber || "-",
      },
      {
        id: "gender",
        label: "Gender",
        width: 120,
        accessor: (app) => app.gender || "-",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        width: 200,
        accessor: (app) => app.linkedinLink || "-",
        render: (app) =>
          app.linkedinLink ? (
            <a
              href={app.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {app.linkedinLink}
            </a>
          ) : (
            "-"
          ),
      },
      {
        id: "domicile",
        label: "Domicile",
        width: 150,
        accessor: (app) => app.domicile || "-",
      },
      {
        id: "appliedDate",
        label: "Applied Date",
        width: 150,
        accessor: (app) =>
          app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "-",
      },
    ],
    []
  );

  if (!job) {
    return <EmptyState title="No job found" description="" />;
  }

  if (applicationsForJob.length === 0) {
    return (
      <div className="p-6 flex flex-col gap-6">
        <div className="w-full">
          <h2 className="text-2xl font-semibold">
            {job.title ?? "Front End Developer"}
          </h2>
        </div>
        <EmptyState
          title="No applications yet"
          description="No candidates have applied for this position yet."
        />
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="w-full">
        <h2 className="text-2xl font-semibold">
          {job.title ?? "Front End Developer"}
        </h2>
      </div>

      <DataTable
        data={applicationsForJob}
        columns={columns}
        defaultPageSize={10}
        showFilters={true}
        filterableColumns={["name", "email", "phone", "gender"]}
        isResizable={true}
        isDraggable={true}
      />
    </div>
  );
};

export default ManageJobList;
