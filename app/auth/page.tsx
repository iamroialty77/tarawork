"use client";

import AuthForm from "../../components/AuthForm";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="max-w-md mx-auto mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        <AuthForm />
        
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 font-medium">
            By continuing, you agree to Tara's{" "}
            <button className="underline hover:text-slate-600 transition-colors">Terms of Service</button> and{" "}
            <button className="underline hover:text-slate-600 transition-colors">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
