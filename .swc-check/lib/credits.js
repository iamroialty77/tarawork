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
import { supabaseAdmin } from "@/lib/supabase_admin";
import { PREMIUM_CREDIT_COSTS, PREMIUM_MONTHLY_CREDITS, PREMIUM_TOPUP_CREDITS } from "@/lib/creditConfig";
function toObject(value) {
    return (typeof value === "undefined" ? "undefined" : _type_of(value)) === "object" && value !== null ? value : {};
}
function isMissingTableError(error) {
    var _error_message, _error_message1;
    if (!error) return false;
    return error.code === "PGRST205" || error.code === "42P01" || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes("relation")) || ((_error_message1 = error.message) === null || _error_message1 === void 0 ? void 0 : _error_message1.includes("Could not find the table")) || false;
}
function isMissingFunctionError(error) {
    var _error_message;
    if (!error) return false;
    return error.code === "PGRST202" || error.code === "42883" || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.toLowerCase().includes("function")) || false;
}
export function getCreditCost(action) {
    return PREMIUM_CREDIT_COSTS[action];
}
export function getCreditBalance(userId) {
    return _async_to_generator(function() {
        var _ref, data, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.from("user_credit_wallets").select("balance").eq("user_id", userId).maybeSingle()
                    ];
                case 1:
                    _ref = _state.sent(), data = _ref.data, error = _ref.error;
                    if (error) {
                        if (isMissingTableError(error)) return [
                            2,
                            0
                        ];
                        throw error;
                    }
                    return [
                        2,
                        Number((data === null || data === void 0 ? void 0 : data.balance) || 0)
                    ];
            }
        });
    })();
}
export function isUserPremiumActive(userId) {
    return _async_to_generator(function() {
        var _ref, data, error, themeSettings, premiumProfile, billing, tier, expiresAt, hasValidExpiry, notExpired;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.from("portfolios").select("theme_settings").eq("profile_id", userId).maybeSingle()
                    ];
                case 1:
                    _ref = _state.sent(), data = _ref.data, error = _ref.error;
                    if (error) {
                        if (error.code === "PGRST116" || isMissingTableError(error)) return [
                            2,
                            false
                        ];
                        throw error;
                    }
                    themeSettings = toObject(data === null || data === void 0 ? void 0 : data.theme_settings);
                    premiumProfile = toObject(themeSettings.premiumProfile);
                    billing = toObject(premiumProfile.billing);
                    tier = premiumProfile.tier;
                    expiresAt = typeof billing.proExpiresAt === "string" ? new Date(billing.proExpiresAt) : null;
                    hasValidExpiry = !!expiresAt && !Number.isNaN(expiresAt.getTime());
                    notExpired = !hasValidExpiry || !!expiresAt && expiresAt.getTime() > Date.now();
                    return [
                        2,
                        tier === "pro" && notExpired
                    ];
            }
        });
    })();
}
export function consumePremiumCredits(params) {
    return _async_to_generator(function() {
        var cost, isPremium, _ref, data, error, row;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    cost = getCreditCost(params.action);
                    if (!params.userId) {
                        return [
                            2,
                            {
                                ok: false,
                                code: "system_error",
                                message: "Missing userId for premium credit spending.",
                                cost: cost
                            }
                        ];
                    }
                    return [
                        4,
                        isUserPremiumActive(params.userId)
                    ];
                case 1:
                    isPremium = _state.sent();
                    if (!isPremium) {
                        return [
                            2,
                            {
                                ok: false,
                                code: "not_premium",
                                message: "Premium account required to use this feature.",
                                cost: cost
                            }
                        ];
                    }
                    return [
                        4,
                        supabaseAdmin.rpc("consume_user_credits", {
                            p_user_id: params.userId,
                            p_action: params.action,
                            p_amount: cost,
                            p_metadata: params.metadata || {},
                            p_idempotency_key: params.idempotencyKey || null
                        })
                    ];
                case 2:
                    _ref = _state.sent(), data = _ref.data, error = _ref.error;
                    if (error) {
                        if (isMissingFunctionError(error) || isMissingTableError(error)) {
                            return [
                                2,
                                {
                                    ok: false,
                                    code: "config_missing",
                                    message: "Credit system is not configured in database yet.",
                                    cost: cost
                                }
                            ];
                        }
                        return [
                            2,
                            {
                                ok: false,
                                code: "system_error",
                                message: error.message || "Credit spending failed.",
                                cost: cost
                            }
                        ];
                    }
                    row = Array.isArray(data) ? data[0] : data;
                    if (!row || row.success !== true) {
                        return [
                            2,
                            {
                                ok: false,
                                code: "insufficient_credits",
                                message: (row === null || row === void 0 ? void 0 : row.error) || "Insufficient credits.",
                                cost: cost,
                                balance: Number((row === null || row === void 0 ? void 0 : row.balance) || 0)
                            }
                        ];
                    }
                    return [
                        2,
                        {
                            ok: true,
                            cost: cost,
                            balance: Number(row.balance || 0)
                        }
                    ];
            }
        });
    })();
}
export function grantPremiumMonthlyCredits(params) {
    return _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.rpc("grant_user_credits", {
                            p_user_id: params.userId,
                            p_amount: PREMIUM_MONTHLY_CREDITS,
                            p_action: "premium_monthly_allocation",
                            p_metadata: _object_spread({
                                source: params.source
                            }, params.metadata || {}),
                            p_idempotency_key: params.idempotencyKey || null
                        })
                    ];
                case 1:
                    error = _state.sent().error;
                    if (error && !isMissingFunctionError(error) && !isMissingTableError(error)) {
                        throw error;
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
export function grantTopupCredits(params) {
    return _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.rpc("grant_user_credits", {
                            p_user_id: params.userId,
                            p_amount: PREMIUM_TOPUP_CREDITS,
                            p_action: "credit_topup_purchase",
                            p_metadata: params.metadata || {},
                            p_idempotency_key: params.idempotencyKey || null
                        })
                    ];
                case 1:
                    error = _state.sent().error;
                    if (error && !isMissingFunctionError(error) && !isMissingTableError(error)) {
                        throw error;
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
export { PREMIUM_CREDIT_COSTS, PREMIUM_MONTHLY_CREDITS, PREMIUM_TOPUP_CREDITS };
