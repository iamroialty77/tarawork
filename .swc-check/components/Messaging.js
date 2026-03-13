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
import { useState, useEffect, useRef } from "react";
import { Send, Search, MoreVertical, Phone, Video, Check, CheckCheck, User as UserIcon, ArrowLeft, Paperclip, Image as ImageIcon, FileText, X, Briefcase, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "../lib/supabase";
export default function Messaging(param) {
    var conversations = param.conversations, currentUser = param.currentUser, onSendMessage = param.onSendMessage, onSelectConversation = param.onSelectConversation, selectedConversationId = param.selectedConversationId, messages = param.messages, _param_employerJobs = param.employerJobs, employerJobs = _param_employerJobs === void 0 ? [] : _param_employerJobs;
    var _selectedConversation_other_participant, _selectedConversation_other_participant1, _selectedConversation_other_participant2, _selectedConversation_other_participant3;
    var _useState = _sliced_to_array(useState(""), 2), messageInput = _useState[0], setMessageInput = _useState[1];
    var _useState1 = _sliced_to_array(useState(true), 2), showMobileList = _useState1[0], setShowMobileList = _useState1[1];
    var _useState2 = _sliced_to_array(useState(false), 2), isUploading = _useState2[0], setIsUploading = _useState2[1];
    var _useState3 = _sliced_to_array(useState(null), 2), selectedFile = _useState3[0], setSelectedFile = _useState3[1];
    var _useState4 = _sliced_to_array(useState(false), 2), showOfferModal = _useState4[0], setShowOfferModal = _useState4[1];
    var fileInputRef = useRef(null);
    var scrollRef = useRef(null);
    var selectedConversation = conversations.find(function(c) {
        return c.id === selectedConversationId;
    });
    useEffect(function() {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [
        messages,
        selectedConversationId
    ]);
    var handleSend = function handleSend() {
        return _async_to_generator(function() {
            var attachment, fileExt, fileName, filePath, _ref, uploadError, data, error;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!((messageInput.trim() || selectedFile) && selectedConversationId)) return [
                            3,
                            5
                        ];
                        if (!selectedFile) return [
                            3,
                            4
                        ];
                        setIsUploading(true);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        // Create a unique file name to avoid collisions
                        fileExt = selectedFile.name.split('.').pop();
                        fileName = "".concat(Date.now(), "-").concat(Math.random().toString(36).substring(2), ".").concat(fileExt);
                        filePath = "".concat(currentUser.id, "/").concat(fileName);
                        return [
                            4,
                            supabase.storage.from('attachments').upload(filePath, selectedFile, {
                                cacheControl: '3600',
                                upsert: false
                            })
                        ];
                    case 2:
                        _ref = _state.sent(), uploadError = _ref.error;
                        if (uploadError) throw uploadError;
                        data = supabase.storage.from('attachments').getPublicUrl(filePath).data;
                        if (!(data === null || data === void 0 ? void 0 : data.publicUrl)) throw new Error("Could not get public URL");
                        attachment = {
                            url: data.publicUrl,
                            name: selectedFile.name,
                            type: selectedFile.type
                        };
                        return [
                            3,
                            4
                        ];
                    case 3:
                        error = _state.sent();
                        alert("Error uploading file: " + error.message);
                        setIsUploading(false);
                        return [
                            2
                        ];
                    case 4:
                        onSendMessage(selectedConversationId, messageInput.trim(), attachment);
                        setMessageInput("");
                        setSelectedFile(null);
                        setIsUploading(false);
                        _state.label = 5;
                    case 5:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleAttachOffer = function handleAttachOffer(job) {
        if (selectedConversationId) {
            onSendMessage(selectedConversationId, "I'd like to offer you a project: ".concat(job.title), undefined, job);
            setShowOfferModal(false);
        }
    };
    var onFileChange = function onFileChange(e) {
        var _e_target_files;
        var file = (_e_target_files = e.target.files) === null || _e_target_files === void 0 ? void 0 : _e_target_files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                alert("File size exceeds 50MB limit.");
                return;
            }
            setSelectedFile(file);
        }
    };
    var handleSelect = function handleSelect(id) {
        onSelectConversation(id);
        setShowMobileList(false);
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "flex h-[600px] bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "".concat(showMobileList ? 'flex' : 'hidden', " md:flex flex-col w-full md:w-80 border-r border-slate-100")
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-5 border-b border-slate-50"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-xl font-black text-slate-900 mb-4"
    }, "Messages"), /*#__PURE__*/ React.createElement("div", {
        className: "relative"
    }, /*#__PURE__*/ React.createElement(Search, {
        className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Search conversations...",
        className: "w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 overflow-y-auto p-2 space-y-1"
    }, conversations.map(function(conv) {
        var _conv_other_participant, _conv_other_participant1, _conv_last_message, _conv_last_message1, _conv_last_message2;
        return /*#__PURE__*/ React.createElement("button", {
            key: conv.id,
            onClick: function onClick() {
                return handleSelect(conv.id);
            },
            className: "w-full flex items-center gap-3 p-3 rounded-2xl transition-all ".concat(selectedConversationId === conv.id ? "bg-indigo-50" : "hover:bg-slate-50")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "relative shrink-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200"
        }, ((_conv_other_participant = conv.other_participant) === null || _conv_other_participant === void 0 ? void 0 : _conv_other_participant.avatar_url) ? /*#__PURE__*/ React.createElement("img", {
            src: conv.other_participant.avatar_url,
            className: "w-full h-full object-cover",
            alt: ""
        }) : /*#__PURE__*/ React.createElement("div", {
            className: "w-full h-full flex items-center justify-center text-slate-300"
        }, /*#__PURE__*/ React.createElement(UserIcon, {
            className: "w-6 h-6"
        }))), /*#__PURE__*/ React.createElement("div", {
            className: "absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 text-left min-w-0"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-baseline mb-0.5"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-slate-900 truncate text-sm"
        }, ((_conv_other_participant1 = conv.other_participant) === null || _conv_other_participant1 === void 0 ? void 0 : _conv_other_participant1.name) || "Unknown User"), /*#__PURE__*/ React.createElement("span", {
            className: "text-[10px] text-slate-400 font-medium shrink-0"
        }, conv.last_message ? format(new Date(conv.last_message.created_at), 'h:mm a') : "")), /*#__PURE__*/ React.createElement("p", {
            className: "text-xs truncate ".concat(((_conv_last_message = conv.last_message) === null || _conv_last_message === void 0 ? void 0 : _conv_last_message.is_read) === false && conv.last_message.sender_id !== currentUser.id ? "font-black text-indigo-600" : "text-slate-500")
        }, ((_conv_last_message1 = conv.last_message) === null || _conv_last_message1 === void 0 ? void 0 : _conv_last_message1.sender_id) === currentUser.id ? "You: " : "", ((_conv_last_message2 = conv.last_message) === null || _conv_last_message2 === void 0 ? void 0 : _conv_last_message2.content) || "No messages yet")));
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "".concat(!showMobileList ? 'flex' : 'hidden', " md:flex flex-1 flex-col bg-slate-50/50")
    }, selectedConversation ? /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white p-4 border-b border-slate-100 flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowMobileList(true);
        },
        className: "md:hidden p-2 -ml-2 text-slate-500"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0"
    }, ((_selectedConversation_other_participant = selectedConversation.other_participant) === null || _selectedConversation_other_participant === void 0 ? void 0 : _selectedConversation_other_participant.avatar_url) ? /*#__PURE__*/ React.createElement("img", {
        src: selectedConversation.other_participant.avatar_url,
        className: "w-full h-full object-cover",
        alt: ""
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "w-full h-full flex items-center justify-center text-slate-300"
    }, /*#__PURE__*/ React.createElement(UserIcon, {
        className: "w-5 h-5"
    }))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("h3", {
        className: "font-bold text-slate-900 text-sm leading-tight"
    }, (_selectedConversation_other_participant1 = selectedConversation.other_participant) === null || _selectedConversation_other_participant1 === void 0 ? void 0 : _selectedConversation_other_participant1.name), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-green-500 font-bold uppercase tracking-wider"
    }, "Active Now"), /*#__PURE__*/ React.createElement("span", {
        className: "w-1 h-1 rounded-full bg-slate-300"
    }), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400 font-bold uppercase tracking-wider"
    }, ((_selectedConversation_other_participant2 = selectedConversation.other_participant) === null || _selectedConversation_other_participant2 === void 0 ? void 0 : _selectedConversation_other_participant2.role) === 'employer' ? 'Employer' : 'Freelancer')))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-1"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
    }, /*#__PURE__*/ React.createElement(Phone, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("button", {
        className: "p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
    }, /*#__PURE__*/ React.createElement(Video, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("button", {
        className: "p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
    }, /*#__PURE__*/ React.createElement(MoreVertical, {
        className: "w-5 h-5"
    })))), /*#__PURE__*/ React.createElement("div", {
        ref: scrollRef,
        className: "flex-1 overflow-y-auto p-4 space-y-4"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex flex-col items-center py-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-3"
    }, /*#__PURE__*/ React.createElement(UserIcon, {
        className: "w-8 h-8 text-slate-200"
    })), /*#__PURE__*/ React.createElement("h4", {
        className: "font-bold text-slate-900"
    }, (_selectedConversation_other_participant3 = selectedConversation.other_participant) === null || _selectedConversation_other_participant3 === void 0 ? void 0 : _selectedConversation_other_participant3.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-500 mt-1"
    }, "You're connected on Tara Marketplace")), messages.map(function(msg, idx) {
        var _msg_attachment_type;
        var isMe = msg.sender_id === currentUser.id;
        return /*#__PURE__*/ React.createElement("div", {
            key: msg.id,
            className: "flex ".concat(isMe ? "justify-end" : "justify-start")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ".concat(isMe ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-slate-900 rounded-bl-none shadow-sm border border-slate-100")
        }, msg.offer_data && /*#__PURE__*/ React.createElement("div", {
            className: "mb-3 p-3 rounded-xl border ".concat(isMe ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200")
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-2 mb-2"
        }, /*#__PURE__*/ React.createElement(Briefcase, {
            className: "w-4 h-4 ".concat(isMe ? "text-indigo-200" : "text-indigo-600")
        }), /*#__PURE__*/ React.createElement("span", {
            className: "font-bold uppercase tracking-widest text-[10px]"
        }, "Project Offer")), /*#__PURE__*/ React.createElement("h5", {
            className: "font-bold mb-1"
        }, msg.offer_data.title), /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] line-clamp-2 mb-3 ".concat(isMe ? "text-indigo-100" : "text-slate-500")
        }, msg.offer_data.description), /*#__PURE__*/ React.createElement("div", {
            className: "flex justify-between items-center"
        }, /*#__PURE__*/ React.createElement("span", {
            className: "font-bold text-xs"
        }, msg.offer_data.rate), /*#__PURE__*/ React.createElement("button", {
            className: "px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ".concat(isMe ? "bg-white text-indigo-600 hover:bg-indigo-50" : "bg-indigo-600 text-white hover:bg-indigo-700")
        }, "View Details"))), msg.attachment_url && /*#__PURE__*/ React.createElement("div", {
            className: "mb-2 p-2 rounded-xl border ".concat(isMe ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200")
        }, ((_msg_attachment_type = msg.attachment_type) === null || _msg_attachment_type === void 0 ? void 0 : _msg_attachment_type.startsWith('image/')) ? /*#__PURE__*/ React.createElement("img", {
            src: msg.attachment_url,
            alt: msg.attachment_name,
            className: "max-w-full rounded-lg h-auto max-h-48 object-cover cursor-pointer",
            onClick: function onClick() {
                return window.open(msg.attachment_url, '_blank');
            }
        }) : /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "p-2 rounded-lg ".concat(isMe ? "bg-white/20" : "bg-white border border-slate-200")
        }, /*#__PURE__*/ React.createElement(FileText, {
            className: "w-5 h-5 text-indigo-500"
        })), /*#__PURE__*/ React.createElement("div", {
            className: "flex-1 min-w-0"
        }, /*#__PURE__*/ React.createElement("p", {
            className: "text-[11px] font-bold truncate"
        }, msg.attachment_name), /*#__PURE__*/ React.createElement("p", {
            className: "text-[9px] opacity-60"
        }, "PDF/Document")), /*#__PURE__*/ React.createElement("button", {
            onClick: function onClick() {
                return window.open(msg.attachment_url, '_blank');
            },
            className: "p-1.5 rounded-lg transition-all ".concat(isMe ? "hover:bg-white/20" : "hover:bg-slate-100")
        }, /*#__PURE__*/ React.createElement(Download, {
            className: "w-4 h-4"
        })))), /*#__PURE__*/ React.createElement("p", {
            className: "leading-relaxed whitespace-pre-wrap"
        }, msg.content), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-1 mt-1 ".concat(isMe ? "justify-end" : "justify-start")
        }, /*#__PURE__*/ React.createElement("span", {
            className: "text-[9px] ".concat(isMe ? "text-indigo-200" : "text-slate-400")
        }, format(new Date(msg.created_at), 'h:mm a')), isMe && (msg.is_read ? /*#__PURE__*/ React.createElement(CheckCheck, {
            className: "w-3 h-3 text-indigo-200"
        }) : /*#__PURE__*/ React.createElement(Check, {
            className: "w-3 h-3 text-indigo-200"
        })))));
    })), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 bg-white border-t border-slate-100"
    }, !selectedFile && !messageInput && /*#__PURE__*/ React.createElement("div", {
        className: "flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar"
    }, [
        "Hello! Are you available?",
        "When is the deadline?",
        "Can I see the details?",
        "I am interested in this project.",
        "Thank you!"
    ].map(function(suggestion) {
        return /*#__PURE__*/ React.createElement("button", {
            key: suggestion,
            onClick: function onClick() {
                return setMessageInput(suggestion);
            },
            className: "whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
        }, suggestion);
    })), selectedFile && /*#__PURE__*/ React.createElement("div", {
        className: "mb-3 p-2 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-1.5 bg-white border border-slate-200 rounded-lg"
    }, selectedFile.type.startsWith('image/') ? /*#__PURE__*/ React.createElement(ImageIcon, {
        className: "w-4 h-4 text-indigo-500"
    }) : /*#__PURE__*/ React.createElement(FileText, {
        className: "w-4 h-4 text-indigo-500"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "min-w-0"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs font-bold truncate max-w-[200px]"
    }, selectedFile.name), /*#__PURE__*/ React.createElement("p", {
        className: "text-[10px] text-slate-400"
    }, (selectedFile.size / (1024 * 1024)).toFixed(2), " MB"))), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setSelectedFile(null);
        },
        className: "p-1 hover:bg-slate-200 rounded-full transition-colors"
    }, /*#__PURE__*/ React.createElement(X, {
        className: "w-4 h-4 text-slate-400"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center gap-2"
    }, /*#__PURE__*/ React.createElement("input", {
        type: "file",
        ref: fileInputRef,
        className: "hidden",
        onChange: onFileChange
    }), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            var _fileInputRef_current;
            return (_fileInputRef_current = fileInputRef.current) === null || _fileInputRef_current === void 0 ? void 0 : _fileInputRef_current.click();
        },
        className: "p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
    }, /*#__PURE__*/ React.createElement(Paperclip, {
        className: "w-5 h-5"
    })), currentUser.role === 'employer' && /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowOfferModal(true);
        },
        className: "p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all",
        title: "Send Project Offer"
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: "w-5 h-5"
    })), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Write a message...",
        value: messageInput,
        onChange: function onChange(e) {
            return setMessageInput(e.target.value);
        },
        onKeyPress: function onKeyPress(e) {
            return e.key === "Enter" && !isUploading && handleSend();
        },
        className: "flex-1 bg-slate-100 border-none rounded-full px-5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all text-slate-900"
    }), /*#__PURE__*/ React.createElement("button", {
        onClick: handleSend,
        disabled: !messageInput.trim() && !selectedFile || isUploading,
        className: "p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center min-w-[40px]"
    }, isUploading ? /*#__PURE__*/ React.createElement(Loader2, {
        className: "w-5 h-5 animate-spin"
    }) : /*#__PURE__*/ React.createElement(Send, {
        className: "w-5 h-5"
    })))), showOfferModal && /*#__PURE__*/ React.createElement("div", {
        className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-6 border-b border-slate-100 flex justify-between items-center"
    }, /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-black text-slate-900"
    }, "Select Job to Offer"), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setShowOfferModal(false);
        },
        className: "p-2 hover:bg-slate-50 rounded-xl transition-all"
    }, /*#__PURE__*/ React.createElement(X, {
        className: "w-5 h-5 text-slate-400"
    }))), /*#__PURE__*/ React.createElement("div", {
        className: "p-4 max-h-[400px] overflow-y-auto space-y-2"
    }, employerJobs.length > 0 ? employerJobs.map(function(job) {
        return /*#__PURE__*/ React.createElement("button", {
            key: job.id,
            onClick: function onClick() {
                return handleAttachOffer(job);
            },
            className: "w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
        }, /*#__PURE__*/ React.createElement("h4", {
            className: "font-bold text-slate-900 group-hover:text-indigo-600 transition-colors"
        }, job.title), /*#__PURE__*/ React.createElement("div", {
            className: "flex items-center gap-3 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
        }, /*#__PURE__*/ React.createElement("span", null, job.category), /*#__PURE__*/ React.createElement("span", {
            className: "w-1 h-1 rounded-full bg-slate-300"
        }), /*#__PURE__*/ React.createElement("span", {
            className: "text-emerald-600"
        }, job.rate)));
    }) : /*#__PURE__*/ React.createElement("div", {
        className: "text-center py-8"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500"
    }, "You don't have any active job postings yet."), /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            window.location.href = '/';
        },
        className: "mt-4 text-xs font-bold text-indigo-600 hover:underline"
    }, "Post a Job")))))) : /*#__PURE__*/ React.createElement("div", {
        className: "flex-1 flex flex-col items-center justify-center p-8 text-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4"
    }, /*#__PURE__*/ React.createElement(Send, {
        className: "w-10 h-10 text-indigo-200 -rotate-12"
    })), /*#__PURE__*/ React.createElement("h3", {
        className: "text-xl font-bold text-slate-900"
    }, "Your Messages"), /*#__PURE__*/ React.createElement("p", {
        className: "text-sm text-slate-500 mt-2 max-w-xs mx-auto"
    }, "Select a conversation to start chatting with your client or freelancer."))));
}
