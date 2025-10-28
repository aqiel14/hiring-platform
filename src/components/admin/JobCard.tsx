import { Job } from "@/types/job";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const formatted = new Date(job.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="rounded-2xl p-6 flex flex-col shadow-lg gap-3">
      <div className="flex gap-4">
        <Badge variant="active" className="border-[#B8DBCA] bg-[#43936C33]">
          Active
        </Badge>
        <Badge variant="normal">Started on {formatted}</Badge>
      </div>
      <div className="flex flex-col gap-2">
        <p>{job.title}</p>
        <div className="flex justify-between">
          <p>{job.salary_range?.display_text ?? "<Salary Undisclosed>"}</p>

          <Link href={`/admin/job/${job.id}`}>
            <Button>Manage Job</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
