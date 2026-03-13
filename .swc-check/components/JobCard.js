"use client";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
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
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
import { motion } from "framer-motion";
import { Clock, MapPin, Briefcase, DollarSign, Heart, MoreHorizontal, Share2, ShieldCheck, TrendingUp, ExternalLink, Sparkles, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, formatRelativeTime } from "../lib/utils";
import Link from "next/link";
import { getJobSharePath, getJobShareUrl } from "../lib/jobShare";
export default function JobCard(param) {
    var job = param.job, _param_index = param.index, index = _param_index === void 0 ? 0 : _param_index, matchScore = param.matchScore, _param_matchedSkills = param.matchedSkills, matchedSkills = _param_matchedSkills === void 0 ? [] : _param_matchedSkills, _param_missingSkills = param.missingSkills, missingSkills = _param_missingSkills === void 0 ? [] : _param_missingSkills, onApply = param.onApply, applicationStatus = param.applicationStatus, sustainabilityMatch = param.sustainabilityMatch, energyRequirement = param.energyRequirement, onViewSmartMatch = param.onViewSmartMatch;
    var isApplied = !!applicationStatus;
    var _useState = _sliced_to_array(useState(false), 2), isSaved = _useState[0], setIsSaved = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), showMatchDetails = _useState1[0], setShowMatchDetails = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isApplyingLocal = _useState2[0], setIsApplyingLocal = _useState2[1];
    var _useState3 = _sliced_to_array(useState(false), 2), showActionsMenu = _useState3[0], setShowActionsMenu = _useState3[1];
    var _useState4 = _sliced_to_array(useState("idle"), 2), shareStatus = _useState4[0], setShareStatus = _useState4[1];
    var actionsMenuRef = useRef(null);
    var sharePath = getJobSharePath(job);
    var shareUrl = getJobShareUrl(job);
    useEffect(function() {
        if (!showActionsMenu) return;
        var handleOutsideClick = function handleOutsideClick(event) {
            if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
                setShowActionsMenu(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return function() {
            return document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [
        showActionsMenu
    ]);
    var handleShareLink = function handleShareLink() {
        return _async_to_generator(function() {
            var unused;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            3,
                            4
                        ]);
                        return [
                            4,
                            navigator.clipboard.writeText(shareUrl)
                        ];
                    case 1:
                        _state.sent();
                        setShareStatus("copied");
                        return [
                            3,
                            4
                        ];
                    case 2:
                        unused = _state.sent();
                        setShareStatus("failed");
                        return [
                            3,
                            4
                        ];
                    case 3:
                        setShowActionsMenu(false);
                        setTimeout(function() {
                            return setShareStatus("idle");
                        }, 2500);
                        return [
                            7
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            duration: 0.4,
            delay: index * 0.1
        },
        whileHover: {
            y: -4
        },
        className: "group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "h-1 w-full bg-slate-100 group-hover:bg-indigo-500 transition-colors duration-300"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 transition-colors"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-bold text-slate-400 group-hover:text-indigo-600 transition-colors"
    }, ((job === null || job === void 0 ? void 0 : job.company) || "J").charAt(0))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-1"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 tracking-tight"
    }, job.title), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group/cat"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold uppercase tracking-widest"
    }, job.category), energyRequirement && /*#__PURE__*/ React.createElement("span", {
        className: "ml-1 text-[9px] font-bold bg-white text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-widest",
        title: "Energy requirement"
    }, energyRequirement), /*#__PURE__*/ React.createElement(Link, {
        href: job.employer_id ? "/messages?with=".concat(job.employer_id) : "/messages",
        className: "text-gray-400 hover:text-indigo-600 transition-colors",
        title: "Message ".concat(job.company || "Employer", " about ").concat(job.category, " project")
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: "w-3 h-3"
    }))), matchScore !== undefined && matchScore > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "relative flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return onViewSmartMatch === null || onViewSmartMatch === void 0 ? void 0 : onViewSmartMatch(job);
        },
        onMouseEnter: function onMouseEnter() {
            return setShowMatchDetails(true);
        },
        onMouseLeave: function onMouseLeave() {
            return setShowMatchDetails(false);
        },
        className: cn("flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest transition-all group/match", matchScore >= 80 ? "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm shadow-indigo-100 hover:bg-indigo-600 hover:text-white" : matchScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-600 hover:text-white" : "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-600 hover:text-white"),
        title: "Click for AI Smart Match Scan"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-3 h-3 mr-1 group-hover/match:animate-spin"
    }), matchScore, "% Match"), typeof sustainabilityMatch === 'number' && /*#__PURE__*/ React.createElement("span", {
        className: cn("flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-widest", sustainabilityMatch >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : sustainabilityMatch >= 60 ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-700 border-slate-100"),
        title: "Energy & sustainability compatibility"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-3 h-3 mr-1"
    }), sustainabilityMatch, "% Sustainable"), showMatchDetails && /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-full left-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-xl z-20 p-4 animate-in fade-in slide-in-from-top-1 duration-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-xs font-bold text-slate-900 uppercase tracking-wider"
    }, "Match Insights"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded"
    }, matchScore, "%")), matchedSkills.length > 0 && /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"
    }), "Matched Skills"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-1"
    }, matchedSkills.map(function(skill) {
        return /*#__PURE__*/ React.createElement("span", {
            key: skill,
            className: "text-[9px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100"
        }, skill);
    }))), missingSkills.length > 0 && /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "w-1.5 h-1.5 rounded-full bg-slate-300 mr-1.5"
    }), "Missing Skills"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-1"
    }, missingSkills.map(function(skill) {
        return /*#__PURE__*/ React.createElement("span", {
            key: skill,
            className: "text-[9px] font-medium bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100"
        }, skill);
    }))), /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] text-slate-400 font-medium pt-2 border-t border-slate-100 italic"
    }, "Tip: Upskill in missing areas to improve your match score.")))), job.budget && job.budget > 4000 && /*#__PURE__*/ React.createElement("span", {
        className: "flex items-center text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-3 h-3 mr-1"
    }), "High Budget")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-xs text-slate-500 font-medium"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "hover:text-slate-900 transition-colors cursor-pointer"
    }, job.company || "Employer"), /*#__PURE__*/ React.createElement("span", {
        className: "w-1 h-1 rounded-full bg-slate-300"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "flex items-center gap-1"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-3.5 h-3.5 text-blue-600"
    }), "Verified Partner")))), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-1 relative"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsSaved(!isSaved);
        },
        className: cn("p-2 rounded-lg transition-all duration-200 cursor-pointer", isSaved ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600")
    }, /*#__PURE__*/ React.createElement(Heart, {
        className: cn("w-5 h-5", isSaved && "fill-current")
    })), /*#__PURE__*/ React.createElement("div", {
        className: "relative",
        ref: actionsMenuRef
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowActionsMenu(function(prev) {
                return !prev;
            });
        },
        className: "p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all duration-200 cursor-pointer",
        "aria-label": "More actions for ".concat(job.title),
        "aria-expanded": showActionsMenu
    }, /*#__PURE__*/ React.createElement(MoreHorizontal, {
        className: "w-5 h-5"
    })), showActionsMenu && /*#__PURE__*/ React.createElement("div", {
        className: "absolute right-0 top-full mt-2 w-44 rounded-xl bg-white border border-slate-200 shadow-xl z-30 p-1.5"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: handleShareLink,
        className: "w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
    }, /*#__PURE__*/ React.createElement(Share2, {
        className: "w-3.5 h-3.5 text-indigo-600"
    }), "Share Link"), /*#__PURE__*/ React.createElement(Link, {
        href: sharePath,
        target: "_blank",
        className: "w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
    }, /*#__PURE__*/ React.createElement(ExternalLink, {
        className: "w-3.5 h-3.5 text-slate-500"
    }), "Open Public Post"))))), shareStatus === "copied" && /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-semibold text-emerald-600 mb-4"
    }, "Share link copied."), shareStatus === "failed" && /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-semibold text-amber-600 mb-4"
    }, "Unable to copy. Try again."), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-y-2 gap-x-4 mb-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-3.5 h-3.5 text-emerald-600"
    }), job.rate), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-3.5 h-3.5 text-slate-500"
    }), job.duration), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: "w-3.5 h-3.5 text-slate-500"
    }), job.jobType || "Contract"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
    }, /*#__PURE__*/ React.createElement(MapPin, {
        className: "w-3.5 h-3.5 text-slate-500"
    }), "Remote")), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 font-medium"
    }, job.description), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2 mb-6"
    }, job.skills.slice(0, 4).map(function(skill) {
        return /*#__PURE__*/ React.createElement("span", {
            key: skill,
            className: "px-3 py-1 bg-white text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
        }, skill);
    }), job.skills.length > 4 && /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 self-center uppercase tracking-widest"
    }, "+", job.skills.length - 4, " more")), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center pt-5 border-t border-slate-100"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest"
    }, "Posted ", formatRelativeTime(job.createdAt)), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2 justify-end"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: job.employer_id ? "/messages?with=".concat(job.employer_id) : "/messages",
        className: "flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer uppercase tracking-wider"
    }, /*#__PURE__*/ React.createElement(MessageSquare, {
        className: "w-3.5 h-3.5"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "hidden xs:inline"
    }, "Message")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return alert('Details for "'.concat(job.title, '" at ').concat(job.company || "Employer", ":\n\n").concat(job.description));
        },
        className: "flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer uppercase tracking-wider"
    }, "Details"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            if (isApplied || isApplyingLocal) return [
                                2
                            ];
                            setIsApplyingLocal(true);
                            if (!onApply) return [
                                3,
                                2
                            ];
                            return [
                                4,
                                onApply(job.id)
                            ];
                        case 1:
                            _state.sent();
                            _state.label = 2;
                        case 2:
                            setIsApplyingLocal(false);
                            return [
                                2
                            ];
                    }
                });
            })();
        },
        disabled: isApplied || isApplyingLocal,
        className: cn("flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-bold text-white rounded-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider", isApplied ? "bg-emerald-600 shadow-emerald-100" : "bg-slate-900 hover:bg-black shadow-lg shadow-slate-200", (isApplied || isApplyingLocal) && "opacity-80 cursor-not-allowed")
    }, isApplyingLocal ? /*#__PURE__*/ React.createElement("span", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "hidden xs:inline"
    }, "Applying..."), /*#__PURE__*/ React.createElement("span", {
        className: "xs:hidden"
    }, "...")) : isApplied ? applicationStatus === 'hired' ? "Hired ✓" : "Pending" : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", {
        className: "hidden xs:inline"
    }, "Apply Now"), /*#__PURE__*/ React.createElement("span", {
        className: "xs:hidden"
    }, "Apply"), /*#__PURE__*/ React.createElement(ExternalLink, {
        className: "w-3.5 h-3.5"
    })))))));
}
