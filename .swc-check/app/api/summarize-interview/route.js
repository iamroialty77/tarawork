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
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { supabase } from '@/lib/supabase';
import { consumePremiumCredits } from '@/lib/credits';
export function POST(req) {
    return _async_to_generator(function() {
        var _ref, transcript, projectId, participants, userId, creditSpend, _creditSpend_balance, statusCode, _ref1, summary, _ref2, logError, error, message;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        5,
                        ,
                        6
                    ]);
                    return [
                        4,
                        req.json()
                    ];
                case 1:
                    _ref = _state.sent(), transcript = _ref.transcript, projectId = _ref.projectId, participants = _ref.participants, userId = _ref.userId;
                    if (!transcript) {
                        return [
                            2,
                            NextResponse.json({
                                error: 'No transcript provided'
                            }, {
                                status: 400
                            })
                        ];
                    }
                    if (!userId) {
                        return [
                            2,
                            NextResponse.json({
                                error: 'Missing userId.'
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        consumePremiumCredits({
                            userId: userId,
                            action: "interview_summary",
                            metadata: {
                                projectId: projectId || null
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
                    return [
                        4,
                        generateText({
                            model: openai('gpt-4o-mini'),
                            prompt: "Summarize the following interview transcript professionally. Focus on key decisions, budget agreements, and next steps:\n\n".concat(transcript)
                        })
                    ];
                case 3:
                    _ref1 = _state.sent(), summary = _ref1.text;
                    return [
                        4,
                        supabase.from('admin_audit_logs').insert({
                            action: 'INTERVIEW_SUMMARY_GENERATED',
                            details: {
                                summary: summary,
                                projectId: projectId,
                                participants: participants,
                                timestamp: new Date().toISOString()
                            }
                        })
                    ];
                case 4:
                    _ref2 = _state.sent(), logError = _ref2.error;
                    if (logError) console.error('Error logging to audit logs:', logError);
                    return [
                        2,
                        NextResponse.json({
                            summary: summary,
                            credits: {
                                spent: creditSpend.cost,
                                remaining: creditSpend.balance
                            }
                        })
                    ];
                case 5:
                    error = _state.sent();
                    console.error('Error summarizing interview:', error);
                    message = _instanceof(error, Error) ? error.message : 'Failed to summarize';
                    return [
                        2,
                        NextResponse.json({
                            error: message
                        }, {
                            status: 500
                        })
                    ];
                case 6:
                    return [
                        2
                    ];
            }
        });
    })();
}
