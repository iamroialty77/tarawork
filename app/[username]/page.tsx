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
    const { data: profile, error } = await supabaseAdmin
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
      .eq('username', username)
      .maybeSingle();

    if (error || !profile) return null;

    // Map database structure to our TypeScript interface
    const portfolioData = (profile as any).portfolios?.[0];
    
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
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    return null;
  }
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
