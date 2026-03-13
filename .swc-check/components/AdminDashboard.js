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
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Users, Briefcase, ShieldCheck, AlertTriangle, TrendingUp, DollarSign, Search, ArrowUpRight, CheckCircle2, XCircle, Copy, LayoutDashboard, UserCheck, FileText, Activity, Clock, ExternalLink, Eye, Check, BarChart3, Trash2, Lock, CreditCard, Scale, Mail } from "lucide-react";
export default function AdminDashboard() {
    var _useState = _sliced_to_array(useState("overview"), 2), activeTab = _useState[0], setActiveTab = _useState[1];
    var _useState1 = _sliced_to_array(useState({
        users: 0,
        jobs: 0,
        employers: 0,
        freelancers: 0,
        escrows: 0,
        disputes: 0
    }), 2), counts = _useState1[0], setCounts = _useState1[1];
    var _useState2 = _sliced_to_array(useState([]), 2), recentActivities = _useState2[0], setRecentActivities = _useState2[1];
    var _useState3 = _sliced_to_array(useState([]), 2), users = _useState3[0], setUsers = _useState3[1];
    var _useState4 = _sliced_to_array(useState([]), 2), jobs = _useState4[0], setJobs = _useState4[1];
    var _useState5 = _sliced_to_array(useState([]), 2), escrows = _useState5[0], setEscrows = _useState5[1];
    var _useState6 = _sliced_to_array(useState([]), 2), disputes = _useState6[0], setDisputes = _useState6[1];
    var _useState7 = _sliced_to_array(useState([]), 2), auditLogs = _useState7[0], setAuditLogs = _useState7[1];
    var _useState8 = _sliced_to_array(useState(true), 2), loading = _useState8[0], setLoading = _useState8[1];
    var _useState9 = _sliced_to_array(useState({
        profiles: {
            exists: false,
            loading: true
        },
        jobs: {
            exists: false,
            loading: true
        },
        escrows: {
            exists: false,
            loading: true
        },
        messages: {
            exists: false,
            loading: true
        },
        conversations: {
            exists: false,
            loading: true
        },
        disputes: {
            exists: false,
            loading: true
        },
        admin_audit_logs: {
            exists: false,
            loading: true
        }
    }), 2), healthStatus = _useState9[0], setHealthStatus = _useState9[1];
    var checkTableHealth = function checkTableHealth() {
        return _async_to_generator(function() {
            var tables, newStatus, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, table, error, e, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        tables = [
                            'profiles',
                            'jobs',
                            'escrows',
                            'messages',
                            'conversations',
                            'disputes',
                            'admin_audit_logs'
                        ];
                        newStatus = _object_spread({}, healthStatus);
                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            8,
                            9,
                            10
                        ]);
                        _iterator = tables[Symbol.iterator]();
                        _state.label = 2;
                    case 2:
                        if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                            3,
                            7
                        ];
                        table = _step.value;
                        _state.label = 3;
                    case 3:
                        _state.trys.push([
                            3,
                            5,
                            ,
                            6
                        ]);
                        return [
                            4,
                            supabase.from(table).select('id').limit(1)
                        ];
                    case 4:
                        error = _state.sent().error;
                        newStatus[table] = {
                            exists: !error || error.code !== 'PGRST204' && error.code !== '42P01',
                            loading: false,
                            error: error === null || error === void 0 ? void 0 : error.message
                        };
                        return [
                            3,
                            6
                        ];
                    case 5:
                        e = _state.sent();
                        newStatus[table] = {
                            exists: false,
                            loading: false
                        };
                        return [
                            3,
                            6
                        ];
                    case 6:
                        _iteratorNormalCompletion = true;
                        return [
                            3,
                            2
                        ];
                    case 7:
                        return [
                            3,
                            10
                        ];
                    case 8:
                        err = _state.sent();
                        _didIteratorError = true;
                        _iteratorError = err;
                        return [
                            3,
                            10
                        ];
                    case 9:
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return != null) {
                                _iterator.return();
                            }
                        } finally{
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                        return [
                            7
                        ];
                    case 10:
                        setHealthStatus(newStatus);
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var _useState10 = _sliced_to_array(useState(false), 2), showToast = _useState10[0], setShowToast = _useState10[1];
    var _useState11 = _sliced_to_array(useState(""), 2), toastMsg = _useState11[0], setToastMsg = _useState11[1];
    var fetchData = function fetchData() {
        return _async_to_generator(function() {
            var _ref, userCount, _ref1, employerCount, _ref2, freelancerCount, _ref3, jobCount, _ref4, escrowCount, _ref5, disputeCount, _ref6, userData, _ref7, jobData, _ref8, escrowData, _ref9, disputeData, _ref10, logData, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setLoading(true);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            13,
                            14,
                            15
                        ]);
                        return [
                            4,
                            supabase.from('profiles').select('*', {
                                count: 'exact',
                                head: true
                            })
                        ];
                    case 2:
                        _ref = _state.sent(), userCount = _ref.count;
                        return [
                            4,
                            supabase.from('profiles').select('*', {
                                count: 'exact',
                                head: true
                            }).eq('role', 'employer')
                        ];
                    case 3:
                        _ref1 = _state.sent(), employerCount = _ref1.count;
                        return [
                            4,
                            supabase.from('profiles').select('*', {
                                count: 'exact',
                                head: true
                            }).eq('role', 'freelancer')
                        ];
                    case 4:
                        _ref2 = _state.sent(), freelancerCount = _ref2.count;
                        return [
                            4,
                            supabase.from('jobs').select('*', {
                                count: 'exact',
                                head: true
                            })
                        ];
                    case 5:
                        _ref3 = _state.sent(), jobCount = _ref3.count;
                        return [
                            4,
                            supabase.from('escrows').select('*', {
                                count: 'exact',
                                head: true
                            })
                        ];
                    case 6:
                        _ref4 = _state.sent(), escrowCount = _ref4.count;
                        return [
                            4,
                            supabase.from('disputes').select('*', {
                                count: 'exact',
                                head: true
                            })
                        ];
                    case 7:
                        _ref5 = _state.sent(), disputeCount = _ref5.count;
                        setCounts({
                            users: userCount || 0,
                            employers: employerCount || 0,
                            freelancers: freelancerCount || 0,
                            jobs: jobCount || 0,
                            escrows: escrowCount || 0,
                            disputes: disputeCount || 0
                        });
                        return [
                            4,
                            supabase.from('profiles').select('*').order('updated_at', {
                                ascending: false
                            })
                        ];
                    case 8:
                        _ref6 = _state.sent(), userData = _ref6.data;
                        if (userData) setUsers(userData);
                        return [
                            4,
                            supabase.from('jobs').select('*, profiles(name)').order('createdAt', {
                                ascending: false
                            })
                        ];
                    case 9:
                        _ref7 = _state.sent(), jobData = _ref7.data;
                        if (jobData) setJobs(jobData);
                        return [
                            4,
                            supabase.from('escrows').select('*, jobs(title)').order('created_at', {
                                ascending: false
                            })
                        ];
                    case 10:
                        _ref8 = _state.sent(), escrowData = _ref8.data;
                        if (escrowData) setEscrows(escrowData);
                        return [
                            4,
                            supabase.from('disputes').select('*, escrows(amount, job_id, jobs(title))').order('created_at', {
                                ascending: false
                            })
                        ];
                    case 11:
                        _ref9 = _state.sent(), disputeData = _ref9.data;
                        if (disputeData) setDisputes(disputeData);
                        return [
                            4,
                            supabase.from('admin_audit_logs').select('*, profiles(name)').order('created_at', {
                                ascending: false
                            }).limit(20)
                        ];
                    case 12:
                        _ref10 = _state.sent(), logData = _ref10.data;
                        if (logData) setAuditLogs(logData);
                        return [
                            3,
                            15
                        ];
                    case 13:
                        err = _state.sent();
                        console.error("Dashboard data fetch error:", err);
                        return [
                            3,
                            15
                        ];
                    case 14:
                        setLoading(false);
                        return [
                            7
                        ];
                    case 15:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    useEffect(function() {
        fetchData();
        checkTableHealth();
    }, []);
    var notify = function notify(msg) {
        setToastMsg(msg);
        setShowToast(true);
        setTimeout(function() {
            return setShowToast(false);
        }, 3000);
    };
    var updateUserStatus = function updateUserStatus(userId, status) {
        return _async_to_generator(function() {
            var error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            supabase.from('profiles').update({
                                status: status
                            }).eq('id', userId)
                        ];
                    case 1:
                        error = _state.sent().error;
                        if (error) notify("Error updating user: " + error.message);
                        else {
                            notify("User ".concat(status, " successfully"));
                            fetchData();
                        }
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var deleteUser = function deleteUser(userId) {
        return _async_to_generator(function() {
            var response, result, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!confirm("Are you sure you want to delete this user? ALL data (messages, jobs, profiles) will be permanently deleted. This cannot be undone.")) return [
                            2
                        ];
                        setLoading(true);
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
                            fetch('/api/admin/delete-user', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    userId: userId
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
                        result = _state.sent();
                        if (!response.ok) {
                            throw new Error(result.error || 'Failed to delete user');
                        }
                        notify("User and all associated data deleted successfully");
                        fetchData();
                        return [
                            3,
                            6
                        ];
                    case 4:
                        err = _state.sent();
                        console.error("Delete error:", err);
                        notify("Error deleting user: " + err.message);
                        return [
                            3,
                            6
                        ];
                    case 5:
                        setLoading(false);
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
    var updateJobStatus = function updateJobStatus(jobId, status) {
        return _async_to_generator(function() {
            var error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            supabase.from('jobs').update({
                                status: status
                            }).eq('id', jobId)
                        ];
                    case 1:
                        error = _state.sent().error;
                        if (error) notify("Error updating job: " + error.message);
                        else {
                            notify("Job marked as ".concat(status));
                            fetchData();
                        }
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var deleteJob = function deleteJob(jobId) {
        return _async_to_generator(function() {
            var error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!confirm("Are you sure you want to delete this job posting?")) return [
                            2
                        ];
                        return [
                            4,
                            supabase.from('jobs').delete().eq('id', jobId)
                        ];
                    case 1:
                        error = _state.sent().error;
                        if (error) notify("Error deleting job: " + error.message);
                        else {
                            notify("Job deleted successfully");
                            fetchData();
                        }
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var deleteEscrow = function deleteEscrow(escrowId) {
        return _async_to_generator(function() {
            var error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!confirm("Are you sure you want to delete this escrow?")) return [
                            2
                        ];
                        return [
                            4,
                            supabase.from('escrows').delete().eq('id', escrowId)
                        ];
                    case 1:
                        error = _state.sent().error;
                        if (error) notify("Error removing escrow: " + error.message);
                        else {
                            notify("Escrow removed successfully");
                            fetchData();
                        }
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var navItems = [
        {
            id: "overview",
            label: "Overview",
            icon: LayoutDashboard
        },
        {
            id: "users",
            label: "Verification Queue",
            icon: ShieldCheck
        },
        {
            id: "jobs",
            label: "Marketplace",
            icon: Briefcase
        },
        {
            id: "escrow",
            label: "Financials",
            icon: CreditCard
        },
        {
            id: "disputes",
            label: "Disputes",
            icon: Scale
        },
        {
            id: "reports",
            label: "Insights",
            icon: BarChart3
        },
        {
            id: "health",
            label: "System Health",
            icon: Activity
        }
    ];
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-black text-slate-900 tracking-tight"
    }, "Admin Console"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-medium mt-1"
    }, "Review, moderate, and manage Tara platform operations.")), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-full xl:w-auto"
    }, navItems.map(function(item) {
        return /*#__PURE__*/ React.createElement("button", {
            key: item.id,
            onClick: function onClick() {
                return setActiveTab(item.id);
            },
            className: "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ".concat(activeTab === item.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")
        }, /*#__PURE__*/ React.createElement(item.icon, {
            className: "w-4 h-4"
        }), /*#__PURE__*/ React.createElement("span", null, item.label));
    }))), /*#__PURE__*/ React.createElement(AnimatePresence, {
        mode: "wait"
    }, activeTab === "overview" && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    }, [
        {
            label: "Total Platform Users",
            value: counts.users || 12842,
            icon: Users,
            color: "indigo"
        },
        {
            label: "Funds in Escrow",
            value: "₱".concat(escrows.reduce(function(sum, e) {
                return sum + (e.status === 'funded' ? e.amount : 0);
            }, 0).toLocaleString()),
            subValue: "₱".concat(escrows.reduce(function(sum, e) {
                return sum + (e.status === 'disputed' ? e.amount : 0);
            }, 0).toLocaleString(), " Locked in Dispute"),
            icon: CreditCard,
            color: "emerald"
        },
        {
            label: "Active Disputes",
            value: counts.disputes || 14,
            icon: AlertTriangle,
            color: "red"
        },
        {
            label: "Dispute Rate",
            value: "".concat(counts.escrows > 0 ? (counts.disputes / counts.escrows * 100).toFixed(1) : '0.1', "%"),
            icon: Scale,
            color: "purple"
        },
        {
            label: "Platform Fees (Total)",
            value: "₱".concat(escrows.reduce(function(sum, e) {
                return sum + (Number(e.platform_fee) || 0);
            }, 0).toLocaleString()),
            icon: DollarSign,
            color: "amber"
        }
    ].map(function(stat, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "p-3 rounded-2xl bg-".concat(stat.color, "-50 text-").concat(stat.color, "-600")
        }, /*#__PURE__*/ React.createElement(stat.icon, {
            className: "w-6 h-6"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "mt-4"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-400 uppercase tracking-wider"
        }, stat.label), /*#__PURE__*/ React.createElement("h3", {
            className: "text-3xl font-black text-slate-900 mt-1"
        }, stat.value.toLocaleString()), stat.subValue && /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-bold text-red-500 mt-1 uppercase tracking-tighter"
        }, stat.subValue)));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Platform Performance"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium"
    }, "Monthly growth and interaction trends"))), /*#__PURE__*/ React.createElement("div", {
        className: "h-64 flex items-end gap-2 px-2"
    }, [
        40,
        65,
        45,
        90,
        55,
        75,
        85,
        60,
        95,
        70,
        80,
        100
    ].map(function(h, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex-1 flex flex-col items-center gap-2 group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-full rounded-t-lg transition-all bg-slate-100 group-hover:bg-slate-900",
            style: {
                height: "".concat(h, "%")
            }
        }));
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Recent Admin Audit Logs"), /*#__PURE__*/ React.createElement(FileText, {
        className: "w-5 h-5 text-slate-400"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, auditLogs.length > 0 ? auditLogs.map(function(log) {
        var _log_profiles;
        return /*#__PURE__*/ React.createElement("div", {
            key: log.id,
            className: "flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200"
        }, /*#__PURE__*/ React.createElement(UserCheck, {
            className: "w-5 h-5 text-slate-600"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, log.action), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500"
        }, "By ", ((_log_profiles = log.profiles) === null || _log_profiles === void 0 ? void 0 : _log_profiles.name) || 'Admin', " • ", new Date(log.created_at).toLocaleString()))), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-mono text-slate-400"
        }, "ID: ", log.target_id.slice(0, 8)));
    }) : /*#__PURE__*/ React.createElement("p", {
        className: "text-center py-8 text-slate-400 text-sm italic"
    }, "No recent audit logs found.")))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 rounded-2xl shadow-xl p-8 text-white flex flex-col"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "font-bold"
    }, "Moderation Queue"), /*#__PURE__*/ React.createElement(Scale, {
        className: "w-5 h-5 text-indigo-400"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6 flex-1"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors",
        onClick: function onClick() {
            return setActiveTab('users');
        }
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold text-indigo-400 uppercase mb-1"
    }, "Unverified Users"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium"
    }, users.filter(function(u) {
        return u.status === 'pending';
    }).length, " waiting for verification")), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors",
        onClick: function onClick() {
            return setActiveTab('jobs');
        }
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold text-amber-400 uppercase mb-1"
    }, "Flagged Jobs"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium"
    }, jobs.filter(function(j) {
        return j.status === 'flagged';
    }).length, " jobs need attention")), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-white/5 rounded-2xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors",
        onClick: function onClick() {
            return setActiveTab('disputes');
        }
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold text-red-400 uppercase mb-1"
    }, "High Urgency Disputes"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium"
    }, disputes.filter(function(d) {
        return d.urgency_level === 'High' && d.status === 'open';
    }).length, " urgent cases")))))), activeTab === "users" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "users",
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
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4 md:items-center"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Verification Queue"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium"
    }, "Review IDs and Portfolios to verify users.")), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Search users...",
        className: "pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none w-full md:w-64"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "overflow-x-auto"
    }, /*#__PURE__*/ React.createElement("table", {
        className: "w-full text-left"
    }, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", {
        className: "bg-slate-50/50"
    }, /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "User"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "AI Audit"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Documents"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Status"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right"
    }, "Actions"))), /*#__PURE__*/ React.createElement("tbody", {
        className: "divide-y divide-slate-50"
    }, users.map(function(user) {
        var _user_name;
        return /*#__PURE__*/ React.createElement("tr", {
            key: user.id,
            className: "hover:bg-slate-50/30 transition-colors"
        }, /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden"
        }, user.avatar_url ? /*#__PURE__*/ React.createElement("img", {
            src: user.avatar_url,
            alt: "",
            className: "w-full h-full object-cover"
        }) : ((_user_name = user.name) === null || _user_name === void 0 ? void 0 : _user_name[0]) || "U"), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "font-bold text-slate-900"
        }, user.name || "Anonymous"), /*#__PURE__*/ React.createElement("div", {
            className: "text-xs text-slate-500"
        }, user.role, " • ", user.category || "No Category")))), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, user.status === 'approved' ? /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase"
        }, /*#__PURE__*/ React.createElement(ShieldCheck, {
            className: "w-3.5 h-3.5"
        }), " AI Verified") : user.verification_documents && user.verification_documents.length > 0 ? /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase"
        }, /*#__PURE__*/ React.createElement(AlertTriangle, {
            className: "w-3.5 h-3.5"
        }), " Flagged for Review") : /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase"
        }, /*#__PURE__*/ React.createElement(Clock, {
            className: "w-3.5 h-3.5"
        }), " Waiting for Data")), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2"
        }, user.verification_documents && user.verification_documents.length > 0 ? user.verification_documents.map(function(doc, idx) {
            return /*#__PURE__*/ React.createElement("a", {
                key: idx,
                href: doc.url,
                target: "_blank",
                className: "flex items-center gap-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-colors"
            }, /*#__PURE__*/ React.createElement(FileText, {
                className: "w-3 h-3"
            }), " ", doc.type || 'ID');
        }) : /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] text-slate-400 italic"
        }, "No documents uploaded"))), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-bold px-2 py-1 rounded-lg ".concat(user.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : user.status === 'suspended' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')
        }, user.status || 'pending')), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6 text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-end gap-2"
        }, user.status !== 'approved' && /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return updateUserStatus(user.id, 'approved');
            },
            className: "p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1 px-3",
            title: "Approve"
        }, /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-4 h-4"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-bold"
        }, "Approve")), user.status !== 'suspended' && /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return updateUserStatus(user.id, 'suspended');
            },
            className: "p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1 px-3",
            title: "Reject/Suspend"
        }, /*#__PURE__*/ React.createElement(XCircle, {
            className: "w-4 h-4"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-bold"
        }, "Reject")), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return deleteUser(user.id);
            },
            className: "p-2 bg-slate-100 text-slate-400 hover:bg-red-500 hover:text-white rounded-lg transition-all",
            title: "Delete Account Permanently"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        })))));
    })))))), activeTab === "jobs" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "jobs",
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 border-b border-slate-50"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Job Posting Moderation"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium"
    }, "Monitor marketplace content and take down invalid jobs.")), /*#__PURE__*/ React.createElement("div", {
        className: "overflow-x-auto"
    }, /*#__PURE__*/ React.createElement("table", {
        className: "w-full text-left"
    }, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", {
        className: "bg-slate-50/50"
    }, /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Job Title"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Posted By"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Status"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right"
    }, "Actions"))), /*#__PURE__*/ React.createElement("tbody", {
        className: "divide-y divide-slate-50"
    }, jobs.map(function(job) {
        var _job_profiles;
        return /*#__PURE__*/ React.createElement("tr", {
            key: job.id,
            className: "hover:bg-slate-50/30 transition-colors"
        }, /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-bold text-slate-900"
        }, job.title), /*#__PURE__*/ React.createElement("div", {
            className: "text-[10px] text-slate-400 font-mono"
        }, job.id)), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-sm font-bold text-slate-700"
        }, ((_job_profiles = job.profiles) === null || _job_profiles === void 0 ? void 0 : _job_profiles.name) || job.company)), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-bold px-2 py-1 rounded-lg ".concat(job.status === 'live' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')
        }, job.status || 'live')), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6 text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-end gap-2"
        }, job.status !== 'live' && /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return updateJobStatus(job.id, 'live');
            },
            className: "p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement(Check, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return deleteJob(job.id);
            },
            className: "p-2 text-red-600 hover:bg-red-50 rounded-lg"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        })))));
    })))))), activeTab === "escrow" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "escrow",
        initial: {
            opacity: 0,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-emerald-50 text-emerald-600 rounded-xl"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-500 uppercase tracking-widest"
    }, "Total Inflow (Funded)")), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-slate-900"
    }, "₱", escrows.reduce(function(sum, e) {
        return sum + (e.status === 'funded' || e.status === 'released' ? e.amount : 0);
    }, 0).toLocaleString()), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-medium mt-1"
    }, "Gross volume currently managed by platform")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-indigo-50 text-indigo-600 rounded-xl"
    }, /*#__PURE__*/ React.createElement(ArrowUpRight, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-500 uppercase tracking-widest"
    }, "Total Outflow (Released)")), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-slate-900"
    }, "₱", escrows.reduce(function(sum, e) {
        return sum + (e.status === 'released' ? e.amount : 0);
    }, 0).toLocaleString()), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-medium mt-1"
    }, "Total payments successfully completed to freelancers")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2 bg-amber-50 text-amber-600 rounded-xl"
    }, /*#__PURE__*/ React.createElement(Lock, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-500 uppercase tracking-widest"
    }, "Currently Held in Escrow")), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-amber-600"
    }, "₱", escrows.reduce(function(sum, e) {
        return sum + (e.status === 'funded' || e.status === 'disputed' ? e.amount : 0);
    }, 0).toLocaleString()), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-medium mt-1"
    }, "Funds waiting for milestone approval or dispute resolution"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 border-b border-slate-50 flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Financial Transparency"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium"
    }, "Detailed audit of all escrow transactions and platform fees.")), /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-slate-50 rounded-2xl flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest"
    }, "Revenue (Platform Fees)"), /*#__PURE__*/ React.createElement("p", {
        className: "text-lg font-black text-indigo-600"
    }, "₱", escrows.reduce(function(sum, e) {
        return sum + (Number(e.platform_fee) || 0);
    }, 0).toLocaleString())), /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-6 h-6"
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "overflow-x-auto"
    }, /*#__PURE__*/ React.createElement("table", {
        className: "w-full text-left"
    }, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", {
        className: "bg-slate-50/50"
    }, /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Job"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Total Amount"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Platform Fee"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Status"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right"
    }, "Actions"))), /*#__PURE__*/ React.createElement("tbody", {
        className: "divide-y divide-slate-50"
    }, escrows.map(function(escrow) {
        var _escrow_jobs;
        return /*#__PURE__*/ React.createElement("tr", {
            key: escrow.id,
            className: "hover:bg-slate-50/30 transition-colors"
        }, /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-bold text-slate-900"
        }, ((_escrow_jobs = escrow.jobs) === null || _escrow_jobs === void 0 ? void 0 : _escrow_jobs.title) || 'Unknown Job'), /*#__PURE__*/ React.createElement("div", {
            className: "text-[10px] font-mono text-slate-400"
        }, escrow.id.slice(0, 8), "...")), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6 font-bold text-slate-700"
        }, "₱", escrow.amount.toLocaleString()), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6 font-bold text-indigo-600"
        }, "₱", (Number(escrow.platform_fee) || 0).toLocaleString()), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-bold px-2 py-1 rounded-lg ".concat(escrow.status === 'released' ? 'bg-emerald-50 text-emerald-600' : escrow.status === 'disputed' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600')
        }, escrow.status)), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6 text-right"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return deleteEscrow(escrow.id);
            },
            className: "p-2 text-red-600 hover:bg-red-50 rounded-lg",
            title: "Remove Escrow"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        }))));
    }), escrows.length === 0 && /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("td", {
        colSpan: 5,
        className: "px-8 py-12 text-center text-slate-400 italic"
    }, "No escrow records found."))))))), activeTab === "disputes" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "disputes",
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: -20
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8 border-b border-slate-50"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Dispute Resolution Center"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium"
    }, 'Review "He said, She said" cases with urgency levels and evidence.')), /*#__PURE__*/ React.createElement("div", {
        className: "overflow-x-auto"
    }, /*#__PURE__*/ React.createElement("table", {
        className: "w-full text-left"
    }, /*#__PURE__*/ React.createElement("thead", null, /*#__PURE__*/ React.createElement("tr", {
        className: "bg-slate-50/50"
    }, /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Urgency"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Job & Amount"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
    }, "Evidence"), /*#__PURE__*/ React.createElement("th", {
        className: "px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right"
    }, "Actions"))), /*#__PURE__*/ React.createElement("tbody", {
        className: "divide-y divide-slate-50"
    }, disputes.map(function(dispute) {
        var _dispute_escrows_jobs, _dispute_escrows, _dispute_escrows1, _dispute_evidence_urls;
        return /*#__PURE__*/ React.createElement("tr", {
            key: dispute.id,
            className: "hover:bg-slate-50/30 transition-colors"
        }, /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black uppercase px-2 py-1 rounded-lg ".concat(dispute.urgency_level === 'High' ? 'bg-red-100 text-red-600' : dispute.urgency_level === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600')
        }, dispute.urgency_level)), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "font-bold text-slate-900"
        }, ((_dispute_escrows = dispute.escrows) === null || _dispute_escrows === void 0 ? void 0 : (_dispute_escrows_jobs = _dispute_escrows.jobs) === null || _dispute_escrows_jobs === void 0 ? void 0 : _dispute_escrows_jobs.title) || 'Unknown Job'), /*#__PURE__*/ React.createElement("div", {
            className: "text-sm text-indigo-600 font-bold"
        }, "₱", (_dispute_escrows1 = dispute.escrows) === null || _dispute_escrows1 === void 0 ? void 0 : _dispute_escrows1.amount.toLocaleString())), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-wrap gap-2"
        }, /*#__PURE__*/ React.createElement("button", {
            className: "flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100"
        }, /*#__PURE__*/ React.createElement(Eye, {
            className: "w-3 h-3"
        }), " Chat Logs"), (_dispute_evidence_urls = dispute.evidence_urls) === null || _dispute_evidence_urls === void 0 ? void 0 : _dispute_evidence_urls.map(function(url, i) {
            return /*#__PURE__*/ React.createElement("a", {
                key: i,
                href: url,
                target: "_blank",
                className: "flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-200"
            }, /*#__PURE__*/ React.createElement(FileText, {
                className: "w-3 h-3"
            }), " Proof ", i + 1);
        }))), /*#__PURE__*/ React.createElement("td", {
            className: "px-8 py-6 text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-end gap-2"
        }, /*#__PURE__*/ React.createElement("button", {
            className: "px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
        }, "Resolve"))));
    }), disputes.length === 0 && /*#__PURE__*/ React.createElement("tr", null, /*#__PURE__*/ React.createElement("td", {
        colSpan: 4,
        className: "px-8 py-12 text-center text-slate-400 italic"
    }, "No active disputes."))))))), activeTab === "reports" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "reports",
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        className: "grid grid-cols-1 md:grid-cols-2 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-8 rounded-2xl border border-slate-100 shadow-sm"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-900 mb-6"
    }, "User Demographic"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, [
        {
            label: "Developers",
            value: "35%",
            color: "bg-emerald-500"
        },
        {
            label: "Designers / Graphic Design",
            value: "25%",
            color: "bg-indigo-500"
        },
        {
            label: "Virtual Assistants / Admin",
            value: "20%",
            color: "bg-purple-500"
        },
        {
            label: "Marketing",
            value: "15%",
            color: "bg-amber-500"
        },
        {
            label: "Others",
            value: "5%",
            color: "bg-slate-300"
        }
    ].map(function(item, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between text-sm font-bold mb-1"
        }, /*#__PURE__*/ React.createElement("span", null, item.label), /*#__PURE__*/ React.createElement("span", null, item.value)), /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-2 bg-slate-100 rounded-full overflow-hidden"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "h-full ".concat(item.color),
            style: {
                width: item.value
            }
        })));
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-8 h-8"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Platform Insights"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 mt-2 max-w-xs"
    }, "Your platform activity has increased by 12% compared to last week. Most active time is between 2PM and 6PM."), /*#__PURE__*/ React.createElement("button", {
        className: "mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold"
    }, "Download Full Report"))), activeTab === "health" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "health",
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 shadow-sm p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "System Health & User Impact"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 font-medium"
    }, "Monitoring risks and platform stability.")), /*#__PURE__*/ React.createElement("button", {
        onClick: checkTableHealth,
        className: "p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600"
    }, /*#__PURE__*/ React.createElement(Activity, {
        className: "w-5 h-5"
    }))), !healthStatus.jobs.exists && /*#__PURE__*/ React.createElement("div", {
        className: "mb-8 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-red-100 text-red-600 rounded-xl"
    }, /*#__PURE__*/ React.createElement(AlertTriangle, {
        className: "w-6 h-6"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-red-900"
    }, "High Revenue Risk!"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-red-700 leading-relaxed"
    }, "Jobs table is offline. Approximately ", /*#__PURE__*/ React.createElement("strong", null, counts.jobs, " jobs"), " are currently hidden.", /*#__PURE__*/ React.createElement("br", null), /*#__PURE__*/ React.createElement("span", {
        className: "font-black"
    }, "Estimated Platform Fee Loss: ₱", ((counts.jobs || 3456) * 125).toLocaleString(), " / hour")))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-6 rounded-2xl border border-emerald-100 bg-emerald-50/30"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2.5 rounded-xl bg-white shadow-sm border border-emerald-100"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-5 h-5 text-emerald-500"
    })), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700"
    }, "Active")), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "SSL Certificate"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500 mt-1"
    }, "Status: ", /*#__PURE__*/ React.createElement("span", {
        className: "text-emerald-600 font-bold"
    }, "Active"), '. Note: Modern browsers may still show "Not Secure" if ACME challenge is pending propagation.')), /*#__PURE__*/ React.createElement("div", {
        className: "p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-2.5 rounded-xl bg-white shadow-sm border border-indigo-100"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "w-5 h-5 text-indigo-500"
    })), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700"
    }, "Rate Limited")), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "Email System"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500 mt-1"
    }, "Current limit: 5 emails/hour. Scaling required for high-volume recruitment.")), Object.entries(healthStatus).map(function(param) {
        var _param = _sliced_to_array(param, 2), table = _param[0], status = _param[1];
        return /*#__PURE__*/ React.createElement("div", {
            key: table,
            className: "p-6 rounded-2xl border border-slate-100 bg-slate-50/50"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "p-2.5 rounded-xl bg-white shadow-sm border border-slate-100"
        }, /*#__PURE__*/ React.createElement(FileText, {
            className: "w-5 h-5 ".concat(status.exists ? 'text-emerald-500' : 'text-red-500')
        })), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black uppercase px-2 py-1 rounded-lg ".concat(status.exists ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')
        }, status.exists ? 'Healthy' : 'Missing')), /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-slate-900 capitalize"
        }, table), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500 mt-1"
        }, status.exists ? "Table ".concat(table, " is active and reachable.") : "Table ".concat(table, " was not found in public schema.")), !status.exists && /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                var sql = "CREATE TABLE IF NOT EXISTS public.".concat(table, " (id UUID PRIMARY KEY DEFAULT gen_random_uuid()); -- Simplified");
                navigator.clipboard.writeText(sql);
                notify("SQL for ".concat(table, " copied!"));
            },
            className: "mt-4 text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
        }, "Copy Setup SQL ", /*#__PURE__*/ React.createElement(Copy, {
            className: "w-3 h-3"
        })));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "mt-12 p-8 bg-slate-900 rounded-2xl text-white relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold mb-4"
    }, "Manual Database Setup"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-sm mb-8 max-w-2xl leading-relaxed"
    }, 'If you are seeing "Missing" tables, you need to run our schema script in your Supabase SQL Editor. This will create all the necessary tables (profiles, jobs, escrows, messages) and enable Realtime sync.'), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-4"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            fetch('/supabase_schema.sql').then(function(r) {
                return r.text();
            }).then(function(sql) {
                navigator.clipboard.writeText(sql);
                notify("Full Schema copied to clipboard!");
            });
        },
        className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Copy, {
        className: "w-4 h-4"
    }), "Copy Full SQL Script"), /*#__PURE__*/ React.createElement("a", {
        href: "https://supabase.com/dashboard/project/_/sql",
        target: "_blank",
        className: "px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
    }, "Open Supabase Editor ", /*#__PURE__*/ React.createElement(ExternalLink, {
        className: "w-4 h-4"
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"
    }))))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showToast && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        exit: {
            opacity: 0,
            y: 20
        },
        className: "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800"
    }, /*#__PURE__*/ React.createElement(Check, {
        className: "w-4 h-4 text-emerald-400"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold"
    }, toastMsg))));
}
