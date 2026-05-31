'use client';

import React, { useState } from 'react';
import {
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  Phone,
  X,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { FreelancerProfile, PortfolioProject } from '@/types/portfolio';
import { supabase } from '@/lib/supabase';

interface PortfolioPreviewProps {
  profile: FreelancerProfile;
  isPublic?: boolean;
}

const getSocialIcon = (label: string) => {
  const normalized = label.toLowerCase();
  if (normalized === 'github') return Github;
  if (normalized === 'linkedin') return Linkedin;
  if (normalized === 'mail') return Mail;
  return ExternalLink;
};

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

const isEmptyRate = (value?: string) => {
  if (!value) return true;
  const normalized = value.trim().toLowerCase();
  const numericValue = Number(normalized.replace(/[^\d.]/g, ''));
  return normalized === "0" || Number.isFinite(numericValue) && numericValue === 0;
};

const getDisplayRate = (profile: FreelancerProfile, services: ReturnType<typeof normalizeServicesForDisplay>) => {
  if (!isEmptyRate(profile.hourlyRate)) return profile.hourlyRate;
  const firstPricedService = services.find((service) => Number(service.startingPrice || 0) > 0);
  if (firstPricedService) {
    return `From ${formatServicePrice(firstPricedService.currency, Number(firstPricedService.startingPrice || 0))}`;
  }
  return 'Contact for rate';
};

const normalizeServicesForDisplay = (services: FreelancerProfile['servicesOffered']) => services || [];

const ProjectCard = ({ project }: { project: PortfolioProject }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm">
    <div className="relative mb-5 aspect-video overflow-hidden rounded-xl bg-slate-100">
      <img
        src={project.image_url || '/tarawork-removebg-preview.png'}
        alt={project.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = '/tarawork-removebg-preview.png';
        }}
      />
    </div>

    <h3 className="text-lg font-bold tracking-tight text-slate-900">{project.title}</h3>
    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{project.description}</p>

    <div className="mt-4 flex flex-wrap gap-2">
      {project.technologies.map((tech) => (
        <span
          key={tech}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600"
        >
          {tech}
        </span>
      ))}
    </div>

    <div className="mt-5 flex gap-4">
      {project.project_url && (
        <a
          href={project.project_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors hover:text-black"
        >
          <ExternalLink size={14} />
          Visit
        </a>
      )}
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors hover:text-black"
        >
          <Github size={14} />
          Code
        </a>
      )}
    </div>
  </div>
);

export default function PortfolioPreview({ profile, isPublic = true }: PortfolioPreviewProps) {
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const bio = profile.bio || profile.aboutSections?.whatISpecializeIn || profile.portfolio?.about_me || '';
  const skills =
    profile.portfolio?.skills && profile.portfolio.skills.length > 0
      ? profile.portfolio.skills.map((skill: { name: string }) => skill.name)
      : Array.isArray(profile.skills)
        ? profile.skills.filter(Boolean)
        : [];
  const servicesOffered = normalizeServicesForDisplay(profile.servicesOffered);
  const socialLinks = profile.portfolio?.links || [];
  const projects = profile.portfolio?.projects || [];
  const displayRate = getDisplayRate(profile, servicesOffered);
  const contactEmail = profile.contactEmail?.trim();
  const contactPhone = profile.contactPhone?.trim();
  const resumeUrl = profile.resumeUrl?.trim();

  const handleHireMe = () => {
    if (!isPublic) return;
    setIsInquiryModalOpen(true);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('portfolio_inquiries').insert([
        {
          freelancer_id: profile.id,
          sender_name: formData.name,
          sender_email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      setTimeout(() => {
        setIsInquiryModalOpen(false);
        setIsSubmitted(false);
        setFormData({ name: '', email: '', message: '' });
      }, 4000);
    } catch (err: unknown) {
      console.error('Error sending inquiry:', err);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-black text-white">T</div>
            <div>
              <span className="block text-lg font-bold tracking-tight">TaraWork</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Public Portfolio</span>
            </div>
          </div>
          <button
            onClick={handleHireMe}
            disabled={!isPublic}
            className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send Inquiry
          </button>
        </div>
      </nav>

      <div className="mx-auto flex max-w-screen-xl flex-col gap-12 px-6 py-28 lg:flex-row">
        <aside className="lg:w-[320px] lg:shrink-0">
          <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <img
                  src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.name}</h1>
                <p className="mt-1 font-medium text-slate-500">{profile.role || 'Freelancer'}</p>
                <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
                  <MapPin size={14} />
                  <span>Remote / Freelance</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">About</h2>
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm leading-relaxed text-slate-600">{bio.trim() || 'No bio available yet.'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Skills will be added soon.</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</h2>
              <div className="mt-3 space-y-3">
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
                  >
                    <Mail size={16} />
                    <span className="min-w-0 break-all">{contactEmail}</span>
                  </a>
                ) : null}
                {contactPhone ? (
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-white"
                  >
                    <Phone size={16} />
                    <span>{contactPhone}</span>
                  </a>
                ) : null}
                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
                  >
                    <ExternalLink size={16} />
                    View Resume
                  </a>
                ) : null}
                {socialLinks.length > 0 ? (
                  <div className="flex gap-3 pt-1">
                    {socialLinks.map((link) => {
                      const Icon = getSocialIcon(link.label);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={link.label}
                          className="text-slate-400 transition-colors hover:text-slate-900"
                        >
                          <Icon size={20} strokeWidth={1.5} />
                        </a>
                      );
                    })}
                  </div>
                ) : null}
                {!contactEmail && !contactPhone && !resumeUrl && socialLinks.length === 0 ? (
                  <p className="text-sm text-slate-400">No public links yet.</p>
                ) : null}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-12">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Profile Summary</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {profile.category || profile.role || 'Freelancer'} services for modern teams
                </h2>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Hourly Rate</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{displayRate}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Services Offered</h2>
              <p className="text-sm font-medium text-slate-400">{servicesOffered.length} services</p>
            </div>

            {servicesOffered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {servicesOffered.map((service, index) => (
                  <div key={`${service.serviceName}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Service</p>
                    <h3 className="mt-2 text-lg font-bold text-slate-900">{service.serviceName}</h3>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Starting Price</p>
                    <p className="mt-1 text-lg font-black text-slate-900">
                      {formatServicePrice(service.currency, Number(service.startingPrice || 0))}
                    </p>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Typical Turnaround</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">{service.typicalTurnaround || 'To be discussed'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
                No services listed yet.
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Featured Projects</h2>
              <p className="text-sm font-medium text-slate-400">{projects.length} projects</p>
            </div>

            {projects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-slate-500">
                <Briefcase size={40} strokeWidth={1} className="mb-4" />
                <p>No projects showcased yet.</p>
              </div>
            )}
          </section>
        </main>
      </div>

      {isInquiryModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Send Inquiry</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">Reach out to {profile.name}</h3>
              </div>
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold">Inquiry sent successfully.</span>
                </div>
                <p className="mt-2 text-sm text-emerald-700">The freelancer can review your message from the portfolio inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

