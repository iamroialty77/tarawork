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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
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
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys, key, i;
    if (typeof Reflect !== "undefined" && Reflect.ownKeys) {
        sourceKeys = Reflect.ownKeys(Object(source));
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
        return target;
    }
    target = _object_without_properties_loose(source, excluded);
    if (Object.getOwnPropertySymbols) {
        sourceKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceKeys.length; i++){
            key = sourceKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {}, sourceKeys = Object.getOwnPropertyNames(source), key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
    }
    return target;
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import { useState, useEffect, useRef, useMemo } from "react";
import JobFeed from "../components/JobFeed";
import ProfileForm from "../components/ProfileForm";
import SkillAssessment from "../components/SkillAssessment";
import Workspace from "../components/Workspace";
import TeamManager from "../components/TeamManager";
import CareerPath from "../components/CareerPath";
import JobPostingForm from "../components/JobPostingForm";
import AdminDashboard from "../components/AdminDashboard";
import { supabase } from "../lib/supabase";
import { cn, energyScore } from "../lib/utils";
import { useRouter } from "next/navigation";
import { Briefcase, Users, Zap, LayoutDashboard, Bell, Settings, Search as SearchIcon, TrendingUp, Award, Shield, ShieldCheck, ArrowUpRight, LogIn, Mail, CheckCircle2, XCircle, Code, FileText, ExternalLink, Copy, DollarSign, Lock, Scale, PlusCircle, User, Layout, ChevronRight, Sparkles, Brain, Medal, Verified, Trophy, Coins, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AIAgent from "../components/AIAgent";
import LandingPage from "../components/LandingPage";
import { buildPublicProfileUrl, getPremiumProfileDomain } from "../lib/profileUrl";
export default function Home() {
    var _profile_premiumProfile, _profile_premiumProfile1, _profile_premiumProfile2, _profile_premiumProfile3, _profile_premiumProfile4, _profile_premiumProfile5, _profile_premiumProfile6, _profile_premiumProfile7, _profile_premiumProfile8, _profile_premiumProfile9, _profile_premiumProfile10, _profile_premiumProfile11, _profile_premiumProfile12, _profile_premiumProfile13, _profile_premiumProfile14, _profile_premiumProfile15, _profile_premiumProfile16, _profile_premiumProfile17, _profile_premiumProfile18, _profile_premiumProfile_verifiedProgram, _profile_premiumProfile19, _profile_premiumProfile20, _profile_premiumProfile_analytics, _profile_premiumProfile21, _profile_premiumProfile_analytics1, _profile_premiumProfile_verifiedProgram1, _profile_premiumProfile22, _profile_premiumProfile23, _profile_premiumProfile24, _profile_softSkills, _profile_premiumProfile25;
    var router = useRouter();
    var _useState = _sliced_to_array(useState(true), 2), loading = _useState[0], setLoading = _useState[1];
    var _useState1 = _sliced_to_array(useState(null), 2), user = _useState1[0], setUser = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), showToast = _useState2[0], setShowToast = _useState2[1];
    var _useState3 = _sliced_to_array(useState(""), 2), toastMsg = _useState3[0], setToastMsg = _useState3[1];
    var _useState4 = _sliced_to_array(useState("freelancer"), 2), view = _useState4[0], setView = _useState4[1];
    var _useState5 = _sliced_to_array(useState([]), 2), jobs = _useState5[0], setJobs = _useState5[1];
    var _useState6 = _sliced_to_array(useState([]), 2), employerJobs = _useState6[0], setemployerJobs = _useState6[1];
    var _useState7 = _sliced_to_array(useState({}), 2), appliedJobs = _useState7[0], setAppliedJobs = _useState7[1];
    var _useState8 = _sliced_to_array(useState([]), 2), freelancers = _useState8[0], setFreelancers = _useState8[1];
    var _useState9 = _sliced_to_array(useState(false), 2), dbError = _useState9[0], setDbError = _useState9[1];
    var _useState10 = _sliced_to_array(useState([]), 2), missingTables = _useState10[0], setMissingTables = _useState10[1];
    var _useState11 = _sliced_to_array(useState([]), 2), portfolioInquiries = _useState11[0], setPortfolioInquiries = _useState11[1];
    var _useState12 = _sliced_to_array(useState(0), 2), unreadCount = _useState12[0], setUnreadCount = _useState12[1];
    var _useState13 = _sliced_to_array(useState(""), 2), freelancerSearchTerm = _useState13[0], setFreelancerSearchTerm = _useState13[1];
    var _useState14 = _sliced_to_array(useState(""), 2), debouncedFreelancerSearchTerm = _useState14[0], setDebouncedFreelancerSearchTerm = _useState14[1];
    var _useState15 = _sliced_to_array(useState(null), 2), selectedFreelancer = _useState15[0], setSelectedFreelancer = _useState15[1];
    var _useState16 = _sliced_to_array(useState(false), 2), showEscrowModal = _useState16[0], setShowEscrowModal = _useState16[1];
    var _useState17 = _sliced_to_array(useState(false), 2), showFreelancerModal = _useState17[0], setShowFreelancerModal = _useState17[1];
    var _useState18 = _sliced_to_array(useState(false), 2), showApplicantsModal = _useState18[0], setShowApplicantsModal = _useState18[1];
    var _useState19 = _sliced_to_array(useState(false), 2), showApplyModal = _useState19[0], setShowApplyModal = _useState19[1];
    var _useState20 = _sliced_to_array(useState(null), 2), selectedJobIdForApply = _useState20[0], setSelectedJobIdForApply = _useState20[1];
    var _useState21 = _sliced_to_array(useState(null), 2), pendingApplyJobId = _useState21[0], setPendingApplyJobId = _useState21[1];
    var _useState22 = _sliced_to_array(useState({
        resumeUrl: "",
        portfolioUrl: "",
        interviewUrl: "",
        coverLetter: ""
    }), 2), applyData = _useState22[0], setApplyData = _useState22[1];
    var _useState23 = _sliced_to_array(useState([]), 2), notifications = _useState23[0], setNotifications = _useState23[1];
    var _useState24 = _sliced_to_array(useState([]), 2), userFollows = _useState24[0], setUserFollows = _useState24[1];
    var _useState25 = _sliced_to_array(useState(false), 2), showNotifications = _useState25[0], setShowNotifications = _useState25[1];
    var _useState26 = _sliced_to_array(useState([]), 2), userEscrows = _useState26[0], setUserEscrows = _useState26[1];
    var _useState27 = _sliced_to_array(useState([]), 2), selectedJobApplicants = _useState27[0], setSelectedJobApplicants = _useState27[1];
    var _useState28 = _sliced_to_array(useState(""), 2), selectedJobTitle = _useState28[0], setSelectedJobTitle = _useState28[1];
    var jobsRef = useRef(null);
    var profileRef = useRef(null);
    var _useState29 = _sliced_to_array(useState({
        name: "User",
        role: "freelancer",
        category: "General",
        skills: [],
        verifiedSkills: [],
        softSkills: [
            {
                name: "Strategic Thinker",
                badge: "🧠",
                level: "Expert",
                count: 12
            },
            {
                name: "Resilient Leader",
                badge: "🛡️",
                level: "Master",
                count: 8
            },
            {
                name: "Empathetic Speaker",
                badge: "📢",
                level: "Beginner",
                count: 4
            }
        ],
        aiInsights: {
            gapAnalysis: [],
            compatibilityScore: 0,
            cultureMatch: []
        },
        ranking: 15,
        hourlyRate: "$0",
        bio: "",
        activeProjects: [],
        premiumProfile: {
            tier: "free",
            analytics: {
                profileViews: 0,
                clientClicks: 0
            },
            verifiedProgram: {
                enrolled: false,
                annualFee: 499,
                identityVerified: false,
                portfolioVerified: false,
                higherSearchRanking: false,
                clientTrustBoost: false
            }
        }
    }), 2), profile = _useState29[0], setProfile = _useState29[1];
    var _useState30 = _sliced_to_array(useState(false), 2), isMenuOpen = _useState30[0], setIsMenuOpen = _useState30[1];
    var _useState31 = _sliced_to_array(useState(false), 2), showUpgradePlans = _useState31[0], setShowUpgradePlans = _useState31[1];
    var _useState32 = _sliced_to_array(useState(null), 2), planCheckoutLoading = _useState32[0], setPlanCheckoutLoading = _useState32[1];
    var _useState33 = _sliced_to_array(useState(0), 2), headerCreditBalance = _useState33[0], setHeaderCreditBalance = _useState33[1];
    var _useState34 = _sliced_to_array(useState(false), 2), headerCreditsLoading = _useState34[0], setHeaderCreditsLoading = _useState34[1];
    useEffect(function() {
        // Handle email confirmation success message
        var params = new URLSearchParams(window.location.search);
        if (params.get('confirmed') === 'true') {
            setToastMsg("Email verified successfully! Welcome to TaraWork.");
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 5000);
            // Clean up the URL
            var newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);
    useEffect(function() {
        var params = new URLSearchParams(window.location.search);
        var paymentStatus = params.get("payment");
        var product = params.get("product");
        if (!paymentStatus) {
            return;
        }
        if (paymentStatus === "success") {
            setToastMsg(product === "verification" ? "Payment received. Verification will activate after PayMongo webhook confirmation." : product === "credit_topup" ? "Payment received. Credit top-up will reflect after PayMongo webhook confirmation." : "Payment received. Freelancer Pro will activate after PayMongo webhook confirmation.");
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 5000);
        }
        if (paymentStatus === "cancelled") {
            setToastMsg("Payment was cancelled.");
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 4000);
        }
        var cleanedParams = new URLSearchParams(window.location.search);
        cleanedParams.delete("payment");
        cleanedParams.delete("product");
        var nextQuery = cleanedParams.toString();
        var newUrl = "".concat(window.location.pathname).concat(nextQuery ? "?".concat(nextQuery) : "");
        window.history.replaceState({}, document.title, newUrl);
    }, []);
    useEffect(function() {
        var userId = (user === null || user === void 0 ? void 0 : user.id) || profile.id;
        if (!userId || profile.role !== "freelancer") return;
        var mounted = true;
        var loadHeaderCredits = function loadHeaderCredits() {
            return _async_to_generator(function() {
                var response, payload, unused;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            setHeaderCreditsLoading(true);
                            _state.label = 1;
                        case 1:
                            _state.trys.push([
                                1,
                                4,
                                5,
                                6
                            ]);
                            return [
                                4,
                                fetch("/api/credits/balance?userId=".concat(encodeURIComponent(userId)))
                            ];
                        case 2:
                            response = _state.sent();
                            return [
                                4,
                                response.json()
                            ];
                        case 3:
                            payload = _state.sent();
                            if (!response.ok) throw new Error((payload === null || payload === void 0 ? void 0 : payload.error) || "Unable to load credits.");
                            if (mounted) setHeaderCreditBalance(Number((payload === null || payload === void 0 ? void 0 : payload.balance) || 0));
                            return [
                                3,
                                6
                            ];
                        case 4:
                            unused = _state.sent();
                            if (mounted) setHeaderCreditBalance(0);
                            return [
                                3,
                                6
                            ];
                        case 5:
                            if (mounted) setHeaderCreditsLoading(false);
                            return [
                                7
                            ];
                        case 6:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        void loadHeaderCredits();
        return function() {
            mounted = false;
        };
    }, [
        user === null || user === void 0 ? void 0 : user.id,
        profile.id,
        profile.role,
        (_profile_premiumProfile = profile.premiumProfile) === null || _profile_premiumProfile === void 0 ? void 0 : _profile_premiumProfile.tier
    ]);
    var _useState35 = _sliced_to_array(useState(false), 2), isSaving = _useState35[0], setIsSaving = _useState35[1];
    var _useState36 = _sliced_to_array(useState(false), 2), isVetting = _useState36[0], setIsVetting = _useState36[1];
    var _useState37 = _sliced_to_array(useState(null), 2), vettingData = _useState37[0], setVettingData = _useState37[1];
    var _useState38 = _sliced_to_array(useState("overview"), 2), freelancerTab = _useState38[0], setFreelancerTab = _useState38[1];
    var _useState39 = _sliced_to_array(useState("overview"), 2), clientTab = _useState39[0], setClientTab = _useState39[1];
    useEffect(function() {
        var params = new URLSearchParams(window.location.search);
        var applyId = params.get("apply");
        if (!applyId) return;
        setFreelancerTab("jobs");
        setPendingApplyJobId(applyId);
    }, []);
    var fetchProfile = function fetchProfile(userId, userAuth, prevProfile) {
        return _async_to_generator(function() {
            var _ref, data, error, normalizedData, portfolioItems, _ref1, pData, pErr, _premiumProfile_verifiedBadge, _premiumProfile_advancedPortfolio, _premiumProfile_featuredPlacement, _premiumProfile_analyticsEnabled, _premiumProfile_billing, _premiumProfile_billing1, _premiumProfile_billing2, _premiumProfile_billing3, _premiumProfile_billing4, _premiumProfile_billing5, _premiumProfile_billing6, _premiumProfile_billing7, _premiumProfile_analytics, _premiumProfile_analytics1, _premiumProfile_verifiedProgram, _premiumProfile_verifiedProgram1, _premiumProfile_verifiedProgram2, _premiumProfile_verifiedProgram3, _premiumProfile_verifiedProgram4, _premiumProfile_verifiedProgram5, themeSettings, premiumProfile, proExpiryRaw, proExpiryDate, hasValidProExpiry, isProExpired, isActivePro, _ref2, oldData, pFetchErr, _ref3, lastResort, _userAuth_user_metadata, _userAuth_user_metadata1, _userAuth_email, role, initialData, _ref4, insertError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            13,
                            ,
                            14
                        ]);
                        return [
                            4,
                            supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (error && error.code !== 'PGRST116') {
                            if (error.message.includes("relation \"profiles\" does not exist") || error.code === 'PGRST205' || error.message.includes("Could not find the table")) {
                                setDbError(true);
                                setMissingTables(function(prev) {
                                    return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                        "profiles"
                                    ])));
                                });
                                setToastMsg("⚠️ Database Setup Required: The 'profiles' table is missing. Go to Admin tab for setup SQL.");
                                setShowToast(true);
                                return [
                                    2
                                ];
                            }
                            throw error;
                        }
                        if (!data) return [
                            3,
                            10
                        ];
                        // Normalize profile data to ensure arrays are not null/undefined
                        normalizedData = _object_spread_props(_object_spread({}, data), {
                            skills: Array.isArray(data.skills) ? data.skills : [],
                            verifiedSkills: Array.isArray(data.verifiedSkills) ? data.verifiedSkills : [],
                            softSkills: Array.isArray(data.softSkills) ? data.softSkills : prevProfile ? prevProfile.softSkills : [],
                            activeProjects: Array.isArray(data.activeProjects) ? data.activeProjects : [],
                            workflows: Array.isArray(data.workflows) ? data.workflows : [],
                            premiumProfile: (prevProfile === null || prevProfile === void 0 ? void 0 : prevProfile.premiumProfile) || {
                                tier: "free",
                                analytics: {
                                    profileViews: 0,
                                    clientClicks: 0
                                },
                                verifiedProgram: {
                                    enrolled: false,
                                    annualFee: 499,
                                    identityVerified: false,
                                    portfolioVerified: false,
                                    higherSearchRanking: false,
                                    clientTrustBoost: false
                                }
                            }
                        });
                        // --- SMART PORTFOLIO FETCHING ---
                        portfolioItems = [];
                        _state.label = 2;
                    case 2:
                        _state.trys.push([
                            2,
                            7,
                            ,
                            9
                        ]);
                        return [
                            4,
                            supabase.from('portfolios').select("\n              id,\n              about_me,\n              tagline,\n              custom_domain,\n              theme_settings,\n              portfolio_projects (*)\n            ").eq('profile_id', userId).maybeSingle()
                        ];
                    case 3:
                        _ref1 = _state.sent(), pData = _ref1.data, pErr = _ref1.error;
                        if (!(!pErr && pData)) return [
                            3,
                            4
                        ];
                        if (Array.isArray(pData.portfolio_projects) && pData.portfolio_projects.length > 0) {
                            portfolioItems = pData.portfolio_projects.map(function(proj) {
                                return {
                                    id: proj.id,
                                    profile_id: userId,
                                    title: proj.title,
                                    description: proj.description,
                                    image_url: proj.image_url,
                                    project_url: proj.project_url,
                                    technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
                                    created_at: proj.created_at
                                };
                            });
                        }
                        themeSettings = pData.theme_settings && _type_of(pData.theme_settings) === "object" ? pData.theme_settings : {};
                        premiumProfile = themeSettings.premiumProfile && _type_of(themeSettings.premiumProfile) === "object" ? themeSettings.premiumProfile : {};
                        proExpiryRaw = typeof ((_premiumProfile_billing = premiumProfile.billing) === null || _premiumProfile_billing === void 0 ? void 0 : _premiumProfile_billing.proExpiresAt) === "string" ? premiumProfile.billing.proExpiresAt : "";
                        proExpiryDate = proExpiryRaw ? new Date(proExpiryRaw) : null;
                        hasValidProExpiry = !!proExpiryDate && !Number.isNaN(proExpiryDate.getTime());
                        isProExpired = premiumProfile.tier === "pro" && hasValidProExpiry && !!proExpiryDate && proExpiryDate.getTime() <= Date.now();
                        isActivePro = premiumProfile.tier === "pro" && !isProExpired;
                        normalizedData.bio = pData.about_me || normalizedData.bio;
                        normalizedData.premiumProfile = {
                            tier: isActivePro ? "pro" : "free",
                            verifiedBadge: (_premiumProfile_verifiedBadge = premiumProfile.verifiedBadge) !== null && _premiumProfile_verifiedBadge !== void 0 ? _premiumProfile_verifiedBadge : isActivePro,
                            advancedPortfolio: (_premiumProfile_advancedPortfolio = premiumProfile.advancedPortfolio) !== null && _premiumProfile_advancedPortfolio !== void 0 ? _premiumProfile_advancedPortfolio : isActivePro,
                            featuredPlacement: isActivePro ? (_premiumProfile_featuredPlacement = premiumProfile.featuredPlacement) !== null && _premiumProfile_featuredPlacement !== void 0 ? _premiumProfile_featuredPlacement : false : false,
                            analyticsEnabled: isActivePro ? (_premiumProfile_analyticsEnabled = premiumProfile.analyticsEnabled) !== null && _premiumProfile_analyticsEnabled !== void 0 ? _premiumProfile_analyticsEnabled : false : false,
                            customDomain: isActivePro ? pData.custom_domain || premiumProfile.customDomain || getPremiumProfileDomain(normalizedData.username, normalizedData.id) : "",
                            videoIntroUrl: isActivePro ? premiumProfile.videoIntroUrl || "" : "",
                            introHeadline: premiumProfile.introHeadline || pData.tagline || "",
                            billing: {
                                proStatus: isProExpired ? "inactive" : ((_premiumProfile_billing1 = premiumProfile.billing) === null || _premiumProfile_billing1 === void 0 ? void 0 : _premiumProfile_billing1.proStatus) === "active" || ((_premiumProfile_billing2 = premiumProfile.billing) === null || _premiumProfile_billing2 === void 0 ? void 0 : _premiumProfile_billing2.proStatus) === "past_due" || ((_premiumProfile_billing3 = premiumProfile.billing) === null || _premiumProfile_billing3 === void 0 ? void 0 : _premiumProfile_billing3.proStatus) === "cancelled" ? premiumProfile.billing.proStatus : "inactive",
                                proLocked: isProExpired ? false : !!((_premiumProfile_billing4 = premiumProfile.billing) === null || _premiumProfile_billing4 === void 0 ? void 0 : _premiumProfile_billing4.proLocked),
                                proLastEvent: ((_premiumProfile_billing5 = premiumProfile.billing) === null || _premiumProfile_billing5 === void 0 ? void 0 : _premiumProfile_billing5.proLastEvent) || "",
                                proUpdatedAt: ((_premiumProfile_billing6 = premiumProfile.billing) === null || _premiumProfile_billing6 === void 0 ? void 0 : _premiumProfile_billing6.proUpdatedAt) || "",
                                proActivatedAt: ((_premiumProfile_billing7 = premiumProfile.billing) === null || _premiumProfile_billing7 === void 0 ? void 0 : _premiumProfile_billing7.proActivatedAt) || "",
                                proExpiresAt: proExpiryRaw
                            },
                            analytics: {
                                profileViews: Number(((_premiumProfile_analytics = premiumProfile.analytics) === null || _premiumProfile_analytics === void 0 ? void 0 : _premiumProfile_analytics.profileViews) || 0),
                                clientClicks: Number(((_premiumProfile_analytics1 = premiumProfile.analytics) === null || _premiumProfile_analytics1 === void 0 ? void 0 : _premiumProfile_analytics1.clientClicks) || 0)
                            },
                            verifiedProgram: {
                                enrolled: !!((_premiumProfile_verifiedProgram = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram === void 0 ? void 0 : _premiumProfile_verifiedProgram.enrolled),
                                annualFee: Number(((_premiumProfile_verifiedProgram1 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram1 === void 0 ? void 0 : _premiumProfile_verifiedProgram1.annualFee) || 499),
                                identityVerified: !!((_premiumProfile_verifiedProgram2 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram2 === void 0 ? void 0 : _premiumProfile_verifiedProgram2.identityVerified),
                                portfolioVerified: !!((_premiumProfile_verifiedProgram3 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram3 === void 0 ? void 0 : _premiumProfile_verifiedProgram3.portfolioVerified),
                                higherSearchRanking: !!((_premiumProfile_verifiedProgram4 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram4 === void 0 ? void 0 : _premiumProfile_verifiedProgram4.higherSearchRanking),
                                clientTrustBoost: !!((_premiumProfile_verifiedProgram5 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram5 === void 0 ? void 0 : _premiumProfile_verifiedProgram5.clientTrustBoost)
                            }
                        };
                        return [
                            3,
                            6
                        ];
                    case 4:
                        if (pErr) console.warn("Note: Portfolios table might be missing or empty, falling back:", pErr.message);
                        return [
                            4,
                            supabase.from('portfolio_items').select('*').eq('profile_id', userId)
                        ];
                    case 5:
                        _ref2 = _state.sent(), oldData = _ref2.data;
                        if (oldData && oldData.length > 0) {
                            portfolioItems = oldData;
                        }
                        _state.label = 6;
                    case 6:
                        return [
                            3,
                            9
                        ];
                    case 7:
                        pFetchErr = _state.sent();
                        console.error("New portfolio fetch error, falling back:", pFetchErr);
                        return [
                            4,
                            supabase.from('portfolio_items').select('*').eq('profile_id', userId)
                        ];
                    case 8:
                        _ref3 = _state.sent(), lastResort = _ref3.data;
                        portfolioItems = lastResort || [];
                        return [
                            3,
                            9
                        ];
                    case 9:
                        setProfile(_object_spread_props(_object_spread({}, normalizedData), {
                            portfolio: portfolioItems
                        }));
                        if (normalizedData.role === 'employer') {
                            setView('client');
                        } else if (normalizedData.role === 'admin') {
                            setView('admin');
                        } else {
                            setView('freelancer');
                        }
                        return [
                            3,
                            12
                        ];
                    case 10:
                        // Create initial profile if it doesn't exist
                        role = (userAuth === null || userAuth === void 0 ? void 0 : (_userAuth_user_metadata = userAuth.user_metadata) === null || _userAuth_user_metadata === void 0 ? void 0 : _userAuth_user_metadata.role) || "freelancer";
                        initialData = {
                            id: userId,
                            name: (userAuth === null || userAuth === void 0 ? void 0 : (_userAuth_user_metadata1 = userAuth.user_metadata) === null || _userAuth_user_metadata1 === void 0 ? void 0 : _userAuth_user_metadata1.full_name) || (userAuth === null || userAuth === void 0 ? void 0 : (_userAuth_email = userAuth.email) === null || _userAuth_email === void 0 ? void 0 : _userAuth_email.split('@')[0]) || "User",
                            role: role,
                            category: "Developer",
                            skills: [],
                            hourlyRate: "$0",
                            bio: "",
                            premiumProfile: {
                                tier: "free",
                                analytics: {
                                    profileViews: 0,
                                    clientClicks: 0
                                },
                                verifiedProgram: {
                                    enrolled: false,
                                    annualFee: 499,
                                    identityVerified: false,
                                    portfolioVerified: false,
                                    higherSearchRanking: false,
                                    clientTrustBoost: false
                                }
                            }
                        };
                        return [
                            4,
                            supabase.from('profiles').insert([
                                initialData
                            ])
                        ];
                    case 11:
                        _ref4 = _state.sent(), insertError = _ref4.error;
                        if (insertError) {
                            if (insertError.code === 'PGRST205' || insertError.message.includes('relation')) {
                                setDbError(true);
                                setMissingTables(function(prev) {
                                    return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                        "profiles"
                                    ])));
                                });
                            } else {
                                console.error("Error creating profile:", insertError);
                            }
                        }
                        setProfile(function(prev) {
                            return _object_spread({}, prev, initialData);
                        });
                        if (role === 'employer') setView('client');
                        else if (role === 'admin') setView('admin');
                        else setView('freelancer');
                        _state.label = 12;
                    case 12:
                        return [
                            3,
                            14
                        ];
                    case 13:
                        err = _state.sent();
                        if ((err === null || err === void 0 ? void 0 : err.code) !== 'PGRST205') {
                            console.warn("Profile fetch issue:", err);
                        }
                        return [
                            3,
                            14
                        ];
                    case 14:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleProfileSave = function handleProfileSave(updatedProfile) {
        return _async_to_generator(function() {
            var nextProfile, dbColumns, profileToSave, error, _error_message, workflows, profileWithoutWorkflows, _ref, retryError, _existingPortfolio_data, _currentPremiumProfile_billing, _currentPremiumProfile_billing1, _currentPremiumProfile_billing2, _currentPremiumProfile_billing3, _currentPremiumProfile_billing4, _currentPremiumProfile_billing5, _currentPremiumProfile_billing6, _currentPremiumProfile_billing7, _currentPremiumProfile_billing8, _premiumProfile_analytics, _premiumProfile_analytics1, _premiumProfile_verifiedProgram, _premiumProfile_verifiedProgram1, _premiumProfile_verifiedProgram2, _premiumProfile_verifiedProgram3, _premiumProfile_verifiedProgram4, _premiumProfile_verifiedProgram5, _existingPortfolio_data1, premiumProfile, existingPortfolio, currentThemeSettings, currentPremiumProfile, currentProExpiryRaw, currentProExpiry, hasValidCurrentProExpiry, isExpiredBillingPro, isBillingLockedPro, requestedTier, finalTier, resolvedCustomDomain, normalizedBilling, portfolioPayload, _ref1, portfolioUpdateError, _ref2, portfolioInsertError, err, _err_message;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!user) return [
                            2
                        ];
                        setIsSaving(true);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            11,
                            12,
                            13
                        ]);
                        nextProfile = updatedProfile;
                        // List of columns that definitely exist in the profiles table base on supabase_schema.sql
                        dbColumns = [
                            'id',
                            'name',
                            'role',
                            'category',
                            'skills',
                            'hourlyRate',
                            'bio',
                            'avatar_url',
                            'companyName',
                            'verifiedSkills',
                            'softSkills',
                            'activeProjects',
                            'squad',
                            'aiInsights',
                            'ranking',
                            'status',
                            'verification_documents',
                            'wellness',
                            'updated_at',
                            'username',
                            'referring_freelancer_id',
                            'workflows'
                        ];
                        // Create a clean object with only database-compatible fields
                        profileToSave = {};
                        // Only copy properties that are in our dbColumns list
                        Object.keys(nextProfile).forEach(function(key) {
                            if (dbColumns.includes(key) && nextProfile[key] !== undefined) {
                                profileToSave[key] = nextProfile[key];
                            }
                        });
                        // Always add updated_at
                        profileToSave.updated_at = new Date().toISOString();
                        return [
                            4,
                            supabase.from('profiles').upsert(_object_spread({
                                id: user.id
                            }, profileToSave))
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (!error) return [
                            3,
                            5
                        ];
                        if (!(((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes("'workflows' column")) || error.code === 'PGRST204')) return [
                            3,
                            4
                        ];
                        console.warn("Retrying profile save without workflows column...");
                        workflows = profileToSave.workflows, profileWithoutWorkflows = _object_without_properties(profileToSave, [
                            "workflows"
                        ]);
                        return [
                            4,
                            supabase.from('profiles').upsert(_object_spread({
                                id: user.id
                            }, profileWithoutWorkflows))
                        ];
                    case 3:
                        _ref = _state.sent(), retryError = _ref.error;
                        if (retryError) throw retryError;
                        return [
                            3,
                            5
                        ];
                    case 4:
                        throw error;
                    case 5:
                        if (!(nextProfile.role === "freelancer")) return [
                            3,
                            10
                        ];
                        premiumProfile = nextProfile.premiumProfile || {
                            tier: "free",
                            analytics: {
                                profileViews: 0,
                                clientClicks: 0
                            }
                        };
                        return [
                            4,
                            supabase.from("portfolios").select("id, theme_settings").eq("profile_id", user.id).maybeSingle()
                        ];
                    case 6:
                        existingPortfolio = _state.sent();
                        if (existingPortfolio.error && existingPortfolio.error.code !== "PGRST116") {
                            throw existingPortfolio.error;
                        }
                        currentThemeSettings = ((_existingPortfolio_data = existingPortfolio.data) === null || _existingPortfolio_data === void 0 ? void 0 : _existingPortfolio_data.theme_settings) && _type_of(existingPortfolio.data.theme_settings) === "object" ? existingPortfolio.data.theme_settings : {
                            aesthetic: "professional",
                            primaryColor: "#4f46e5"
                        };
                        currentPremiumProfile = currentThemeSettings.premiumProfile && _type_of(currentThemeSettings.premiumProfile) === "object" ? currentThemeSettings.premiumProfile : {};
                        currentProExpiryRaw = typeof ((_currentPremiumProfile_billing = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing === void 0 ? void 0 : _currentPremiumProfile_billing.proExpiresAt) === "string" ? currentPremiumProfile.billing.proExpiresAt : "";
                        currentProExpiry = currentProExpiryRaw ? new Date(currentProExpiryRaw) : null;
                        hasValidCurrentProExpiry = !!currentProExpiry && !Number.isNaN(currentProExpiry.getTime());
                        isExpiredBillingPro = currentPremiumProfile.tier === "pro" && hasValidCurrentProExpiry && !!currentProExpiry && currentProExpiry.getTime() <= Date.now();
                        isBillingLockedPro = currentPremiumProfile.tier === "pro" && !!((_currentPremiumProfile_billing1 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing1 === void 0 ? void 0 : _currentPremiumProfile_billing1.proLocked) && !isExpiredBillingPro;
                        requestedTier = premiumProfile.tier === "pro" ? "pro" : "free";
                        finalTier = isExpiredBillingPro ? "free" : isBillingLockedPro && requestedTier === "free" ? "pro" : requestedTier;
                        resolvedCustomDomain = finalTier === "pro" ? getPremiumProfileDomain(nextProfile.username, nextProfile.id || user.id) : "";
                        normalizedBilling = {
                            proStatus: isExpiredBillingPro ? "inactive" : ((_currentPremiumProfile_billing2 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing2 === void 0 ? void 0 : _currentPremiumProfile_billing2.proStatus) === "active" || ((_currentPremiumProfile_billing3 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing3 === void 0 ? void 0 : _currentPremiumProfile_billing3.proStatus) === "past_due" || ((_currentPremiumProfile_billing4 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing4 === void 0 ? void 0 : _currentPremiumProfile_billing4.proStatus) === "cancelled" ? currentPremiumProfile.billing.proStatus : "inactive",
                            proLocked: isExpiredBillingPro ? false : !!((_currentPremiumProfile_billing5 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing5 === void 0 ? void 0 : _currentPremiumProfile_billing5.proLocked),
                            proLastEvent: ((_currentPremiumProfile_billing6 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing6 === void 0 ? void 0 : _currentPremiumProfile_billing6.proLastEvent) || "",
                            proUpdatedAt: ((_currentPremiumProfile_billing7 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing7 === void 0 ? void 0 : _currentPremiumProfile_billing7.proUpdatedAt) || "",
                            proActivatedAt: ((_currentPremiumProfile_billing8 = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing8 === void 0 ? void 0 : _currentPremiumProfile_billing8.proActivatedAt) || "",
                            proExpiresAt: currentProExpiryRaw
                        };
                        portfolioPayload = {
                            profile_id: user.id,
                            about_me: nextProfile.bio,
                            tagline: premiumProfile.introHeadline || null,
                            custom_domain: finalTier === "pro" ? resolvedCustomDomain : null,
                            theme_settings: _object_spread_props(_object_spread({}, currentThemeSettings), {
                                aesthetic: currentThemeSettings.aesthetic || "professional",
                                primaryColor: currentThemeSettings.primaryColor || "#4f46e5",
                                premiumProfile: _object_spread_props(_object_spread({}, currentPremiumProfile), {
                                    tier: finalTier,
                                    verifiedBadge: finalTier === "pro" ? premiumProfile.verifiedBadge !== false : false,
                                    advancedPortfolio: finalTier === "pro" ? premiumProfile.advancedPortfolio !== false : false,
                                    featuredPlacement: finalTier === "pro" ? !!premiumProfile.featuredPlacement : false,
                                    analyticsEnabled: finalTier === "pro" ? !!premiumProfile.analyticsEnabled : false,
                                    customDomain: resolvedCustomDomain,
                                    videoIntroUrl: finalTier === "pro" ? premiumProfile.videoIntroUrl || "" : "",
                                    introHeadline: premiumProfile.introHeadline || "",
                                    billing: normalizedBilling,
                                    analytics: {
                                        profileViews: Number(((_premiumProfile_analytics = premiumProfile.analytics) === null || _premiumProfile_analytics === void 0 ? void 0 : _premiumProfile_analytics.profileViews) || 0),
                                        clientClicks: Number(((_premiumProfile_analytics1 = premiumProfile.analytics) === null || _premiumProfile_analytics1 === void 0 ? void 0 : _premiumProfile_analytics1.clientClicks) || 0)
                                    },
                                    verifiedProgram: {
                                        enrolled: !!((_premiumProfile_verifiedProgram = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram === void 0 ? void 0 : _premiumProfile_verifiedProgram.enrolled),
                                        annualFee: Number(((_premiumProfile_verifiedProgram1 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram1 === void 0 ? void 0 : _premiumProfile_verifiedProgram1.annualFee) || 499),
                                        identityVerified: !!((_premiumProfile_verifiedProgram2 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram2 === void 0 ? void 0 : _premiumProfile_verifiedProgram2.identityVerified),
                                        portfolioVerified: !!((_premiumProfile_verifiedProgram3 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram3 === void 0 ? void 0 : _premiumProfile_verifiedProgram3.portfolioVerified),
                                        higherSearchRanking: !!((_premiumProfile_verifiedProgram4 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram4 === void 0 ? void 0 : _premiumProfile_verifiedProgram4.higherSearchRanking),
                                        clientTrustBoost: !!((_premiumProfile_verifiedProgram5 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram5 === void 0 ? void 0 : _premiumProfile_verifiedProgram5.clientTrustBoost)
                                    }
                                })
                            }),
                            updated_at: new Date().toISOString()
                        };
                        if (isBillingLockedPro && requestedTier === "free" && !isExpiredBillingPro) {
                            nextProfile = _object_spread_props(_object_spread({}, nextProfile), {
                                premiumProfile: _object_spread_props(_object_spread({}, nextProfile.premiumProfile || {}, portfolioPayload.theme_settings.premiumProfile), {
                                    tier: "pro"
                                })
                            });
                        }
                        if (!((_existingPortfolio_data1 = existingPortfolio.data) === null || _existingPortfolio_data1 === void 0 ? void 0 : _existingPortfolio_data1.id)) return [
                            3,
                            8
                        ];
                        return [
                            4,
                            supabase.from("portfolios").update(portfolioPayload).eq("id", existingPortfolio.data.id)
                        ];
                    case 7:
                        _ref1 = _state.sent(), portfolioUpdateError = _ref1.error;
                        if (portfolioUpdateError) {
                            throw portfolioUpdateError;
                        }
                        return [
                            3,
                            10
                        ];
                    case 8:
                        return [
                            4,
                            supabase.from("portfolios").insert([
                                portfolioPayload
                            ])
                        ];
                    case 9:
                        _ref2 = _state.sent(), portfolioInsertError = _ref2.error;
                        if (portfolioInsertError) {
                            throw portfolioInsertError;
                        }
                        _state.label = 10;
                    case 10:
                        setProfile(nextProfile);
                        if (nextProfile.role === 'employer') {
                            setView('client');
                        } else if (nextProfile.role === 'admin') {
                            setView('admin');
                        } else {
                            setView('freelancer');
                        }
                        setToastMsg("Profile saved successfully to database!");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            13
                        ];
                    case 11:
                        err = _state.sent();
                        console.error("Error saving profile:", err);
                        if (err.code === '23505') {
                            setToastMsg("⚠️ Error: Username is already taken. Please choose another one.");
                        } else if (err.code === 'PGRST205' || ((_err_message = err.message) === null || _err_message === void 0 ? void 0 : _err_message.includes("relation \"profiles\" does not exist"))) {
                            setToastMsg("⚠️ Database Error: 'profiles' table not found. Go to Admin tab for setup instructions.");
                        } else {
                            setToastMsg("Error: ".concat(err.message || "Failed to save profile"));
                        }
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 6000);
                        return [
                            3,
                            13
                        ];
                    case 12:
                        setIsSaving(false);
                        return [
                            7
                        ];
                    case 13:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleUpdateProject = function handleUpdateProject(updatedProject) {
        return _async_to_generator(function() {
            var updatedProjects, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile.activeProjects || !user) return [
                            2
                        ];
                        updatedProjects = profile.activeProjects.map(function(p) {
                            return p.id === updatedProject.id ? updatedProject : p;
                        });
                        // Update local state immediately (Optimistic)
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                activeProjects: updatedProjects
                            });
                        });
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            supabase.from('profiles').update({
                                activeProjects: updatedProjects,
                                updated_at: new Date().toISOString()
                            }).eq('id', user.id)
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        return [
                            3,
                            4
                        ];
                    case 3:
                        err = _state.sent();
                        console.error("Error updating project:", err);
                        setToastMsg("Failed to sync project update to database.");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleCreateProject = function handleCreateProject(newProject) {
        return _async_to_generator(function() {
            var updatedProjects, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile || !user) return [
                            2
                        ];
                        updatedProjects = _to_consumable_array(profile.activeProjects || []).concat([
                            newProject
                        ]);
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                activeProjects: updatedProjects
                            });
                        });
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            supabase.from('profiles').update({
                                activeProjects: updatedProjects,
                                updated_at: new Date().toISOString()
                            }).eq('id', user.id)
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        setToastMsg("Project initialized successfully!");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 3:
                        err = _state.sent();
                        console.error("Error creating project:", err);
                        setToastMsg("Failed to sync new project to database.");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleCreateSquad = function handleCreateSquad(newSquad) {
        return _async_to_generator(function() {
            var error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile || !user) return [
                            2
                        ];
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                squad: newSquad
                            });
                        });
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            supabase.from('profiles').update({
                                squad: newSquad,
                                updated_at: new Date().toISOString()
                            }).eq('id', user.id)
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        setToastMsg("Squad formed successfully!");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 3:
                        err = _state.sent();
                        console.error("Error creating squad:", err);
                        setToastMsg("Failed to sync squad to database.");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleUpdateSquad = function handleUpdateSquad(updatedSquad) {
        return _async_to_generator(function() {
            var error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile || !user) return [
                            2
                        ];
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                squad: updatedSquad
                            });
                        });
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            supabase.from('profiles').update({
                                squad: updatedSquad,
                                updated_at: new Date().toISOString()
                            }).eq('id', user.id)
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        setToastMsg("Squad updated successfully!");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 3:
                        err = _state.sent();
                        console.error("Error updating squad:", err);
                        setToastMsg("Failed to update squad in database.");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleUpdateWorkflows = function handleUpdateWorkflows(updatedWorkflows) {
        return _async_to_generator(function() {
            var error, _error_message, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile || !user) return [
                            2
                        ];
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                workflows: updatedWorkflows
                            });
                        });
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            supabase.from('profiles').update({
                                workflows: updatedWorkflows,
                                updated_at: new Date().toISOString()
                            }).eq('id', user.id)
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) {
                            ;
                            if (((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes("'workflows' column")) || error.code === 'PGRST204') {
                                console.warn("Skipping workflows sync as column doesn't exist in DB");
                                return [
                                    2
                                ];
                            }
                            throw error;
                        }
                        return [
                            3,
                            4
                        ];
                    case 3:
                        err = _state.sent();
                        console.error("Error updating workflows:", err);
                        setToastMsg("Failed to sync workflows to database.");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchJobs = function fetchJobs() {
        return _async_to_generator(function() {
            var _ref, data, error, formattedJobs, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('jobs').select('*').order('createdAt', {
                                ascending: false
                            })
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (error) {
                            if (error.message.includes("relation \"jobs\" does not exist") || error.code === 'PGRST205' || error.message.includes("Could not find the table")) {
                                setDbError(true);
                                setMissingTables(function(prev) {
                                    return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                        "jobs"
                                    ])));
                                });
                                console.warn("Table 'jobs' not found. Please run the SQL setup script.");
                            } else if (error.code !== 'PGRST116') {
                                console.warn("Jobs fetch issue:", error);
                            }
                            return [
                                2
                            ];
                        }
                        if (data && data.length > 0) {
                            formattedJobs = data.map(function(job) {
                                return _object_spread_props(_object_spread({}, job), {
                                    energyRequirement: job.energy_requirement || "Balanced",
                                    paymentMethod: job.paymentMethod || "Flat-Rate",
                                    jobType: job.jobType || "Contract"
                                });
                            });
                            setJobs(formattedJobs);
                        } else {
                            setJobs([]);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        if ((err === null || err === void 0 ? void 0 : err.code) !== 'PGRST205') {
                            console.warn("Jobs fetch issue:", err);
                        }
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchEmployerJobs = function fetchEmployerJobs(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, formattedJobs, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('jobs').select('*, applications(count)').eq('employer_id', userId).order('createdAt', {
                                ascending: false
                            })
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (error) {
                            console.warn("Employer jobs fetch issue:", error);
                            return [
                                2
                            ];
                        }
                        if (data) {
                            formattedJobs = data.map(function(job) {
                                var _job_applications_, _job_applications;
                                return _object_spread_props(_object_spread({}, job), {
                                    applicantCount: ((_job_applications = job.applications) === null || _job_applications === void 0 ? void 0 : (_job_applications_ = _job_applications[0]) === null || _job_applications_ === void 0 ? void 0 : _job_applications_.count) || 0,
                                    energyRequirement: job.energy_requirement || "Balanced",
                                    paymentMethod: job.paymentMethod || "Flat-Rate",
                                    jobType: job.jobType || "Contract"
                                });
                            });
                            setemployerJobs(formattedJobs);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.warn("Unexpected employer jobs fetch issue:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    // Tracking missing columns to avoid future errors
    var _useState40 = _sliced_to_array(useState([]), 2), missingColumns = _useState40[0], setMissingColumns = _useState40[1];
    var fetchApplicants = function fetchApplicants(jobId, jobTitle) {
        return _async_to_generator(function() {
            var selectString, _ref, data, error, _error_message, _error_message1, _error_message2, _error_message3, _error_message4, _ref1, fallbackData, fallbackError, _ref2, bareData, bareError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setSelectedJobTitle(jobTitle);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            11,
                            ,
                            12
                        ]);
                        // Build select string based on known missing columns
                        selectString = '*';
                        if (missingColumns.length > 0) {
                            // If we know some columns are missing, we should probably just use a safe list
                            // but for now, let's try to be specific if we can or just use the fallback logic
                            selectString = 'id, job_id, freelancer_id, status, created_at, profiles(*)';
                            if (!missingColumns.includes('resume_url')) selectString += ', resume_url';
                            if (!missingColumns.includes('portfolio_url')) selectString += ', portfolio_url';
                            if (!missingColumns.includes('interview_url')) selectString += ', interview_url';
                            if (!missingColumns.includes('cover_letter')) selectString += ', cover_letter';
                        }
                        return [
                            4,
                            supabase.from('applications').select(selectString).eq('job_id', jobId).order('created_at', {
                                ascending: false
                            })
                        ];
                    case 2:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error) return [
                            3,
                            9
                        ];
                        if (!(error.code === 'PGRST204' || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes('column')))) return [
                            3,
                            7
                        ];
                        console.warn("Schema mismatch detected, attempting fallback fetch for applications:", error.message);
                        // Identify missing column from error message if possible
                        if ((_error_message1 = error.message) === null || _error_message1 === void 0 ? void 0 : _error_message1.includes('portfolio_url')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'portfolio_url'
                            ])));
                        });
                        if ((_error_message2 = error.message) === null || _error_message2 === void 0 ? void 0 : _error_message2.includes('interview_url')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'interview_url'
                            ])));
                        });
                        if ((_error_message3 = error.message) === null || _error_message3 === void 0 ? void 0 : _error_message3.includes('resume_url')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'resume_url'
                            ])));
                        });
                        if ((_error_message4 = error.message) === null || _error_message4 === void 0 ? void 0 : _error_message4.includes('seeker_id')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'seeker_id'
                            ])));
                        });
                        return [
                            4,
                            supabase.from('applications').select('id, job_id, freelancer_id, status, created_at, profiles(*)').eq('job_id', jobId).order('created_at', {
                                ascending: false
                            })
                        ];
                    case 3:
                        _ref1 = _state.sent(), fallbackData = _ref1.data, fallbackError = _ref1.error;
                        if (!fallbackError) return [
                            3,
                            5
                        ];
                        return [
                            4,
                            supabase.from('applications').select('id, job_id, freelancer_id, status, created_at').eq('job_id', jobId).order('created_at', {
                                ascending: false
                            })
                        ];
                    case 4:
                        _ref2 = _state.sent(), bareData = _ref2.data, bareError = _ref2.error;
                        if (bareError) throw bareError;
                        setSelectedJobApplicants(bareData || []);
                        return [
                            3,
                            6
                        ];
                    case 5:
                        setSelectedJobApplicants(fallbackData || []);
                        _state.label = 6;
                    case 6:
                        return [
                            3,
                            8
                        ];
                    case 7:
                        throw error;
                    case 8:
                        return [
                            3,
                            10
                        ];
                    case 9:
                        setSelectedJobApplicants(data || []);
                        _state.label = 10;
                    case 10:
                        setShowApplicantsModal(true);
                        return [
                            3,
                            12
                        ];
                    case 11:
                        err = _state.sent();
                        console.error("Error fetching applicants:", err);
                        setToastMsg("Failed to load applicants: ".concat(err.message));
                        setShowToast(true);
                        return [
                            3,
                            12
                        ];
                    case 12:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchAppliedJobs = function fetchAppliedJobs(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, apps, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('applications').select('job_id, status').eq('freelancer_id', userId)
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error && data) {
                            apps = data.reduce(function(acc, app) {
                                acc[app.job_id] = app.status;
                                return acc;
                            }, {});
                            setAppliedJobs(apps);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error fetching applied jobs:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleApply = function handleApply(jobId) {
        if (!user) {
            setToastMsg("Please login to apply for jobs.");
            setShowToast(true);
            return;
        }
        setSelectedJobIdForApply(jobId);
        setShowApplyModal(true);
    };
    var startUpgradeCheckout = function startUpgradeCheckout(productType) {
        return _async_to_generator(function() {
            var response, payload, error, message;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile.id) {
                            setToastMsg("Save your profile first so billing can link to your account.");
                            setShowToast(true);
                            return [
                                2
                            ];
                        }
                        setPlanCheckoutLoading(productType);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            4,
                            5,
                            6
                        ]);
                        return [
                            4,
                            fetch("/api/paymongo/checkout", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    productType: productType,
                                    userId: profile.id,
                                    name: profile.name
                                })
                            })
                        ];
                    case 2:
                        response = _state.sent();
                        return [
                            4,
                            response.json()
                        ];
                    case 3:
                        payload = _state.sent();
                        if (!response.ok || !payload.checkoutUrl) {
                            throw new Error(payload.error || "Unable to start checkout.");
                        }
                        window.location.href = payload.checkoutUrl;
                        return [
                            3,
                            6
                        ];
                    case 4:
                        error = _state.sent();
                        message = _instanceof(error, Error) ? error.message : "Unable to start checkout.";
                        setToastMsg(message);
                        setShowToast(true);
                        return [
                            3,
                            6
                        ];
                    case 5:
                        setPlanCheckoutLoading(null);
                        return [
                            7
                        ];
                    case 6:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    useEffect(function() {
        if (!pendingApplyJobId || jobs.length === 0) return;
        var selectedJob = jobs.find(function(job) {
            return job.id === pendingApplyJobId;
        });
        if (!selectedJob) {
            setPendingApplyJobId(null);
            return;
        }
        setFreelancerTab("jobs");
        if (profile.role !== "freelancer") {
            setToastMsg("Only freelancer accounts can apply for jobs.");
            setShowToast(true);
        } else {
            handleApply(selectedJob.id);
        }
        var url = new URL(window.location.href);
        url.searchParams.delete("apply");
        window.history.replaceState({}, document.title, url.toString());
        setPendingApplyJobId(null);
    }, [
        pendingApplyJobId,
        jobs,
        profile.role
    ]);
    var submitApplication = function submitApplication() {
        return _async_to_generator(function() {
            var insertData, error, _error_message, _error_message1, _error_message2, _error_message3, _error_message4, _error_message5, _error_message6, minimalData, _ref, retryError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!user || !selectedJobIdForApply) return [
                            2
                        ];
                        if (!applyData.resumeUrl || !applyData.portfolioUrl) {
                            setToastMsg("Please provide both Resume and Portfolio links to proceed.");
                            setShowToast(true);
                            return [
                                2
                            ];
                        }
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            9,
                            10,
                            11
                        ]);
                        setIsSaving(true);
                        insertData = {
                            job_id: selectedJobIdForApply,
                            freelancer_id: user.id,
                            status: 'pending'
                        };
                        // Conditionally add columns based on whether we suspect they are missing
                        if (!missingColumns.includes('seeker_id')) insertData.seeker_id = user.id;
                        if (!missingColumns.includes('resume_url')) insertData.resume_url = applyData.resumeUrl;
                        if (!missingColumns.includes('portfolio_url')) insertData.portfolio_url = applyData.portfolioUrl;
                        if (!missingColumns.includes('cover_letter')) insertData.cover_letter = applyData.coverLetter;
                        // Only add interview_url if it's provided and not known to be missing
                        if (applyData.interviewUrl && !missingColumns.includes('interview_url')) {
                            insertData.interview_url = applyData.interviewUrl;
                        }
                        return [
                            4,
                            supabase.from('applications').insert([
                                insertData
                            ])
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (!error) return [
                            3,
                            7
                        ];
                        if (!(error.code === '23505')) return [
                            3,
                            3
                        ];
                        setToastMsg("You have already applied for this job!");
                        return [
                            3,
                            6
                        ];
                    case 3:
                        if (!(error.code === 'PGRST204' || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes('column')))) return [
                            3,
                            5
                        ];
                        console.warn("Schema mismatch detected, attempting fallback insert for applications:", error.message);
                        // Identify missing column from error message
                        if ((_error_message1 = error.message) === null || _error_message1 === void 0 ? void 0 : _error_message1.includes('portfolio_url')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'portfolio_url'
                            ])));
                        });
                        if ((_error_message2 = error.message) === null || _error_message2 === void 0 ? void 0 : _error_message2.includes('interview_url')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'interview_url'
                            ])));
                        });
                        if ((_error_message3 = error.message) === null || _error_message3 === void 0 ? void 0 : _error_message3.includes('resume_url')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'resume_url'
                            ])));
                        });
                        if ((_error_message4 = error.message) === null || _error_message4 === void 0 ? void 0 : _error_message4.includes('seeker_id')) setMissingColumns(function(prev) {
                            return _to_consumable_array(new Set(_to_consumable_array(prev).concat([
                                'seeker_id'
                            ])));
                        });
                        // Retry with absolute minimal columns
                        minimalData = {
                            job_id: selectedJobIdForApply,
                            freelancer_id: user.id,
                            status: 'pending'
                        };
                        // Add seeker_id only if not the one causing issues
                        if (!((_error_message5 = error.message) === null || _error_message5 === void 0 ? void 0 : _error_message5.includes('seeker_id'))) minimalData.seeker_id = user.id;
                        // Only add cover_letter if provided and not causing issues
                        if (applyData.coverLetter && !((_error_message6 = error.message) === null || _error_message6 === void 0 ? void 0 : _error_message6.includes('cover_letter'))) {
                            minimalData.cover_letter = applyData.coverLetter;
                        }
                        return [
                            4,
                            supabase.from('applications').insert([
                                minimalData
                            ])
                        ];
                    case 4:
                        _ref = _state.sent(), retryError = _ref.error;
                        if (retryError) throw retryError;
                        setAppliedJobs(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), _define_property({}, selectedJobIdForApply, 'pending'));
                        });
                        setToastMsg("Application submitted! (Note: Some advanced fields were skipped because your database schema is not up-to-date)");
                        setShowApplyModal(false);
                        setApplyData({
                            resumeUrl: "",
                            portfolioUrl: "",
                            interviewUrl: "",
                            coverLetter: ""
                        });
                        return [
                            3,
                            6
                        ];
                    case 5:
                        throw error;
                    case 6:
                        return [
                            3,
                            8
                        ];
                    case 7:
                        setAppliedJobs(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), _define_property({}, selectedJobIdForApply, 'pending'));
                        });
                        setToastMsg("Application submitted! employer will review your credentials.");
                        setShowApplyModal(false);
                        setApplyData({
                            resumeUrl: "",
                            portfolioUrl: "",
                            interviewUrl: "",
                            coverLetter: ""
                        });
                        _state.label = 8;
                    case 8:
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        return [
                            3,
                            11
                        ];
                    case 9:
                        err = _state.sent();
                        console.error("Error applying for job:", err);
                        return [
                            3,
                            11
                        ];
                    case 10:
                        setIsSaving(false);
                        return [
                            7
                        ];
                    case 11:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var approveApplication = function approveApplication(applicationId, freelancerId, jobId, jobTitle, budget) {
        return _async_to_generator(function() {
            var _ref, appError, _ref1, escrowError, _ref2, notifError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!user) return [
                            2
                        ];
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            5,
                            6,
                            7
                        ]);
                        setIsSaving(true);
                        return [
                            4,
                            supabase.from('applications').update({
                                status: 'hired'
                            }).eq('id', applicationId)
                        ];
                    case 2:
                        _ref = _state.sent(), appError = _ref.error;
                        if (appError) throw appError;
                        return [
                            4,
                            supabase.from('escrows').insert([
                                {
                                    job_id: jobId,
                                    employer_id: user.id,
                                    freelancer_id: freelancerId,
                                    amount: budget,
                                    status: 'funded',
                                    description: "Budget for ".concat(jobTitle)
                                }
                            ])
                        ];
                    case 3:
                        _ref1 = _state.sent(), escrowError = _ref1.error;
                        if (escrowError) throw escrowError;
                        return [
                            4,
                            supabase.from('notifications').insert([
                                {
                                    user_id: freelancerId,
                                    title: 'Project Approved!',
                                    message: "Congratulations! You have been approved for the project: ".concat(jobTitle, ". Budget is now in escrow."),
                                    type: 'success',
                                    link: '/dashboard'
                                }
                            ])
                        ];
                    case 4:
                        _ref2 = _state.sent(), notifError = _ref2.error;
                        if (notifError) throw notifError;
                        setToastMsg("freelancer approved and budget funded in escrow!");
                        setShowToast(true);
                        // Refresh applicants list locally
                        setSelectedJobApplicants(function(prev) {
                            return prev.map(function(app) {
                                return app.id === applicationId ? _object_spread_props(_object_spread({}, app), {
                                    status: 'hired'
                                }) : app;
                            });
                        });
                        return [
                            3,
                            7
                        ];
                    case 5:
                        err = _state.sent();
                        console.error("Error approving application:", err);
                        setToastMsg("Error: ".concat(err.message || "Failed to approve application"));
                        setShowToast(true);
                        return [
                            3,
                            7
                        ];
                    case 6:
                        setIsSaving(false);
                        return [
                            7
                        ];
                    case 7:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchFreelancers = function fetchFreelancers() {
        return _async_to_generator(function() {
            var _ref, data, error, formatted, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('profiles').select("\n          *,\n          portfolio_items(*)\n        ").eq('role', 'freelancer').order('ranking', {
                                ascending: true
                            }).limit(10)
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (error) {
                            console.warn("Freelancer list fetch issue:", error);
                            return [
                                2
                            ];
                        }
                        if (data) {
                            formatted = data.map(function(f) {
                                return _object_spread_props(_object_spread({}, f), {
                                    portfolio: f.portfolio_items || []
                                });
                            });
                            setFreelancers(formatted);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.warn("Unexpected freelancer list fetch issue:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchPortfolioInquiries = function fetchPortfolioInquiries(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, sanitized, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('portfolio_inquiries').select('*').eq('freelancer_id', userId).order('created_at', {
                                ascending: false
                            })
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error && data) {
                            sanitized = data.filter(Boolean).map(function(inquiry) {
                                var senderName = typeof (inquiry === null || inquiry === void 0 ? void 0 : inquiry.sender_name) === "string" && inquiry.sender_name.trim().length > 0 ? inquiry.sender_name : "Unknown Sender";
                                var senderEmail = typeof (inquiry === null || inquiry === void 0 ? void 0 : inquiry.sender_email) === "string" && inquiry.sender_email.trim().length > 0 ? inquiry.sender_email : "";
                                var message = typeof (inquiry === null || inquiry === void 0 ? void 0 : inquiry.message) === "string" && inquiry.message.trim().length > 0 ? inquiry.message : "No message provided.";
                                return _object_spread_props(_object_spread({}, inquiry), {
                                    sender_name: senderName,
                                    sender_email: senderEmail,
                                    message: message
                                });
                            });
                            setPortfolioInquiries(sanitized);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error fetching portfolio inquiries:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchNotifications = function fetchNotifications(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', {
                                ascending: false
                            })
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error && data) {
                            setNotifications(data);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error fetching notifications:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchFollows = function fetchFollows(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('follows').select('following_id').eq('follower_id', userId)
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error && data) {
                            setUserFollows(data.map(function(f) {
                                return f.following_id;
                            }));
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error fetching follows:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var toggleFollow = function toggleFollow(targetId) {
        return _async_to_generator(function() {
            var isFollowing, error, error1;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!user) return [
                            2
                        ];
                        isFollowing = userFollows.includes(targetId);
                        if (!isFollowing) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetId)
                        ];
                    case 1:
                        error = _state.sent().error;
                        if (!error) {
                            setUserFollows(function(prev) {
                                return prev.filter(function(id) {
                                    return id !== targetId;
                                });
                            });
                        }
                        return [
                            3,
                            4
                        ];
                    case 2:
                        return [
                            4,
                            supabase.from('follows').insert({
                                follower_id: user.id,
                                following_id: targetId
                            })
                        ];
                    case 3:
                        error1 = _state.sent().error;
                        if (!error1) {
                            setUserFollows(function(prev) {
                                return _to_consumable_array(prev).concat([
                                    targetId
                                ]);
                            });
                        }
                        _state.label = 4;
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var markNotificationRead = function markNotificationRead(id) {
        return _async_to_generator(function() {
            var error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('notifications').update({
                                is_read: true
                            }).eq('id', id)
                        ];
                    case 1:
                        error = _state.sent().error;
                        if (!error) {
                            setNotifications(function(prev) {
                                return prev.map(function(n) {
                                    return n.id === id ? _object_spread_props(_object_spread({}, n), {
                                        is_read: true
                                    }) : n;
                                });
                            });
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error marking notification read:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchUserEscrows = function fetchUserEscrows(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('escrows').select('*, jobs(*)').eq('freelancer_id', userId)
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error && data) {
                            setUserEscrows(data);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error fetching user escrows:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var fetchUnreadCount = function fetchUnreadCount(userId) {
        return _async_to_generator(function() {
            var _ref, count, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            2,
                            ,
                            3
                        ]);
                        return [
                            4,
                            supabase.from('messages').select('*', {
                                count: 'exact',
                                head: true
                            }).eq('is_read', false).neq('sender_id', userId)
                        ];
                    case 1:
                        _ref = _state.sent(), count = _ref.count, error = _ref.error;
                        if (!error) {
                            setUnreadCount(count || 0);
                        }
                        return [
                            3,
                            3
                        ];
                    case 2:
                        err = _state.sent();
                        console.error("Error fetching unread count:", err);
                        return [
                            3,
                            3
                        ];
                    case 3:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    useEffect(function() {
        var timer = setTimeout(function() {
            setDebouncedFreelancerSearchTerm(freelancerSearchTerm);
        }, 500);
        return function() {
            return clearTimeout(timer);
        };
    }, [
        freelancerSearchTerm
    ]);
    var filteredFreelancers = useMemo(function() {
        return freelancers.filter(function(f) {
            return f.name.toLowerCase().includes(debouncedFreelancerSearchTerm.toLowerCase()) || f.category.toLowerCase().includes(debouncedFreelancerSearchTerm.toLowerCase()) || f.skills.some(function(s) {
                return s.toLowerCase().includes(debouncedFreelancerSearchTerm.toLowerCase());
            });
        });
    }, [
        freelancers,
        debouncedFreelancerSearchTerm
    ]);
    useEffect(function() {
        var checkUser = function checkUser() {
            return _async_to_generator(function() {
                var _ref, session, currentProfile, notifChannel, inquiryChannel, escrowChannel, channel, profileChannel, applicationsChannel, jobsChannel, isNewSocial;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                supabase.auth.getSession()
                            ];
                        case 1:
                            _ref = _state.sent(), session = _ref.data.session;
                            if (!!session) return [
                                3,
                                2
                            ];
                            setLoading(false);
                            return [
                                3,
                                13
                            ];
                        case 2:
                            setUser(session.user);
                            // Fetch real profile from DB
                            currentProfile = profile;
                            return [
                                4,
                                fetchProfile(session.user.id, session.user, currentProfile)
                            ];
                        case 3:
                            _state.sent();
                            // Fetch jobs from DB
                            return [
                                4,
                                fetchJobs()
                            ];
                        case 4:
                            _state.sent();
                            return [
                                4,
                                fetchAppliedJobs(session.user.id)
                            ];
                        case 5:
                            _state.sent();
                            return [
                                4,
                                fetchEmployerJobs(session.user.id)
                            ];
                        case 6:
                            _state.sent();
                            return [
                                4,
                                fetchFreelancers()
                            ];
                        case 7:
                            _state.sent();
                            return [
                                4,
                                fetchUnreadCount(session.user.id)
                            ];
                        case 8:
                            _state.sent();
                            return [
                                4,
                                fetchNotifications(session.user.id)
                            ];
                        case 9:
                            _state.sent();
                            return [
                                4,
                                fetchFollows(session.user.id)
                            ];
                        case 10:
                            _state.sent();
                            return [
                                4,
                                fetchUserEscrows(session.user.id)
                            ];
                        case 11:
                            _state.sent();
                            return [
                                4,
                                fetchPortfolioInquiries(session.user.id)
                            ];
                        case 12:
                            _state.sent();
                            // Subscribe to notifications
                            notifChannel = supabase.channel('notifications-changes').on('postgres_changes', {
                                event: '*',
                                schema: 'public',
                                table: 'notifications',
                                filter: "user_id=eq.".concat(session.user.id)
                            }, function() {
                                fetchNotifications(session.user.id);
                            }).subscribe();
                            // Subscribe to portfolio inquiries
                            inquiryChannel = supabase.channel('inquiry-changes').on('postgres_changes', {
                                event: '*',
                                schema: 'public',
                                table: 'portfolio_inquiries',
                                filter: "freelancer_id=eq.".concat(session.user.id)
                            }, function() {
                                fetchPortfolioInquiries(session.user.id);
                            }).subscribe();
                            // Subscribe to escrows
                            escrowChannel = supabase.channel('escrow-changes').on('postgres_changes', {
                                event: '*',
                                schema: 'public',
                                table: 'escrows'
                            }, function() {
                                fetchUserEscrows(session.user.id);
                            }).subscribe();
                            // Subscribe to messages for unread count
                            channel = supabase.channel('unread-count').on('postgres_changes', {
                                event: '*',
                                schema: 'public',
                                table: 'messages'
                            }, function() {
                                fetchUnreadCount(session.user.id);
                            }).subscribe();
                            // Subscribe to profile changes for real-time projects
                            profileChannel = supabase.channel('profile-changes').on('postgres_changes', {
                                event: 'UPDATE',
                                schema: 'public',
                                table: 'profiles',
                                filter: "id=eq.".concat(session.user.id)
                            }, function(payload) {
                                setProfile(function(prev) {
                                    var newData = payload.new;
                                    return _object_spread_props(_object_spread({}, prev, newData), {
                                        skills: Array.isArray(newData.skills) ? newData.skills : prev.skills || [],
                                        verifiedSkills: Array.isArray(newData.verifiedSkills) ? newData.verifiedSkills : prev.verifiedSkills || [],
                                        softSkills: Array.isArray(newData.softSkills) ? newData.softSkills : prev.softSkills || [],
                                        activeProjects: Array.isArray(newData.activeProjects) ? newData.activeProjects : prev.activeProjects || [],
                                        workflows: Array.isArray(newData.workflows) ? newData.workflows : prev.workflows || []
                                    });
                                });
                            }).subscribe();
                            // Subscribe to applications for realtime updates
                            applicationsChannel = supabase.channel('applications-changes').on('postgres_changes', {
                                event: '*',
                                schema: 'public',
                                table: 'applications'
                            }, function() {
                                fetchEmployerJobs(session.user.id);
                                fetchAppliedJobs(session.user.id);
                            }).subscribe();
                            // Subscribe to jobs for realtime updates
                            jobsChannel = supabase.channel('jobs-changes').on('postgres_changes', {
                                event: '*',
                                schema: 'public',
                                table: 'jobs'
                            }, function() {
                                fetchJobs();
                                fetchEmployerJobs(session.user.id);
                            }).subscribe();
                            // Check for first-time social login to show notification
                            isNewSocial = typeof window !== 'undefined' ? sessionStorage.getItem('social_login_pending') : null;
                            if (isNewSocial) {
                                setToastMsg("Connection Successful! A confirmation notification has been sent to your ".concat(isNewSocial, " account."));
                                setShowToast(true);
                                sessionStorage.removeItem('social_login_pending');
                                setTimeout(function() {
                                    return setShowToast(false);
                                }, 5000);
                            }
                            setLoading(false);
                            _state.label = 13;
                        case 13:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        checkUser();
        var _supabase_auth_onAuthStateChange = supabase.auth.onAuthStateChange(function(_event, session) {
            if (!session) {
                setUser(null);
                setLoading(false);
            } else {
                setUser(session.user);
                fetchProfile(session.user.id, session.user);
                setLoading(false);
            }
        }), subscription = _supabase_auth_onAuthStateChange.data.subscription;
        return function() {
            return subscription.unsubscribe();
        };
    }, [
        router
    ]);
    if (loading) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
        }), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs"
        }, "Authenticating...")));
    }
    if (!user) {
        return /*#__PURE__*/ React.createElement(LandingPage, null);
    }
    var ensurePortfolioExists = function ensurePortfolioExists(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, _ref1, newPortfolio, createError;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            supabase.from('portfolios').select('id').eq('profile_id', userId).maybeSingle()
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (data) return [
                            2,
                            data.id
                        ];
                        return [
                            4,
                            supabase.from('portfolios').insert([
                                {
                                    profile_id: userId,
                                    theme_settings: {
                                        aesthetic: "professional",
                                        primaryColor: "#4f46e5"
                                    }
                                }
                            ]).select('id').single()
                        ];
                    case 2:
                        _ref1 = _state.sent(), newPortfolio = _ref1.data, createError = _ref1.error;
                        if (createError) throw createError;
                        return [
                            2,
                            newPortfolio.id
                        ];
                }
            });
        })();
    };
    var reloadWholePage = function reloadWholePage() {
        if (typeof window !== "undefined") {
            window.location.reload();
        }
    };
    var addPortfolioItem = function addPortfolioItem(item) {
        return _async_to_generator(function() {
            var portfolioId, _ref, data, error, _ref1, oldData, oldError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!user) return [
                            2
                        ];
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            7,
                            ,
                            8
                        ]);
                        return [
                            4,
                            ensurePortfolioExists(user.id)
                        ];
                    case 2:
                        portfolioId = _state.sent();
                        return [
                            4,
                            supabase.from('portfolio_projects').insert([
                                {
                                    portfolio_id: portfolioId,
                                    title: item.title,
                                    description: item.description,
                                    project_url: item.project_url,
                                    technologies: item.technologies,
                                    created_at: new Date().toISOString()
                                }
                            ]).select().single()
                        ];
                    case 3:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (!error) return [
                            3,
                            5
                        ];
                        return [
                            4,
                            supabase.from('portfolio_items').insert([
                                {
                                    profile_id: user.id,
                                    title: item.title,
                                    description: item.description,
                                    project_url: item.project_url,
                                    technologies: item.technologies,
                                    created_at: new Date().toISOString()
                                }
                            ]).select().single()
                        ];
                    case 4:
                        _ref1 = _state.sent(), oldData = _ref1.data, oldError = _ref1.error;
                        if (oldError) throw oldError;
                        if (oldData) {
                            setProfile(function(prev) {
                                return _object_spread_props(_object_spread({}, prev), {
                                    portfolio: _to_consumable_array(prev.portfolio || []).concat([
                                        oldData
                                    ])
                                });
                            });
                        }
                        return [
                            3,
                            6
                        ];
                    case 5:
                        if (data) {
                            setProfile(function(prev) {
                                return _object_spread_props(_object_spread({}, prev), {
                                    portfolio: _to_consumable_array(prev.portfolio || []).concat([
                                        _object_spread_props(_object_spread({}, data), {
                                            profile_id: user.id
                                        })
                                    ])
                                });
                            });
                        }
                        _state.label = 6;
                    case 6:
                        setToastMsg("Portfolio item added!");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        setTimeout(reloadWholePage, 250);
                        return [
                            3,
                            8
                        ];
                    case 7:
                        err = _state.sent();
                        console.error("Error adding portfolio item:", err);
                        setToastMsg("Error: ".concat(err.message));
                        setShowToast(true);
                        return [
                            3,
                            8
                        ];
                    case 8:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var updatePortfolioItem = function updatePortfolioItem(item) {
        return _async_to_generator(function() {
            var _ref, projectRows, error, _ref1, oldRows, oldError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            4,
                            ,
                            5
                        ]);
                        return [
                            4,
                            supabase.from('portfolio_projects').update({
                                title: item.title,
                                description: item.description,
                                project_url: item.project_url,
                                technologies: item.technologies
                            }).eq('id', item.id).select('id')
                        ];
                    case 1:
                        _ref = _state.sent(), projectRows = _ref.data, error = _ref.error;
                        if (!(error || !projectRows || projectRows.length === 0)) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            supabase.from('portfolio_items').update({
                                title: item.title,
                                description: item.description,
                                project_url: item.project_url,
                                technologies: item.technologies
                            }).eq('id', item.id).select('id')
                        ];
                    case 2:
                        _ref1 = _state.sent(), oldRows = _ref1.data, oldError = _ref1.error;
                        if (oldError) throw oldError;
                        if (!oldRows || oldRows.length === 0) {
                            throw new Error("Portfolio item was not found for update.");
                        }
                        _state.label = 3;
                    case 3:
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                portfolio: (prev.portfolio || []).map(function(i) {
                                    return i.id === item.id ? item : i;
                                })
                            });
                        });
                        setToastMsg("Portfolio item updated!");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        setTimeout(reloadWholePage, 250);
                        return [
                            3,
                            5
                        ];
                    case 4:
                        err = _state.sent();
                        console.error("Error updating portfolio item:", err);
                        setToastMsg("Error: ".concat(err.message));
                        setShowToast(true);
                        return [
                            3,
                            5
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var removePortfolioItem = function removePortfolioItem(id) {
        return _async_to_generator(function() {
            var _ref, projectRows, error, _ref1, oldRows, oldError, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            4,
                            ,
                            5
                        ]);
                        return [
                            4,
                            supabase.from('portfolio_projects').delete().eq('id', id).select('id')
                        ];
                    case 1:
                        _ref = _state.sent(), projectRows = _ref.data, error = _ref.error;
                        if (!(error || !projectRows || projectRows.length === 0)) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            supabase.from('portfolio_items').delete().eq('id', id).select('id')
                        ];
                    case 2:
                        _ref1 = _state.sent(), oldRows = _ref1.data, oldError = _ref1.error;
                        if (oldError) throw oldError;
                        if (!oldRows || oldRows.length === 0) {
                            throw new Error("Portfolio item was not found for delete.");
                        }
                        _state.label = 3;
                    case 3:
                        setProfile(function(prev) {
                            return _object_spread_props(_object_spread({}, prev), {
                                portfolio: (prev.portfolio || []).filter(function(item) {
                                    return item.id !== id;
                                })
                            });
                        });
                        setToastMsg("Portfolio item removed.");
                        setShowToast(true);
                        setTimeout(function() {
                            return setShowToast(false);
                        }, 3000);
                        setTimeout(reloadWholePage, 250);
                        return [
                            3,
                            5
                        ];
                    case 4:
                        err = _state.sent();
                        console.error("Error removing portfolio item:", err);
                        setToastMsg("Error: ".concat(err.message));
                        setShowToast(true);
                        return [
                            3,
                            5
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-[#F8FAFC] text-slate-900 font-sans"
    }, /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: isVetting,
        onClose: function onClose() {
            return setIsVetting(false);
        },
        mode: "vetting",
        targetData: vettingData
    }), /*#__PURE__*/ React.createElement("nav", {
        className: "bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200"
    }, dbError && /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-600 text-white text-[10px] sm:text-xs font-bold py-2.5 px-4 text-center animate-in fade-in slide-in-from-top-2 duration-500 flex items-center justify-center gap-3 shadow-lg"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-3.5 h-3.5 text-indigo-200"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "uppercase tracking-widest"
    }, "Platform Status: Initialization Required")), /*#__PURE__*/ React.createElement("div", {
        className: "h-4 w-px bg-white/20 hidden sm:block"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "opacity-90 font-medium"
    }, "Some database tables (", missingTables.join(", "), ") need to be set up for full functionality."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setView("admin");
        },
        className: "bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black hover:bg-indigo-50 transition-all cursor-pointer uppercase tracking-tighter"
    }, "Setup Database"))), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-full px-4 sm:px-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center h-16 py-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("img", {
        src: "/tarawork-removebg-preview.png",
        alt: "Tara Logo",
        className: "h-10 w-auto object-contain"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "hidden sm:flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-100 uppercase tracking-tighter cursor-help group relative"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-3 h-3"
    }), "SSL Secure", /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-full left-0 mt-2 w-48 p-2 bg-slate-900 text-white text-[8px] rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none font-medium leading-relaxed border border-white/10"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "font-black text-indigo-400 mb-1"
    }, "Status: Active"), 'Tara verifies SSL status internally. Browser "Not Secure" warnings may occur during ACME cert challenges.'))), /*#__PURE__*/ React.createElement("div", {
        className: "hidden lg:flex items-center gap-6"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"
    }, view === 'admin' ? 'Admin Portal' : view === 'client' ? 'Client Dashboard' : 'Freelancer Workspace'))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4"
    }, profile.role === "freelancer" && /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 sm:px-3.5 py-1.5 shadow-sm"
    }, /*#__PURE__*/ React.createElement(Coins, {
        className: "h-4 w-4 text-amber-600"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "hidden sm:inline text-[10px] font-black uppercase tracking-[0.18em] text-amber-700"
    }, "Credit Wallet"), /*#__PURE__*/ React.createElement("span", {
        className: "rounded-lg bg-white px-2 py-0.5 text-xs font-black text-slate-900 border border-amber-100"
    }, headerCreditsLoading ? "..." : headerCreditBalance)), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            var _profile_premiumProfile;
            if (((_profile_premiumProfile = profile.premiumProfile) === null || _profile_premiumProfile === void 0 ? void 0 : _profile_premiumProfile.tier) === "pro") {
                void startUpgradeCheckout("credit_topup");
                return;
            }
            setShowUpgradePlans(true);
        },
        disabled: planCheckoutLoading === "credit_topup",
        className: "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700 transition-all hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
    }, planCheckoutLoading === "credit_topup" ? "Loading..." : "Top Up")), /*#__PURE__*/ React.createElement("button", {
        className: "lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors",
        onClick: function onClick() {
            return setIsMenuOpen(!isMenuOpen);
        }
    }, isMenuOpen ? /*#__PURE__*/ React.createElement(X, {
        className: "w-6 h-6"
    }) : /*#__PURE__*/ React.createElement(Menu, {
        className: "w-6 h-6"
    })), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                supabase.auth.signOut()
                            ];
                        case 1:
                            _state.sent();
                            router.push("/auth");
                            return [
                                2
                            ];
                    }
                });
            })();
        },
        className: "hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-all"
    }, "Logout"), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowNotifications(!showNotifications);
        },
        className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-5 h-5"
    }), notifications.filter(function(n) {
        return !n.is_read;
    }).length > 0 && /*#__PURE__*/ React.createElement("span", {
        className: "absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-600 text-white text-[9px] font-black rounded-full border-2 border-white px-1 shadow-sm animate-bounce"
    }, notifications.filter(function(n) {
        return !n.is_read;
    }).length > 9 ? '9+' : notifications.filter(function(n) {
        return !n.is_read;
    }).length)), /*#__PURE__*/ React.createElement(AnimatePresence, null, showNotifications && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: 10
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 10
        },
        className: "absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[60]"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 backdrop-blur-sm"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-3 h-3 text-indigo-600"
    }), "Notifications"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100"
    }, notifications.filter(function(n) {
        return !n.is_read;
    }).length, " Unread")), /*#__PURE__*/ React.createElement("div", {
        className: "max-h-[400px] overflow-y-auto"
    }, notifications.length > 0 ? notifications.map(function(n) {
        return /*#__PURE__*/ React.createElement("div", {
            key: n.id,
            onClick: function onClick() {
                markNotificationRead(n.id);
                setShowNotifications(false);
                if (n.link) setFreelancerTab('overview');
            },
            className: "p-5 border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer transition-all ".concat(!n.is_read ? 'bg-indigo-50/20' : '', " group")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ".concat(n.type === 'success' ? 'bg-emerald-50 text-emerald-500' : n.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500')
        }, n.type === 'success' ? /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-4 h-4"
        }) : /*#__PURE__*/ React.createElement(ShieldCheck, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "min-w-0"
        }, /*#__PURE__*/ React.createElement("h5", {
            className: "text-[11px] font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors"
        }, n.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] text-slate-500 leading-relaxed font-medium line-clamp-2"
        }, n.message), /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] text-slate-400 mt-2 block font-black uppercase tracking-widest"
        }, new Date(n.created_at).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })))));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "p-10 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-6 h-6 text-slate-200"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-black uppercase tracking-widest"
    }, "No notifications yet."))), notifications.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50/30 text-center border-t border-slate-50"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
    }, "Clear All Notifications"))))), /*#__PURE__*/ React.createElement(Link, {
        href: "/messages",
        className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-5 h-5"
    }), unreadCount > 0 && /*#__PURE__*/ React.createElement("span", {
        className: "absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-indigo-600 text-white text-[10px] font-black rounded-full border-2 border-white px-1"
    }, unreadCount > 99 ? '99+' : unreadCount)), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return alert("Settings module coming soon! You can update your profile below for now.");
        },
        className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
    }, /*#__PURE__*/ React.createElement(Settings, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("div", {
        onClick: function onClick() {
            var _profileRef_current;
            return (_profileRef_current = profileRef.current) === null || _profileRef_current === void 0 ? void 0 : _profileRef_current.scrollIntoView({
                behavior: 'smooth'
            });
        },
        className: "w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-indigo-100 transition-all overflow-hidden"
    }, profile.avatar_url && /*#__PURE__*/ React.createElement("img", {
        src: profile.avatar_url,
        alt: "Profile",
        className: "w-full h-full object-cover"
    })))))), /*#__PURE__*/ React.createElement(AnimatePresence, null, isMenuOpen && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "lg:hidden bg-white border-b border-slate-200 overflow-hidden sticky top-[65px] z-40"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setView('freelancer');
            setIsMenuOpen(false);
        },
        className: "flex items-center gap-3 p-3 rounded-xl font-bold text-sm ".concat(view === 'freelancer' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50')
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: "w-5 h-5"
    }), "Freelancer Workspace"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setView('client');
            setIsMenuOpen(false);
        },
        className: "flex items-center gap-3 p-3 rounded-xl font-bold text-sm ".concat(view === 'client' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50')
    }, /*#__PURE__*/ React.createElement(Users, {
        className: "w-5 h-5"
    }), "Employer Dashboard"), profile.role === 'admin' && /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setView('admin');
            setIsMenuOpen(false);
        },
        className: "flex items-center gap-3 p-3 rounded-xl font-bold text-sm ".concat(view === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50')
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-5 h-5"
    }), "Admin Portal")), /*#__PURE__*/ React.createElement("div", {
        className: "pt-4 border-t border-slate-100 flex flex-col gap-2"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/messages",
        onClick: function onClick() {
            return setIsMenuOpen(false);
        },
        className: "flex items-center gap-3 p-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-5 h-5"
    }), "Messages ", unreadCount > 0 && "(".concat(unreadCount, ")")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                supabase.auth.signOut()
                            ];
                        case 1:
                            _state.sent();
                            router.push("/auth");
                            return [
                                2
                            ];
                    }
                });
            })();
        },
        className: "flex items-center gap-3 p-3 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50"
    }, /*#__PURE__*/ React.createElement(LogIn, {
        className: "w-5 h-5 rotate-180"
    }), "Logout"))))), /*#__PURE__*/ React.createElement("main", {
        className: "max-w-full px-4 sm:px-10 py-8"
    }, view === "freelancer" ? /*#__PURE__*/ React.createElement("div", {
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto sticky top-20 z-40"
    }, [
        {
            id: "overview",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            id: "jobs",
            label: "Find Jobs",
            icon: Briefcase
        },
        {
            id: "workspace",
            label: "Workspace",
            icon: Zap
        },
        {
            id: "career",
            label: "Growth",
            icon: Award
        },
        {
            id: "profile",
            label: "My Profile",
            icon: User
        }
    ].map(function(tab) {
        return /*#__PURE__*/ React.createElement("button", {
            key: tab.id,
            onClick: function onClick() {
                return setFreelancerTab(tab.id);
            },
            className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ".concat(freelancerTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")
        }, /*#__PURE__*/ React.createElement(tab.icon, {
            className: "w-4 h-4"
        }), /*#__PURE__*/ React.createElement("span", null, tab.label));
    })), /*#__PURE__*/ React.createElement(AnimatePresence, {
        mode: "wait"
    }, freelancerTab === "overview" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "overview",
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: -10
        },
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12 text-white shadow-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10 max-w-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold mb-6 uppercase tracking-wider"
    }, /*#__PURE__*/ React.createElement(Award, {
        className: "w-3.5 h-3.5"
    }), "Top Rated Freelancer"), /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight"
    }, "Welcome back, ", /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400"
    }, (profile.name || "User").split(' ')[0], "!")), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-300 text-lg mb-8 opacity-90 font-medium"
    }, profile.category === "Developer" && /*#__PURE__*/ React.createElement(React.Fragment, null, "We found ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-white"
    }, jobs.filter(function(j) {
        return j.category === "Developer";
    }).length, " development opportunities"), " for you today."), profile.category === "Virtual Assistant" && /*#__PURE__*/ React.createElement(React.Fragment, null, "There are ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-white"
    }, jobs.filter(function(j) {
        return j.category === "Virtual Assistant";
    }).length, " assistant roles"), " available right now."), profile.category === "Designer" && /*#__PURE__*/ React.createElement(React.Fragment, null, "Explore ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-white"
    }, jobs.filter(function(j) {
        return j.category === "Designer";
    }).length, " creative projects"), " in your category."), profile.category === "Writer" && /*#__PURE__*/ React.createElement(React.Fragment, null, "We found ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-white"
    }, jobs.filter(function(j) {
        return j.category === "Writer";
    }).length, " writing gigs"), " tailored to your skills."), profile.category === "Marketing Specialist" && /*#__PURE__*/ React.createElement(React.Fragment, null, "Discover ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-white"
    }, jobs.filter(function(j) {
        return j.category === "Marketing Specialist";
    }).length, " marketing campaigns"), " you can lead."), ![
        "Developer",
        "Virtual Assistant",
        "Designer",
        "Writer",
        "Marketing Specialist"
    ].includes(profile.category) && /*#__PURE__*/ React.createElement(React.Fragment, null, "We found ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-white"
    }, jobs.filter(function(j) {
        return j.category === profile.category;
    }).length, " opportunities"), " in your category.")), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-4"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            var _jobsRef_current;
            return (_jobsRef_current = jobsRef.current) === null || _jobsRef_current === void 0 ? void 0 : _jobsRef_current.scrollIntoView({
                behavior: 'smooth'
            });
        },
        className: "bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-95"
    }, "Browse Jobs"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            var _profileRef_current;
            return (_profileRef_current = profileRef.current) === null || _profileRef_current === void 0 ? void 0 : _profileRef_current.scrollIntoView({
                behavior: 'smooth'
            });
        },
        className: "bg-white/10 text-white border border-white/10 px-6 py-3 rounded-lg font-bold hover:bg-white/20 transition-all cursor-pointer"
    }, "Update Profile"))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "hidden lg:block absolute right-12 bottom-12 w-48 h-48 opacity-5 pointer-events-none"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-full h-full text-white"
    }))), profile.role === 'freelancer' && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay: 0.1
        },
        className: "bg-white p-5 rounded-2xl border-2 border-indigo-50/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-all duration-500"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4 relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200"
    }, /*#__PURE__*/ React.createElement(Layout, {
        className: "w-6 h-6"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "text-base font-black text-slate-900 tracking-tight leading-none mb-1"
    }, "Your Professional Portfolio is Live! \uD83D\uDE80"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-slate-500 font-bold uppercase tracking-widest opacity-70"
    }, "Share this link for frictionless hiring"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 w-full sm:w-auto relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 sm:flex-none px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs text-indigo-700 font-black truncate min-w-[150px] shadow-inner"
    }, buildPublicProfileUrl({
        tier: ((_profile_premiumProfile1 = profile.premiumProfile) === null || _profile_premiumProfile1 === void 0 ? void 0 : _profile_premiumProfile1.tier) || "free",
        username: profile.username,
        id: profile.id,
        customDomain: (_profile_premiumProfile2 = profile.premiumProfile) === null || _profile_premiumProfile2 === void 0 ? void 0 : _profile_premiumProfile2.customDomain
    })), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            var _profile_premiumProfile, _profile_premiumProfile1;
            var url = buildPublicProfileUrl({
                tier: ((_profile_premiumProfile = profile.premiumProfile) === null || _profile_premiumProfile === void 0 ? void 0 : _profile_premiumProfile.tier) || "free",
                username: profile.username,
                id: profile.id,
                customDomain: (_profile_premiumProfile1 = profile.premiumProfile) === null || _profile_premiumProfile1 === void 0 ? void 0 : _profile_premiumProfile1.customDomain
            });
            navigator.clipboard.writeText(url);
            setToastMsg("Professional portfolio URL copied! 📋");
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 2000);
        },
        className: "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-black rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95 whitespace-nowrap"
    }, /*#__PURE__*/ React.createElement(Copy, {
        className: "w-3.5 h-3.5"
    }), "Copy Professional URL"), /*#__PURE__*/ React.createElement(Link, {
        href: buildPublicProfileUrl({
            tier: ((_profile_premiumProfile3 = profile.premiumProfile) === null || _profile_premiumProfile3 === void 0 ? void 0 : _profile_premiumProfile3.tier) || "free",
            username: profile.username,
            id: profile.id,
            customDomain: (_profile_premiumProfile4 = profile.premiumProfile) === null || _profile_premiumProfile4 === void 0 ? void 0 : _profile_premiumProfile4.customDomain
        }),
        target: "_blank",
        className: "flex items-center justify-center p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
    }, /*#__PURE__*/ React.createElement(ExternalLink, {
        className: "w-5 h-5"
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "md:col-span-2 lg:col-span-3 space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black mb-2 tracking-tight"
    }, "Focus on your workspace"), /*#__PURE__*/ React.createElement("p", {
        className: "text-indigo-100 font-medium mb-6 opacity-90 max-w-md"
    }, "You have ", userEscrows.length, " approved projects with funds in escrow."), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setFreelancerTab("workspace");
        },
        className: "bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all flex items-center gap-2"
    }, "Go to Workspace", /*#__PURE__*/ React.createElement(ArrowUpRight, {
        className: "w-4 h-4"
    })), userEscrows.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-500/30 px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-4 h-4 text-emerald-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-white"
    }, "$", userEscrows.reduce(function(sum, e) {
        return sum + Number(e.amount);
    }, 0).toLocaleString(), " Total Escrow")))), /*#__PURE__*/ React.createElement(Zap, {
        className: "absolute -right-8 -bottom-8 w-48 h-48 text-white/10 rotate-12"
    })), userEscrows.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-5 h-5 text-indigo-600"
    }), "Approved Projects & Escrow"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest"
    }, "Budget Visibility")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, userEscrows.map(function(escrow) {
        var _escrow_jobs;
        return /*#__PURE__*/ React.createElement("div", {
            key: escrow.id,
            className: "p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-wrap justify-between items-center gap-4 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm"
        }, /*#__PURE__*/ React.createElement(Briefcase, {
            className: "w-6 h-6 text-indigo-500"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-slate-900"
        }, ((_escrow_jobs = escrow.jobs) === null || _escrow_jobs === void 0 ? void 0 : _escrow_jobs.title) || "Project Title"), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 mt-1"
        }, /*#__PURE__*/ React.createElement(Lock, {
            className: "w-3 h-3"
        }), "Funds in Escrow: $", Number(escrow.amount).toLocaleString()))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest"
        }, "Status: ", escrow.status), /*#__PURE__*/ React.createElement("button", {
            className: "px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-black transition-all"
        }, "Submit Work")));
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl p-8 border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-5 h-5 text-indigo-600"
    }), "Portfolio Inquiries"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest"
    }, "Direct messages from your public portfolio")), /*#__PURE__*/ React.createElement("span", {
        className: "px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest"
    }, portfolioInquiries.length, " Messages")), portfolioInquiries.length === 0 ? /*#__PURE__*/ React.createElement("div", {
        className: "py-12 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-slate-50 rounded-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-8 h-8"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-1"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "font-bold text-slate-900"
    }, "No inquiries yet"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500 max-w-[200px]"
    }, "Share your professional portfolio URL to start receiving inquiries from employers."))) : /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, portfolioInquiries.slice(0, 5).map(function(inquiry) {
        var senderName = typeof (inquiry === null || inquiry === void 0 ? void 0 : inquiry.sender_name) === "string" && inquiry.sender_name.trim().length > 0 ? inquiry.sender_name : "Unknown Sender";
        var senderEmail = typeof (inquiry === null || inquiry === void 0 ? void 0 : inquiry.sender_email) === "string" ? inquiry.sender_email : "";
        var senderInitial = senderName.slice(0, 1).toUpperCase() || "U";
        var inquiryDate = (inquiry === null || inquiry === void 0 ? void 0 : inquiry.created_at) ? new Date(inquiry.created_at) : null;
        var inquiryDateLabel = inquiryDate && !Number.isNaN(inquiryDate.getTime()) ? inquiryDate.toLocaleDateString() : "Unknown date";
        return /*#__PURE__*/ React.createElement("div", {
            key: inquiry.id,
            className: "p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm"
        }, senderInitial), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-slate-900 leading-none mb-1"
        }, senderName), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-medium text-slate-500"
        }, senderEmail || "No email provided"))), /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-bold text-slate-400 uppercase tracking-widest"
        }, inquiryDateLabel)), /*#__PURE__*/ React.createElement("div", {
            className: "bg-white p-4 rounded-xl border border-slate-100 text-sm text-slate-600 italic leading-relaxed relative"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "absolute -top-2 -left-2 text-2xl text-indigo-200 font-serif leading-none"
        }, '"'), inquiry.message, /*#__PURE__*/ React.createElement("span", {
            className: "absolute -bottom-4 -right-2 text-2xl text-indigo-200 font-serif leading-none"
        }, '"')), /*#__PURE__*/ React.createElement("div", {
            className: "mt-4 flex justify-end gap-2"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return _async_to_generator(function() {
                    var _ref, profileData;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    supabase.from('profiles').select('id').ilike('name', "%".concat(senderName, "%")).limit(1).maybeSingle()
                                ];
                            case 1:
                                _ref = _state.sent(), profileData = _ref.data;
                                if (profileData) {
                                    router.push("/messages?with=".concat(profileData.id));
                                } else {
                                    window.location.href = "mailto:".concat(senderEmail, "?subject=Reply to your TaraWork inquiry");
                                }
                                return [
                                    2
                                ];
                        }
                    });
                })();
            },
            className: "px-4 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-sm"
        }, "Reply to Inquiry", /*#__PURE__*/ React.createElement(ArrowUpRight, {
            className: "w-3 h-3"
        })), /*#__PURE__*/ React.createElement("a", {
            href: "mailto:".concat(senderEmail),
            className: "px-4 py-2 bg-white text-slate-600 border border-slate-200 text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
        }, "Email Direct", /*#__PURE__*/ React.createElement(Mail, {
            className: "w-3 h-3"
        }))));
    }), portfolioInquiries.length > 5 && /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
    }, "View all inquiries"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-5 h-5 text-emerald-600"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "Career Insights"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500 mt-1"
    }, "Check how your skills match the market demand.")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setFreelancerTab("career");
        },
        className: "text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-4 flex items-center gap-1"
    }, "View Analysis ", /*#__PURE__*/ React.createElement(ChevronRight, {
        className: "w-3 h-3"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: "w-5 h-5 text-amber-600"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "Recommended Jobs"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500 mt-1"
    }, "We found ", jobs.length, " new jobs that match your profile.")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setFreelancerTab("jobs");
        },
        className: "text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-4 flex items-center gap-1"
    }, "Browse Jobs ", /*#__PURE__*/ React.createElement(ChevronRight, {
        className: "w-3 h-3"
    }))))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 rounded-2xl p-6 text-white shadow-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden border-2 border-white/10"
    }, profile.avatar_url ? /*#__PURE__*/ React.createElement("img", {
        src: profile.avatar_url,
        className: "w-full h-full object-cover"
    }) : /*#__PURE__*/ React.createElement(User, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold text-slate-400 uppercase tracking-widest"
    }, "Profile Score"), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-black"
    }, profile.ranking ? "Top ".concat(profile.ranking, "%") : "Not Ranked"))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500"
    }, /*#__PURE__*/ React.createElement("span", null, "Completeness"), /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400"
    }, "85%")), /*#__PURE__*/ React.createElement("div", {
        className: "h-1.5 w-full bg-white/10 rounded-full overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "h-full bg-indigo-500 w-[85%] rounded-full shadow-sm"
    })), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setFreelancerTab("profile");
        },
        className: "w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
    }, "Optimize Profile"))))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-6 h-6 text-emerald-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-emerald-900"
    }, "Safe-Vault Protection"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-emerald-700 mt-1 leading-relaxed"
    }, "Your payment is protected. Funds are kept in our secure vault before work begins."))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-6 h-6 text-indigo-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-indigo-900"
    }, "Escrow Milestone"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-indigo-700 mt-1 leading-relaxed"
    }, "We ensure that each milestone has corresponding funds reserved for you."))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 p-6 rounded-2xl flex gap-4 text-white"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-6 h-6 text-indigo-400"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold"
    }, "24/7 Support"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400 mt-1 leading-relaxed"
    }, "Have a dispute? Our admin team is ready to help resolve any issues."))))), freelancerTab === "jobs" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "jobs",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-end mb-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-slate-900"
    }, "Available Jobs"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 mt-1"
    }, "Browse opportunities that match your expertise."))), /*#__PURE__*/ React.createElement(JobFeed, {
        jobs: jobs,
        profile: profile,
        onApply: handleApply,
        appliedJobs: appliedJobs
    })), freelancerTab === "workspace" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "workspace",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement(Workspace, {
        projects: profile.activeProjects || [],
        currentUserId: (user === null || user === void 0 ? void 0 : user.id) || profile.id,
        onUpdateProject: handleUpdateProject,
        onCreateProject: handleCreateProject,
        workflows: profile.workflows || [],
        onUpdateWorkflows: handleUpdateWorkflows
    }), /*#__PURE__*/ React.createElement(TeamManager, {
        squad: profile.squad,
        onCreateSquad: handleCreateSquad,
        onUpdateSquad: handleUpdateSquad
    })), freelancerTab === "career" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "career",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement(CareerPath, {
        profile: profile,
        allJobs: jobs
    }), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-2xl"
    }, /*#__PURE__*/ React.createElement(SkillAssessment, {
        verifiedSkills: profile.verifiedSkills || [],
        aiInsights: profile.aiInsights
    }))), freelancerTab === "profile" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "profile",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "grid grid-cols-1 lg:grid-cols-12 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-8 space-y-6"
    }, /*#__PURE__*/ React.createElement(ProfileForm, {
        initialProfile: profile,
        onOpenUpgradePlans: function onOpenUpgradePlans() {
            return setShowUpgradePlans(true);
        },
        onUpdate: handleProfileSave,
        onAddPortfolio: addPortfolioItem,
        onUpdatePortfolio: updatePortfolioItem,
        onRemovePortfolio: removePortfolioItem,
        isSaving: isSaving
    })), /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-4 space-y-6"
    }, profile.role === 'freelancer' && /*#__PURE__*/ React.createElement("div", {
        className: cn("p-6 rounded-[1.75rem] border shadow-sm relative overflow-hidden group transition-all", ((_profile_premiumProfile5 = profile.premiumProfile) === null || _profile_premiumProfile5 === void 0 ? void 0 : _profile_premiumProfile5.tier) === "pro" ? "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 border-slate-800 shadow-2xl shadow-slate-900/20" : "bg-white border-slate-200")
    }, /*#__PURE__*/ React.createElement("div", {
        className: cn("absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2", ((_profile_premiumProfile6 = profile.premiumProfile) === null || _profile_premiumProfile6 === void 0 ? void 0 : _profile_premiumProfile6.tier) === "pro" ? "bg-amber-400/20" : "bg-indigo-50")
    }), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: cn("text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2", ((_profile_premiumProfile7 = profile.premiumProfile) === null || _profile_premiumProfile7 === void 0 ? void 0 : _profile_premiumProfile7.tier) === "pro" ? "text-slate-400" : "text-slate-400")
    }, /*#__PURE__*/ React.createElement(Layout, {
        className: cn("w-4 h-4", ((_profile_premiumProfile8 = profile.premiumProfile) === null || _profile_premiumProfile8 === void 0 ? void 0 : _profile_premiumProfile8.tier) === "pro" ? "text-amber-300" : "text-indigo-600")
    }), "Public Portfolio"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: cn("p-3 rounded-xl font-mono text-[10px] break-all flex items-center justify-between border", ((_profile_premiumProfile9 = profile.premiumProfile) === null || _profile_premiumProfile9 === void 0 ? void 0 : _profile_premiumProfile9.tier) === "pro" ? "bg-white/5 border-white/10 text-white" : "bg-slate-50 border-slate-100")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-1"
    }, /*#__PURE__*/ React.createElement("span", {
        className: cn(((_profile_premiumProfile10 = profile.premiumProfile) === null || _profile_premiumProfile10 === void 0 ? void 0 : _profile_premiumProfile10.tier) === "pro" ? "text-white" : "text-slate-600")
    }, buildPublicProfileUrl({
        tier: ((_profile_premiumProfile11 = profile.premiumProfile) === null || _profile_premiumProfile11 === void 0 ? void 0 : _profile_premiumProfile11.tier) || "free",
        username: profile.username,
        id: profile.id,
        customDomain: (_profile_premiumProfile12 = profile.premiumProfile) === null || _profile_premiumProfile12 === void 0 ? void 0 : _profile_premiumProfile12.customDomain
    })), !profile.username && /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] text-amber-600 font-medium"
    }, "⚠️ No username set. Using ID as fallback.")), !profile.username && /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-lg font-bold border border-amber-100 shrink-0"
    }, "SET USERNAME")), /*#__PURE__*/ React.createElement("div", {
        className: cn("p-4 rounded-xl border", ((_profile_premiumProfile13 = profile.premiumProfile) === null || _profile_premiumProfile13 === void 0 ? void 0 : _profile_premiumProfile13.tier) === "pro" ? "bg-white/5 border-white/10" : "bg-indigo-50/50 border-indigo-100")
    }, /*#__PURE__*/ React.createElement("h4", {
        className: cn("text-[9px] font-bold uppercase mb-2", ((_profile_premiumProfile14 = profile.premiumProfile) === null || _profile_premiumProfile14 === void 0 ? void 0 : _profile_premiumProfile14.tier) === "pro" ? "text-amber-300" : "text-indigo-700")
    }, "Portfolio Status"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: cn("w-2 h-2 rounded-full", profile.username ? "bg-emerald-500" : "bg-amber-500")
    }), /*#__PURE__*/ React.createElement("span", {
        className: cn("text-[10px]", ((_profile_premiumProfile15 = profile.premiumProfile) === null || _profile_premiumProfile15 === void 0 ? void 0 : _profile_premiumProfile15.tier) === "pro" ? "text-slate-300" : "text-slate-600")
    }, profile.username ? "URL Identifier: @".concat(profile.username) : "Using temporary ID link")), /*#__PURE__*/ React.createElement("div", {
        className: "mt-3 flex flex-wrap gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: cn("rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em]", ((_profile_premiumProfile16 = profile.premiumProfile) === null || _profile_premiumProfile16 === void 0 ? void 0 : _profile_premiumProfile16.tier) === "pro" ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-200")
    }, ((_profile_premiumProfile17 = profile.premiumProfile) === null || _profile_premiumProfile17 === void 0 ? void 0 : _profile_premiumProfile17.tier) === "pro" ? "Freelancer Pro" : "Free Profile"), ((_profile_premiumProfile18 = profile.premiumProfile) === null || _profile_premiumProfile18 === void 0 ? void 0 : _profile_premiumProfile18.verifiedBadge) && /*#__PURE__*/ React.createElement("span", {
        className: "rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-700"
    }, "Verified Badge"), ((_profile_premiumProfile19 = profile.premiumProfile) === null || _profile_premiumProfile19 === void 0 ? void 0 : (_profile_premiumProfile_verifiedProgram = _profile_premiumProfile19.verifiedProgram) === null || _profile_premiumProfile_verifiedProgram === void 0 ? void 0 : _profile_premiumProfile_verifiedProgram.enrolled) && /*#__PURE__*/ React.createElement("span", {
        className: "rounded-full bg-emerald-500 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white"
    }, "Tara Verified"), ((_profile_premiumProfile20 = profile.premiumProfile) === null || _profile_premiumProfile20 === void 0 ? void 0 : _profile_premiumProfile20.analyticsEnabled) && /*#__PURE__*/ React.createElement("span", {
        className: "rounded-full bg-indigo-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-700"
    }, ((_profile_premiumProfile_analytics = profile.premiumProfile.analytics) === null || _profile_premiumProfile_analytics === void 0 ? void 0 : _profile_premiumProfile_analytics.profileViews) || 0, " Views")), ((_profile_premiumProfile21 = profile.premiumProfile) === null || _profile_premiumProfile21 === void 0 ? void 0 : _profile_premiumProfile21.tier) === "pro" && /*#__PURE__*/ React.createElement("div", {
        className: "mt-4 grid grid-cols-2 gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white px-3 py-3 text-slate-900"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Client Clicks"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-1 text-lg font-black"
    }, ((_profile_premiumProfile_analytics1 = profile.premiumProfile.analytics) === null || _profile_premiumProfile_analytics1 === void 0 ? void 0 : _profile_premiumProfile_analytics1.clientClicks) || 0)), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white/10 px-3 py-3 text-white border border-white/10"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Conversion Tools"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-1 text-sm font-black"
    }, profile.premiumProfile.videoIntroUrl ? "Video Ready" : "Add Intro"))), ((_profile_premiumProfile22 = profile.premiumProfile) === null || _profile_premiumProfile22 === void 0 ? void 0 : (_profile_premiumProfile_verifiedProgram1 = _profile_premiumProfile22.verifiedProgram) === null || _profile_premiumProfile_verifiedProgram1 === void 0 ? void 0 : _profile_premiumProfile_verifiedProgram1.enrolled) && /*#__PURE__*/ React.createElement("div", {
        className: "mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black uppercase tracking-[0.2em] text-emerald-300"
    }, "Verification Benefits"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 text-xs leading-relaxed text-slate-300"
    }, "Identity verified, portfolio reviewed, higher search ranking enabled, and stronger client trust treatment active."))), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            var _profile_premiumProfile, _profile_premiumProfile1;
            var url = buildPublicProfileUrl({
                tier: ((_profile_premiumProfile = profile.premiumProfile) === null || _profile_premiumProfile === void 0 ? void 0 : _profile_premiumProfile.tier) || "free",
                username: profile.username,
                id: profile.id,
                customDomain: (_profile_premiumProfile1 = profile.premiumProfile) === null || _profile_premiumProfile1 === void 0 ? void 0 : _profile_premiumProfile1.customDomain
            });
            navigator.clipboard.writeText(url);
            setToastMsg("Portfolio link copied to clipboard!");
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 3000);
        },
        className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
    }, /*#__PURE__*/ React.createElement(Copy, {
        className: "w-3.5 h-3.5"
    }), "Copy Link"), /*#__PURE__*/ React.createElement(Link, {
        href: buildPublicProfileUrl({
            tier: ((_profile_premiumProfile23 = profile.premiumProfile) === null || _profile_premiumProfile23 === void 0 ? void 0 : _profile_premiumProfile23.tier) || "free",
            username: profile.username,
            id: profile.id,
            customDomain: (_profile_premiumProfile24 = profile.premiumProfile) === null || _profile_premiumProfile24 === void 0 ? void 0 : _profile_premiumProfile24.customDomain
        }),
        target: "_blank",
        className: "flex items-center justify-center p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
    }, /*#__PURE__*/ React.createElement(ExternalLink, {
        className: "w-4 h-4"
    }))), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-medium italic"
    }, "Professional URL: share this with employers to showcase your work for free."), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowUpgradePlans(true);
        },
        className: "w-full rounded-xl bg-amber-500 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400"
    }, "Upgrade Plans")))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 p-6 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-500"
    }), /*#__PURE__*/ React.createElement("h3", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Award, {
        className: "w-4 h-4 text-indigo-400"
    }), "Career Credentials"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, profile.verifiedSkills && profile.verifiedSkills.length > 0 && /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-bold text-slate-500 uppercase tracking-widest"
    }, "Technical Mastery"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2"
    }, profile.verifiedSkills.map(function(skill) {
        return /*#__PURE__*/ React.createElement("div", {
            key: skill.name,
            className: "flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-inner"
        }, /*#__PURE__*/ React.createElement(Verified, {
            className: "w-3.5 h-3.5 text-emerald-400"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-emerald-100 tracking-tight"
        }, skill.name));
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-bold text-slate-500 uppercase tracking-widest"
    }, "Behavioral Excellence"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-2.5"
    }, (_profile_softSkills = profile.softSkills) === null || _profile_softSkills === void 0 ? void 0 : _profile_softSkills.map(function(skill) {
        return /*#__PURE__*/ React.createElement(motion.div, {
            key: skill.name,
            whileHover: {
                scale: 1.02,
                x: 4
            },
            className: "group relative flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-default"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-9 h-9 flex items-center justify-center bg-slate-800/80 rounded-lg border border-white/5 text-lg shadow-sm"
        }, skill.badge), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "text-[11px] font-bold text-slate-200"
        }, skill.name), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5 mt-0.5"
        }, /*#__PURE__*/ React.createElement(Medal, {
            className: cn("w-3 h-3", skill.level === "Master" ? "text-amber-400" : skill.level === "Expert" ? "text-slate-300" : "text-orange-400")
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-bold text-slate-500 uppercase tracking-tighter group-hover:text-slate-400 transition-colors"
        }, skill.level)))), /*#__PURE__*/ React.createElement("div", {
            className: "text-[9px] font-black text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-white/5 group-hover:text-indigo-400 transition-colors"
        }, skill.count, "x"));
    }))), profile.ranking ? /*#__PURE__*/ React.createElement("div", {
        className: "mt-4 pt-4 border-t border-white/5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between px-3 py-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Trophy, {
        className: "w-3.5 h-3.5 text-indigo-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-indigo-100 uppercase tracking-widest"
    }, "Elite Tier • Top ", profile.ranking, "%")), /*#__PURE__*/ React.createElement("div", {
        className: "w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"
    }))) : null)), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-4 h-4 text-indigo-600"
    }), "Connected Accounts"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-4 h-4 text-red-500"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-slate-700"
    }, "Google / Gmail")), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-emerald-600"
    }, "Active")))))))) : view === "client" ? /*#__PURE__*/ React.createElement("div", {
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto sticky top-20 z-40"
    }, [
        {
            id: "overview",
            label: "Overview",
            icon: LayoutDashboard
        },
        {
            id: "post",
            label: "Post a Job",
            icon: PlusCircle
        },
        {
            id: "postings",
            label: "My Postings",
            icon: FileText
        },
        {
            id: "talents",
            label: "Find Talents",
            icon: Users
        },
        {
            id: "profile",
            label: "Company Profile",
            icon: User
        }
    ].map(function(tab) {
        return /*#__PURE__*/ React.createElement("button", {
            key: tab.id,
            onClick: function onClick() {
                return setClientTab(tab.id);
            },
            className: "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ".concat(clientTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")
        }, /*#__PURE__*/ React.createElement(tab.icon, {
            className: "w-4 h-4"
        }), /*#__PURE__*/ React.createElement("span", null, tab.label));
    })), /*#__PURE__*/ React.createElement(AnimatePresence, {
        mode: "wait"
    }, clientTab === "overview" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "overview",
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: -10
        },
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative overflow-hidden rounded-2xl bg-slate-900 p-8 md:p-12 text-white shadow-xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10 max-w-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[10px] font-bold mb-6 uppercase tracking-wider"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-3.5 h-3.5"
    }), "Verified Employer"), /*#__PURE__*/ React.createElement("h2", {
        className: "text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight"
    }, "Hire top talent for ", /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400"
    }, profile.companyName || "your company")), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-300 text-lg mb-8 opacity-90 font-medium"
    }, "Ready to scale your team? Post a job and get matches in minutes."), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-2xl font-bold text-white"
    }, employerJobs.length), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest"
    }, "Active Posts")), /*#__PURE__*/ React.createElement("div", {
        className: "w-px h-10 bg-white/10 mx-2"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-2xl font-bold text-white"
    }, "₱0"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest"
    }, "Total Spent")))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-4 h-4 text-indigo-600"
    }), "Employer Stats"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-slate-500 font-semibold uppercase tracking-wider"
    }, "Active Postings"), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-bold text-slate-900"
    }, employerJobs.length)), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-slate-500 font-semibold uppercase tracking-wider"
    }, "Total Spent"), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-bold text-emerald-600"
    }, "₱0")))), /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 bg-slate-900 p-6 rounded-2xl text-white shadow-lg overflow-hidden relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold mb-2"
    }, "Team Management"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-400 mb-4 leading-relaxed"
    }, "Invite teammates to review applications and manage projects together."), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return alert("Squad management for Employers coming soon!");
        },
        className: "text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
    }, "Configure Team ", /*#__PURE__*/ React.createElement(ArrowUpRight, {
        className: "w-3 h-3"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-600/10 rounded-full blur-xl"
    })))), clientTab === "post" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "post",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "max-w-5xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/20 p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100"
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: "w-6 h-6 text-slate-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-slate-900"
    }, "Post a New Job"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-medium"
    }, "Find the perfect talent for your project.")))), /*#__PURE__*/ React.createElement(JobPostingForm, {
        onPublish: function onPublish() {
            fetchEmployerJobs(user.id);
            setClientTab("postings");
        }
    }))), clientTab === "postings" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "postings",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-end"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-slate-900"
    }, "Your Job Postings"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 mt-1"
    }, "Manage and track your active opportunities."))), employerJobs.length > 0 ? /*#__PURE__*/ React.createElement("div", {
        className: "grid gap-4"
    }, employerJobs.map(function(job) {
        return /*#__PURE__*/ React.createElement("div", {
            key: job.id,
            className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3 mb-1"
        }, /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-bold text-slate-900"
        }, job.title), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-widest"
        }, job.category)), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500 font-medium"
        }, "Posted on ", new Date(job.createdAt).toLocaleDateString())), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-lg font-bold text-slate-900"
        }, job.rate || (job.budget ? "₱".concat(job.budget) : "Not specified")))), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center pt-4 border-t border-slate-50"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-bold text-slate-900"
        }, job.applicantCount || 0), /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-bold text-slate-400 uppercase tracking-widest"
        }, "Proposals"))), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return fetchApplicants(job.id, job.title);
            },
            className: "px-4 py-2 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all uppercase tracking-wider"
        }, "View Applicants"))));
    })) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-100"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm"
    }, "No jobs posted yet."))), clientTab === "talents" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "talents",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row justify-between items-end gap-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold text-slate-900"
    }, "Top Rated Freelancers"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 mt-1"
    }, "Discover world-class talent to scale your project.")), /*#__PURE__*/ React.createElement("div", {
        className: "relative w-full md:w-64"
    }, /*#__PURE__*/ React.createElement(SearchIcon, {
        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Search skills...",
        className: "w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
        value: freelancerSearchTerm,
        onChange: function onChange(e) {
            return setFreelancerSearchTerm(e.target.value);
        }
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, filteredFreelancers.map(function(freelancer) {
        var _freelancer_wellness;
        return /*#__PURE__*/ React.createElement("div", {
            key: freelancer.id,
            className: "bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-100 transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4 mb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0"
        }, freelancer.avatar_url ? /*#__PURE__*/ React.createElement("img", {
            src: freelancer.avatar_url,
            alt: freelancer.name,
            className: "w-full h-full object-cover"
        }) : /*#__PURE__*/ React.createElement(Users, {
            className: "w-6 h-6 text-indigo-400"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
            className: "font-bold text-slate-900 group-hover:text-indigo-600 transition-colors"
        }, freelancer.name), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest"
        }, freelancer.category), ((_freelancer_wellness = freelancer.wellness) === null || _freelancer_wellness === void 0 ? void 0 : _freelancer_wellness.verifiedSustainable) && /*#__PURE__*/ React.createElement("span", {
            className: "inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest",
            title: "Verified Sustainable Performer"
        }, /*#__PURE__*/ React.createElement(ShieldCheck, {
            className: "w-3 h-3"
        }), "Sustainable")))), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center pt-4 border-t border-slate-50"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-bold text-slate-900"
        }, freelancer.hourlyRate, "/hr"), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                setSelectedFreelancer(freelancer);
                setShowFreelancerModal(true);
            },
            className: "px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-black transition-all uppercase tracking-widest"
        }, "View Profile")));
    }))), clientTab === "profile" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "profile",
        initial: {
            opacity: 0,
            x: 20
        },
        animate: {
            opacity: 1,
            x: 0
        },
        exit: {
            opacity: 0,
            x: -20
        },
        className: "max-w-4xl"
    }, /*#__PURE__*/ React.createElement(ProfileForm, {
        initialProfile: profile,
        onUpdate: handleProfileSave,
        isSaving: isSaving
    })))) : /*#__PURE__*/ React.createElement(AdminDashboard, null)), /*#__PURE__*/ React.createElement(AnimatePresence, null, showUpgradePlans && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[80] flex items-center justify-center p-4"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: function onClick() {
            return setShowUpgradePlans(false);
        },
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 20,
            scale: 0.96
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            y: 20,
            scale: 0.96
        },
        className: "relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-6 flex items-start justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Upgrade Plans"), /*#__PURE__*/ React.createElement("h3", {
        className: "mt-1 text-2xl font-black text-slate-900"
    }, "Free vs Premium"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-1 text-sm text-slate-500"
    }, "Pili ka ng plan, then continue to PayMongo checkout.")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowUpgradePlans(false);
        },
        className: "rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
    }, "Close")), /*#__PURE__*/ React.createElement("div", {
        className: "grid gap-4 md:grid-cols-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl border border-slate-200 bg-slate-50 p-5"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-500"
    }, "Free Profile"), /*#__PURE__*/ React.createElement("ul", {
        className: "mt-3 space-y-2 text-sm text-slate-700"
    }, /*#__PURE__*/ React.createElement("li", null, "Basic portfolio"), /*#__PURE__*/ React.createElement("li", null, "Skills and experience"), /*#__PURE__*/ React.createElement("li", null, "Standard profile URL"), /*#__PURE__*/ React.createElement("li", null, "No premium credits"))), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-amber-700"
    }, "Premium Profile"), /*#__PURE__*/ React.createElement("ul", {
        className: "mt-3 space-y-2 text-sm text-slate-800"
    }, /*#__PURE__*/ React.createElement("li", null, "Verified badge + stronger profile trust"), /*#__PURE__*/ React.createElement("li", null, "Advanced portfolio sections"), /*#__PURE__*/ React.createElement("li", null, "Monthly premium credits"), /*#__PURE__*/ React.createElement("li", null, "Top-up support via PayMongo")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return void startUpgradeCheckout("pro");
        },
        disabled: planCheckoutLoading === "pro",
        className: "mt-5 w-full rounded-xl bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-950 hover:bg-amber-400 disabled:opacity-60"
    }, planCheckoutLoading === "pro" ? "Redirecting..." : "Upgrade to Premium"))), ((_profile_premiumProfile25 = profile.premiumProfile) === null || _profile_premiumProfile25 === void 0 ? void 0 : _profile_premiumProfile25.tier) === "pro" && /*#__PURE__*/ React.createElement("div", {
        className: "mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between gap-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700"
    }, "Need more credits?"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-semibold text-emerald-900"
    }, "Top-up package: +10 Premium Credits")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return void startUpgradeCheckout("credit_topup");
        },
        disabled: planCheckoutLoading === "credit_topup",
        className: "rounded-xl bg-emerald-600 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-emerald-700 disabled:opacity-60"
    }, planCheckoutLoading === "credit_topup" ? "Redirecting..." : "Top-up Credits")))))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showFreelancerModal && selectedFreelancer && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[60] flex items-center justify-center p-4"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: function onClick() {
            return setShowFreelancerModal(false);
        },
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.9,
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 20
        },
        className: "relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-indigo-100"
    }, selectedFreelancer.avatar_url ? /*#__PURE__*/ React.createElement("img", {
        src: selectedFreelancer.avatar_url,
        className: "w-full h-full object-cover",
        alt: ""
    }) : /*#__PURE__*/ React.createElement(Users, {
        className: "w-6 h-6 text-indigo-400"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, selectedFreelancer.name), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest"
    }, selectedFreelancer.category), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-emerald-600"
    }, selectedFreelancer.hourlyRate, "/hr")))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowFreelancerModal(false);
        },
        className: "p-2 hover:bg-slate-50 rounded-xl transition-all"
    }, /*#__PURE__*/ React.createElement(XCircle, {
        className: "w-6 h-6 text-slate-300 hover:text-slate-500"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-1 space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-950 p-6 rounded-2xl border border-white/10 text-white shadow-2xl overflow-hidden relative group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -z-10 group-hover:bg-indigo-500/30 transition-all duration-700"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Users, {
        className: "w-3 h-3"
    }), "Network Action"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return toggleFollow(selectedFreelancer.id);
        },
        className: "w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ".concat(userFollows.includes(selectedFreelancer.id) ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20')
    }, userFollows.includes(selectedFreelancer.id) ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-4 h-4"
    }), "Following") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(PlusCircle, {
        className: "w-4 h-4"
    }), "Follow")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            router.push("/messages?with=".concat(selectedFreelancer.id));
        },
        className: "w-full py-3 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-4 h-4"
    }), "Message"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] text-slate-500 text-center font-bold uppercase tracking-widest mt-2"
    }, "Note: Mutual follows are required for networking messages."))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 p-6 rounded-2xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4"
    }, "Top Skills"), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2"
    }, selectedFreelancer.skills.map(function(skill) {
        return /*#__PURE__*/ React.createElement("span", {
            key: skill,
            className: "px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600"
        }, skill);
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-900 p-6 rounded-2xl text-white shadow-lg"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-bold mb-2"
    }, "Quick Action"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-indigo-200 mb-6 leading-relaxed"
    }, "Ready to discuss your project with ", (selectedFreelancer.name || "User").split(' ')[0], "?"), /*#__PURE__*/ React.createElement(Link, {
        href: "/messages?with=".concat(selectedFreelancer.id),
        className: "w-full bg-white text-indigo-600 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all uppercase tracking-widest"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-4 h-4"
    }), "Send a Message"))), /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest"
    }, "About"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 leading-relaxed font-medium"
    }, selectedFreelancer.bio || "No detailed bio provided yet.")), /*#__PURE__*/ React.createElement("div", {
        className: "pt-6 border-t border-slate-100"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest"
    }, "Portfolio Showcase"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-4"
    }, selectedFreelancer.portfolio && selectedFreelancer.portfolio.length > 0 ? selectedFreelancer.portfolio.map(function(item) {
        return /*#__PURE__*/ React.createElement("div", {
            key: item.id,
            className: "p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-start gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center shrink-0"
        }, /*#__PURE__*/ React.createElement(Code, {
            className: "w-6 h-6 text-indigo-500"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1"
        }, /*#__PURE__*/ React.createElement("h5", {
            className: "font-bold text-slate-900 mb-1"
        }, item.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500 leading-relaxed mb-4"
        }, item.description), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-2"
        }, item.technologies.map(function(t) {
            return /*#__PURE__*/ React.createElement("span", {
                key: t,
                className: "px-2 py-0.5 bg-white border border-slate-100 rounded text-[9px] font-bold text-slate-400"
            }, t);
        })), item.project_url && /*#__PURE__*/ React.createElement("a", {
            href: item.project_url,
            target: "_blank",
            className: "inline-flex items-center gap-1.5 text-indigo-600 text-[10px] font-bold mt-4 hover:underline"
        }, "View Project ", /*#__PURE__*/ React.createElement(ExternalLink, {
            className: "w-3 h-3"
        })))));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-sm"
    }, "No portfolio items shown.")))))))))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showApplicantsModal && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[60] flex items-center justify-center p-4"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: function onClick() {
            return setShowApplicantsModal(false);
        },
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        className: "relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Applicants for"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium text-indigo-600 truncate max-w-md"
    }, selectedJobTitle)), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowApplicantsModal(false);
        },
        className: "p-2 hover:bg-slate-50 rounded-xl transition-all"
    }, /*#__PURE__*/ React.createElement(XCircle, {
        className: "w-6 h-6 text-slate-300 hover:text-slate-500"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 overflow-y-auto p-6 space-y-4"
    }, selectedJobApplicants.length > 0 ? selectedJobApplicants.map(function(app) {
        var _app_profiles, _app_profiles1, _app_profiles2, _app_profiles3, _employerJobs_find;
        return /*#__PURE__*/ React.createElement("div", {
            key: app.id,
            className: "p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col md:flex-row items-start gap-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0 shadow-sm"
        }, ((_app_profiles = app.profiles) === null || _app_profiles === void 0 ? void 0 : _app_profiles.avatar_url) ? /*#__PURE__*/ React.createElement("img", {
            src: app.profiles.avatar_url,
            className: "w-full h-full object-cover",
            alt: ""
        }) : /*#__PURE__*/ React.createElement(Users, {
            className: "w-8 h-8 text-indigo-400"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 min-w-0 space-y-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap justify-between items-start gap-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-black text-slate-900 text-xl tracking-tight"
        }, ((_app_profiles1 = app.profiles) === null || _app_profiles1 === void 0 ? void 0 : _app_profiles1.name) || "Unknown Freelancer"), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2 mt-1"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold bg-white text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-widest"
        }, (_app_profiles2 = app.profiles) === null || _app_profiles2 === void 0 ? void 0 : _app_profiles2.category), ((_app_profiles3 = app.profiles) === null || _app_profiles3 === void 0 ? void 0 : _app_profiles3.wellness) && /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-amber-50 border-amber-100"
        }, /*#__PURE__*/ React.createElement(Zap, {
            className: "w-3 h-3 text-amber-500"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-amber-700 uppercase tracking-widest"
        }, energyScore(app.profiles.wellness.energyRating, (_employerJobs_find = employerJobs.find(function(j) {
            return j.title === selectedJobTitle;
        })) === null || _employerJobs_find === void 0 ? void 0 : _employerJobs_find.energyRequirement), "% Compatibility")), /*#__PURE__*/ React.createElement("span", {
            className: cn("text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-widest", app.status === 'hired' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : app.status === 'rejected' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100")
        }, app.status))), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1"
        }, "Applied Date"), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs font-black text-slate-900"
        }, new Date(app.created_at).toLocaleDateString()))), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-3"
        }, app.resume_url && /*#__PURE__*/ React.createElement("a", {
            href: app.resume_url,
            target: "_blank",
            className: "flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(FileText, {
            className: "w-4 h-4 text-rose-500"
        })), "Professional Resume", /*#__PURE__*/ React.createElement(ExternalLink, {
            className: "w-3 h-3 ml-auto opacity-40"
        })), app.portfolio_url && /*#__PURE__*/ React.createElement("a", {
            href: app.portfolio_url,
            target: "_blank",
            className: "flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement(Code, {
            className: "w-4 h-4 text-indigo-500"
        })), "Project Portfolio", /*#__PURE__*/ React.createElement(ExternalLink, {
            className: "w-3 h-3 ml-auto opacity-40"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2.5 flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement(Sparkles, {
            className: "w-3.5 h-3.5 text-amber-500"
        }), "freelancer's Message"), /*#__PURE__*/ React.createElement("p", {
            className: "text-sm text-slate-600 leading-relaxed font-medium italic"
        }, '"', app.cover_letter || "No cover letter provided.", '"')), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-3 pt-2"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                setVettingData(app);
                setIsVetting(true);
            },
            className: "px-6 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-widest flex items-center gap-2 border border-slate-800 shadow-xl shadow-slate-900/10 active:scale-95"
        }, /*#__PURE__*/ React.createElement(Brain, {
            className: "w-3.5 h-3.5 text-indigo-400"
        }), "Start AI Vetting"), app.status === 'pending' && /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                var job = employerJobs.find(function(j) {
                    return j.title === selectedJobTitle;
                });
                approveApplication(app.id, app.freelancer_id, app.job_id, selectedJobTitle, (job === null || job === void 0 ? void 0 : job.budget) || 0);
            },
            disabled: isSaving,
            className: "px-6 py-3 bg-indigo-600 text-white text-[10px] font-bold rounded-xl hover:bg-indigo-700 transition-all uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-indigo-500/20 active:scale-95"
        }, /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-4 h-4"
        }), "Approve & Fund Budget"), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                setSelectedFreelancer(app.profiles);
                setShowFreelancerModal(true);
            },
            className: "px-5 py-3 bg-white text-slate-900 border border-slate-200 text-[10px] font-bold rounded-xl hover:bg-slate-50 transition-all uppercase tracking-widest"
        }, "Profile Details"), /*#__PURE__*/ React.createElement(Link, {
            href: "/messages?with=".concat(app.freelancer_id),
            className: "px-5 py-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement(Mail, {
            className: "w-4 h-4 text-indigo-400"
        }), "Interview Chat")))));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(Users, {
        className: "w-8 h-8 text-slate-200"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-medium"
    }, "No applications for this job yet.")))))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showApplyModal && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: function onClick() {
            return setShowApplyModal(false);
        },
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        className: "relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black text-slate-900 tracking-tight"
    }, "Prove Your Legitimacy"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium text-slate-500"
    }, "Provide your credentials to the employer.")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowApplyModal(false);
        },
        className: "p-2 hover:bg-slate-50 rounded-xl transition-all"
    }, /*#__PURE__*/ React.createElement(XCircle, {
        className: "w-6 h-6 text-slate-300 hover:text-slate-500"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "p-8 space-y-6 overflow-y-auto max-h-[70vh]"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(FileText, {
        className: "w-3.5 h-3.5"
    }), "Resume URL (PDF/Drive)"), /*#__PURE__*/ React.createElement("input", {
        type: "url",
        placeholder: "https://drive.google.com/your-resume",
        className: "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
        value: applyData.resumeUrl,
        onChange: function onChange(e) {
            return setApplyData(_object_spread_props(_object_spread({}, applyData), {
                resumeUrl: e.target.value
            }));
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Code, {
        className: "w-3.5 h-3.5"
    }), "Portfolio URL (GitHub/Behance)"), /*#__PURE__*/ React.createElement("input", {
        type: "url",
        placeholder: "https://github.com/your-portfolio",
        className: "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
        value: applyData.portfolioUrl,
        onChange: function onChange(e) {
            return setApplyData(_object_spread_props(_object_spread({}, applyData), {
                portfolioUrl: e.target.value
            }));
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(ExternalLink, {
        className: "w-3.5 h-3.5"
    }), "Interview Video/Link (Optional)"), /*#__PURE__*/ React.createElement("input", {
        type: "url",
        placeholder: "https://loom.com/your-intro",
        className: "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
        value: applyData.interviewUrl,
        onChange: function onChange(e) {
            return setApplyData(_object_spread_props(_object_spread({}, applyData), {
                interviewUrl: e.target.value
            }));
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-3.5 h-3.5"
    }), "Short Message to employer"), /*#__PURE__*/ React.createElement("textarea", {
        rows: 4,
        placeholder: "Tell the employer why you're a good fit...",
        className: "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none",
        value: applyData.coverLetter,
        onChange: function onChange(e) {
            return setApplyData(_object_spread_props(_object_spread({}, applyData), {
                coverLetter: e.target.value
            }));
        }
    })), /*#__PURE__*/ React.createElement("button", {
        onClick: submitApplication,
        disabled: isSaving,
        className: "w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
    }, isSaving ? "Submitting..." : "Submit My Application", !isSaving && /*#__PURE__*/ React.createElement(ArrowUpRight, {
        className: "w-4 h-4"
    })))))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showToast && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 50,
            x: "-50%"
        },
        animate: {
            opacity: 1,
            y: 0,
            x: "-50%"
        },
        exit: {
            opacity: 0,
            y: 20,
            x: "-50%"
        },
        className: "fixed bottom-8 left-1/2 z-50 w-full max-w-md px-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0"
    }, /*#__PURE__*/ React.createElement(Bell, {
        className: "w-5 h-5 text-white animate-ring"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold tracking-tight"
    }, toastMsg), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest"
    }, "Security Notification")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowToast(false);
        },
        className: "text-slate-500 hover:text-white transition-colors"
    }, "\xd7")))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showEscrowModal && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: function onClick() {
            return setShowEscrowModal(false);
        },
        className: "absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        animate: {
            opacity: 1,
            scale: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        className: "relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 p-8 text-white relative"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-indigo-400 text-[10px] font-bold mb-4 uppercase tracking-wider"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-3.5 h-3.5"
    }), "Trust & Safety"), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black tracking-tight"
    }, "Tara Safe-Vault System"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-sm mt-2 font-medium"
    }, "How we protect your payments and work.")), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-12 -top-12 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "p-8 space-y-6"
    }, [
        {
            title: "Funds are Locked",
            desc: "When a project starts, the employer deposits funds into Tara's secure Escrow account. This confirms the budget is ready.",
            icon: Lock
        },
        {
            title: "Work is Verified",
            desc: "The freelancer submits milestones. employers review the work before any payment is released.",
            icon: CheckCircle2
        },
        {
            title: "Secure Release",
            desc: "Once approved, funds move from Escrow to the freelancer's wallet instantly. No delays.",
            icon: DollarSign
        },
        {
            title: "Dispute Protection",
            desc: "If something goes wrong, our Admin team reviews the Chat Logs and Evidence to ensure a fair resolution.",
            icon: Scale
        }
    ].map(function(step, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100"
        }, /*#__PURE__*/ React.createElement(step.icon, {
            className: "w-5 h-5 text-indigo-600"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-slate-900 text-sm"
        }, step.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500 mt-1 leading-relaxed font-medium"
        }, step.desc)));
    }), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowEscrowModal(false);
        },
        className: "w-full bg-slate-900 text-white py-4 rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
    }, "Understood, Got it!"))))), /*#__PURE__*/ React.createElement("footer", {
        className: "bg-slate-50 border-t border-slate-200 py-16 mt-20"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-full px-4 sm:px-10 text-center"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        className: "flex items-center justify-center gap-2 mb-6 mx-auto hover:opacity-80 transition-opacity"
    }, /*#__PURE__*/ React.createElement("img", {
        src: "/tarawork-removebg-preview.png",
        alt: "Tara Logo",
        className: "h-10 w-auto grayscale opacity-40"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-xs font-medium uppercase tracking-widest"
    }, "\xa9 2024 Tara Marketplace. All rights reserved."))));
}
