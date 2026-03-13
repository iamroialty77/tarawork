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
import { supabaseAdmin } from "../../../../lib/supabase_admin";
import { verifyPaymongoSignature } from "../../../../lib/paymongo";
import { grantPremiumMonthlyCredits, grantTopupCredits } from "../../../../lib/credits";
var PREMIUM_SUBSCRIPTION_DAYS = 30;
var DAY_IN_MS = 24 * 60 * 60 * 1000;
function toObject(value) {
    return (typeof value === "undefined" ? "undefined" : _type_of(value)) === "object" && value !== null ? value : {};
}
function readString(value) {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}
function parseProductType(value) {
    return value === "pro" || value === "verification" || value === "credit_topup" ? value : undefined;
}
function readDate(value) {
    if (typeof value !== "string" || value.length === 0) {
        return null;
    }
    var parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}
function getExtendedProExpiryIso(currentExpiryRaw) {
    var now = new Date();
    var currentExpiry = readDate(currentExpiryRaw);
    var renewalBase = currentExpiry && currentExpiry.getTime() > now.getTime() ? currentExpiry : now;
    return new Date(renewalBase.getTime() + PREMIUM_SUBSCRIPTION_DAYS * DAY_IN_MS).toISOString();
}
function isMissingTableError(error) {
    var _error_message, _error_message1;
    if (!error) {
        return false;
    }
    return error.code === "PGRST205" || error.code === "42P01" || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.includes("relation")) || ((_error_message1 = error.message) === null || _error_message1 === void 0 ? void 0 : _error_message1.includes("Could not find the table")) || false;
}
function isDuplicateError(error) {
    var _error_message;
    if (!error) {
        return false;
    }
    return error.code === "23505" || ((_error_message = error.message) === null || _error_message === void 0 ? void 0 : _error_message.toLowerCase().includes("duplicate")) || false;
}
function extractMetadata(payload) {
    var _payload_data_attributes, _payload_data;
    var eventData = (_payload_data = payload.data) === null || _payload_data === void 0 ? void 0 : (_payload_data_attributes = _payload_data.attributes) === null || _payload_data_attributes === void 0 ? void 0 : _payload_data_attributes.data;
    var eventDataAttrs = toObject(eventData === null || eventData === void 0 ? void 0 : eventData.attributes);
    var source = toObject(eventDataAttrs.source);
    var sourceAttrs = toObject(source.attributes);
    var candidates = [
        eventDataAttrs.metadata,
        sourceAttrs.metadata
    ];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = candidates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var candidate = _step.value;
            var obj = toObject(candidate);
            var userId = readString(obj.user_id);
            var productType = parseProductType(obj.product_type);
            if (userId || productType) {
                return {
                    userId: userId,
                    productType: productType
                };
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return {
        userId: undefined,
        productType: undefined
    };
}
function resolveAction(eventType) {
    if (eventType === "checkout_session.payment.paid" || eventType === "subscription.invoice.paid") {
        return "activate";
    }
    if (eventType === "checkout_session.payment.failed" || eventType === "subscription.invoice.payment_failed" || eventType === "subscription.unpaid" || eventType === "subscription.past_due" || eventType === "subscription.cancelled") {
        return "deactivate";
    }
    return "ignore";
}
function resolveProStatusFromEvent(eventType) {
    if (eventType === "checkout_session.payment.paid" || eventType === "subscription.invoice.paid") {
        return "active";
    }
    if (eventType === "subscription.past_due") {
        return "past_due";
    }
    if (eventType === "subscription.cancelled") {
        return "cancelled";
    }
    return "inactive";
}
function getCheckoutSessionById(checkoutId) {
    return _async_to_generator(function() {
        var _ref, data, error, parsedProduct;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.from("paymongo_checkout_sessions").select("checkout_id, user_id, product_type, status").eq("checkout_id", checkoutId).maybeSingle()
                    ];
                case 1:
                    _ref = _state.sent(), data = _ref.data, error = _ref.error;
                    if (error) {
                        if (isMissingTableError(error)) {
                            return [
                                2,
                                null
                            ];
                        }
                        throw error;
                    }
                    if (!data) {
                        return [
                            2,
                            null
                        ];
                    }
                    parsedProduct = parseProductType(data.product_type);
                    if (!parsedProduct || !data.user_id || !data.checkout_id || !data.status) {
                        return [
                            2,
                            null
                        ];
                    }
                    return [
                        2,
                        {
                            checkout_id: data.checkout_id,
                            user_id: data.user_id,
                            product_type: parsedProduct,
                            status: data.status
                        }
                    ];
            }
        });
    })();
}
function updateCheckoutSessionStatus(checkoutId, status) {
    return _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.from("paymongo_checkout_sessions").update({
                            status: status,
                            updated_at: new Date().toISOString()
                        }).eq("checkout_id", checkoutId)
                    ];
                case 1:
                    error = _state.sent().error;
                    if (error && !isMissingTableError(error)) {
                        throw error;
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
function activatePurchase(userId, productType, eventType, eventId) {
    return _async_to_generator(function() {
        var _currentPremiumProfile_analytics, _currentPremiumProfile_analytics1, _currentPremiumProfile_verifiedProgram, _currentPremiumProfile_verifiedProgram1, _currentPremiumProfile_verifiedProgram2, _currentPremiumProfile_verifiedProgram3, _currentPremiumProfile_verifiedProgram4, _currentPremiumProfile_verifiedProgram5, _currentPremiumProfile_billing, grantProMonthlyCredits, creditError, _ref, existingPortfolio, fetchError, currentThemeSettings, currentPremiumProfile, nextPremiumProfile, payload, error, error1;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    grantProMonthlyCredits = function grantProMonthlyCredits() {
                        return _async_to_generator(function() {
                            var creditError;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        if (productType !== "pro") return [
                                            2
                                        ];
                                        _state.label = 1;
                                    case 1:
                                        _state.trys.push([
                                            1,
                                            3,
                                            ,
                                            4
                                        ]);
                                        return [
                                            4,
                                            grantPremiumMonthlyCredits({
                                                userId: userId,
                                                source: eventType === "subscription.invoice.paid" ? "paymongo_subscription" : "paymongo_checkout",
                                                idempotencyKey: "paymongo-pro-credit:".concat(eventId),
                                                metadata: {
                                                    eventType: eventType,
                                                    eventId: eventId
                                                }
                                            })
                                        ];
                                    case 2:
                                        _state.sent();
                                        return [
                                            3,
                                            4
                                        ];
                                    case 3:
                                        creditError = _state.sent();
                                        console.error("Unable to grant premium monthly credits:", creditError);
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
                    if (!(productType === "credit_topup")) return [
                        3,
                        5
                    ];
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    return [
                        4,
                        grantTopupCredits({
                            userId: userId,
                            idempotencyKey: "paymongo-credit-topup:".concat(eventId),
                            metadata: {
                                eventType: eventType,
                                eventId: eventId
                            }
                        })
                    ];
                case 2:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    creditError = _state.sent();
                    console.error("Unable to grant credit top-up:", creditError);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
                case 5:
                    return [
                        4,
                        supabaseAdmin.from("portfolios").select("id, theme_settings").eq("profile_id", userId).maybeSingle()
                    ];
                case 6:
                    _ref = _state.sent(), existingPortfolio = _ref.data, fetchError = _ref.error;
                    if (fetchError && fetchError.code !== "PGRST116") {
                        throw fetchError;
                    }
                    currentThemeSettings = (existingPortfolio === null || existingPortfolio === void 0 ? void 0 : existingPortfolio.theme_settings) && _type_of(existingPortfolio.theme_settings) === "object" ? existingPortfolio.theme_settings : {
                        aesthetic: "professional",
                        primaryColor: "#4f46e5"
                    };
                    currentPremiumProfile = currentThemeSettings.premiumProfile && _type_of(currentThemeSettings.premiumProfile) === "object" ? currentThemeSettings.premiumProfile : {};
                    nextPremiumProfile = productType === "pro" ? _object_spread_props(_object_spread({}, currentPremiumProfile), {
                        tier: "pro",
                        verifiedBadge: true,
                        advancedPortfolio: true,
                        featuredPlacement: true,
                        analyticsEnabled: true,
                        analytics: {
                            profileViews: Number(((_currentPremiumProfile_analytics = currentPremiumProfile.analytics) === null || _currentPremiumProfile_analytics === void 0 ? void 0 : _currentPremiumProfile_analytics.profileViews) || 0),
                            clientClicks: Number(((_currentPremiumProfile_analytics1 = currentPremiumProfile.analytics) === null || _currentPremiumProfile_analytics1 === void 0 ? void 0 : _currentPremiumProfile_analytics1.clientClicks) || 0)
                        },
                        verifiedProgram: {
                            enrolled: !!((_currentPremiumProfile_verifiedProgram = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram.enrolled),
                            annualFee: Number(((_currentPremiumProfile_verifiedProgram1 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram1 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram1.annualFee) || 499),
                            identityVerified: !!((_currentPremiumProfile_verifiedProgram2 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram2 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram2.identityVerified),
                            portfolioVerified: !!((_currentPremiumProfile_verifiedProgram3 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram3 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram3.portfolioVerified),
                            higherSearchRanking: !!((_currentPremiumProfile_verifiedProgram4 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram4 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram4.higherSearchRanking),
                            clientTrustBoost: !!((_currentPremiumProfile_verifiedProgram5 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram5 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram5.clientTrustBoost)
                        },
                        billing: _object_spread_props(_object_spread({}, toObject(currentPremiumProfile.billing)), {
                            proStatus: "active",
                            proLocked: true,
                            proLastEvent: eventType,
                            proUpdatedAt: new Date().toISOString(),
                            proActivatedAt: new Date().toISOString(),
                            proExpiresAt: getExtendedProExpiryIso((_currentPremiumProfile_billing = currentPremiumProfile.billing) === null || _currentPremiumProfile_billing === void 0 ? void 0 : _currentPremiumProfile_billing.proExpiresAt)
                        })
                    }) : _object_spread_props(_object_spread({}, currentPremiumProfile), {
                        verifiedBadge: true,
                        verifiedProgram: {
                            enrolled: true,
                            annualFee: 499,
                            identityVerified: true,
                            portfolioVerified: true,
                            higherSearchRanking: true,
                            clientTrustBoost: true
                        }
                    });
                    payload = {
                        profile_id: userId,
                        theme_settings: _object_spread_props(_object_spread({}, currentThemeSettings), {
                            premiumProfile: nextPremiumProfile
                        }),
                        updated_at: new Date().toISOString()
                    };
                    if (!(existingPortfolio === null || existingPortfolio === void 0 ? void 0 : existingPortfolio.id)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        supabaseAdmin.from("portfolios").update(payload).eq("id", existingPortfolio.id)
                    ];
                case 7:
                    error = _state.sent().error;
                    if (error) {
                        throw error;
                    }
                    return [
                        4,
                        grantProMonthlyCredits()
                    ];
                case 8:
                    _state.sent();
                    return [
                        2
                    ];
                case 9:
                    return [
                        4,
                        supabaseAdmin.from("portfolios").insert([
                            payload
                        ])
                    ];
                case 10:
                    error1 = _state.sent().error;
                    if (error1) {
                        throw error1;
                    }
                    return [
                        4,
                        grantProMonthlyCredits()
                    ];
                case 11:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    })();
}
function deactivatePurchase(userId, productType, eventType) {
    return _async_to_generator(function() {
        var _currentPremiumProfile_verifiedProgram, _currentPremiumProfile_verifiedProgram1, _currentPremiumProfile_verifiedProgram2, _currentPremiumProfile_verifiedProgram3, _currentPremiumProfile_verifiedProgram4, _currentPremiumProfile_verifiedProgram5, _ref, existingPortfolio, fetchError, currentThemeSettings, currentPremiumProfile, existingVerifiedProgram, nextPremiumProfile, error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (productType === "credit_topup") {
                        return [
                            2
                        ];
                    }
                    return [
                        4,
                        supabaseAdmin.from("portfolios").select("id, theme_settings").eq("profile_id", userId).maybeSingle()
                    ];
                case 1:
                    _ref = _state.sent(), existingPortfolio = _ref.data, fetchError = _ref.error;
                    if (fetchError && fetchError.code !== "PGRST116") {
                        throw fetchError;
                    }
                    if (!(existingPortfolio === null || existingPortfolio === void 0 ? void 0 : existingPortfolio.id)) {
                        return [
                            2
                        ];
                    }
                    currentThemeSettings = existingPortfolio.theme_settings && _type_of(existingPortfolio.theme_settings) === "object" ? existingPortfolio.theme_settings : {
                        aesthetic: "professional",
                        primaryColor: "#4f46e5"
                    };
                    currentPremiumProfile = currentThemeSettings.premiumProfile && _type_of(currentThemeSettings.premiumProfile) === "object" ? currentThemeSettings.premiumProfile : {};
                    existingVerifiedProgram = {
                        enrolled: !!((_currentPremiumProfile_verifiedProgram = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram.enrolled),
                        annualFee: Number(((_currentPremiumProfile_verifiedProgram1 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram1 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram1.annualFee) || 499),
                        identityVerified: !!((_currentPremiumProfile_verifiedProgram2 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram2 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram2.identityVerified),
                        portfolioVerified: !!((_currentPremiumProfile_verifiedProgram3 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram3 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram3.portfolioVerified),
                        higherSearchRanking: !!((_currentPremiumProfile_verifiedProgram4 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram4 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram4.higherSearchRanking),
                        clientTrustBoost: !!((_currentPremiumProfile_verifiedProgram5 = currentPremiumProfile.verifiedProgram) === null || _currentPremiumProfile_verifiedProgram5 === void 0 ? void 0 : _currentPremiumProfile_verifiedProgram5.clientTrustBoost)
                    };
                    nextPremiumProfile = productType === "pro" ? _object_spread_props(_object_spread({}, currentPremiumProfile), {
                        tier: "free",
                        verifiedBadge: existingVerifiedProgram.enrolled,
                        advancedPortfolio: false,
                        featuredPlacement: false,
                        analyticsEnabled: false,
                        customDomain: "",
                        billing: _object_spread_props(_object_spread({}, toObject(currentPremiumProfile.billing)), {
                            proStatus: resolveProStatusFromEvent(eventType),
                            proLocked: false,
                            proLastEvent: eventType,
                            proUpdatedAt: new Date().toISOString(),
                            proExpiresAt: new Date().toISOString()
                        })
                    }) : _object_spread_props(_object_spread({}, currentPremiumProfile), {
                        verifiedBadge: currentPremiumProfile.tier === "pro",
                        verifiedProgram: {
                            enrolled: false,
                            annualFee: existingVerifiedProgram.annualFee,
                            identityVerified: false,
                            portfolioVerified: false,
                            higherSearchRanking: false,
                            clientTrustBoost: false
                        }
                    });
                    return [
                        4,
                        supabaseAdmin.from("portfolios").update({
                            theme_settings: _object_spread_props(_object_spread({}, currentThemeSettings), {
                                premiumProfile: nextPremiumProfile
                            }),
                            updated_at: new Date().toISOString()
                        }).eq("id", existingPortfolio.id)
                    ];
                case 2:
                    error = _state.sent().error;
                    if (error) {
                        throw error;
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
function insertEventLog(params) {
    return _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.from("paymongo_events").insert([
                            {
                                event_id: params.eventId,
                                event_type: params.eventType,
                                resource_id: params.resourceId || null,
                                livemode: params.livemode,
                                payload: params.payload,
                                received_at: new Date().toISOString()
                            }
                        ])
                    ];
                case 1:
                    error = _state.sent().error;
                    if (!error) {
                        return [
                            2,
                            {
                                inserted: true
                            }
                        ];
                    }
                    if (isDuplicateError(error)) {
                        return [
                            2,
                            {
                                inserted: false,
                                duplicate: true
                            }
                        ];
                    }
                    if (isMissingTableError(error)) {
                        return [
                            2,
                            {
                                inserted: false,
                                missingTable: true
                            }
                        ];
                    }
                    throw error;
            }
        });
    })();
}
function updateEventLog(eventId, fields) {
    return _async_to_generator(function() {
        var error;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        supabaseAdmin.from("paymongo_events").update(fields).eq("event_id", eventId)
                    ];
                case 1:
                    error = _state.sent().error;
                    if (error && !isMissingTableError(error)) {
                        throw error;
                    }
                    return [
                        2
                    ];
            }
        });
    })();
}
export function POST(req) {
    return _async_to_generator(function() {
        var rawBody, eventId, _payload_data, _payload_data_attributes, _payload_data1, _payload_data_attributes1, _payload_data2, _payload_data_attributes_data, _payload_data_attributes2, _payload_data3, payload, eventType, livemode, webhookSecret, resourceId, isValid, eventLog, action, metadata, userId, productType, checkout, error, message;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        req.text()
                    ];
                case 1:
                    rawBody = _state.sent();
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        17,
                        ,
                        20
                    ]);
                    payload = JSON.parse(rawBody);
                    eventId = (_payload_data = payload.data) === null || _payload_data === void 0 ? void 0 : _payload_data.id;
                    eventType = (_payload_data1 = payload.data) === null || _payload_data1 === void 0 ? void 0 : (_payload_data_attributes = _payload_data1.attributes) === null || _payload_data_attributes === void 0 ? void 0 : _payload_data_attributes.type;
                    livemode = !!((_payload_data2 = payload.data) === null || _payload_data2 === void 0 ? void 0 : (_payload_data_attributes1 = _payload_data2.attributes) === null || _payload_data_attributes1 === void 0 ? void 0 : _payload_data_attributes1.livemode);
                    webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;
                    resourceId = (_payload_data3 = payload.data) === null || _payload_data3 === void 0 ? void 0 : (_payload_data_attributes2 = _payload_data3.attributes) === null || _payload_data_attributes2 === void 0 ? void 0 : (_payload_data_attributes_data = _payload_data_attributes2.data) === null || _payload_data_attributes_data === void 0 ? void 0 : _payload_data_attributes_data.id;
                    if (webhookSecret) {
                        isValid = verifyPaymongoSignature({
                            payload: rawBody,
                            signatureHeader: req.headers.get("paymongo-signature"),
                            webhookSecret: webhookSecret,
                            livemode: livemode
                        });
                        if (!isValid) {
                            return [
                                2,
                                NextResponse.json({
                                    error: "Invalid PayMongo signature."
                                }, {
                                    status: 401
                                })
                            ];
                        }
                    }
                    if (!eventId || !eventType) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Invalid webhook event payload."
                            }, {
                                status: 400
                            })
                        ];
                    }
                    return [
                        4,
                        insertEventLog({
                            eventId: eventId,
                            eventType: eventType,
                            livemode: livemode,
                            resourceId: resourceId,
                            payload: payload
                        })
                    ];
                case 3:
                    eventLog = _state.sent();
                    if ("duplicate" in eventLog && eventLog.duplicate) {
                        return [
                            2,
                            NextResponse.json({
                                message: "Event already processed.",
                                eventId: eventId
                            })
                        ];
                    }
                    action = resolveAction(eventType);
                    if (!(action === "ignore")) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        updateEventLog(eventId, {
                            processed: true,
                            processing_error: null,
                            processed_at: new Date().toISOString()
                        })
                    ];
                case 4:
                    _state.sent();
                    return [
                        2,
                        NextResponse.json({
                            message: "Event ignored.",
                            eventId: eventId
                        })
                    ];
                case 5:
                    metadata = extractMetadata(payload);
                    userId = metadata.userId;
                    productType = metadata.productType;
                    if (!((!userId || !productType) && resourceId)) return [
                        3,
                        7
                    ];
                    return [
                        4,
                        getCheckoutSessionById(resourceId)
                    ];
                case 6:
                    checkout = _state.sent();
                    if (checkout) {
                        userId = userId || checkout.user_id;
                        productType = productType || checkout.product_type;
                    }
                    _state.label = 7;
                case 7:
                    if (!(!userId || !productType)) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        updateEventLog(eventId, {
                            processed: false,
                            processing_error: "Missing user_id or product_type in webhook payload/session mapping.",
                            processed_at: null,
                            user_id: userId || null,
                            product_type: productType || null,
                            resource_id: resourceId || null
                        })
                    ];
                case 8:
                    _state.sent();
                    return [
                        2,
                        NextResponse.json({
                            error: "Missing payment metadata mapping."
                        }, {
                            status: 400
                        })
                    ];
                case 9:
                    if (!(action === "activate")) return [
                        3,
                        11
                    ];
                    return [
                        4,
                        activatePurchase(userId, productType, eventType, eventId)
                    ];
                case 10:
                    _state.sent();
                    return [
                        3,
                        13
                    ];
                case 11:
                    if (!(action === "deactivate")) return [
                        3,
                        13
                    ];
                    return [
                        4,
                        deactivatePurchase(userId, productType, eventType)
                    ];
                case 12:
                    _state.sent();
                    _state.label = 13;
                case 13:
                    if (!(resourceId && eventType.startsWith("checkout_session.payment."))) return [
                        3,
                        15
                    ];
                    return [
                        4,
                        updateCheckoutSessionStatus(resourceId, eventType === "checkout_session.payment.paid" ? "paid" : "failed")
                    ];
                case 14:
                    _state.sent();
                    _state.label = 15;
                case 15:
                    return [
                        4,
                        updateEventLog(eventId, {
                            processed: true,
                            processing_error: null,
                            processed_at: new Date().toISOString(),
                            user_id: userId,
                            product_type: productType,
                            resource_id: resourceId || null
                        })
                    ];
                case 16:
                    _state.sent();
                    return [
                        2,
                        NextResponse.json({
                            message: action === "activate" ? "Payment applied." : "Premium access updated.",
                            eventId: eventId
                        })
                    ];
                case 17:
                    error = _state.sent();
                    message = _instanceof(error, Error) ? error.message : "Webhook handling failed.";
                    if (!eventId) return [
                        3,
                        19
                    ];
                    return [
                        4,
                        updateEventLog(eventId, {
                            processed: false,
                            processing_error: message,
                            processed_at: null
                        })
                    ];
                case 18:
                    _state.sent();
                    _state.label = 19;
                case 19:
                    return [
                        2,
                        NextResponse.json({
                            error: message
                        }, {
                            status: 500
                        })
                    ];
                case 20:
                    return [
                        2
                    ];
            }
        });
    })();
}
