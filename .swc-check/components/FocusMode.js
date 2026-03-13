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
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, RotateCcw, CheckCircle2, Coffee, Moon, Wind } from "lucide-react";
export default function FocusMode(param) {
    var isOpen = param.isOpen, onClose = param.onClose, tasks = param.tasks;
    var _useState = _sliced_to_array(useState(50 * 60), 2), timeLeft = _useState[0], setTimeLeft = _useState[1]; // 50 minutes
    var _useState1 = _sliced_to_array(useState(false), 2), isActive = _useState1[0], setIsActive = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isBreak = _useState2[0], setIsBreak = _useState2[1];
    useEffect(function() {
        var interval;
        if (isActive && timeLeft > 0) {
            interval = setInterval(function() {
                setTimeLeft(function(prev) {
                    return prev - 1;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound or notification
            if (!isBreak) {
                alert("Time for a 10-minute break!");
                setIsBreak(true);
                setTimeLeft(10 * 60);
            } else {
                alert("Break over! Ready to focus?");
                setIsBreak(false);
                setTimeLeft(50 * 60);
            }
        }
        return function() {
            return clearInterval(interval);
        };
    }, [
        isActive,
        timeLeft,
        isBreak
    ]);
    var formatTime = function formatTime(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return "".concat(mins.toString().padStart(2, "0"), ":").concat(secs.toString().padStart(2, "0"));
    };
    return /*#__PURE__*/ React.createElement(AnimatePresence, null, isOpen && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        className: "fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col items-center justify-center p-8"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: onClose,
        className: "absolute top-8 right-8 p-2 text-slate-400 hover:text-white transition-colors"
    }, /*#__PURE__*/ React.createElement(X, {
        className: "w-8 h-8"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "max-w-2xl w-full space-y-12 text-center"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            scale: 0.9,
            opacity: 0
        },
        animate: {
            scale: 1,
            opacity: 1
        },
        transition: {
            delay: 0.2
        }
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-center gap-2 mb-4 text-indigo-400"
    }, isBreak ? /*#__PURE__*/ React.createElement(Coffee, {
        className: "w-5 h-5"
    }) : /*#__PURE__*/ React.createElement(Wind, {
        className: "w-5 h-5"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-black uppercase tracking-[0.3em]"
    }, isBreak ? "Rest & Recovery" : "Deep Work Session")), /*#__PURE__*/ React.createElement("h1", {
        className: "text-8xl font-black tracking-tighter tabular-nums"
    }, formatTime(timeLeft))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-center gap-4"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsActive(!isActive);
        },
        className: "w-20 h-20 rounded-full bg-white text-slate-950 flex items-center justify-center hover:scale-105 transition-transform"
    }, isActive ? /*#__PURE__*/ React.createElement(Pause, {
        className: "w-8 h-8"
    }) : /*#__PURE__*/ React.createElement(Play, {
        className: "w-8 h-8 fill-current ml-1"
    })), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            setIsActive(false);
            setTimeLeft(50 * 60);
            setIsBreak(false);
        },
        className: "w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
    }, /*#__PURE__*/ React.createElement(RotateCcw, {
        className: "w-5 h-5"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-6 pt-12 border-t border-white/10"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-slate-500 text-xs font-black uppercase tracking-widest"
    }, "Priority Focus"), /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, tasks.filter(function(t) {
        return !t.completed;
    }).slice(0, 3).map(function(task) {
        return /*#__PURE__*/ React.createElement("div", {
            key: task.id,
            className: "flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-6 h-6 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 transition-colors"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-lg font-medium text-slate-200"
        }, task.title));
    }), tasks.filter(function(t) {
        return !t.completed;
    }).length === 0 && /*#__PURE__*/ React.createElement("div", {
        className: "text-slate-500 font-medium py-4"
    }, "No pending tasks for this session."))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-center gap-8 pt-12 text-slate-500"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Moon, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold uppercase tracking-wider"
    }, "Do Not Disturb Active")), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-4 h-4"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-bold uppercase tracking-wider"
    }, "Auto-Tracking Time"))))));
}
