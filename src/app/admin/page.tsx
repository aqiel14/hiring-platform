// app/admin/page.tsx
import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect automatically to job list
  redirect("/admin/job");
}
