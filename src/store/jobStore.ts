import { Job } from "@/types/job";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface JobState {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
}

export const useJobStore = create<JobState>()(
  persist(
    (set) => ({
      jobs: [],
      setJobs: (jobs) => set({ jobs }),
      addJob: (job) =>
        set((state) => ({
          jobs: [...state.jobs, job],
        })),
    }),
    {
      name: "job-storage",
    }
  )
);
