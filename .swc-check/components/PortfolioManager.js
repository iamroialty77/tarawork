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
import { useState } from "react";
import { Plus, Trash2, Briefcase, Sparkles, Brain } from "lucide-react";
import PortfolioPreview from "./PortfolioPreview";
import AIAgent from "./AIAgent";
export default function PortfolioManager(param) {
    var items = param.items, onAdd = param.onAdd, onUpdate = param.onUpdate, onRemove = param.onRemove, isOwner = param.isOwner;
    var _newItem_technologies;
    var _useState = _sliced_to_array(useState(false), 2), isAuditing = _useState[0], setIsAuditing = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isAdding = _useState1[0], setIsAdding = _useState1[1];
    var _useState2 = _sliced_to_array(useState(null), 2), editingItem = _useState2[0], setEditingItem = _useState2[1];
    var _useState3 = _sliced_to_array(useState({
        title: "",
        description: "",
        project_url: "",
        technologies: []
    }), 2), newItem = _useState3[0], setNewItem = _useState3[1];
    var _useState4 = _sliced_to_array(useState(""), 2), techInput = _useState4[0], setTechInput = _useState4[1];
    var handleAdd = function handleAdd() {
        if (editingItem && onUpdate) {
            onUpdate(_object_spread({}, editingItem, newItem));
            setEditingItem(null);
            setNewItem({
                title: "",
                description: "",
                project_url: "",
                technologies: []
            });
            setIsAdding(false);
        } else if (newItem.title) {
            onAdd(newItem);
            setNewItem({
                title: "",
                description: "",
                project_url: "",
                technologies: []
            });
            setIsAdding(false);
        }
    };
    var startEdit = function startEdit(item) {
        setEditingItem(item);
        setNewItem({
            title: item.title,
            description: item.description,
            project_url: item.project_url,
            technologies: item.technologies
        });
        setIsAdding(true);
    };
    var addTech = function addTech() {
        var _newItem_technologies;
        if (techInput && !((_newItem_technologies = newItem.technologies) === null || _newItem_technologies === void 0 ? void 0 : _newItem_technologies.includes(techInput))) {
            setNewItem(_object_spread_props(_object_spread({}, newItem), {
                technologies: _to_consumable_array(newItem.technologies || []).concat([
                    techInput
                ])
            }));
            setTechInput("");
        }
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6"
    }, /*#__PURE__*/ React.createElement(AIAgent, {
        isOpen: isAuditing,
        onClose: function onClose() {
            return setIsAuditing(false);
        },
        mode: "audit",
        targetData: items
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "text-lg font-bold text-slate-900"
    }, "Professional Portfolio"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500"
    }, "Showcase your best work.")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, isOwner && /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsAuditing(true);
        },
        className: "flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md group"
    }, /*#__PURE__*/ React.createElement(Brain, {
        className: "w-4 h-4 text-indigo-400 group-hover:animate-pulse"
    }), "Request AI Audit"), isOwner && !isAdding && /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsAdding(true);
        },
        className: "flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: "w-4 h-4"
    }), "Magdagdag"))), isAdding && /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Project Title"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900",
        value: newItem.title,
        onChange: function onChange(e) {
            return setNewItem(_object_spread_props(_object_spread({}, newItem), {
                title: e.target.value
            }));
        },
        placeholder: "Project Name"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Project URL (Optional)"), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900",
        value: newItem.project_url,
        onChange: function onChange(e) {
            return setNewItem(_object_spread_props(_object_spread({}, newItem), {
                project_url: e.target.value
            }));
        },
        placeholder: "https://..."
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Description"), /*#__PURE__*/ React.createElement("textarea", {
        className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900",
        rows: 3,
        value: newItem.description,
        onChange: function onChange(e) {
            return setNewItem(_object_spread_props(_object_spread({}, newItem), {
                description: e.target.value
            }));
        },
        placeholder: "What did you do in this project?"
    })), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1"
    }, "Technologies Used"), /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "text",
        className: "flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900",
        value: techInput,
        onChange: function onChange(e) {
            return setTechInput(e.target.value);
        },
        onKeyPress: function onKeyPress(e) {
            return e.key === "Enter" && addTech();
        },
        placeholder: "e.g. React, Node.js"
    }), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: addTech,
        className: "bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
    }, "Add")), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-wrap gap-2 mt-2"
    }, (_newItem_technologies = newItem.technologies) === null || _newItem_technologies === void 0 ? void 0 : _newItem_technologies.map(function(tech) {
        return /*#__PURE__*/ React.createElement("span", {
            key: tech,
            className: "px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600"
        }, tech);
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-end gap-2 pt-2"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setIsAdding(false);
            setEditingItem(null);
            setNewItem({
                title: "",
                description: "",
                project_url: "",
                technologies: []
            });
        },
        className: "px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
    }, "Cancel"), /*#__PURE__*/ React.createElement("button", {
        onClick: handleAdd,
        disabled: !newItem.title,
        className: "bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
    }, editingItem ? "I-update Proyekto" : "I-save Proyekto"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 gap-6"
    }, items.length === 0 && !isAdding && /*#__PURE__*/ React.createElement("div", {
        className: "col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100"
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: "w-12 h-12 text-slate-200 mx-auto mb-3"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-400 font-medium"
    }, "No portfolio items listed yet.")), items.map(function(item) {
        return /*#__PURE__*/ React.createElement("div", {
            key: item.id,
            className: "relative group"
        }, /*#__PURE__*/ React.createElement(PortfolioPreview, {
            item: item
        }), isOwner && /*#__PURE__*/ React.createElement("div", {
            className: "absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10"
        }, /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return startEdit(item);
            },
            className: "p-2 bg-white/90 backdrop-blur shadow-xl text-indigo-600 rounded-xl hover:bg-white transition-all"
        }, /*#__PURE__*/ React.createElement(Sparkles, {
            className: "w-4 h-4"
        })), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return onRemove(item.id);
            },
            className: "p-2 bg-white/90 backdrop-blur shadow-xl text-red-500 rounded-xl hover:bg-white transition-all"
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: "w-4 h-4"
        }))));
    })));
}
