import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import { supabaseAdmin } from '@/lib/supabase_admin';
import { FreelancerProfile } from '@/types/portfolio';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every minute

async function getPortfolio(username: string): Promise<FreelancerProfile | null> {
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
    // Real fetch from Supabase
    // We try to match by username (case-insensitive) OR full ID OR partial ID (first 8 chars)
    // This makes the routing more robust.
    
    // 1. Try by username (case-insensitive)
    // We do a safe fetch first - if 'username' column is missing, this will fail
    // but we'll catch it and try other methods.
    const { data: profileByUsername, error: error1 } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, name, role, avatar_url, bio, hourlyRate, username,
        portfolios (
          id, about_me, tagline, theme_settings,
          portfolio_projects (*),
          portfolio_skills (*),
          portfolio_links (*)
        )
      `)
      .ilike('username', username)
      .maybeSingle();

    if (profileByUsername) {
      console.log(`Found profile by username: ${username}`);
      return mapProfile(profileByUsername);
    }

    if (error1) {
      console.error(`Supabase error fetching username "${username}":`, error1.message);
      // If error is 'column "username" does not exist', it means DB is not ready
      if (error1.message.includes('column "username" does not exist')) {
        console.warn('WARNING: "username" column is missing in "profiles" table.');
      }
    }

    // 2. Try by full UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(username);
    if (isUUID) {
      const { data: profileById, error: error2 } = await supabaseAdmin
        .from('profiles')
        .select(`
          id, name, role, avatar_url, bio, hourlyRate,
          portfolios (
            id, about_me, tagline, theme_settings,
            portfolio_projects (*),
            portfolio_skills (*),
            portfolio_links (*)
          )
        `)
        .eq('id', username)
        .maybeSingle();
      
      if (profileById) {
        console.log(`Found profile by UUID: ${username}`);
        return mapProfile(profileById);
      }
      if (error2) console.error('Error fetching by UUID:', error2.message);
    }

    // 3. Try by name match (simplified ilike) - Fallback for users who haven't set username yet
    // Example: If URL is /reggieambrocio and name is "Reggie Ambrocio"
    const { data: profilesByName, error: error3 } = await supabaseAdmin
      .from('profiles')
      .select(`
        id, name, role, avatar_url, bio, hourlyRate,
        portfolios (
          id, about_me, tagline, theme_settings,
          portfolio_projects (*),
          portfolio_skills (*),
          portfolio_links (*)
        )
      `)
      .ilike('name', `%${username}%`)
      .limit(1);

    if (profilesByName && profilesByName.length > 0) {
      // Basic check: clean both and see if one contains the other
      const cleanName = profilesByName[0].name?.toLowerCase().replace(/\s+/g, '') || '';
      const cleanUsername = username.toLowerCase();
      if (cleanName.includes(cleanUsername) || cleanUsername.includes(cleanName)) {
        console.log(`Found profile by name match: ${profilesByName[0].name}`);
        return mapProfile(profilesByName[0]);
      }
    }

    // 4. Try by partial ID match (8 chars)
    if (username.length >= 8) {
      const { data: profiles, error: error4 } = await supabaseAdmin
        .from('profiles')
        .select(`
          id, name, role, avatar_url, bio, hourlyRate,
          portfolios (
            id, about_me, tagline, theme_settings,
            portfolio_projects (*),
            portfolio_skills (*),
            portfolio_links (*)
          )
        `)
        .filter('id', 'ilike', `${username}%`)
        .limit(1);

      if (profiles && profiles.length > 0) {
        console.log(`Found profile by prefix: ${username}`);
        return mapProfile(profiles[0]);
      }
      if (error4) console.error('Error fetching by prefix:', error4.message);
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
