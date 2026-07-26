import { redirect } from "next/navigation";
import LandingPage from "@/components/LandingPage";
import { requireAdminUser } from "@/lib/authz";

export default async function SitePreviewPage() {
  const admin = await requireAdminUser();
  if (admin.error) redirect("/auth");
  return <LandingPage />;
}
