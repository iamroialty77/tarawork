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
import { useState, useEffect, useRef } from "react";
import { Camera, User, FileText, Sparkles, ShieldCheck, Star, FolderKanban, Briefcase, BarChart3, Settings2 } from "lucide-react";
import PortfolioManager from "./PortfolioManager";
import AIAgent from "./AIAgent";
import { getPremiumProfileDomain } from "../lib/profileUrl";
export default function ProfileForm(param) {
    var initialProfile = param.initialProfile, onUpdate = param.onUpdate, onOpenUpgradePlans = param.onOpenUpgradePlans, onAddPortfolio = param.onAddPortfolio, onUpdatePortfolio = param.onUpdatePortfolio, onRemovePortfolio = param.onRemovePortfolio, _param_isSaving = param.isSaving, isSaving = _param_isSaving === void 0 ? false : _param_isSaving;
    var _premiumProfile_billing, _premiumProfile_billing1, _premiumProfile_analytics, _premiumProfile_analytics1, _premiumProfile_verifiedProgram, _premiumProfile_verifiedProgram1, _premiumProfile_verifiedProgram2, _premiumProfile_verifiedProgram3, _premiumProfile_verifiedProgram4, _premiumProfile_verifiedProgram5, _premiumProfile_verifiedProgram6, _premiumProfile_verifiedProgram7, _premiumProfile_verifiedProgram8;
    var _useState = _sliced_to_array(useState(initialProfile), 2), profile = _useState[0], setProfile = _useState[1];
    var _useState1 = _sliced_to_array(useState(""), 2), skillInput = _useState1[0], setSkillInput = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), showAIAgent = _useState2[0], setShowAIAgent = _useState2[1];
    var _useState3 = _sliced_to_array(useState("basics"), 2), activeTab = _useState3[0], setActiveTab = _useState3[1];
    var _useState4 = _sliced_to_array(useState(null), 2), checkoutLoading = _useState4[0], setCheckoutLoading = _useState4[1];
    var fileInputRef = useRef(null);
    var resumeInputRef = useRef(null);
    var premiumProfile = profile.premiumProfile || {
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
    };
    var isPro = premiumProfile.tier === "pro";
    var isFreelancer = profile.role === "freelancer";
    var proLockedByBilling = !!((_premiumProfile_billing = premiumProfile.billing) === null || _premiumProfile_billing === void 0 ? void 0 : _premiumProfile_billing.proLocked) && premiumProfile.tier === "pro";
    var proExpiryDate = ((_premiumProfile_billing1 = premiumProfile.billing) === null || _premiumProfile_billing1 === void 0 ? void 0 : _premiumProfile_billing1.proExpiresAt) ? new Date(premiumProfile.billing.proExpiresAt) : null;
    var hasValidProExpiry = !!proExpiryDate && !Number.isNaN(proExpiryDate.getTime());
    var premiumDaysLeft = hasValidProExpiry && proExpiryDate ? Math.max(0, Math.ceil((proExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;
    var premiumExpiryLabel = hasValidProExpiry && proExpiryDate ? proExpiryDate.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric"
    }) : null;
    var autoPremiumDomain = getPremiumProfileDomain(profile.username, profile.id);
    // Sync internal state when prop changes (after fetch)
    useEffect(function() {
        setProfile(initialProfile);
    }, [
        initialProfile
    ]);
    useEffect(function() {
        if (!isFreelancer && (activeTab === "premium" || activeTab === "portfolio")) {
            setActiveTab("professional");
        }
    }, [
        activeTab,
        isFreelancer
    ]);
    var handleSubmit = function handleSubmit(e) {
        e.preventDefault();
        onUpdate(profile);
    };
    var handleFieldChange = function handleFieldChange(updates) {
        var newProfile = _object_spread({}, profile, updates);
        setProfile(newProfile);
    // Note: We don't call onUpdate here for every keystroke, 
    // only for definitive actions or on submit
    };
    var addSkill = function addSkill() {
        if (skillInput && !profile.skills.includes(skillInput)) {
            setProfile(_object_spread_props(_object_spread({}, profile), {
                skills: _to_consumable_array(profile.skills).concat([
                    skillInput
                ])
            }));
            setSkillInput("");
        }
    };
    var removeSkill = function removeSkill(skillToRemove) {
        setProfile(_object_spread_props(_object_spread({}, profile), {
            skills: profile.skills.filter(function(s) {
                return s !== skillToRemove;
            })
        }));
    };
    var addPortfolioItemLocal = function addPortfolioItemLocal(item) {
        if (onAddPortfolio) {
            onAddPortfolio(item);
            return;
        }
        var newItem = {
            id: Math.random().toString(36).substr(2, 9),
            profile_id: profile.id || "",
            title: item.title || "",
            description: item.description || "",
            project_url: item.project_url || "",
            technologies: item.technologies || [],
            created_at: new Date().toISOString()
        };
        setProfile(_object_spread_props(_object_spread({}, profile), {
            portfolio: _to_consumable_array(profile.portfolio || []).concat([
                newItem
            ])
        }));
    };
    var updatePortfolioItemLocal = function updatePortfolioItemLocal(item) {
        if (onUpdatePortfolio) {
            onUpdatePortfolio(item);
            return;
        }
        setProfile(_object_spread_props(_object_spread({}, profile), {
            portfolio: (profile.portfolio || []).map(function(i) {
                return i.id === item.id ? item : i;
            })
        }));
    };
    var removePortfolioItemLocal = function removePortfolioItemLocal(id) {
        if (onRemovePortfolio) {
            onRemovePortfolio(id);
            return;
        }
        setProfile(_object_spread_props(_object_spread({}, profile), {
            portfolio: (profile.portfolio || []).filter(function(item) {
                return item.id !== id;
            })
        }));
    };
    var handleImageUpload = function handleImageUpload(e) {
        var _e_target_files;
        var file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
        if (file) {
            // In a real app, you'd upload to Supabase Storage here
            // For now, we'll use a local URL or just simulate
            var reader = new FileReader();
            reader.onloadend = function() {
                setProfile(_object_spread_props(_object_spread({}, profile), {
                    avatar_url: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };
    var handleResumeUpload = function handleResumeUpload(e) {
        var _e_target_files;
        var file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
        if (!file) return;
        // Use AI Agent for professional parsing experience
        setShowAIAgent(true);
        if (resumeInputRef.current) resumeInputRef.current.value = "";
    };
    var handlePremiumChange = function handlePremiumChange(updates) {
        var _premiumProfile_analytics, _premiumProfile_analytics1;
        setProfile(_object_spread_props(_object_spread({}, profile), {
            premiumProfile: _object_spread_props(_object_spread({}, premiumProfile, updates), {
                analytics: _object_spread({
                    profileViews: ((_premiumProfile_analytics = premiumProfile.analytics) === null || _premiumProfile_analytics === void 0 ? void 0 : _premiumProfile_analytics.profileViews) || 0,
                    clientClicks: ((_premiumProfile_analytics1 = premiumProfile.analytics) === null || _premiumProfile_analytics1 === void 0 ? void 0 : _premiumProfile_analytics1.clientClicks) || 0
                }, updates.analytics || {})
            })
        }));
    };
    var startCheckout = function startCheckout(productType) {
        return _async_to_generator(function() {
            var response, payload, error, message;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!profile.id) {
                            window.alert("Save your profile first so the payment can be linked to your account.");
                            return [
                                2
                            ];
                        }
                        setCheckoutLoading(productType);
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
                                    email: undefined,
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
                        window.alert(message);
                        return [
                            3,
                            6
                        ];
                    case 5:
                        setCheckoutLoading(null);
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
    var handleAIParseComplete = function handleAIParseComplete(data) {
        var existingPortfolioIds = new Set((profile.portfolio || []).map(function(item) {
            return item.id;
        }));
        var newPortfolioItems = (data.portfolio || []).filter(function(item) {
            return !existingPortfolioIds.has(item.id);
        });
        var updatedProfile = _object_spread_props(_object_spread({}, profile), {
            name: data.name || profile.name,
            bio: data.bio || profile.bio,
            skills: Array.from(new Set(_to_consumable_array(profile.skills).concat(_to_consumable_array(data.skills || [])))),
            category: data.category || profile.category,
            portfolio: _to_consumable_array(profile.portfolio || []).concat(_to_consumable_array(newPortfolioItems))
        });
        setProfile(updatedProfile);
        onUpdate(updatedProfile);
        // Also notify if there are parent handlers for individual portfolio additions
        if (newPortfolioItems.length > 0 && onAddPortfolio) {
            newPortfolioItems.forEach(function(item) {
                return onAddPortfolio(item);
            });
        }
        setShowAIAgent(false);
    };
    var tabs = isFreelancer ? [
        {
            key: "basics",
            label: "Basics",
            icon: User
        },
        {
            key: "professional",
            label: "Professional",
            icon: Briefcase
        },
        {
            key: "premium",
            label: "Analytics",
            icon: BarChart3
        },
        {
            key: "portfolio",
            label: "Portfolio",
            icon: FolderKanban
        }
    ] : [
        {
            key: "basics",
            label: "Basics",
            icon: User
        },
        {
            key: "professional",
            label: "Company",
            icon: Settings2
        }
    ];
    var inputClassName = "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100";
    var labelClassName = "mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500";
    return /*#__PURE__*/ React.createElement("div", {
        className: "rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/40 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 p-5 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-start gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative shrink-0"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "h-20 w-20 overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-500 p-1 shadow-lg"
    }, profile.avatar_url ? /*#__PURE__*/ React.createElement("img", {
        src: profile.avatar_url,
        alt: "Profile",
        className: "h-full w-full rounded-[1.15rem] object-cover"
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "flex h-full w-full items-center justify-center rounded-[1.15rem] bg-white"
    }, /*#__PURE__*/ React.createElement(User, {
        className: "h-8 w-8 text-slate-300"
    }))), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            var _fileInputRef_current;
            return (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 ? void 0 : _fileInputRef_current.click();
        },
        className: "absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-md transition-all hover:scale-105 hover:text-indigo-600"
    }, /*#__PURE__*/ React.createElement(Camera, {
        className: "h-4 w-4"
    })), /*#__PURE__*/ React.createElement("input", {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        accept: "image/*",
        onChange: handleImageUpload
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500"
    }, isFreelancer ? "Freelancer profile" : "Client profile"), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-bold tracking-tight text-slate-950"
    }, profile.name || "Set your profile"), premiumProfile.verifiedBadge && /*#__PURE__*/ React.createElement("span", {
        className: "inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "h-3.5 w-3.5"
    }), "Verified"), isPro && /*#__PURE__*/ React.createElement("span", {
        className: "inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-700"
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "h-3.5 w-3.5"
    }), "Pro"))))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-3 sm:min-w-[280px]"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
    }, "Profile URL"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 truncate text-sm font-semibold text-slate-800"
    }, typeof window !== "undefined" ? window.location.host : "www.tarawork.online", "/", isPro ? "@".concat(profile.username || "username") : profile.username || "username")), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl border border-slate-200 bg-white px-4 py-3"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400"
    }, "Status"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 text-sm font-semibold text-slate-800"
    }, isSaving ? "Saving..." : isFreelancer ? "Open to work" : "Ready to hire"))))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-5 flex flex-wrap gap-2"
    }, tabs.map(function(tab) {
        var Icon = tab.icon;
        var isActive = activeTab === tab.key;
        return /*#__PURE__*/ React.createElement("button", {
            key: tab.key,
            type: "button",
            onClick: function onClick() {
                return setActiveTab(tab.key);
            },
            className: "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all ".concat(isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900")
        }, /*#__PURE__*/ React.createElement(Icon, {
            className: "h-4 w-4"
        }), tab.label);
    })), /*#__PURE__*/ React.createElement("form", {
        onSubmit: handleSubmit,
        className: "mt-5 space-y-5"
    }, activeTab === "basics" && /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-5"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-950"
    }, "Basic information"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500"
    }, "Core details na unang makikita sa profile mo.")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "sm:col-span-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Portfolio Username"), /*#__PURE__*/ React.createElement("div", {
        className: "flex overflow-hidden rounded-2xl border border-slate-200 bg-white"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "border-r border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
    }, typeof window !== "undefined" ? window.location.host : "tarawork.network", "/"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "username",
        className: "min-w-0 flex-1 px-4 py-3 text-sm text-slate-900 outline-none",
        value: profile.username || "",
        onChange: function onChange(e) {
            return setProfile(_object_spread_props(_object_spread({}, profile), {
                username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
            }));
        }
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Account Role"), /*#__PURE__*/ React.createElement("select", {
        className: inputClassName,
        value: profile.role,
        onChange: function onChange(e) {
            return handleFieldChange({
                role: e.target.value
            });
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: "freelancer"
    }, "Freelancer"), /*#__PURE__*/ React.createElement("option", {
        value: "employer"
    }, "Client"))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Full Name"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: inputClassName,
        value: profile.name,
        onChange: function onChange(e) {
            return handleFieldChange({
                name: e.target.value
            });
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "sm:col-span-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Short Bio"), /*#__PURE__*/ React.createElement("textarea", {
        className: inputClassName,
        rows: 4,
        value: profile.bio,
        onChange: function onChange(e) {
            return setProfile(_object_spread_props(_object_spread({}, profile), {
                bio: e.target.value
            }));
        }
    })))), activeTab === "professional" && /*#__PURE__*/ React.createElement("div", {
        className: "space-y-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-5"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-950"
    }, isFreelancer ? "Professional details" : "Company details"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500"
    }, isFreelancer ? "Skills, category, at work identity na mas important sa hiring." : "Impormasyon ng business para mas credible at presentable tingnan.")), profile.role === "employer" ? /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Company Name"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "e.g. TechCorp Solutions",
        className: inputClassName,
        value: profile.companyName || "",
        onChange: function onChange(e) {
            return handleFieldChange({
                companyName: e.target.value
            });
        }
    })) : /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 gap-4 sm:grid-cols-2"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Category"), /*#__PURE__*/ React.createElement("select", {
        className: inputClassName,
        value: profile.category,
        onChange: function onChange(e) {
            return setProfile(_object_spread_props(_object_spread({}, profile), {
                category: e.target.value
            }));
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: "General"
    }, "General"), /*#__PURE__*/ React.createElement("option", {
        value: "Developer"
    }, "Developer"), /*#__PURE__*/ React.createElement("option", {
        value: "Designer"
    }, "Designer"), /*#__PURE__*/ React.createElement("option", {
        value: "Graphic Design"
    }, "Graphic Design"), /*#__PURE__*/ React.createElement("option", {
        value: "Writer"
    }, "Writer"), /*#__PURE__*/ React.createElement("option", {
        value: "Marketing Specialist"
    }, "Marketing Specialist"), /*#__PURE__*/ React.createElement("option", {
        value: "Marketing"
    }, "Marketing"), /*#__PURE__*/ React.createElement("option", {
        value: "Virtual Assistant"
    }, "Virtual Assistant"), /*#__PURE__*/ React.createElement("option", {
        value: "Admin/VA"
    }, "Admin/VA"), /*#__PURE__*/ React.createElement("option", {
        value: "Customer Support"
    }, "Customer Support"), /*#__PURE__*/ React.createElement("option", {
        value: "Sales"
    }, "Sales"), /*#__PURE__*/ React.createElement("option", {
        value: "Project Management"
    }, "Project Management"), /*#__PURE__*/ React.createElement("option", {
        value: "QA/Testing"
    }, "QA/Testing"), /*#__PURE__*/ React.createElement("option", {
        value: "Data Entry"
    }, "Data Entry"), /*#__PURE__*/ React.createElement("option", {
        value: "Finance/Accounting"
    }, "Finance/Accounting"), /*#__PURE__*/ React.createElement("option", {
        value: "IT & Networking"
    }, "IT & Networking"), /*#__PURE__*/ React.createElement("option", {
        value: "Writing & Content"
    }, "Writing & Content"), /*#__PURE__*/ React.createElement("option", {
        value: "Data & Automation"
    }, "Data & Automation"), /*#__PURE__*/ React.createElement("option", {
        value: "Other"
    }, "Other"))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: labelClassName
    }, "Hourly Rate"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: inputClassName,
        value: profile.hourlyRate,
        onChange: function onChange(e) {
            return setProfile(_object_spread_props(_object_spread({}, profile), {
                hourlyRate: e.target.value
            }));
        }
    })))), isFreelancer && /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-start gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "h-5 w-5"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "text-base font-bold text-slate-950"
    }, "AI Resume Parser"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-600"
    }, "Upload PDF para auto-fill ang profile at skills mo."))), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            var _resumeInputRef_current;
            return (_resumeInputRef_current = resumeInputRef.current) === null || _resumeInputRef_current === void 0 ? void 0 : _resumeInputRef_current.click();
        },
        className: "inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700"
    }, /*#__PURE__*/ React.createElement(FileText, {
        className: "h-4 w-4"
    }), "Upload PDF")), /*#__PURE__*/ React.createElement("input", {
        type: "file",
        ref: resumeInputRef,
        className: "hidden",
        accept: ".pdf",
        onChange: handleResumeUpload
    })), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-base font-bold text-slate-950"
    }, "Skills"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500"
    }, "Panatilihing concise at relevant ang listahan.")), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-3 sm:flex-row"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: inputClassName,
        value: skillInput,
        onChange: function onChange(e) {
            return setSkillInput(e.target.value);
        },
        placeholder: "e.g. React",
        onKeyDown: function onKeyDown(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
            }
        }
    }), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: addSkill,
        className: "rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-black"
    }, "Add Skill")), /*#__PURE__*/ React.createElement("div", {
        className: "mt-4 flex flex-wrap gap-2"
    }, profile.skills.map(function(skill) {
        return /*#__PURE__*/ React.createElement("span", {
            key: skill,
            className: "inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700"
        }, skill, /*#__PURE__*/ React.createElement("button", {
            type: "button",
            onClick: function onClick() {
                return removeSkill(skill);
            },
            className: "text-indigo-400 transition-colors hover:text-indigo-700"
        }, "\xd7"));
    }))))), activeTab === "premium" && isFreelancer && /*#__PURE__*/ React.createElement("div", {
        className: "rounded-[2rem] border p-6 transition-all duration-300 ".concat(isPro ? "border-slate-900 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white shadow-2xl shadow-slate-900/20" : "border-slate-200 bg-white shadow-sm")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ".concat(isPro ? "border border-white/10 bg-white/10 text-amber-300" : "border border-slate-200 bg-slate-50 text-slate-600")
    }, /*#__PURE__*/ React.createElement(Star, {
        className: "h-3.5 w-3.5"
    }), isPro ? "Analytic Professional Board" : "Analytics Board"), /*#__PURE__*/ React.createElement("h3", {
        className: "mt-3 text-xl font-black ".concat(isPro ? "text-white" : "text-slate-900")
    }, "Performance Analytics"), isPro && premiumExpiryLabel && /*#__PURE__*/ React.createElement("p", {
        className: "".concat(isPro ? "text-slate-300" : "text-slate-500", " mt-1 text-sm")
    }, "Active until ", premiumExpiryLabel, premiumDaysLeft !== null ? " (".concat(premiumDaysLeft, " day").concat(premiumDaysLeft === 1 ? "" : "s", " left)") : "")), !isPro && /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return onOpenUpgradePlans === null || onOpenUpgradePlans === void 0 ? void 0 : onOpenUpgradePlans();
        },
        className: "rounded-xl bg-amber-500 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400"
    }, "Open Upgrade Plans")), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white p-4 text-slate-900"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Views"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 text-2xl font-black"
    }, ((_premiumProfile_analytics = premiumProfile.analytics) === null || _premiumProfile_analytics === void 0 ? void 0 : _premiumProfile_analytics.profileViews) || 0)), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl bg-white p-4 text-slate-900"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
    }, "Clicks"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 text-2xl font-black"
    }, ((_premiumProfile_analytics1 = premiumProfile.analytics) === null || _premiumProfile_analytics1 === void 0 ? void 0 : _premiumProfile_analytics1.clientClicks) || 0)), /*#__PURE__*/ React.createElement("div", {
        className: isPro ? "rounded-2xl border border-white/10 bg-white/5 p-4 text-white" : "rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-700"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.2em] ".concat(isPro ? "text-slate-300" : "text-slate-500")
    }, "Domain"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-2 text-sm font-bold truncate"
    }, isPro ? autoPremiumDomain : "Upgrade to unlock custom domain"))), isPro && /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 grid gap-4 md:grid-cols-2"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "mb-1 block text-xs font-black uppercase tracking-widest text-slate-400"
    }, "Premium URL (Auto)"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500",
        value: autoPremiumDomain,
        readOnly: true
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "mb-1 block text-xs font-black uppercase tracking-widest text-slate-400"
    }, "Intro Headline"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Helping founders launch polished digital products.",
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500",
        value: premiumProfile.introHeadline || "",
        onChange: function onChange(e) {
            return handlePremiumChange({
                introHeadline: e.target.value
            });
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "md:col-span-2"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "mb-1 block text-xs font-black uppercase tracking-widest text-slate-400"
    }, "Video Intro URL"), /*#__PURE__*/ React.createElement("input", {
        type: "url",
        placeholder: "https://www.loom.com/share/your-intro",
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500",
        value: premiumProfile.videoIntroUrl || "",
        onChange: function onChange(e) {
            return handlePremiumChange({
                videoIntroUrl: e.target.value
            });
        }
    })))), activeTab === "premium" && isFreelancer && /*#__PURE__*/ React.createElement("div", {
        className: "rounded-[2rem] border p-6 transition-all duration-300 ".concat(((_premiumProfile_verifiedProgram = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram === void 0 ? void 0 : _premiumProfile_verifiedProgram.enrolled) ? "border-emerald-300 bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 text-white shadow-2xl shadow-emerald-900/20" : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] ".concat(((_premiumProfile_verifiedProgram1 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram1 === void 0 ? void 0 : _premiumProfile_verifiedProgram1.enrolled) ? "border border-white/10 bg-white/10 text-emerald-300" : "border border-emerald-200 bg-white text-emerald-700")
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "h-3.5 w-3.5"
    }), ((_premiumProfile_verifiedProgram2 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram2 === void 0 ? void 0 : _premiumProfile_verifiedProgram2.enrolled) ? "Verified Program Active" : "Verified Freelancer Program"), /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black ".concat(((_premiumProfile_verifiedProgram3 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram3 === void 0 ? void 0 : _premiumProfile_verifiedProgram3.enrolled) ? "text-white" : "text-slate-900")
    }, "Verification")), /*#__PURE__*/ React.createElement("div", {
        className: "rounded-2xl px-4 py-3 ".concat(((_premiumProfile_verifiedProgram4 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram4 === void 0 ? void 0 : _premiumProfile_verifiedProgram4.enrolled) ? "bg-white/10 border border-white/10" : "bg-emerald-600 text-white")
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200"
    }, "Annual Fee"), /*#__PURE__*/ React.createElement("p", {
        className: "mt-1 text-lg font-black"
    }, "P499/year"))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 grid gap-3 md:grid-cols-4"
    }, [
        {
            title: "Verified identity",
            key: "identityVerified"
        },
        {
            title: "Verified portfolio",
            key: "portfolioVerified"
        },
        {
            title: "Higher search ranking",
            key: "higherSearchRanking"
        },
        {
            title: "Client trust boost",
            key: "clientTrustBoost"
        }
    ].map(function(item) {
        var _premiumProfile_verifiedProgram, _premiumProfile_verifiedProgram1, _premiumProfile_verifiedProgram2;
        return /*#__PURE__*/ React.createElement("div", {
            key: item.title,
            className: "rounded-2xl border p-4 ".concat(((_premiumProfile_verifiedProgram = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram === void 0 ? void 0 : _premiumProfile_verifiedProgram.enrolled) ? "border-white/10 bg-white/5" : "border-slate-200 bg-white")
        }, /*#__PURE__*/ React.createElement(ShieldCheck, {
            className: "h-4 w-4 mb-3 ".concat(((_premiumProfile_verifiedProgram1 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram1 === void 0 ? void 0 : _premiumProfile_verifiedProgram1.enrolled) ? "text-emerald-300" : "text-emerald-700")
        }), /*#__PURE__*/ React.createElement("h4", {
            className: "text-sm font-bold ".concat(((_premiumProfile_verifiedProgram2 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram2 === void 0 ? void 0 : _premiumProfile_verifiedProgram2.enrolled) ? "text-white" : "text-slate-900")
        }, item.title));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 flex flex-col gap-4 md:flex-row"
    }, /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            var _premiumProfile_verifiedProgram;
            if (!((_premiumProfile_verifiedProgram = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram === void 0 ? void 0 : _premiumProfile_verifiedProgram.enrolled)) {
                void startCheckout("verification");
            }
        },
        disabled: !!((_premiumProfile_verifiedProgram5 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram5 === void 0 ? void 0 : _premiumProfile_verifiedProgram5.enrolled) || checkoutLoading === "verification",
        className: "rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-70 ".concat(((_premiumProfile_verifiedProgram6 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram6 === void 0 ? void 0 : _premiumProfile_verifiedProgram6.enrolled) ? "bg-white text-slate-950" : "bg-emerald-600 text-white hover:bg-emerald-700")
    }, ((_premiumProfile_verifiedProgram7 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram7 === void 0 ? void 0 : _premiumProfile_verifiedProgram7.enrolled) ? "Verified Enrolled" : checkoutLoading === "verification" ? "Redirecting..." : "Pay for Verification")), !((_premiumProfile_verifiedProgram8 = premiumProfile.verifiedProgram) === null || _premiumProfile_verifiedProgram8 === void 0 ? void 0 : _premiumProfile_verifiedProgram8.enrolled) && /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-600"
    }, "Verification status is updated only after PayMongo confirms payment through your webhook endpoint.")), activeTab === "portfolio" && isFreelancer && /*#__PURE__*/ React.createElement("div", {
        className: "rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-5"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-950"
    }, "Portfolio"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500"
    }, "Projects at work samples sa hiwalay na panel para mas malinis ang page.")), /*#__PURE__*/ React.createElement(PortfolioManager, {
        items: profile.portfolio || [],
        onAdd: addPortfolioItemLocal,
        onUpdate: updatePortfolioItemLocal,
        onRemove: removePortfolioItemLocal,
        isOwner: true
    })), /*#__PURE__*/ React.createElement("button", {
        type: "submit",
        disabled: isSaving,
        className: "w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ".concat(isSaving ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95")
    }, isSaving ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"
    }), "Saving...") : "Save Profile Changes")), /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: showAIAgent,
        onClose: function onClose() {
            return setShowAIAgent(false);
        },
        mode: "resume-parse",
        targetData: {},
        onComplete: handleAIParseComplete
    }));
}
