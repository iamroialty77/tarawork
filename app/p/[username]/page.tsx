import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfileAliasPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const resolved = await params;
  redirect(`/${resolved.username}`);
}
