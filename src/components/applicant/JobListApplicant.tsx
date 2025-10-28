import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useJobStore } from "@/store/jobStore";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BanknotesIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useJobApplicationStore } from "@/store/jobApplicationStore";
import EmptyState from "../EmptyState";
import { APPLICANT_USER } from "@/constants/mockUsers";
import { Job } from "@/types/job";
import { useRouter } from "next/navigation";

const jobResponsibilities = [
  "Develop, test, and maintain responsive, high-performance web applications using modern front-end technologies.",
  "Collaborate with UI/UX designers to translate wireframes and prototypes into functional code.",
  "Integrate front-end components with APIs and backend services.",
  "Ensure cross-browser compatibility and optimize applications for maximum speed and scalability.",
  "Write clean, reusable, and maintainable code following best practices and coding standards.",
  "Participate in code reviews, contributing to continuous improvement and knowledge sharing.",
  "Troubleshoot and debug issues to improve usability and overall application quality.",
  "Stay updated with emerging front-end technologies and propose innovative solutions.",
  "Collaborate in Agile/Scrum ceremonies, contributing to sprint planning, estimation, and retrospectives.",
];

const JobListApplicant = () => {
  const { jobs, setJobs } = useJobStore();
  const { jobApplications, setJobApplications } = useJobApplicationStore();
  const router = useRouter();

  const [activeJob, setActiveJob] = useState<Job | null>(null);

  useEffect(() => {
    if (jobs.length > 0 && !activeJob) {
      setActiveJob(jobs[0]);
    }
  }, [jobs, activeJob]);

  console.log("activeJob", activeJob);

  const isApplied = jobApplications.some(
    (ja) => ja.applicantId === APPLICANT_USER.id && ja.jobId === activeJob?.id
  );

  // console.log("APPLICANT_USER.id", APPLICANT_USER.id);
  // console.log("ja.jobId", jobApplications[0].id);

  // console.log("jobApplications", jobApplications);

  if (jobs.length === 0)
    return (
      <EmptyState
        title="No job openings available"
        description="Please wait for the next batch of openings."
      />
    );
  return (
    <div className="grid grid-cols-9 px-24 py-10 gap-6">
      <div className="flex flex-col gap-4 col-span-3 overflow-y-scroll max-h-[80vh]">
        {jobs.map((job) => {
          return (
            <div
              key={job.id}
              onClick={() => setActiveJob(job)}
              className={`flex flex-col gap-2 rounded-lg px-4 py-3 cursor-pointer transition-all border-2 border-transparent hover:bg-primary-surface
            ${
              activeJob?.id === job.id
                ? "bg-primary-surface border-primary-pressed!"
                : ""
            }`}
            >
              <div className="flex gap-4">
                <Image
                  width={48}
                  height={48}
                  src={"/Logogram.png"}
                  alt="Logogram"
                  className="rounded-sm border border-neutral-40 h-12 w-12"
                />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-md text-neutral-90">
                    {job.title ?? "UX Designer"}
                  </h3>
                  <p className="text-sm text-neutral-90">
                    {job.company?.name ?? "HiringPlatform"}
                  </p>
                </div>
              </div>
              <Separator
                variant="dashed"
                className="border border-dashed border-neutral-40"
              />
              <div className="flex flex-col gap-2">
                <div className="flex gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  <p className="text-neutral-80 text-xs">
                    {job.location ?? "Jakarta Selatan"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <BanknotesIcon className="h-4 w-4" />
                  <p className="text-neutral-80 text-xs">
                    {job.salary_range?.display_text ?? "Jakarta Selatan"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-neutral-40 h-full max-h-[80vh] p-6 col-span-6 flex flex-col gap-6">
        <div className="flex items-start justify-between border-b border-neutral-40 pb-6">
          <div className="flex gap-6">
            <Image
              width={48}
              height={48}
              src={"/Logogram.png"}
              alt="Logogram"
              className="rounded-sm border border-neutral-40 h-12 w-12"
            />
            <div className="flex flex-col gap-1">
              <Badge>{activeJob?.jobType ?? "Full-Time"}</Badge>
              <h3 className="font-bold text-md text-neutral-90">
                {activeJob?.title ?? "UX Designer"}
              </h3>
              <p className="text-sm text-neutral-90">
                {activeJob?.company?.name ?? "HiringPlatform"}
              </p>
            </div>
          </div>
          <Button
            disabled={isApplied}
            variant="secondary"
            onClick={() => {
              if (!isApplied) router.push(`/applicant/job/${activeJob?.id}`);
            }}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button>
        </div>
        <div>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-80">
            {jobResponsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobListApplicant;
