"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Search,
  MoreVertical,
  ArrowUpRight,
  Filter
} from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Users", value: "12,842", change: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Jobs", value: "3,456", change: "+5%", icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Revenue", value: "$452,120", change: "+18%", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Disputes", value: "14", change: "-2%", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  ];

  const recentActivities = [
    { id: 1, user: "Alex Johnson", action: "Job Posted", details: "Senior React Dev", time: "2m ago", status: "Verified" },
    { id: 2, user: "Maria Santos", action: "Payment Released", details: "$1,200.00", time: "15m ago", status: "Completed" },
    { id: 3, user: "TechCorp Inc.", action: "New Account", details: "Enterprise Client", time: "1h ago", status: "Pending Verification" },
    { id: 4, user: "John Doe", action: "Dispute Raised", details: "Project #882", time: "3h ago", status: "In Review" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Control Center</h2>
        <p className="text-slate-500 mt-1">Global platform overview and management.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Platform Activity</h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                  <Search className="w-4 h-4 text-slate-400" />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100">
                  <Filter className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentActivities.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.user}</div>
                        <div className="text-xs text-slate-400">{item.details}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{item.action}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.status === 'Verified' || item.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : item.status === 'In Review'
                            ? 'bg-red-50 text-red-600 border-red-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium">
                        {item.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-50 text-center">
              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                View All Activity
              </button>
            </div>
          </div>
        </div>

        {/* System Health / Quick Actions */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Security Overview
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">System Health</span>
                  <span className="text-emerald-400 font-bold">99.9%</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[99.9%]"></div>
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Vetting Queue</span>
                  <span className="text-amber-400 font-bold">24 Pending</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[40%]"></div>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              System Audit <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                "User Search", "Flags", "Payouts", "Settings", "Reports", "Support"
              ].map((action) => (
                <button key={action} className="p-3 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}