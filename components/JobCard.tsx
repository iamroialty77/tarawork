"use client";

import { Job } from "../types";
import { motion } from "framer-motion";
import { 
  Clock, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bookmark, 
  MoreHorizontal,
  Share2,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, formatPostAge } from "../lib/utils";
import Link from "next/link";
import { getJobSharePath, getJobShareUrl } from "../lib/jobShare";

export interface JobCardProps {
  job: Job;
  index?: number;
  matchScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
  onApply?: (jobId: string) => void;
  applicationStatus?: string;
  sustainabilityMatch?: number;
  energyRequirement?: string;
  rateLabel?: string;
  rateSubLabel?: string;
  onViewSmartMatch?: (job: Job) => void;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  isApplyLocked?: boolean;
  applyLockedReason?: string;
}

export default function JobCard({ 
  job, 
  index = 0, 
  matchScore,
  matchedSkills = [],
  missingSkills = [],
  onApply,
  applicationStatus,
  sustainabilityMatch,
  energyRequirement,
  rateLabel,
  rateSubLabel,
  onViewSmartMatch,
  isSaved: controlledIsSaved,
  onToggleSave,
  isApplyLocked = false,
  applyLockedReason = "Copy public job link"
}: JobCardProps) {
  const isApplied = !!applicationStatus;
  const [localIsSaved, setLocalIsSaved] = useState(false);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isApplyingLocal, setIsApplyingLocal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "failed">("idle");
  const actionsMenuRef = useRef<HTMLDivElement | null>(null);
  const sharePath = getJobSharePath(job);
  const shareUrl = getJobShareUrl(job);
  const isSaved = controlledIsSaved ?? localIsSaved;
  const isApplyDisabled = isApplied || isApplyingLocal;

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    } finally {
      setTimeout(() => setShareStatus("idle"), 2500);
    }
  };

  const handleApplyClick = async () => {
    if (isApplyDisabled) return;
    if (isApplyLocked) {
      await copyShareLink();
      return;
    }
    setIsApplyingLocal(true);
    if (onApply) {
      await onApply(job.id);
    }
    setIsApplyingLocal(false);
  };

  const applyButtonLabel = isApplyingLocal
    ? "Applying..."
    : isApplied
      ? applicationStatus === "hired"
        ? "Hired"
        : "Pending"
      : isApplyLocked
        ? "Copy link"
        : "Apply Now";

  useEffect(() => {
    if (!showActionsMenu) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showActionsMenu]);

  const handleShareLink = async () => {
    await copyShareLink();
    setShowActionsMenu(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Top Bar - subtle */}
      <div className="h-1 w-full bg-slate-100 group-hover:bg-indigo-500 transition-colors duration-300" />
      
      <div className="p-6">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            {/* Company Logo Placeholder */}
            <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 transition-colors">
              <span className="text-xl font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                A
              </span>
            </div>
            
            <div>
              <div className="mb-2 space-y-2">
                <h3 className="text-lg font-bold leading-snug text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight break-words">
                  {job.title}
                </h3>
                <div className="flex flex-col items-start gap-1.5">
                  <span className="inline-flex items-center bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-[10px] font-bold uppercase tracking-widest">
                    {job.category}
                  </span>
                  {job.budget && job.budget > 4000 && (
                    <span className="inline-flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      High Budget
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    Verified Partner
                  </span>
                </div>
                {matchScore !== undefined && matchScore > 0 && (
                  <div className="relative flex items-center gap-2 pt-1">
                    <button 
                      onClick={() => onViewSmartMatch?.(job)}
                      onMouseEnter={() => setShowMatchDetails(true)}
                      onMouseLeave={() => setShowMatchDetails(false)}
                      className={cn(
                        "flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest transition-all group/match",
                        matchScore >= 80 ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm shadow-indigo-100 hover:bg-indigo-600 hover:text-white" :
                        matchScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-600 hover:text-white" :
                        "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-600 hover:text-white"
                      )}
                      title="Click for AI Smart Match Scan"
                    >
                      <Sparkles className="w-3 h-3 mr-1 group-hover/match:animate-spin" />
                      {matchScore}% Match
                    </button>

                    {showMatchDetails && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-20 p-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Match Insights</h4>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{matchScore}%</span>
                          </div>
                          
                          {matchedSkills.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                                Matched Skills
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {matchedSkills.map(skill => (
                                  <span key={skill} className="text-[9px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {missingSkills.length > 0 && (
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5" />
                                Missing Skills
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {missingSkills.map(skill => (
                                  <span key={skill} className="text-[9px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <p className="text-[9px] text-slate-400 font-medium pt-2 border-t border-slate-100 italic">
                            Tip: Upskill in missing areas to improve your match score.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2 relative">
            {!isApplyLocked && (
              <button
                onClick={handleApplyClick}
                disabled={isApplyDisabled}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all active:scale-95",
                  isApplied ? "bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100",
                  isApplyDisabled && "cursor-not-allowed opacity-90",
                )}
              >
                {isApplyingLocal && <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                {applyButtonLabel}
              </button>
            )}
            <button 
              onClick={() => {
                if (onToggleSave) {
                  onToggleSave(job.id);
                } else {
                  setLocalIsSaved((current) => !current);
                }
              }}
              className={cn(
                "p-2 rounded-lg transition-all duration-200 cursor-pointer",
                isSaved ? "bg-indigo-50 text-indigo-600" : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              )}
              aria-label={isSaved ? "Remove saved job" : "Save job"}
            >
              <Bookmark className={cn("w-5 h-5", isSaved && "fill-current")} />
            </button>
            <div className="relative" ref={actionsMenuRef}>
              <button
                onClick={() => setShowActionsMenu((prev) => !prev)}
                className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200 cursor-pointer"
                aria-label={`More actions for ${job.title}`}
                aria-expanded={showActionsMenu}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showActionsMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-xl z-30 p-1.5">
                  <button
                    onClick={handleShareLink}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                    Share Link
                  </button>
                  <Link
                    href={sharePath}
                    target="_blank"
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    Open Public Post
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {shareStatus === "copied" && (
          <p className="text-[11px] font-semibold text-emerald-600 mb-4">Share link copied.</p>
        )}
        {shareStatus === "failed" && (
          <p className="text-[11px] font-semibold text-amber-600 mb-4">Unable to copy. Try again.</p>
        )}

        {/* Job Meta Info */}
        <div className="flex flex-wrap gap-y-2 gap-x-4 mb-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <div className="flex flex-col">
              <span>{rateLabel || job.rate}</span>
              {rateSubLabel && (
                <span className="text-[10px] font-medium text-slate-400">{rateSubLabel}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {job.duration}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            {job.jobType || "Contract"}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Remote
          </div>
        </div>
        
        <p className={cn(
          "text-slate-500 text-sm leading-relaxed mb-2 font-medium",
          !showFullDescription && "line-clamp-4",
        )}>
          {job.description}
        </p>
        {job.description.length > 180 && (
          <button
            type="button"
            onClick={() => setShowFullDescription((current) => !current)}
            className="mb-5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            {showFullDescription ? "Read less" : "Read more"}
          </button>
        )}
        
        <div className="flex flex-wrap gap-2 mb-6">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="text-[10px] font-bold text-slate-400 self-center uppercase tracking-widest">
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-5 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Posted {formatPostAge(job.createdAt)}
          </span>
          <div className="flex flex-wrap gap-2 justify-end">
            <Link
              href={sharePath}
              target="_blank"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors uppercase tracking-wider"
            >
              Details
            </Link>
            <button 
              onClick={handleApplyClick}
              disabled={isApplyDisabled}
              title={isApplyLocked ? applyLockedReason : undefined}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-bold text-white rounded-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider",
                isApplied ? "bg-emerald-600 shadow-emerald-100" : "bg-slate-900 hover:bg-black shadow-lg shadow-slate-200",
                isApplyDisabled && "opacity-80 cursor-not-allowed"
              )}
            >
              {isApplyingLocal ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden xs:inline">Applying...</span>
                  <span className="xs:hidden">...</span>
                </span>
              ) : isApplied ? (
                applicationStatus === 'hired' ? "Hired ✓" : "Pending"
              ) : isApplyLocked ? (
                <>
                  <span>Copy link</span>
                  <Share2 className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span className="hidden xs:inline">Apply Now</span>
                  <span className="xs:hidden">Apply</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
