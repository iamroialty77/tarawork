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
import { useState, useMemo, useEffect } from "react";
import JobCard from "./JobCard";
import AIAgent from "./AIAgent";
import { Search, Filter, Sparkles, Loader2 } from "lucide-react";
import { energyScore } from "../lib/utils";
import { heuristicSmartMatchMany } from "../lib/smartMatch";
var smartMatchErrorMessage = function smartMatchErrorMessage(errorCode, fallbackError) {
    switch(errorCode){
        case "missing_key":
            return "Gemini API key missing. Add GEMINI_API_KEY in .env.local.";
        case "invalid_key":
            return "Invalid Gemini API key. Generate a new key and restart app.";
        case "quota_exceeded":
            return "Gemini free quota reached. Using local smart matching.";
        case "provider_unavailable":
            return "Gemini is temporarily unavailable. Using local smart matching.";
        case "network_error":
            return "Network issue connecting to Gemini. Using local smart matching.";
        case "missing_user_id":
            return "User session missing. Please refresh and sign in again.";
        default:
            return fallbackError || "Gemini unavailable, using local smart matching.";
    }
};
export default function JobFeed(param) {
    var jobs = param.jobs, profile = param.profile, onApply = param.onApply, _param_appliedJobs = param.appliedJobs, appliedJobs = _param_appliedJobs === void 0 ? {} : _param_appliedJobs;
    var _useState = _sliced_to_array(useState(""), 2), searchTerm = _useState[0], setSearchTerm = _useState[1];
    var _useState1 = _sliced_to_array(useState(""), 2), debouncedSearchTerm = _useState1[0], setDebouncedSearchTerm = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), showAIAgent = _useState2[0], setShowAIAgent = _useState2[1];
    var _useState3 = _sliced_to_array(useState(null), 2), selectedJobForAI = _useState3[0], setSelectedJobForAI = _useState3[1];
    useEffect(function() {
        var timer = setTimeout(function() {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return function() {
            return clearTimeout(timer);
        };
    }, [
        searchTerm
    ]);
    var _useState4 = _sliced_to_array(useState("All"), 2), paymentFilter = _useState4[0], setPaymentFilter = _useState4[1];
    var _useState5 = _sliced_to_array(useState("All"), 2), durationFilter = _useState5[0], setDurationFilter = _useState5[1];
    var _useState6 = _sliced_to_array(useState("All"), 2), categoryFilter = _useState6[0], setCategoryFilter = _useState6[1];
    var _useState7 = _sliced_to_array(useState(false), 2), useSmartMatching = _useState7[0], setUseSmartMatching = _useState7[1];
    var _useState8 = _sliced_to_array(useState({}), 2), smartMatches = _useState8[0], setSmartMatches = _useState8[1];
    var _useState9 = _sliced_to_array(useState(false), 2), smartMatchLoading = _useState9[0], setSmartMatchLoading = _useState9[1];
    var _useState10 = _sliced_to_array(useState(null), 2), smartMatchError = _useState10[0], setSmartMatchError = _useState10[1];
    var handleSmartMatchingToggle = function handleSmartMatchingToggle(checked) {
        setUseSmartMatching(checked);
        if (checked) {
            setSmartMatchLoading(true);
            setSmartMatchError(null);
            return;
        }
        setSmartMatchLoading(false);
        setSmartMatchError(null);
    };
    var baseFilteredJobs = useMemo(function() {
        return jobs.filter(function(job) {
            // 1. Category Filter
            if (categoryFilter !== "All" && job.category !== categoryFilter) {
                return false;
            }
            // 2. Search Term
            var matchesSearch = job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || job.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || job.skills.some(function(skill) {
                return skill.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            });
            if (!matchesSearch) return false;
            // 3. Payment Method Filter
            if (paymentFilter !== "All" && job.paymentMethod !== paymentFilter) {
                return false;
            }
            // 4. Duration Filter
            if (durationFilter !== "All" && job.duration !== durationFilter) {
                return false;
            }
            return true;
        });
    }, [
        jobs,
        debouncedSearchTerm,
        paymentFilter,
        durationFilter,
        categoryFilter
    ]);
    useEffect(function() {
        if (!useSmartMatching) {
            setSmartMatchLoading(false);
            setSmartMatchError(null);
            return;
        }
        if (baseFilteredJobs.length === 0) {
            setSmartMatches({});
            setSmartMatchLoading(false);
            setSmartMatchError(null);
            return;
        }
        if (!profile.skills || profile.skills.length === 0) {
            var fallback = heuristicSmartMatchMany(baseFilteredJobs, profile);
            var mapped = Object.fromEntries(fallback.map(function(match) {
                return [
                    match.jobId,
                    match
                ];
            }));
            setSmartMatches(mapped);
            setSmartMatchLoading(false);
            setSmartMatchError(null);
            return;
        }
        var controller = new AbortController();
        setSmartMatchLoading(true);
        setSmartMatchError(null);
        var loadSmartMatches = function loadSmartMatches() {
            return _async_to_generator(function() {
                var response, data, mapped, error, fallback, mapped1;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            _state.trys.push([
                                0,
                                3,
                                4,
                                5
                            ]);
                            return [
                                4,
                                fetch("/api/smart-match", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        profile: {
                                            id: profile.id,
                                            category: profile.category,
                                            skills: profile.skills,
                                            wellness: profile.wellness
                                        },
                                        jobs: baseFilteredJobs
                                    }),
                                    signal: controller.signal
                                })
                            ];
                        case 1:
                            response = _state.sent();
                            return [
                                4,
                                response.json()
                            ];
                        case 2:
                            data = _state.sent();
                            if (!response.ok) {
                                throw new Error(smartMatchErrorMessage(data.errorCode, data.error || "Smart matching failed (".concat(response.status, ")")));
                            }
                            mapped = Object.fromEntries((data.matches || []).map(function(match) {
                                return [
                                    match.jobId,
                                    match
                                ];
                            }));
                            setSmartMatches(mapped);
                            if (data.fallback) {
                                setSmartMatchError(smartMatchErrorMessage(data.errorCode, data.error));
                            }
                            return [
                                3,
                                5
                            ];
                        case 3:
                            error = _state.sent();
                            if (controller.signal.aborted) return [
                                2
                            ];
                            fallback = heuristicSmartMatchMany(baseFilteredJobs, profile);
                            mapped1 = Object.fromEntries(fallback.map(function(match) {
                                return [
                                    match.jobId,
                                    match
                                ];
                            }));
                            setSmartMatches(mapped1);
                            setSmartMatchError(_instanceof(error, Error) ? error.message : "Smart matching failed. Using local fallback.");
                            return [
                                3,
                                5
                            ];
                        case 4:
                            if (!controller.signal.aborted) setSmartMatchLoading(false);
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
        loadSmartMatches();
        return function() {
            return controller.abort();
        };
    }, [
        useSmartMatching,
        baseFilteredJobs,
        profile.category,
        profile.skills,
        profile.wellness
    ]);
    var filteredJobs = useMemo(function() {
        if (!useSmartMatching) return baseFilteredJobs;
        return _to_consumable_array(baseFilteredJobs).sort(function(a, b) {
            var _ref, _ref1;
            var _smartMatches_a_id, _smartMatches_b_id, _profile_wellness, _profile_wellness1;
            var aScore = (_ref = (_smartMatches_a_id = smartMatches[a.id]) === null || _smartMatches_a_id === void 0 ? void 0 : _smartMatches_a_id.score) !== null && _ref !== void 0 ? _ref : 0;
            var bScore = (_ref1 = (_smartMatches_b_id = smartMatches[b.id]) === null || _smartMatches_b_id === void 0 ? void 0 : _smartMatches_b_id.score) !== null && _ref1 !== void 0 ? _ref1 : 0;
            if (bScore !== aScore) return bScore - aScore;
            var eScoreA = energyScore((_profile_wellness = profile.wellness) === null || _profile_wellness === void 0 ? void 0 : _profile_wellness.energyRating, a.energyRequirement);
            var eScoreB = energyScore((_profile_wellness1 = profile.wellness) === null || _profile_wellness1 === void 0 ? void 0 : _profile_wellness1.energyRating, b.energyRequirement);
            if (eScoreB !== eScoreA) return eScoreB - eScoreA;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [
        baseFilteredJobs,
        useSmartMatching,
        smartMatches,
        profile.wellness
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col md:flex-row gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative flex-1"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Search for jobs (e.g. React, UI/UX)...",
        className: "w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden text-gray-900",
        value: searchTerm,
        onChange: function onChange(e) {
            return setSearchTerm(e.target.value);
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative flex-1 min-w-[120px]"
    }, /*#__PURE__*/ React.createElement(Filter, {
        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
    }), /*#__PURE__*/ React.createElement("select", {
        className: "w-full appearance-none rounded-xl border border-gray-200 pl-10 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer",
        value: paymentFilter,
        onChange: function onChange(e) {
            return setPaymentFilter(e.target.value);
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: "All"
    }, "All Payments"), /*#__PURE__*/ React.createElement("option", {
        value: "Hourly"
    }, "Hourly"), /*#__PURE__*/ React.createElement("option", {
        value: "Flat-Rate"
    }, "Flat-Rate"))), /*#__PURE__*/ React.createElement("select", {
        className: "flex-1 min-w-[120px] rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer",
        value: durationFilter,
        onChange: function onChange(e) {
            return setDurationFilter(e.target.value);
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: "All"
    }, "All Durations"), /*#__PURE__*/ React.createElement("option", {
        value: "1-2 weeks"
    }, "1-2 weeks"), /*#__PURE__*/ React.createElement("option", {
        value: "1-3 months"
    }, "1-3 months"), /*#__PURE__*/ React.createElement("option", {
        value: "Ongoing"
    }, "Ongoing")), /*#__PURE__*/ React.createElement("select", {
        className: "w-full md:w-auto rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-hidden bg-white text-gray-700 cursor-pointer",
        value: categoryFilter,
        onChange: function onChange(e) {
            return setCategoryFilter(e.target.value);
        }
    }, /*#__PURE__*/ React.createElement("option", {
        value: "All"
    }, "All Categories"), /*#__PURE__*/ React.createElement("option", {
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
    }, "Other")))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between pt-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("label", {
        htmlFor: "smart-matching",
        className: "relative inline-flex items-center cursor-pointer"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "checkbox",
        id: "smart-matching",
        checked: useSmartMatching,
        onChange: function onChange(e) {
            return handleSmartMatchingToggle(e.target.checked);
        },
        className: "sr-only peer"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "w-11 h-6 bg-gray-200 peer-focus:outline-hidden peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "ml-3 text-sm font-semibold text-gray-700 cursor-pointer flex items-center gap-1.5"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-4 h-4 text-indigo-500"
    }), "Smart Matching")), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100"
    }, "Skills: ", profile.skills.join(", ") || "None yet"), useSmartMatching && smartMatchLoading && /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 inline-flex items-center gap-1.5"
    }, /*#__PURE__*/ React.createElement(Loader2, {
        className: "w-3.5 h-3.5 animate-spin"
    }), "Gemini is matching jobs..."), useSmartMatching && smartMatchError && /*#__PURE__*/ React.createElement("span", {
        className: "text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100"
    }, smartMatchError)), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-medium text-gray-500"
    }, filteredJobs.length, " jobs found"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid gap-6"
    }, filteredJobs.length > 0 ? filteredJobs.map(function(job, index) {
        var _ref, _ref1, _ref2;
        var _profile_wellness, _profile_wellness1;
        var smartMatch = smartMatches[job.id];
        var localMatchedSkills = job.skills.filter(function(s) {
            return profile.skills.some(function(us) {
                return us.toLowerCase() === s.toLowerCase();
            });
        });
        var localMissingSkills = job.skills.filter(function(s) {
            return !profile.skills.some(function(us) {
                return us.toLowerCase() === s.toLowerCase();
            });
        });
        var matchedSkills = useSmartMatching ? (_ref = smartMatch === null || smartMatch === void 0 ? void 0 : smartMatch.matchedSkills) !== null && _ref !== void 0 ? _ref : localMatchedSkills : localMatchedSkills;
        var missingSkills = useSmartMatching ? (_ref1 = smartMatch === null || smartMatch === void 0 ? void 0 : smartMatch.missingSkills) !== null && _ref1 !== void 0 ? _ref1 : localMissingSkills : localMissingSkills;
        var matchScore = useSmartMatching ? (_ref2 = smartMatch === null || smartMatch === void 0 ? void 0 : smartMatch.score) !== null && _ref2 !== void 0 ? _ref2 : 0 : profile.skills.length > 0 ? Math.round(matchedSkills.length / Math.max(job.skills.length, 1) * 100) : 0;
        var eScore = energyScore((_profile_wellness = profile.wellness) === null || _profile_wellness === void 0 ? void 0 : _profile_wellness.energyRating, job.energyRequirement);
        var sustainabilityMatch = Math.round(0.6 * matchScore + 0.4 * eScore);
        if ((_profile_wellness1 = profile.wellness) === null || _profile_wellness1 === void 0 ? void 0 : _profile_wellness1.verifiedSustainable) sustainabilityMatch = Math.min(100, sustainabilityMatch + 5);
        return /*#__PURE__*/ React.createElement(JobCard, {
            key: job.id,
            job: job,
            index: index,
            matchScore: matchScore,
            matchedSkills: matchedSkills,
            missingSkills: missingSkills,
            onApply: onApply,
            applicationStatus: appliedJobs[job.id],
            sustainabilityMatch: sustainabilityMatch,
            energyRequirement: job.energyRequirement,
            onViewSmartMatch: function onViewSmartMatch(j) {
                setSelectedJobForAI(j);
                setShowAIAgent(true);
            }
        });
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "w-8 h-8 text-gray-300"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-gray-900 mb-1"
    }, "No Results Found"), /*#__PURE__*/ React.createElement("p", {
        className: "text-gray-500 max-w-xs mx-auto"
    }, "Try different keywords or remove some filters."))), /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: showAIAgent,
        onClose: function onClose() {
            return setShowAIAgent(false);
        },
        mode: "smart-match",
        targetData: {
            job: selectedJobForAI,
            profile: profile
        }
    }));
}
