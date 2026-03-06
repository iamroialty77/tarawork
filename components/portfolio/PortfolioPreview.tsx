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
  CheckCircle2
} from 'lucide-react';
import { FreelancerProfile, PortfolioProject } from '@/types/portfolio';
import Image from 'next/image';

interface PortfolioPreviewProps {
  profile: FreelancerProfile;
  isPublic?: boolean;
}

const ProjectCard = ({ project }: { project: PortfolioProject }) => (
  <div className="group bg-white border border-gray-100 p-6 transition-all duration-300 hover:shadow-sm hover:border-gray-200">
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
          <span key={tech} className="text-[10px] uppercase tracking-wider text-gray-400 border border-gray-100 px-2 py-0.5">
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

const Sidebar = ({ profile }: { profile: FreelancerProfile }) => (
  <div className="space-y-12">
    <div className="space-y-6">
      <div className="relative w-24 h-24 overflow-hidden rounded-full border border-gray-100">
        <Image 
          src={profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
          alt={profile.name} 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{profile.name}</h1>
        <p className="text-gray-500 font-medium">{profile.role}</p>
        <div className="flex items-center gap-2 text-sm text-gray-400 pt-1">
          <MapPin size={14} />
          <span>Remote / Freelance</span>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-400">About</h4>
      <p className="text-sm leading-relaxed text-gray-600">
        {profile.portfolio?.about_me || profile.bio || "No bio available."}
      </p>
    </div>

    <div className="space-y-6">
      <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-400">Skills</h4>
      <div className="flex flex-wrap gap-2">
        {profile.portfolio?.skills.map((skill) => (
          <span key={skill.id} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 border border-gray-100">
            {skill.name}
          </span>
        )) || profile.bio?.split(',').map(s => (
          <span key={s} className="text-xs bg-gray-50 text-gray-600 px-3 py-1 border border-gray-100">
            {s.trim()}
          </span>
        ))}
      </div>
    </div>

    <div className="space-y-6">
      <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-400">Social</h4>
      <div className="flex gap-4">
        {profile.portfolio?.links.map((link) => (
          <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-black transition-colors">
            {/* Generic icon if icon name not mapped */}
            <ExternalLink size={20} strokeWidth={1.5} />
          </a>
        )) || (
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
    if (isPublic) {
      setIsInquiryModalOpen(true);
    } else {
      alert('This is a preview mode.');
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    // In a real app, we would save this to a 'portfolio_inquiries' table
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsInquiryModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar */}
          <aside className="lg:w-1/3 shrink-0">
            <Sidebar profile={profile} />
          </aside>
          
          {/* Main Content */}
          <main className="lg:w-2/3 space-y-20">
            <section className="space-y-10">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Featured Projects</h2>
                <div className="text-gray-400 text-sm font-medium">
                  {profile.portfolio?.projects.length || 0} Projects
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile.portfolio?.projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
                
                {(!profile.portfolio?.projects || profile.portfolio.projects.length === 0) && (
                  <div className="col-span-full py-20 border-2 border-dashed border-gray-100 rounded-sm flex flex-col items-center justify-center text-gray-400">
                    <Briefcase size={40} strokeWidth={1} className="mb-4" />
                    <p>No projects showcased yet.</p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
      
      {/* Sticky Hire Me CTA */}
      <div className="fixed bottom-10 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <button 
          onClick={handleHireMe}
          className="pointer-events-auto flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full shadow-2xl hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 group"
        >
          <span className="font-semibold tracking-wide">Hire {profile.name.split(' ')[0]}</span>
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
                      onClick={() => window.location.href = `/auth?referring_freelancer_id=${profile.id}&action=signup&role=hirer`}
                      className="text-sm font-semibold text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
                    >
                      Want to track your hires? Sign up here.
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900">Work with {profile.name.split(' ')[0]}</h3>
                    <p className="text-gray-500 mt-2 text-sm">
                      Fill out this quick form and {profile.name.split(' ')[0]} will get back to you as soon as possible.
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
