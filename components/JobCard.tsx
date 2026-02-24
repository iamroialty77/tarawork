"use client";

import { Job } from "../types";
import { motion } from "framer-motion";
import { 
  Clock, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Heart, 
  MoreHorizontal,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { useState } from "react";
import { cn, formatRelativeTime } from "../lib/utils";
import Link from "next/link";

export interface JobCardProps {
  job: Job;
  index?: number;
}

export default function JobCard({ job, index = 0 }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Top Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            {/* Company Logo Placeholder */}
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:border-indigo-100 transition-colors">
              <span className="text-xl font-bold text-indigo-600">
                {job.company.charAt(0)}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group/cat">
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {job.category}
                  </span>
                  <Link 
                    href="/messages" 
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                    title={`Message ${job.company} about ${job.category} project`}
                  >
                    <MessageSquare className="w-3 h-3" />
                  </Link>
                </div>
                {job.budget && job.budget > 4000 && (
                  <span className="flex items-center text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    High Budget
                  </span>
                )}
                <span className="flex items-center text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Smart Match
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium hover:text-gray-700 cursor-pointer">{job.company}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={cn(
                "p-2 rounded-full transition-all duration-200 cursor-pointer",
                isSaved ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              )}
            >
              <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
            </button>
            <button className="p-2 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Job Meta Info */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            {job.rate}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            {job.duration}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <Briefcase className="w-3.5 h-3.5 text-purple-500" />
            {job.jobType || "Contract"}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-orange-500" />
            Remote
          </div>
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2">
          {job.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-white text-gray-600 text-[11px] font-semibold rounded-lg border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[11px] font-medium text-gray-400 self-center">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-5 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium italic">
            Posted {formatRelativeTime(job.createdAt)}
          </span>
          <div className="flex gap-2">
            <Link
              href="/messages"
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Link>
            <button 
              onClick={() => alert(`Details for "${job.title}" at ${job.company}:\n\n${job.description}`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Details
            </button>
            <button 
              onClick={() => alert(`Application for "${job.title}" has been sent! The client (${job.company}) will review your profile and get back to you.`)}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
            >
              Apply Now
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
