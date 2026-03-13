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
import { supabaseAdmin } from '@/lib/supabase_admin';
import { NextResponse } from 'next/server';
export function POST(req) {
    return _async_to_generator(function() {
        var userId, _ref, profile, profileFetchError, _ref1, profileDeleteError, _ref2, authError, error;
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
                    userId = _state.sent().userId;
                    if (!userId) {
                        return [
                            2,
                            NextResponse.json({
                                error: 'User ID is required'
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        supabaseAdmin.from('profiles').select('role').eq('id', userId).single()
                    ];
                case 2:
                    _ref = _state.sent(), profile = _ref.data, profileFetchError = _ref.error;
                    if (profileFetchError && profileFetchError.code !== 'PGRST116') {
                        console.error('Error fetching profile:', profileFetchError);
                    }
                    // 2. Cleanup Public Data (Order matters for foreign keys)
                    // - Delete Applications
                    return [
                        4,
                        supabaseAdmin.from('applications').delete().eq('freelancer_id', userId)
                    ];
                case 3:
                    _state.sent();
                    // - Delete Jobs (if they are a employer)
                    // Note: If they have jobs, we should delete them. 
                    // This will trigger cascade delete for applications if set in DB.
                    return [
                        4,
                        supabaseAdmin.from('jobs').delete().eq('employer_id', userId)
                    ];
                case 4:
                    _state.sent();
                    // - Delete Conversations & Messages
                    // Since messages reference conversation_id ON DELETE CASCADE, 
                    // we only need to delete the conversations.
                    return [
                        4,
                        supabaseAdmin.from('conversations').delete().or("participant_1.eq.".concat(userId, ",participant_2.eq.").concat(userId))
                    ];
                case 5:
                    _state.sent();
                    // - Delete Portfolio Items
                    return [
                        4,
                        supabaseAdmin.from('portfolio_items').delete().eq('profile_id', userId)
                    ];
                case 6:
                    _state.sent();
                    // - Delete Escrows & Disputes (optional? maybe keep for financial records? 
                    // but user wants TOTAL delete, so we should clean up)
                    return [
                        4,
                        supabaseAdmin.from('escrows').delete().or("employer_id.eq.".concat(userId, ",freelancer_id.eq.").concat(userId))
                    ];
                case 7:
                    _state.sent();
                    return [
                        4,
                        supabaseAdmin.from('profiles').delete().eq('id', userId)
                    ];
                case 8:
                    _ref1 = _state.sent(), profileDeleteError = _ref1.error;
                    if (profileDeleteError) {
                        console.error('Profile delete error:', profileDeleteError);
                    }
                    return [
                        4,
                        supabaseAdmin.auth.admin.deleteUser(userId)
                    ];
                case 9:
                    _ref2 = _state.sent(), authError = _ref2.error;
                    if (authError) {
                        // If auth delete fails (maybe user doesn't exist in auth anymore but still in profiles)
                        // we still return success if profile was cleaned up or at least log the error.
                        console.error('Auth delete error:', authError);
                        if (authError.message !== 'User not found') {
                            return [
                                2,
                                NextResponse.json({
                                    error: "Auth deletion failed: ".concat(authError.message)
                                }, {
                                    status: 500
                                })
                            ];
                        }
                    }
                    return [
                        2,
                        NextResponse.json({
                            success: true,
                            message: 'Account and all related data have been totally removed.'
                        })
                    ];
                case 10:
                    error = _state.sent();
                    console.error('Global delete error:', error);
                    return [
                        2,
                        NextResponse.json({
                            error: error.message || 'Internal server error'
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
