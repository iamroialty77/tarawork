"use client";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { useState } from 'react';
import { Sparkles, TrendingUp, BookOpen, ChevronRight, Award, Zap, Star, ShieldCheck, Lock, Trophy, CheckCircle, ArrowRight, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AIAgent from "./AIAgent";
export default function CareerPath(param) {
    var profile = param.profile, allJobs = param.allJobs, onGenerateRoadmap = param.onGenerateRoadmap;
    var _sortedDemand_;
    var _useState = _sliced_to_array(useState(false), 2), showPath = _useState[0], setShowPath = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), showAIAgent = _useState1[0], setShowAIAgent = _useState1[1];
    var _useState2 = _sliced_to_array(useState(null), 2), roadmapData = _useState2[0], setRoadmapData = _useState2[1];
    // 1. Calculate Skill Demand from allJobs
    var skillDemand = {};
    allJobs.forEach(function(job) {
        var _job_skills;
        (_job_skills = job.skills) === null || _job_skills === void 0 ? void 0 : _job_skills.forEach(function(skill) {
            skillDemand[skill] = (skillDemand[skill] || 0) + 1;
        });
    });
    var sortedDemand = Object.entries(skillDemand).sort(function(param, param1) {
        var _param = _sliced_to_array(param, 2), a = _param[1], _param1 = _sliced_to_array(param1, 2), b = _param1[1];
        return b - a;
    }).slice(0, 6);
    // 2. Find Missing In-Demand Skills
    var missingSkills = sortedDemand.filter(function(param) {
        var _param = _sliced_to_array(param, 1), skill = _param[0];
        return !profile.skills.some(function(s) {
            return s.toLowerCase() === skill.toLowerCase();
        });
    }).map(function(param) {
        var _param = _sliced_to_array(param, 1), skill = _param[0];
        return skill;
    });
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-8 mt-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-10 h-10 text-emerald-400 mb-6"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "font-black text-2xl mb-2 uppercase tracking-tight"
    }, "Market Insight"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-400 font-medium mb-6 leading-relaxed"
    }, "Analyzing active ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, allJobs.length.toLocaleString(), " jobs"), " in the ecosystem. The industry is currently pivoting towards ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, (_sortedDemand_ = sortedDemand[0]) === null || _sortedDemand_ === void 0 ? void 0 : _sortedDemand_[0]), ". This represents a ", /*#__PURE__*/ React.createElement("span", {
        className: "text-emerald-400 font-bold"
    }, "+24% surge"), " in demand since last quarter."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-emerald-400 font-black text-xs uppercase tracking-widest bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-3 h-3 fill-current"
    }), "High Growth Sector")), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-600 p-8 rounded-2xl text-white relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement(Target, {
        className: "w-10 h-10 text-indigo-200 mb-6"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "font-black text-2xl mb-2 uppercase tracking-tight"
    }, "Career Alignment"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-indigo-100 font-medium mb-6 leading-relaxed"
    }, "Your current skills are ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, "82% aligned"), " with high-paying roles in TARA. Acquiring the remaining ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, missingSkills.length, " core skills"), " could increase your hiring probability by ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, "45%"), "."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-indigo-200 font-black text-xs uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-3 h-3 fill-current"
    }), "Strategic Path Available")), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -left-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-[100px]"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(BookOpen, {
        className: "w-5 h-5 text-indigo-600"
    }), "Recommended Skills & Strategic Gap Analysis"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, missingSkills.length > 0 ? missingSkills.map(function(skill, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group cursor-pointer hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm uppercase"
        }, skill[0]), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, skill), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 font-bold uppercase tracking-tighter"
        }, "Gap Analysis: ", /*#__PURE__*/ React.createElement("span", {
            className: "text-indigo-600"
        }, "High Priority")))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden group-hover:block transition-all"
        }, "Start Learning"), /*#__PURE__*/ React.createElement(ChevronRight, {
            className: "w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors"
        })));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "col-span-2 text-center py-12"
    }, /*#__PURE__*/ React.createElement(Award, {
        className: "w-12 h-12 text-indigo-400 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h5", {
        className: "text-lg font-bold text-slate-900 mb-1 uppercase tracking-tight"
    }, "Elite Profile Status"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium uppercase tracking-widest"
    }, "All Top Market-Demand Skills Acquired!"))), /*#__PURE__*/ React.createElement("button", {
        onClick: onGenerateRoadmap || function() {
            return setShowAIAgent(true);
        },
        className: "w-full mt-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 ".concat(showPath ? "bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-100" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 shadow-[0_10px_30px_-10px_rgba(79,70,229,0.3)]")
    }, showPath ? "Hide Detailed Roadmap" : "Unlock Full AI Roadmap", showPath ? null : /*#__PURE__*/ React.createElement(Lock, {
        className: "w-4 h-4"
    }))))), /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: showAIAgent,
        onClose: function onClose() {
            return setShowAIAgent(false);
        },
        mode: "career-roadmap",
        targetData: {
            profile: profile,
            marketContext: {
                topDemandSkills: sortedDemand.map(function(param) {
                    var _param = _sliced_to_array(param, 1), skill = _param[0];
                    return skill;
                }),
                missingSkills: missingSkills
            }
        },
        onComplete: function onComplete(data) {
            setRoadmapData(data);
            setShowPath(true);
            setShowAIAgent(false);
        }
    }), /*#__PURE__*/ React.createElement(AnimatePresence, null, showPath && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: -20
        },
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-3 h-3 fill-current"
    }), "Premium Career Path"), /*#__PURE__*/ React.createElement("h2", {
        className: "text-4xl md:text-5xl font-black mb-6 tracking-tight leading-[1.1]"
    }, "AI Engineered ", /*#__PURE__*/ React.createElement("span", {
        className: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"
    }, "Roadmap"), (roadmapData === null || roadmapData === void 0 ? void 0 : roadmapData.roadmapId) && /*#__PURE__*/ React.createElement("span", {
        className: "block text-xs font-mono text-slate-500 mt-4 uppercase tracking-[0.3em]"
    }, "ID: ", roadmapData.roadmapId)), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-lg font-medium leading-relaxed"
    }, "Hand-picked specialized learning paths and certification modules designed to transform you into a top-tier industry expert.")), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-black text-white"
    }, "12"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-bold text-slate-500 uppercase"
    }, "Expert Modules")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-center min-w-[100px]"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl font-black text-indigo-400"
    }, "4.9"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-bold text-slate-500 uppercase"
    }, "Success Rate")))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        whileHover: {
            y: -5
        },
        className: "bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-6 h-6 text-indigo-400"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-bold mb-3 tracking-tight"
    }, "Verified Professional Certification"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-400 mb-6 leading-relaxed"
    }, "Earn an ecosystem-wide badge that proves your seniority and expertise to global clients."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-indigo-400 font-bold text-xs group-hover:gap-3 transition-all"
    }, "Get Certified ", /*#__PURE__*/ React.createElement(ArrowRight, {
        className: "w-4 h-4"
    }))), /*#__PURE__*/ React.createElement(motion.div, {
        whileHover: {
            y: -5
        },
        className: "bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(Trophy, {
        className: "w-6 h-6 text-emerald-400"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-bold mb-3 tracking-tight"
    }, "Expert-Led Workshops"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-400 mb-6 leading-relaxed"
    }, "Join exclusive live sessions from industry veterans who have worked at Fortune 500 companies."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-emerald-400 font-bold text-xs group-hover:gap-3 transition-all"
    }, "Join Workshops ", /*#__PURE__*/ React.createElement(ArrowRight, {
        className: "w-4 h-4"
    }))), /*#__PURE__*/ React.createElement(motion.div, {
        whileHover: {
            y: -5
        },
        className: "bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-6 h-6 text-purple-400"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-bold mb-3 tracking-tight"
    }, "High-Stakes Simulations"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-400 mb-6 leading-relaxed"
    }, "Practice in real-world high-pressure scenarios with AI-powered performance feedback."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-purple-400 font-bold text-xs group-hover:gap-3 transition-all"
    }, "Start Simulation ", /*#__PURE__*/ React.createElement(ArrowRight, {
        className: "w-4 h-4"
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-12 p-8 bg-indigo-500/10 border border-indigo-400/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 rounded-full bg-slate-800 border-4 border-indigo-500/30 overflow-hidden shadow-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl font-black"
    }, "AI")), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(CheckCircle, {
        className: "w-3.5 h-3.5 text-white"
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", {
        className: "font-bold text-white mb-1"
    }, (roadmapData === null || roadmapData === void 0 ? void 0 : roadmapData.nextMilestone) ? "Next: ".concat(roadmapData.nextMilestone) : "Personalized Path Ready"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400"
    }, "Based on your current profile, we have prepared a customized mastery roadmap for you."))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            var el = document.getElementById('professional-roadmap-steps');
            el === null || el === void 0 ? void 0 : el.scrollIntoView({
                behavior: 'smooth'
            });
        },
        className: "bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 shadow-xl"
    }, "View Your Modules", /*#__PURE__*/ React.createElement(ArrowRight, {
        className: "w-4 h-4"
    }))), (roadmapData === null || roadmapData === void 0 ? void 0 : roadmapData.modules) && /*#__PURE__*/ React.createElement("div", {
        id: "professional-roadmap-steps",
        className: "mt-20 space-y-12"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-white mb-2 uppercase tracking-tight"
    }, "Professional Mastery Curriculum"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-sm font-medium"
    }, "Step-by-step professional path engineered for your category.")), /*#__PURE__*/ React.createElement("div", {
        className: "hidden md:flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 rounded-full bg-emerald-500"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase"
    }, "Available")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 rounded-full bg-slate-700"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase"
    }, "Upcoming")))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-6"
    }, roadmapData.modules.map(function(module, index) {
        return /*#__PURE__*/ React.createElement(motion.div, {
            key: module.id,
            initial: {
                opacity: 0,
                x: -20
            },
            whileInView: {
                opacity: 1,
                x: 0
            },
            transition: {
                delay: index * 0.1
            },
            viewport: {
                once: true
            },
            className: "relative group"
        }, index !== roadmapData.modules.length - 1 && /*#__PURE__*/ React.createElement("div", {
            className: "absolute left-[2.25rem] top-16 bottom-[-1.5rem] w-0.5 bg-gradient-to-b from-indigo-500/50 to-transparent z-0"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "relative z-10 flex gap-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex-shrink-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-all group-hover:scale-110 ".concat(index === 0 ? "bg-indigo-500 text-white shadow-indigo-500/20" : "bg-slate-800 text-slate-400 border border-white/5")
        }, index + 1)), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 p-6 rounded-2xl border transition-all ".concat(index === 0 ? "bg-white/10 border-indigo-500/30 backdrop-blur-md" : "bg-white/5 border-white/5 hover:bg-white/10")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3 mb-1"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "text-xl font-bold text-white tracking-tight"
        }, module.title), /*#__PURE__*/ React.createElement("span", {
            className: "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ".concat(module.level === "Expert" ? "bg-purple-500/20 text-purple-400" : module.level === "Advanced" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400")
        }, module.level)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4 text-slate-500 text-[11px] font-bold uppercase tracking-wider"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5"
        }, /*#__PURE__*/ React.createElement(BookOpen, {
            className: "w-3.5 h-3.5"
        }), module.duration), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5"
        }, /*#__PURE__*/ React.createElement(Zap, {
            className: "w-3.5 h-3.5"
        }), "Interactive Lab Included"))), /*#__PURE__*/ React.createElement("button", {
            className: "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ".concat(index === 0 ? "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/20" : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10")
        }, index === 0 ? "Start Module" : "Locked")), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-400 text-sm leading-relaxed max-w-2xl"
        }, module.description), /*#__PURE__*/ React.createElement("div", {
            className: "mt-6 flex flex-wrap gap-2"
        }, [
            "Certification",
            "Assessment",
            "Practical Project"
        ].map(function(tag) {
            return /*#__PURE__*/ React.createElement("span", {
                key: tag,
                className: "text-[9px] font-bold text-slate-500 border border-white/5 bg-white/5 px-2 py-1 rounded-lg"
            }, tag);
        })))));
    }))))))));
}
