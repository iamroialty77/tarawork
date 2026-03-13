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
import { Video, VideoOff, Mic, MicOff, PhoneOff, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export default function VideoCall(param) {
    var roomUrl = param.roomUrl, onLeave = param.onLeave, projectId = param.projectId, currentUserId = param.currentUserId;
    var _useState = _sliced_to_array(useState(false), 2), isMuted = _useState[0], setIsMuted = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), isVideoOff = _useState1[0], setIsVideoOff = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isSummarizing = _useState2[0], setIsSummarizing = _useState2[1];
    var _useState3 = _sliced_to_array(useState(false), 2), showConsent = _useState3[0], setShowConsent = _useState3[1];
    var _useState4 = _sliced_to_array(useState(null), 2), summary = _useState4[0], setSummary = _useState4[1];
    var handleSummarizeRequest = function handleSummarizeRequest() {
        setShowConsent(true);
    };
    var confirmConsent = function confirmConsent() {
        setShowConsent(false);
        handleSummarize();
    };
    var handleSummarize = function handleSummarize() {
        return _async_to_generator(function() {
            var mockTranscript, response, data, error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setIsSummarizing(true);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            4,
                            5,
                            6
                        ]);
                        // Mock transcript for demonstration
                        mockTranscript = "Client: We need the homepage done by Friday. freelancer: I can do that, but I'll need the Figma assets. Client: Okay, I'll send them over today. Let's agree on ₱5,000 for this milestone.";
                        return [
                            4,
                            fetch('/api/summarize-interview', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    transcript: mockTranscript,
                                    projectId: projectId || 'mock-project-123',
                                    participants: [
                                        'Client',
                                        'Freelancer'
                                    ],
                                    userId: currentUserId
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
                        data = _state.sent();
                        if (!response.ok) {
                            throw new Error((data === null || data === void 0 ? void 0 : data.error) || 'Summarization failed');
                        }
                        setSummary(data.summary);
                        return [
                            3,
                            6
                        ];
                    case 4:
                        error = _state.sent();
                        console.error('Summarization failed:', error);
                        return [
                            3,
                            6
                        ];
                    case 5:
                        setIsSummarizing(false);
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
    return /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-4 md:p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full max-w-5xl aspect-video bg-slate-800 rounded-2xl overflow-hidden relative shadow-2xl border border-white/5"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-2 p-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-700 rounded-2xl relative flex items-center justify-center overflow-hidden"
    }, isVideoOff ? /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 rounded-full bg-slate-600 flex items-center justify-center text-slate-400"
    }, /*#__PURE__*/ React.createElement(VideoOff, {
        className: "w-10 h-10"
    })) : /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-widest"
    }, "You (Freelancer)")), /*#__PURE__*/ React.createElement("div", {
        className: "bg-slate-700 rounded-2xl relative flex items-center justify-center overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 bg-gradient-to-tr from-slate-600 to-slate-800"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-10 h-10"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white text-xs font-bold uppercase tracking-widest"
    }, "Client (employer)"))), /*#__PURE__*/ React.createElement(AnimatePresence, null, summary && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            x: 300,
            opacity: 0
        },
        animate: {
            x: 0,
            opacity: 1
        },
        exit: {
            x: 300,
            opacity: 0
        },
        className: "absolute right-4 top-4 bottom-20 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 overflow-y-auto border border-white/20 z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2 mb-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-4 h-4"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, "AI Call Summary")), /*#__PURE__*/ React.createElement("div", {
        className: "prose prose-sm text-slate-600 leading-relaxed font-medium"
    }, summary), /*#__PURE__*/ React.createElement("div", {
        className: "mt-6 p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-2 h-2 rounded-full bg-emerald-500 animate-ping"
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-[10px] font-black text-emerald-700 uppercase tracking-widest"
    }, "Saved to Audit Logs")))), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl p-3 rounded-2xl border border-white/10"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsMuted(!isMuted);
        },
        className: "p-3 rounded-xl transition-all ".concat(isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20')
    }, isMuted ? /*#__PURE__*/ React.createElement(MicOff, {
        className: "w-5 h-5"
    }) : /*#__PURE__*/ React.createElement(Mic, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setIsVideoOff(!isVideoOff);
        },
        className: "p-3 rounded-xl transition-all ".concat(isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20')
    }, isVideoOff ? /*#__PURE__*/ React.createElement(VideoOff, {
        className: "w-5 h-5"
    }) : /*#__PURE__*/ React.createElement(Video, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "w-px h-8 bg-white/10 mx-2"
    }), /*#__PURE__*/ React.createElement("button", {
        onClick: handleSummarizeRequest,
        disabled: isSummarizing || summary !== null,
        className: "flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
    }, isSummarizing ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Loader2, {
        className: "w-4 h-4 animate-spin"
    }), "Summarizing...") : /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-4 h-4"
    }), "AI Summary")), /*#__PURE__*/ React.createElement("button", {
        onClick: onLeave,
        className: "p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg shadow-red-500/20"
    }, /*#__PURE__*/ React.createElement(PhoneOff, {
        className: "w-5 h-5"
    })))), /*#__PURE__*/ React.createElement(AnimatePresence, null, showConsent && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[110] flex items-center justify-center p-4"
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
            return setShowConsent(false);
        },
        className: "absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
    }), /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            scale: 0.9,
            opacity: 0
        },
        animate: {
            scale: 1,
            opacity: 1
        },
        exit: {
            scale: 0.9,
            opacity: 0
        },
        className: "relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-100"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6"
    }, /*#__PURE__*/ React.createElement(Sparkles, {
        className: "w-8 h-8"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-2xl font-black text-slate-900 mb-4 tracking-tight"
    }, "AI Transcription Consent"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600 font-medium leading-relaxed mb-6"
    }, 'To provide a summary, our AI needs to transcribe this meeting. By clicking "I Consent", you and all participants agree to the ', /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-600 font-bold"
    }, "AI Data Privacy Policy"), ". Summaries are stored securely in audit logs for dispute resolution."), /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: confirmConsent,
        className: "w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100"
    }, "I Consent, Start AI"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowConsent(false);
        },
        className: "w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold uppercase tracking-widest transition-all"
    }, "Cancel"))))), /*#__PURE__*/ React.createElement("p", {
        className: "mt-6 text-slate-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement(Shield, {
        className: "w-3 h-3"
    }), "Encrypted P2P Connection • Powered by Daily.co"));
}
function Shield(param) {
    var className = param.className;
    return /*#__PURE__*/ React.createElement("svg", {
        className: className,
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }));
}
