import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    redirect("/auth");
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set(name, "", options);
      },
    },
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  redirect("/");
}
