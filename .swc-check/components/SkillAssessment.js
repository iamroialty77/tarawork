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
import { motion, AnimatePresence } from "framer-motion";
import AIAgent from "./AIAgent";
import { ShieldCheck, TrendingUp, Lightbulb, ExternalLink, Target, ChevronRight, Sparkles, CheckCircle2, X, Zap, Trophy, Verified } from "lucide-react";
export default function SkillAssessment(param) {
    var verifiedSkills = param.verifiedSkills, aiInsights = param.aiInsights;
    var _useState = _sliced_to_array(useState(false), 2), showBadge = _useState[0], setShowBadge = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isAIAgentOpen = _useState1[0], setIsAIAgentOpen = _useState1[1];
    var _useState2 = _sliced_to_array(useState("audit"), 2), aiAgentMode = _useState2[0], setAiAgentMode = _useState2[1];
    var startVetting = function startVetting() {
        setAiAgentMode("vetting");
        setIsAIAgentOpen(true);
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6 mt-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-6"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-slate-50 rounded-lg border border-slate-100"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-4 h-4 text-slate-600"
    })), "AI Skill-Mapping"), verifiedSkills.length > 0 ? /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowBadge(true);
        },
        className: "group flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
    }, /*#__PURE__*/ React.createElement(Verified, {
        className: "w-3.5 h-3.5"
    }), "Verified Badge") : /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest"
    }, "Deep Analysis Live")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-5"
    }, verifiedSkills.length > 0 ? verifiedSkills.map(function(skill) {
        return /*#__PURE__*/ React.createElement("div", {
            key: skill.name,
            className: "group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between text-sm mb-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "font-bold text-slate-700 group-hover:text-indigo-600 transition-colors"
        }, skill.name), /*#__PURE__*/ React.createElement("span", {
            className: "text-slate-500 font-bold bg-slate-50 px-2 rounded-md"
        }, skill.score, "%")), /*#__PURE__*/ React.createElement("div", {
            className: "w-full bg-slate-100 rounded-full h-2 overflow-hidden"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out",
            style: {
                width: "".concat(skill.score, "%")
            }
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center mt-1.5"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 font-medium italic"
        }, "Last Vetted: ", new Date(skill.lastAssessment).toLocaleDateString()), /*#__PURE__*/ React.createElement(TrendingUp, {
            className: "w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"
        })));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-8 border-2 border-dashed border-slate-100 rounded-xl relative overflow-hidden group"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400 font-medium"
    }, "No technical data yet."), /*#__PURE__*/ React.createElement("button", {
        onClick: startVetting,
        className: "mt-2 text-[10px] text-indigo-600 font-bold hover:text-indigo-700 uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-all active:scale-95"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-3 h-3 fill-current"
    }), "Start AI Vetting"))), /*#__PURE__*/ React.createElement("button", {
        onClick: startVetting,
        className: "w-full mt-6 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest flex items-center justify-center gap-2"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-3.5 h-3.5 text-indigo-400"
    }), "Retake Assessments")), /*#__PURE__*/ React.createElement(AnimatePresence, null, showBadge && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            scale: 0.8,
            opacity: 0,
            rotateY: 90
        },
        animate: {
            scale: 1,
            opacity: 1,
            rotateY: 0
        },
        exit: {
            scale: 0.8,
            opacity: 0,
            rotateY: -90
        },
        transition: {
            type: "spring",
            damping: 15
        },
        className: "relative w-full max-w-md bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(79,70,229,0.3)] overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        animate: {
            background: [
                "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)"
            ]
        },
        transition: {
            duration: 5,
            repeat: Infinity,
            ease: "linear"
        },
        className: "absolute inset-0 pointer-events-none"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "relative p-10 text-center"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowBadge(false);
        },
        className: "absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
    }, /*#__PURE__*/ React.createElement(X, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "mb-8 relative inline-block"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        animate: {
            rotate: 360
        },
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
        },
        className: "absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/30 scale-125"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] rotate-12 relative z-10"
    }, /*#__PURE__*/ React.createElement(Verified, {
        className: "w-12 h-12 text-white -rotate-12"
    })), /*#__PURE__*/ React.createElement(motion.div, {
        animate: {
            scale: [
                1,
                1.2,
                1
            ],
            opacity: [
                0.5,
                1,
                0.5
            ]
        },
        transition: {
            duration: 2,
            repeat: Infinity
        },
        className: "absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center z-20"
    }, /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-4 h-4 text-white"
    }))), /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl font-black text-white mb-2 tracking-tighter uppercase italic"
    }, "Verified ", /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400"
    }, "Badge")), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-8"
    }, "Official Tara Protocol v4.0"), /*#__PURE__*/ React.createElement("div", {
        className: "bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/5 mb-8 text-left space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center border-b border-white/5 pb-3"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] text-slate-500 font-bold uppercase tracking-widest"
    }, "Verification ID"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[11px] text-indigo-300 font-mono font-bold uppercase tracking-widest"
    }, "TR-9982X-AI")), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center border-b border-white/5 pb-3"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] text-slate-500 font-bold uppercase tracking-widest"
    }, "Skill Density"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[11px] text-white font-bold uppercase tracking-widest italic"
    }, "Elite Tier"), /*#__PURE__*/ React.createElement(Trophy, {
        className: "w-3 h-3 text-yellow-400"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] text-slate-500 font-bold uppercase tracking-widest"
    }, "AI Confidence"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[11px] text-emerald-400 font-bold uppercase tracking-widest"
    }, "98.4% Accuracy"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-4 bg-white text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
    }, "Share on LinkedIn"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowBadge(false);
        },
        className: "w-full py-4 bg-white/5 text-white/60 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
    }, "Close Dashboard")), /*#__PURE__*/ React.createElement("div", {
        className: "mt-8 flex items-center justify-center gap-4 grayscale opacity-40"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "h-0.5 flex-1 bg-gradient-to-r from-transparent to-white/20"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black text-white uppercase tracking-[0.5em]"
    }, "TARA NEURAL NETWORK"), /*#__PURE__*/ React.createElement("div", {
        className: "h-0.5 flex-1 bg-gradient-to-l from-transparent to-white/20"
    })))))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10"
    }, /*#__PURE__*/ React.createElement(Target, {
        className: "w-4 h-4 text-indigo-300"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-[10px] uppercase tracking-[0.2em] text-slate-300"
    }, "Automated Gap Analysis")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, aiInsights && aiInsights.gapAnalysis && aiInsights.gapAnalysis.length > 0 ? aiInsights.gapAnalysis.map(function(gap, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-bold text-indigo-300 mb-1 uppercase tracking-widest"
        }, gap.topic), /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] text-slate-300 leading-relaxed mb-3 font-medium"
        }, gap.suggestion), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-1"
        }, gap.missingSkills.map(function(s) {
            return /*#__PURE__*/ React.createElement("span", {
                key: s,
                className: "text-[9px] px-2 py-0.5 bg-indigo-500/20 rounded-md font-bold uppercase tracking-wider"
            }, s);
        })), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return gap.learningResourceUrl ? window.open(gap.learningResourceUrl, '_blank') : alert("Opening suggested learning resource...");
            },
            className: "p-1.5 bg-white/10 rounded-lg group-hover:bg-indigo-600 transition-all"
        }, /*#__PURE__*/ React.createElement(ExternalLink, {
            className: "w-3 h-3"
        }))));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-white/5 rounded-xl border border-white/10"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-bold text-indigo-300 mb-1 tracking-[0.2em] uppercase"
    }, "Ready for Analysis"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-400 leading-relaxed font-medium"
    }, "Complete your profile and start vetting to unlock automated skill gap insights.")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setAiAgentMode("audit");
            setIsAIAgentOpen(true);
        },
        className: "w-full py-2.5 bg-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 uppercase tracking-widest"
    }, /*#__PURE__*/ React.createElement(Lightbulb, {
        className: "w-3 h-3"
    }), "Request AI Profile Audit", /*#__PURE__*/ React.createElement(ChevronRight, {
        className: "w-3 h-3"
    }))))), /*#__PURE__*/ React.createElement(Sparkles, {
        className: "absolute -right-2 -bottom-2 w-24 h-24 text-white/5 pointer-events-none"
    })), /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: isAIAgentOpen,
        onClose: function onClose() {
            return setIsAIAgentOpen(false);
        },
        mode: aiAgentMode,
        targetData: {
            verifiedSkills: verifiedSkills
        }
    }));
}
