"use client";

import { useState } from "react";
import { Job, JobType, JobDuration, PaymentMethod, Milestone, ProposalQuestion } from "../types";

export default function JobPostingForm() {
  const [step, setStep] = useState(1);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [formData, setFormData] = useState<Partial<Job>>({
    title: "",
    description: "",
    skills: [],
    jobType: "Contract",
    duration: "1-3 months",
    paymentMethod: "Flat-Rate",
    budget: 0,
    milestones: [],
    customQuestions: [],
    deadline: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({ title: "", dueDate: "", amount: 0 });
  const [newQuestion, setNewQuestion] = useState("");

  const calculateScore = () => {
    let score = 0;
    if (formData.title && formData.title.length > 10) score += 20;
    if (formData.description && formData.description.length > 50) score += 20;
    if ((formData.skills?.length || 0) >= 3) score += 20;
    if (formData.budget && formData.budget > 1000) score += 20;
    if ((formData.milestones?.length || 0) >= 1) score += 10;
    if (formData.deadline) score += 10;
    return score;
  };

  const score = calculateScore();

  const nextStep = () => {
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, 3));
      setIsAiAnalyzing(false);
    }, 800);
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const addSkill = () => {
    if (skillInput && !formData.skills?.includes(skillInput)) {
      setFormData({ ...formData, skills: [...(formData.skills || []), skillInput] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter((s) => s !== skill) });
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.amount) {
      const milestone: Milestone = {
        id: Math.random().toString(36).substr(2, 9),
        title: newMilestone.title,
        dueDate: newMilestone.dueDate || "",
        amount: newMilestone.amount,
      };
      setFormData({ ...formData, milestones: [...(formData.milestones || []), milestone] });
      setNewMilestone({ title: "", dueDate: "", amount: 0 });
    }
  };

  const addQuestion = () => {
    if (newQuestion && (formData.customQuestions?.length || 0) < 3) {
      const question: ProposalQuestion = {
        id: Math.random().toString(36).substr(2, 9),
        question: newQuestion,
      };
      setFormData({ ...formData, customQuestions: [...(formData.customQuestions || []), question] });
      setNewQuestion("");
    }
  };

  const renderAiInsights = () => (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 h-full space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-indigo-900 flex items-center gap-2">
          <span className="p-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black tracking-tighter">AI</span>
          Tara Insights
        </h4>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Live Analysis</span>
        </div>
      </div>

      {/* Score Meter */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Job Strength</p>
            <p className="text-xl font-black text-indigo-900">{score}%</p>
          </div>
          <p className="text-[10px] text-indigo-600 font-medium mb-1">
            {score < 70 ? "Needs improvement" : "High Quality"}
          </p>
        </div>
        <div className="h-3 w-full bg-indigo-200/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-[11px] text-indigo-700 leading-relaxed italic">
          &ldquo;{score < 50 
            ? "Masyadong maikli ang detalye. Dagdagan pa para mas maraming mag-apply!" 
            : score < 85
            ? "Maganda ang simula! Idagdag ang mga milestones para sa mas malinaw na budget."
            : "Napakahusay! Handa na ang iyong post para sa mga premium talent."}&rdquo;
        </p>
      </div>

      <div className="space-y-4 pt-4 border-t border-indigo-200/30">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-sm border border-indigo-100">💡</div>
          <div>
            <p className="text-xs font-bold text-indigo-900">Market Intelligence</p>
            <p className="text-[11px] text-indigo-700">Para sa <span className="font-bold">{formData.jobType}</span>, ang karaniwang rate sa Tara ay <span className="font-bold">₱25,000 - ₱60,000</span>.</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-sm border border-indigo-100">🛡️</div>
          <div>
            <p className="text-xs font-bold text-indigo-900">Escrow Protection</p>
            <p className="text-[11px] text-indigo-700">Bawat milestone ay garantisado. Hindi muna kailangang maglabas ng pera hangga't walang agreement.</p>
          </div>
        </div>
      </div>

      {/* Visual Preview */}
      <div className="pt-6 mt-6 border-t border-indigo-200/30">
        <p className="text-[10px] font-black text-indigo-900 mb-4 uppercase tracking-[0.2em]">Post Card Preview</p>
        <div className="bg-white p-5 rounded-2xl shadow-xl shadow-indigo-200/50 border border-indigo-100 transition-all hover:scale-[1.02]">
           <div className="flex justify-between items-start mb-2">
             <div className="h-6 w-6 bg-indigo-100 rounded"></div>
             <span className="text-[10px] font-bold text-indigo-500">{formData.duration}</span>
           </div>
           <h5 className="font-bold text-sm text-gray-900 line-clamp-1">{formData.title || 'Project Title Placeholder'}</h5>
           <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="px-2 py-0.5 bg-indigo-50 text-[9px] rounded font-bold text-indigo-600 uppercase">{formData.jobType}</span>
              <span className="px-2 py-0.5 bg-green-50 text-[9px] rounded font-bold text-green-700">₱{(formData.budget || 0).toLocaleString()}</span>
           </div>
           <div className="mt-3 flex gap-1">
             {formData.skills?.slice(0, 3).map(s => (
               <div key={s} className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Project Title</label>
        <input
          type="text"
          className="block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-4 text-lg font-medium transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-0"
          placeholder="e.g. UX/UI Designer for Mobile App"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <p className="mt-2 text-xs text-gray-400">Be descriptive but keep it under 50 characters for best engagement.</p>
      </div>

      <div>
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Project Scope</label>
        <textarea
          rows={6}
          className="block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-4 text-base transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-0"
          placeholder="What needs to be done? List the key deliverables and requirements..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Required Expertise</label>
        <div className="flex gap-2 p-1 bg-gray-50 border-2 border-gray-100 rounded-2xl focus-within:border-indigo-600 transition-all">
          <input
            type="text"
            className="block w-full bg-transparent px-4 py-2 focus:outline-none"
            placeholder="Search or add skills..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addSkill()}
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-sm transition-all"
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {formData.skills?.length === 0 && (
            <div className="text-[11px] text-gray-400 font-medium italic">Suggesting for you: 
              <button onClick={() => { setSkillInput("React"); addSkill(); }} className="ml-2 hover:text-indigo-600 underline">React</button>, 
              <button onClick={() => { setSkillInput("UI/UX"); addSkill(); }} className="ml-2 hover:text-indigo-600 underline">UI/UX</button>
            </div>
          )}
          {formData.skills?.map((skill) => (
            <span key={skill} className="inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-2 hover:text-red-500 transition-colors"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div>
          <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 text-indigo-600">Work Type</label>
          <div className="relative">
            <select
              className="appearance-none block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer"
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="One-time Project">One-time Project</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Duration</label>
          <div className="relative">
            <select
              className="appearance-none block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value as JobDuration })}
            >
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1-3 months">1-3 months</option>
              <option value="Ongoing">Ongoing</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Payment Structure</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, paymentMethod: "Flat-Rate" })}
            className={`p-5 rounded-2xl border-2 transition-all text-left ${
              formData.paymentMethod === "Flat-Rate"
                ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${formData.paymentMethod === "Flat-Rate" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <p className="font-black text-gray-900">Fixed Project</p>
            <p className="text-xs text-gray-500 mt-1">Pay a set price for the whole project.</p>
          </button>

          <button
            type="button"
            onClick={() => setFormData({ ...formData, paymentMethod: "Hourly" })}
            className={`p-5 rounded-2xl border-2 transition-all text-left ${
              formData.paymentMethod === "Hourly"
                ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${formData.paymentMethod === "Hourly" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="font-black text-gray-900">Hourly Rate</p>
            <p className="text-xs text-gray-500 mt-1">Pay for the time spent on the project.</p>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Total Budget (PHP)</label>
        <div className="relative">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">₱</span>
          <input
            type="number"
            className="block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 pl-10 pr-5 py-4 text-2xl font-black text-indigo-600 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-0"
            placeholder="0.00"
            value={formData.budget || ""}
            onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      {formData.paymentMethod === "Flat-Rate" && (
        <div className="pt-4 space-y-4">
          <div className="flex justify-between items-end mb-2">
            <div>
              <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">Project Milestones</label>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Break down your payments</p>
            </div>
            <span className="text-[10px] font-black px-2 py-1 bg-indigo-600 text-white rounded">ESCROW ENABLED</span>
          </div>

          <div className="space-y-3">
            {formData.milestones?.map((m, idx) => (
              <div key={m.id} className="group relative flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-50 shadow-sm transition-all hover:border-indigo-100">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{m.title}</p>
                    <p className="text-[10px] text-gray-400">{m.dueDate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">₱{m.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Ano ang gagawin sa milestone na ito?"
                className="rounded-xl border-2 border-white bg-white px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none transition-all"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              />
              <input
                type="date"
                className="rounded-xl border-2 border-white bg-white px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none transition-all"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
              />
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₱</span>
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full rounded-xl border-2 border-white bg-white pl-7 pr-4 py-2 text-sm focus:border-indigo-600 focus:outline-none transition-all font-bold"
                  value={newMilestone.amount || ""}
                  onChange={(e) => setNewMilestone({ ...newMilestone, amount: parseFloat(e.target.value) })}
                />
              </div>
              <button
                type="button"
                onClick={addMilestone}
                className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-sm transition-all shadow-lg shadow-gray-200"
              >
                Add Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <label className="block text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Application Deadline</label>
        <div className="relative">
          <input
            type="date"
            className="block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400 italic">We recommend at least 7 days to find the best talent.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-black text-gray-900 uppercase tracking-widest">Screening Questions</label>
          <span className="text-[10px] font-bold text-gray-400">{(formData.customQuestions?.length || 0)} / 3</span>
        </div>
        
        <div className="space-y-3 mb-4">
          {formData.customQuestions?.map((q, idx) => (
            <div key={q.id} className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 group">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
              <p className="flex-1 text-sm font-bold text-indigo-900">{q.question}</p>
              <button 
                onClick={() => setFormData({ ...formData, customQuestions: formData.customQuestions?.filter(item => item.id !== q.id) })}
                className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 p-1 bg-gray-50 border-2 border-gray-100 rounded-2xl focus-within:border-indigo-600 transition-all">
          <input
            type="text"
            className="block w-full bg-transparent px-4 py-2 focus:outline-none text-sm"
            placeholder="e.g. Have you worked on similar projects before?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            disabled={(formData.customQuestions?.length || 0) >= 3}
          />
          <button
            type="button"
            onClick={addQuestion}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-sm transition-all disabled:opacity-50"
            disabled={(formData.customQuestions?.length || 0) >= 3}
          >
            Add
          </button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <div className="p-6 bg-gray-900 rounded-3xl text-white shadow-2xl shadow-indigo-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Confirmation Summary</p>
              <h4 className="text-xl font-black">{formData.title || "Untitled Project"}</h4>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1">Total Budget</p>
              <p className="text-xl font-black text-green-400">₱{(formData.budget || 0).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-[11px] font-bold">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Job Type:</span>
              <span>{formData.jobType}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Duration:</span>
              <span>{formData.duration}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Deadline:</span>
              <span>{formData.deadline || "Not set"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Skills:</span>
              <span>{formData.skills?.length} Tags</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-[10px] text-gray-400">Ready for AI Matching. Your post will be seen by approximately <span className="text-white font-bold">45+ verified freelancers</span> matching your criteria.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Post your project</h2>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-1.5 w-12 rounded-full transition-all duration-500 ${
                      step >= s ? "bg-indigo-600" : "bg-gray-100"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm font-bold text-indigo-600">
              <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-indigo-100' : 'bg-gray-100 text-gray-400'}`}>1. Details</span>
              <span className="text-gray-300">→</span>
              <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-indigo-100' : 'bg-gray-100 text-gray-400'}`}>2. Budget</span>
              <span className="text-gray-300">→</span>
              <span className={`px-3 py-1 rounded-full ${step === 3 ? 'bg-indigo-100' : 'bg-gray-100 text-gray-400'}`}>3. Finalize</span>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="relative">
            {isAiAnalyzing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm font-bold text-indigo-600 animate-pulse uppercase tracking-widest">AI is analyzing your post...</p>
                </div>
              </div>
            )}
            
            <div className="min-h-[400px]">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
              <div>
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    Bumalik
                  </button>
                )}
              </div>
              
              <div className="flex gap-4">
                <button
                  type="button"
                  className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Save as Draft
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="group px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                  >
                    Patuloy na
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-10 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black font-black shadow-lg shadow-gray-200 transition-all active:scale-95"
                  >
                    I-PUBLISH NA 🚀
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-5 sticky top-8">
          {renderAiInsights()}
        </div>
      </div>
    </div>
  );
}
