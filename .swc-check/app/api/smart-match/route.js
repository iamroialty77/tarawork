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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
import { heuristicSmartMatchMany } from "@/lib/smartMatch";
import { consumePremiumCredits } from "@/lib/credits";
var MAX_JOBS_PER_REQUEST = 40;
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
var cleanJsonBlock = function cleanJsonBlock(text) {
    var fenced = text.match(/```json\s*([\s\S]*?)```/i);
    if (fenced === null || fenced === void 0 ? void 0 : fenced[1]) return fenced[1].trim();
    return text.trim();
};
var normalizeModelMatches = function normalizeModelMatches(rawMatches, fallback) {
    if (!Array.isArray(rawMatches)) return fallback;
    var fallbackMap = new Map(fallback.map(function(item) {
        return [
            item.jobId,
            item
        ];
    }));
    var normalized = rawMatches.map(function(item) {
        if (!item || (typeof item === "undefined" ? "undefined" : _type_of(item)) !== "object") return null;
        var x = item;
        var jobId = typeof x.jobId === "string" ? x.jobId : "";
        if (!jobId) return null;
        var fallbackItem = fallbackMap.get(jobId);
        if (!fallbackItem) return null;
        var modelScore = typeof x.score === "number" ? x.score : fallbackItem.score;
        var matchedSkills = Array.isArray(x.matchedSkills) ? x.matchedSkills.filter(function(s) {
            return typeof s === "string";
        }) : fallbackItem.matchedSkills;
        var missingSkills = Array.isArray(x.missingSkills) ? x.missingSkills.filter(function(s) {
            return typeof s === "string";
        }) : fallbackItem.missingSkills;
        var reason = typeof x.reason === "string" ? x.reason : fallbackItem.reason;
        return {
            jobId: jobId,
            score: Math.max(0, Math.min(100, Math.round(modelScore))),
            matchedSkills: matchedSkills,
            missingSkills: missingSkills,
            reason: reason
        };
    }).filter(function(item) {
        return item !== null;
    });
    if (normalized.length === 0) return fallback;
    var normalizedMap = new Map(normalized.map(function(item) {
        return [
            item.jobId,
            item
        ];
    }));
    return fallback.map(function(item) {
        var _normalizedMap_get;
        return (_normalizedMap_get = normalizedMap.get(item.jobId)) !== null && _normalizedMap_get !== void 0 ? _normalizedMap_get : item;
    });
};
export function POST(req) {
    return _async_to_generator(function() {
        var _geminiData_candidates__content_parts, _geminiData_candidates__content, _geminiData_candidates_, _geminiData_candidates, body, jobs, profile, creditSpend, _creditSpend_balance, statusCode, fallbackMatches, apiKey, response, compactJobs, compactProfile, prompt, geminiModel, geminiRes, providerMessage, _errJson_error, errJson, unused, mappedError, response1, geminiData, modelText, response2, parsed, parsedMatches, matches, response3, error, message, isAbort, isNetwork;
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
                    if (!(body === null || body === void 0 ? void 0 : body.profile) || !Array.isArray(body.jobs)) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Invalid payload"
                            }, {
                                status: 400
                            })
                        ];
                    }
                    jobs = body.jobs.slice(0, MAX_JOBS_PER_REQUEST);
                    profile = body.profile;
                    if (!profile.id) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Missing profile.id for premium credit accounting.",
                                errorCode: "missing_user_id",
                                matches: [],
                                provider: "heuristic",
                                fallback: true
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        consumePremiumCredits({
                            userId: profile.id,
                            action: "smart_match",
                            metadata: {
                                totalJobs: jobs.length,
                                category: profile.category || "General"
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
                                matches: [],
                                provider: "heuristic",
                                fallback: true,
                                requiredCredits: creditSpend.cost,
                                remainingCredits: (_creditSpend_balance = creditSpend.balance) !== null && _creditSpend_balance !== void 0 ? _creditSpend_balance : 0
                            }, {
                                status: statusCode
                            })
                        ];
                    }
                    fallbackMatches = heuristicSmartMatchMany(jobs, profile);
                    apiKey = process.env.GEMINI_API_KEY;
                    if (!apiKey) {
                        response = {
                            matches: fallbackMatches,
                            provider: "heuristic",
                            fallback: true,
                            error: "GEMINI_API_KEY is missing",
                            errorCode: "missing_key",
                            credits: {
                                spent: creditSpend.cost,
                                remaining: creditSpend.balance
                            }
                        };
                        return [
                            2,
                            NextResponse.json(response)
                        ];
                    }
                    compactJobs = jobs.map(function(job) {
                        return {
                            id: job.id,
                            title: job.title,
                            category: job.category,
                            skills: job.skills,
                            energyRequirement: job.energyRequirement || "Balanced",
                            description: String(job.description || "").slice(0, 500)
                        };
                    });
                    compactProfile = {
                        category: profile.category,
                        skills: profile.skills || [],
                        wellness: profile.wellness ? {
                            energyRating: profile.wellness.energyRating,
                            verifiedSustainable: profile.wellness.verifiedSustainable
                        } : null
                    };
                    prompt = [
                        "You are a job matching engine.",
                        "Given one freelancer profile and a list of jobs, compute skill-fit scores.",
                        "Return ONLY valid JSON object with this exact schema:",
                        '{ "matches": [{ "jobId": "string", "score": 0-100, "matchedSkills": ["..."], "missingSkills": ["..."], "reason": "short reason" }] }',
                        "Rules:",
                        "- Prioritize skills overlap and category fit.",
                        "- Consider energy compatibility from wellness.energyRating vs job.energyRequirement.",
                        "- Keep reason short (max 20 words).",
                        "- Include every jobId exactly once.",
                        "",
                        "Profile: ".concat(JSON.stringify(compactProfile)),
                        "Jobs: ".concat(JSON.stringify(compactJobs))
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
                                    temperature: 0.2,
                                    topP: 0.9,
                                    maxOutputTokens: 2048,
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
                    response1 = {
                        matches: fallbackMatches,
                        provider: "heuristic",
                        fallback: true,
                        error: mappedError.message,
                        errorCode: mappedError.code,
                        credits: {
                            spent: creditSpend.cost,
                            remaining: creditSpend.balance
                        }
                    };
                    return [
                        2,
                        NextResponse.json(response1)
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
                        response2 = {
                            matches: fallbackMatches,
                            provider: "heuristic",
                            fallback: true,
                            error: "Gemini returned empty response",
                            errorCode: "empty_response",
                            credits: {
                                spent: creditSpend.cost,
                                remaining: creditSpend.balance
                            }
                        };
                        return [
                            2,
                            NextResponse.json(response2)
                        ];
                    }
                    parsed = null;
                    try {
                        parsed = JSON.parse(cleanJsonBlock(modelText));
                    } catch (unused) {
                        parsed = null;
                    }
                    parsedMatches = parsed && (typeof parsed === "undefined" ? "undefined" : _type_of(parsed)) === "object" ? parsed.matches : undefined;
                    matches = normalizeModelMatches(parsedMatches, fallbackMatches);
                    response3 = {
                        matches: matches,
                        provider: "gemini",
                        fallback: false,
                        credits: {
                            spent: creditSpend.cost,
                            remaining: creditSpend.balance
                        }
                    };
                    return [
                        2,
                        NextResponse.json(response3)
                    ];
                case 10:
                    error = _state.sent();
                    message = _instanceof(error, Error) ? error.message : "Unable to compute smart match";
                    isAbort = message.toLowerCase().includes("aborted");
                    isNetwork = message.toLowerCase().includes("fetch") || message.toLowerCase().includes("network");
                    return [
                        2,
                        NextResponse.json({
                            error: message,
                            matches: [],
                            provider: "heuristic",
                            fallback: true,
                            errorCode: isAbort ? "aborted" : isNetwork ? "network_error" : "internal_error"
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
