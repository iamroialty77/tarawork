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
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Clock, DollarSign, ExternalLink, MapPin } from "lucide-react";
import { extractJobIdFromShareToken } from "../../../lib/jobShare";
import { supabaseAdmin } from "../../../lib/supabase_admin";
import { formatRelativeTime } from "../../../lib/utils";
export var dynamic = "force-dynamic";
export var revalidate = 0;
var getPublicJob = function getPublicJob(shareId) {
    return _async_to_generator(function() {
        var jobId, _ref, data, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    jobId = extractJobIdFromShareToken(shareId);
                    if (!jobId) return [
                        2,
                        null
                    ];
                    return [
                        4,
                        supabaseAdmin.from("jobs").select("*").eq("id", jobId).maybeSingle()
                    ];
                case 1:
                    _ref = _state.sent(), data = _ref.data, error = _ref.error;
                    if (error || !data) return [
                        2,
                        null
                    ];
                    return [
                        2,
                        _object_spread_props(_object_spread({}, data), {
                            skills: Array.isArray(data.skills) ? data.skills : [],
                            energyRequirement: data.energy_requirement || "Balanced",
                            paymentMethod: data.paymentMethod || "Flat-Rate",
                            jobType: data.jobType || "Contract"
                        })
                    ];
            }
        });
    })();
};
export default function PublicJobPage(_0) {
    return _async_to_generator(function(param) {
        var params, shareId, job, applyUrl;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    params = param.params;
                    return [
                        4,
                        params
                    ];
                case 1:
                    shareId = _state.sent().shareId;
                    return [
                        4,
                        getPublicJob(shareId)
                    ];
                case 2:
                    job = _state.sent();
                    if (!job) {
                        notFound();
                    }
                    applyUrl = "/?apply=".concat(encodeURIComponent(job.id));
                    return [
                        2,
                        /*#__PURE__*/ React.createElement("main", {
                            className: "min-h-screen bg-slate-50 py-10 px-4"
                        }, /*#__PURE__*/ React.createElement("div", {
                            className: "max-w-4xl mx-auto"
                        }, /*#__PURE__*/ React.createElement("div", {
                            className: "bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden"
                        }, /*#__PURE__*/ React.createElement("div", {
                            className: "h-2 bg-slate-900"
                        }), /*#__PURE__*/ React.createElement("div", {
                            className: "p-6 sm:p-10 space-y-8"
                        }, /*#__PURE__*/ React.createElement("header", {
                            className: "space-y-3"
                        }, /*#__PURE__*/ React.createElement("p", {
                            className: "text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600"
                        }, "TaraWork Opportunity"), /*#__PURE__*/ React.createElement("h1", {
                            className: "text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
                        }, job.title), /*#__PURE__*/ React.createElement("p", {
                            className: "text-slate-600 text-sm sm:text-base leading-relaxed"
                        }, "Shared via TaraWork. Discover verified remote opportunities and apply securely through the platform.")), /*#__PURE__*/ React.createElement("section", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                        }, /*#__PURE__*/ React.createElement("div", {
                            className: "bg-slate-50 border border-slate-200 rounded-xl p-3"
                        }, /*#__PURE__*/ React.createElement("p", {
                            className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1"
                        }, "Compensation"), /*#__PURE__*/ React.createElement("p", {
                            className: "text-sm font-bold text-slate-900 flex items-center gap-2"
                        }, /*#__PURE__*/ React.createElement(DollarSign, {
                            className: "w-4 h-4 text-emerald-600"
                        }), job.rate)), /*#__PURE__*/ React.createElement("div", {
                            className: "bg-slate-50 border border-slate-200 rounded-xl p-3"
                        }, /*#__PURE__*/ React.createElement("p", {
                            className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1"
                        }, "Duration"), /*#__PURE__*/ React.createElement("p", {
                            className: "text-sm font-bold text-slate-900 flex items-center gap-2"
                        }, /*#__PURE__*/ React.createElement(Clock, {
                            className: "w-4 h-4 text-slate-600"
                        }), job.duration)), /*#__PURE__*/ React.createElement("div", {
                            className: "bg-slate-50 border border-slate-200 rounded-xl p-3"
                        }, /*#__PURE__*/ React.createElement("p", {
                            className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1"
                        }, "Engagement"), /*#__PURE__*/ React.createElement("p", {
                            className: "text-sm font-bold text-slate-900 flex items-center gap-2"
                        }, /*#__PURE__*/ React.createElement(Briefcase, {
                            className: "w-4 h-4 text-slate-600"
                        }), job.jobType || "Contract")), /*#__PURE__*/ React.createElement("div", {
                            className: "bg-slate-50 border border-slate-200 rounded-xl p-3"
                        }, /*#__PURE__*/ React.createElement("p", {
                            className: "text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1"
                        }, "Location"), /*#__PURE__*/ React.createElement("p", {
                            className: "text-sm font-bold text-slate-900 flex items-center gap-2"
                        }, /*#__PURE__*/ React.createElement(MapPin, {
                            className: "w-4 h-4 text-slate-600"
                        }), "Remote"))), /*#__PURE__*/ React.createElement("section", null, /*#__PURE__*/ React.createElement("h2", {
                            className: "text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-3"
                        }, "Job Description"), /*#__PURE__*/ React.createElement("p", {
                            className: "text-slate-700 leading-relaxed whitespace-pre-line"
                        }, job.description)), /*#__PURE__*/ React.createElement("section", null, /*#__PURE__*/ React.createElement("h2", {
                            className: "text-sm font-bold uppercase tracking-[0.18em] text-slate-500 mb-3"
                        }, "Required Skills"), /*#__PURE__*/ React.createElement("div", {
                            className: "flex flex-wrap gap-2"
                        }, job.skills.map(function(skill) {
                            return /*#__PURE__*/ React.createElement("span", {
                                key: skill,
                                className: "px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg border border-slate-200 bg-white text-slate-700"
                            }, skill);
                        }))), /*#__PURE__*/ React.createElement("footer", {
                            className: "pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                        }, /*#__PURE__*/ React.createElement("p", {
                            className: "text-xs font-semibold text-slate-500"
                        }, "Posted ", formatRelativeTime(job.createdAt), " by ", job.company || "Verified Employer"), /*#__PURE__*/ React.createElement("div", {
                            className: "flex gap-3"
                        }, /*#__PURE__*/ React.createElement(Link, {
                            href: "/",
                            className: "px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                        }, "Explore TaraWork"), /*#__PURE__*/ React.createElement(Link, {
                            href: applyUrl,
                            className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                        }, "Apply now", /*#__PURE__*/ React.createElement(ExternalLink, {
                            className: "w-3.5 h-3.5"
                        }))))))))
                    ];
            }
        });
    }).apply(this, arguments);
}
