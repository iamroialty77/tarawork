"use client";

import { PortfolioItem } from "../types";
import { Github, Layout, ExternalLink, Code, Sparkles, Globe } from "lucide-react";
import { motion } from "framer-motion";

interface PortfolioPreviewProps {
  item: PortfolioItem;
}

export default function PortfolioPreview({ item }: PortfolioPreviewProps) {
  const isGithub = item.project_url?.includes("github.com");
  const isFigma = item.project_url?.includes("figma.com");

  const getPreviewImage = () => {
    if (item.image_url) return item.image_url;
    
    // Dynamic OG generation logic simulation
    if (isGithub) {
       const repo = item.project_url?.split("github.com/")[1];
       return `https://opengraph.githubassets.com/1/${repo}`;
    }
    
    if (isFigma) {
        return "https://cdn.sanity.io/images/599r6htc/regional/4691669a050f44c1303328e3f94ec601f5e8b394-2400x1260.png?rect=0,0,2400,1260&w=1024&h=538&q=75&fit=max&auto=format"; // Figma placeholder
    }

    return `https://api.microlink.io/?url=${encodeURIComponent(item.project_url || 'https://tarawork.com')}&screenshot=true&embed=screenshot.url`;
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        <img 
          src={getPreviewImage()} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-4 right-4 flex gap-2">
           {isGithub && (
             <div className="bg-black/80 backdrop-blur-md text-white p-2 rounded-xl border border-white/20 shadow-xl">
                <Github className="w-4 h-4" />
             </div>
           )}
           {isFigma && (
             <div className="bg-indigo-600/80 backdrop-blur-md text-white p-2 rounded-xl border border-white/20 shadow-xl">
                <Layout className="w-4 h-4" />
             </div>
           )}
        </div>

        {item.project_url && (
          <a 
            href={item.project_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-xl text-xs font-black shadow-xl opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 uppercase tracking-widest"
          >
            Live Preview
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
          <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest">Verified Work</span>
        </div>
        
        <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap gap-1.5 border-t border-slate-50">
          {item.technologies?.map((tech, i) => (
            <span key={i} className="text-[9px] font-black bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
              {tech}
            </span>
          ))}
          {(!item.technologies || item.technologies.length === 0) && (
            <span className="text-[9px] font-black bg-slate-50 text-slate-400 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">General Project</span>
          )}
        </div>
      </div>
    </div>
  );
}
