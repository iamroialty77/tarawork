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
import { getBaseAppUrl, getPaymongoAuthHeader, getPaymongoPaymentMethods, getPaymongoProduct } from "../../../../lib/paymongo";
import { supabaseAdmin } from "../../../../lib/supabase_admin";
function toObject(value) {
    return (typeof value === "undefined" ? "undefined" : _type_of(value)) === "object" && value !== null ? value : {};
}
export function POST(req) {
    return _async_to_generator(function() {
        var _paymongoPayload_data, body, productType, userId, email, name, _ref, existingPortfolio, existingPortfolioError, themeSettings, premiumProfile, billing, proStatus, proExpiresAt, hasValidExpiry, isUnexpired, isAlreadyPaidPro, _ref1, existingPortfolio1, existingPortfolioError1, themeSettings1, premiumProfile1, product, appUrl, paymongoResponse, paymongoPayload, _paymongoPayload_errors_, _paymongoPayload_errors, _paymongoPayload_errors_1, _paymongoPayload_errors1, message, checkoutId, _paymongoPayload_data_attributes, _paymongoPayload_data1, _$error, error, message1;
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
                    productType = body.productType, userId = body.userId, email = body.email, name = body.name;
                    if (!productType || productType !== "pro" && productType !== "verification" && productType !== "credit_topup") {
                        return [
                            2,
                            NextResponse.json({
                                error: "Invalid product type."
                            }, {
                                status: 400
                            })
                        ];
                    }
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
                    if (!(productType === "pro")) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        supabaseAdmin.from("portfolios").select("theme_settings").eq("profile_id", userId).maybeSingle()
                    ];
                case 2:
                    _ref = _state.sent(), existingPortfolio = _ref.data, existingPortfolioError = _ref.error;
                    if (existingPortfolioError && existingPortfolioError.code !== "PGRST116") {
                        throw existingPortfolioError;
                    }
                    themeSettings = toObject(existingPortfolio === null || existingPortfolio === void 0 ? void 0 : existingPortfolio.theme_settings);
                    premiumProfile = toObject(themeSettings.premiumProfile);
                    billing = toObject(premiumProfile.billing);
                    proStatus = billing.proStatus;
                    proExpiresAt = typeof billing.proExpiresAt === "string" ? new Date(billing.proExpiresAt) : null;
                    hasValidExpiry = !!proExpiresAt && !Number.isNaN(proExpiresAt.getTime());
                    isUnexpired = hasValidExpiry && proExpiresAt.getTime() > Date.now();
                    isAlreadyPaidPro = premiumProfile.tier === "pro" && billing.proLocked === true && proStatus === "active" && isUnexpired;
                    if (isAlreadyPaidPro) {
                        return [
                            2,
                            NextResponse.json({
                                error: "Your Premium Profile subscription is already active."
                            }, {
                                status: 409
                            })
                        ];
                    }
                    _state.label = 3;
                case 3:
                    if (!(productType === "credit_topup")) return [
                        3,
                        5
                    ];
                    return [
                        4,
                        supabaseAdmin.from("portfolios").select("theme_settings").eq("profile_id", userId).maybeSingle()
                    ];
                case 4:
                    _ref1 = _state.sent(), existingPortfolio1 = _ref1.data, existingPortfolioError1 = _ref1.error;
                    if (existingPortfolioError1 && existingPortfolioError1.code !== "PGRST116") {
                        throw existingPortfolioError1;
                    }
                    themeSettings1 = toObject(existingPortfolio1 === null || existingPortfolio1 === void 0 ? void 0 : existingPortfolio1.theme_settings);
                    premiumProfile1 = toObject(themeSettings1.premiumProfile);
                    if (premiumProfile1.tier !== "pro") {
                        return [
                            2,
                            NextResponse.json({
                                error: "Credit top-up is available only for Pro accounts."
                            }, {
                                status: 403
                            })
                        ];
                    }
                    _state.label = 5;
                case 5:
                    product = getPaymongoProduct(productType);
                    appUrl = getBaseAppUrl();
                    return [
                        4,
                        fetch("https://api.paymongo.com/v1/checkout_sessions", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                Authorization: getPaymongoAuthHeader(),
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                data: {
                                    attributes: {
                                        billing: email || name ? {
                                            email: email,
                                            name: name
                                        } : undefined,
                                        cancel_url: "".concat(appUrl, "/?payment=cancelled&product=").concat(productType),
                                        description: product.description,
                                        line_items: [
                                            {
                                                amount: product.amount,
                                                currency: "PHP",
                                                description: product.description,
                                                name: product.name,
                                                quantity: 1
                                            }
                                        ],
                                        metadata: {
                                            product_type: productType,
                                            user_id: userId
                                        },
                                        payment_method_types: getPaymongoPaymentMethods(),
                                        send_email_receipt: true,
                                        show_description: true,
                                        show_line_items: true,
                                        success_url: "".concat(appUrl, "/?payment=success&product=").concat(productType)
                                    }
                                }
                            })
                        })
                    ];
                case 6:
                    paymongoResponse = _state.sent();
                    return [
                        4,
                        paymongoResponse.json()
                    ];
                case 7:
                    paymongoPayload = _state.sent();
                    if (!paymongoResponse.ok) {
                        ;
                        message = (paymongoPayload === null || paymongoPayload === void 0 ? void 0 : (_paymongoPayload_errors = paymongoPayload.errors) === null || _paymongoPayload_errors === void 0 ? void 0 : (_paymongoPayload_errors_ = _paymongoPayload_errors[0]) === null || _paymongoPayload_errors_ === void 0 ? void 0 : _paymongoPayload_errors_.detail) || (paymongoPayload === null || paymongoPayload === void 0 ? void 0 : (_paymongoPayload_errors1 = paymongoPayload.errors) === null || _paymongoPayload_errors1 === void 0 ? void 0 : (_paymongoPayload_errors_1 = _paymongoPayload_errors1[0]) === null || _paymongoPayload_errors_1 === void 0 ? void 0 : _paymongoPayload_errors_1.code) || "PayMongo checkout creation failed.";
                        return [
                            2,
                            NextResponse.json({
                                error: message
                            }, {
                                status: 502
                            })
                        ];
                    }
                    checkoutId = paymongoPayload === null || paymongoPayload === void 0 ? void 0 : (_paymongoPayload_data = paymongoPayload.data) === null || _paymongoPayload_data === void 0 ? void 0 : _paymongoPayload_data.id;
                    if (!checkoutId) return [
                        3,
                        9
                    ];
                    return [
                        4,
                        supabaseAdmin.from("paymongo_checkout_sessions").upsert([
                            {
                                checkout_id: checkoutId,
                                user_id: userId,
                                product_type: productType,
                                status: "pending",
                                livemode: !!(paymongoPayload === null || paymongoPayload === void 0 ? void 0 : (_paymongoPayload_data1 = paymongoPayload.data) === null || _paymongoPayload_data1 === void 0 ? void 0 : (_paymongoPayload_data_attributes = _paymongoPayload_data1.attributes) === null || _paymongoPayload_data_attributes === void 0 ? void 0 : _paymongoPayload_data_attributes.livemode),
                                amount: product.amount,
                                currency: "PHP",
                                email: email || null,
                                updated_at: new Date().toISOString()
                            }
                        ], {
                            onConflict: "checkout_id"
                        })
                    ];
                case 8:
                    _$error = _state.sent().error;
                    if (_$error && _$error.code !== "PGRST205" && _$error.code !== "42P01") {
                        return [
                            2,
                            NextResponse.json({
                                error: "Checkout saved but mapping failed: ".concat(_$error.message)
                            }, {
                                status: 500
                            })
                        ];
                    }
                    _state.label = 9;
                case 9:
                    return [
                        2,
                        NextResponse.json({
                            checkoutId: paymongoPayload.data.id,
                            checkoutUrl: paymongoPayload.data.attributes.checkout_url
                        })
                    ];
                case 10:
                    error = _state.sent();
                    message1 = _instanceof(error, Error) ? error.message : "Checkout creation failed.";
                    return [
                        2,
                        NextResponse.json({
                            error: message1
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
