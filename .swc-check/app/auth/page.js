"use client";
import AuthForm from "../../components/AuthForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
export default function AuthPage() {
    return /*#__PURE__*/ React.createElement("div", {
        className: "min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"
    }), /*#__PURE__*/ React.createElement("div", {
        className: "relative z-10"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-md mx-auto mb-8"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
    }, /*#__PURE__*/ React.createElement(ArrowLeft, {
        className: "w-4 h-4 group-hover:-translate-x-1 transition-transform"
    }), "Back to Home")), /*#__PURE__*/ React.createElement(Suspense, {
        fallback: /*#__PURE__*/ React.createElement("div", {
            className: "text-center"
        }, "Loading...")
    }, /*#__PURE__*/ React.createElement(AuthForm, null)), /*#__PURE__*/ React.createElement("div", {
        className: "mt-12 text-center"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "text-xs text-slate-400 font-medium"
    }, "By continuing, you agree to Tara's", " ", /*#__PURE__*/ React.createElement("button", {
        className: "underline hover:text-slate-600 transition-colors"
    }, "Terms of Service"), " and", " ", /*#__PURE__*/ React.createElement("button", {
        className: "underline hover:text-slate-600 transition-colors"
    }, "Privacy Policy"), "."))));
}
