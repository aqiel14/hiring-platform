export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  display_text: string;
}

export interface ListCard {
  badge: string;
  started_on_text: string;
  cta: string;
}

export interface Job {
  id?: string;
  slug?: string;
  company?: {
    id: number;
    name: string;
  };
  location?: string;
  type?: string;
  title?: string;
  status?: "active" | "inactive" | string;
  salary_range?: {
    min?: number;
    max?: number;
    currency?: string;
    display_text?: string;
  };
  list_card?: {
    badge?: string;
    started_on_text?: string;
    cta?: string;
  };
  profileReqs?: Record<string, string>;
  maxApplicants?: number;
  jobType?: string;
  jobDescription?: string;
  createdAt: string;
  [key: string]: any;
}

export interface JobResponse {
  data: Job[];
}
