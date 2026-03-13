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
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { consumePremiumCredits } from '@/lib/credits';
// Fallback for demo purposes if API key is not set
var DEFAULT_OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
var apiKey = process.env.OPENAI_API_KEY || DEFAULT_OPENAI_API_KEY;
var openai = new OpenAI({
    apiKey: apiKey
});
export function POST(req) {
    return _async_to_generator(function() {
        var _ref, type, content, skills, role, details, title, technologies, userId, creditSpend, _creditSpend_balance, statusCode, prompt, response, generatedText, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        req.json()
                    ];
                case 1:
                    _ref = _state.sent(), type = _ref.type, content = _ref.content, skills = _ref.skills, role = _ref.role, details = _ref.details, title = _ref.title, technologies = _ref.technologies, userId = _ref.userId;
                    if (!userId) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Missing userId."
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        consumePremiumCredits({
                            userId: userId,
                            action: "portfolio_generate",
                            metadata: {
                                type: typeof type === "string" ? type : "project"
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
                    if (!apiKey || apiKey === DEFAULT_OPENAI_API_KEY) {
                        // Mock response for testing/demo when no API key is present
                        if (type === 'aboutMe') {
                            return [
                                2,
                                NextResponse.json({
                                    text: "Professional ".concat(role, " with expertise in ").concat((skills === null || skills === void 0 ? void 0 : skills.join(', ')) || 'modern technologies', ". I focus on creating minimalist and efficient solutions that drive business value."),
                                    credits: {
                                        spent: creditSpend.cost,
                                        remaining: creditSpend.balance
                                    }
                                })
                            ];
                        }
                        return [
                            2,
                            NextResponse.json({
                                text: "Developed a robust solution for ".concat(title || 'the project', " using ").concat((technologies === null || technologies === void 0 ? void 0 : technologies.join(', ')) || 'cutting-edge tech', ". Improved performance and user experience."),
                                credits: {
                                    spent: creditSpend.cost,
                                    remaining: creditSpend.balance
                                }
                            })
                        ];
                    }
                    prompt = '';
                    if (type === 'aboutMe') {
                        prompt = "Generate a professional, minimalist 'About Me' section for a freelancer portfolio.\n        Role: ".concat(role, "\n        Skills: ").concat(skills === null || skills === void 0 ? void 0 : skills.join(', '), "\n        Key background: ").concat(content || details, "\n        Tone: Professional, modern, minimalist (Korean-inspired aesthetic - clean and punchy). \n        Focus on: Solving client problems and delivering quality.\n        Keep it under 3-4 sentences.");
                    } else {
                        prompt = "Generate a professional, concise project description for a freelancer portfolio.\n        Project Title: ".concat(title || content, "\n        Technologies used: ").concat(technologies === null || technologies === void 0 ? void 0 : technologies.join(', '), "\n        Key features/tasks: ").concat(details, "\n        Tone: Minimalist, achievement-oriented.\n        Keep it under 2-3 sentences.");
                    }
                    return [
                        4,
                        openai.chat.completions.create({
                            model: 'gpt-4o-mini',
                            messages: [
                                {
                                    role: 'system',
                                    content: 'You are a professional portfolio writer with a minimalist, clean aesthetic.'
                                },
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ],
                            max_tokens: 300
                        })
                    ];
                case 3:
                    response = _state.sent();
                    generatedText = response.choices[0].message.content;
                    return [
                        2,
                        NextResponse.json({
                            text: generatedText,
                            credits: {
                                spent: creditSpend.cost,
                                remaining: creditSpend.balance
                            }
                        })
                    ];
                case 4:
                    error = _state.sent();
                    console.error('AI Generation Error:', error);
                    return [
                        2,
                        NextResponse.json({
                            error: 'Failed to generate content'
                        }, {
                            status: 500
                        })
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    })();
}
