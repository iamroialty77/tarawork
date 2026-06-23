import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase_server";
import { supabaseAdmin } from "@/lib/supabase_admin";

type PortfolioItemPayload = {
  id?: string;
  title?: string;
  description?: string;
  image_url?: string;
  project_url?: string;
  technologies?: unknown;
};

const normalizeTechnologies = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, 20);
};

const isSchemaFallbackError = (error: { code?: string; message?: string } | null | undefined) => {
  const message = error?.message || "";
  return (
    error?.code === "PGRST205" ||
    error?.code === "42P01" ||
    message.includes("Could not find the table") ||
    message.includes("relation") ||
    message.includes("portfolio_id")
  );
};

const mapLegacyItem = (item: Record<string, unknown>, userId: string) => ({
  ...item,
  profile_id: (item.profile_id as string | undefined) || userId,
});

const getOrCreatePortfolioId = async (userId: string) => {
  const existing = await supabaseAdmin
    .from("portfolios")
    .select("id")
    .eq("profile_id", userId)
    .maybeSingle();

  if (existing.error && existing.error.code !== "PGRST116") {
    throw existing.error;
  }

  if (existing.data?.id) {
    return existing.data.id as string;
  }

  const created = await supabaseAdmin
    .from("portfolios")
    .insert([
      {
        profile_id: userId,
        theme_settings: { aesthetic: "professional", primaryColor: "#4f46e5" },
      },
    ])
    .select("id")
    .single();

  if (created.error) {
    throw created.error;
  }

  return created.data.id as string;
};

const assertProjectOwner = async (projectId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("portfolio_projects")
    .select("id, portfolios!inner(profile_id)")
    .eq("id", projectId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  const profileId = (data?.portfolios as { profile_id?: string } | null)?.profile_id;
  return profileId === userId;
};

const assertLegacyProjectOwner = async (projectId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .select("id, profile_id")
    .eq("id", projectId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data?.profile_id === userId;
};

const getPortfolioItemStorage = async (projectId: string, userId: string) => {
  try {
    if (await assertProjectOwner(projectId, userId)) return "portfolio_projects";
  } catch (error) {
    if (!isSchemaFallbackError(error as { code?: string; message?: string })) throw error;
  }

  if (await assertLegacyProjectOwner(projectId, userId)) return "portfolio_items";
  return null;
};

const createLegacyPortfolioItem = async (body: PortfolioItemPayload, userId: string, title: string) => {
  const { data, error } = await supabaseAdmin
    .from("portfolio_items")
    .insert([
      {
        profile_id: userId,
        title,
        description: (body.description || "").trim(),
        image_url: (body.image_url || "").trim() || null,
        project_url: (body.project_url || "").trim() || null,
        technologies: normalizeTechnologies(body.technologies),
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  return mapLegacyItem(data as Record<string, unknown>, userId);
};

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as PortfolioItemPayload;
    const title = (body.title || "").trim();

    if (!title) {
      return NextResponse.json({ error: "Project title is required." }, { status: 400 });
    }

    try {
      const portfolioId = await getOrCreatePortfolioId(user.id);
      const { data, error } = await supabaseAdmin
        .from("portfolio_projects")
        .insert([
          {
            portfolio_id: portfolioId,
            title,
            description: (body.description || "").trim(),
            image_url: (body.image_url || "").trim() || null,
            project_url: (body.project_url || "").trim() || null,
            technologies: normalizeTechnologies(body.technologies),
          },
        ])
        .select("*")
        .single();

      if (error) {
        if (isSchemaFallbackError(error)) {
          const legacyItem = await createLegacyPortfolioItem(body, user.id, title);
          return NextResponse.json({ item: legacyItem });
        }
        throw error;
      }

      return NextResponse.json({ item: { ...data, profile_id: user.id } });
    } catch (error) {
      if (isSchemaFallbackError(error as { code?: string; message?: string })) {
        const legacyItem = await createLegacyPortfolioItem(body, user.id, title);
        return NextResponse.json({ item: legacyItem });
      }
      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save portfolio item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as PortfolioItemPayload;
    const id = (body.id || "").trim();
    const title = (body.title || "").trim();

    if (!id || !title) {
      return NextResponse.json({ error: "Project id and title are required." }, { status: 400 });
    }

    const storageTable = await getPortfolioItemStorage(id, user.id);
    if (!storageTable) {
      return NextResponse.json({ error: "Portfolio item was not found." }, { status: 404 });
    }

    const { data, error } = await supabaseAdmin
      .from(storageTable)
      .update({
        title,
        description: (body.description || "").trim(),
        image_url: (body.image_url || "").trim() || null,
        project_url: (body.project_url || "").trim() || null,
        technologies: normalizeTechnologies(body.technologies),
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ item: mapLegacyItem(data as Record<string, unknown>, user.id) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update portfolio item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id")?.trim() || "";
    if (!id) {
      return NextResponse.json({ error: "Project id is required." }, { status: 400 });
    }

    const storageTable = await getPortfolioItemStorage(id, user.id);
    if (!storageTable) {
      return NextResponse.json({ error: "Portfolio item was not found." }, { status: 404 });
    }

    const { error } = await supabaseAdmin.from(storageTable).delete().eq("id", id);
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete portfolio item.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
