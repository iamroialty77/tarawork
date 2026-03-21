import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import { supabaseAdmin } from '@/lib/supabase_admin';
import { FreelancerProfile, ServiceOffering } from '@/types/portfolio';
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

async function fetchProfileWithFallback(query: any, identifier: string) {
  let { data: profile, error } = await query;

  if (error) {
    console.warn(`[Portfolio] Database query error for "${identifier}":`, error.message);
    
    // Check if we can do a basic fallback for critical schema errors
    const isCritical = error.message.includes('relation') || 
                       error.message.includes('column') || 
                       error.message.includes('relationship');
    
    if (isCritical || !profile) {
      console.log(`[Portfolio] Attempting basic fallback fetch for "${identifier}"...`);
      // Basic query without complex joins
      const basicQuery = supabaseAdmin.from('profiles').select('id, name, role, avatar_url, bio, hourlyRate, username, aiInsights');
      
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

  // 2. Fallback to old portfolio_items if portfolios is empty OR if the relation didn't load
  if (profile && (!profile.portfolios || profile.portfolios.length === 0)) {
    console.log(`[Portfolio] No "portfolios" relation data for ${profile.name} (ID: ${profile.id}), checking old portfolio_items...`);
    const { data: oldItems, error: oldError } = await supabaseAdmin
      .from('portfolio_items')
      .select('*')
      .eq('profile_id', profile.id);
    
    if (oldError) console.error(`[Portfolio] Error fetching old items:`, oldError.message);

    if (oldItems && oldItems.length > 0) {
      console.log(`[Portfolio] Found ${oldItems.length} items in old table. Mapping to new structure.`);
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
        portfolio_projects: oldItems.map((item: any) => ({
          id: item.id, 
          title: item.title || 'Untitled Project', 
          description: item.description || '', 
          image_url: item.image_url || '', 
          project_url: item.project_url || '', 
          technologies: Array.isArray(item.technologies) ? item.technologies : 
                        (typeof item.technologies === 'string' ? item.technologies.split(',').map((s: string) => s.trim()) : [])
        })),
        portfolio_skills: [],
        portfolio_links: []
      }] as any;
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
        id, name, role, avatar_url, bio, hourlyRate, username, aiInsights,
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
          id, name, role, avatar_url, bio, hourlyRate, username, aiInsights,
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
        id, name, role, avatar_url, bio, hourlyRate, username, aiInsights,
        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
      `)
      .or(`name.ilike.%${flexibleSearch}%,username.ilike.%${flexibleSearch}%`)
      .limit(10);

    if (candidateError) console.error('[Portfolio] Candidate search error:', candidateError.message);

    if (candidates && candidates.length > 0) {
      console.log(`[Portfolio] Analyzing ${candidates.length} candidates for a match...`);
      for (let p of candidates) {
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
          id, name, role, avatar_url, bio, hourlyRate, username, aiInsights,
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
  const portfolioData = profile.portfolios?.[0];
  const premiumProfile = portfolioData?.theme_settings?.premiumProfile;
  const aboutSections = normalizeAboutSections(
    portfolioData?.theme_settings?.aboutSections || profile.aiInsights?.aboutSections,
    profile.bio || portfolioData?.about_me || '',
  );
  const servicesOffered = normalizeServicesOffered(
    portfolioData?.theme_settings?.servicesOffered || profile.aiInsights?.servicesOffered,
  );
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
    avatar_url: profile.avatar_url,
    bio: aboutSections.whatISpecializeIn || profile.bio,
    aboutSections,
    servicesOffered,
    hourlyRate: profile.hourlyRate,
    portfolio: portfolioData ? {
      id: portfolioData.id,
      profile_id: profile.id,
      about_me: portfolioData.about_me,
      tagline: portfolioData.tagline,
      custom_domain: portfolioData.custom_domain,
      theme_settings: portfolioData.theme_settings,
      projects: portfolioData.portfolio_projects || [],
      skills: portfolioData.portfolio_skills || [],
      links: portfolioData.portfolio_links || [],
    } : undefined,
    premiumProfile: normalizedPremiumProfile
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const profile = await getPortfolio(username);

  if (!profile) {
    notFound();
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

    return (
      <main className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-2 bg-slate-900" />
            <div className="p-8 space-y-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600">TaraWork Hirer Profile</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">{profile.name || "Hirer"}</h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {profile.bio || "This hirer prefers to keep profile details concise. Review active jobs for current opportunities."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Jobs</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">{liveJobs || 0}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hirer Reviews</p>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    {reviewScore !== null ? `${reviewScore.toFixed(1)}/5 (${reviewCount} reviews)` : "No reviews yet"}
                  </p>
                </div>
              </div>

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
