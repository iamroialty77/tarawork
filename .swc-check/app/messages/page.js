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
import { useState, useEffect, Suspense } from "react";
import Messaging from "../../components/Messaging";
import { ArrowLeft, LayoutDashboard, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { useSearchParams } from "next/navigation";
function MessagesContent() {
    var searchParams = useSearchParams();
    var withUserId = searchParams.get('with');
    var _useState = _sliced_to_array(useState([]), 2), conversations = _useState[0], setConversations = _useState[1];
    var _useState1 = _sliced_to_array(useState(), 2), selectedId = _useState1[0], setSelectedId = _useState1[1];
    var _useState2 = _sliced_to_array(useState([]), 2), messages = _useState2[0], setMessages = _useState2[1];
    var _useState3 = _sliced_to_array(useState(null), 2), currentUser = _useState3[0], setCurrentUser = _useState3[1];
    var _useState4 = _sliced_to_array(useState([]), 2), employerJobs = _useState4[0], setemployerJobs = _useState4[1];
    var _useState5 = _sliced_to_array(useState(true), 2), loading = _useState5[0], setLoading = _useState5[1];
    var _useState6 = _sliced_to_array(useState(null), 2), restrictionError = _useState6[0], setRestrictionError = _useState6[1];
    // 1. Fetch current user session
    useEffect(function() {
        var getUser = function getUser() {
            return _async_to_generator(function() {
                var _ref, session, _ref1, profile, _ref2, jobs;
                return _ts_generator(this, function(_state) {
                    switch(_state.label){
                        case 0:
                            return [
                                4,
                                supabase.auth.getSession()
                            ];
                        case 1:
                            _ref = _state.sent(), session = _ref.data.session;
                            if (!session) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                supabase.from('profiles').select('*').eq('id', session.user.id).single()
                            ];
                        case 2:
                            _ref1 = _state.sent(), profile = _ref1.data;
                            if (!profile) return [
                                3,
                                4
                            ];
                            setCurrentUser(profile);
                            if (!(profile.role === 'employer')) return [
                                3,
                                4
                            ];
                            return [
                                4,
                                supabase.from('jobs').select('*').eq('employer_id', session.user.id)
                            ];
                        case 3:
                            _ref2 = _state.sent(), jobs = _ref2.data;
                            if (jobs) setemployerJobs(jobs);
                            _state.label = 4;
                        case 4:
                            return [
                                2
                            ];
                    }
                });
            })();
        };
        getUser();
    }, []);
    // 2. Fetch conversations
    var fetchConversations = function fetchConversations(userId) {
        return _async_to_generator(function() {
            var _ref, data, error, formattedConversations, existingConv, _data, _this, _ref1, follow1, _ref2, follow2, isMutualFollow, _ref3, application, isTeam, _tmp, p1, p2, _ref4, newConv, createError, _ref5, otherProf, fullNewConv, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        _state.trys.push([
                            0,
                            14,
                            15,
                            16
                        ]);
                        return [
                            4,
                            supabase.from('conversations').select("\n          *,\n          participant_1_profile:profiles!participant_1(*),\n          participant_2_profile:profiles!participant_2(*)\n        ").or("participant_1.eq.".concat(userId, ",participant_2.eq.").concat(userId)).order('updated_at', {
                                ascending: false
                            })
                        ];
                    case 1:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (error) throw error;
                        return [
                            4,
                            Promise.all((data || []).map(function(conv) {
                                return _async_to_generator(function() {
                                    var otherParticipant, _ref, lastMsg;
                                    return _ts_generator(this, function(_state) {
                                        switch(_state.label){
                                            case 0:
                                                otherParticipant = conv.participant_1 === userId ? conv.participant_2_profile : conv.participant_1_profile;
                                                return [
                                                    4,
                                                    supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at', {
                                                        ascending: false
                                                    }).limit(1).single()
                                                ];
                                            case 1:
                                                _ref = _state.sent(), lastMsg = _ref.data;
                                                return [
                                                    2,
                                                    _object_spread_props(_object_spread({}, conv), {
                                                        other_participant: otherParticipant,
                                                        last_message: lastMsg || undefined
                                                    })
                                                ];
                                        }
                                    });
                                })();
                            }))
                        ];
                    case 2:
                        formattedConversations = _state.sent();
                        setConversations(formattedConversations);
                        if (!(withUserId && withUserId !== userId)) return [
                            3,
                            12
                        ];
                        // Check if conversation already exists
                        existingConv = formattedConversations.find(function(c) {
                            return c.participant_1 === withUserId || c.participant_2 === withUserId;
                        });
                        if (!existingConv) return [
                            3,
                            3
                        ];
                        setSelectedId(existingConv.id);
                        return [
                            3,
                            11
                        ];
                    case 3:
                        return [
                            4,
                            supabase.from('follows').select('*').eq('follower_id', userId).eq('following_id', withUserId).maybeSingle()
                        ];
                    case 4:
                        _ref1 = _state.sent(), follow1 = _ref1.data;
                        return [
                            4,
                            supabase.from('follows').select('*').eq('follower_id', withUserId).eq('following_id', userId).maybeSingle()
                        ];
                    case 5:
                        _ref2 = _state.sent(), follow2 = _ref2.data;
                        isMutualFollow = follow1 && follow2;
                        return [
                            4,
                            supabase.from('applications').select('freelancer_id, jobs(employer_id)').or("and(freelancer_id.eq.".concat(userId, ",jobs.employer_id.eq.").concat(withUserId, "),and(freelancer_id.eq.").concat(withUserId, ",jobs.employer_id.eq.").concat(userId, ")")).maybeSingle()
                        ];
                    case 6:
                        _ref3 = _state.sent(), application = _ref3.data;
                        _tmp = (currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) === 'employer';
                        if (!_tmp) return [
                            3,
                            8
                        ];
                        return [
                            4,
                            supabase.from('profiles').select('role').eq('id', withUserId).maybeSingle()
                        ];
                    case 7:
                        _tmp = ((_this = _state.sent()) === null || _this === void 0 ? void 0 : (_data = _this.data) === null || _data === void 0 ? void 0 : _data.role) === 'employer';
                        _state.label = 8;
                    case 8:
                        isTeam = _tmp;
                        if (!isMutualFollow && !application && !isTeam) {
                            setRestrictionError("You can only message people you mutually follow, or employers/freelancers who have an active project with you.");
                            return [
                                2
                            ];
                        }
                        // Create new conversation
                        p1 = userId < withUserId ? userId : withUserId;
                        p2 = userId < withUserId ? withUserId : userId;
                        return [
                            4,
                            supabase.from('conversations').upsert({
                                participant_1: p1,
                                participant_2: p2,
                                updated_at: new Date().toISOString()
                            }, {
                                onConflict: 'participant_1,participant_2'
                            }).select().single()
                        ];
                    case 9:
                        _ref4 = _state.sent(), newConv = _ref4.data, createError = _ref4.error;
                        if (!(!createError && newConv)) return [
                            3,
                            11
                        ];
                        return [
                            4,
                            supabase.from('profiles').select('*').eq('id', withUserId).single()
                        ];
                    case 10:
                        _ref5 = _state.sent(), otherProf = _ref5.data;
                        fullNewConv = _object_spread_props(_object_spread({}, newConv), {
                            other_participant: otherProf,
                            last_message: undefined
                        });
                        setConversations(function(prev) {
                            return [
                                fullNewConv
                            ].concat(_to_consumable_array(prev));
                        });
                        setSelectedId(newConv.id);
                        _state.label = 11;
                    case 11:
                        return [
                            3,
                            13
                        ];
                    case 12:
                        if (formattedConversations.length > 0 && !selectedId) {
                            setSelectedId(formattedConversations[0].id);
                        }
                        _state.label = 13;
                    case 13:
                        return [
                            3,
                            16
                        ];
                    case 14:
                        err = _state.sent();
                        console.error("Error fetching conversations:", err);
                        return [
                            3,
                            16
                        ];
                    case 15:
                        setLoading(false);
                        return [
                            7
                        ];
                    case 16:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    useEffect(function() {
        var userId = currentUser === null || currentUser === void 0 ? void 0 : currentUser.id;
        if (userId) {
            fetchConversations(userId);
            // Subscribe to global message changes to update conversation list
            var channel = supabase.channel('global-messages').on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages'
            }, function() {
                fetchConversations(userId);
            }).subscribe();
            return function() {
                supabase.removeChannel(channel);
            };
        }
    }, [
        currentUser,
        withUserId
    ]);
    // 4. Fetch messages when conversation selected
    useEffect(function() {
        if (selectedId) {
            var fetchMessages = function fetchMessages() {
                return _async_to_generator(function() {
                    var _ref, data, error;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    4,
                                    supabase.from('messages').select('*').eq('conversation_id', selectedId).order('created_at', {
                                        ascending: true
                                    })
                                ];
                            case 1:
                                _ref = _state.sent(), data = _ref.data, error = _ref.error;
                                if (!(!error && data)) return [
                                    3,
                                    3
                                ];
                                setMessages(data);
                                if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    supabase.from('messages').update({
                                        is_read: true
                                    }).eq('conversation_id', selectedId).neq('sender_id', currentUser.id)
                                ];
                            case 2:
                                _state.sent();
                                _state.label = 3;
                            case 3:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            };
            fetchMessages();
            // Subscribe to real-time messages
            var channel = supabase.channel("messages:".concat(selectedId)).on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: "conversation_id=eq.".concat(selectedId)
            }, function(payload) {
                return _async_to_generator(function() {
                    var newMessage;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                newMessage = payload.new;
                                setMessages(function(prev) {
                                    // Avoid duplicate messages if already added locally
                                    if (prev.find(function(m) {
                                        return m.id === newMessage.id;
                                    })) return prev;
                                    return _to_consumable_array(prev).concat([
                                        newMessage
                                    ]);
                                });
                                if (!((currentUser === null || currentUser === void 0 ? void 0 : currentUser.id) && newMessage.sender_id !== currentUser.id)) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    supabase.from('messages').update({
                                        is_read: true
                                    }).eq('id', newMessage.id)
                                ];
                            case 1:
                                _state.sent();
                                _state.label = 2;
                            case 2:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }).subscribe();
            return function() {
                supabase.removeChannel(channel);
            };
        }
    }, [
        selectedId,
        currentUser === null || currentUser === void 0 ? void 0 : currentUser.id
    ]);
    var handleSend = function handleSend(convId, content, attachment, offer_data) {
        return _async_to_generator(function() {
            var newMessage, _ref, data, error, err;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!(currentUser === null || currentUser === void 0 ? void 0 : currentUser.id)) return [
                            2
                        ];
                        newMessage = {
                            conversation_id: convId,
                            sender_id: currentUser.id,
                            content: content,
                            is_read: false,
                            created_at: new Date().toISOString()
                        };
                        if (attachment) {
                            newMessage.attachment_url = attachment.url;
                            newMessage.attachment_name = attachment.name;
                            newMessage.attachment_type = attachment.type;
                        }
                        if (offer_data) {
                            newMessage.offer_data = offer_data;
                        }
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            4,
                            ,
                            5
                        ]);
                        return [
                            4,
                            supabase.from('messages').insert([
                                newMessage
                            ]).select().single()
                        ];
                    case 2:
                        _ref = _state.sent(), data = _ref.data, error = _ref.error;
                        if (error) throw error;
                        // Local update for instant feedback
                        setMessages(function(prev) {
                            if (prev.find(function(m) {
                                return m.id === data.id;
                            })) return prev;
                            return _to_consumable_array(prev).concat([
                                data
                            ]);
                        });
                        // Update conversation timestamp in the database
                        return [
                            4,
                            supabase.from('conversations').update({
                                updated_at: new Date().toISOString()
                            }).eq('id', convId)
                        ];
                    case 3:
                        _state.sent();
                        // Update the conversation list locally to move it to the top and update the last message
                        setConversations(function(prev) {
                            var otherConvs = prev.filter(function(c) {
                                return c.id !== convId;
                            });
                            var targetConv = prev.find(function(c) {
                                return c.id === convId;
                            });
                            if (targetConv) {
                                var updatedConv = _object_spread_props(_object_spread({}, targetConv), {
                                    last_message: data,
                                    updated_at: new Date().toISOString()
                                });
                                return [
                                    updatedConv
                                ].concat(_to_consumable_array(otherConvs));
                            }
                            return prev;
                        });
                        return [
                            3,
                            5
                        ];
                    case 4:
                        err = _state.sent();
                        console.error("Error sending message:", err);
                        return [
                            3,
                            5
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    if (restrictionError) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-center justify-center h-screen bg-slate-950 p-6 text-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4"
        }, /*#__PURE__*/ React.createElement(Loader2, {
            className: "w-8 h-8 text-red-500"
        })), /*#__PURE__*/ React.createElement("h2", {
            className: "text-xl font-bold text-white mb-2"
        }, "Messaging Restricted"), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-400 max-w-md mb-6"
        }, restrictionError), /*#__PURE__*/ React.createElement(Link, {
            href: "/",
            className: "px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        }, "Back to Dashboard"));
    }
    if (loading) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "min-h-screen bg-slate-50 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-center gap-4"
        }, /*#__PURE__*/ React.createElement(Loader2, {
            className: "w-12 h-12 text-indigo-600 animate-spin"
        }), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-500 font-bold uppercase tracking-widest text-xs"
        }, "Loading Inbox...")));
    }
    if (!currentUser) {
        return /*#__PURE__*/ React.createElement("div", {
            className: "min-h-screen bg-slate-50 flex items-center justify-center p-4"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm"
        }, /*#__PURE__*/ React.createElement("h2", {
            className: "text-xl font-bold text-slate-900 mb-2"
        }, "Access Denied"), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-500 mb-6"
        }, "Please make sure you are logged in to view your inbox."), /*#__PURE__*/ React.createElement(Link, {
            href: "/auth",
            className: "inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold"
        }, "Go to Login")));
    }
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-slate-50 p-4 md:p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-6xl mx-auto space-y-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-between"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-bold text-sm"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4"
    }), "Back to Marketplace"), /*#__PURE__*/ React.createElement("h1", {
        className: "text-2xl font-black text-slate-900 hidden md:block"
    }, "Inbox"), /*#__PURE__*/ React.createElement("div", {
        className: "w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400"
    }, /*#__PURE__*/ React.createElement(LayoutDashboard, {
        className: "w-5 h-5"
    }))), /*#__PURE__*/ React.createElement(Messaging, {
        conversations: conversations,
        currentUser: currentUser,
        messages: messages,
        selectedConversationId: selectedId,
        onSelectConversation: setSelectedId,
        onSendMessage: handleSend,
        employerJobs: employerJobs
    })));
}
export default function MessagesPage() {
    return /*#__PURE__*/ React.createElement(Suspense, {
        fallback: /*#__PURE__*/ React.createElement("div", {
            className: "min-h-screen bg-slate-50 flex items-center justify-center"
        }, /*#__PURE__*/ React.createElement("div", {
            className: "flex flex-col items-center gap-4"
        }, /*#__PURE__*/ React.createElement(Loader2, {
            className: "w-12 h-12 text-indigo-600 animate-spin"
        }), /*#__PURE__*/ React.createElement("p", {
            className: "text-slate-500 font-bold uppercase tracking-widest text-xs"
        }, "Loading Inbox...")))
    }, /*#__PURE__*/ React.createElement(MessagesContent, null));
}
