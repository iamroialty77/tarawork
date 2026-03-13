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
import { Check, Users, Facebook, Twitter, Linkedin, Instagram, ChevronDown, ArrowRight, Star, ShieldCheck, Zap, Award, CheckCircle2, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
export default function LandingPage() {
    var _useState = _sliced_to_array(useState(false), 2), isMenuOpen = _useState[0], setIsMenuOpen = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), scrolled = _useState1[0], setScrolled = _useState1[1];
    useEffect(function() {
        var handleScroll = function handleScroll() {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return function() {
            return window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100"
    }, /*#__PURE__*/ React.createElement("header", {
        className: "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ".concat(scrolled ? 'bg-blue-600/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4')
    }, /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto px-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm"
    }, /*#__PURE__*/ React.createElement("svg", {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none"
    }, /*#__PURE__*/ React.createElement("circle", {
        cx: "8",
        cy: "8",
        r: "3",
        fill: "#2563eb"
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: "16",
        cy: "8",
        r: "3",
        fill: "#2563eb"
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: "12",
        cy: "16",
        r: "3",
        fill: "#2563eb"
    }))), /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold text-xl tracking-tight"
    }, "TaraWork.ph")), /*#__PURE__*/ React.createElement("nav", {
        className: "hidden lg:flex items-center gap-8"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "text-white/90 hover:text-white font-medium transition-colors"
    }, "Home"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1 text-white/90 hover:text-white font-medium transition-colors cursor-pointer group"
    }, "Find Jobs ", /*#__PURE__*/ React.createElement(ChevronDown, {
        className: "w-4 h-4 group-hover:rotate-180 transition-transform"
    })), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "text-white/90 hover:text-white font-medium transition-colors"
    }, "Hire Talent"), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "text-white/90 hover:text-white font-medium transition-colors"
    }, "Community"), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "text-white/90 hover:text-white font-medium transition-colors"
    }, "Pricing")), /*#__PURE__*/ React.createElement("div", {
        className: "hidden md:flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/auth"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "px-5 py-2 text-white border border-white/30 hover:bg-white/10 rounded-lg font-semibold transition-all"
    }, "Sign In")), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
    }, "Join Now"))), /*#__PURE__*/ React.createElement("button", {
        className: "lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors",
        onClick: function onClick() {
            return setIsMenuOpen(!isMenuOpen);
        }
    }, isMenuOpen ? /*#__PURE__*/ React.createElement(X, {
        className: "w-6 h-6"
    }) : /*#__PURE__*/ React.createElement(Menu, {
        className: "w-6 h-6"
    })))), /*#__PURE__*/ React.createElement(AnimatePresence, null, isMenuOpen && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            height: 0
        },
        animate: {
            opacity: 1,
            height: 'auto'
        },
        exit: {
            opacity: 0,
            height: 0
        },
        className: "lg:hidden bg-blue-700 border-t border-white/10 overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto px-6 py-8 flex flex-col gap-6"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "text-white text-lg font-bold",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        }
    }, "Home"), /*#__PURE__*/ React.createElement("div", {
        className: "text-white text-lg font-bold flex items-center justify-between"
    }, "Find Jobs ", /*#__PURE__*/ React.createElement(ChevronDown, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "text-white text-lg font-bold",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        }
    }, "Hire Talent"), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "text-white text-lg font-bold",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        }
    }, "Community"), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "text-white text-lg font-bold",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        }
    }, "Pricing"), /*#__PURE__*/ React.createElement("div", {
        className: "h-px bg-white/10 my-2"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-3 text-white border border-white/30 hover:bg-white/10 rounded-xl font-bold transition-all text-center"
    }, "Sign In")), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        }
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/20 text-center"
    }, "Join Now"))))))), /*#__PURE__*/ React.createElement("section", {
        className: "relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 min-h-screen flex items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid lg:grid-cols-2 gap-12 items-center"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            x: -20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        transition: {
            duration: 0.6
        },
        className: "text-center lg:text-left"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-5xl md:text-6xl lg:text-8xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight"
    }, "Tara, Work Together"), /*#__PURE__*/ React.createElement("h2", {
        className: "text-xl md:text-3xl font-bold text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0"
    }, "Need an extra hand? You're in the right place."), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg md:text-xl mb-12 text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0"
    }, "Tarawork.ph connects you with skilled freelancers and virtual assistants across the Philippines. From admin help and content creation to design, tech, and more — we make it easy to find the right people, fast."), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/auth"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w-full sm:w-auto px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-xl transition-all shadow-xl shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
    }, "Join as a Freelancer")), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w-full sm:w-auto px-8 py-4 bg-white/10 border-2 border-white/20 hover:bg-white/20 text-white text-lg font-bold rounded-xl transition-all active:scale-95"
    }, "Post a Job"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-y-6 gap-x-8 md:gap-x-12"
    }, [
        "AI-Verified Talent",
        "Smart Match Score",
        "Secure Escrow Payments",
        "Escrow Protection"
    ].map(function(badge, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex items-center gap-3 text-white/90"
        }, /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-5 h-5 text-emerald-400 shrink-0"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm md:text-base font-bold tracking-wide"
        }, badge));
    }))), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.9
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        transition: {
            duration: 0.6,
            delay: 0.2
        },
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-8 space-y-6 relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-100"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-6 h-6 text-white"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-slate-900 block"
    }, "Smart Match Score"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-slate-500 font-medium italic"
    }, "High Compatibility"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold uppercase tracking-wider"
    }, "Verified"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-start gap-4 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-teal-400 p-0.5 shadow-lg"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full bg-gradient-to-br from-blue-400 to-teal-400 flex items-center justify-center text-white font-bold text-2xl"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white"
    }, /*#__PURE__*/ React.createElement(Check, {
        className: "w-3.5 h-3.5 text-white"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-1"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "font-extrabold text-slate-900 text-xl flex items-center gap-1"
    }, "Mark Rivera ", /*#__PURE__*/ React.createElement(ChevronDown, {
        className: "w-4 h-4 text-blue-500"
    }))), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-semibold text-slate-500 mb-3"
    }, "Top-Rated Graphic Designer"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-4 text-xs font-medium text-slate-400"
    }, /*#__PURE__*/ React.createElement("span", null, "Viet"), /*#__PURE__*/ React.createElement("span", null, "SR: 3K"), /*#__PURE__*/ React.createElement("span", null, "Nodame"), /*#__PURE__*/ React.createElement("span", {
        className: "text-teal-500"
    }, "Vex3s"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100 text-[10px] font-bold text-slate-400 flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "block text-emerald-500 text-sm"
    }, "●"), /*#__PURE__*/ React.createElement("span", null, "Escrow")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("span", null, "350/hr")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("span", null, "30/hr")))), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-6 mb-6 border-b border-slate-100"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "pb-3 px-1 text-sm font-bold text-slate-900 border-b-2 border-blue-600"
    }, "Overview"), /*#__PURE__*/ React.createElement("button", {
        className: "pb-3 px-1 text-sm font-bold text-slate-400"
    }, "Milestones"), /*#__PURE__*/ React.createElement("button", {
        className: "pb-3 px-1 text-sm font-bold text-slate-400"
    }, "Files"), /*#__PURE__*/ React.createElement("button", {
        className: "pb-3 px-1 text-sm font-bold text-slate-400"
    }, "Messages")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase"
    }, /*#__PURE__*/ React.createElement("span", null, "Initial Payment"), /*#__PURE__*/ React.createElement("span", null, "Final Design")), /*#__PURE__*/ React.createElement("div", {
        className: "h-2 bg-slate-100 rounded-full overflow-hidden"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            width: 0
        },
        animate: {
            width: '80%'
        },
        transition: {
            duration: 1,
            delay: 0.5
        },
        className: "h-full bg-emerald-400 rounded-full"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center text-[10px] font-bold text-slate-400"
    }, /*#__PURE__*/ React.createElement("span", null, "St.metrki"), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("span", null, "1st Draft"), /*#__PURE__*/ React.createElement("span", null, "Revision Phase"), /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-900"
    }, "Today")))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 rounded-xl p-3 flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 rounded-full bg-slate-200"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-500 line-clamp-1"
    }, "Intem dessxay is a doc or ihage to piece...")), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] text-slate-400 mr-2"
    }, "2d"), /*#__PURE__*/ React.createElement("button", {
        className: "px-4 py-1.5 bg-emerald-500 text-white text-[11px] font-bold rounded-lg"
    }, "Send")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 rounded-xl p-3 flex items-center gap-3 mt-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 rounded-full bg-slate-200"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-500 line-clamp-1"
    }, "Youmi41025 amet cealisy eo gineharice you...")))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-emerald-50/50 rounded-2xl p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(Check, {
        className: "w-5 h-5 text-white"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900 text-sm mb-1"
    }, "AI-Powered Skill Verification"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-500 font-medium"
    }, "Certified skills through assessments and vetting.")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-emerald-50/50 rounded-2xl p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(Check, {
        className: "w-5 h-5 text-white"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900 text-sm mb-1"
    }, "Milestone Tracker"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-500 font-medium"
    }, "Funds released as each step is approved.")))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 animate-bounce delay-700"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-3 h-3 bg-emerald-500 rounded-full"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-slate-700"
    }, "1.2k Freelancers Online"))))))), /*#__PURE__*/ React.createElement("section", {
        className: "py-16 bg-slate-50 border-y border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto px-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-4xl lg:text-5xl font-black text-blue-600 mb-2"
    }, "8,500+"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-bold uppercase tracking-widest text-xs"
    }, "Active Freelancers")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-4xl lg:text-5xl font-black text-teal-600 mb-2"
    }, "₱45M+"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-bold uppercase tracking-widest text-xs"
    }, "Total Earnings")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-4xl lg:text-5xl font-black text-blue-600 mb-2"
    }, "12K+"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-bold uppercase tracking-widest text-xs"
    }, "Jobs Completed")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-4xl lg:text-5xl font-black text-teal-600 mb-2"
    }, "4.8★"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-bold uppercase tracking-widest text-xs"
    }, "Average Rating"))))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 bg-white"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center max-w-3xl mx-auto mb-16"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6"
    }, "Why Tarawork?"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xl text-slate-600"
    }, "The first intelligent freelancing platform designed specifically for the Philippine market.")), /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-8 h-8 text-blue-600"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-bold text-slate-900 mb-4"
    }, "Fast & Easy Matching"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, "Our AI-powered engine connects you with the right talent in minutes, not days. Post a job and get matches immediately.")), /*#__PURE__*/ React.createElement("div", {
        className: "p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6"
    }, /*#__PURE__*/ React.createElement(Users, {
        className: "w-8 h-8 text-teal-600"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-bold text-slate-900 mb-4"
    }, "Reliable Pros"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, "Every freelancer is vetted through a rigorous verification process, including skill assessments and identity checks.")), /*#__PURE__*/ React.createElement("div", {
        className: "p-8 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-2xl"
    }, "\uD83C\uDDF5\uD83C\uDDED"), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-bold text-slate-900 mb-4"
    }, "Proudly Filipino"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, "Built with local heart and hustle. We understand the unique needs and culture of Filipino workers and businesses."))))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute right-0 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end justify-between gap-6 flex-wrap"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-amber-300"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "w-4 h-4"
    }), "Freelancer Pro"), /*#__PURE__*/ React.createElement("h2", {
        className: "mt-6 text-4xl lg:text-5xl font-black tracking-tight"
    }, "Premium upgrades for top freelancers.")), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "inline-flex"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "rounded-2xl bg-amber-400 px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-300"
    }, "Upgrade"))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-12 grid gap-5 lg:grid-cols-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-black uppercase tracking-[0.3em] text-slate-400"
    }, "Free"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-4 text-4xl font-black"
    }, "P0"), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 space-y-3 text-sm text-slate-200"
    }, /*#__PURE__*/ React.createElement("div", null, "Basic portfolio"), /*#__PURE__*/ React.createElement("div", null, "Skills"), /*#__PURE__*/ React.createElement("div", null, "Contact info"), /*#__PURE__*/ React.createElement("div", null, "Limited uploads"))), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-amber-300/30 bg-gradient-to-br from-amber-400/20 via-white/10 to-white/5 p-8 shadow-2xl shadow-amber-900/20"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-black uppercase tracking-[0.3em] text-amber-300"
    }, "Pro"), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 grid grid-cols-2 gap-3 text-sm text-white"
    }, /*#__PURE__*/ React.createElement("div", null, "Verified badge"), /*#__PURE__*/ React.createElement("div", null, "Custom domain"), /*#__PURE__*/ React.createElement("div", null, "Featured placement"), /*#__PURE__*/ React.createElement("div", null, "Analytics"), /*#__PURE__*/ React.createElement("div", null, "Video intro"), /*#__PURE__*/ React.createElement("div", null, "Advanced portfolio"))), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-white/10 bg-black/20 p-8"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-black uppercase tracking-[0.3em] text-slate-400"
    }, "Use Case"), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 space-y-3 text-sm text-slate-200"
    }, /*#__PURE__*/ React.createElement("div", null, "Better first impression"), /*#__PURE__*/ React.createElement("div", null, "Cleaner professional link"), /*#__PURE__*/ React.createElement("div", null, "Higher response potential")))))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 bg-white relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute left-0 top-10 h-72 w-72 rounded-full bg-emerald-100 blur-3xl opacity-70"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end justify-between gap-6 flex-wrap"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-4 h-4"
    }), "Tara Verified"), /*#__PURE__*/ React.createElement("h2", {
        className: "mt-6 text-4xl lg:text-5xl font-black tracking-tight text-slate-900"
    }, "Trust-first verification.")), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-slate-200 bg-slate-950 px-8 py-6 text-white shadow-2xl shadow-slate-200/70"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-black uppercase tracking-[0.3em] text-emerald-300"
    }, "P499/year"))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-12 grid gap-5 md:grid-cols-4"
    }, [
        "Verified identity",
        "Verified portfolio",
        "Higher search ranking",
        "Client trust boost"
    ].map(function(item) {
        return /*#__PURE__*/ React.createElement("div", {
            key: item,
            className: "rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100"
        }, /*#__PURE__*/ React.createElement(ShieldCheck, {
            className: "w-5 h-5 text-emerald-600 mb-4"
        }), /*#__PURE__*/ React.createElement("h3", {
            className: "text-base font-black tracking-tight text-slate-900"
        }, item));
    })))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 bg-slate-50 overflow-hidden relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-1/2 left-0 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center mb-16"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-4xl font-extrabold text-slate-900 mb-4"
    }, "Popular Services"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 font-medium"
    }, "Find the perfect talent for any project")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
    }, [
        {
            name: 'Virtual Assistant',
            emoji: '💼',
            color: 'blue'
        },
        {
            name: 'Graphic Design',
            emoji: '🎨',
            color: 'pink'
        },
        {
            name: 'Content Writing',
            emoji: '✍️',
            color: 'teal'
        },
        {
            name: 'Web Development',
            emoji: '💻',
            color: 'indigo'
        },
        {
            name: 'Social Media',
            emoji: '📱',
            color: 'blue'
        },
        {
            name: 'Video Editing',
            emoji: '🎬',
            color: 'pink'
        },
        {
            name: 'Customer Support',
            emoji: '🎧',
            color: 'teal'
        },
        {
            name: 'Data Entry',
            emoji: '📊',
            color: 'indigo'
        },
        {
            name: 'Marketing',
            emoji: '📢',
            color: 'blue'
        },
        {
            name: 'Bookkeeping',
            emoji: '📚',
            color: 'pink'
        },
        {
            name: 'Translation',
            emoji: '🌐',
            color: 'teal'
        },
        {
            name: 'SEO Specialist',
            emoji: '🔍',
            color: 'indigo'
        }
    ].map(function(service, index) {
        return /*#__PURE__*/ React.createElement("div", {
            key: index,
            className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group text-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-4xl mb-4 group-hover:scale-110 transition-transform"
        }, service.emoji), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-800"
        }, service.name));
    })))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 bg-white"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center mb-20"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-4xl font-extrabold text-slate-900 mb-4"
    }, "How It Works"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xl text-slate-600"
    }, "Three simple steps to start working together")), /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-3 gap-16 max-w-5xl mx-auto relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-slate-100 -z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "text-center group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
    }, "1"), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-bold text-slate-900 mb-4"
    }, "Create Your Profile"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, "Sign up in minutes. Set up your profile and tell us what you're looking for.")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 bg-teal-500 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-teal-200 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300"
    }, "2"), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-bold text-slate-900 mb-4"
    }, "Get Matched"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, "Our smart matching system connects you based on skills and work style.")), /*#__PURE__*/ React.createElement("div", {
        className: "text-center group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
    }, "3"), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-bold text-slate-900 mb-4"
    }, "Start Working"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, "Chat, collaborate, and get paid securely. Our escrow system protects you."))))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 bg-slate-900 text-white rounded-2xl mx-6 mb-24 overflow-hidden relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px]"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto max-w-5xl relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-center mb-20"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-4xl lg:text-5xl font-black mb-6"
    }, "Your Work, ", /*#__PURE__*/ React.createElement("span", {
        className: "text-blue-400"
    }, "Protected")), /*#__PURE__*/ React.createElement("p", {
        className: "text-xl text-slate-400 max-w-2xl mx-auto"
    }, "We've built safety into every step of the process.")), /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-2 gap-12"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-10 h-10 text-white"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-3xl font-bold mb-6"
    }, "Escrow Payments"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-lg leading-relaxed mb-8"
    }, "Funds are held securely until work is approved. Freelancers get paid on time, and clients only pay for quality work."), /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-4"
    }, [
        "Milestone-based payments",
        "Dispute resolution support",
        "Transparent fee structure"
    ].map(function(item, i) {
        return /*#__PURE__*/ React.createElement("li", {
            key: i,
            className: "flex items-center gap-3 font-bold text-slate-200"
        }, /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-5 h-5 text-blue-400"
        }), " ", item);
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 backdrop-blur-md rounded-2xl p-10 border border-white/10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-teal-500/20"
    }, /*#__PURE__*/ React.createElement(Award, {
        className: "w-10 h-10 text-white"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-3xl font-bold mb-6"
    }, "Verified Pros"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-lg leading-relaxed mb-8"
    }, "Every freelancer goes through our verification process to ensure quality and authenticity for all projects."), /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-4"
    }, [
        "Identity verification",
        "Skill assessments",
        "Client reviews & ratings"
    ].map(function(item, i) {
        return /*#__PURE__*/ React.createElement("li", {
            key: i,
            className: "flex items-center gap-3 font-bold text-slate-200"
        }, /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-5 h-5 text-teal-400"
        }), " ", item);
    })))))), /*#__PURE__*/ React.createElement("section", {
        className: "py-24 px-6 text-center overflow-hidden relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] -z-10"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto relative"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight"
    }, "Work is better when we", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("span", {
        className: "text-blue-600"
    }, "do it together.")), /*#__PURE__*/ React.createElement("p", {
        className: "text-2xl text-slate-600 mb-12 font-medium"
    }, "Join TaraWork and start building your future today."), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap justify-center gap-6"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/auth"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-2xl transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center gap-3 mx-auto"
    }, "Start Hiring Now ", /*#__PURE__*/ React.createElement(ArrowRight, {
        className: "w-6 h-6"
    }))), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "px-12 py-5 bg-white border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-xl font-bold rounded-2xl transition-all active:scale-95"
    }, "Find Work"))))), /*#__PURE__*/ React.createElement("footer", {
        className: "bg-slate-50 border-t border-slate-100 pt-24 pb-12 px-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "container mx-auto"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid md:grid-cols-4 gap-12 mb-20"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "flex items-center gap-2 mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement("svg", {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none"
    }, /*#__PURE__*/ React.createElement("circle", {
        cx: "8",
        cy: "8",
        r: "3",
        fill: "white"
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: "16",
        cy: "8",
        r: "3",
        fill: "white"
    }), /*#__PURE__*/ React.createElement("circle", {
        cx: "12",
        cy: "16",
        r: "3",
        fill: "white"
    }))), /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-900 font-extrabold text-xl tracking-tight"
    }, "TaraWork.ph")), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-medium leading-relaxed mb-8"
    }, "Smart job matching for Filipino freelancers and employers. Built with ❤️ in the Philippines."), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, [
        Facebook,
        Twitter,
        Linkedin,
        Instagram
    ].map(function(Icon, i) {
        return /*#__PURE__*/ React.createElement("button", {
            key: i,
            className: "w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
        }, /*#__PURE__*/ React.createElement(Icon, {
            className: "w-5 h-5"
        }));
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs"
    }, "For Freelancers"), /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-4"
    }, [
        'Find Jobs',
        'Create Profile',
        'How It Works',
        'Success Stories'
    ].map(function(item) {
        return /*#__PURE__*/ React.createElement("li", {
            key: item
        }, /*#__PURE__*/ React.createElement(Link, {
            href: "/auth",
            className: "text-slate-500 hover:text-blue-600 font-bold transition-colors"
        }, item));
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs"
    }, "For Employers"), /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-4"
    }, [
        'Hire Talent',
        'Post a Job',
        'Pricing',
        'Enterprise'
    ].map(function(item) {
        return /*#__PURE__*/ React.createElement("li", {
            key: item
        }, /*#__PURE__*/ React.createElement(Link, {
            href: "/auth",
            className: "text-slate-500 hover:text-blue-600 font-bold transition-colors"
        }, item));
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900 mb-8 uppercase tracking-widest text-xs"
    }, "Company"), /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-4"
    }, [
        'About Us',
        'Community',
        'Blog',
        'Contact'
    ].map(function(item) {
        return /*#__PURE__*/ React.createElement("li", {
            key: item
        }, /*#__PURE__*/ React.createElement(Link, {
            href: "#",
            className: "text-slate-500 hover:text-blue-600 font-bold transition-colors"
        }, item));
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 font-bold text-sm"
    }, "\xa9 2026 TaraWork.ph. All rights reserved."), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-8"
    }, [
        'Privacy',
        'Terms',
        'Cookies'
    ].map(function(item) {
        return /*#__PURE__*/ React.createElement(Link, {
            key: item,
            href: "#",
            className: "text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors"
        }, item);
    }))))));
}
