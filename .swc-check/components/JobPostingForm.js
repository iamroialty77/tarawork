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
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Lock } from "lucide-react";
import { cn } from "../lib/utils";
export default function JobPostingForm(param) {
    var onPublish = param.onPublish;
    var _useState = _sliced_to_array(useState(1), 2), step = _useState[0], setStep = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isAiAnalyzing = _useState1[0], setIsAiAnalyzing = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isPublishing = _useState2[0], setIsPublishing = _useState2[1];
    var _useState3 = _sliced_to_array(useState(null), 2), publishStatus = _useState3[0], setPublishStatus = _useState3[1];
    var _useState4 = _sliced_to_array(useState({
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
        category: "General",
        energyRequirement: "Balanced"
    }), 2), formData = _useState4[0], setFormData = _useState4[1];
    var _useState5 = _sliced_to_array(useState(""), 2), skillInput = _useState5[0], setSkillInput = _useState5[1];
    var _useState6 = _sliced_to_array(useState({
        title: "",
        dueDate: "",
        amount: 0
    }), 2), newMilestone = _useState6[0], setNewMilestone = _useState6[1];
    var _useState7 = _sliced_to_array(useState(""), 2), newQuestion = _useState7[0], setNewQuestion = _useState7[1];
    var calculateScore = function calculateScore() {
        var _formData_skills, _formData_milestones;
        var score = 0;
        if (formData.title && formData.title.length > 10) score += 20;
        if (formData.description && formData.description.length > 50) score += 20;
        if ((((_formData_skills = formData.skills) === null || _formData_skills === void 0 ? void 0 : _formData_skills.length) || 0) >= 3) score += 20;
        if (formData.budget && formData.budget > 1000) score += 20;
        if ((((_formData_milestones = formData.milestones) === null || _formData_milestones === void 0 ? void 0 : _formData_milestones.length) || 0) >= 1) score += 10;
        if (formData.deadline) score += 10;
        return score;
    };
    var score = calculateScore();
    var nextStep = function nextStep() {
        setIsAiAnalyzing(true);
        setTimeout(function() {
            setStep(function(s) {
                return Math.min(s + 1, 3);
            });
            setIsAiAnalyzing(false);
        }, 800);
    };
    var suggestEnergyRequirement = function suggestEnergyRequirement() {
        setIsAiAnalyzing(true);
        setTimeout(function() {
            var desc = (formData.description || "").toLowerCase();
            var title = (formData.title || "").toLowerCase();
            var combined = desc + " " + title;
            var suggestion = "Balanced";
            if (combined.includes("urgent") || combined.includes("fast") || combined.includes("hard") || combined.includes("deadline") || combined.includes("complex") || combined.includes("immediate")) {
                suggestion = "High";
            } else if (combined.includes("flexible") || combined.includes("easy") || combined.includes("maintenance") || combined.includes("support") || combined.includes("whenever")) {
                suggestion = "Low";
            }
            setFormData(function(prev) {
                return _object_spread_props(_object_spread({}, prev), {
                    energyRequirement: suggestion
                });
            });
            setIsAiAnalyzing(false);
        }, 1200);
    };
    var prevStep = function prevStep() {
        return setStep(function(s) {
            return Math.max(s - 1, 1);
        });
    };
    var addSkill = function addSkill() {
        var _formData_skills;
        if (skillInput && !((_formData_skills = formData.skills) === null || _formData_skills === void 0 ? void 0 : _formData_skills.includes(skillInput))) {
            setFormData(_object_spread_props(_object_spread({}, formData), {
                skills: _to_consumable_array(formData.skills || []).concat([
                    skillInput
                ])
            }));
            setSkillInput("");
        }
    };
    var removeSkill = function removeSkill(skill) {
        var _formData_skills;
        setFormData(_object_spread_props(_object_spread({}, formData), {
            skills: (_formData_skills = formData.skills) === null || _formData_skills === void 0 ? void 0 : _formData_skills.filter(function(s) {
                return s !== skill;
            })
        }));
    };
    var addMilestone = function addMilestone() {
        if (newMilestone.title && newMilestone.amount) {
            var milestone = {
                id: Math.random().toString(36).substr(2, 9),
                title: newMilestone.title,
                dueDate: newMilestone.dueDate || "",
                amount: newMilestone.amount,
                status: "Pending"
            };
            setFormData(_object_spread_props(_object_spread({}, formData), {
                milestones: _to_consumable_array(formData.milestones || []).concat([
                    milestone
                ])
            }));
            setNewMilestone({
                title: "",
                dueDate: "",
                amount: 0
            });
        }
    };
    var addQuestion = function addQuestion() {
        var _formData_customQuestions;
        if (newQuestion && (((_formData_customQuestions = formData.customQuestions) === null || _formData_customQuestions === void 0 ? void 0 : _formData_customQuestions.length) || 0) < 3) {
            var question = {
                id: Math.random().toString(36).substr(2, 9),
                question: newQuestion
            };
            setFormData(_object_spread_props(_object_spread({}, formData), {
                customQuestions: _to_consumable_array(formData.customQuestions || []).concat([
                    question
                ])
            }));
            setNewQuestion("");
        }
    };
    var handlePublish = function handlePublish() {
        return _async_to_generator(function() {
            var _user_email, _ref, user, _ref1, profile, jobData, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setIsPublishing(true);
                        setPublishStatus(null);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            5,
                            6,
                            7
                        ]);
                        return [
                            4,
                            supabase.auth.getUser()
                        ];
                    case 2:
                        _ref = _state.sent(), user = _ref.data.user;
                        if (!user) throw new Error("User not authenticated");
                        return [
                            4,
                            supabase.from('profiles').select('companyName').eq('id', user.id).single()
                        ];
                    case 3:
                        _ref1 = _state.sent(), profile = _ref1.data;
                        jobData = {
                            id: Math.random().toString(36).substr(2, 9),
                            title: formData.title,
                            description: formData.description,
                            skills: formData.skills,
                            jobType: formData.jobType,
                            duration: formData.duration,
                            paymentMethod: formData.paymentMethod,
                            budget: formData.budget,
                            milestones: formData.milestones,
                            customQuestions: formData.customQuestions,
                            deadline: formData.deadline,
                            category: formData.category,
                            energy_requirement: formData.energyRequirement,
                            company: (profile === null || profile === void 0 ? void 0 : profile.companyName) || ((_user_email = user.email) === null || _user_email === void 0 ? void 0 : _user_email.split('@')[0]) || "Anonymous Employer",
                            employer_id: user.id,
                            createdAt: new Date().toISOString()
                        };
                        return [
                            4,
                            supabase.from('jobs').insert([
                                jobData
                            ])
                        ];
                    case 4:
                        error = _state.sent().error;
                        if (error) {
                            if (error.message.includes("relation \"jobs\" does not exist")) {
                                throw new Error("Initialization Required: The 'jobs' table is not yet set up on the platform. As a professional platform, proper database configuration is required for the security of your escrow funds. Please check Admin Dashboard > System Health.");
                            }
                            throw error;
                        }
                        setPublishStatus({
                            type: 'success',
                            msg: "Job published successfully! It's now live on the marketplace."
                        });
                        if (onPublish) onPublish();
                        setStep(1);
                        setFormData({
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
                            category: "General",
                            energyRequirement: "Balanced"
                        });
                        return [
                            3,
                            7
                        ];
                    case 5:
                        err = _state.sent();
                        console.error("Error publishing job:", err);
                        setPublishStatus({
                            type: 'error',
                            msg: "Failed to publish job: ".concat(err.message)
                        });
                        return [
                            3,
                            7
                        ];
                    case 6:
                        setIsPublishing(false);
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
    var renderAiInsights = function renderAiInsights() {
        var _formData_skills;
        return /*#__PURE__*/ React.createElement("div", {
            className: "bg-indigo-50 border border-indigo-100 rounded-2xl p-6 h-full space-y-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-between"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-indigo-900 flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "p-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black tracking-tighter"
        }, "AI"), "Tara Insights"), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-indigo-600 uppercase tracking-wider"
        }, "Live Analysis"))), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-end"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-bold text-indigo-500 uppercase tracking-widest"
        }, "Job Strength"), /*#__PURE__*/ React.createElement("p", {
            className: "text-xl font-black text-indigo-900"
        }, score, "%")), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-indigo-600 font-medium mb-1"
        }, score < 70 ? "Needs improvement" : "High Quality")), /*#__PURE__*/ React.createElement("div", {
            className: "h-3 w-full bg-indigo-200/50 rounded-full overflow-hidden"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "h-full bg-indigo-600 transition-all duration-700 ease-out",
            style: {
                width: "".concat(score, "%")
            }
        })), /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] text-indigo-700 leading-relaxed italic"
        }, "“", score < 50 ? "Details are too short. Add more to attract more applicants!" : score < 85 ? "Great start! Add milestones for a clearer budget structure." : "Excellent! Your post is ready for premium talent.", "”")), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-4 pt-4 border-t border-indigo-200/30"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "h-8 w-8 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-sm border border-indigo-100"
        }, "\uD83D\uDCA1"), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-xs font-bold text-indigo-900"
        }, "Market Intelligence"), /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] text-indigo-700"
        }, "For ", /*#__PURE__*/ React.createElement("span", {
            className: "font-bold"
        }, formData.jobType), ", the typical rate on Tara is ", /*#__PURE__*/ React.createElement("span", {
            className: "font-bold"
        }, "₱25,000 - ₱60,000"), "."))), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "h-8 w-8 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center text-sm border border-indigo-100"
        }, "\uD83C\uDDF5\uD83C\uDDED"), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-xs font-bold text-indigo-900"
        }, "Localized Payouts"), /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] text-indigo-700"
        }, "GCash & Maya enabled. Automatic tax computation for BIR Form 2307.")))), /*#__PURE__*/ React.createElement("div", {
            className: "pt-6 mt-6 border-t border-indigo-200/30"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-black text-indigo-900 mb-4 uppercase tracking-[0.2em]"
        }, "Post Card Preview"), /*#__PURE__*/ React.createElement("div", {
            className: "bg-white p-5 rounded-2xl shadow-xl shadow-indigo-200/50 border border-indigo-100 transition-all hover:scale-[1.02]"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "h-6 w-6 bg-indigo-100 rounded"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-1"
        }, formData.energyRequirement && /*#__PURE__*/ React.createElement("span", {
            className: "text-[8px] font-black bg-amber-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest"
        }, formData.energyRequirement), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-indigo-500"
        }, formData.duration))), /*#__PURE__*/ React.createElement("h5", {
            className: "font-bold text-sm text-gray-900 line-clamp-1"
        }, formData.title || 'Project Title Placeholder'), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-1.5 mt-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "px-2 py-0.5 bg-indigo-50 text-[9px] rounded font-bold text-indigo-600 uppercase"
        }, formData.jobType), /*#__PURE__*/ React.createElement("span", {
            className: "px-2 py-0.5 bg-green-50 text-[9px] rounded font-bold text-green-700"
        }, "₱", (formData.budget || 0).toLocaleString())), /*#__PURE__*/ React.createElement("div", {
            className: "mt-3 flex gap-1"
        }, (_formData_skills = formData.skills) === null || _formData_skills === void 0 ? void 0 : _formData_skills.slice(0, 3).map(function(s) {
            return /*#__PURE__*/ React.createElement("div", {
                key: s,
                className: "w-1.5 h-1.5 rounded-full bg-gray-200"
            });
        })))));
    };
    var renderStep1 = function renderStep1() {
        var _formData_skills, _formData_skills1;
        return /*#__PURE__*/ React.createElement("div", {
            className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2"
        }, "Project Title"), /*#__PURE__*/ React.createElement("input", {
            type: "text",
            className: "block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-4 text-lg font-medium transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-0",
            placeholder: "e.g. UX/UI Designer for Mobile App",
            value: formData.title,
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    title: e.target.value
                }));
            }
        }), /*#__PURE__*/ React.createElement("p", {
            className: "mt-2 text-xs text-gray-400"
        }, "Be descriptive but keep it under 50 characters for best engagement.")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2"
        }, "Project Scope"), /*#__PURE__*/ React.createElement("textarea", {
            rows: 6,
            className: "block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-4 text-base transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-0",
            placeholder: "What needs to be done? List the key deliverables and requirements...",
            value: formData.description,
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    description: e.target.value
                }));
            }
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2"
        }, "Required Expertise"), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2 p-1 bg-gray-50 border-2 border-gray-100 rounded-2xl focus-within:border-indigo-600 transition-all"
        }, /*#__PURE__*/ React.createElement("input", {
            type: "text",
            className: "block w-full bg-transparent px-4 py-2 focus:outline-none",
            placeholder: "Search or add skills...",
            value: skillInput,
            onChange: function onChange(e) {
                return setSkillInput(e.target.value);
            },
            onKeyPress: function onKeyPress(e) {
                return e.key === "Enter" && addSkill();
            }
        }), /*#__PURE__*/ React.createElement("button", {
            type: "button",
            onClick: addSkill,
            className: "px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-sm transition-all"
        }, "Add")), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-2 mt-4"
        }, ((_formData_skills = formData.skills) === null || _formData_skills === void 0 ? void 0 : _formData_skills.length) === 0 && /*#__PURE__*/ React.createElement("div", {
            className: "text-[11px] text-gray-400 font-medium italic"
        }, "Suggesting for you:", /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                setSkillInput("React");
                addSkill();
            },
            className: "ml-2 hover:text-indigo-600 underline"
        }, "React"), ",", /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                setSkillInput("UI/UX");
                addSkill();
            },
            className: "ml-2 hover:text-indigo-600 underline"
        }, "UI/UX")), (_formData_skills1 = formData.skills) === null || _formData_skills1 === void 0 ? void 0 : _formData_skills1.map(function(skill) {
            return /*#__PURE__*/ React.createElement("span", {
                key: skill,
                className: "inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"
            }, skill, /*#__PURE__*/ React.createElement("button", {
                type: "button",
                onClick: function onClick() {
                    return removeSkill(skill);
                },
                className: "ml-2 hover:text-red-500 transition-colors"
            }, "\xd7"));
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 text-indigo-600"
        }, "Category"), /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("select", {
            className: "appearance-none block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer",
            value: formData.category,
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
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
        }, "Other")), /*#__PURE__*/ React.createElement("div", {
            className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
        }, /*#__PURE__*/ React.createElement("svg", {
            className: "h-4 w-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
        }, /*#__PURE__*/ React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M19 9l-7 7-7-7"
        }))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 text-indigo-600"
        }, "Work Type"), /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("select", {
            className: "appearance-none block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer",
            value: formData.jobType,
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    jobType: e.target.value
                }));
            }
        }, /*#__PURE__*/ React.createElement("option", {
            value: "Full-time"
        }, "Full-time"), /*#__PURE__*/ React.createElement("option", {
            value: "Part-time"
        }, "Part-time"), /*#__PURE__*/ React.createElement("option", {
            value: "Contract"
        }, "Contract"), /*#__PURE__*/ React.createElement("option", {
            value: "One-time Project"
        }, "One-time Project")), /*#__PURE__*/ React.createElement("div", {
            className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
        }, /*#__PURE__*/ React.createElement("svg", {
            className: "h-4 w-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
        }, /*#__PURE__*/ React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M19 9l-7 7-7-7"
        }))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2"
        }, "Duration"), /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("select", {
            className: "appearance-none block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer",
            value: formData.duration,
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    duration: e.target.value
                }));
            }
        }, /*#__PURE__*/ React.createElement("option", {
            value: "1-2 weeks"
        }, "1-2 weeks"), /*#__PURE__*/ React.createElement("option", {
            value: "1-3 months"
        }, "1-3 months"), /*#__PURE__*/ React.createElement("option", {
            value: "Ongoing"
        }, "Ongoing")), /*#__PURE__*/ React.createElement("div", {
            className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
        }, /*#__PURE__*/ React.createElement("svg", {
            className: "h-4 w-4",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
        }, /*#__PURE__*/ React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M19 9l-7 7-7-7"
        }))))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2 text-amber-600"
        }, "Energy Requirement"), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2 p-1 bg-amber-50/30 border-2 border-amber-100/50 rounded-2xl"
        }, [
            "High",
            "Balanced",
            "Low"
        ].map(function(level) {
            return /*#__PURE__*/ React.createElement("button", {
                key: level,
                type: "button",
                onClick: function onClick() {
                    return setFormData(_object_spread_props(_object_spread({}, formData), {
                        energyRequirement: level
                    }));
                },
                className: cn("flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all", formData.energyRequirement === level ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "text-amber-700 hover:bg-amber-100")
            }, level);
        })))));
    };
    var renderStep2 = function renderStep2() {
        var _formData_milestones;
        return /*#__PURE__*/ React.createElement("div", {
            className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-4"
        }, "Payment Structure"), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-2 gap-4"
        }, /*#__PURE__*/ React.createElement("button", {
            type: "button",
            onClick: function onClick() {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    paymentMethod: "Flat-Rate"
                }));
            },
            className: "p-5 rounded-2xl border-2 transition-all text-left ".concat(formData.paymentMethod === "Flat-Rate" ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-gray-100 hover:border-gray-200")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-xl mb-3 flex items-center justify-center ".concat(formData.paymentMethod === "Flat-Rate" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400")
        }, /*#__PURE__*/ React.createElement("svg", {
            className: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
        }, /*#__PURE__*/ React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        }))), /*#__PURE__*/ React.createElement("p", {
            className: "font-black text-gray-900"
        }, "Fixed Project"), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500 mt-1"
        }, "Pay a set price for the whole project.")), /*#__PURE__*/ React.createElement("button", {
            type: "button",
            onClick: function onClick() {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    paymentMethod: "Hourly"
                }));
            },
            className: "p-5 rounded-2xl border-2 transition-all text-left ".concat(formData.paymentMethod === "Hourly" ? "border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50" : "border-gray-100 hover:border-gray-200")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-xl mb-3 flex items-center justify-center ".concat(formData.paymentMethod === "Hourly" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400")
        }, /*#__PURE__*/ React.createElement("svg", {
            className: "w-6 h-6",
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24"
        }, /*#__PURE__*/ React.createElement("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        }))), /*#__PURE__*/ React.createElement("p", {
            className: "font-black text-gray-900"
        }, "Hourly Rate"), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-gray-500 mt-1"
        }, "Pay for the time spent on the project.")))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2"
        }, "Total Project Budget (PHP)"), /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400"
        }, "₱"), /*#__PURE__*/ React.createElement("input", {
            type: "number",
            className: "block w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 pl-10 pr-5 py-4 text-2xl font-black text-indigo-600 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-0",
            placeholder: "e.g. 50000",
            value: formData.budget || "",
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    budget: parseFloat(e.target.value)
                }));
            }
        })), /*#__PURE__*/ React.createElement("p", {
            className: "mt-3 text-xs text-gray-400 leading-relaxed"
        }, /*#__PURE__*/ React.createElement("strong", null, "Pro-tip:"), " Projects with a clear budget attract higher quality talent. Your funds will be securely held in ", /*#__PURE__*/ React.createElement("strong", null, "Tara Escrow"), " and only released when you approve milestones.")), /*#__PURE__*/ React.createElement("div", {
            className: "bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0"
        }, /*#__PURE__*/ React.createElement(Lock, {
            className: "w-6 h-6"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-indigo-900 text-sm"
        }, "Escrow Protection Enabled"), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-indigo-700/80 mt-1 leading-relaxed"
        }, "All payments on Tara are protected. Once you hire a freelancer, the budget is moved to a secure escrow account. This proves to the freelancer that you have the budget, and protects your money until the work is delivered."))), formData.paymentMethod === "Flat-Rate" && /*#__PURE__*/ React.createElement("div", {
            className: "pt-4 space-y-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-end mb-2"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest"
        }, "Project Milestones"), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-gray-400 font-bold uppercase tracking-wider"
        }, "Break down your payments")), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black px-2 py-1 bg-indigo-600 text-white rounded"
        }, "ESCROW ENABLED")), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3"
        }, (_formData_milestones = formData.milestones) === null || _formData_milestones === void 0 ? void 0 : _formData_milestones.map(function(m, idx) {
            return /*#__PURE__*/ React.createElement("div", {
                key: m.id,
                className: "group relative flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-gray-50 shadow-sm transition-all hover:border-indigo-100"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "flex items-center gap-4"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600"
            }, idx + 1), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
                className: "font-bold text-gray-900 text-sm"
            }, m.title), /*#__PURE__*/ React.createElement("p", {
                className: "text-[10px] text-gray-400"
            }, m.dueDate))), /*#__PURE__*/ React.createElement("div", {
                className: "text-right"
            }, /*#__PURE__*/ React.createElement("p", {
                className: "font-black text-gray-900"
            }, "₱", m.amount.toLocaleString())));
        })), /*#__PURE__*/ React.createElement("div", {
            className: "p-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 space-y-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4"
        }, /*#__PURE__*/ React.createElement("input", {
            type: "text",
            placeholder: "What will be accomplished?",
            className: "rounded-xl border-2 border-white bg-white px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none transition-all",
            value: newMilestone.title,
            onChange: function onChange(e) {
                return setNewMilestone(_object_spread_props(_object_spread({}, newMilestone), {
                    title: e.target.value
                }));
            }
        }), /*#__PURE__*/ React.createElement("input", {
            type: "date",
            className: "rounded-xl border-2 border-white bg-white px-4 py-2 text-sm focus:border-indigo-600 focus:outline-none transition-all",
            value: newMilestone.dueDate,
            onChange: function onChange(e) {
                return setNewMilestone(_object_spread_props(_object_spread({}, newMilestone), {
                    dueDate: e.target.value
                }));
            }
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "relative flex-1"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs"
        }, "₱"), /*#__PURE__*/ React.createElement("input", {
            type: "number",
            placeholder: "Amount",
            className: "w-full rounded-xl border-2 border-white bg-white pl-7 pr-4 py-2 text-sm focus:border-indigo-600 focus:outline-none transition-all font-bold",
            value: newMilestone.amount || "",
            onChange: function onChange(e) {
                return setNewMilestone(_object_spread_props(_object_spread({}, newMilestone), {
                    amount: parseFloat(e.target.value)
                }));
            }
        })), /*#__PURE__*/ React.createElement("button", {
            type: "button",
            onClick: addMilestone,
            className: "px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-sm transition-all shadow-lg shadow-gray-200"
        }, "Add Milestone")))));
    };
    var renderStep3 = function renderStep3() {
        var _formData_customQuestions, _formData_customQuestions1, _formData_customQuestions2, _formData_customQuestions3, _formData_skills;
        return /*#__PURE__*/ React.createElement("div", {
            className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest mb-2"
        }, "Application Deadline"), /*#__PURE__*/ React.createElement("div", {
            className: "relative"
        }, /*#__PURE__*/ React.createElement("input", {
            type: "date",
            className: "block w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3 font-bold text-gray-700 focus:border-indigo-600 focus:outline-none transition-all cursor-pointer",
            value: formData.deadline,
            onChange: function onChange(e) {
                return setFormData(_object_spread_props(_object_spread({}, formData), {
                    deadline: e.target.value
                }));
            }
        })), /*#__PURE__*/ React.createElement("p", {
            className: "mt-2 text-xs text-gray-400 italic"
        }, "We recommend at least 7 days to find the best talent.")), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center mb-4"
        }, /*#__PURE__*/ React.createElement("label", {
            className: "block text-sm font-black text-gray-900 uppercase tracking-widest"
        }, "Screening Questions"), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-gray-400"
        }, ((_formData_customQuestions = formData.customQuestions) === null || _formData_customQuestions === void 0 ? void 0 : _formData_customQuestions.length) || 0, " / 3")), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3 mb-4"
        }, (_formData_customQuestions1 = formData.customQuestions) === null || _formData_customQuestions1 === void 0 ? void 0 : _formData_customQuestions1.map(function(q, idx) {
            return /*#__PURE__*/ React.createElement("div", {
                key: q.id,
                className: "flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 group"
            }, /*#__PURE__*/ React.createElement("span", {
                className: "w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black"
            }, idx + 1), /*#__PURE__*/ React.createElement("p", {
                className: "flex-1 text-sm font-bold text-indigo-900"
            }, q.question), /*#__PURE__*/ React.createElement("button", {
                onClick: function onClick() {
                    var _formData_customQuestions;
                    return setFormData(_object_spread_props(_object_spread({}, formData), {
                        customQuestions: (_formData_customQuestions = formData.customQuestions) === null || _formData_customQuestions === void 0 ? void 0 : _formData_customQuestions.filter(function(item) {
                            return item.id !== q.id;
                        })
                    }));
                },
                className: "opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
            }, "\xd7"));
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2 p-1 bg-gray-50 border-2 border-gray-100 rounded-2xl focus-within:border-indigo-600 transition-all"
        }, /*#__PURE__*/ React.createElement("input", {
            type: "text",
            className: "block w-full bg-transparent px-4 py-2 focus:outline-none text-sm",
            placeholder: "e.g. Have you worked on similar projects before?",
            value: newQuestion,
            onChange: function onChange(e) {
                return setNewQuestion(e.target.value);
            },
            disabled: (((_formData_customQuestions2 = formData.customQuestions) === null || _formData_customQuestions2 === void 0 ? void 0 : _formData_customQuestions2.length) || 0) >= 3
        }), /*#__PURE__*/ React.createElement("button", {
            type: "button",
            onClick: addQuestion,
            className: "px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black font-bold text-sm transition-all disabled:opacity-50",
            disabled: (((_formData_customQuestions3 = formData.customQuestions) === null || _formData_customQuestions3 === void 0 ? void 0 : _formData_customQuestions3.length) || 0) >= 3
        }, "Add"))), /*#__PURE__*/ React.createElement("div", {
            className: "pt-6 border-t border-gray-100"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "p-6 bg-gray-900 rounded-2xl text-white shadow-2xl shadow-indigo-200"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-6"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1"
        }, "Confirmation Summary"), /*#__PURE__*/ React.createElement("h4", {
            className: "text-xl font-black"
        }, formData.title || "Untitled Project")), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1"
        }, "Total Budget"), /*#__PURE__*/ React.createElement("p", {
            className: "text-xl font-black text-green-400"
        }, "₱", (formData.budget || 0).toLocaleString()))), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-2 gap-y-4 gap-x-8 text-[11px] font-bold"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between border-b border-gray-800 pb-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-500"
        }, "Job Type:"), /*#__PURE__*/ React.createElement("span", null, formData.jobType)), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between border-b border-gray-800 pb-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-500"
        }, "Duration:"), /*#__PURE__*/ React.createElement("span", null, formData.duration)), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between border-b border-gray-800 pb-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-500"
        }, "Deadline:"), /*#__PURE__*/ React.createElement("span", null, formData.deadline || "Not set")), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between border-b border-gray-800 pb-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-gray-500"
        }, "Skills:"), /*#__PURE__*/ React.createElement("span", null, (_formData_skills = formData.skills) === null || _formData_skills === void 0 ? void 0 : _formData_skills.length, " Tags"))), /*#__PURE__*/ React.createElement("div", {
            className: "mt-6 flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/10"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-2 h-2 bg-green-500 rounded-full animate-pulse"
        }), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-gray-400"
        }, "Ready for AI Matching. Your post will be seen by approximately ", /*#__PURE__*/ React.createElement("span", {
            className: "text-white font-bold"
        }, "45+ verified freelancers"), " matching your criteria.")))));
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "w-full"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-7 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mb-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-black text-gray-900 tracking-tight"
    }, "Post your project"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: suggestEnergyRequirement,
        className: "group flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all font-bold text-[10px] uppercase tracking-widest active:scale-95"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-3.5 h-3.5 group-hover:animate-spin"
    }), "AI Energy Predictor"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, [
        1,
        2,
        3
    ].map(function(s) {
        return /*#__PURE__*/ React.createElement("div", {
            key: s,
            className: "h-1.5 w-12 rounded-full transition-all duration-500 ".concat(step >= s ? "bg-indigo-600" : "bg-gray-100")
        });
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4 text-sm font-bold text-indigo-600"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "px-3 py-1 rounded-full ".concat(step === 1 ? 'bg-indigo-100' : 'bg-gray-100 text-gray-400')
    }, "1. Details"), /*#__PURE__*/ React.createElement("span", {
        className: "text-gray-300"
    }, "→"), /*#__PURE__*/ React.createElement("span", {
        className: "px-3 py-1 rounded-full ".concat(step === 2 ? 'bg-indigo-100' : 'bg-gray-100 text-gray-400')
    }, "2. Budget"), /*#__PURE__*/ React.createElement("span", {
        className: "text-gray-300"
    }, "→"), /*#__PURE__*/ React.createElement("span", {
        className: "px-3 py-1 rounded-full ".concat(step === 3 ? 'bg-indigo-100' : 'bg-gray-100 text-gray-400')
    }, "3. Finalize"))), /*#__PURE__*/ React.createElement("form", {
        onSubmit: function onSubmit(e) {
            e.preventDefault();
            if (step === 3) handlePublish();
        },
        className: "relative"
    }, isAiAnalyzing && /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "mt-4 text-sm font-bold text-indigo-600 animate-pulse uppercase tracking-widest"
    }, "AI is analyzing your post..."))), publishStatus && /*#__PURE__*/ React.createElement("div", {
        className: cn("mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300", publishStatus.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100")
    }, publishStatus.type === 'success' ? /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-5 h-5"
    }) : /*#__PURE__*/ React.createElement(AlertCircle, {
        className: "w-5 h-5"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold"
    }, publishStatus.msg)), /*#__PURE__*/ React.createElement("div", {
        className: "min-h-[400px]"
    }, step === 1 && renderStep1(), step === 2 && renderStep2(), step === 3 && renderStep3()), /*#__PURE__*/ React.createElement("div", {
        className: "mt-12 pt-8 border-t border-gray-100 flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("div", null, step > 1 && /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: prevStep,
        className: "flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
    }, /*#__PURE__*/ React.createElement("svg", {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        d: "M15 19l-7-7 7-7"
    })), "Back")), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("button", {
        type: "button",
        className: "px-6 py-3 text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors"
    }, "Save as Draft"), step < 3 ? /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: nextStep,
        className: "group px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
    }, "Continue", /*#__PURE__*/ React.createElement("svg", {
        className: "w-4 h-4 transition-transform group-hover:translate-x-1",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "2",
        d: "M9 5l7 7-7 7"
    }))) : /*#__PURE__*/ React.createElement("button", {
        type: "submit",
        disabled: isPublishing,
        className: "px-10 py-3 bg-gray-900 text-white rounded-2xl hover:bg-black font-black shadow-lg shadow-gray-200 transition-all active:scale-95 flex items-center gap-2"
    }, isPublishing ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Loader2, {
        className: "w-5 h-5 animate-spin"
    }), "PUBLISHING...") : /*#__PURE__*/ React.createElement(React.Fragment, null, "PUBLISH NOW \uD83D\uDE80")))))), /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-5 sticky top-8"
    }, renderAiInsights())));
}
