-- TaraWork admin-managed blog posts
-- Run this in Supabase SQL Editor so admins can create posts from the app.

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '/landing/filipino-hero.png',
  image_alt TEXT,
  keyword TEXT,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published blog posts are public." ON public.blog_posts;
CREATE POLICY "Published blog posts are public." ON public.blog_posts
  FOR SELECT USING (
    status = 'published'
    AND published_at <= timezone('utc'::text, now())
  );

DROP POLICY IF EXISTS "Admins can manage blog posts." ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts." ON public.blog_posts
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS blog_posts_status_published_at_idx
  ON public.blog_posts (status, published_at DESC);

CREATE INDEX IF NOT EXISTS blog_posts_category_published_at_idx
  ON public.blog_posts (category, published_at DESC);
