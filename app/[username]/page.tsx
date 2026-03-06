import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import { supabaseAdmin } from '@/lib/supabase_admin';
import { FreelancerProfile } from '@/types/portfolio';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchProfileWithFallback(query: any, identifier: string) {
  let { data: profile, error } = await query;

  // 1. Fallback if the new portfolios table doesn't exist yet OR if column doesn't exist
  if (error && (
    error.message.includes('relation "portfolios" does not exist') || 
    error.message.includes('Could not find the relationship') ||
    error.message.includes('column "username" does not exist')
  )) {
    console.warn(`[Portfolio] DB mismatch for ${identifier}: ${error.message}. Falling back to basic fetch.`);
    
    // Create a new basic query
    const basicQuery = supabaseAdmin.from('profiles').select('id, name, role, avatar_url, bio, hourlyRate, username');
    
    // Re-apply filters safely
    let refinedBasicQuery;
    if (identifier.includes('-') && identifier.length > 30) {
      refinedBasicQuery = basicQuery.eq('id', identifier);
    } else if (identifier.length === 8 && /^[0-9a-f]{8}$/i.test(identifier)) {
      refinedBasicQuery = basicQuery.filter('id', 'ilike', `${identifier}%`);
    } else {
      // If we are here because 'username' column is missing, we must search by name or ID
      // but if we don't know the name yet, we try name if it looks like one
      refinedBasicQuery = basicQuery.or(`name.ilike.%${identifier}%,id.ilike.%${identifier}%`);
    }
    
    const { data: basicProfile } = await refinedBasicQuery.maybeSingle();
    profile = basicProfile;
  }

  // 2. Fallback to old portfolio_items if portfolios is empty
  if (profile && (!profile.portfolios || profile.portfolios.length === 0)) {
    console.log(`[Portfolio] No new portfolio found for ${profile.name}, checking old table...`);
    const { data: oldItems } = await supabaseAdmin
      .from('portfolio_items')
      .select('*')
      .eq('profile_id', profile.id);
    
    if (oldItems && oldItems.length > 0) {
      profile.portfolios = [{ 
        id: 'fallback-' + (profile.id?.toString().substring(0, 8) || '0000'),
        about_me: profile.bio || '',
        tagline: 'Professional Portfolio',
        theme_settings: { aesthetic: 'minimalist', primaryColor: '#000000' },
        portfolio_projects: oldItems.map((item: any) => ({
          id: item.id, 
          title: item.title, 
          description: item.description, 
          image_url: item.image_url, 
          project_url: item.project_url, 
          technologies: item.technologies 
        })),
        portfolio_skills: [],
        portfolio_links: []
      }] as any;
    }
  }

  return profile;
}

async function getPortfolio(username: string): Promise<FreelancerProfile | null> {
  console.log(`[Portfolio] Starting lookup for: "${username}"`);
  
  // Debug environment (safely)
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log(`[Portfolio] Env status: URL=${hasUrl}, ServiceKey=${hasKey}`);

  // Demo data for testing and local development
  if (username === 'johndoe' || username === 'demo') {
    return {
      id: 'demo-uuid',
      name: 'John Doe',
      role: 'Senior Full-stack Developer',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      bio: 'Crafting minimalist, high-performance web applications with a focus on user experience and clean code.',
      portfolio: {
        id: 'portfolio-uuid',
        profile_id: 'demo-uuid',
        about_me: 'I am a passionate developer from Seoul with 5 years of experience in Next.js and Tailwind CSS. I believe in the power of minimalism and efficiency in software design.',
        tagline: 'Minimalist Engineering for Modern Web',
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
        theme_settings: { aesthetic: 'minimalist', primaryColor: '#000000' }
      }
    };
  }

  // List of reserved routes that shouldn't be treated as usernames
  const reservedRoutes = ['auth', 'api', 'admin', 'messages', 'portfolio', 'dashboard', 'settings', 'projects'];
  if (reservedRoutes.includes(username)) {
    return null;
  }

  try {
    // 1. Try by username (case-insensitive)
    console.log(`[Portfolio] Step 1: Searching for username: "${username}"`);
    const query1 = supabaseAdmin
      .from('profiles')
      .select(`
        id, name, role, avatar_url, bio, hourlyRate, username,
        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
      `)
      .filter('username', 'ilike', username)
      .maybeSingle();

    const profileByUsername = await fetchProfileWithFallback(query1, username);

    if (profileByUsername) {
      console.log(`[Portfolio] SUCCESS: Found profile by username match: ${username}`);
      return mapProfile(profileByUsername);
    }

    // Diagnostic: Check if any profiles exist at all
    const { count, error: countError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    console.log(`[Portfolio] Total profiles in database: ${count || 0}`);
    if (countError) console.error('[Portfolio] Count error:', countError.message);

    // 2. Try by full UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(username);
    if (isUUID) {
      console.log(`[Portfolio] Step 2: Attempting UUID lookup for: ${username}`);
      const query2 = supabaseAdmin
        .from('profiles')
        .select(`
          id, name, role, avatar_url, bio, hourlyRate, username,
          portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
        `)
        .eq('id', username)
        .maybeSingle();
      
      const profileById = await fetchProfileWithFallback(query2, username);
      if (profileById) return mapProfile(profileById);
    }

    // 3. Robust Name Match (Fallback)
    console.log(`[Portfolio] Step 3: Attempting name-based lookup for: "${username}"`);
    const alphaParts = username.match(/[a-z]{3,}/gi) || [];
    const searchWord = alphaParts[0] || username || '';
    const flexibleSearch = searchWord.length > 6 ? searchWord.substring(0, 6) : searchWord;
    
    const { data: profilesByName, error: nameSearchError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, name, role, avatar_url, bio, hourlyRate, username,
        portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
      `)
      .ilike('name', `%${flexibleSearch}%`)
      .limit(20);

    if (profilesByName && profilesByName.length > 0) {
      for (let p of profilesByName) {
        const cleanName = p.name?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
        const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanName.includes(cleanUsername) || cleanUsername.includes(cleanName) || 
            (cleanName.length >= 4 && cleanUsername.startsWith(cleanName.substring(0, 4)))) {
          
          // Apply fallback logic for each candidate
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
                theme_settings: { aesthetic: 'minimalist', primaryColor: '#000000' },
                portfolio_projects: oldItems.map((item: any) => ({
                  id: item.id, 
                  title: item.title, 
                  description: item.description, 
                  image_url: item.image_url, 
                  project_url: item.project_url, 
                  technologies: item.technologies 
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
    if (username.length >= 8) {
      console.log(`[Portfolio] Step 4: Attempting prefix lookup for: "${username}"`);
      const query4 = supabaseAdmin
        .from('profiles')
        .select(`
          id, name, role, avatar_url, bio, hourlyRate, username,
          portfolios (id, about_me, tagline, theme_settings, portfolio_projects(*), portfolio_skills(*), portfolio_links(*))
        `)
        .filter('id', 'ilike', `${username}%`)
        .limit(1);

      const profileByPrefix = await fetchProfileWithFallback(query4, username);
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
  return {
    id: profile.id,
    name: profile.name || 'Anonymous',
    role: profile.role || 'Freelancer',
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    hourlyRate: profile.hourlyRate,
    portfolio: portfolioData ? {
      id: portfolioData.id,
      profile_id: profile.id,
      about_me: portfolioData.about_me,
      tagline: portfolioData.tagline,
      theme_settings: portfolioData.theme_settings,
      projects: portfolioData.portfolio_projects || [],
      skills: portfolioData.portfolio_skills || [],
      links: portfolioData.portfolio_links || [],
    } : undefined
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  const profile = await getPortfolio(username);

  if (!profile) {
    notFound();
  }

  return <PortfolioPreview profile={profile} isPublic={true} />;
}
