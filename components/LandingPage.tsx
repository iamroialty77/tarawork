"use client";

import { Check, Users, Facebook, Twitter, Linkedin, Instagram, ChevronDown, ArrowRight, Star, ShieldCheck, Zap, Award, CheckCircle2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, type FormEvent } from 'react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactStatus, setContactStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactStatus({
        type: 'error',
        message: 'Please complete all fields before sending.',
      });
      return;
    }

    setIsSendingContact(true);
    setContactStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || 'Unable to send your message right now.');
      }

      setContactForm({ name: '', email: '', message: '' });
      setContactStatus({
        type: 'success',
        message: 'Message sent successfully. We will get back to you soon.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to send your message right now.';
      setContactStatus({ type: 'error', message });
    } finally {
      setIsSendingContact(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-600/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="8" r="3" fill="#2563eb" />
                  <circle cx="16" cy="8" r="3" fill="#2563eb" />
                  <circle cx="12" cy="16" r="3" fill="#2563eb" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">TaraWork.online</span>
            </Link>

            {/* Navigation (Desktop) */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="text-white/90 hover:text-white font-medium transition-colors">
                Home
              </Link>
              <div className="flex items-center gap-1 text-white/90 hover:text-white font-medium transition-colors cursor-pointer group">
                Find Jobs <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </div>
              <Link href="/auth" className="text-white/90 hover:text-white font-medium transition-colors">
                Hire Talent
              </Link>
              <Link href="/auth" className="text-white/90 hover:text-white font-medium transition-colors">
                Community
              </Link>
              <Link href="/auth" className="text-white/90 hover:text-white font-medium transition-colors">
                Pricing
              </Link>
            </nav>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth">
                <button className="px-5 py-2 text-white border border-white/30 hover:bg-white/10 rounded-lg font-semibold transition-all">
                  Sign In
                </button>
              </Link>
              <Link href="/auth">
                <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                  Join Now
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu (Overlay) */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-blue-700 border-t border-white/10 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
                <Link href="/" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <div className="text-white text-lg font-bold flex items-center justify-between">
                  Find Jobs <ChevronDown className="w-5 h-5" />
                </div>
                <Link href="/auth" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Hire Talent</Link>
                <Link href="/auth" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Community</Link>
                <Link href="/auth" className="text-white text-lg font-bold" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                
                <div className="h-px bg-white/10 my-2"></div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-3 text-white border border-white/30 hover:bg-white/10 rounded-xl font-bold transition-all text-center">
                      Sign In
                    </button>
                  </Link>
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 text-center">
                      Join Now
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 min-h-screen flex items-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-[72vw] w-[72vw] max-h-[38rem] max-w-[38rem] bg-white/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-[62vw] w-[62vw] max-h-[32rem] max-w-[32rem] bg-white/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                Tara, Work Together
              </h1>
              <h2 className="text-xl md:text-3xl font-bold text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
                Need an extra hand? You&apos;re in the right place.
              </h2>
              <p className="text-lg md:text-xl mb-12 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Tarawork.online connects you with skilled freelancers and virtual assistants across the Philippines. 
                From admin help and content creation to design, tech, and more — we make it easy to find the right people, fast.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <Link href="/auth">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2">
                    Join as a Freelancer
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white text-lg font-bold rounded-xl transition-all active:scale-95">
                    Post a Job
                  </button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 md:gap-x-12">
                {[
                  "AI-Verified Talent",
                  "Smart Match Score",
                  "Secure Escrow Payments",
                  "Escrow Protection",
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-sm md:text-base font-bold tracking-wide">{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                {/* Smart Match Score Header */}
                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-100">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Smart Match Score</span>
                      <span className="text-xs text-slate-500 font-medium italic">High Compatibility</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 p-0.5 shadow-lg">
                         <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold text-2xl"></div>
                         </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-1">Mark Rivera <ChevronDown className="w-4 h-4 text-blue-500" /></h3>
                      </div>
                      <p className="text-sm font-semibold text-slate-500 mb-3">Top-Rated Graphic Designer</p>
                      <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-400">
                        <span>Viet</span>
                        <span>SR: 3K</span>
                        <span>Nodame</span>
                        <span className="text-teal-500">Vex3s</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 text-[10px] font-bold text-slate-400 flex gap-4">
                       <div className="text-center">
                         <span className="block text-emerald-500 text-sm">●</span>
                         <span>Escrow</span>
                       </div>
                       <div className="text-center">
                         <span>350/hr</span>
                       </div>
                       <div className="text-center">
                         <span>30/hr</span>
                       </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-6 mb-6 border-b border-slate-100">
                    <button className="pb-3 px-1 text-sm font-bold text-slate-900 border-b-2 border-blue-600">Overview</button>
                    <button className="pb-3 px-1 text-sm font-bold text-slate-400">Milestones</button>
                    <button className="pb-3 px-1 text-sm font-bold text-slate-400">Files</button>
                    <button className="pb-3 px-1 text-sm font-bold text-slate-400">Messages</button>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>Initial Payment</span>
                      <span>Final Design</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '80%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-emerald-400 rounded-full"
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>St.metrki</span>
                      <div className="flex gap-4">
                        <span>1st Draft</span>
                        <span>Revision Phase</span>
                        <span className="text-slate-900">Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Bubble Mock */}
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-500 line-clamp-1">Intem dessxay is a doc or ihage to piece...</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mr-2">2d</span>
                    <button className="px-4 py-1.5 bg-emerald-500 text-white text-[11px] font-bold rounded-lg">Send</button>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 mt-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-500 line-clamp-1">Youmi41025 amet cealisy eo gineharice you...</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50/50 rounded-2xl p-6">
                    <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">AI-Powered Skill Verification</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Certified skills through assessments and vetting.</p>
                  </div>
                  <div className="bg-emerald-50/50 rounded-2xl p-6">
                    <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mb-4">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Milestone Tracker</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Funds released as each step is approved.</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 animate-bounce delay-700">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-bold text-slate-700">1.2k Freelancers Online</span>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">8,500+</div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Active Freelancers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-teal-600 mb-2">₱45M+</div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Earnings</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-blue-600 mb-2">12K+</div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Jobs Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-teal-600 mb-2">4.8★</div>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Tarawork Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">Why Tarawork?</h2>
            <p className="text-xl text-slate-600">The first intelligent freelancing platform designed specifically for the Philippine market.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Fast & Easy Matching</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our AI-powered engine connects you with the right talent in minutes, not days. Post a job and get matches immediately.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Reliable Pros</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Every freelancer is vetted through a rigorous verification process, including skill assessments and identity checks.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-2xl">🇵🇭</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Proudly Filipino</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Built with local heart and hustle. We understand the unique needs and culture of Filipino workers and businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"></div>
        <div className="container mx-auto relative">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-amber-300">
                <Star className="w-4 h-4" />
                Free & Premium
              </div>
              <h2 className="mt-6 text-4xl lg:text-5xl font-black tracking-tight">Free and Premium Plans</h2>
            </div>
            <Link href="/auth" className="inline-flex">
              <button className="rounded-2xl bg-amber-400 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-300">
                Upgrade
              </button>
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Free</p>
              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <div>Basic portfolio</div>
                <div>Skills</div>
                <div>Contact info</div>
                <div>Limited uploads</div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-400/20 via-white/10 to-white/5 p-8 shadow-2xl shadow-amber-900/20">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-300">Premium</p>
              <p className="mt-4 text-4xl font-black">P499</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white">
                <div>Verified badge</div>
                <div>Custom domain</div>
                <div>Featured placement</div>
                <div>Analytics</div>
                <div>Video intro</div>
                <div>Advanced portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-70"></div>
        <div className="container mx-auto relative">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                Tara Verified
              </div>
              <h2 className="mt-6 text-4xl lg:text-5xl font-black tracking-tight text-slate-900">Trust-first verification.</h2>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-950 px-8 py-6 text-white shadow-2xl shadow-slate-200/70">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300">P499/year</p>
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-4">
            {[
              "Verified identity",
              "Verified portfolio",
              "Higher search ranking",
              "Client trust boost",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-4" />
                <h3 className="text-base font-black tracking-tight text-slate-900">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-24 px-6 bg-slate-50 overflow-hidden relative">
         <div className="absolute top-1/2 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"></div>
         <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Popular Services</h2>
              <p className="text-slate-600 font-medium">Find the perfect talent for any project</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {[
                { name: 'Virtual Assistant', emoji: '💼', color: 'blue' },
                { name: 'Graphic Design', emoji: '🎨', color: 'pink' },
                { name: 'Content Writing', emoji: '✍️', color: 'teal' },
                { name: 'Web Development', emoji: '💻', color: 'indigo' },
                { name: 'Social Media', emoji: '📱', color: 'blue' },
                { name: 'Video Editing', emoji: '🎬', color: 'pink' },
                { name: 'Customer Support', emoji: '🎧', color: 'teal' },
                { name: 'Data Entry', emoji: '📊', color: 'indigo' },
                { name: 'Marketing', emoji: '📢', color: 'blue' },
                { name: 'Bookkeeping', emoji: '📚', color: 'pink' },
                { name: 'Translation', emoji: '🌐', color: 'teal' },
                { name: 'SEO Specialist', emoji: '🔍', color: 'indigo' },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group text-center"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{service.emoji}</div>
                  <p className="text-sm font-bold text-slate-800">{service.name}</p>
                </div>
              ))}
            </div>
         </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Three simple steps to start working together</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto relative">
             {/* Connector Line (Desktop) */}
             <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
             
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">1</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Create Your Profile</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Sign up in minutes. Set up your profile and tell us what you&apos;re looking for.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-teal-200 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">2</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Matched</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our smart matching system connects you based on skills and work style.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">3</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Working</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Chat, collaborate, and get paid securely. Our escrow system protects you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-2xl mx-6 mb-24 overflow-hidden relative">
         <div className="absolute bottom-0 right-0 h-[58vw] w-[58vw] max-h-[25rem] max-w-[25rem] bg-blue-600/20 rounded-full blur-[100px]"></div>
         <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Your Work, <span className="text-blue-400">Protected</span></h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">We&apos;ve built safety into every step of the process.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Escrow Payments</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Funds are held securely until work is approved. Freelancers get paid on time, and clients only pay for quality work.
                </p>
                <ul className="space-y-4">
                  {[ "Milestone-based payments", "Dispute resolution support", "Transparent fee structure" ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-blue-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10">
                <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-teal-500/20">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-6">Verified Pros</h3>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Every freelancer goes through our verification process to ensure quality and authenticity for all projects.
                </p>
                <ul className="space-y-4">
                  {[ "Identity verification", "Skill assessments", "Client reviews & ratings" ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
         </div>
      </section>

      {/* Contact Us */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">Contact Us</h2>
            <p className="text-lg text-slate-600 font-medium">
              Send us a message and our team will respond as soon as possible.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-2xl shadow-slate-200/60">
            <div className="max-w-3xl mx-auto">
              <form className="space-y-5" onSubmit={handleContactSubmit}>
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactForm.name}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    disabled={isSendingContact}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactForm.email}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="you@email.com"
                    disabled={isSendingContact}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(event) => setContactForm((prev) => ({ ...prev, message: event.target.value }))}
                    className="w-full min-h-40 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us how we can help."
                    disabled={isSendingContact}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingContact}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-white font-bold transition-all hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSendingContact ? 'Sending...' : 'Send Message'}
                </button>

                {contactStatus.type !== 'idle' && (
                  <p className={`text-sm font-semibold ${contactStatus.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {contactStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[90vw] w-[90vw] max-h-[50rem] max-w-[50rem] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>
         <div className="container mx-auto relative">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Work is better when we<br /><span className="text-blue-600">do it together.</span>
            </h2>
            <p className="text-2xl text-slate-600 mb-12 font-medium">Join TaraWork and start building your future today.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/auth">
                <button className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center gap-3 mx-auto">
                   Start Hiring Now <ArrowRight className="w-6 h-6" />
                </button>
              </Link>
              <Link href="/auth">
                <button className="px-12 py-5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-xl font-bold rounded-2xl transition-all active:scale-95">
                  Find Work
                </button>
              </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-100 pt-24 pb-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="8" cy="8" r="3" fill="white" />
                    <circle cx="16" cy="8" r="3" fill="white" />
                    <circle cx="12" cy="16" r="3" fill="white" />
                  </svg>
                </div>
                <span className="text-slate-900 font-extrabold text-xl tracking-tight">TaraWork.online</span>
              </Link>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Smart job matching for Filipino freelancers and employers. Built with ❤️ in the Philippines.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">For Freelancers</h4>
              <ul className="space-y-4">
                {['Find Jobs', 'Create Profile', 'How It Works', 'Success Stories'].map((item) => (
                  <li key={item}><Link href="/auth" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">For Employers</h4>
              <ul className="space-y-4">
                {['Hire Talent', 'Post a Job', 'Pricing', 'Enterprise'].map((item) => (
                  <li key={item}><Link href="/auth" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Community', 'Blog', 'Contact'].map((item) => (
                  <li key={item}><Link href="#" className="text-slate-500 hover:text-blue-600 font-bold transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-400 font-bold text-sm">© 2026 TaraWork.online. All rights reserved.</p>
            <div className="flex gap-8">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Link key={item} href="#" className="text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
