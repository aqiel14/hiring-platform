import { JobApplication } from "@/types/jobApplication";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface JobApplicationState {
  jobApplications: JobApplication[];
  setJobApplications: (jobApplications: JobApplication[]) => void;
  addJobApplication: (jobApplication: JobApplication) => void;
  removeJobApplication: (id: string) => void;
  clearJobApplications: () => void;
}

export const useJobApplicationStore = create<JobApplicationState>()(
  persist(
    (set) => ({
      jobApplications: [],
      setJobApplications: (jobApplications) => set({ jobApplications }),
      addJobApplication: (jobApplication) =>
        set((state) => ({
          jobApplications: [...state.jobApplications, jobApplication],
        })),
      removeJobApplication: (id) =>
        set((state) => ({
          jobApplications: state.jobApplications.filter((app) => app.id !== id),
        })),
      clearJobApplications: () => set({ jobApplications: [] }),
    }),
    {
      name: "job-application-storage", // 🔹 key in localStorage
    }
  )
);
