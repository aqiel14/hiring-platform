"use client";

import { useState, useMemo } from "react";
import { Job } from "@/types/job";
import JobCard from "./JobCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CircleCheckIcon, SearchIcon } from "lucide-react";
import EmptyState from "../EmptyState";
import { JobModal } from "./JobModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface JobListProps {
  jobs: Job[];
}

export default function JobList({ jobs }: JobListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sortBy, setSortBy] = useState("recent");
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (statusFilter !== "all")
      result = result.filter((job) => job.status === statusFilter);
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (job) =>
          job.title?.toLowerCase().includes(term) ||
          job.description?.toLowerCase().includes(term)
      );
    }
    if (sortBy === "recent")
      result.sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime()
      );
    else if (sortBy === "oldest")
      result.sort(
        (a, b) =>
          new Date(a.createdAt || "").getTime() -
          new Date(b.createdAt || "").getTime()
      );
    else if (sortBy === "title")
      result.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    return result;
  }, [jobs, searchTerm, statusFilter, sortBy]);

  return (
    <div className="p-6 space-y-4 grid grid-cols-10 gap-6">
      <div className="col-span-7">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search by job details"
              className="w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute top-2 right-0 flex items-center pr-3">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
            </span>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredJobs.length === 0 ? (
          <EmptyState
            title="No jobs found"
            description="Try changing filters or add a new job."
            cta={
              <Button onClick={() => setIsJobModalOpen(true)}>Add a job</Button>
            }
          />
        ) : (
          <div className="mt-4">
            {filteredJobs.map((job, i) => (
              <JobCard job={job} key={i} />
            ))}
          </div>
        )}
      </div>

      <div className="col-span-3">
        <div className="p-6 bg-black rounded-2xl text-white flex flex-col gap-6">
          <div className="font-bold flex flex-col gap-1">
            <p className="text-lg">Recruit the best candidates</p>
            <p className="text-sm">Create jobs, invite and hire with ease</p>
          </div>
          <Button onClick={() => setIsJobModalOpen(true)}>
            Create a new job
          </Button>
        </div>
      </div>

      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSuccess={() => {
          setIsJobModalOpen(false);
          toast("Job vacancy successfully created", {
            position: "bottom-left",
            icon: <CircleCheckIcon className="size-4 text-success" />,
            action: {
              label: "X",
              onClick: () => toast.dismiss(),
            },
          });
        }}
      />
    </div>
  );
}
