import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect automatically to job list
  redirect("/applicant/job");
}
