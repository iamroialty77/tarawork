import type { Metadata } from 'next';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import { supabaseAdmin } from '@/lib/supabase_admin';
import { absoluteUrl, siteName, truncateSeoText } from '@/lib/seo';
import { ClientReview, FreelancerProfile, ServiceOffering } from '@/types/portfolio';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const normalizeAboutSections = (sections: unknown, fallbackBio = '') => {
  const source = sections && typeof sections === 'object' ? (sections as Record<string, unknown>) : {};
  return {
    whoIHelp: typeof source.whoIHelp === 'string' ? source.whoIHelp : '',
    whatISpecializeIn: typeof source.whatISpecializeIn === 'string' ? source.whatISpecializeIn : fallbackBio,
    resultsIHaveDelivered: typeof source.resultsIHaveDelivered === 'string' ? source.resultsIHaveDelivered : '',
    howIWork: typeof source.howIWork === 'string' ? source.howIWork : '',
  };
};

const normalizeServicesOffered = (services: unknown): ServiceOffering[] => {
  if (!Array.isArray(services)) return [];
  return services
    .map((service) => {
      if (!service || typeof service !== 'object') return null;
      const source = service as Record<string, unknown>;
      const serviceName = typeof source.serviceName === 'string' ? source.serviceName.trim() : '';
      if (!serviceName) return null;
      const startingPriceRaw =
        typeof source.startingPrice === 'number'
          ? source.startingPrice
          : typeof source.startingPrice === 'string'
            ? Number(source.startingPrice)
            : 0;
      return {
        serviceName,
        startingPrice: Number.isFinite(startingPriceRaw) ? Math.max(0, startingPriceRaw) : 0,
        currency: typeof source.currency === 'string' && source.currency.trim() ? source.currency.trim() : 'PHP',
        typicalTurnaround: typeof source.typicalTurnaround === 'string' ? source.typicalTurnaround.trim() : '',
      };
    })
    .filter((service): service is ServiceOffering => !!service)
    .slice(0, 6);
};

const normalizeClientReviews = (reviews: unknown): ClientReview[] => {
  if (!Array.isArray(reviews)) return [];
  return reviews
    .map((review, index): ClientReview | null => {
      if (!review || typeof review !== 'object') return null;
      const source = review as Record<string, unknown>;
      const ratingRaw =
        typeof source.rating === 'number'
          ? source.rating
          : typeof source.rating === 'string'
            ? Number(source.rating)
            : 0;
      const rating = Number.isFinite(ratingRaw) ? Math.min(5, Math.max(0, ratingRaw)) : 0;
      const clientName = typeof source.clientName === 'string' ? source.clientName.trim() : '';
      const projectTitle = typeof source.projectTitle === 'string' ? source.projectTitle.trim() : '';
      const comment = typeof source.comment === 'string' ? source.comment.trim() : '';

      if (!clientName && !projectTitle && !comment && rating === 0) return null;

      return {
        id: typeof source.id === 'string' && source.id.trim() ? source.id.trim() : `review-${index}`,
        clientName: clientName || 'Client',
        projectTitle: projectTitle || 'Completed project',
        rating,
        comment: comment || 'No written comment provided.',
        date: typeof source.date === 'string' && source.date.trim() ? source.date.trim() : '',
      };
    })
    .filter((review): review is ClientReview => !!review);
};

const normalizePortfolioProject = (project: any) => ({
  ...project,
  title: project?.title || 'Untitled Project',
  description: project?.description || '',
  image_url: project?.image_url || '',
  project_url: project?.project_url || '',
  technologies: Array.isArray(project?.technologies)
    ? project.technologies
    : typeof project?.technologies === 'string'
      ? project.technologies.split(',').map((tech: string) => tech.trim()).filter(Boolean)
      : [],
});

const getPortfolioProjects = (portfolio: any) => {
  if (!portfolio || !Array.isArray(portfolio.portfolio_projects)) return [];
  return portfolio.portfolio_projects.map(normalizePortfolioProject);
};

const selectDisplayPortfolio = (portfolios: any[] | undefined) => {
  if (!Array.isArray(portfolios) || portfolios.length === 0) return undefined;
  return portfolios.find((portfolio) => getPortfolioProjects(portfolio).length > 0) || portfolios[0];
};

const mergePortfolioProjects = (portfolios: any[] | undefined) => {
  if (!Array.isArray(portfolios)) return [];

  const seen = new Set<string>();
  return portfolios.flatMap(getPortfolioProjects).filter((project: any) => {
    const key = String(project.id || `${project.title}-${project.project_url || project.description}`);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

async function fetchProfileWithFallback(query: any, identifier: string) {
  const { data, error } = await query;
  let profile = data;

  if (error) {
    console.warn(`[Portfolio] Database query error for "${identifier}":`, error.message);
    
    // Check if we can do a basic fallback for critical schema errors
    const isCritical = error.message.includes('relation') || 
                       error.message.includes('column') || 
                       error.message.includes('relationship');
    
    if (isCritical || !profile) {
      console.log(`[Portfolio] Attempting basic fallback fetch for "${identifier}"...`);
      // Basic query without complex joins
      const basicQuery = supabaseAdmin.from('profiles').select('id, name, role, avatar_url, bio, hourlyRate, username, skills, category, companyName, aiInsights');
      
      let refinedBasicQuery;
      // Try to match identifier in ID or username or name
      if (identifier.includes('-') && identifier.length > 30) {
        refinedBasicQuery = basicQuery.eq('id', identifier);
      } else {
        refinedBasicQuery = basicQuery.or(`username.ilike.%${identifier}%,name.ilike.%${identifier}%,id.ilike.%${identifier}%`).limit(1);
      }
      
      const { data: basicProfile } = await refinedBasicQuery.maybeSingle();
      if (basicProfile) {
        console.log(`[Portfolio] Found profile via basic fallback: ${basicProfile.name}`);
        profile = basicProfile;
      }
    }
  }

  // 2. Backfill featured projects from old portfolio_items when the new relation is empty.
  const existingProjects = mergePortfolioProjects(profile?.portfolios);
  if (
    profile &&
    existingProjects.length === 0
  ) {
    console.log(`[Portfolio] No featured projects found for ${profile.name} (ID: ${profile.id}), checking old portfolio_items...`);
    const { data: oldItems, error: oldError } = await supabaseAdmin
      .from('portfolio_items')
      .select('*')
      .eq('profile_id', profile.id);
    
    if (oldError) console.error(`[Portfolio] Error fetching old items:`, oldError.message);

    if (oldItems && oldItems.length > 0) {
      console.log(`[Portfolio] Found ${oldItems.length} items in old table. Mapping to new structure.`);
      const mappedOldProjects = oldItems.map(normalizePortfolioProject);

      if (profile.portfolios?.[0]) {
        profile.portfolios[0].portfolio_projects = mappedOldProjects;
      } else {
        profile.portfolios = [{
          id: 'fallback-' + (profile.id?.toString().substring(0, 8) || '0000'),
          about_me: profile.bio || '',
          tagline: 'Professional Portfolio',
          theme_settings: {
            aesthetic: 'minimalist',
            primaryColor: '#000000',
            aboutSections: normalizeAboutSections(profile.aiInsights?.aboutSections, profile.bio || ''),
            servicesOffered: normalizeServicesOffered(profile.aiInsights?.servicesOffered),
          },
          portfolio_projects: mappedOldProjects,
          portfolio_skills: [],
          portfolio_links: []
        }] as any;
      }
    }
  }

  return profile;
}

async function getPortfolio(username: string): Promise<FreelancerProfile | null> {
  const normalizedUsername = username.startsWith("@") ? username.slice(1) : username;
  if (!normalizedUsername) return null;
  console.log(`[Portfolio] Starting lookup for: "${username}" (normalized: "${normalizedUsername}")`);
  
  // Debug environment (safely)
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(`[Portfolio] Env status: URL=${hasUrl}, ServiceKey=${hasKey}`);

  // Demo data for testing and local development
  if (normalizedUsername === 'johndoe' || normalizedUsername === 'demo') {
    return {
      id: 'demo-uuid',
      name: 'John Doe',
      role: 'Senior Full-stack Developer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      bio: 'Crafting minimalist, high-performance web applications with a focus on user experience and clean code.',
      aboutSections: {
        whoIHelp: 'Early-stage SaaS founders launching MVPs.',
        whatISpecializeIn: 'High-performance React apps and scalable APIs.',
        resultsIHaveDelivered: 'Built dashboards used by 10,000+ users.',
        howIWork: 'Clear timelines. Weekly updates. Clean documentation.',
      },
      servicesOffered: [
        { serviceName: 'MVP Web App Build', startingPrice: 25000, currency: 'PHP', typicalTurnaround: '10-14 days' },
        { serviceName: 'API Integration', startingPrice: 12000, currency: 'PHP', typicalTurnaround: '3-5 days' },
      ],
      portfolio: {
        id: 'portfolio-uuid',
        profile_id: 'demo-uuid',
        about_me: 'I am a passionate developer from Seoul with 5 years of experience in Next.js and Tailwind CSS. I believe in the power of minimalism and efficiency in software design.',
        tagline: 'Minimalist Engineering for Modern Web',
        custom_domain: 'https://www.tarawork.online/@johndoe',
        projects: [
          {
            id: 'p1',
            title: 'TaraWork Marketplace',
            description: 'A professional platform for freelancers and employers with a focus on wellness and sustainability.',
            image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop',
            technologies: ['Next.js', 'TypeScript', 'Supabase'],
            project_url: 'https://tarawork.ph'
          },
          {
            id: 'p2',
            title: 'ZenTask Manager',
            description: 'A productivity tool inspired by Korean minimalist design, helping teams focus on what matters.',
            image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
            technologies: ['React', 'Framer Motion', 'PostgreSQL']
          }
        ],
        skills: [
          { id: 's1', name: 'Next.js' },
          { id: 's2', name: 'TypeScript' },
          { id: 's3', name: 'Tailwind CSS' },
          { id: 's4', name: 'UI/UX Design' }
        ],
        links: [
          { id: 'l1', label: 'GitHub', url: 'https://github.com' },
          { id: 'l2', label: 'LinkedIn', url: 'https://linkedin.com' }
        ],
        theme_settings: {
          aesthetic: 'minimalist',
          primaryColor: '#000000',
          premiumProfile: {
            tier: 'pro',
            verifiedBadge: true,
            advancedPortfolio: true,
            featuredPlacement: true,
            analyticsEnabled: true,
            customDomain: 'https://www.tarawork.online/@johndoe',
            videoIntroUrl: 'https://www.loom.com/share/portfolio-demo',
            introHeadline: 'Helping startups ship elegant, performant products.',
            analytics: {
              profileViews: 1284,
              clientClicks: 91
            }
          }
        }
      },
      premiumProfile: {
        tier: 'pro',
        verifiedBadge: true,
        advancedPortfolio: true,
        featuredPlacement: true,
        analyticsEnabled: true,
        customDomain: 'https://www.tarawork.online/@johndoe',
        videoIntroUrl: 'https://www.loom.com/share/portfolio-demo',
        introHeadline: 'Helping startups ship elegant, performant products.',
        analytics: {
          profileViews: 1284,
          clientClicks: 91
        }
      }
    };
  }

  // List of reserved routes that shouldn't be treated as usernames
  const reservedRoutes = ['auth', 'api', 'admin', 'messages', 'portfolio', 'dashboard', 'settings', 'projects', 'p'];
  if (reservedRoutes.includes(normalizedUsername)) {
    return null;
  }

  try {
    // 1. Try by username (case-insensitive)
    console.log(`[Portfolio] Step 1: Searching for username: "${normalizedUsername}"`);
    const query1 = supabaseAdmin
      .from('profiles')
      .select(`
        id, name, role, avatar_url, bio, hourlyRate, username, skills, category, companyName, aiInsights,
        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
      `)
      .filter('username', 'ilike', normalizedUsername)
      .maybeSingle();

    const profileByUsername = await fetchProfileWithFallback(query1, normalizedUsername);

    if (profileByUsername) {
      console.log(`[Portfolio] SUCCESS: Found profile by username match: ${normalizedUsername}`);
      return mapProfile(profileByUsername);
    }

    // Diagnostic: Check if any profiles exist at all
    const { count, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    console.log(`[Portfolio] Total profiles in database: ${count || 0}`);
    if (countError) console.error('[Portfolio] Count error:', countError.message);

    // 2. Try by full UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(normalizedUsername);
    if (isUUID) {
      console.log(`[Portfolio] Step 2: Attempting UUID lookup for: ${normalizedUsername}`);
      const query2 = supabaseAdmin
        .from('profiles')
        .select(`
          id, name, role, avatar_url, bio, hourlyRate, username, skills, category, companyName, aiInsights,
          portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
        `)
        .eq('id', normalizedUsername)
        .maybeSingle();
      
      const profileById = await fetchProfileWithFallback(query2, normalizedUsername);
      if (profileById) return mapProfile(profileById);
    }

    // 3. Robust Match (Fallback) - Aggressive fuzzy search
    console.log(`[Portfolio] Step 3: Aggressive fuzzy match for: "${normalizedUsername}"`);
    const alphaParts = normalizedUsername.match(/[a-z]{3,}/gi) || [];
    const searchWord = alphaParts[0] || normalizedUsername || '';
    const flexibleSearch = searchWord.length > 5 ? searchWord.substring(0, 5) : searchWord;
    
    const { data: candidates, error: candidateError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, name, role, avatar_url, bio, hourlyRate, username, skills, category, companyName, aiInsights,
        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
      `)
      .or(`name.ilike.%${flexibleSearch}%,username.ilike.%${flexibleSearch}%`)
      .limit(10);

    if (candidateError) console.error('[Portfolio] Candidate search error:', candidateError.message);

    if (candidates && candidates.length > 0) {
      console.log(`[Portfolio] Analyzing ${candidates.length} candidates for a match...`);
      for (const p of candidates) {
        const cleanName = p.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const cleanDbUsername = p.username?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const cleanRequested = normalizedUsername.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        console.log(`[Portfolio] Comparing: req="${cleanRequested}" with db_name="${cleanName}" and db_user="${cleanDbUsername}"`);

        // Check for multiple matching strategies
        const matchByName = cleanName && (cleanRequested.includes(cleanName) || cleanName.includes(cleanRequested));
        const matchByUser = cleanDbUsername && (cleanRequested.includes(cleanDbUsername) || cleanDbUsername.includes(cleanRequested));
        const matchByPrefix = (cleanName.length >= 4 && cleanRequested.startsWith(cleanName.substring(0, 4))) ||
                             (cleanDbUsername.length >= 4 && cleanRequested.startsWith(cleanDbUsername.substring(0, 4)));

        if (matchByName || matchByUser || matchByPrefix) {
          console.log(`[Portfolio] FOUND MATCH: ${p.name} (${p.id})`);
          // Ensure we have portfolio data for the candidate
          if (!p.portfolios || p.portfolios.length === 0) {
            const { data: oldItems } = await supabaseAdmin
              .from('portfolio_items')
              .select('*')
              .eq('profile_id', p.id);
            if (oldItems && oldItems.length > 0) {
              p.portfolios = [{ 
                id: 'fallback-' + (p.id?.toString().substring(0, 8) || '0000'),
                about_me: p.bio || '',
                tagline: 'Professional Portfolio',
                theme_settings: {
                  aesthetic: 'minimalist',
                  primaryColor: '#000000',
                  aboutSections: normalizeAboutSections(p.aiInsights?.aboutSections, p.bio || ''),
                  servicesOffered: normalizeServicesOffered(p.aiInsights?.servicesOffered),
                },
                portfolio_projects: oldItems.map((item: any) => ({
                  id: item.id, 
                  title: item.title || 'Untitled Project', 
                  description: item.description || '', 
                  image_url: item.image_url || '', 
                  project_url: item.project_url || '', 
                  technologies: Array.isArray(item.technologies) ? item.technologies : []
                })),
                portfolio_skills: [],
                portfolio_links: []
              }] as any;
            }
          }
          return mapProfile(p);
        }
      }
    }

    // 4. Try by partial ID match (8 chars)
    if (normalizedUsername.length >= 8) {
      console.log(`[Portfolio] Step 4: Attempting prefix lookup for: "${normalizedUsername}"`);
      const query4 = supabaseAdmin
        .from('profiles')
        .select(`
          id, name, role, avatar_url, bio, hourlyRate, username, skills, category, companyName, aiInsights,
          portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
        `)
        .filter('id', 'ilike', `${normalizedUsername}%`)
        .limit(1);

      const profileByPrefix = await fetchProfileWithFallback(query4, normalizedUsername);
      if (profileByPrefix) return mapProfile(profileByPrefix);
    }

    return null;
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    return null;
  }
}

// Helper to map DB profile to FreelancerProfile interface
function mapProfile(profile: any): FreelancerProfile {
  const portfolioData = selectDisplayPortfolio(profile.portfolios);
  const mergedProjects = mergePortfolioProjects(profile.portfolios);
  const premiumProfile = portfolioData?.theme_settings?.premiumProfile;
  const aboutSections = normalizeAboutSections(
    portfolioData?.theme_settings?.aboutSections || profile.aiInsights?.aboutSections,
    profile.bio || portfolioData?.about_me || '',
  );
  const servicesOffered = normalizeServicesOffered(
    portfolioData?.theme_settings?.servicesOffered || profile.aiInsights?.servicesOffered,
  );
  const clientReviews = normalizeClientReviews(
    portfolioData?.theme_settings?.clientReviews || profile.aiInsights?.clientReviews,
  );
  const applicationProfile =
    profile.aiInsights?.applicationProfile && typeof profile.aiInsights.applicationProfile === 'object'
      ? profile.aiInsights.applicationProfile
      : {};
  const profileLinks = [
    { id: 'portfolio', label: 'Portfolio', url: applicationProfile.portfolioUrl || '' },
    { id: 'intro', label: 'Intro', url: applicationProfile.interviewUrl || '' },
  ].filter((link) => typeof link.url === 'string' && link.url.trim().length > 0);
  const proExpiryRaw =
    typeof premiumProfile?.billing?.proExpiresAt === "string"
      ? premiumProfile.billing.proExpiresAt
      : "";
  const proExpiryDate = proExpiryRaw ? new Date(proExpiryRaw) : null;
  const hasValidProExpiry = !!proExpiryDate && !Number.isNaN(proExpiryDate.getTime());
  const isExpiredPro =
    premiumProfile?.tier === "pro" &&
    hasValidProExpiry &&
    !!proExpiryDate &&
    proExpiryDate.getTime() <= Date.now();
  const normalizedPremiumProfile = premiumProfile
    ? {
        ...premiumProfile,
        tier: isExpiredPro ? "free" : premiumProfile.tier,
        verifiedBadge: isExpiredPro ? !!premiumProfile.verifiedProgram?.enrolled : premiumProfile.verifiedBadge,
        advancedPortfolio: isExpiredPro ? false : premiumProfile.advancedPortfolio,
        featuredPlacement: isExpiredPro ? false : premiumProfile.featuredPlacement,
        analyticsEnabled: isExpiredPro ? false : premiumProfile.analyticsEnabled,
        customDomain: isExpiredPro ? "" : premiumProfile.customDomain,
        videoIntroUrl: isExpiredPro ? "" : premiumProfile.videoIntroUrl,
        billing: premiumProfile.billing
          ? {
              ...premiumProfile.billing,
              proStatus: isExpiredPro ? "inactive" : premiumProfile.billing.proStatus,
              proLocked: isExpiredPro ? false : premiumProfile.billing.proLocked,
            }
          : undefined,
      }
    : undefined;

  return {
    id: profile.id,
    name: profile.name || 'Anonymous',
    role: profile.role || 'Freelancer',
    companyName: profile.companyName || '',
    avatar_url: profile.avatar_url,
    bio: aboutSections.whatISpecializeIn || profile.bio,
    skills: Array.isArray(profile.skills) ? profile.skills.filter(Boolean) : [],
    aboutSections,
    servicesOffered,
    clientReviews,
    hourlyRate: profile.hourlyRate,
    category: profile.category,
    contactEmail: applicationProfile.contactEmail || '',
    contactPhone: applicationProfile.contactPhone || '',
    resumeUrl: applicationProfile.resumeUrl || '',
    portfolio: portfolioData ? {
      id: portfolioData.id,
      profile_id: profile.id,
      about_me: portfolioData.about_me,
      tagline: portfolioData.tagline,
      custom_domain: portfolioData.custom_domain,
      theme_settings: portfolioData.theme_settings,
      projects: mergedProjects.length > 0 ? mergedProjects : getPortfolioProjects(portfolioData),
      skills: portfolioData.portfolio_skills || [],
      links: Array.isArray(portfolioData.portfolio_links) && portfolioData.portfolio_links.length > 0
        ? portfolioData.portfolio_links
        : profileLinks,
    } : undefined,
    premiumProfile: normalizedPremiumProfile
  };
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const profile = await getPortfolio(username);
  const canonical = absoluteUrl(`/${encodeURIComponent(username)}`);

  if (!profile) {
    return {
      title: 'Profile Not Found',
      robots: { index: false, follow: false },
    };
  }

  const role = (profile.role || '').toLowerCase();
  const isHirer = role === 'employer' || role === 'client' || role === 'hirer';
  const displayName = isHirer ? profile.companyName || profile.name : profile.name;
  const category = profile.category || (isHirer ? 'Employer' : 'Freelancer');
  const title = isHirer
    ? `${displayName} Company Profile`
    : `${displayName} - ${category} Freelancer`;
  const skills = Array.isArray(profile.skills) && profile.skills.length > 0
    ? ` Skills: ${profile.skills.slice(0, 6).join(', ')}.`
    : '';
  const description = truncateSeoText(
    `${displayName} on ${siteName}. ${profile.bio || `Professional ${category} profile.`}${skills}`,
  );
  const image = profile.avatar_url || '/tarawork-icon.png';

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'profile',
      url: canonical,
      siteName,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const profile = await getPortfolio(username);

  if (!profile) {
    notFound();
  }

  if (!profile.contactEmail) {
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    profile.contactEmail = authUser.user?.email || "";
  }

  const role = (profile.role || "").toLowerCase();
  const isHirer = role === "employer" || role === "client" || role === "hirer";

  if (isHirer) {
    const { count: liveJobs } = await supabaseAdmin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("employer_id", profile.id)
      .eq("status", "live");

    const { data: hirerProfileMeta } = await supabaseAdmin
      .from("profiles")
      .select("aiInsights")
      .eq("id", profile.id)
      .maybeSingle();

    const aiInsights = (hirerProfileMeta?.aiInsights as Record<string, unknown> | undefined) || {};
    const reviewScore =
      typeof aiInsights?.hirerReviewScore === "number"
        ? aiInsights.hirerReviewScore
        : null;
    const reviewCount =
      typeof aiInsights?.hirerReviewCount === "number"
        ? aiInsights.hirerReviewCount
        : 0;
    const companyProfile =
      aiInsights.companyProfile && typeof aiInsights.companyProfile === "object"
        ? (aiInsights.companyProfile as Record<string, string>)
        : {};
    const companyName = profile.companyName || profile.name || "Company";
    const companyInitial = companyName.trim().charAt(0).toUpperCase() || "C";
    const contactItems = [
      { label: "Email", value: companyProfile.contactEmail },
      { label: "Phone", value: companyProfile.contactPhone },
      { label: "Website", value: companyProfile.website },
      { label: "Address", value: companyProfile.address },
    ].filter((item) => typeof item.value === "string" && item.value.trim().length > 0);

    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-950 p-8 text-white sm:p-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/10 text-3xl font-black">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={`${companyName} logo`} className="h-full w-full object-cover" />
                  ) : (
                    companyInitial
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-300">TaraWork Company Profile</p>
                  <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{companyName}</h1>
                  <p className="mt-2 text-sm font-semibold text-slate-300">
                    {companyProfile.industry || "Employer"}{companyProfile.companySize ? ` · ${companyProfile.companySize}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6 sm:p-8">
              <section className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Jobs</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">{liveJobs || 0}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employer Reviews</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {reviewScore !== null ? `${reviewScore.toFixed(1)}/5 (${reviewCount} reviews)` : "No reviews yet"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Representative</p>
                  <p className="mt-1 text-sm font-black text-slate-900">{profile.name || "Not provided"}</p>
                </div>
              </section>

              <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Company Description</h2>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {profile.bio || "This company has not added a description yet."}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">Contact Details</h2>
                  {contactItems.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {contactItems.map((item) => (
                        <div key={item.label}>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                          <p className="mt-1 break-words text-sm font-bold text-slate-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm font-semibold text-slate-500">Contact details not provided.</p>
                  )}
                </div>
              </section>

              {companyProfile.hiringNote && (
                <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                  <h2 className="text-sm font-black uppercase tracking-[0.18em] text-indigo-700">Hiring Notes</h2>
                  <p className="mt-3 whitespace-pre-line text-sm font-semibold leading-relaxed text-slate-700">
                    {companyProfile.hiringNote}
                  </p>
                </section>
              )}

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/"
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Back to Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return <PortfolioPreview profile={profile} isPublic={true} />;
}

