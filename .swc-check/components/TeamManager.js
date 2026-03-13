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
import { Users, UserPlus, ShieldCheck, Settings, MoreVertical, Lock, MessageSquare, Scale, CheckCircle2, AlertCircle, BarChart3, Info, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
export default function TeamManager(param) {
    var squad = param.squad, onCreateSquad = param.onCreateSquad, onUpdateSquad = param.onUpdateSquad;
    var _useState = _sliced_to_array(useState(false), 2), isManaging = _useState[0], setIsManaging = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), showEquityBoard = _useState1[0], setShowEquityBoard = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isCreating = _useState2[0], setIsCreating = _useState2[1];
    var _useState3 = _sliced_to_array(useState(false), 2), isAddingMember = _useState3[0], setIsAddingMember = _useState3[1];
    var _useState4 = _sliced_to_array(useState(""), 2), newMemberName = _useState4[0], setNewMemberName = _useState4[1];
    var _useState5 = _sliced_to_array(useState("Contributor"), 2), newMemberRole = _useState5[0], setNewMemberRole = _useState5[1];
    var _useState6 = _sliced_to_array(useState(""), 2), newSquadName = _useState6[0], setNewSquadName = _useState6[1];
    var _useState7 = _sliced_to_array(useState("100000"), 2), totalBudget = _useState7[0], setTotalBudget = _useState7[1]; // Standardizing to user's example
    var currentUserId = "1"; // Simulating logged in user
    var _useState8 = _sliced_to_array(useState({
        "1": true,
        "2": false,
        "3": true
    }), 2), consensuses = _useState8[0], setConsensuses = _useState8[1];
    var defaultSquad = squad || null;
    var handleAddMember = function handleAddMember() {
        if (!newMemberName || !onUpdateSquad || !defaultSquad) return;
        var newMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: newMemberName,
            role: newMemberRole,
            avatar: "",
            share: 0,
            permissions: [
                "view-only",
                "edit-tasks"
            ]
        };
        var updatedSquad = _object_spread_props(_object_spread({}, defaultSquad), {
            members: _to_consumable_array(defaultSquad.members).concat([
                newMember
            ])
        });
        onUpdateSquad(updatedSquad);
        setIsAddingMember(false);
        setNewMemberName("");
    };
    var handleCreateSquad = function handleCreateSquad() {
        if (!newSquadName || !onCreateSquad) return;
        var newSquad = {
            id: Math.random().toString(36).substr(2, 9),
            name: newSquadName,
            leadId: currentUserId,
            members: [
                {
                    id: currentUserId,
                    name: "You",
                    role: "Squad Lead",
                    share: 100,
                    avatar: "",
                    permissions: [
                        "manage-budget",
                        "add-members",
                        "edit-tasks"
                    ]
                }
            ],
            totalBudget: parseInt(totalBudget),
            status: "Active"
        };
        onCreateSquad(newSquad);
        setIsCreating(false);
        setNewSquadName("");
    };
    if (!defaultSquad) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6 p-10 text-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"
        }, /*#__PURE__*/ React.createElement(Users, {
            className: "w-8 h-8 text-slate-300"
        })), /*#__PURE__*/ React.createElement("h3", {
            className: "text-lg font-bold text-slate-900 mb-1"
        }, "No Squad Active"), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-500 max-w-xs mx-auto text-sm"
        }, "You haven't joined or created a squad yet. Squads allow you to apply for larger projects as a team."), isCreating ? /*#__PURE__*/ React.createElement("div", {
            className: "mt-8 max-w-sm mx-auto p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "text-sm font-black text-slate-900 uppercase tracking-tight mb-4"
        }, "New Squad Identity"), /*#__PURE__*/ React.createElement("div", {
            className: "space-y-4"
        }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1"
        }, "Squad Name"), /*#__PURE__*/ React.createElement("input", {
            type: "text",
            value: newSquadName,
            onChange: function onChange(e) {
                return setNewSquadName(e.target.value);
            },
            className: "w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none",
            placeholder: "e.g. Dream Team Alpha"
        })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
            className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1"
        }, "Initial Project Budget (₱)"), /*#__PURE__*/ React.createElement("input", {
            type: "number",
            value: totalBudget,
            onChange: function onChange(e) {
                return setTotalBudget(e.target.value);
            },
            className: "w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex gap-2 pt-2"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return setIsCreating(false);
            },
            className: "flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 uppercase"
        }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
            onClick: handleCreateSquad,
            className: "flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        }, "FORM SQUAD")))) : /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return setIsCreating(true);
            },
            className: "mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all"
        }, "Create a Squad"));
    }
    var isLead = defaultSquad.leadId === currentUserId;
    return /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"
    }, /*#__PURE__*/ React.createElement(Users, {
        className: "w-6 h-6 text-emerald-600"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-900"
    }, "Agency & Squad Mode"), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500"
    }, "Apply as a team and distribute budgets"))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsManaging(!isManaging);
        },
        className: "p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
    }, /*#__PURE__*/ React.createElement(Settings, {
        className: "w-5 h-5"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "p-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-end mb-6"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1"
    }, "Active Squad"), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-black text-slate-900"
    }, defaultSquad.name)), /*#__PURE__*/ React.createElement("div", {
        className: "text-right"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] block mb-1"
    }, "Squad Revenue"), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-black text-slate-900"
    }, "₱", defaultSquad.totalBudget.toLocaleString()))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, defaultSquad.members.map(function(member) {
        return /*#__PURE__*/ React.createElement("div", {
            key: member.id,
            className: "group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-100 transition-all"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500"
        }, ((member === null || member === void 0 ? void 0 : member.name) || "M").charAt(0)), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, member.name), member.id === defaultSquad.leadId && /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] font-black bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase"
        }, "Lead")), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs text-slate-500"
        }, member.role))), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-6"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "text-right"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-slate-900"
        }, member.share, "%"), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 uppercase font-bold tracking-tight"
        }, "Equity Share")), consensuses[member.id] ? /*#__PURE__*/ React.createElement("div", {
            className: "w-4 h-4 text-emerald-500",
            title: "Agreed to Budget Split"
        }, /*#__PURE__*/ React.createElement(CheckCircle2, {
            className: "w-4 h-4"
        })) : /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-4 h-4 text-amber-500 animate-pulse",
            title: "Pending Agreement"
        }, /*#__PURE__*/ React.createElement(AlertCircle, {
            className: "w-4 h-4"
        })), member.id === currentUserId && /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return setConsensuses(function(prev) {
                    return _object_spread_props(_object_spread({}, prev), _define_property({}, member.id, true));
                });
            },
            className: "px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase tracking-tight hover:bg-emerald-200"
        }, "Agree"))), /*#__PURE__*/ React.createElement("div", {
            className: "text-right hidden sm:block"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-sm font-bold text-emerald-600"
        }, "₱", (defaultSquad.totalBudget * (member.share / 100)).toLocaleString()), /*#__PURE__*/ React.createElement("p", {
            className: "text-[10px] text-slate-400 uppercase font-bold"
        }, "Payout")), /*#__PURE__*/ React.createElement(Link, {
            href: "/messages?with=".concat(member.id),
            className: "p-1.5 text-slate-300 hover:text-indigo-600 transition-colors",
            title: "Message ".concat(member.name)
        }, /*#__PURE__*/ React.createElement(MessageSquare, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement("button", {
            className: "p-1.5 text-slate-300 hover:text-slate-600 transition-colors"
        }, /*#__PURE__*/ React.createElement(MoreVertical, {
            className: "w-4 h-4"
        }))));
    }), isLead ? /*#__PURE__*/ React.createElement("div", {
        className: "pt-2 flex gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsAddingMember(true);
        },
        className: "flex-1 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-bold text-sm"
    }, /*#__PURE__*/ React.createElement(UserPlus, {
        className: "w-5 h-5"
    }), "Add Member"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowEquityBoard(!showEquityBoard);
        },
        className: "px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
    }, /*#__PURE__*/ React.createElement(Scale, {
        className: "w-5 h-5"
    }), "Review Equity")) : /*#__PURE__*/ React.createElement("div", {
        className: "w-full py-4 border-2 border-dashed border-slate-50 rounded-2xl text-slate-300 flex items-center justify-center gap-2 font-bold text-xs grayscale"
    }, /*#__PURE__*/ React.createElement(Lock, {
        className: "w-3.5 h-3.5"
    }), "Member management restricted to Lead"))), isAddingMember && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6"
    }, /*#__PURE__*/ React.createElement(UserPlus, {
        className: "w-8 h-8 text-emerald-600"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-slate-900 mb-2"
    }, "Grow Your Squad"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 text-sm mb-8 leading-relaxed"
    }, "Add a new professional to your squad. They will receive an invitation to join the current project workflow."), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-5"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2"
    }, "Member Name"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        value: newMemberName,
        onChange: function onChange(e) {
            return setNewMemberName(e.target.value);
        },
        className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all",
        placeholder: "Full name or username"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2"
    }, "Designated Role"), /*#__PURE__*/ React.createElement("select", {
        value: newMemberRole,
        onChange: function onChange(e) {
            return setNewMemberRole(e.target.value);
        },
        className: "w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none appearance-none transition-all"
    }, /*#__PURE__*/ React.createElement("option", null, "Contributor"), /*#__PURE__*/ React.createElement("option", null, "Technical Lead"), /*#__PURE__*/ React.createElement("option", null, "Quality Assurance"), /*#__PURE__*/ React.createElement("option", null, "Designer"), /*#__PURE__*/ React.createElement("option", null, "Reviewer"))), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3"
    }, /*#__PURE__*/ React.createElement(Info, {
        className: "w-5 h-5 text-blue-500 shrink-0 mt-0.5"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] text-blue-700 leading-normal"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "font-bold"
    }, "Pro Tip:"), " New members start with 0% equity. You can adjust the budget distribution in the ", /*#__PURE__*/ React.createElement("span", {
        className: "font-bold"
    }, "Equity Board"), " once they join."))), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-3 mt-8"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsAddingMember(false);
        },
        className: "flex-1 py-4 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        onClick: handleAddMember,
        disabled: !newMemberName,
        className: "flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest"
    }, "Add Member"))))), showEquityBoard && /*#__PURE__*/ React.createElement("div", {
        className: "px-6 py-6 bg-slate-50 border-t border-slate-100 animate-in slide-in-from-top duration-300"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-900 rounded-2xl p-6 text-white mb-6 relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 p-8 opacity-10"
    }, /*#__PURE__*/ React.createElement(Scale, {
        className: "w-32 h-32"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-2"
    }, /*#__PURE__*/ React.createElement(Zap, {
        className: "w-4 h-4 text-amber-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black uppercase tracking-widest text-indigo-300"
    }, "AI Equity Intelligence")), /*#__PURE__*/ React.createElement("h4", {
        className: "text-xl font-bold mb-4"
    }, "Fair-Share & Equity Audit"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-3"
    }, /*#__PURE__*/ React.createElement(BarChart3, {
        className: "w-4 h-4 text-emerald-400"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold uppercase tracking-tight"
    }, "Contribution Matrix")), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] opacity-70"
    }, "EXECUTION (Energy Cost)"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold"
    }, "72% Weight")), /*#__PURE__*/ React.createElement("div", {
        className: "w-full bg-white/10 rounded-full h-1.5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-emerald-400 h-1.5 rounded-full",
        style: {
            width: '72%'
        }
    })), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] opacity-70"
    }, "MANAGEMENT & RISK"), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold"
    }, "28% Weight")), /*#__PURE__*/ React.createElement("div", {
        className: "w-full bg-white/10 rounded-full h-1.5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-indigo-400 h-1.5 rounded-full",
        style: {
            width: '28%'
        }
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-3 bg-white/5 rounded-xl border border-white/10"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[11px] leading-relaxed italic opacity-90"
    }, '"AI Analysis suggests the ₱', defaultSquad.totalBudget.toLocaleString(), " budget distribution is **FAIR**. Lead's higher share is justified by **35% Management Overhead** and **Risk Liability**, while members' shares are aligned with **High-Energy Task Execution**.\"")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 text-[10px] font-bold text-indigo-300"
    }, /*#__PURE__*/ React.createElement(Info, {
        className: "w-3.5 h-3.5"
    }), /*#__PURE__*/ React.createElement("span", null, "Based on actual task complexity (Energy Cost) and role risk.")), /*#__PURE__*/ React.createElement("div", {
        className: "pt-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return alert("Initiating AI Mediation Protocol. All members will be notified.");
        },
        className: "w-full py-2 bg-indigo-500/20 hover:bg-indigo-500/40 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
    }, "Request AI Dispute Resolution")))))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black text-slate-400 uppercase mb-1"
    }, "Squad Consensus"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-black text-slate-900"
    }, "2/3"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg"
    }, "Pending Agreement"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black text-slate-400 uppercase mb-1"
    }, "Transparency Score"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-black text-slate-900"
    }, "98%"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg"
    }, "High Trust"))), /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] font-black text-slate-400 uppercase mb-1"
    }, "Escrow Status"), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "text-2xl font-black text-slate-900"
    }, "Secured"), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg"
    }, "Automatic")))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowEquityBoard(false);
        },
        className: "w-full py-2 text-xs font-black text-slate-400 uppercase hover:text-slate-600 tracking-widest transition-all"
    }, "Hide Equity Insights")), /*#__PURE__*/ React.createElement("div", {
        className: "px-6 py-4 bg-emerald-50 border-t border-emerald-100 flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(ShieldCheck, {
        className: "w-4 h-4 text-emerald-600"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold text-emerald-700 uppercase"
    }, "Equity Protection & Fair-Share Enabled")), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-4"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowEquityBoard(!showEquityBoard);
        },
        className: "flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 transition-all uppercase tracking-tight"
    }, /*#__PURE__*/ React.createElement(Scale, {
        className: "w-3.5 h-3.5"
    }), "Equity Audit"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return alert("Redirecting to Smart Contracts manager...");
        },
        className: "text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-tight"
    }, "MANAGE CONTRACTS"))));
}
