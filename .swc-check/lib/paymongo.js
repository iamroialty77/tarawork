function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
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
import crypto from "crypto";
var checkoutProducts = {
    pro: {
        amount: 19900,
        description: "Tara Freelancer Pro monthly access",
        name: "Tara Freelancer Pro"
    },
    verification: {
        amount: 49900,
        description: "Tara Verified Freelancer annual program",
        name: "Tara Verified Freelancer"
    },
    credit_topup: {
        amount: 14900,
        description: "Tara Premium Credits top-up (+10 credits)",
        name: "Tara Credits Top-up"
    }
};
export function getPaymongoProduct(productType) {
    return checkoutProducts[productType];
}
export function getPaymongoSecretKey() {
    var secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
        throw new Error("PAYMONGO_SECRET_KEY is not configured.");
    }
    return secretKey;
}
export function getBaseAppUrl() {
    return (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}
export function getPaymongoPaymentMethods() {
    var rawValue = process.env.PAYMONGO_PAYMENT_METHODS;
    if (!rawValue) {
        return [
            "gcash"
        ];
    }
    return rawValue.split(",").map(function(method) {
        return method.trim();
    }).filter(Boolean);
}
export function getPaymongoAuthHeader() {
    var token = Buffer.from("".concat(getPaymongoSecretKey(), ":")).toString("base64");
    return "Basic ".concat(token);
}
export function verifyPaymongoSignature(param) {
    var payload = param.payload, signatureHeader = param.signatureHeader, webhookSecret = param.webhookSecret, livemode = param.livemode;
    if (!signatureHeader) {
        return false;
    }
    var signatureParts = Object.fromEntries(signatureHeader.split(",").map(function(part) {
        var _part_split = _sliced_to_array(part.split("="), 2), key = _part_split[0], tmp = _part_split[1], value = tmp === void 0 ? "" : tmp;
        return [
            key.trim(),
            value.trim()
        ];
    }));
    if (!signatureParts.t) {
        return false;
    }
    var signedPayload = "".concat(signatureParts.t, ".").concat(payload);
    var computedSignature = crypto.createHmac("sha256", webhookSecret).update(signedPayload).digest("hex");
    var expectedSignature = livemode ? signatureParts.li : signatureParts.te;
    if (!expectedSignature) {
        return false;
    }
    if (computedSignature.length !== expectedSignature.length) {
        return false;
    }
    return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(expectedSignature));
}
