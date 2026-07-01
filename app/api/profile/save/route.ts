import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import postgres from "postgres";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { assertSameOrigin, getClientIp, isUuid, rateLimit } from "@/lib/security";

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const sql = databaseUrl
  ? postgres(databaseUrl, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 15,
    })
  : null;

let profileColumnCache: Set<string> | null = null;
let portfolioColumnCache: Set<string> | null = null;
const responseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: responseHeaders });
}

async function getTableColumns(tableName: "profiles" | "portfolios") {
  if (!sql) return new Set<string>();
  if (tableName === "profiles" && profileColumnCache) return profileColumnCache;
  if (tableName === "portfolios" && portfolioColumnCache) return portfolioColumnCache;

  const rows = await sql<{ column_name: string }[]>`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${tableName}
  `;
  const columns = new Set(rows.map((row) => row.column_name));

  if (tableName === "profiles") profileColumnCache = columns;
  if (tableName === "portfolios") portfolioColumnCache = columns;

  return columns;
}

function pickExistingColumns(row: Record<string, unknown>, existingColumns: Set<string>) {
  return Object.fromEntries(
    Object.entries(row).filter(([column, value]) => existingColumns.has(column) && value !== undefined),
  );
}

export async function POST(request: NextRequest) {
  if (!sql) {
    return NextResponse.json(
      { error: "Database connection is not configured." },
      { status: 500, headers: responseHeaders },
    );
  }

  try {
    const originError = assertSameOrigin(request);
    if (originError) return originError;

    const authUser = await getAuthenticatedUser();
    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401, headers: responseHeaders },
      );
    }
    const limited = rateLimit({
      key: `profile:save:${authUser.id || getClientIp(request)}`,
      limit: 30,
      windowMs: 60_000,
    });
    if (limited) return limited;

    const body = await request.json();
    const profile = body.profile || {};
    const userId = String(body.userId || profile.id || "").trim();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing profile user id." },
        { status: 400, headers: responseHeaders },
      );
    }
    if (!isUuid(userId)) {
      return NextResponse.json(
        { error: "Invalid profile user id." },
        { status: 400, headers: responseHeaders },
      );
    }
    if (userId !== authUser.id) {
      return NextResponse.json(
        { error: "Forbidden: you can only save your own profile." },
        { status: 403, headers: responseHeaders },
      );
    }

    const aiInsights = profile.aiInsights || {};
    const aboutSections = aiInsights.aboutSections || {};
    const bio = aboutSections.whatISpecializeIn || profile.bio || "";
    const updatedAt = profile.updated_at || new Date().toISOString();
    const existingProfileColumns = await getTableColumns("profiles");
    const [existingProfile] = await sql<{ role: string | null }[]>`
      select role
      from public.profiles
      where id = ${userId}::uuid
      limit 1
    `;
    const requestedRole = typeof profile.role === "string" ? profile.role.trim().toLowerCase() : "";
    const safeSignupRole = requestedRole === "employer" || requestedRole === "client" ? "employer" : "freelancer";
    const preservedRole = existingProfile?.role || safeSignupRole;
    const profileRow = pickExistingColumns(
      {
        id: userId,
        name: profile.name || null,
        role: preservedRole,
        category: profile.category || "General",
        skills: Array.isArray(profile.skills) ? profile.skills : [],
        hourlyRate: profile.hourlyRate || "$0",
        bio,
        avatar_url: profile.avatar_url || null,
        companyName: profile.companyName || null,
        verifiedSkills: sql.json(profile.verifiedSkills || []),
        softSkills: sql.json(profile.softSkills || []),
        activeProjects: sql.json(profile.activeProjects || []),
        squad: profile.squad === undefined ? null : sql.json(profile.squad),
        aiInsights: sql.json(aiInsights),
        ranking: Number.isFinite(Number(profile.ranking)) ? Number(profile.ranking) : null,
        status: profile.status || "pending",
        verification_documents: sql.json(profile.verification_documents || []),
        wellness: sql.json(profile.wellness || {}),
        username: profile.username || null,
        referring_freelancer_id: profile.referring_freelancer_id || null,
        workflows: sql.json(profile.workflows || []),
        updated_at: updatedAt,
      },
      existingProfileColumns,
    );
    const profileColumns = Object.keys(profileRow);
    const profileUpdateColumns = profileColumns.filter((column) => column !== "id");
    const profileUpdateRow = Object.fromEntries(
      profileUpdateColumns.map((column) => [column, profileRow[column]]),
    );

    await sql`
      insert into public.profiles ${sql(profileRow, ...profileColumns)}
      on conflict (id) do update set ${sql(profileUpdateRow, ...profileUpdateColumns)}
    `;

    if (preservedRole === "freelancer") {
      const portfolio = body.portfolio || {};
      const existingPortfolioColumns = await getTableColumns("portfolios");
      const portfolioRow = pickExistingColumns(
        {
          profile_id: userId,
          about_me: bio,
          tagline: bio || null,
          custom_domain: portfolio.customDomain || null,
          theme_settings: sql.json(
            portfolio.themeSettings || {
              aesthetic: "professional",
              primaryColor: "#4f46e5",
              aboutSections: aiInsights.aboutSections || {},
              servicesOffered: aiInsights.servicesOffered || [],
            },
          ),
          updated_at: updatedAt,
        },
        existingPortfolioColumns,
      );
      const portfolioColumns = Object.keys(portfolioRow);
      const portfolioUpdateColumns = portfolioColumns.filter((column) => column !== "profile_id");
      const portfolioUpdateRow = Object.fromEntries(
        portfolioUpdateColumns.map((column) => [column, portfolioRow[column]]),
      );

      await sql`
        insert into public.portfolios ${sql(portfolioRow, ...portfolioColumns)}
        on conflict (profile_id) do update set ${sql(portfolioUpdateRow, ...portfolioUpdateColumns)}
      `;
    }

    return NextResponse.json({ ok: true }, { headers: responseHeaders });
  } catch (error: any) {
    console.error("Profile API save error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save profile." },
      { status: 500, headers: responseHeaders },
    );
  }
}
