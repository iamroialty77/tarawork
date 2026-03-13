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
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Brain, TrendingUp, Target, Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
export default function SkillsRadar(param) {
    var profile = param.profile, onGenerateRoadmap = param.onGenerateRoadmap;
    var _data_, _data_1;
    var _useState = _sliced_to_array(useState(true), 2), isAnalyzing = _useState[0], setIsAnalyzing = _useState[1];
    var _useState1 = _sliced_to_array(useState([]), 2), data = _useState1[0], setData = _useState1[1];
    useEffect(function() {
        // Simulate AI deep-scan of market data
        var timer = setTimeout(function() {
            var topSkills = profile.skills.length > 0 ? profile.skills.slice(0, 5) : [
                'Technical',
                'Communication',
                'Execution',
                'Planning',
                'Research'
            ];
            var chartData = topSkills.map(function(skill) {
                var _profile_verifiedSkills_find, _profile_verifiedSkills;
                // Mocking user skill level (0-100) vs Market demand (0-100)
                // In a real app, this would come from a backend analyzing current job postings
                var userLevel = ((_profile_verifiedSkills = profile.verifiedSkills) === null || _profile_verifiedSkills === void 0 ? void 0 : (_profile_verifiedSkills_find = _profile_verifiedSkills.find(function(vs) {
                    return vs.name.toLowerCase() === skill.toLowerCase();
                })) === null || _profile_verifiedSkills_find === void 0 ? void 0 : _profile_verifiedSkills_find.score) || Math.floor(Math.random() * 40) + 50; // 50-90 range if not verified
                var marketDemand = Math.floor(Math.random() * 30) + 65; // 65-95 range
                return {
                    subject: skill,
                    User: userLevel,
                    Market: marketDemand,
                    fullMark: 100
                };
            });
            setData(chartData);
            setIsAnalyzing(false);
        }, 1500);
        return function() {
            return clearTimeout(timer);
        };
    }, [
        profile
    ]);
    if (isAnalyzing) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "bg-slate-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] border border-white/5 shadow-2xl relative overflow-hidden"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"
        }), /*#__PURE__*/ React.createElement(Loader2, {
            className: "w-10 h-10 text-indigo-400 animate-spin mb-4"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-2 text-center relative z-10"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-indigo-100 font-bold text-sm tracking-widest uppercase"
        }, "AI Neural Mapping"), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-400 text-xs italic"
        }, "Syncing your profile with real-time market signals...")));
    }
    return /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-700"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-8 relative z-10"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-white font-bold flex items-center gap-2 tracking-tight"
    }, /*#__PURE__*/ React.createElement(Brain, {
        className: "w-5 h-5 text-indigo-400"
    }), "Skills Radar"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1"
    }, "AI vs. Market Demand Analysis")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-bold text-slate-300"
    }, "YOU")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-slate-500"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-bold text-slate-300"
    }, "MARKET")))), /*#__PURE__*/ React.createElement("div", {
        className: "h-[260px] w-full mb-6"
    }, /*#__PURE__*/ React.createElement(ResponsiveContainer, {
        width: "100%",
        height: "100%"
    }, /*#__PURE__*/ React.createElement(RadarChart, {
        cx: "50%",
        cy: "50%",
        outerRadius: "70%",
        data: data
    }, /*#__PURE__*/ React.createElement(PolarGrid, {
        stroke: "#334155"
    }), /*#__PURE__*/ React.createElement(PolarAngleAxis, {
        dataKey: "subject",
        tick: {
            fill: '#94a3b8',
            fontSize: 10,
            fontWeight: 700
        }
    }), /*#__PURE__*/ React.createElement(Tooltip, {
        contentStyle: {
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold'
        },
        itemStyle: {
            color: '#f1f5f9'
        }
    }), /*#__PURE__*/ React.createElement(Radar, {
        name: "Market Demand",
        dataKey: "Market",
        stroke: "#64748b",
        fill: "#64748b",
        fillOpacity: 0.1
    }), /*#__PURE__*/ React.createElement(Radar, {
        name: "Your Skill",
        dataKey: "User",
        stroke: "#818cf8",
        fill: "#818cf8",
        fillOpacity: 0.4
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-4 relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-1.5"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-3.5 h-3.5 text-emerald-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-300 uppercase tracking-tighter"
    }, "Gap Analysis")), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-400 font-medium leading-relaxed"
    }, "High demand for ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, (_data_ = data[0]) === null || _data_ === void 0 ? void 0 : _data_.subject), ". Focus on upskilling here to increase market value.")), /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-1.5"
    }, /*#__PURE__*/ React.createElement(Target, {
        className: "w-3.5 h-3.5 text-indigo-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-300 uppercase tracking-tighter"
    }, "Elite Match")), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-400 font-medium leading-relaxed"
    }, "Your ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, (_data_1 = data[2]) === null || _data_1 === void 0 ? void 0 : _data_1.subject), " score exceeds market average by 12%. You are in top 5%."))), /*#__PURE__*/ React.createElement("button", {
        onClick: onGenerateRoadmap,
        className: "w-full mt-6 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl flex items-center justify-center gap-2 group/btn transition-all active:scale-[0.98]"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-3.5 h-3.5 text-indigo-400 group-hover/btn:rotate-12 transition-transform"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[11px] font-bold text-indigo-200"
    }, "Generate Full AI Career Roadmap")));
}
