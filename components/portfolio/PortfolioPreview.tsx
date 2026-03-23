'use client';

import React, { useState } from 'react';
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  Mail, 
  MapPin, 
  Briefcase, 
  Star,
  Globe,
  ArrowRight,
  X,
  Send,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  PlayCircle,
  BarChart3,
  Eye
} from 'lucide-react';
import { FreelancerProfile, PortfolioProject } from '@/types/portfolio';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface PortfolioPreviewProps {
  profile: FreelancerProfile;
  isPublic?: boolean;
}

const ProjectCard = ({ project, isPro = false }: { project: PortfolioProject; isPro?: boolean }) => (
  <div className={`group p-6 transition-all duration-300 ${isPro ? "bg-white border border-amber-100 rounded-[1.75rem] shadow-lg shadow-amber-100/30 hover:-translate-y-1 hover:shadow-2xl" : "bg-white border border-gray-100 hover:shadow-sm hover:border-gray-200"}`}>
    <div className="relative aspect-video mb-6 overflow-hidden bg-gray-50 rounded-sm">
      {project.image_url ? (
        <Image 
          src={project.image_url} 
          alt={project.title} 
          fill 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          <Globe size={48} strokeWidth={1} />
        </div>
      )}
    </div>
    
    <div className="space-y-3">
      <h3 className="text-lg font-medium tracking-tight text-gray-900">{project.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 pt-2">
        {project.technologies.map((tech) => (
          <span key={tech} className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${isPro ? "text-amber-800 border border-amber-100 bg-amber-50 rounded-full" : "text-gray-400 border border-gray-100"}`}>
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4 pt-4">
        {project.project_url && (
          <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black transition-colors flex items-center gap-1.5 text-sm">
            <ExternalLink size={14} />
            <span>Visit</span>
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-black transition-colors flex items-center gap-1.5 text-sm">
            <Github size={14} />
            <span>Code</span>
          </a>
        )}
      </div>
    </div>
  </div>
);

const extractBaseRate = (hourlyRate?: string) => {
  const raw = (hourlyRate || "").trim();
  if (!raw) return "$50/hr";
  if (/\/\s*hr/i.test(raw)) return raw;
  const numeric = raw.replace(/[^\d.,]/g, "");
  if (!numeric) return raw;
  if (raw.includes("$")) return `$${numeric}/hr`;
  return `${raw}/hr`;
};

const PremiumProfessionalCard = ({ profile }: { profile: FreelancerProfile }) => {
  const hourlyRateLabel = extractBaseRate(profile.hourlyRate);
  const roleLabel = profile.role || "Freelancer Professional";
  const locationLabel = "Manila, Philippines";

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.22),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.16),transparent_45%)] blur-2xl" />
      <div className="relative overflow-hidden rounded-[2.2rem] border border-amber-200/35 bg-gradient-to-b from-[#2a0638] via-[#3a0950] to-[#260633] px-8 pb-10 pt-20 shadow-[0_28px_80px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(147,197,253,0.2),rgba(191,219,254,0.08),rgba(147,197,253,0.2))]" />
        <div className="absolute left-1/2 top-6 h-28 w-28 -translate-x-1/2 overflow-hidden rounded-full border-[5px] border-amber-300 shadow-[0_10px_32px_rgba(245,158,11,0.35)]">
          <Image
            src={profile.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=VerifiedPro"}
            alt={profile.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-200 to-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-amber-950 shadow-lg shadow-amber-300/40">
            <ShieldCheck size={12} />
            Verified Pro
          </div>

          <h3 className="mt-4 text-3xl font-black tracking-tight text-white">{profile.name}</h3>
          <p className="mt-1 text-base font-medium text-slate-200">{roleLabel}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-300">
            <MapPin size={14} />
            {locationLabel}
          </p>

          <div className="mx-auto mt-7 h-px w-full max-w-[280px] bg-white/20" />

          <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">Basic Rate</p>
          <p className="mt-1 text-4xl font-black text-white">{hourlyRateLabel}</p>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ profile, isPro = false }: { profile: FreelancerProfile; isPro?: boolean }) => {
  const skillItems =
    profile.portfolio?.skills && profile.portfolio.skills.length > 0
      ? profile.portfolio.skills.map((skill) => skill.name)
      : (profile.bio || "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
  const socialLinks = profile.portfolio?.links || [];
  const aboutSections = [
    { label: "Who I Help", value: profile.aboutSections?.whoIHelp || "" },
    { label: "What I Specialize In", value: profile.aboutSections?.whatISpecializeIn || profile.portfolio?.about_me || profile.bio || "" },
    { label: "Results I've Delivered", value: profile.aboutSections?.resultsIHaveDelivered || "" },
    { label: "How I Work", value: profile.aboutSections?.howIWork || "" },
  ].filter((item) => item.value.trim().length > 0);

  return (
  <div className={`space-y-12 ${isPro ? "rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm" : ""}`}>
    <div className="space-y-6">
      <div className={`relative w-24 h-24 overflow-hidden rounded-full ${isPro ? "border-4 border-white/20 shadow-2xl shadow-amber-400/20" : "border border-gray-100"}`}>
        <Image 
          src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
          alt={profile.name} 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className={`text-2xl font-semibold tracking-tight ${isPro ? "text-white" : "text-gray-900"}`}>{profile.name}</h1>
          {profile.premiumProfile?.verifiedBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
              <ShieldCheck size={12} />
              Verified
            </span>
          )}
          {profile.premiumProfile?.verifiedProgram?.enrolled && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
              <ShieldCheck size={12} />
              Tara Verified
            </span>
          )}
        </div>
        <p className={`font-medium ${isPro ? "text-slate-300" : "text-gray-500"}`}>{profile.role}</p>
        <div className={`flex items-center gap-2 text-sm pt-1 ${isPro ? "text-slate-400" : "text-gray-400"}`}>
          <MapPin size={14} />
          <span>Remote / Freelance</span>
        </div>
        {profile.premiumProfile?.customDomain && (
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">
            <Globe size={12} />
            {profile.premiumProfile.customDomain}
          </div>
        )}
      </div>
    </div>

    <div className="space-y-6">
      <h4 className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${isPro ? "text-slate-400" : "text-gray-400"}`}>About</h4>
      {aboutSections.length > 0 ? (
        <div className="space-y-3">
          {aboutSections.map((section) => (
            <div key={section.label} className={`${isPro ? "rounded-2xl border border-white/10 bg-white/5 p-4" : "rounded-2xl border border-gray-100 bg-gray-50 p-4"}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isPro ? "text-slate-400" : "text-gray-400"}`}>{section.label}</p>
              <p className={`mt-2 text-sm leading-relaxed ${isPro ? "text-slate-200" : "text-gray-600"}`}>{section.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-sm leading-relaxed ${isPro ? "text-slate-200" : "text-gray-600"}`}>No profile sections available yet.</p>
      )}
    </div>

    <div className="space-y-6">
      <h4 className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${isPro ? "text-slate-400" : "text-gray-400"}`}>Skills</h4>
      <div className="flex flex-wrap gap-2">
        {skillItems.length > 0 ? (
          skillItems.map((skill) => (
            <span key={skill} className={`text-xs px-3 py-1 ${isPro ? "bg-white/10 text-white border border-white/10 rounded-full" : "bg-gray-50 text-gray-600 border border-gray-100"}`}>
              {skill}
            </span>
          ))
        ) : (
          <p className={`text-sm ${isPro ? "text-slate-400" : "text-gray-400"}`}>Skills will be added soon.</p>
        )}
      </div>
    </div>

    <div className="space-y-6">
      <h4 className={`text-[11px] uppercase tracking-[0.2em] font-semibold ${isPro ? "text-slate-400" : "text-gray-400"}`}>Social</h4>
      <div className="flex gap-4">
        {socialLinks.length > 0 ? (
          socialLinks.map((link) => {
            const Icon = link.label.toLowerCase() === 'github' ? Github : 
                         link.label.toLowerCase() === 'linkedin' ? Linkedin : 
                         link.label.toLowerCase() === 'mail' ? Mail : ExternalLink;
            return (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" title={link.label} className={isPro ? "text-slate-400 hover:text-white transition-colors" : "text-gray-400 hover:text-black transition-colors"}>
                <Icon size={20} strokeWidth={1.5} />
              </a>
            );
          })
        ) : (
          <>
            <Github className="text-gray-400 hover:text-black cursor-pointer transition-colors" size={20} strokeWidth={1.5} />
            <Linkedin className="text-gray-400 hover:text-black cursor-pointer transition-colors" size={20} strokeWidth={1.5} />
            <Mail className="text-gray-400 hover:text-black cursor-pointer transition-colors" size={20} strokeWidth={1.5} />
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default function PortfolioPreview({ profile, isPublic = true }: PortfolioPreviewProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleHireMe = () => {
    if (!isPublic) return;
    setIsInquiryModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('portfolio_inquiries')
        .insert([
          { 
            freelancer_id: profile.id,
            sender_name: formData.name,
            sender_email: formData.email,
            message: formData.message
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      
      // Reset form after 5 seconds and close modal
      setTimeout(() => {
        setIsInquiryModalOpen(false);
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 5000);
    } catch (err: unknown) {
      console.error('Error sending inquiry:', err);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const analytics = profile.premiumProfile?.analytics;
  const isPro = profile.premiumProfile?.tier === 'pro';
  const firstName = (profile.name || 'Freelancer').split(' ')[0];
  const servicesOffered = profile.servicesOffered || [];
  const formatServicePrice = (currency: string, value: number) => {
    try {
      return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: currency || 'PHP',
        maximumFractionDigits: 0,
      }).format(Number.isFinite(value) ? Math.max(0, value) : 0);
    } catch {
      return `${currency || 'PHP'} ${Math.max(0, Number(value || 0)).toLocaleString()}`;
    }
  };
  const pageShellClass = isPro
    ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,#0f172a_0%,#111827_35%,#0b1220_100%)] text-white font-sans selection:bg-amber-300 selection:text-slate-950"
    : "min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-black selection:text-white";
  const navClass = isPro
    ? "fixed top-0 left-0 right-0 z-50 bg-slate-950/75 backdrop-blur-md border-b border-white/10"
    : "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100";
  const containerClass = isPro ? "max-w-screen-xl mx-auto px-6 py-32 lg:py-40" : "max-w-screen-xl mx-auto px-6 py-32 lg:py-48";

  return (
    <div className={pageShellClass}>
      {/* Professional Top Bar */}
      <nav className={navClass}>
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${isPro ? "bg-amber-300 text-slate-950" : "bg-black text-white"}`}>T</div>
            <span className={`font-bold tracking-tight text-lg ${isPro ? "text-white" : ""}`}>TaraWork</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <span className={`text-xs font-bold uppercase tracking-widest ${isPro ? "text-slate-400" : "text-gray-400"}`}>Professional Network</span>
            <div className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${isPro ? "border-white/15 bg-white/10 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
              <Eye size={12} />
              Public Portfolio
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ${isPro ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-gray-50 border-gray-100 text-gray-700"}`}>
              {isPro ? <Star size={12} className="text-amber-500" /> : <ShieldCheck size={12} className="text-blue-500" />}
              {isPro ? 'Freelancer Pro' : 'Verified Profile'}
            </div>
          </div>
          <button 
            onClick={handleHireMe}
            disabled={!isPublic}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${isPro ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-black text-white hover:bg-gray-800"}`}
          >
            Send Inquiry
          </button>
        </div>
      </nav>

      <div className={containerClass}>
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar */}
          <aside className="lg:w-1/3 shrink-0">
            <Sidebar profile={profile} isPro={isPro} />
          </aside>
          
          {/* Main Content */}
          <main className="lg:w-2/3 space-y-20">
            {isPro && (
              <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white via-amber-50 to-orange-100 p-8 shadow-2xl shadow-amber-500/10">
                <PremiumProfessionalCard profile={profile} />

                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl mt-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
                      <Star size={12} />
                      Premium Profile
                    </div>
                    <h2 className="mt-5 text-3xl font-semibold tracking-tight text-gray-900">
                      {profile.premiumProfile?.introHeadline || 'Professional profile'}
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                      Verified, branded, client-ready.
                    </p>
                  </div>

                  {profile.premiumProfile?.analyticsEnabled && (
                    <div className="grid min-w-[280px] grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white bg-white p-5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <BarChart3 size={14} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profile Views</span>
                        </div>
                        <p className="mt-3 text-3xl font-black text-gray-900">{analytics?.profileViews || 0}</p>
                      </div>
                      <div className="rounded-2xl border border-white bg-white p-5">
                        <div className="flex items-center gap-2 text-gray-400">
                          <ArrowRight size={14} />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Client Clicks</span>
                        </div>
                        <p className="mt-3 text-3xl font-black text-gray-900">{analytics?.clientClicks || 0}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-white p-5 text-slate-900">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Custom Domain</p>
                    <p className="mt-3 text-lg font-black">{profile.premiumProfile?.customDomain || 'https://www.tarawork.online/@roi'}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 text-slate-900">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Featured Placement</p>
                    <p className="mt-3 text-lg font-black">{profile.premiumProfile?.featuredPlacement ? 'Priority eligible' : 'Standard visibility'}</p>
                  </div>
                </div>

                {profile.premiumProfile?.verifiedProgram?.enrolled && (
                  <div className="mt-8 rounded-[1.75rem] border border-emerald-200 bg-white p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700">Tara Verified</p>
                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      {[
                        "Verified identity",
                        "Verified portfolio",
                        "Higher search ranking",
                        "Client trust boost",
                      ].map((item) => (
                        <div key={item} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {profile.premiumProfile?.videoIntroUrl && (
                  <a
                    href={profile.premiumProfile.videoIntroUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-950 px-6 py-5 text-white transition-all hover:bg-black"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-2xl bg-white/10 p-3">
                        <PlayCircle size={24} className="text-amber-300" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Video Intro</p>
                        <p className="mt-1 text-sm text-slate-300">Watch a quick introduction before you reach out.</p>
                      </div>
                    </div>
                    <ExternalLink size={18} className="text-slate-400" />
                  </a>
                )}
              </section>
            )}

            <section className="space-y-8">
              <div className="flex justify-between items-end">
                <h2 className={`text-3xl font-semibold tracking-tight ${isPro ? "text-white" : "text-gray-900"}`}>Services Offered</h2>
                <div className={`text-sm font-medium ${isPro ? "text-slate-400" : "text-gray-400"}`}>
                  {servicesOffered.length} Services
                </div>
              </div>

              {servicesOffered.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {servicesOffered.map((service, index) => (
                    <div
                      key={`${service.serviceName}-${index}`}
                      className={`rounded-2xl border p-5 ${isPro ? "border-white/10 bg-white/5" : "border-gray-100 bg-white"}`}
                    >
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPro ? "text-slate-400" : "text-gray-400"}`}>Service</p>
                      <h3 className={`mt-2 text-lg font-bold ${isPro ? "text-white" : "text-gray-900"}`}>{service.serviceName}</h3>
                      <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] ${isPro ? "text-slate-400" : "text-gray-400"}`}>Starting Price</p>
                      <p className={`mt-1 text-lg font-black ${isPro ? "text-amber-300" : "text-slate-900"}`}>
                        {formatServicePrice(service.currency, Number(service.startingPrice || 0))}
                      </p>
                      <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.2em] ${isPro ? "text-slate-400" : "text-gray-400"}`}>Typical Turnaround</p>
                      <p className={`mt-1 text-sm font-semibold ${isPro ? "text-slate-200" : "text-slate-700"}`}>
                        {service.typicalTurnaround || "To be discussed"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`rounded-2xl border border-dashed p-10 text-center ${isPro ? "border-white/10 bg-white/5 text-slate-400" : "border-gray-200 bg-white text-gray-500"}`}>
                  No services listed yet.
                </div>
              )}
            </section>

            <section className="space-y-10">
              <div className="flex justify-between items-end">
                <h2 className={`text-3xl font-semibold tracking-tight ${isPro ? "text-white" : "text-gray-900"}`}>Featured Projects</h2>
                <div className={`text-sm font-medium ${isPro ? "text-slate-400" : "text-gray-400"}`}>
                  {profile.portfolio?.projects.length || 0} Projects
                </div>
              </div>

              {profile.premiumProfile?.verifiedProgram?.enrolled && !isPro && (
                <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700">Verified Freelancer Program</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">Identity verified. Portfolio reviewed.</p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile.portfolio?.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} isPro={isPro} />
                ))}
                
                {(!profile.portfolio?.projects || profile.portfolio.projects.length === 0) && (
                  <div className={`col-span-full py-20 border-2 border-dashed flex flex-col items-center justify-center ${isPro ? "border-white/10 rounded-[1.75rem] text-slate-400 bg-white/5" : "border-gray-100 rounded-sm text-gray-400"}`}>
                    <Briefcase size={40} strokeWidth={1} className="mb-4" />
                    <p>No projects showcased yet.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Expertise Section for more professional look */}
            <section className={`space-y-10 pt-20 ${isPro ? "border-t border-white/10" : "border-t border-gray-100"}`}>
              <div className="flex justify-between items-end">
                <h2 className={`text-3xl font-semibold tracking-tight ${isPro ? "text-white" : "text-gray-900"}`}>Expertise & Strategy</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-8 rounded-2xl space-y-4 transition-all duration-500 border ${isPro ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:border-gray-100"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isPro ? "bg-white/10" : "bg-white"}`}>
                    <Sparkles className={`w-5 h-5 ${isPro ? "text-amber-300" : "text-black"}`} />
                  </div>
                  <h4 className={`font-bold tracking-tight ${isPro ? "text-white" : "text-gray-900"}`}>Quality-First Approach</h4>
                  <p className={`text-sm leading-relaxed ${isPro ? "text-slate-300" : "text-gray-500"}`}>
                    I believe in building solutions that are not just functional, but scalable and maintainable for the long term. Performance and user experience are always top priorities.
                  </p>
                </div>
                <div className={`p-8 rounded-2xl space-y-4 transition-all duration-500 border ${isPro ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:border-gray-100"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${isPro ? "bg-white/10" : "bg-white"}`}>
                    <Award className={`w-5 h-5 ${isPro ? "text-amber-300" : "text-black"}`} />
                  </div>
                  <h4 className={`font-bold tracking-tight ${isPro ? "text-white" : "text-gray-900"}`}>Result-Driven Mindset</h4>
                  <p className={`text-sm leading-relaxed ${isPro ? "text-slate-300" : "text-gray-500"}`}>
                    Every project is an opportunity to deliver measurable value. I focus on understanding business goals and translating them into efficient technical solutions.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
      
      {/* Sticky Hire Me CTA */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button 
          onClick={handleHireMe}
          disabled={!isPublic}
          className={`pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group disabled:cursor-not-allowed disabled:opacity-60 ${isPro ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-black text-white hover:bg-gray-900"}`}
        >
          <span className="font-semibold tracking-wide">Message {firstName}</span>
          <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsInquiryModalOpen(false)}
          />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
            <div className="p-8">
              <button 
                onClick={() => setIsInquiryModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>

              {isSubmitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Inquiry Sent!</h3>
                  <p className="text-gray-500 max-w-xs">
                    Your message has been sent to {profile.name}. They will contact you shortly.
                  </p>
                  <div className="pt-6">
                    <button 
                      onClick={() => window.location.href = `/auth?referring_freelancer_id=${profile.id}&action=signup&role=employer`}
                      className="text-sm font-semibold text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
                    >
                      Want to track your hires? Sign up here.
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Work with {firstName}</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                      This is a public, view-only portfolio. Send your project brief and {firstName} can reply to your email.
                    </p>
                  </div>

                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your Name</label>
                      <input 
                        required
                        id="name"
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
                      <input 
                        required
                        id="email"
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-gray-400">Project Description</label>
                      <textarea 
                        required
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-colors resize-none"
                        placeholder="Tell us about your project or what you're looking for..."
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Inquiry</span>
                          <Send size={18} />
                        </>
                      )}
                    </button>
                  </form>
                  
                  <p className="text-center text-[11px] text-gray-400">
                    By sending, you agree to our Terms of Service.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
