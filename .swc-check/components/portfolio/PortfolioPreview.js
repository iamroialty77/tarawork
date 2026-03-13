'use client';
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
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
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
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
import React, { useState } from 'react';
import { Github, Linkedin, ExternalLink, Mail, MapPin, Briefcase, Star, Globe, ArrowRight, X, Send, CheckCircle2, Sparkles, Award, ShieldCheck, PlayCircle, BarChart3, Eye } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
var ProjectCard = function ProjectCard(param) {
    var project = param.project, _param_isPro = param.isPro, isPro = _param_isPro === void 0 ? false : _param_isPro;
    return /*#__PURE__*/ React.createElement("div", {
        className: "group p-6 transition-all duration-300 ".concat(isPro ? "bg-white border border-amber-100 rounded-[1.75rem] shadow-lg shadow-amber-100/30 hover:-translate-y-1 hover:shadow-2xl" : "bg-white border border-gray-100 hover:shadow-sm hover:border-gray-200")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative aspect-video mb-6 overflow-hidden bg-gray-50 rounded-sm"
    }, project.image_url ? /*#__PURE__*/ React.createElement(Image, {
        src: project.image_url,
        alt: project.title,
        fill: true,
        className: "object-cover transition-transform duration-500 group-hover:scale-105"
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full flex items-center justify-center text-gray-300"
    }, /*#__PURE__*/ React.createElement(Globe, {
        size: 48,
        strokeWidth: 1
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-medium tracking-tight text-gray-900"
    }, project.title), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-gray-500 leading-relaxed line-clamp-2"
    }, project.description), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2 pt-2"
    }, project.technologies.map(function(tech) {
        return /*#__PURE__*/ React.createElement("span", {
            key: tech,
            className: "text-[10px] uppercase tracking-wider px-2 py-0.5 ".concat(isPro ? "text-amber-800 border border-amber-100 bg-amber-50 rounded-full" : "text-gray-400 border border-gray-100")
        }, tech);
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4 pt-4"
    }, project.project_url && /*#__PURE__*/ React.createElement("a", {
        href: project.project_url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-gray-900 hover:text-black transition-colors flex items-center gap-1.5 text-sm"
    }, /*#__PURE__*/ React.createElement(ExternalLink, {
        size: 14
    }), /*#__PURE__*/ React.createElement("span", null, "Visit")), project.github_url && /*#__PURE__*/ React.createElement("a", {
        href: project.github_url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-gray-900 hover:text-black transition-colors flex items-center gap-1.5 text-sm"
    }, /*#__PURE__*/ React.createElement(Github, {
        size: 14
    }), /*#__PURE__*/ React.createElement("span", null, "Code")))));
};
var Sidebar = function Sidebar(param) {
    var profile = param.profile, _param_isPro = param.isPro, isPro = _param_isPro === void 0 ? false : _param_isPro;
    var _profile_portfolio, _profile_portfolio1, _profile_premiumProfile, _profile_premiumProfile_verifiedProgram, _profile_premiumProfile1, _profile_premiumProfile2, _profile_portfolio2;
    var skillItems = ((_profile_portfolio = profile.portfolio) === null || _profile_portfolio === void 0 ? void 0 : _profile_portfolio.skills) && profile.portfolio.skills.length > 0 ? profile.portfolio.skills.map(function(skill) {
        return skill.name;
    }) : (profile.bio || "").split(",").map(function(skill) {
        return skill.trim();
    }).filter(Boolean);
    var socialLinks = ((_profile_portfolio1 = profile.portfolio) === null || _profile_portfolio1 === void 0 ? void 0 : _profile_portfolio1.links) || [];
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-12 ".concat(isPro ? "rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm" : "")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative w-24 h-24 overflow-hidden rounded-full ".concat(isPro ? "border-4 border-white/20 shadow-2xl shadow-amber-400/20" : "border border-gray-100")
    }, /*#__PURE__*/ React.createElement(Image, {
        src: profile.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        alt: profile.name,
        fill: true,
        className: "object-cover"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-2xl font-semibold tracking-tight ".concat(isPro ? "text-white" : "text-gray-900")
    }, profile.name), ((_profile_premiumProfile = profile.premiumProfile) === null || _profile_premiumProfile === void 0 ? void 0 : _profile_premiumProfile.verifiedBadge) && /*#__PURE__*/ React.createElement("span", {
        className: "inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        size: 12
    }), "Verified"), ((_profile_premiumProfile1 = profile.premiumProfile) === null || _profile_premiumProfile1 === void 0 ? void 0 : (_profile_premiumProfile_verifiedProgram = _profile_premiumProfile1.verifiedProgram) === null || _profile_premiumProfile_verifiedProgram === void 0 ? void 0 : _profile_premiumProfile_verifiedProgram.enrolled) && /*#__PURE__*/ React.createElement("span", {
        className: "inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        size: 12
    }), "Tara Verified")), /*#__PURE__*/ React.createElement("p", {
        className: "font-medium ".concat(isPro ? "text-slate-300" : "text-gray-500")
    }, profile.role), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-sm pt-1 ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, /*#__PURE__*/ React.createElement(MapPin, {
        size: 14
    }), /*#__PURE__*/ React.createElement("span", null, "Remote / Freelance")), ((_profile_premiumProfile2 = profile.premiumProfile) === null || _profile_premiumProfile2 === void 0 ? void 0 : _profile_premiumProfile2.customDomain) && /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-800"
    }, /*#__PURE__*/ React.createElement(Globe, {
        size: 12
    }), profile.premiumProfile.customDomain))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[11px] uppercase tracking-[0.2em] font-semibold ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, "About"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm leading-relaxed ".concat(isPro ? "text-slate-200" : "text-gray-600")
    }, ((_profile_portfolio2 = profile.portfolio) === null || _profile_portfolio2 === void 0 ? void 0 : _profile_portfolio2.about_me) || profile.bio || "No bio available.")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[11px] uppercase tracking-[0.2em] font-semibold ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, "Skills"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2"
    }, skillItems.length > 0 ? skillItems.map(function(skill) {
        return /*#__PURE__*/ React.createElement("span", {
            key: skill,
            className: "text-xs px-3 py-1 ".concat(isPro ? "bg-white/10 text-white border border-white/10 rounded-full" : "bg-gray-50 text-gray-600 border border-gray-100")
        }, skill);
    }) : /*#__PURE__*/ React.createElement("p", {
        className: "text-sm ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, "Skills will be added soon."))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[11px] uppercase tracking-[0.2em] font-semibold ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, "Social"), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, socialLinks.length > 0 ? socialLinks.map(function(link) {
        var Icon = link.label.toLowerCase() === 'github' ? Github : link.label.toLowerCase() === 'linkedin' ? Linkedin : link.label.toLowerCase() === 'mail' ? Mail : ExternalLink;
        return /*#__PURE__*/ React.createElement("a", {
            key: link.id,
            href: link.url,
            target: "_blank",
            rel: "noopener noreferrer",
            title: link.label,
            className: isPro ? "text-slate-400 hover:text-white transition-colors" : "text-gray-400 hover:text-black transition-colors"
        }, /*#__PURE__*/ React.createElement(Icon, {
            size: 20,
            strokeWidth: 1.5
        }));
    }) : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Github, {
        className: "text-gray-400 hover:text-black cursor-pointer transition-colors",
        size: 20,
        strokeWidth: 1.5
    }), /*#__PURE__*/ React.createElement(Linkedin, {
        className: "text-gray-400 hover:text-black cursor-pointer transition-colors",
        size: 20,
        strokeWidth: 1.5
    }), /*#__PURE__*/ React.createElement(Mail, {
        className: "text-gray-400 hover:text-black cursor-pointer transition-colors",
        size: 20,
        strokeWidth: 1.5
    })))));
};
export default function PortfolioPreview(param) {
    var profile = param.profile, _param_isPublic = param.isPublic, isPublic = _param_isPublic === void 0 ? true : _param_isPublic;
    var _profile_premiumProfile, _profile_premiumProfile1, _profile_premiumProfile2, _profile_premiumProfile3, _profile_premiumProfile4, _profile_premiumProfile5, _profile_premiumProfile_verifiedProgram, _profile_premiumProfile6, _profile_premiumProfile7, _profile_portfolio, _profile_premiumProfile_verifiedProgram1, _profile_premiumProfile8, _profile_portfolio1, _profile_portfolio2;
    var _useState = _sliced_to_array(useState(false), 2), isInquiryModalOpen = _useState[0], setIsInquiryModalOpen = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isSubmitting = _useState1[0], setIsSubmitting = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isSubmitted = _useState2[0], setIsSubmitted = _useState2[1];
    var _useState3 = _sliced_to_array(useState({
        name: '',
        email: '',
        message: ''
    }), 2), formData = _useState3[0], setFormData = _useState3[1];
    var handleHireMe = function handleHireMe() {
        if (!isPublic) return;
        setIsInquiryModalOpen(true);
    };
    var handleInquirySubmit = function handleInquirySubmit(e) {
        return _async_to_generator(function() {
            var error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        e.preventDefault();
                        setIsSubmitting(true);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            4,
                            5
                        ]);
                        return [
                            4,
                            supabase.from('portfolio_inquiries').insert([
                                {
                                    freelancer_id: profile.id,
                                    sender_name: formData.name,
                                    sender_email: formData.email,
                                    message: formData.message
                                }
                            ])
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        setIsSubmitted(true);
                        // Reset form after 5 seconds and close modal
                        setTimeout(function() {
                            setIsInquiryModalOpen(false);
                            setIsSubmitted(false);
                            setFormData({
                                name: '',
                                email: '',
                                message: ''
                            });
                        }, 5000);
                        return [
                            3,
                            5
                        ];
                    case 3:
                        err = _state.sent();
                        console.error('Error sending inquiry:', err);
                        alert('Failed to send inquiry. Please try again.');
                        return [
                            3,
                            5
                        ];
                    case 4:
                        setIsSubmitting(false);
                        return [
                            7
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var analytics = (_profile_premiumProfile = profile.premiumProfile) === null || _profile_premiumProfile === void 0 ? void 0 : _profile_premiumProfile.analytics;
    var isPro = ((_profile_premiumProfile1 = profile.premiumProfile) === null || _profile_premiumProfile1 === void 0 ? void 0 : _profile_premiumProfile1.tier) === 'pro';
    var firstName = (profile.name || 'Freelancer').split(' ')[0];
    var pageShellClass = isPro ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_30%),linear-gradient(180deg,#0f172a_0%,#111827_35%,#0b1220_100%)] text-white font-sans selection:bg-amber-300 selection:text-slate-950" : "min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-black selection:text-white";
    var navClass = isPro ? "fixed top-0 left-0 right-0 z-50 bg-slate-950/75 backdrop-blur-md border-b border-white/10" : "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100";
    var containerClass = isPro ? "max-w-screen-xl mx-auto px-6 py-32 lg:py-40" : "max-w-screen-xl mx-auto px-6 py-32 lg:py-48";
    return /*#__PURE__*/ React.createElement("div", {
        className: pageShellClass
    }, /*#__PURE__*/ React.createElement("nav", {
        className: navClass
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ".concat(isPro ? "bg-amber-300 text-slate-950" : "bg-black text-white")
    }, "T"), /*#__PURE__*/ React.createElement("span", {
        className: "font-bold tracking-tight text-lg ".concat(isPro ? "text-white" : "")
    }, "TaraWork")), /*#__PURE__*/ React.createElement("div", {
        className: "hidden md:flex items-center gap-8"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold uppercase tracking-widest ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, "Professional Network"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ".concat(isPro ? "border-white/15 bg-white/10 text-slate-200" : "border-slate-200 bg-slate-50 text-slate-600")
    }, /*#__PURE__*/ React.createElement(Eye, {
        size: 12
    }), "Public Portfolio"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tighter ".concat(isPro ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-gray-50 border-gray-100 text-gray-700")
    }, isPro ? /*#__PURE__*/ React.createElement(Star, {
        size: 12,
        className: "text-amber-500"
    }) : /*#__PURE__*/ React.createElement(ShieldCheck, {
        size: 12,
        className: "text-blue-500"
    }), isPro ? 'Freelancer Pro' : 'Verified Profile')), /*#__PURE__*/ React.createElement("button", {
        onClick: handleHireMe,
        disabled: !isPublic,
        className: "px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ".concat(isPro ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-black text-white hover:bg-gray-800")
    }, "Send Inquiry"))), /*#__PURE__*/ React.createElement("div", {
        className: containerClass
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col lg:flex-row gap-20"
    }, /*#__PURE__*/ React.createElement("aside", {
        className: "lg:w-1/3 shrink-0"
    }, /*#__PURE__*/ React.createElement(Sidebar, {
        profile: profile,
        isPro: isPro
    })), /*#__PURE__*/ React.createElement("main", {
        className: "lg:w-2/3 space-y-20"
    }, isPro && /*#__PURE__*/ React.createElement("section", {
        className: "overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white via-amber-50 to-orange-100 p-8 shadow-2xl shadow-amber-500/10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300"
    }, /*#__PURE__*/ React.createElement(Star, {
        size: 12
    }), "Premium Profile"), /*#__PURE__*/ React.createElement("h2", {
        className: "mt-5 text-3xl font-semibold tracking-tight text-gray-900"
    }, ((_profile_premiumProfile2 = profile.premiumProfile) === null || _profile_premiumProfile2 === void 0 ? void 0 : _profile_premiumProfile2.introHeadline) || 'Professional profile'), /*#__PURE__*/ React.createElement("p", {
        className: "mt-3 max-w-xl text-sm leading-relaxed text-gray-600"
    }, "Verified, branded, client-ready.")), ((_profile_premiumProfile3 = profile.premiumProfile) === null || _profile_premiumProfile3 === void 0 ? void 0 : _profile_premiumProfile3.analyticsEnabled) && /*#__PURE__*/ React.createElement("div", {
        className: "grid min-w-[280px] grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl border border-white bg-white p-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-gray-400"
    }, /*#__PURE__*/ React.createElement(BarChart3, {
        size: 14
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black uppercase tracking-[0.2em]"
    }, "Profile Views")), /*#__PURE__*/ React.createElement("p", {
        className: "mt-3 text-3xl font-black text-gray-900"
    }, (analytics === null || analytics === void 0 ? void 0 : analytics.profileViews) || 0)), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl border border-white bg-white p-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-gray-400"
    }, /*#__PURE__*/ React.createElement(ArrowRight, {
        size: 14
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black uppercase tracking-[0.2em]"
    }, "Client Clicks")), /*#__PURE__*/ React.createElement("p", {
        className: "mt-3 text-3xl font-black text-gray-900"
    }, (analytics === null || analytics === void 0 ? void 0 : analytics.clientClicks) || 0)))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-8 grid gap-4 md:grid-cols-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white p-5 text-slate-900"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Custom Domain"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-3 text-lg font-black"
    }, ((_profile_premiumProfile4 = profile.premiumProfile) === null || _profile_premiumProfile4 === void 0 ? void 0 : _profile_premiumProfile4.customDomain) || 'https://www.tarawork.online/@roi')), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white p-5 text-slate-900"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Featured Placement"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-3 text-lg font-black"
    }, ((_profile_premiumProfile5 = profile.premiumProfile) === null || _profile_premiumProfile5 === void 0 ? void 0 : _profile_premiumProfile5.featuredPlacement) ? 'Priority eligible' : 'Standard visibility'))), ((_profile_premiumProfile6 = profile.premiumProfile) === null || _profile_premiumProfile6 === void 0 ? void 0 : (_profile_premiumProfile_verifiedProgram = _profile_premiumProfile6.verifiedProgram) === null || _profile_premiumProfile_verifiedProgram === void 0 ? void 0 : _profile_premiumProfile_verifiedProgram.enrolled) && /*#__PURE__*/ React.createElement("div", {
        className: "mt-8 rounded-[1.75rem] border border-emerald-200 bg-white p-6"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700"
    }, "Tara Verified"), /*#__PURE__*/ React.createElement("div", {
        className: "mt-5 grid gap-3 md:grid-cols-4"
    }, [
        "Verified identity",
        "Verified portfolio",
        "Higher search ranking",
        "Client trust boost"
    ].map(function(item) {
        return /*#__PURE__*/ React.createElement("div", {
            key: item,
            className: "rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-900"
        }, item);
    }))), ((_profile_premiumProfile7 = profile.premiumProfile) === null || _profile_premiumProfile7 === void 0 ? void 0 : _profile_premiumProfile7.videoIntroUrl) && /*#__PURE__*/ React.createElement("a", {
        href: profile.premiumProfile.videoIntroUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-950 px-6 py-5 text-white transition-all hover:bg-black"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white/10 p-3"
    }, /*#__PURE__*/ React.createElement(PlayCircle, {
        size: 24,
        className: "text-amber-300"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-black uppercase tracking-[0.2em] text-amber-300"
    }, "Video Intro"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-1 text-sm text-slate-300"
    }, "Watch a quick introduction before you reach out."))), /*#__PURE__*/ React.createElement(ExternalLink, {
        size: 18,
        className: "text-slate-400"
    }))), /*#__PURE__*/ React.createElement("section", {
        className: "space-y-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-end"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl font-semibold tracking-tight ".concat(isPro ? "text-white" : "text-gray-900")
    }, "Featured Projects"), /*#__PURE__*/ React.createElement("div", {
        className: "text-sm font-medium ".concat(isPro ? "text-slate-400" : "text-gray-400")
    }, ((_profile_portfolio = profile.portfolio) === null || _profile_portfolio === void 0 ? void 0 : _profile_portfolio.projects.length) || 0, " Projects")), ((_profile_premiumProfile8 = profile.premiumProfile) === null || _profile_premiumProfile8 === void 0 ? void 0 : (_profile_premiumProfile_verifiedProgram1 = _profile_premiumProfile8.verifiedProgram) === null || _profile_premiumProfile_verifiedProgram1 === void 0 ? void 0 : _profile_premiumProfile_verifiedProgram1.enrolled) && !isPro && /*#__PURE__*/ React.createElement("div", {
        className: "rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700"
    }, "Verified Freelancer Program"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-3 text-sm leading-relaxed text-slate-700"
    }, "Identity verified. Portfolio reviewed.")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-8"
    }, (_profile_portfolio1 = profile.portfolio) === null || _profile_portfolio1 === void 0 ? void 0 : _profile_portfolio1.projects.map(function(project) {
        return /*#__PURE__*/ React.createElement(ProjectCard, {
            key: project.id,
            project: project,
            isPro: isPro
        });
    }), (!((_profile_portfolio2 = profile.portfolio) === null || _profile_portfolio2 === void 0 ? void 0 : _profile_portfolio2.projects) || profile.portfolio.projects.length === 0) && /*#__PURE__*/ React.createElement("div", {
        className: "col-span-full py-20 border-2 border-dashed flex flex-col items-center justify-center ".concat(isPro ? "border-white/10 rounded-[1.75rem] text-slate-400 bg-white/5" : "border-gray-100 rounded-sm text-gray-400")
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        size: 40,
        strokeWidth: 1,
        className: "mb-4"
    }), /*#__PURE__*/ React.createElement("p", null, "No projects showcased yet.")))), /*#__PURE__*/ React.createElement("section", {
        className: "space-y-10 pt-20 ".concat(isPro ? "border-t border-white/10" : "border-t border-gray-100")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-end"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl font-semibold tracking-tight ".concat(isPro ? "text-white" : "text-gray-900")
    }, "Expertise & Strategy")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 rounded-2xl space-y-4 transition-all duration-500 border ".concat(isPro ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:border-gray-100")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ".concat(isPro ? "bg-white/10" : "bg-white")
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-5 h-5 ".concat(isPro ? "text-amber-300" : "text-black")
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold tracking-tight ".concat(isPro ? "text-white" : "text-gray-900")
    }, "Quality-First Approach"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm leading-relaxed ".concat(isPro ? "text-slate-300" : "text-gray-500")
    }, "I believe in building solutions that are not just functional, but scalable and maintainable for the long term. Performance and user experience are always top priorities.")), /*#__PURE__*/ React.createElement("div", {
        className: "p-8 rounded-2xl space-y-4 transition-all duration-500 border ".concat(isPro ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-transparent hover:bg-white hover:shadow-xl hover:border-gray-100")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ".concat(isPro ? "bg-white/10" : "bg-white")
    }, /*#__PURE__*/ React.createElement(Award, {
        className: "w-5 h-5 ".concat(isPro ? "text-amber-300" : "text-black")
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold tracking-tight ".concat(isPro ? "text-white" : "text-gray-900")
    }, "Result-Driven Mindset"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm leading-relaxed ".concat(isPro ? "text-slate-300" : "text-gray-500")
    }, "Every project is an opportunity to deliver measurable value. I focus on understanding business goals and translating them into efficient technical solutions."))))))), /*#__PURE__*/ React.createElement("div", {
        className: "fixed bottom-10 left-0 right-0 flex justify-center z-50 pointer-events-none"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: handleHireMe,
        disabled: !isPublic,
        className: "pointer-events-auto flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group disabled:cursor-not-allowed disabled:opacity-60 ".concat(isPro ? "bg-amber-300 text-slate-950 hover:bg-amber-200" : "bg-black text-white hover:bg-gray-900")
    }, /*#__PURE__*/ React.createElement("span", {
        className: "font-semibold tracking-wide"
    }, "Message ", firstName), /*#__PURE__*/ React.createElement(ArrowRight, {
        size: 18,
        className: "transition-transform group-hover:translate-x-1"
    }))), isInquiryModalOpen && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
        onClick: function onClick() {
            return !isSubmitting && setIsInquiryModalOpen(false);
        }
    }), /*#__PURE__*/ React.createElement("div", {
        className: "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsInquiryModalOpen(false);
        },
        className: "absolute top-6 right-6 text-gray-400 hover:text-black transition-colors",
        disabled: isSubmitting
    }, /*#__PURE__*/ React.createElement(X, {
        size: 20
    })), isSubmitted ? /*#__PURE__*/ React.createElement("div", {
        className: "py-12 flex flex-col items-center text-center space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2"
    }, /*#__PURE__*/ React.createElement(CheckCircle2, {
        size: 32
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-semibold text-gray-900"
    }, "Inquiry Sent!"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500 max-w-xs"
    }, "Your message has been sent to ", profile.name, ". They will contact you shortly."), /*#__PURE__*/ React.createElement("div", {
        className: "pt-6"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return window.location.href = "/auth?referring_freelancer_id=".concat(profile.id, "&action=signup&role=employer");
        },
        className: "text-sm font-semibold text-black underline underline-offset-4 hover:text-gray-600 transition-colors"
    }, "Want to track your hires? Sign up here."))) : /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-semibold text-gray-900"
    }, "Work with ", firstName), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500 mt-2 text-sm"
    }, "This is a public, view-only portfolio. Send your project brief and ", firstName, " can reply to your email.")), /*#__PURE__*/ React.createElement("form", {
        onSubmit: handleInquirySubmit,
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1.5"
    }, /*#__PURE__*/ React.createElement("label", {
        htmlFor: "name",
        className: "text-xs font-semibold uppercase tracking-wider text-gray-400"
    }, "Your Name"), /*#__PURE__*/ React.createElement("input", {
        required: true,
        id: "name",
        type: "text",
        value: formData.name,
        onChange: function onChange(e) {
            return setFormData(_object_spread_props(_object_spread({}, formData), {
                name: e.target.value
            }));
        },
        className: "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-colors",
        placeholder: "John Doe"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1.5"
    }, /*#__PURE__*/ React.createElement("label", {
        htmlFor: "email",
        className: "text-xs font-semibold uppercase tracking-wider text-gray-400"
    }, "Email Address"), /*#__PURE__*/ React.createElement("input", {
        required: true,
        id: "email",
        type: "email",
        value: formData.email,
        onChange: function onChange(e) {
            return setFormData(_object_spread_props(_object_spread({}, formData), {
                email: e.target.value
            }));
        },
        className: "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-colors",
        placeholder: "john@company.com"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1.5"
    }, /*#__PURE__*/ React.createElement("label", {
        htmlFor: "message",
        className: "text-xs font-semibold uppercase tracking-wider text-gray-400"
    }, "Project Description"), /*#__PURE__*/ React.createElement("textarea", {
        required: true,
        id: "message",
        rows: 4,
        value: formData.message,
        onChange: function onChange(e) {
            return setFormData(_object_spread_props(_object_spread({}, formData), {
                message: e.target.value
            }));
        },
        className: "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-black transition-colors resize-none",
        placeholder: "Tell us about your project or what you're looking for..."
    })), /*#__PURE__*/ React.createElement("button", {
        type: "submit",
        disabled: isSubmitting,
        className: "w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50"
    }, isSubmitting ? /*#__PURE__*/ React.createElement("div", {
        className: "w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
    }) : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("span", null, "Send Inquiry"), /*#__PURE__*/ React.createElement(Send, {
        size: 18
    })))), /*#__PURE__*/ React.createElement("p", {
        className: "text-center text-[11px] text-gray-400"
    }, "By sending, you agree to our Terms of Service."))))));
}
