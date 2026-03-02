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
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TeamManagerProps {
  squad?: Squad;
  onCreateSquad?: (squad: Squad) => void;
}

export default function TeamManager({ squad, onCreateSquad }: TeamManagerProps) {
  const [isManaging, setIsManaging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSquadName, setNewSquadName] = useState("");
  const [totalBudget, setTotalBudget] = useState("50000");
  const currentUserId = "1"; // Simulating logged in user

  const defaultSquad: Squad | null = squad || null;

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
          avatar: ""
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
                    {member.id === "1" && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase">Lead</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{member.share}%</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Share</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-emerald-600">₱{(defaultSquad.totalBudget * (member.share / 100)).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Amount</p>
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
            <button 
              onClick={() => alert("Invite link copied to clipboard! Share it with your teammates.")}
              className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-bold text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add Squad Member
            </button>
          ) : (
            <div className="w-full py-4 border-2 border-dashed border-slate-50 rounded-2xl text-slate-300 flex items-center justify-center gap-2 font-bold text-xs grayscale">
              <Lock className="w-3.5 h-3.5" />
              Member management restricted to Lead
            </div>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Automatic Budget Distribution Enabled</span>
        </div>
        <button 
          onClick={() => alert("Redirecting to Smart Contracts manager...")}
          className="text-[10px] font-black text-emerald-600 hover:underline"
        >
          MANAGE CONTRACTS
        </button>
      </div>
    </div>
  );
}
