function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import { NextResponse } from "next/server";
import { consumePremiumCredits } from "@/lib/credits";
var cleanJsonBlock = function cleanJsonBlock(text) {
    var fenced = text.match(/```json\s*([\s\S]*?)```/i);
    if (fenced === null || fenced === void 0 ? void 0 : fenced[1]) return fenced[1].trim();
    return text.trim();
};
var safeLevel = function safeLevel(value) {
    if (value === "Beginner" || value === "Intermediate" || value === "Advanced" || value === "Expert") {
        return value;
    }
    return "Intermediate";
};
var mapGeminiError = function mapGeminiError(status, message) {
    var msg = message.toLowerCase();
    if (status === 401 || status === 403 || msg.includes("api key not valid") || msg.includes("invalid api key")) {
        return {
            code: "invalid_key",
            message: "Gemini API key is invalid or unauthorized."
        };
    }
    if (status === 429 || msg.includes("quota") || msg.includes("rate limit")) {
        return {
            code: "quota_exceeded",
            message: "Gemini quota exceeded or rate-limited."
        };
    }
    if (status >= 500) {
        return {
            code: "provider_unavailable",
            message: "Gemini service is temporarily unavailable."
        };
    }
    return {
        code: "provider_error",
        message: "Gemini request failed (".concat(status, ").")
    };
};
var generateFallbackRoadmap = function generateFallbackRoadmap(profile, marketContext, fallbackReason) {
    var category = profile.category || "General";
    var profileSkills = (profile.skills || []).filter(Boolean);
    var missingSkills = ((marketContext === null || marketContext === void 0 ? void 0 : marketContext.missingSkills) || []).slice(0, 4);
    var focusSkills = _to_consumable_array(missingSkills).concat(_to_consumable_array(profileSkills)).filter(Boolean).slice(0, 6);
    var modules = [
        {
            id: "module-1",
            title: "Career Positioning and Goal Alignment",
            description: "Define a focused ".concat(category, " trajectory, set role targets, and align current experience with market expectations."),
            duration: "1-2 weeks",
            level: "Beginner"
        },
        {
            id: "module-2",
            title: "Core Skill Strengthening",
            description: "Build depth in critical competencies: ".concat(focusSkills.slice(0, 3).join(", ") || "category-specific core skills", "."),
            duration: "3-4 weeks",
            level: "Intermediate"
        },
        {
            id: "module-3",
            title: "Portfolio and Proof of Work Upgrade",
            description: "Create high-impact case studies with measurable outcomes tailored to your target client segment.",
            duration: "2-3 weeks",
            level: "Advanced"
        },
        {
            id: "module-4",
            title: "Advanced Delivery and Client Communication",
            description: "Improve discovery, scoping, and stakeholder communication to increase conversion and retention.",
            duration: "2 weeks",
            level: "Advanced"
        },
        {
            id: "module-5",
            title: "Specialization and Premium Positioning",
            description: "Package your expertise into premium service offers and prepare for higher-value engagements.",
            duration: "2-4 weeks",
            level: "Expert"
        }
    ];
    return {
        roadmapId: "RD-".concat(Math.random().toString(36).slice(2, 7).toUpperCase()),
        status: "Unlocked",
        nextMilestone: modules[0].title,
        summary: "Professional roadmap prepared for ".concat(category, ". The sequence prioritizes skill depth, stronger portfolio evidence, and clear market positioning."),
        insights: [
            "Current skills baseline: ".concat(profileSkills.length, " listed competencies."),
            "Priority gaps identified: ".concat(missingSkills.length > 0 ? missingSkills.join(", ") : "No critical gaps detected from current market sample", "."),
            "Roadmap design balances upskilling, portfolio execution, and client-facing capability.",
            "Completion can improve readiness for higher-value roles within the same career track."
        ],
        confidenceScore: 86,
        modules: modules,
        provider: "fallback",
        fallback: true,
        error: fallbackReason === null || fallbackReason === void 0 ? void 0 : fallbackReason.message,
        errorCode: fallbackReason === null || fallbackReason === void 0 ? void 0 : fallbackReason.code
    };
};
var normalizeRoadmap = function normalizeRoadmap(raw, fallback) {
    if (!raw || (typeof raw === "undefined" ? "undefined" : _type_of(raw)) !== "object") return fallback;
    var input = raw;
    var modules = Array.isArray(input.modules) ? input.modules.map(function(item, index) {
        if (!item || (typeof item === "undefined" ? "undefined" : _type_of(item)) !== "object") return null;
        var moduleData = item;
        var title = typeof moduleData.title === "string" ? moduleData.title.trim() : "";
        var description = typeof moduleData.description === "string" ? moduleData.description.trim() : "";
        var duration = typeof moduleData.duration === "string" ? moduleData.duration.trim() : "";
        if (!title || !description || !duration) return null;
        return {
            id: typeof moduleData.id === "string" && moduleData.id.trim() ? moduleData.id.trim() : "module-".concat(index + 1),
            title: title,
            description: description,
            duration: duration,
            level: safeLevel(moduleData.level)
        };
    }).filter(function(module) {
        return module !== null;
    }) : [];
    if (modules.length === 0) return fallback;
    var insights = Array.isArray(input.insights) ? input.insights.filter(function(item) {
        return typeof item === "string" && item.trim().length > 0;
    }).slice(0, 6) : fallback.insights;
    var confidenceScore = typeof input.confidenceScore === "number" ? Math.max(60, Math.min(99, Math.round(input.confidenceScore))) : fallback.confidenceScore;
    return {
        roadmapId: typeof input.roadmapId === "string" && input.roadmapId.trim() ? input.roadmapId.trim() : fallback.roadmapId,
        status: "Unlocked",
        nextMilestone: typeof input.nextMilestone === "string" && input.nextMilestone.trim() ? input.nextMilestone.trim() : modules[0].title,
        summary: typeof input.summary === "string" && input.summary.trim() ? input.summary.trim() : fallback.summary,
        insights: insights.length > 0 ? insights : fallback.insights,
        confidenceScore: confidenceScore,
        modules: modules,
        provider: "gemini",
        fallback: false
    };
};
export function POST(req) {
    return _async_to_generator(function() {
        var _geminiData_candidates__content_parts, _geminiData_candidates__content, _geminiData_candidates_, _geminiData_candidates, body, profile, userId, creditSpend, _creditSpend_balance, statusCode, fallback, apiKey, compactProfile, prompt, geminiModel, geminiRes, providerMessage, _errJson_error, errJson, unused, mappedError, geminiData, modelText, parsed, roadmap, error, message;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        10,
                        ,
                        11
                    ]);
                    return [
                        4,
                        req.json()
                    ];
                case 1:
                    body = _state.sent();
                    profile = body === null || body === void 0 ? void 0 : body.profile;
                    if (!profile) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Invalid payload: profile is required."
                            }, {
                                status: 400
                            })
                        ];
                    }
                    userId = body.userId || profile.id;
                    if (!userId) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Missing userId.",
                                errorCode: "missing_user_id"
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        consumePremiumCredits({
                            userId: userId,
                            action: "career_roadmap",
                            metadata: {
                                profileCategory: profile.category || "General"
                            }
                        })
                    ];
                case 2:
                    creditSpend = _state.sent();
                    if (!creditSpend.ok) {
                        ;
                        statusCode = creditSpend.code === "not_premium" ? 403 : creditSpend.code === "insufficient_credits" ? 402 : 500;
                        return [
                            2,
                            NextResponse.json({
                                error: creditSpend.message,
                                errorCode: creditSpend.code,
                                requiredCredits: creditSpend.cost,
                                remainingCredits: (_creditSpend_balance = creditSpend.balance) !== null && _creditSpend_balance !== void 0 ? _creditSpend_balance : 0
                            }, {
                                status: statusCode
                            })
                        ];
                    }
                    fallback = generateFallbackRoadmap(profile, body.marketContext);
                    apiKey = process.env.GEMINI_API_KEY;
                    if (!apiKey) {
                        return [
                            2,
                            NextResponse.json(_object_spread_props(_object_spread({}, fallback), {
                                error: "GEMINI_API_KEY is missing",
                                errorCode: "missing_key",
                                credits: {
                                    spent: creditSpend.cost,
                                    remaining: creditSpend.balance
                                }
                            }))
                        ];
                    }
                    compactProfile = {
                        name: profile.name,
                        category: profile.category,
                        bio: String(profile.bio || "").slice(0, 700),
                        skills: (profile.skills || []).slice(0, 20),
                        verifiedSkills: (profile.verifiedSkills || []).map(function(skill) {
                            return {
                                name: skill.name,
                                score: skill.score
                            };
                        }).slice(0, 12),
                        portfolioCount: Array.isArray(profile.portfolio) ? profile.portfolio.length : 0,
                        hourlyRate: profile.hourlyRate
                    };
                    prompt = [
                        "You are a senior career strategist.",
                        "Create a professional, practical AI career roadmap for this freelancer.",
                        "Respond with ONLY valid JSON using this exact schema:",
                        "{",
                        '  "roadmapId": "RD-XXXXX",',
                        '  "summary": "string",',
                        '  "insights": ["string", "string", "string", "string"],',
                        '  "confidenceScore": 0,',
                        '  "nextMilestone": "string",',
                        '  "modules": [',
                        "    {",
                        '      "id": "module-1",',
                        '      "title": "string",',
                        '      "description": "string",',
                        '      "duration": "string",',
                        '      "level": "Beginner|Intermediate|Advanced|Expert"',
                        "    }",
                        "  ]",
                        "}",
                        "Rules:",
                        "- Keep tone concise, executive, and realistic.",
                        "- Create 5 to 7 modules in progression order.",
                        "- Use specific skill and career context from the profile.",
                        "- Avoid buzzwords and inflated claims.",
                        "- confidenceScore must be between 60 and 99.",
                        "",
                        "Profile: ".concat(JSON.stringify(compactProfile)),
                        "Market context: ".concat(JSON.stringify(body.marketContext || {}))
                    ].join("\n");
                    geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
                    return [
                        4,
                        fetch("https://generativelanguage.googleapis.com/v1beta/models/".concat(geminiModel, ":generateContent?key=").concat(apiKey), {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                contents: [
                                    {
                                        role: "user",
                                        parts: [
                                            {
                                                text: prompt
                                            }
                                        ]
                                    }
                                ],
                                generationConfig: {
                                    temperature: 0.3,
                                    topP: 0.9,
                                    maxOutputTokens: 3000,
                                    responseMimeType: "application/json"
                                }
                            })
                        })
                    ];
                case 3:
                    geminiRes = _state.sent();
                    if (!!geminiRes.ok) return [
                        3,
                        8
                    ];
                    providerMessage = "";
                    _state.label = 4;
                case 4:
                    _state.trys.push([
                        4,
                        6,
                        ,
                        7
                    ]);
                    return [
                        4,
                        geminiRes.json()
                    ];
                case 5:
                    errJson = _state.sent();
                    providerMessage = String((errJson === null || errJson === void 0 ? void 0 : (_errJson_error = errJson.error) === null || _errJson_error === void 0 ? void 0 : _errJson_error.message) || "");
                    return [
                        3,
                        7
                    ];
                case 6:
                    unused = _state.sent();
                    providerMessage = "";
                    return [
                        3,
                        7
                    ];
                case 7:
                    mappedError = mapGeminiError(geminiRes.status, providerMessage);
                    return [
                        2,
                        NextResponse.json(_object_spread_props(_object_spread({}, generateFallbackRoadmap(profile, body.marketContext, mappedError)), {
                            credits: {
                                spent: creditSpend.cost,
                                remaining: creditSpend.balance
                            }
                        }))
                    ];
                case 8:
                    return [
                        4,
                        geminiRes.json()
                    ];
                case 9:
                    geminiData = _state.sent();
                    modelText = geminiData === null || geminiData === void 0 ? void 0 : (_geminiData_candidates = geminiData.candidates) === null || _geminiData_candidates === void 0 ? void 0 : (_geminiData_candidates_ = _geminiData_candidates[0]) === null || _geminiData_candidates_ === void 0 ? void 0 : (_geminiData_candidates__content = _geminiData_candidates_.content) === null || _geminiData_candidates__content === void 0 ? void 0 : (_geminiData_candidates__content_parts = _geminiData_candidates__content.parts) === null || _geminiData_candidates__content_parts === void 0 ? void 0 : _geminiData_candidates__content_parts.map(function(part) {
                        return part === null || part === void 0 ? void 0 : part.text;
                    }).filter(Boolean).join("\n");
                    if (!modelText || typeof modelText !== "string") {
                        return [
                            2,
                            NextResponse.json(_object_spread_props(_object_spread({}, generateFallbackRoadmap(profile, body.marketContext, {
                                message: "Gemini returned empty response",
                                code: "empty_response"
                            })), {
                                credits: {
                                    spent: creditSpend.cost,
                                    remaining: creditSpend.balance
                                }
                            }))
                        ];
                    }
                    parsed = null;
                    try {
                        parsed = JSON.parse(cleanJsonBlock(modelText));
                    } catch (unused) {
                        parsed = null;
                    }
                    roadmap = normalizeRoadmap(parsed, fallback);
                    return [
                        2,
                        NextResponse.json(_object_spread_props(_object_spread({}, roadmap), {
                            credits: {
                                spent: creditSpend.cost,
                                remaining: creditSpend.balance
                            }
                        }))
                    ];
                case 10:
                    error = _state.sent();
                    message = _instanceof(error, Error) ? error.message : "Unable to generate roadmap";
                    return [
                        2,
                        NextResponse.json({
                            error: message
                        }, {
                            status: 500
                        })
                    ];
                case 11:
                    return [
                        2
                    ];
            }
        });
    })();
}
