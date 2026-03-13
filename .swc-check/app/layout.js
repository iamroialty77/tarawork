import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
var geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: [
        "latin"
    ]
});
var geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: [
        "latin"
    ]
});
export var metadata = {
    title: "TaraWork",
    description: "The Premium Marketplace for Filipino Freelancers & employers",
    icons: {
        icon: "/tarawork-removebg-preview.png",
        apple: "/tarawork-removebg-preview.png"
    }
};
export default function RootLayout(param) {
    var children = param.children;
    return /*#__PURE__*/ React.createElement("html", {
        lang: "en"
    }, /*#__PURE__*/ React.createElement("body", {
        className: "".concat(geistSans.variable, " ").concat(geistMono.variable, " antialiased")
    }, children, /*#__PURE__*/ React.createElement(Analytics, null), /*#__PURE__*/ React.createElement(SpeedInsights, null)));
}
