"use client";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Battery, ShieldAlert, TrendingUp, Clock, CheckCircle2, AlertTriangle, Smile, Meh, Frown, Coffee, Brain, Timer, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { cn } from "../lib/utils";
export default function WellnessDashboard(param) {
    var wellness = param.wellness, revenuePerHour = param.revenuePerHour, teamWellness = param.teamWellness;
    var _useState = _sliced_to_array(useState(false), 2), showFocusMode = _useState[0], setShowFocusMode = _useState[1];
    var getWorkloadStatus = function getWorkloadStatus(workload, capacity) {
        var ratio = workload / capacity;
        if (ratio > 1.1) return "Overloaded";
        if (ratio < 0.6) return "Underutilized";
        return "Balanced";
    };
    var workloadStatus = getWorkloadStatus(wellness.currentWorkload, wellness.weeklyCapacity);
    var statusColors = {
        Overloaded: "text-rose-600 bg-rose-50 border-rose-100",
        Balanced: "text-emerald-600 bg-emerald-50 border-emerald-100",
        Underutilized: "text-blue-600 bg-blue-50 border-blue-100"
    };
    var energyIcons = {
        High: /*#__PURE__*/ React.createElement(Smile, {
            className: "w-6 h-6 text-emerald-500"
        }),
        Balanced: /*#__PURE__*/ React.createElement(Meh, {
            className: "w-6 h-6 text-blue-500"
        }),
        Low: /*#__PURE__*/ React.createElement(Frown, {
            className: "w-6 h-6 text-amber-500"
        }),
        Exhausted: /*#__PURE__*/ React.createElement(Battery, {
            className: "w-6 h-6 text-rose-500 animate-pulse"
        })
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-indigo-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-5 h-5 text-indigo-600"
    })), /*#__PURE__*/ React.createElement("span", {
        className: cn("text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider", statusColors[workloadStatus])
    }, workloadStatus)), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-500 text-xs font-bold uppercase tracking-widest"
    }, "Weekly Capacity"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end gap-2 mt-1"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-2xl font-black text-slate-900"
    }, wellness.currentWorkload, "h"), /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-400 font-medium mb-1"
    }, "/ ", wellness.weeklyCapacity, "h")), /*#__PURE__*/ React.createElement("div", {
        className: "w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            width: 0
        },
        animate: {
            width: "".concat(Math.min(wellness.currentWorkload / wellness.weeklyCapacity * 100, 100), "%")
        },
        className: cn("h-full rounded-full", workloadStatus === "Overloaded" ? "bg-rose-500" : "bg-indigo-600")
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-emerald-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-5 h-5 text-emerald-600"
    }))), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-500 text-xs font-bold uppercase tracking-widest"
    }, "Revenue/Hour"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end gap-1 mt-1"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-2xl font-black text-slate-900"
    }, "$", revenuePerHour), /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-400 font-medium mb-1 text-xs"
    }, "avg")), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 mt-3 font-medium flex items-center gap-1"
    }, /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-3 h-3 text-emerald-500"
    }), "Sustainable Growth Pattern")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-rose-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(ShieldAlert, {
        className: "w-5 h-5 text-rose-600"
    })), wellness.burnoutRiskScore > 70 && /*#__PURE__*/ React.createElement("span", {
        className: "animate-ping absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-400 opacity-75"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-500 text-xs font-bold uppercase tracking-widest"
    }, "Burnout Risk"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end gap-1 mt-1"
    }, /*#__PURE__*/ React.createElement("span", {
        className: cn("text-2xl font-black", wellness.burnoutRiskScore > 70 ? "text-rose-600" : "text-slate-900")
    }, wellness.burnoutRiskScore, "%")), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-1 mt-4"
    }, _to_consumable_array(Array(5)).map(function(_, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: cn("h-1 flex-1 rounded-full", i < wellness.burnoutRiskScore / 20 ? wellness.burnoutRiskScore > 70 ? "bg-rose-500" : "bg-indigo-500" : "bg-slate-100")
        });
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-amber-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-5 h-5 text-amber-600"
    })), energyIcons[wellness.energyRating]), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-500 text-xs font-bold uppercase tracking-widest"
    }, "Team Energy"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end gap-1 mt-1"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-2xl font-black text-slate-900"
    }, wellness.energyRating)), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 mt-3 font-medium"
    }, "Based on recent output & focus hours"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "md:col-span-2 bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black tracking-tight"
    }, "Focus Session"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-xs mt-1"
    }, "Enter deep work mode to maximize quality output.")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowFocusMode(true);
        },
        className: "bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
    }, /*#__PURE__*/ React.createElement(Brain, {
        className: "w-4 h-4"
    }), "Start Focus Mode")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 border border-white/10 p-4 rounded-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-2"
    }, /*#__PURE__*/ React.createElement(Timer, {
        className: "w-4 h-4 text-indigo-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold uppercase tracking-widest text-slate-400"
    }, "Today's Focus")), /*#__PURE__*/ React.createElement("div", {
        className: "text-xl font-black"
    }, wellness.focusHours, "h / 4h goal")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 border border-white/10 p-4 rounded-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-2"
    }, /*#__PURE__*/ React.createElement(Coffee, {
        className: "w-4 h-4 text-emerald-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold uppercase tracking-widest text-slate-400"
    }, "Rest Cycles")), /*#__PURE__*/ React.createElement("div", {
        className: "text-xl font-black"
    }, wellness.workToRestRatio.toFixed(1), ":1 Ratio")))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32 rounded-full"
    })), /*#__PURE__*/ React.createElement("div", {
        className: cn("rounded-2xl p-6 border transition-all", wellness.consecutiveHighLoadDays >= 3 ? "bg-amber-50 border-amber-200" : "bg-indigo-50 border-indigo-100")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: cn("p-2 rounded-lg", wellness.consecutiveHighLoadDays >= 3 ? "bg-amber-100" : "bg-indigo-100")
    }, /*#__PURE__*/ React.createElement(AlertTriangle, {
        className: cn("w-5 h-5", wellness.consecutiveHighLoadDays >= 3 ? "text-amber-600" : "text-indigo-600")
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "font-black text-slate-900 tracking-tight uppercase text-xs tracking-widest"
    }, "Pacing Intelligence")), wellness.consecutiveHighLoadDays >= 3 ? /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-700 font-medium leading-relaxed"
    }, "You've logged 8+ hours for ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-amber-600"
    }, wellness.consecutiveHighLoadDays, " consecutive days"), "."), /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-white/60 border border-amber-200 rounded-xl text-xs text-amber-800 font-semibold leading-snug"
    }, '"Schedule a 2-hour recovery block this Friday to prevent output degradation next week."'), /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-2.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors"
    }, "Schedule Recovery Block")) : /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-700 font-medium leading-relaxed"
    }, "Your current load is ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-emerald-600"
    }, "optimal"), ". Maintain this pace for consistent performance."), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "px-2 py-1 bg-white border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600"
    }, "IDEAL PACE"), /*#__PURE__*/ React.createElement("span", {
        className: "px-2 py-1 bg-white border border-indigo-100 rounded-md text-[10px] font-bold text-indigo-600"
    }, "BALANCED"))))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-indigo-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(ShieldAlert, {
        className: "w-5 h-5 text-indigo-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-black text-slate-900 tracking-tight text-sm uppercase tracking-widest"
    }, "Team Sustainability Layer"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-xs"
    }, "AI insights to protect your remote squad's long-term performance."))), /*#__PURE__*/ React.createElement("button", {
        className: "text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest hover:bg-indigo-100 transition-colors"
    }, "Team Health Report")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50 rounded-xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3"
    }, "Energy Balance"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex -space-x-2"
    }, _to_consumable_array(Array(4)).map(function(_, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
        }, /*#__PURE__*/ React.createElement("img", {
            src: "https://i.pravatar.cc/100?img=".concat(i + 10),
            alt: "member",
            className: "w-full h-full object-cover"
        }));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm font-bold text-slate-700"
    }, "+ ", (teamWellness === null || teamWellness === void 0 ? void 0 : teamWellness.energyBalance) || 84, "%")), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-500 mt-3 italic"
    }, '"Squad is maintaining a high-performance rhythm."')), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50 rounded-xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3"
    }, "Burnout Prevention"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-emerald-500"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-slate-700"
    }, "0 Overworked Members")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mt-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-indigo-500"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-slate-700"
    }, "Healthy Distribution"))), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50 rounded-xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3"
    }, "Chronic Overtime"), /*#__PURE__*/ React.createElement("div", {
        className: "text-xs font-bold text-emerald-600 flex items-center gap-1"
    }, /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-3.5 h-3.5"
    }), "No Patterns Detected"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-500 mt-2 leading-tight"
    }, "Teams with stable hours have 40% higher retention in 2026.")))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:col-span-1"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-emerald-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-5 h-5 text-emerald-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-black text-slate-900 tracking-tight text-sm uppercase tracking-widest"
    }, "Proof of Sustainability"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-xs"
    }, "Consistency without burnout"))), wellness.verifiedSustainable && /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-widest"
    }, "Verified")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end gap-3"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "text-3xl font-black text-slate-900"
    }, Math.round(wellness.sustainabilityIndex), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm text-slate-400 font-extrabold"
    }, "/100")), /*#__PURE__*/ React.createElement("div", {
        className: "text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1"
    }, "Sustainability Index")), wellness.lastRecoveryBlock && /*#__PURE__*/ React.createElement("div", {
        className: "ml-auto text-right"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest"
    }, "Last Recovery"), /*#__PURE__*/ React.createElement("div", {
        className: "text-xs font-semibold text-slate-700"
    }, new Date(wellness.lastRecoveryBlock).toLocaleDateString())))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:col-span-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-indigo-50 rounded-lg"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-5 h-5 text-indigo-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-black text-slate-900 tracking-tight text-sm uppercase tracking-widest"
    }, "Financial Velocity"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-xs"
    }, "Revenue per focus hour"))), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm font-black text-slate-900"
    }, "$", Math.round(wellness.energyEfficiency), " / hr")), /*#__PURE__*/ React.createElement("div", {
        className: "h-28"
    }, /*#__PURE__*/ React.createElement(ResponsiveContainer, {
        width: "100%",
        height: "100%"
    }, /*#__PURE__*/ React.createElement(AreaChart, {
        data: [
            {
                v: wellness.energyEfficiency * 0.8
            },
            {
                v: wellness.energyEfficiency * 0.9
            },
            {
                v: wellness.energyEfficiency * 1.0
            },
            {
                v: wellness.energyEfficiency * 0.95
            },
            {
                v: wellness.energyEfficiency * 1.1
            }
        ]
    }, /*#__PURE__*/ React.createElement(Area, {
        type: "monotone",
        dataKey: "v",
        stroke: "#4f46e5",
        fill: "#4f46e5",
        fillOpacity: 0.15,
        strokeWidth: 2
    })))))));
}
