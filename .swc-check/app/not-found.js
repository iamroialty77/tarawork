import Link from "next/link";
export default function NotFound() {
    return /*#__PURE__*/ React.createElement("main", {
        className: "min-h-screen flex items-center justify-center px-6"
    }, /*#__PURE__*/ React.createElement("div", {
        className: "max-w-lg text-center space-y-4"
    }, /*#__PURE__*/ React.createElement("h1", {
        className: "text-3xl font-bold text-slate-900"
    }, "Page not found"), /*#__PURE__*/ React.createElement("p", {
        className: "text-slate-600"
    }, "Check the URL and try again, or go back to the homepage."), /*#__PURE__*/ React.createElement("div", {
        className: "flex items-center justify-center gap-3"
    }, /*#__PURE__*/ React.createElement(Link, {
        href: "/",
        className: "rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
    }, "Go to Home"), /*#__PURE__*/ React.createElement(Link, {
        href: "/auth",
        className: "rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
    }, "Open Login"))));
}
