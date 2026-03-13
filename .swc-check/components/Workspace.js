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
import { Code2, BarChart3, Activity, Trello, Layout, LayoutDashboard, Video, Github, FileText, CheckCircle2, Clock, ChevronRight, AlertTriangle, MessageSquare, ExternalLink, Link as LinkIcon, Lock, Smile, Meh, TrendingUp, Award, Shield, ShieldCheck, Zap, Globe, DollarSign, Loader2, Plus, Brain, ArrowUpRight, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "../lib/utils";
import VideoCall from "./VideoCall";
import WellnessDashboard from "./WellnessDashboard";
import FocusMode from "./FocusMode";
import AIAgent from "./AIAgent";
export default function Workspace(param) {
    var projects = param.projects, currentUserId = param.currentUserId, onUpdateProject = param.onUpdateProject, onCreateProject = param.onCreateProject, _param_workflows = param.workflows, workflows = _param_workflows === void 0 ? [] : _param_workflows, onUpdateWorkflows = param.onUpdateWorkflows;
    var _selectedProject_milestones, _selectedProject_milestones1, _selectedProject_milestones2, _selectedProject_milestones3;
    var _useState = _sliced_to_array(useState("dashboard"), 2), activeTab = _useState[0], setActiveTab = _useState[1];
    var _useState1 = _sliced_to_array(useState(projects[0] || null), 2), selectedProject = _useState1[0], setSelectedProject = _useState1[1];
    var _useState2 = _sliced_to_array(useState(null), 2), editingLink = _useState2[0], setEditingLink = _useState2[1];
    var _useState3 = _sliced_to_array(useState(""), 2), tempLink = _useState3[0], setTempLink = _useState3[1];
    var _useState4 = _sliced_to_array(useState(false), 2), showWarRoom = _useState4[0], setShowWarRoom = _useState4[1];
    var _useState5 = _sliced_to_array(useState(false), 2), showContractManager = _useState5[0], setShowContractManager = _useState5[1];
    var _useState6 = _sliced_to_array(useState(false), 2), activeCall = _useState6[0], setActiveCall = _useState6[1];
    var _useState7 = _sliced_to_array(useState(false), 2), isSyncing = _useState7[0], setIsSyncing = _useState7[1];
    var _useState8 = _sliced_to_array(useState(false), 2), showFocusMode = _useState8[0], setShowFocusMode = _useState8[1];
    var _useState9 = _sliced_to_array(useState(false), 2), isCreatingProject = _useState9[0], setIsCreatingProject = _useState9[1];
    var _useState10 = _sliced_to_array(useState({
        title: "",
        client: "",
        workspaceType: "General"
    }), 2), newProject = _useState10[0], setNewProject = _useState10[1];
    var _useState11 = _sliced_to_array(useState(false), 2), isCreatingWorkflow = _useState11[0], setIsCreatingWorkflow = _useState11[1];
    var _useState12 = _sliced_to_array(useState({
        trigger: "",
        action: "",
        name: "",
        icon: "Zap"
    }), 2), newWorkflow = _useState12[0], setNewWorkflow = _useState12[1];
    var _useState13 = _sliced_to_array(useState(false), 2), showAIClauseAudit = _useState13[0], setShowAIClauseAudit = _useState13[1];
    var _useState14 = _sliced_to_array(useState(false), 2), showToast = _useState14[0], setShowToast = _useState14[1];
    var _useState15 = _sliced_to_array(useState(""), 2), toastMsg = _useState15[0], setToastMsg = _useState15[1];
    var _useState16 = _sliced_to_array(useState({}), 2), connectedApps = _useState16[0], setConnectedApps = _useState16[1];
    var selectedMilestones = (selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.milestones) || [];
    // Mock wellness data - in a real app this would come from the user profile/wellness service
    var wellnessData = {
        weeklyCapacity: 35,
        currentWorkload: 28,
        energyRating: "Balanced",
        focusHours: 12,
        burnoutRiskScore: 35,
        workToRestRatio: 4.2,
        consecutiveHighLoadDays: 2,
        sustainabilityIndex: 86,
        energyEfficiency: 95,
        verifiedSustainable: true
    };
    // Sync selected project when projects prop changes from DB
    useEffect(function() {
        if (selectedProject) {
            var updated = projects.find(function(p) {
                return p.id === selectedProject.id;
            });
            if (updated) {
                // Source of truth (DB) takes precedence if there's a desync
                // but we only update if it's actually different to avoid unnecessary re-renders
                var isDifferent = JSON.stringify(updated.milestones) !== JSON.stringify(selectedProject.milestones);
                if (isDifferent) {
                    setSelectedProject(updated);
                }
            }
        } else if (projects.length > 0) {
            setSelectedProject(projects[0]);
        }
    }, [
        projects
    ]);
    var handleSaveLink = function handleSaveLink(project) {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!onUpdateProject) return [
                            3,
                            2
                        ];
                        setIsSyncing(true);
                        return [
                            4,
                            onUpdateProject(_object_spread_props(_object_spread({}, project), {
                                projectLink: tempLink
                            }))
                        ];
                    case 1:
                        _state.sent();
                        setEditingLink(null);
                        setIsSyncing(false);
                        _state.label = 2;
                    case 2:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleConnect = function handleConnect(appName) {
        if (!selectedProject) return;
        var projectId = selectedProject.id;
        var projectApps = connectedApps[projectId] || [];
        if (projectApps.includes(appName)) {
            setToastMsg("".concat(appName, " is already connected."));
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 3000);
            return;
        }
        setConnectedApps(_object_spread_props(_object_spread({}, connectedApps), _define_property({}, projectId, _to_consumable_array(projectApps).concat([
            appName
        ]))));
        setToastMsg("Successfully connected to ".concat(appName, "!"));
        setShowToast(true);
        setTimeout(function() {
            return setShowToast(false);
        }, 3000);
    };
    var handleCreateProject = function handleCreateProject() {
        if (!newProject.title || !newProject.client || !onUpdateProject) return;
        var project = {
            id: Math.random().toString(36).substr(2, 9),
            title: newProject.title,
            client: newProject.client,
            workspaceType: newProject.workspaceType,
            status: "In Progress",
            hoursLogged: 0,
            budget: "$0",
            milestones: [],
            progress: 0,
            clientId: "mock-client-id"
        };
        // We use onUpdateProject by passing the new list but it's cleaner if parent supports creation
        // For now, we'll assume we can push it if we had access to the full list, 
        // but since we only have onUpdateProject(oneProject), we might need a new prop.
        // Let's assume onUpdateProject can take a new project if the id doesn't exist? 
        // No, handleUpdateProject in page.tsx only replaces existing.
        // I'll add onCreateProject prop to Workspace.
        if (onCreateProject) {
            onCreateProject(project);
        }
        setIsCreatingProject(false);
        setNewProject({
            title: "",
            client: "",
            workspaceType: "General"
        });
    };
    var handleCreateWorkflow = function handleCreateWorkflow() {
        if (!newWorkflow.name || !newWorkflow.trigger || !newWorkflow.action) return;
        var workflow = {
            id: Math.random().toString(36).substr(2, 9),
            name: newWorkflow.name,
            trigger: newWorkflow.trigger,
            action: newWorkflow.action,
            icon: "Zap",
            color: "bg-purple-500",
            active: true
        };
        if (onUpdateWorkflows) {
            onUpdateWorkflows(_to_consumable_array(workflows).concat([
                workflow
            ]));
        }
        setIsCreatingWorkflow(false);
        setNewWorkflow({
            trigger: "",
            action: "",
            name: "",
            icon: "Zap"
        });
    };
    var handleUpdateMilestone = function handleUpdateMilestone(projectId, milestoneId, status) {
        return _async_to_generator(function() {
            var updatedMilestones, updatedProject;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!onUpdateProject || !selectedProject) return [
                            2
                        ];
                        setIsSyncing(true);
                        // Optimistic Update
                        updatedMilestones = (selectedProject.milestones || []).map(function(m) {
                            return m.id === milestoneId ? _object_spread_props(_object_spread({}, m), {
                                status: status
                            }) : m;
                        });
                        updatedProject = _object_spread_props(_object_spread({}, selectedProject), {
                            milestones: updatedMilestones
                        });
                        // Update local state immediately
                        setSelectedProject(updatedProject);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            ,
                            3,
                            4
                        ]);
                        return [
                            4,
                            onUpdateProject(updatedProject)
                        ];
                    case 2:
                        _state.sent();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        setIsSyncing(false);
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
    return /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6"
    }, activeCall && /*#__PURE__*/ React.createElement(VideoCall, {
        projectId: selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.id,
        currentUserId: currentUserId,
        onLeave: function onLeave() {
            return setActiveCall(false);
        }
    }), /*#__PURE__*/ React.createElement(FocusMode, {
        isOpen: showFocusMode,
        onClose: function onClose() {
            return setShowFocusMode(false);
        },
        tasks: ((selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.milestones) || []).map(function(m) {
            return {
                id: m.id,
                title: m.title,
                completed: m.status === 'Completed'
            };
        })
    }), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 p-6 text-white"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center border border-white/10"
    }, /*#__PURE__*/ React.createElement(Layout, {
        className: "w-5 h-5 text-white"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold tracking-tight"
    }, "Collaborative Workspace"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-[10px] font-medium uppercase tracking-widest mt-0.5"
    }, "Projects • Reviews • AI Notes"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2 w-full sm:w-auto"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setActiveTab("dashboard");
        },
        className: "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
    }, /*#__PURE__*/ React.createElement(LayoutDashboard, {
        className: "w-3.5 h-3.5 text-indigo-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "hidden xs:inline"
    }, "Dashboard"), /*#__PURE__*/ React.createElement("span", {
        className: "xs:hidden"
    }, "Dash")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setActiveCall(true);
        },
        className: "flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider"
    }, /*#__PURE__*/ React.createElement(Video, {
        className: "w-3.5 h-3.5"
    }), "Meeting"))), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-1 p-1 bg-slate-800/50 rounded-lg w-full border border-white/5"
    }, [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard
        },
        {
            id: "active",
            label: "Projects",
            icon: Clock
        },
        {
            id: "pulse",
            label: "Pulse",
            icon: Activity
        },
        {
            id: "warroom",
            label: "War Room",
            icon: Shield
        },
        {
            id: "wellness",
            label: "Wellness",
            icon: Zap
        },
        {
            id: "contract",
            label: "Contract",
            icon: FileText
        },
        {
            id: "reviews",
            label: "Tools",
            icon: Layout
        },
        {
            id: "calls",
            label: "Notes",
            icon: MessageSquare
        }
    ].map(function(tab) {
        return /*#__PURE__*/ React.createElement("button", {
            key: tab.id,
            onClick: function onClick() {
                setActiveTab(tab.id);
                if (tab.id === 'warroom') setShowWarRoom(true);
                else setShowWarRoom(false);
            },
            className: "flex items-center gap-2 px-4 py-2.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ".concat(activeTab === tab.id ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200")
        }, tab.id === 'warroom' ? /*#__PURE__*/ React.createElement(Shield, {
            className: "w-3.5 h-3.5"
        }) : /*#__PURE__*/ React.createElement(tab.icon, {
            className: "w-3.5 h-3.5"
        }), tab.label);
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement(AnimatePresence, {
        mode: "wait"
    }, activeTab === "dashboard" && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
    }, [
        {
            label: "Total Revenue",
            value: "$12,450",
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            label: "Active Projects",
            value: projects.length.toString(),
            icon: Layout,
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            label: "Avg. Velocity",
            value: "94%",
            icon: TrendingUp,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            label: "Sustainability Index",
            value: "".concat(wellnessData.sustainabilityIndex, "%"),
            icon: Zap,
            color: "text-purple-500",
            bg: "bg-purple-50"
        }
    ].map(function(stat, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)
        }, /*#__PURE__*/ React.createElement(stat.icon, {
            className: cn("w-6 h-6", stat.color)
        })), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-widest"
        }, "Live")), /*#__PURE__*/ React.createElement("h3", {
            className: "text-2xl font-black text-slate-900 tracking-tighter"
        }, stat.value), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs font-bold text-slate-400 uppercase tracking-tight mt-1"
        }, stat.label));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-indigo-300 uppercase tracking-widest"
    }, "AI Intelligence Report")), /*#__PURE__*/ React.createElement("div", {
        className: "px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-emerald-300 uppercase tracking-widest"
    }, "Optimal Performance"))), /*#__PURE__*/ React.createElement("h2", {
        className: "text-4xl font-black tracking-tight mb-4"
    }, "Your workspace is ", /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400"
    }, "operating at peak efficiency.")), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 text-lg font-medium max-w-xl mb-8"
    }, "AI analysis shows that your current squad configuration and wellness levels are perfectly aligned for the upcoming milestones."), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-3"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-5 h-5 text-indigo-400"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black uppercase tracking-wider"
    }, "Burnout Protection")), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400 leading-relaxed"
    }, "Risk score is ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, "low (", wellnessData.burnoutRiskScore, "%)"), ". Recommended focus block: 2 hours this afternoon.")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-3"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-5 h-5 text-amber-400"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black uppercase tracking-wider"
    }, "Energy Forecasting")), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400 leading-relaxed"
    }, "Next week's predicted capacity: ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, "38.5 hours"), ". Ideal for high-intensity tasks.")))), /*#__PURE__*/ React.createElement(Brain, {
        className: "absolute -right-12 -bottom-12 w-64 h-64 text-white/5 rotate-12"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black text-slate-900 tracking-tight"
    }, "Active Projects Insight"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold text-slate-400 uppercase tracking-widest mt-1"
    }, "Real-time delivery status")), /*#__PURE__*/ React.createElement("button", {
        className: "text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
    }, "View All Projects")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, projects.length > 0 ? projects.slice(0, 3).map(function(project, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: project.id,
            className: "flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: cn("w-12 h-12 rounded-xl flex items-center justify-center font-black text-white shadow-lg", i === 0 ? "bg-indigo-600" : i === 1 ? "bg-slate-800" : "bg-purple-600")
        }, (project.title || "P")[0]), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
            className: "text-sm font-black text-slate-900"
        }, project.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-tight"
        }, project.client, " • ", project.workspaceType))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-8"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "hidden md:block"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
        }, "Progress"), /*#__PURE__*/ React.createElement("div", {
            className: "w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden"
        }, /*#__PURE__*/ React.createElement(motion.div, {
            initial: {
                width: 0
            },
            animate: {
                width: "".concat(project.progress || 0, "%")
            },
            className: "h-full bg-indigo-600"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
        }, "Status"), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wider"
        }, project.status)), /*#__PURE__*/ React.createElement(ChevronRight, {
            className: "w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors"
        })));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200"
    }, /*#__PURE__*/ React.createElement(Layout, {
        className: "w-12 h-12 text-slate-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-400"
    }, "No active projects found."))))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6"
    }, "Performance Index"), /*#__PURE__*/ React.createElement("div", {
        className: "relative flex justify-center items-center mb-6"
    }, /*#__PURE__*/ React.createElement("svg", {
        className: "w-40 h-40"
    }, /*#__PURE__*/ React.createElement("circle", {
        cx: "80",
        cy: "80",
        r: "70",
        className: "fill-none stroke-slate-100 stroke-[12]"
    }), /*#__PURE__*/ React.createElement(motion.circle, {
        cx: "80",
        cy: "80",
        r: "70",
        className: "fill-none stroke-indigo-600 stroke-[12]",
        strokeDasharray: "440",
        initial: {
            strokeDashoffset: 440
        },
        animate: {
            strokeDashoffset: 440 - 440 * wellnessData.sustainabilityIndex / 100
        },
        strokeLinecap: "round"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 flex flex-col items-center justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-3xl font-black text-slate-900"
    }, wellnessData.sustainabilityIndex, "%"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase"
    }, "Sustainable"))), /*#__PURE__*/ React.createElement("p", {
        className: "text-center text-[10px] text-slate-500 font-medium px-4"
    }, "Your current workload vs energy levels is ", /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-600 font-bold"
    }, "Highly Optimized"), ".")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-600 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black mb-6"
    }, "Quick Actions"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, [
        {
            label: "Launch War Room",
            icon: Shield,
            tab: "warroom"
        },
        {
            label: "Manage Contract",
            icon: FileText,
            tab: "contract"
        },
        {
            label: "New Project",
            icon: Plus,
            action: function action() {
                return setIsCreatingProject(true);
            }
        },
        {
            label: "Check AI Pulse",
            icon: Activity,
            tab: "pulse"
        },
        {
            label: "Open Focus Mode",
            icon: Brain,
            action: function action() {
                return setShowFocusMode(true);
            }
        }
    ].map(function(action, i) {
        return /*#__PURE__*/ React.createElement("button", {
            key: i,
            onClick: function onClick() {
                if (action.tab) setActiveTab(action.tab);
                if (action.action) action.action();
            },
            className: "w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement(action.icon, {
            className: "w-5 h-5 text-indigo-200"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-bold uppercase tracking-wide"
        }, action.label)), /*#__PURE__*/ React.createElement(ArrowUpRight, {
            className: "w-4 h-4 text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        }));
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6"
    }, "Upcoming Milestones"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, selectedMilestones.length > 0 ? selectedMilestones.slice(0, 2).map(function(m, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: m.id || i,
            className: "flex gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-2 h-2 bg-indigo-600 rounded-full"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "w-0.5 h-full bg-slate-100"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", {
            className: "text-sm font-black text-slate-900 leading-none mb-1"
        }, m.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-2"
        }, m.dueDate || 'Mar 15, 2024'), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase tracking-widest"
        }, "Pending")));
    }) : /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold text-slate-400 uppercase text-center py-4"
    }, "No upcoming milestones.")))))), activeTab === "wellness" && /*#__PURE__*/ React.createElement(motion.div, {
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
        }
    }, /*#__PURE__*/ React.createElement(WellnessDashboard, {
        wellness: wellnessData,
        revenuePerHour: 85
    }), /*#__PURE__*/ React.createElement("div", {
        className: "mt-8 flex justify-center"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowFocusMode(true);
        },
        className: "flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
    }, /*#__PURE__*/ React.createElement(Brain, {
        className: "w-5 h-5"
    }), "Enter Focus Environment"))), activeTab === "pulse" && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.98
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        exit: {
            opacity: 0,
            scale: 0.98
        },
        className: "space-y-6"
    }, selectedProject ? /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl relative overflow-hidden group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1"
    }, "AI Velocity Prediction"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-end gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-3xl font-black text-white tracking-tighter"
    }, "On Track"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1"
    }, /*#__PURE__*/ React.createElement(TrendingUp, {
        className: "w-3 h-3"
    }), "+12% vs last week")), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-indigo-200/60 mt-2 font-medium"
    }, "Predicted Completion: ", /*#__PURE__*/ React.createElement("span", {
        className: "text-white font-bold"
    }, "March 14, 2024"))), /*#__PURE__*/ React.createElement(BarChart3, {
        className: "absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-2"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-5 h-5 text-amber-500"
    })), /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5"
    }, "Energy Burn Rate"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-black text-slate-900"
    }, "2.4", /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] text-slate-400 font-bold ml-1"
    }, "pts/hr"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-2"
    }, /*#__PURE__*/ React.createElement(Smile, {
        className: "w-5 h-5 text-indigo-500"
    })), /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5"
    }, "Sentiment Health"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-black text-slate-900"
    }, "Positive"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-2xl flex items-center justify-between shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-12 h-12 bg-white rounded-xl shadow-sm border border-amber-100 flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Activity, {
        className: "w-6 h-6 text-amber-500 animate-pulse"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black text-amber-900 uppercase tracking-tight"
    }, "AI Project Pulse"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-amber-700 font-medium"
    }, wellnessData.energyRating === "Low" ? "CRITICAL: Worker energy is Low. AI predicts 20% slower velocity this week." : "HEALTHY: Current energy levels match project requirements. On track for Mar 15."))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-amber-500 text-white px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg shadow-amber-200"
    }, wellnessData.energyRating, " Energy Match"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6"
    }, [
        "Todo",
        "In-Progress",
        "Done"
    ].map(function(col) {
        return /*#__PURE__*/ React.createElement("div", {
            key: col,
            className: "bg-slate-50/50 rounded-2xl p-4 border border-slate-100 min-h-[400px]"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center mb-4 px-2"
        }, /*#__PURE__*/ React.createElement("h5", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
        }, col), /*#__PURE__*/ React.createElement("span", {
            className: "w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500"
        }, (selectedProject.tasks || [
            {
                id: 't1',
                title: 'Design Auth Flow',
                status: 'Todo',
                energyCost: 'Medium'
            },
            {
                id: 't2',
                title: 'Fix API Bug',
                status: 'In-Progress',
                energyCost: 'High'
            },
            {
                id: 't3',
                title: 'Setup DB Schema',
                status: 'Done',
                energyCost: 'Low'
            }
        ]).filter(function(t) {
            return t.status === col;
        }).length)), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-3"
        }, (selectedProject.tasks || [
            {
                id: 't1',
                title: 'Design Auth Flow',
                status: 'Todo',
                energyCost: 'Medium'
            },
            {
                id: 't2',
                title: 'Fix API Bug',
                status: 'In-Progress',
                energyCost: 'High'
            },
            {
                id: 't3',
                title: 'Setup DB Schema',
                status: 'Done',
                energyCost: 'Low'
            }
        ]).filter(function(t) {
            return t.status === col;
        }).map(function(task) {
            return /*#__PURE__*/ React.createElement(motion.div, {
                key: task.id,
                whileHover: {
                    y: -2,
                    scale: 1.02
                },
                className: "bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing"
            }, /*#__PURE__*/ React.createElement("h6", {
                className: "text-sm font-bold text-slate-900 mb-2"
            }, task.title), /*#__PURE__*/ React.createElement("div", {
                className: "flex justify-between items-center mt-3"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "flex items-center gap-1.5"
            }, /*#__PURE__*/ React.createElement("div", {
                className: cn("w-1.5 h-1.5 rounded-full", task.energyCost === 'High' ? "bg-rose-500" : task.energyCost === 'Medium' ? "bg-amber-500" : "bg-emerald-500")
            }), /*#__PURE__*/ React.createElement("span", {
                className: "text-[9px] font-black text-slate-400 uppercase tracking-widest"
            }, task.energyCost, " Energy")), /*#__PURE__*/ React.createElement("div", {
                className: "w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center"
            }, /*#__PURE__*/ React.createElement(Smile, {
                className: "w-3.5 h-3.5 text-slate-400"
            }))));
        }), /*#__PURE__*/ React.createElement("button", {
            className: "w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-400 transition-all mt-2"
        }, "+ New Task")));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "mt-8 border-t border-slate-100 pt-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4 px-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-4 h-4 text-indigo-600"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
    }, "TARA Smart Workflows")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-4"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded"
    }, workflows.length, " Active Automations"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsCreatingWorkflow(true);
        },
        className: "flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-3 h-3"
    }), " Add Workflow"))), isCreatingWorkflow && /*#__PURE__*/ React.createElement("div", {
        className: "p-5 bg-white border-2 border-indigo-100 rounded-2xl mb-4 shadow-xl"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-xs font-black text-slate-900 uppercase tracking-tight mb-4"
    }, "Build New Automation"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4 mb-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1"
    }, "Workflow Name"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        value: newWorkflow.name,
        onChange: function onChange(e) {
            return setNewWorkflow(_object_spread_props(_object_spread({}, newWorkflow), {
                name: e.target.value
            }));
        },
        className: "w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none",
        placeholder: "e.g. Weekly Status Update"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1"
    }, "Trigger (IF...)"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        value: newWorkflow.trigger,
        onChange: function onChange(e) {
            return setNewWorkflow(_object_spread_props(_object_spread({}, newWorkflow), {
                trigger: e.target.value
            }));
        },
        className: "w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none",
        placeholder: "IF task is done"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1"
    }, "Action (THEN...)"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        value: newWorkflow.action,
        onChange: function onChange(e) {
            return setNewWorkflow(_object_spread_props(_object_spread({}, newWorkflow), {
                action: e.target.value
            }));
        },
        className: "w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none",
        placeholder: "THEN notify client"
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-end gap-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsCreatingWorkflow(false);
        },
        className: "px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase"
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        onClick: handleCreateWorkflow,
        className: "px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700"
    }, "ACTIVATE WORKFLOW"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, workflows.map(function(wf) {
        return /*#__PURE__*/ React.createElement("div", {
            key: wf.id,
            className: "p-5 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-start gap-4 group hover:bg-white hover:border-indigo-100 transition-all cursor-pointer shadow-sm hover:shadow-md"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 ".concat(wf.color, " text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform")
        }, wf.icon === 'Zap' ? /*#__PURE__*/ React.createElement(Zap, {
            className: "w-5 h-5"
        }) : /*#__PURE__*/ React.createElement(Activity, {
            className: "w-5 h-5"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-xs font-black text-slate-900 uppercase tracking-tight"
        }, wf.name), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-500 mt-1 leading-relaxed"
        }, wf.trigger, " THEN ", /*#__PURE__*/ React.createElement("span", {
            className: "text-indigo-600 font-bold"
        }, wf.action), ".")), /*#__PURE__*/ React.createElement("div", {
            className: "ml-auto"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-8 h-4 ".concat(wf.active ? 'bg-emerald-500' : 'bg-slate-300', " rounded-full p-1 flex ").concat(wf.active ? 'justify-end' : 'justify-start', " shadow-inner")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-2 h-2 bg-white rounded-full"
        }))));
    })))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100"
    }, /*#__PURE__*/ React.createElement(Activity, {
        className: "w-12 h-12 text-slate-200 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "Project Pulse requires a project"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 mt-1"
    }, "Select a project to see real-time performance and task visualizer."))), activeTab === "active" && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black text-slate-900 uppercase tracking-tighter"
    }, "My Active Workspaces"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsCreatingProject(true);
        },
        className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4"
    }), "NEW WORKSPACE")), isCreatingProject && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 border-2 border-indigo-500 bg-indigo-50/30 rounded-2xl mb-6"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black text-slate-900 uppercase tracking-tight mb-4"
    }, "Initialize New Workspace"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1"
    }, "Project Name"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        value: newProject.title,
        onChange: function onChange(e) {
            return setNewProject(_object_spread_props(_object_spread({}, newProject), {
                title: e.target.value
            }));
        },
        className: "w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none",
        placeholder: "e.g. Next.js SaaS Platform"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1"
    }, "Client Name"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        value: newProject.client,
        onChange: function onChange(e) {
            return setNewProject(_object_spread_props(_object_spread({}, newProject), {
                client: e.target.value
            }));
        },
        className: "w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none",
        placeholder: "e.g. Acme Corp"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1"
    }, "Workspace Type"), /*#__PURE__*/ React.createElement("select", {
        value: newProject.workspaceType,
        onChange: function onChange(e) {
            return setNewProject(_object_spread_props(_object_spread({}, newProject), {
                workspaceType: e.target.value
            }));
        },
        className: "w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
    }, /*#__PURE__*/ React.createElement("option", {
        value: "General"
    }, "General"), /*#__PURE__*/ React.createElement("option", {
        value: "Code"
    }, "Software Development"), /*#__PURE__*/ React.createElement("option", {
        value: "Design"
    }, "Graphic & UI/UX Design"), /*#__PURE__*/ React.createElement("option", {
        value: "Marketing"
    }, "Marketing & Social Media"), /*#__PURE__*/ React.createElement("option", {
        value: "Admin/VA"
    }, "Administrative / VA"), /*#__PURE__*/ React.createElement("option", {
        value: "Writing"
    }, "Writing & Content"), /*#__PURE__*/ React.createElement("option", {
        value: "Data & Automation"
    }, "Data & Automation")))), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-end gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsCreatingProject(false);
        },
        className: "px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wider"
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        onClick: handleCreateProject,
        className: "px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg"
    }, "CREATE WORKSPACE"))), projects.length > 0 ? projects.map(function(project) {
        return /*#__PURE__*/ React.createElement("div", {
            key: project.id,
            className: cn("group p-5 border rounded-xl transition-all cursor-pointer", (selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.id) === project.id ? "border-indigo-500 bg-indigo-50/50" : "border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30"),
            onClick: function onClick() {
                return setSelectedProject(project);
            }
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 rounded-lg flex items-center justify-center border border-transparent group-hover:border-indigo-100 transition-colors ".concat(project.workspaceType === "Code" ? "bg-blue-50 text-blue-600" : project.workspaceType === "Design" ? "bg-purple-50 text-purple-600" : project.workspaceType === "Marketing" ? "bg-orange-50 text-orange-600" : project.workspaceType === "Admin/VA" ? "bg-emerald-50 text-emerald-600" : project.workspaceType === "Writing" ? "bg-amber-50 text-amber-600" : project.workspaceType === "Data & Automation" ? "bg-cyan-50 text-cyan-600" : "bg-slate-50 text-slate-600")
        }, project.workspaceType === "Code" && /*#__PURE__*/ React.createElement(Github, {
            className: "w-6 h-6"
        }), project.workspaceType === "Design" && /*#__PURE__*/ React.createElement(Layout, {
            className: "w-6 h-6"
        }), project.workspaceType === "Marketing" && /*#__PURE__*/ React.createElement(BarChart3, {
            className: "w-6 h-6"
        }), project.workspaceType === "Admin/VA" && /*#__PURE__*/ React.createElement(Trello, {
            className: "w-6 h-6"
        }), project.workspaceType === "Writing" && /*#__PURE__*/ React.createElement(FileText, {
            className: "w-6 h-6"
        }), project.workspaceType === "Data & Automation" && /*#__PURE__*/ React.createElement(Zap, {
            className: "w-6 h-6"
        }), project.workspaceType === "General" && /*#__PURE__*/ React.createElement(LayoutDashboard, {
            className: "w-6 h-6"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight"
        }, project.title), (selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.id) === project.id && /*#__PURE__*/ React.createElement("span", {
            className: "bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter"
        }, "Selected")), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500 font-medium"
        }, "Client: ", /*#__PURE__*/ React.createElement("span", {
            className: "font-bold text-slate-700 uppercase tracking-tight"
        }, project.client)), /*#__PURE__*/ React.createElement(Link, {
            href: project.clientId ? "/messages?with=".concat(project.clientId) : "/messages",
            onClick: function onClick(e) {
                return e.stopPropagation();
            },
            className: "text-slate-300 hover:text-indigo-600 transition-colors",
            title: "Message ".concat(project.client)
        }, /*#__PURE__*/ React.createElement(MessageSquare, {
            className: "w-3.5 h-3.5"
        }))))), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-end gap-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-100"
        }, project.status), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-end gap-1"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider"
        }, /*#__PURE__*/ React.createElement(Lock, {
            className: "w-3 h-3"
        }), "Escrow Active"), wellnessData.currentWorkload > wellnessData.weeklyCapacity * 0.9 && /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1 text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-tighter animate-pulse"
        }, /*#__PURE__*/ React.createElement(AlertTriangle, {
            className: "w-2.5 h-2.5"
        }), "Overcommitment Risk")))), /*#__PURE__*/ React.createElement("div", {
            className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 group-hover:border-indigo-100"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-bold text-slate-400 uppercase tracking-widest"
        }, "Logged Hours"), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-bold text-slate-900"
        }, project.hoursLogged, "h / 40h")), /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-bold text-slate-400 uppercase tracking-widest"
        }, "Next Milestone"), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-bold text-slate-900"
        }, project.budget, " Due Mar 15")), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center justify-end gap-3"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick(e) {
                e.stopPropagation();
                setSelectedProject(project);
                setActiveTab("warroom");
            },
            className: "px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 uppercase tracking-wider flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement(Zap, {
            className: "w-3 h-3"
        }), "War Room"))));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(Clock, {
        className: "w-8 h-8 text-slate-300"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-900 font-bold"
    }, "No Active Projects"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm max-w-xs mx-auto mt-1"
    }, "Start applying for jobs to begin collaborating in your workspace."))), activeTab === "warroom" && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        exit: {
            opacity: 0,
            scale: 0.95
        },
        className: "space-y-6"
    }, selectedProject ? /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 rounded-2xl border border-slate-200 p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-8"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-slate-900 tracking-tight"
    }, selectedProject.title)), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 font-medium"
    }, "Collaborating with ", /*#__PURE__*/ React.createElement("span", {
        className: "text-slate-900 font-bold"
    }, selectedProject.client))), /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest"
    }, "Live War Room"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-end gap-2 mt-2"
    }, isSyncing ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Loader2, {
        className: "w-2.5 h-2.5 animate-spin text-indigo-600"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-indigo-600 font-bold uppercase tracking-widest"
    }, "Syncing to DB...")) : /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-bold uppercase tracking-widest"
    }, "Optimistic UI Enabled")))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "md:col-span-3 space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center text-xs font-bold uppercase tracking-widest text-slate-500"
    }, /*#__PURE__*/ React.createElement("span", null, "Project Completion"), /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-600"
    }, Math.round((((_selectedProject_milestones = selectedProject.milestones) === null || _selectedProject_milestones === void 0 ? void 0 : _selectedProject_milestones.filter(function(m) {
        return m.status === 'Completed' || m.status === 'Released';
    }).length) || 0) / Math.max(((_selectedProject_milestones1 = selectedProject.milestones) === null || _selectedProject_milestones1 === void 0 ? void 0 : _selectedProject_milestones1.length) || 1, 1) * 100), "%")), /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            width: 0
        },
        animate: {
            width: "".concat((((_selectedProject_milestones2 = selectedProject.milestones) === null || _selectedProject_milestones2 === void 0 ? void 0 : _selectedProject_milestones2.filter(function(m) {
                return m.status === 'Completed' || m.status === 'Released';
            }).length) || 0) / Math.max(((_selectedProject_milestones3 = selectedProject.milestones) === null || _selectedProject_milestones3 === void 0 ? void 0 : _selectedProject_milestones3.length) || 1, 1) * 100, "%")
        },
        className: "h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-sm"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Total Budget"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xl font-black text-slate-900"
    }, selectedProject.budget))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black text-slate-900 uppercase tracking-widest"
    }, "Milestones Tracking"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-3 h-3"
    }), "Real-time Sync Active")), /*#__PURE__*/ React.createElement("div", {
        className: "grid gap-3"
    }, (selectedProject.milestones || [
        {
            id: '1',
            title: 'Initial Project Setup',
            dueDate: 'Mar 1',
            amount: 5000,
            status: 'Released'
        },
        {
            id: '2',
            title: 'Core Functionality',
            dueDate: 'Mar 15',
            amount: 10000,
            status: 'In-Progress'
        },
        {
            id: '3',
            title: 'Final Review & Handover',
            dueDate: 'Apr 1',
            amount: 5000,
            status: 'Pending'
        }
    ]).map(function(milestone) {
        return /*#__PURE__*/ React.createElement("div", {
            key: milestone.id,
            className: cn("p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden", milestone.status === 'Released' ? "bg-white border-emerald-100" : milestone.status === 'Completed' ? "bg-white border-indigo-100" : "bg-white border-slate-100 hover:border-indigo-100", isSyncing && "opacity-70")
        }, isSyncing && /*#__PURE__*/ React.createElement("div", {
            className: "absolute inset-0 bg-white/10 backdrop-blur-[1px] z-10 flex items-center justify-center pointer-events-none"
        }), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: cn("w-10 h-10 rounded-xl flex items-center justify-center transition-colors", milestone.status === 'Released' ? "bg-emerald-500 text-white" : milestone.status === 'Completed' ? "bg-indigo-500 text-white" : milestone.status === 'In-Progress' ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400")
        }, milestone.status === 'Released' ? /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-6 h-6"
        }) : milestone.status === 'Completed' ? /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-6 h-6"
        }) : milestone.status === 'In-Progress' ? /*#__PURE__*/ React.createElement(Clock, {
            className: "w-6 h-6"
        }) : /*#__PURE__*/ React.createElement(Lock, {
            className: "w-5 h-5"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "font-bold text-slate-900"
        }, milestone.title), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3 mt-0.5"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"
        }, /*#__PURE__*/ React.createElement(Clock, {
            className: "w-3 h-3"
        }), "Due ", milestone.dueDate), milestone.status === 'In-Progress' && wellnessData.currentWorkload > wellnessData.weeklyCapacity * 0.8 && /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 uppercase tracking-tighter flex items-center gap-1"
        }, /*#__PURE__*/ React.createElement(Zap, {
            className: "w-2.5 h-2.5"
        }), "Healthy Suggestion: Mar 18"), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"
        }, /*#__PURE__*/ React.createElement(DollarSign, {
            className: "w-3 h-3"
        }), "₱", milestone.amount)))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-end mr-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border", milestone.status === 'Released' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : milestone.status === 'Completed' ? "bg-indigo-50 text-indigo-700 border-indigo-100" : milestone.status === 'In-Progress' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-slate-50 text-slate-500 border-slate-100")
        }, milestone.status)), /*#__PURE__*/ React.createElement("select", {
            value: milestone.status,
            disabled: isSyncing,
            onChange: function onChange(e) {
                return handleUpdateMilestone(selectedProject.id, milestone.id, e.target.value);
            },
            className: "text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-xl px-4 py-2 hover:bg-black transition-all cursor-pointer outline-none border-none disabled:opacity-50 disabled:cursor-not-allowed"
        }, /*#__PURE__*/ React.createElement("option", {
            value: "Pending"
        }, "Pending"), /*#__PURE__*/ React.createElement("option", {
            value: "In-Progress"
        }, "In-Progress"), /*#__PURE__*/ React.createElement("option", {
            value: "Completed"
        }, "Completed"), /*#__PURE__*/ React.createElement("option", {
            value: "Released"
        }, "Released"))));
    })))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-12 h-12 text-slate-200 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "Select a project to enter War Room"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 mt-1"
    }, "Real-time collaboration is just a click away."))), activeTab === "contract" && /*#__PURE__*/ React.createElement(motion.div, {
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
    }, selectedProject ? /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 lg:grid-cols-3 gap-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "lg:col-span-2 space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white border border-slate-100 p-8 rounded-2xl shadow-sm relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-start mb-8 relative z-10"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-1 rounded uppercase tracking-widest"
    }, "Active Agreement"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded uppercase tracking-widest"
    }, "ID: CON-", (selectedProject.id || "001").slice(0, 8))), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-slate-900 tracking-tight"
    }, "Professional Services Agreement"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 mt-1"
    }, "Between ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-slate-900"
    }, "You"), " and ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold text-slate-900"
    }, selectedProject.client))), /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Total Contract Value"), /*#__PURE__*/ React.createElement("h4", {
        className: "text-2xl font-black text-emerald-600 tracking-tighter"
    }, selectedProject.budget))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50 rounded-2xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Effective Date"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-900"
    }, "Jan 12, 2024")), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50 rounded-2xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Payment Type"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-900"
    }, "Milestone-based")), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-slate-50 rounded-2xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Jurisdiction"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-bold text-slate-900"
    }, "Republic of the Philippines"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-50 border border-indigo-100 p-6 rounded-2xl relative z-10 group/audit cursor-pointer hover:bg-indigo-100/50 transition-all",
        onClick: function onClick() {
            return setShowAIClauseAudit(true);
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-5 h-5 text-white"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black text-indigo-900 uppercase tracking-tight"
    }, "AI Clause Audit"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-indigo-700 font-medium"
    }, "Last audited: Today at 2:45 PM"))), /*#__PURE__*/ React.createElement("button", {
        className: "px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-200 opacity-0 group-hover/audit:opacity-100 transition-opacity"
    }, "Re-Run Audit")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, [
        {
            title: "Intellectual Property",
            status: "Protected",
            desc: "All work product is owned by Client upon payment.",
            color: "text-emerald-600"
        },
        {
            title: "Termination Notice",
            status: "Fair (14 Days)",
            desc: "Mutual 14-day notice required for contract exit.",
            color: "text-indigo-600"
        },
        {
            title: "Liability Cap",
            status: "Secured",
            desc: "Liability limited to 100% of the total contract fee.",
            color: "text-emerald-600"
        }
    ].map(function(clause, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex items-start justify-between p-3 bg-white/60 rounded-xl border border-indigo-200/50 hover:bg-white transition-all"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", {
            className: "text-xs font-bold text-slate-900"
        }, clause.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-500 mt-0.5"
        }, clause.desc)), /*#__PURE__*/ React.createElement("span", {
            className: cn("text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-indigo-50", clause.color)
        }, clause.status));
    }))), /*#__PURE__*/ React.createElement(FileText, {
        className: "absolute -right-8 -bottom-8 w-40 h-40 text-slate-50 rotate-12"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white border border-slate-100 p-8 rounded-2xl shadow-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-6"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-black text-slate-900 tracking-tight uppercase"
    }, "Payment Schedule"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400"
    }, "Total Milestones:"), /*#__PURE__*/ React.createElement("span", {
        className: "text-sm font-black text-slate-900"
    }, (selectedProject.milestones || []).length))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, (selectedProject.milestones || []).map(function(milestone, idx) {
        return /*#__PURE__*/ React.createElement("div", {
            key: milestone.id || idx,
            className: "flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center font-black text-slate-400"
        }, "0", idx + 1), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, milestone.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 font-medium"
        }, "Due: ", milestone.dueDate))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-black text-slate-900"
        }, "₱", milestone.amount.toLocaleString()), /*#__PURE__*/ React.createElement("p", {
            className: "text-[9px] font-black text-slate-400 uppercase tracking-widest"
        }, milestone.status)), /*#__PURE__*/ React.createElement("div", {
            className: cn("w-2.5 h-2.5 rounded-full", milestone.status === 'Released' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : milestone.status === 'Completed' ? 'bg-indigo-500' : 'bg-slate-300')
        })));
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-900 rounded-2xl p-8 text-white shadow-xl"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-6"
    }, "Contract Governance"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
    }, "Request Amendment"), /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
    }, "Download PDF"), /*#__PURE__*/ React.createElement("button", {
        className: "w-full py-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
    }, "Termination Notice"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-emerald-50 border border-emerald-100 rounded-2xl p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(DollarSign, {
        className: "w-5 h-5 text-white"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-black text-emerald-900 uppercase tracking-tight"
    }, "Payout Security")), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-emerald-800 leading-relaxed mb-6"
    }, "Funds for the current milestone are ", /*#__PURE__*/ React.createElement("span", {
        className: "font-black"
    }, "Secured in TARA Escrow"), ". Payment will be released automatically upon milestone approval."), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-white/60 rounded-2xl border border-emerald-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-1"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-emerald-700 uppercase"
    }, "Escrow Status"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-emerald-600"
    }, "100% FUNDED")), /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full bg-emerald-500"
    })))))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
    }, /*#__PURE__*/ React.createElement(FileText, {
        className: "w-16 h-16 text-slate-200 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-black text-slate-900 tracking-tight"
    }, "No Contract Selected"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm mt-2 max-w-xs mx-auto"
    }, "Please select a project from the dashboard to view and manage its legal agreement."))), activeTab === "reviews" && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "space-y-6"
    }, selectedProject ? /*#__PURE__*/ React.createElement(React.Fragment, null, selectedProject.workspaceType === "Code" && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-slate-50 rounded-2xl border border-slate-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Github, {
        className: "w-5 h-5 text-slate-900"
    }), "GitHub Sync & Auto-Escrow"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-indigo-600 text-white px-2 py-1 rounded"
    }, "DEV MODE")), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-600 mb-6"
    }, 'Milestones are automatically marked as "In-Review" when code is merged into the ', /*#__PURE__*/ React.createElement("code", {
        className: "bg-slate-200 px-1 rounded"
    }, "main"), " branch."), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, [
        {
            title: "Frontend Implementation",
            status: "Merged",
            branch: "main",
            amount: "₱15,000",
            color: "bg-emerald-500"
        },
        {
            title: "API Integration",
            status: "Pending Merge",
            branch: "dev",
            amount: "₱10,000",
            color: "bg-amber-500"
        }
    ].map(function(m, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-2 h-2 rounded-full ".concat(m.color)
        }), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, m.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 font-mono"
        }, m.branch))), /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, m.amount), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-bold ".concat(m.status === 'Merged' ? 'text-emerald-600' : 'text-amber-600')
        }, m.status === 'Merged' ? '✓ ESCROW RELEASED' : 'PENDING AUTO-RELEASE')));
    }))), selectedProject.workspaceType === "Design" && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-purple-50 rounded-2xl border border-purple-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold flex items-center gap-2 text-purple-900"
    }, /*#__PURE__*/ React.createElement(Layout, {
        className: "w-5 h-5"
    }), "Design Asset Hub"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-purple-600 text-white px-2 py-1 rounded"
    }, "DESIGN MODE")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 md:grid-cols-4 gap-4"
    }, [
        'Logo_Final.svg',
        'Brand_Guide.pdf',
        'Mobile_UI.fig',
        'Banner_Ads.zip'
    ].map(function(file, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "bg-white p-4 rounded-xl border border-purple-100 flex flex-col items-center text-center group cursor-pointer hover:shadow-md transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
        }, /*#__PURE__*/ React.createElement(FileText, {
            className: "w-5 h-5 text-purple-600"
        })), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-slate-700 truncate w-full"
        }, file), /*#__PURE__*/ React.createElement("span", {
            className: "text-[8px] text-slate-400 mt-1 uppercase tracking-tighter"
        }, "Ready for Review"));
    }))), selectedProject.workspaceType === "Marketing" && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-orange-50 rounded-2xl border border-orange-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold flex items-center gap-2 text-orange-900"
    }, /*#__PURE__*/ React.createElement(BarChart3, {
        className: "w-5 h-5"
    }), "Campaign Performance Board"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-orange-600 text-white px-2 py-1 rounded"
    }, "MARKETING MODE")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-4"
    }, [
        {
            label: 'Avg. CTR',
            value: '4.2%',
            color: 'text-orange-600'
        },
        {
            label: 'Total Reach',
            value: '12.5k',
            color: 'text-orange-600'
        },
        {
            label: 'Conversions',
            value: '342',
            color: 'text-orange-600'
        }
    ].map(function(stat, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "bg-white p-4 rounded-xl border border-orange-100 text-center"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-widest"
        }, stat.label), /*#__PURE__*/ React.createElement("p", {
            className: cn("text-2xl font-black mt-1", stat.color)
        }, stat.value));
    }))), selectedProject.workspaceType === "Writing" && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-amber-50 rounded-2xl border border-amber-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold flex items-center gap-2 text-amber-900"
    }, /*#__PURE__*/ React.createElement(FileText, {
        className: "w-5 h-5"
    }), "Content Editor & SEO Audit"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-amber-600 text-white px-2 py-1 rounded"
    }, "WRITING MODE")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-4 rounded-xl border border-amber-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-3 border-b border-slate-100 pb-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-slate-600"
    }, "Draft: blog-post-v1.docx"), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded"
    }, "SEO: 92/100"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded"
    }, "Readability: Easy"))), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-400 italic"
    }, '"The future of remote work is not just about tools, but about sustainable energy management..."'))), selectedProject.workspaceType === "Admin/VA" && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-emerald-50 rounded-2xl border border-emerald-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold flex items-center gap-2 text-emerald-900"
    }, /*#__PURE__*/ React.createElement(Trello, {
        className: "w-5 h-5"
    }), "Administrative Operations Hub"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-emerald-600 text-white px-2 py-1 rounded"
    }, "ADMIN MODE")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-2"
    }, [
        {
            task: 'Schedule Board Meeting',
            due: 'Today',
            priority: 'High'
        },
        {
            task: 'Process Monthly Invoices',
            due: 'Tomorrow',
            priority: 'Medium'
        },
        {
            task: 'Email Management (Inbox Zero)',
            due: 'Ongoing',
            priority: 'Low'
        }
    ].map(function(t, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("input", {
            type: "checkbox",
            className: "rounded text-emerald-600 focus:ring-emerald-500"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-medium text-slate-700"
        }, t.task)), /*#__PURE__*/ React.createElement("span", {
            className: cn("text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter", t.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400')
        }, t.due));
    }))), selectedProject.workspaceType === "Data & Automation" && /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-cyan-50 rounded-2xl border border-cyan-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-4"
    }, /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold flex items-center gap-2 text-cyan-900"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-5 h-5"
    }), "Automation Pipelines"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-cyan-600 text-white px-2 py-1 rounded"
    }, "AUTO MODE")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, [
        {
            name: 'Lead Gen Flow',
            status: 'Running',
            success: '99.2%'
        },
        {
            name: 'Auto-Reporting',
            status: 'Scheduled',
            success: '100%'
        }
    ].map(function(p, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "p-4 bg-white rounded-xl border border-cyan-100"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center mb-2"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-xs font-bold text-slate-700"
        }, p.name), /*#__PURE__*/ React.createElement("span", {
            className: "text-[8px] font-black text-cyan-600 uppercase"
        }, p.status)), /*#__PURE__*/ React.createElement("div", {
            className: "w-full bg-slate-100 h-1 rounded-full overflow-hidden"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bg-cyan-500 h-full w-[95%]"
        })), /*#__PURE__*/ React.createElement("p", {
            className: "text-[9px] text-slate-400 mt-2 font-bold"
        }, "Uptime: ", p.success));
    }))), selectedProject.workspaceType === "General" && /*#__PURE__*/ React.createElement("div", {
        className: "p-12 text-center bg-slate-50 rounded-2xl border border-slate-200"
    }, /*#__PURE__*/ React.createElement(LayoutDashboard, {
        className: "w-12 h-12 text-slate-300 mx-auto mb-4"
    }), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-900 font-bold tracking-tight"
    }, "Standard Workspace"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm max-w-xs mx-auto mt-2"
    }, "This is a general-purpose workspace. You can use War Room and Pulse tabs for advanced project management.")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-indigo-900 rounded-2xl text-white relative overflow-hidden group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement(Code2, {
        className: "w-8 h-8 mb-4 text-indigo-300"
    }), /*#__PURE__*/ React.createElement("h5", {
        className: "font-bold mb-1"
    }, "Collaborative Sandbox"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-indigo-200 mb-4 opacity-80"
    }, "Share snippets and live previews with the client."), /*#__PURE__*/ React.createElement("button", {
        className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-bold transition-all"
    }, "Open Sandbox")), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden group"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement(Activity, {
        className: "w-8 h-8 mb-4 text-purple-300"
    }), /*#__PURE__*/ React.createElement("h5", {
        className: "font-bold mb-1"
    }, "AI Project Audit"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400 mb-4 opacity-80"
    }, "Get real-time feedback from AI on your current project progress."), /*#__PURE__*/ React.createElement("button", {
        className: "px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-700"
    }, "Run Audit")), /*#__PURE__*/ React.createElement("div", {
        className: "absolute -right-4 -bottom-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "mt-8 border-t border-slate-100 pt-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between mb-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h5", {
        className: "text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(LinkIcon, {
        className: "w-4 h-4 text-indigo-600"
    }), "Partnerships & Integrations"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1"
    }, "Connect your favorite tools to automate your workflow")), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full"
    }, "POWERED BY TARA CONNECT")), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-4"
    }, function() {
        var integrations = {
            "Data & Automation": [
                {
                    name: "n8n",
                    description: "Self-hosted workflow automation",
                    icon: Zap,
                    color: "text-orange-500",
                    bg: "bg-orange-50"
                },
                {
                    name: "Zapier",
                    description: "Connect apps and automate tasks",
                    icon: Zap,
                    color: "text-orange-600",
                    bg: "bg-orange-100"
                },
                {
                    name: "Make.com",
                    description: "Visual automation platform",
                    icon: Activity,
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                }
            ],
            "Marketing": [
                {
                    name: "HubSpot",
                    description: "CRM & Marketing tools",
                    icon: BarChart3,
                    color: "text-orange-500",
                    bg: "bg-orange-50"
                },
                {
                    name: "Mailchimp",
                    description: "Email marketing automation",
                    icon: MessageSquare,
                    color: "text-yellow-600",
                    bg: "bg-yellow-50"
                },
                {
                    name: "Meta Ads",
                    description: "Facebook & Instagram advertising",
                    icon: ExternalLink,
                    color: "text-blue-600",
                    bg: "bg-blue-50"
                }
            ],
            "Code": [
                {
                    name: "GitHub",
                    description: "Source control & CI/CD",
                    icon: Github,
                    color: "text-slate-900",
                    bg: "bg-slate-100"
                },
                {
                    name: "Vercel",
                    description: "Deployment & Hosting",
                    icon: ExternalLink,
                    color: "text-black",
                    bg: "bg-slate-200"
                },
                {
                    name: "Railway",
                    description: "Infrastructure platform",
                    icon: Activity,
                    color: "text-indigo-600",
                    bg: "bg-indigo-50"
                }
            ],
            "Design": [
                {
                    name: "Figma",
                    description: "Collaborative interface design",
                    icon: Layout,
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                },
                {
                    name: "Canva",
                    description: "Online graphic design tool",
                    icon: Layout,
                    color: "text-cyan-500",
                    bg: "bg-cyan-50"
                },
                {
                    name: "Adobe CC",
                    description: "Creative Cloud integration",
                    icon: FileText,
                    color: "text-red-600",
                    bg: "bg-red-50"
                }
            ],
            "Admin/VA": [
                {
                    name: "Google Workspace",
                    description: "Docs, Sheets, & Calendar",
                    icon: Globe,
                    color: "text-blue-500",
                    bg: "bg-blue-50"
                },
                {
                    name: "Slack",
                    description: "Team communication",
                    icon: MessageSquare,
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                },
                {
                    name: "Notion",
                    description: "All-in-one workspace",
                    icon: FileText,
                    color: "text-slate-900",
                    bg: "bg-slate-100"
                }
            ],
            "Writing": [
                {
                    name: "WordPress",
                    description: "Content management system",
                    icon: Globe,
                    color: "text-blue-700",
                    bg: "bg-blue-50"
                },
                {
                    name: "Grammarly",
                    description: "Writing assistant",
                    icon: CheckCircle2,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50"
                },
                {
                    name: "Ghost",
                    description: "Professional publishing",
                    icon: Activity,
                    color: "text-slate-900",
                    bg: "bg-slate-50"
                }
            ],
            "General": [
                {
                    name: "Slack",
                    description: "Communication",
                    icon: MessageSquare,
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                },
                {
                    name: "Trello",
                    description: "Project management",
                    icon: Trello,
                    color: "text-blue-600",
                    bg: "bg-blue-50"
                },
                {
                    name: "Google Drive",
                    description: "Cloud storage",
                    icon: Globe,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50"
                }
            ]
        };
        var currentIntegrations = integrations[selectedProject.workspaceType] || integrations["General"];
        return currentIntegrations.map(function(app, i) {
            var isConnected = (connectedApps[(selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.id) || ""] || []).includes(app.name);
            return /*#__PURE__*/ React.createElement("div", {
                key: i,
                className: "bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group cursor-pointer"
            }, /*#__PURE__*/ React.createElement("div", {
                className: "flex items-center gap-3 mb-4"
            }, /*#__PURE__*/ React.createElement("div", {
                className: cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", app.bg)
            }, /*#__PURE__*/ React.createElement(app.icon, {
                className: cn("w-5 h-5", app.color)
            })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h6", {
                className: "text-xs font-black text-slate-900 tracking-tight"
            }, app.name), /*#__PURE__*/ React.createElement("p", {
                className: "text-[9px] text-slate-400 font-bold uppercase tracking-tighter"
            }, app.description))), /*#__PURE__*/ React.createElement("div", {
                className: "flex gap-2"
            }, /*#__PURE__*/ React.createElement("button", {
                onClick: function onClick() {
                    return handleConnect(app.name);
                },
                className: cn("flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", isConnected ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white")
            }, isConnected ? "Connected" : "Connect"), /*#__PURE__*/ React.createElement("button", {
                className: "w-10 h-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
            }, /*#__PURE__*/ React.createElement(ExternalLink, {
                className: "w-3.5 h-3.5"
            }))));
        });
    }()), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4 text-white"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black text-indigo-900 uppercase tracking-widest"
    }, "Missing an integration?"), /*#__PURE__*/ React.createElement("p", {
        className: "text-[9px] text-indigo-600 font-medium"
    }, "Request a new partnership or use our API."))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setToastMsg("Request sent! Our team will look into adding this tool.");
            setShowToast(true);
            setTimeout(function() {
                return setShowToast(false);
            }, 3000);
        },
        className: "px-4 py-1.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all"
    }, "Request Tool")))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(Layout, {
        className: "w-8 h-8 text-slate-300"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-900 font-bold"
    }, "No Active Workspace"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm max-w-xs mx-auto mt-1"
    }, "Please select a project from the dashboard to see the workspace tools."))), activeTab === "calls" && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "space-y-4"
    }, projects.length > 0 ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between p-4 bg-indigo-50 border border-indigo-100 rounded-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Video, {
        className: "w-5 h-5 text-white"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h4", {
        className: "text-sm font-bold text-indigo-900"
    }, "In-App Video Calling"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-indigo-700"
    }, "No more Zoom links. Everything stays here."))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setActiveCall(true);
        },
        className: "px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
    }, "New Call")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("h5", {
        className: "text-xs font-black text-slate-400 uppercase tracking-widest px-1"
    }, "Recent Meeting Minutes (AI Generated)"), [
        {
            title: "Sprint 4 Planning",
            date: "Today, 10:30 AM",
            notes: "Agreed on API spec; Client requested dark mode preview by Friday.",
            sentiment: "Positive"
        },
        {
            title: "Initial Discovery Call",
            date: "Feb 22, 2024",
            notes: "Budget confirmed at $1500; Project timeline: 3 months.",
            sentiment: "Neutral"
        }
    ].map(function(call, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-start mb-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement(FileText, {
            className: "w-4 h-4 text-slate-400"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-sm font-bold text-slate-900"
        }, call.title)), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ".concat(call.sentiment === "Positive" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500")
        }, call.sentiment === "Positive" ? /*#__PURE__*/ React.createElement(Smile, {
            className: "w-2.5 h-2.5"
        }) : /*#__PURE__*/ React.createElement(Meh, {
            className: "w-2.5 h-2.5"
        }), call.sentiment, " Sentiment"), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] font-bold text-slate-400"
        }, call.date))), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-600 line-clamp-2 leading-relaxed italic"
        }, '"', call.notes, '"'), /*#__PURE__*/ React.createElement("div", {
            className: "mt-3 flex justify-between items-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1.5"
        }, /*#__PURE__*/ React.createElement(Award, {
            className: "w-3 h-3 text-amber-500"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-black text-slate-400 uppercase tracking-tighter"
        }, "AI Performance Tip: "), /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-bold text-slate-500"
        }, "Fast bug resolution detected (+5 score)")), /*#__PURE__*/ React.createElement("button", {
            className: "text-[10px] font-bold text-indigo-600 hover:underline group-hover:translate-x-1 transition-transform"
        }, "Read Full Minutes →")));
    }))) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"
    }, /*#__PURE__*/ React.createElement(Video, {
        className: "w-8 h-8 text-slate-300"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "text-slate-900 font-bold"
    }, "No AI Meeting Notes"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm max-w-xs mx-auto mt-1"
    }, "Video calls and AI meeting summaries will appear here once you have active projects."))))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, projects.length > 0 ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "flex -space-x-2"
    }, projects.slice(0, 3).map(function(_, i) {
        return /*#__PURE__*/ React.createElement("div", {
            key: i,
            className: "w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-indigo-600"
        }, i + 1);
    })), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-500 uppercase"
    }, projects.length, " Active Project", projects.length > 1 ? 's' : '')) : /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-slate-400 uppercase italic tracking-wider"
    }, "Workspace Standby")), /*#__PURE__*/ React.createElement("button", {
        className: "text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
    }, "Open Full Dashboard ", /*#__PURE__*/ React.createElement(ChevronRight, {
        className: "w-4 h-4"
    }))), /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: showAIClauseAudit,
        onClose: function onClose() {
            return setShowAIClauseAudit(false);
        },
        mode: "audit-contract",
        targetData: selectedProject
    }), /*#__PURE__*/ React.createElement(AnimatePresence, null, showToast && /*#__PURE__*/ React.createElement(motion.div, {
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
        className: "fixed bottom-8 left-1/2 z-[100] w-full max-w-md px-4"
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
    }, "Partnership Sync")), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowToast(false);
        },
        className: "text-slate-500 hover:text-white transition-colors text-2xl"
    }, "\xd7")))));
}
