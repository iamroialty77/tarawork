import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return twMerge(clsx(inputs));
}
export function formatRelativeTime(dateString) {
    var date = new Date(dateString);
    var now = new Date();
    var diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Just now";
    var diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return "".concat(diffInMinutes, "m ago");
    var diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return "".concat(diffInHours, "h ago");
    var diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return "".concat(diffInDays, "d ago");
    var diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return "".concat(diffInMonths, "mo ago");
    return date.toLocaleDateString();
}
export var energyScore = function energyScore(userEnergy, jobEnergy) {
    var u = (userEnergy || "Balanced").toLowerCase();
    var j = (jobEnergy || "Balanced").toLowerCase();
    if (u === j) return 100;
    if (u === "high" && j === "balanced" || u === "balanced" && j === "low" || u === "low" && j === "balanced") return 80;
    if (u === "high" && j === "low" || u === "low" && j === "high") return 50;
    return 70;
};
