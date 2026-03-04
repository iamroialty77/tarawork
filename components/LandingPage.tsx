"use client";

import { Check, Brain, Users, Bell, Facebook, Twitter, Linkedin, Instagram, ChevronDown, ArrowRight, Star, ShieldCheck, Zap, Globe, Clock, Award, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="8" r="3" fill="white" />
                  <circle cx="16" cy="8" r="3" fill="white" />
                  <circle cx="12" cy="16" r="3" fill="white" />
                </svg>
              </div>
              <span className="text-slate-900 font-bold text-xl tracking-tight">TaraWork<span className="text-blue-600">.ph</span></span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/auth" className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Find Jobs
              </Link>
              <Link href="/auth" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Hire Talent
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/auth">
                <button className="px-5 py-2 text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth">
                <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-md shadow-blue-200 active:scale-95">
                  Join Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                The Future of Work in the Philippines
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-[1.1]">
                Tara, Work <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Together</span>
              </h1>
              <h2 className="text-2xl font-semibold text-slate-700 mb-6">
                Need an extra hand? You're in the right place.
              </h2>
              <p className="text-xl mb-8 text-slate-600 leading-relaxed">
                Tarawork.ph connects you with skilled freelancers and virtual assistants across the Philippines. 
                From admin help and content creation to design, tech, and more — we make it easy to find the right people, fast.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Link href="/auth">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center gap-2">
                    Join as a Freelancer <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="px-8 py-4 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-lg font-bold rounded-2xl transition-all active:scale-95">
                    Post a Job
                  </button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "AI-Verified Talent",
                  "Smart Match Score",
                  "Secure Escrow Payments",
                  "Escrow Protection",
                  "Built for Filipinos",
                  "Milestone Tracker"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{feature}</span>
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
              <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-8 space-y-6 relative overflow-hidden">
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
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-[2rem] p-6 border border-white/50 shadow-inner">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-400 p-0.5 shadow-lg">
                         <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">MR</div>
                         </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-slate-900 text-xl">Mark Rivera</h3>
                      </div>
                      <p className="text-sm font-semibold text-blue-600 mb-3">Top-Rated Graphic Designer</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-white text-[10px] font-bold text-slate-500 rounded border border-slate-100">Logo Design</span>
                        <span className="px-2 py-0.5 bg-white text-[10px] font-bold text-slate-500 rounded border border-slate-100">UI/UX</span>
                        <span className="px-2 py-0.5 bg-white text-[10px] font-bold text-blue-500 rounded border border-blue-100">Figma</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 text-center">
                      <span className="block text-xl font-bold text-slate-900">₱500</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">per hour</span>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-6 mb-6 border-b border-slate-200">
                    <button className="pb-3 px-1 text-sm font-bold text-blue-600 border-b-2 border-blue-600">Overview</button>
                    <button className="pb-3 px-1 text-sm font-bold text-slate-400 hover:text-slate-600">Milestones</button>
                    <button className="pb-3 px-1 text-sm font-bold text-slate-400 hover:text-slate-600">Messages</button>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Project Progress</span>
                      <span className="text-teal-600">75% Complete</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-white shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '75%' }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full shadow-sm"
                      ></motion.div>
                    </div>
                  </div>

                  {/* Message Bubble Mock */}
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">Client</div>
                    <div className="flex-1">
                      <p className="text-[11px] text-slate-600 line-clamp-1 italic font-medium">"The new logo concepts look amazing! Let's proceed with..."</p>
                    </div>
                    <button className="px-3 py-1 bg-teal-500 text-white text-[10px] font-bold rounded-lg hover:bg-teal-600 transition-colors">Send</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-blue-200">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1">AI Verified</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Skills confirmed by AI assessments.</p>
                  </div>
                  <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                    <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-teal-200">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1">Secure Escrow</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Payment released upon milestone approval.</p>
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
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Fast & Easy Matching</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our AI-powered engine connects you with the right talent in minutes, not days. Post a job and get matches immediately.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Reliable Pros</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Every freelancer is vetted through a rigorous verification process, including skill assessments and identity checks.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-2xl">🇵🇭</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Proudly Filipino</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Built with local heart and hustle. We understand the unique needs and culture of Filipino workers and businesses.
              </p>
            </div>
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
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group text-center"
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
              <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">1</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Create Your Profile</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Sign up in minutes. Set up your profile and tell us what you're looking for.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-teal-500 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-teal-200 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">2</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Get Matched</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Our smart matching system connects you based on skills and work style.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">3</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Start Working</h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                Chat, collaborate, and get paid securely. Our escrow system protects you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 px-6 bg-slate-900 text-white rounded-[3rem] mx-6 mb-24 overflow-hidden relative">
         <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"></div>
         <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">Your Work, <span className="text-blue-400">Protected</span></h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">We've built safety into every step of the process.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10">
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

              <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10">
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

      {/* Final CTA */}
      <section className="py-24 px-6 text-center overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -z-10"></div>
         <div className="container mx-auto relative">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
              Work is better when we<br /><span className="text-blue-600">do it together.</span>
            </h2>
            <p className="text-2xl text-slate-600 mb-12 font-medium">Tara, be part of Tarawork today.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/auth">
                <button className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-3xl transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center gap-3 mx-auto">
                   Start Hiring Now <ArrowRight className="w-6 h-6" />
                </button>
              </Link>
              <Link href="/auth">
                <button className="px-12 py-5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-xl font-bold rounded-3xl transition-all active:scale-95">
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
                <span className="text-slate-900 font-extrabold text-xl tracking-tight">TaraWork.ph</span>
              </Link>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Smart job matching for Filipino freelancers and clients. Built with ❤️ in the Philippines.
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
              <h4 className="font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs">For Clients</h4>
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
            <p className="text-slate-400 font-bold text-sm">© 2026 TaraWork.ph. All rights reserved.</p>
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
