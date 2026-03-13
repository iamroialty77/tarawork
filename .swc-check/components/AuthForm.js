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
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, Github, Facebook, Linkedin, AlertCircle, CheckCircle2, Briefcase, Users } from "lucide-react";
import { cn } from "../lib/utils";
export default function AuthForm() {
    var _useState = _sliced_to_array(useState("login"), 2), mode = _useState[0], setMode = _useState[1];
    var _useState1 = _sliced_to_array(useState(false), 2), loading = _useState1[0], setLoading = _useState1[1];
    var _useState2 = _sliced_to_array(useState(""), 2), email = _useState2[0], setEmail = _useState2[1];
    var _useState3 = _sliced_to_array(useState(""), 2), password = _useState3[0], setPassword = _useState3[1];
    var _useState4 = _sliced_to_array(useState(""), 2), confirmPassword = _useState4[0], setConfirmPassword = _useState4[1];
    var _useState5 = _sliced_to_array(useState(""), 2), fullName = _useState5[0], setFullName = _useState5[1];
    var _useState6 = _sliced_to_array(useState("freelancer"), 2), role = _useState6[0], setRole = _useState6[1];
    var _useState7 = _sliced_to_array(useState(null), 2), error = _useState7[0], setError = _useState7[1];
    var _useState8 = _sliced_to_array(useState(null), 2), success = _useState8[0], setSuccess = _useState8[1];
    var _useState9 = _sliced_to_array(useState(false), 2), showSMTPHelp = _useState9[0], setShowSMTPHelp = _useState9[1];
    var _useState10 = _sliced_to_array(useState(null), 2), referringId = _useState10[0], setReferringId = _useState10[1];
    useEffect(function() {
        if (typeof window !== 'undefined') {
            var params = new URLSearchParams(window.location.search);
            var refId = params.get('referring_freelancer_id');
            var action = params.get('action');
            if (refId) setReferringId(refId);
            if (action === 'hire') {
                setMode('signup');
                setRole('employer');
            }
            // Check for password reset mode
            var hash = window.location.hash;
            if (hash && hash.includes('type=recovery')) {
                setMode('update_password');
            }
            var modeParam = params.get('mode');
            if (modeParam === 'update_password') {
                setMode('update_password');
            }
        }
    }, []);
    var handleSocialLogin = function handleSocialLogin(provider) {
        return _async_to_generator(function() {
            var effectiveProvider, error, err, message;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setLoading(true);
                        setError(null);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        // Set a flag to show notification on redirect back
                        sessionStorage.setItem('social_login_pending', provider);
                        // Use linkedin_oidc for newer projects as it's the standard now
                        effectiveProvider = provider === 'linkedin' ? 'linkedin_oidc' : provider;
                        return [
                            4,
                            supabase.auth.signInWithOAuth({
                                provider: effectiveProvider,
                                options: {
                                    redirectTo: "".concat(window.location.origin, "/auth/callback")
                                }
                            })
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        return [
                            3,
                            4
                        ];
                    case 3:
                        err = _state.sent();
                        console.error("Social login error:", err);
                        message = err.message || "An error occurred during social login.";
                        if (message.includes("provider is not enabled")) {
                            message = "Authentication Error: ".concat(provider, " login is not yet enabled in the Supabase Dashboard. Please go to Authentication > Providers and enable ").concat(provider, ".");
                        }
                        setError(message);
                        setLoading(false);
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    var handleAuth = function handleAuth(e) {
        return _async_to_generator(function() {
            var error, error1, _data_user_identities, _ref, error2, data, message, error3, err, message1;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        e.preventDefault();
                        setLoading(true);
                        setError(null);
                        setSuccess(null);
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            10,
                            11,
                            12
                        ]);
                        if (!(mode === "forgot_password")) return [
                            3,
                            3
                        ];
                        return [
                            4,
                            supabase.auth.resetPasswordForEmail(email, {
                                redirectTo: "".concat(window.location.origin, "/auth/callback?next=/auth?mode=update_password")
                            })
                        ];
                    case 2:
                        error = _state.sent().error;
                        if (error) throw error;
                        setSuccess("Password reset link sent! Please check your email.");
                        return [
                            2
                        ];
                    case 3:
                        if (!(mode === "update_password")) return [
                            3,
                            5
                        ];
                        if (password !== confirmPassword) {
                            setError("Passwords do not match.");
                            setLoading(false);
                            return [
                                2
                            ];
                        }
                        return [
                            4,
                            supabase.auth.updateUser({
                                password: password
                            })
                        ];
                    case 4:
                        error1 = _state.sent().error;
                        if (error1) throw error1;
                        setSuccess("Password updated successfully! You can now log in.");
                        setMode("login");
                        return [
                            2
                        ];
                    case 5:
                        if (!(mode === "signup")) return [
                            3,
                            7
                        ];
                        return [
                            4,
                            supabase.auth.signUp({
                                email: email,
                                password: password,
                                options: {
                                    data: {
                                        full_name: fullName,
                                        role: role,
                                        referring_freelancer_id: referringId,
                                        username: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
                                    },
                                    emailRedirectTo: "".concat(window.location.origin, "/auth/callback")
                                }
                            })
                        ];
                    case 6:
                        _ref = _state.sent(), error2 = _ref.error, data = _ref.data;
                        if (error2) {
                            // Explicitly check for 500 or SMTP errors in the error object
                            console.error("Signup error details:", error2);
                            message = error2.message || "An error occurred during signup.";
                            if (message.includes("Database error saving new user") || error2.status === 500) {
                                message = "Authentication Error (500): Your Supabase project has an issue with email sending or database configuration. Please check Supabase Dashboard > Authentication > Logs.";
                                setShowSMTPHelp(true);
                            } else if (message.includes("Email rate limit exceeded")) {
                                message = "Communication Bottleneck Detected: Too many email requests. The platform currently has a limit of 5 emails per hour for security purposes. Please try again after an hour.";
                                setShowSMTPHelp(true);
                            }
                            setError(message);
                            return [
                                2
                            ];
                        }
                        if ((data === null || data === void 0 ? void 0 : data.user) && ((_data_user_identities = data.user.identities) === null || _data_user_identities === void 0 ? void 0 : _data_user_identities.length) === 0) {
                            setError("This email is already registered. Try logging in or use a different email.");
                            return [
                                2
                            ];
                        }
                        setSuccess("Registration successful! Please check your email to confirm your account.");
                        return [
                            3,
                            9
                        ];
                    case 7:
                        return [
                            4,
                            supabase.auth.signInWithPassword({
                                email: email,
                                password: password
                            })
                        ];
                    case 8:
                        error3 = _state.sent().error;
                        if (error3) throw error3;
                        setSuccess("Logged in successfully!");
                        // Redirect or refresh state here if needed
                        window.location.href = "/";
                        _state.label = 9;
                    case 9:
                        return [
                            3,
                            12
                        ];
                    case 10:
                        err = _state.sent();
                        console.error("Auth error:", err);
                        message1 = err.message || "An error occurred during authentication.";
                        if (message1.includes("Email rate limit exceeded")) {
                            message1 = "System Limit Reached: Too many email requests (5 per hour limit). Please wait an hour before trying again or contact our technical team for scaling options.";
                        } else if (err.status === 500 || err.code === '500' || message1.includes("500") || message1.toLowerCase().includes("internal server error") || message1.includes("Database error")) {
                            message1 = "Security & Trust Alert: There is a technical issue with our backend configuration. We are ensuring your data remains safe while we fix this. Please check platform health in the admin dashboard.";
                        }
                        setError(message1);
                        return [
                            3,
                            12
                        ];
                    case 11:
                        setLoading(false);
                        return [
                            7
                        ];
                    case 12:
                        return [
                            2
                        ];
                }
            });
        })();
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "w-full max-w-md mx-auto"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        className: "bg-white rounded-xl shadow-2xl shadow-indigo-100/20 border border-slate-200 overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-center mb-8"
    }, /*#__PURE__*/ React.createElement("img", {
        src: "/tarawork-removebg-preview.png",
        alt: "Tara Logo",
        className: "h-12 w-auto object-contain"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "text-center mb-8"
    }, /*#__PURE__*/ React.createElement("h2", {
        className: "text-2xl font-extrabold text-slate-900"
    }, mode === "login" && "Welcome back", mode === "signup" && "Create an account", mode === "forgot_password" && "Reset Password", mode === "update_password" && "New Password"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-500 mt-2 text-sm font-medium"
    }, mode === "login" && "Enter your details to access your account.", mode === "signup" && "Join thousands of freelancers and clients today.", mode === "forgot_password" && "Enter your email to receive a reset link.", mode === "update_password" && "Enter your new password below.")), /*#__PURE__*/ React.createElement("form", {
        onSubmit: handleAuth,
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement(AnimatePresence, {
        mode: "wait"
    }, (mode === "login" || mode === "signup" || mode === "forgot_password") && /*#__PURE__*/ React.createElement(motion.div, {
        key: "email-field",
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        }
    }, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1"
    }, "Email Address"), /*#__PURE__*/ React.createElement("div", {
        className: "relative group"
    }, /*#__PURE__*/ React.createElement(Mail, {
        className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "email",
        placeholder: "juan@example.com",
        required: true,
        className: "w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-slate-900",
        value: email,
        onChange: function onChange(e) {
            return setEmail(e.target.value);
        }
    }))), mode === "signup" && /*#__PURE__*/ React.createElement(motion.div, {
        key: "signup-fields",
        initial: {
            opacity: 0,
            height: 0
        },
        animate: {
            opacity: 1,
            height: "auto"
        },
        exit: {
            opacity: 0,
            height: 0
        },
        className: "space-y-4 mb-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1"
    }, "Account Type"), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return setRole("freelancer");
        },
        className: cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2", role === "freelancer" ? "border-indigo-600 bg-indigo-50/30 text-indigo-600" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200")
    }, /*#__PURE__*/ React.createElement(Briefcase, {
        className: cn("w-6 h-6", role === "freelancer" ? "text-indigo-600" : "text-slate-400")
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold uppercase tracking-wider"
    }, "Freelancer")), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return setRole("employer");
        },
        className: cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2", role === "employer" ? "border-indigo-600 bg-indigo-50/30 text-indigo-600" : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200")
    }, /*#__PURE__*/ React.createElement(Users, {
        className: cn("w-6 h-6", role === "employer" ? "text-indigo-600" : "text-slate-400")
    }), /*#__PURE__*/ React.createElement("span", {
        className: "text-xs font-bold uppercase tracking-wider"
    }, "Employer")))), /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1"
    }, "Full Name"), /*#__PURE__*/ React.createElement("div", {
        className: "relative group"
    }, /*#__PURE__*/ React.createElement(User, {
        className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "text",
        placeholder: "Juan Dela Cruz",
        required: true,
        className: "w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-slate-900",
        value: fullName,
        onChange: function onChange(e) {
            return setFullName(e.target.value);
        }
    })))), (mode === "login" || mode === "signup" || mode === "update_password") && /*#__PURE__*/ React.createElement(motion.div, {
        key: "password-fields",
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        className: "space-y-4"
    }, /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("div", {
        className: "flex justify-between items-center mb-1.5 ml-1"
    }, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest"
    }, mode === "update_password" ? "New Password" : "Password"), mode === "login" && /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return setMode("forgot_password");
        },
        className: "text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
    }, "Forgot password?")), /*#__PURE__*/ React.createElement("div", {
        className: "relative group"
    }, /*#__PURE__*/ React.createElement(Lock, {
        className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "password",
        placeholder: "••••••••",
        required: true,
        className: "w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-slate-900",
        value: password,
        onChange: function onChange(e) {
            return setPassword(e.target.value);
        }
    }))), mode === "update_password" && /*#__PURE__*/ React.createElement("div", null, /*#__PURE__*/ React.createElement("label", {
        className: "block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1"
    }, "Confirm New Password"), /*#__PURE__*/ React.createElement("div", {
        className: "relative group"
    }, /*#__PURE__*/ React.createElement(Lock, {
        className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
    }), /*#__PURE__*/ React.createElement("input", {
        type: "password",
        placeholder: "••••••••",
        required: true,
        className: "w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all text-slate-900",
        value: confirmPassword,
        onChange: function onChange(e) {
            return setConfirmPassword(e.target.value);
        }
    }))))), error && /*#__PURE__*/ React.createElement("div", {
        className: "space-y-3"
    }, /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            x: -10
        },
        animate: {
            opacity: 1,
            x: 0
        },
        className: "flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold"
    }, /*#__PURE__*/ React.createElement(AlertCircle, {
        className: "w-4 h-4 shrink-0"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "flex-1"
    }, error), showSMTPHelp && /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return setShowSMTPHelp(!showSMTPHelp);
        },
        className: "text-[10px] underline hover:text-red-800 transition-colors"
    }, "Fix")), /*#__PURE__*/ React.createElement(AnimatePresence, null, showSMTPHelp && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            height: 0
        },
        animate: {
            opacity: 1,
            height: "auto"
        },
        exit: {
            opacity: 0,
            height: 0
        },
        className: "overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "p-4 rounded-xl bg-slate-900 text-white text-[10px] space-y-3 mb-2"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "font-bold text-indigo-400 uppercase tracking-widest text-[9px]"
    }, "\uD83D\uDCA1 Admin Tip (Supabase Fix):"), /*#__PURE__*/ React.createElement("ul", {
        className: "space-y-2 opacity-90"
    }, /*#__PURE__*/ React.createElement("li", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400 font-bold"
    }, "1."), /*#__PURE__*/ React.createElement("span", null, "Go to ", /*#__PURE__*/ React.createElement("b", null, "Authentication ", ">", " Providers ", ">", " Email"), " and disable ", /*#__PURE__*/ React.createElement("b", null, '"Confirm email"'), " for a temporary fix.")), /*#__PURE__*/ React.createElement("li", {
        className: "flex gap-2"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "text-indigo-400 font-bold"
    }, "2."), /*#__PURE__*/ React.createElement("span", null, "For production, use ", /*#__PURE__*/ React.createElement("b", null, "Custom SMTP"), " (like Resend or SendGrid) in SMTP Settings."))))))), success && /*#__PURE__*/ React.createElement(motion.div, {
        initial: {
            opacity: 0,
            x: -10
        },
        animate: {
            opacity: 1,
            x: 0
        },
        className: "flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-bold"
    }, /*#__PURE__*/ React.createElement(CheckCircle2, {
        className: "w-4 h-4 shrink-0"
    }), success), /*#__PURE__*/ React.createElement("button", {
        type: "submit",
        disabled: loading,
        className: "w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70 group"
    }, loading ? /*#__PURE__*/ React.createElement(Loader2, {
        className: "w-5 h-5 animate-spin"
    }) : /*#__PURE__*/ React.createElement(React.Fragment, null, mode === "login" && "Sign In", mode === "signup" && "Get Started", mode === "forgot_password" && "Send Reset Link", mode === "update_password" && "Update Password", /*#__PURE__*/ React.createElement(ArrowRight, {
        className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
    })))), /*#__PURE__*/ React.createElement("div", {
        className: "relative my-8"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute inset-0 flex items-center"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "w-full border-t border-slate-100"
    })), /*#__PURE__*/ React.createElement("div", {
        className: "relative flex justify-center text-xs uppercase font-bold tracking-widest"
    }, /*#__PURE__*/ React.createElement("span", {
        className: "bg-white px-4 text-slate-400"
    }, "Or continue with"))), /*#__PURE__*/ React.createElement("div", {
        className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return handleSocialLogin('google');
        },
        className: "flex items-center justify-center gap-3 w-full bg-white border border-slate-200 hover:bg-slate-50 py-3 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider transition-all"
    }, /*#__PURE__*/ React.createElement("svg", {
        className: "w-5 h-5",
        viewBox: "0 0 24 24"
    }, /*#__PURE__*/ React.createElement("path", {
        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
        fill: "#4285F4"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
        fill: "#34A853"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z",
        fill: "#FBBC05"
    }), /*#__PURE__*/ React.createElement("path", {
        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
        fill: "#EA4335"
    })), "Google"), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return handleSocialLogin('github');
        },
        className: "flex items-center justify-center gap-3 w-full bg-white border border-slate-200 hover:bg-slate-50 py-3 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider transition-all"
    }, /*#__PURE__*/ React.createElement(Github, {
        className: "w-5 h-5"
    }), "GitHub"), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return handleSocialLogin('facebook');
        },
        className: "flex items-center justify-center gap-3 w-full bg-white border border-slate-200 hover:bg-slate-50 py-3 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider transition-all"
    }, /*#__PURE__*/ React.createElement(Facebook, {
        className: "w-5 h-5 text-[#1877F2]"
    }), "Facebook"), /*#__PURE__*/ React.createElement("button", {
        type: "button",
        onClick: function onClick() {
            return handleSocialLogin('linkedin');
        },
        className: "flex items-center justify-center gap-3 w-full bg-white border border-slate-200 hover:bg-slate-50 py-3 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider transition-all"
    }, /*#__PURE__*/ React.createElement(Linkedin, {
        className: "w-5 h-5 text-[#0A66C2]"
    }), "LinkedIn"))), /*#__PURE__*/ React.createElement("div", {
        className: "p-6 bg-slate-50 border-t border-slate-100 text-center"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-sm font-medium text-slate-500"
    }, mode === "login" && /*#__PURE__*/ React.createElement(React.Fragment, null, "Don't have an account?", " ", /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setMode("signup");
        },
        className: "text-indigo-600 font-bold hover:underline"
    }, "Create one now")), mode === "signup" && /*#__PURE__*/ React.createElement(React.Fragment, null, "Already have an account?", " ", /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setMode("login");
        },
        className: "text-indigo-600 font-bold hover:underline"
    }, "Sign in instead")), (mode === "forgot_password" || mode === "update_password") && /*#__PURE__*/ React.createElement("button", {
        onClick: function onClick() {
            return setMode("login");
        },
        className: "text-indigo-600 font-bold hover:underline"
    }, "Back to Login")))));
}
