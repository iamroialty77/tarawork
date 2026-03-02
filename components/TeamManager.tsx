"use client";

import { Squad, SquadMember } from "../types";
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  ShieldCheck, 
  Briefcase, 
  TrendingUp,
  Settings,
  MoreVertical,
  Lock,
  MessageSquare,
  Scale,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Info,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TeamManagerProps {
  squad?: Squad;
  onCreateSquad?: (squad: Squad) => void;
  onUpdateSquad?: (squad: Squad) => void;
}

export default function TeamManager({ squad, onCreateSquad, onUpdateSquad }: TeamManagerProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [showEquityBoard, setShowEquityBoard] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Contributor");
  const [newSquadName, setNewSquadName] = useState("");
  const [totalBudget, setTotalBudget] = useState("100000"); // Standardizing to user's example
  const currentUserId = "1"; // Simulating logged in user

  const [consensuses, setConsensuses] = useState<Record<string, boolean>>({
    "1": true,
    "2": false,
    "3": true,
  });

  const defaultSquad: Squad | null = squad || null;

  const handleAddMember = () => {
    if (!newMemberName || !onUpdateSquad || !defaultSquad) return;

    const newMember: SquadMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName,
      role: newMemberRole,
      avatar: "",
      share: 0, // Initially 0, requires adjustment in Equity Board
      permissions: ["view-only", "edit-tasks"]
    };

    const updatedSquad = {
      ...defaultSquad,
      members: [...defaultSquad.members, newMember]
    };

    onUpdateSquad(updatedSquad);
    setIsAddingMember(false);
    setNewMemberName("");
  };

  const handleCreateSquad = () => {
    if (!newSquadName || !onCreateSquad) return;

    const newSquad: Squad = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSquadName,
      leadId: currentUserId,
      members: [
        {
          id: currentUserId,
          name: "You", // In real app, get from profile
          role: "Squad Lead",
          share: 100,
          avatar: "",
          permissions: ["manage-budget", "add-members", "edit-tasks"]
        }
      ],
      totalBudget: parseInt(totalBudget),
      status: "Active"
    };

    onCreateSquad(newSquad);
    setIsCreating(false);
    setNewSquadName("");
  };

  if (!defaultSquad) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6 p-10 text-center">
        <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No Squad Active</h3>
        <p className="text-slate-500 max-w-xs mx-auto text-sm">
          You haven't joined or created a squad yet. Squads allow you to apply for larger projects as a team.
        </p>

        {isCreating ? (
          <div className="mt-8 max-w-sm mx-auto p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">New Squad Identity</h4>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Squad Name</label>
                <input 
                  type="text" 
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Dream Team Alpha"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Initial Project Budget (₱)</label>
                <input 
                  type="number" 
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateSquad}
                  className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  FORM SQUAD
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setIsCreating(true)}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
          >
            Create a Squad
          </button>
        )}
      </div>
    );
  }

  const isLead = defaultSquad.leadId === currentUserId;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Agency & Squad Mode</h3>
            <p className="text-xs text-slate-500">Apply as a team and distribute budgets</p>
          </div>
        </div>
        <button 
          onClick={() => setIsManaging(!isManaging)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Active Squad</span>
            <h4 className="text-xl font-black text-slate-900">{defaultSquad.name}</h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-1">Squad Revenue</span>
            <h4 className="text-xl font-black text-slate-900">₱{defaultSquad.totalBudget.toLocaleString()}</h4>
          </div>
        </div>

        <div className="space-y-3">
          {defaultSquad.members.map((member) => (
            <div key={member.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                    {member.id === defaultSquad.leadId && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Lead</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{member.share}%</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Equity Share</p>
                  </div>
                  {consensuses[member.id] ? (
                    <div className="w-4 h-4 text-emerald-500" title="Agreed to Budget Split">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 text-amber-500 animate-pulse" title="Pending Agreement">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      {member.id === currentUserId && (
                        <button 
                          onClick={() => setConsensuses(prev => ({ ...prev, [member.id]: true }))}
                          className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-tight hover:bg-emerald-200"
                        >
                          Agree
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-emerald-600">₱{(defaultSquad.totalBudget * (member.share / 100)).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Payout</p>
                </div>
                <Link
                  href={`/messages?with=${member.id}`}
                  className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"
                  title={`Message ${member.name}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
                <button className="p-1.5 text-slate-300 hover:text-slate-600 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {isLead ? (
            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => setIsAddingMember(true)}
                className="flex-1 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-bold text-sm"
              >
                <UserPlus className="w-5 h-5" />
                Add Member
              </button>
              <button 
                onClick={() => setShowEquityBoard(!showEquityBoard)}
                className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                <Scale className="w-5 h-5" />
                Review Equity
              </button>
            </div>
          ) : (
            <div className="w-full py-4 border-2 border-dashed border-slate-50 rounded-2xl text-slate-300 flex items-center justify-center gap-2 font-bold text-xs grayscale">
              <Lock className="w-3.5 h-3.5" />
              Member management restricted to Lead
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <UserPlus className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Grow Your Squad</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Add a new professional to your squad. They will receive an invitation to join the current project workflow.
              </p>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Member Name</label>
                  <input 
                    type="text" 
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    placeholder="Full name or username"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Designated Role</label>
                  <select 
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all"
                  >
                    <option>Contributor</option>
                    <option>Technical Lead</option>
                    <option>Quality Assurance</option>
                    <option>Designer</option>
                    <option>Reviewer</option>
                  </select>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-normal">
                    <span className="font-bold">Pro Tip:</span> New members start with 0% equity. You can adjust the budget distribution in the <span className="font-bold">Equity Board</span> once they join.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  onClick={() => setIsAddingMember(false)}
                  className="flex-1 py-4 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddMember}
                  disabled={!newMemberName}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEquityBoard && (
        <div className="px-6 py-6 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top duration-300">
          <div className="bg-indigo-900 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Scale className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">AI Equity Intelligence</span>
              </div>
              <h4 className="text-xl font-bold mb-4">Fair-Share & Equity Audit</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-tight">Contribution Matrix</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] opacity-70">EXECUTION (Energy Cost)</span>
                      <span className="text-[10px] font-bold">72% Weight</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] opacity-70">MANAGEMENT & RISK</span>
                      <span className="text-[10px] font-bold">28% Weight</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: '28%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-[11px] leading-relaxed italic opacity-90">
                      "AI Analysis suggests the ₱{defaultSquad.totalBudget.toLocaleString()} budget distribution is **FAIR**. Lead's higher share is justified by **35% Management Overhead** and **Risk Liability**, while members' shares are aligned with **High-Energy Task Execution**."
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-300">
                    <Info className="w-3.5 h-3.5" />
                    <span>Based on actual task complexity (Energy Cost) and role risk.</span>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => alert("Initiating AI Mediation Protocol. All members will be notified.")}
                      className="w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Request AI Dispute Resolution
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Squad Consensus</p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-slate-900">2/3</div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">Pending Agreement</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Transparency Score</p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-slate-900">98%</div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">High Trust</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Escrow Status</p>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-black text-slate-900">Secured</div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">Automatic</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowEquityBoard(false)}
            className="w-full py-2 text-xs font-black text-slate-400 uppercase hover:text-slate-600 tracking-widest transition-all"
          >
            Hide Equity Insights
          </button>
        </div>
      )}

      <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Equity Protection & Fair-Share Enabled</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowEquityBoard(!showEquityBoard)}
            className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-all uppercase tracking-tight"
          >
            <Scale className="w-3.5 h-3.5" />
            Equity Audit
          </button>
          <button 
            onClick={() => alert("Redirecting to Smart Contracts manager...")}
            className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-tight"
          >
            MANAGE CONTRACTS
          </button>
        </div>
      </div>
    </div>
  );
}
