"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Search, ShieldCheck, UserCog, X } from "lucide-react";

const permissionDetails: Record<string, { label: string; description: string }> = {
  "overview.view": { label: "Overview", description: "Dashboard totals and recent activity" },
  "users.manage": { label: "Users & verification", description: "Review, edit, suspend, or delete accounts" },
  "jobs.manage": { label: "Marketplace", description: "Edit, moderate, and remove job posts" },
  "disputes.manage": { label: "Disputes", description: "Review and resolve platform disputes" },
  "talent_requests.view": { label: "Talent requests", description: "View employer sourcing requests" },
  "email.manage": { label: "Email operations", description: "Read, compose, sync, and send email" },
  "automation.manage": { label: "Automation", description: "Run campaigns, matching, and reminders" },
  "site_settings.manage": { label: "Site settings", description: "Change public website configuration" },
  "blog.manage": { label: "Blog Studio", description: "Create, edit, publish, and delete articles" },
  "reports.view": { label: "Insights", description: "View performance and operational reports" },
  "health.view": { label: "System health", description: "Inspect database and service health" },
  "roles.manage": { label: "Roles & access", description: "Promote admins and change their permissions" },
};

type RolePayload = {
  permissions: string[];
  permissionOptions: string[];
  users?: any[];
  assignments?: any[];
};

export default function AdminRoleManager() {
  const [data, setData] = useState<RolePayload | null>(null);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const response = await fetch("/api/admin/roles", { cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Unable to load roles.");
    setData(payload);
  };

  useEffect(() => { void load().catch((error) => setMessage(error.message)); }, []);

  const assignmentMap = useMemo(
    () => new Map((data?.assignments || []).map((assignment) => [assignment.user_id, assignment])),
    [data],
  );
  const users = (data?.users || []).filter((user) => {
    const query = search.trim().toLowerCase();
    return !query || [user.name, user.username, user.role].some((value) => String(value || "").toLowerCase().includes(query));
  });
  const selectedUser = (data?.users || []).find((user) => user.id === selectedId);
  const selectedAssignment = selectedId ? assignmentMap.get(selectedId) : null;

  const chooseUser = (user: any) => {
    const assignment = assignmentMap.get(user.id);
    setSelectedId(user.id);
    setSelectedPermissions(assignment?.is_owner ? data?.permissionOptions || [] : assignment?.permissions || ["overview.view"]);
    setMessage("");
  };

  const submit = async (action: "grant" | "revoke") => {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId: selectedId, permissions: selectedPermissions }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to update admin access.");
      await load();
      setSelectedId("");
      setSelectedPermissions([]);
      setMessage(action === "grant" ? "Admin access updated successfully." : "Admin access revoked successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update admin access.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-500">Loading role management…</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-indigo-500 p-3"><UserCog className="h-6 w-6" /></div>
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">Access control</p><h2 className="mt-1 text-2xl font-black">Admin roles & permissions</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Promote a freelancer or employer without giving unnecessary access. Every role change is recorded in the admin audit log.</p></div>
        </div>
      </div>

      {message && <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">{message}</div>}

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-black text-slate-950">Team accounts</h3>
          <div className="relative mt-4"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or username" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400" /></div>
          <div className="mt-4 max-h-[560px] space-y-2 overflow-y-auto">
            {users.map((user) => {
              const assignment = assignmentMap.get(user.id);
              return <button key={user.id} onClick={() => chooseUser(user)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedId === user.id ? "border-indigo-400 bg-indigo-50" : "border-slate-100 hover:border-slate-300"}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-black text-slate-600">{String(user.name || "?").slice(0, 1).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-black text-slate-900">{user.name || "Unnamed user"}</p><p className="truncate text-xs text-slate-500">@{user.username || "no-username"} · {assignment?.is_owner ? "Owner" : user.role === "admin" ? "Admin" : user.role}</p></div>
                {user.role === "admin" && <ShieldCheck className="h-4 w-4 text-indigo-600" />}
              </button>;
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          {!selectedUser ? <div className="flex min-h-80 flex-col items-center justify-center text-center"><div className="rounded-full bg-slate-100 p-4"><ShieldCheck className="h-7 w-7 text-slate-400" /></div><h3 className="mt-4 font-black text-slate-900">Select a team member</h3><p className="mt-1 text-sm text-slate-500">Choose an account to configure its admin access.</p></div> : <>
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">Permission profile</p><h3 className="mt-1 text-xl font-black text-slate-950">{selectedUser.name}</h3><p className="text-sm text-slate-500">Original account type: {selectedAssignment?.base_role || selectedUser.role}</p></div>{selectedAssignment?.is_owner && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">Owner · Full access</span>}</div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {(data.permissionOptions || []).map((permission) => {
                const checked = selectedPermissions.includes(permission);
                const detail = permissionDetails[permission] || { label: permission, description: "" };
                return <button key={permission} disabled={selectedAssignment?.is_owner} onClick={() => setSelectedPermissions((current) => checked ? current.filter((item) => item !== permission) : [...current, permission])} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${checked ? "border-indigo-300 bg-indigo-50" : "border-slate-200 hover:border-slate-300"} disabled:cursor-not-allowed disabled:opacity-70`}>
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${checked ? "bg-indigo-600 text-white" : "border border-slate-300 bg-white"}`}>{checked && <Check className="h-3.5 w-3.5" />}</span>
                  <span><span className="block text-sm font-black text-slate-900">{detail.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{detail.description}</span></span>
                </button>;
              })}
            </div>
            {!selectedAssignment?.is_owner && <div className="mt-6 flex flex-wrap justify-end gap-3">
              {selectedUser.role === "admin" && <button disabled={saving} onClick={() => void submit("revoke")} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-black text-rose-700 hover:bg-rose-50 disabled:opacity-50"><X className="h-4 w-4" /> Revoke admin</button>}
              <button disabled={saving || !selectedPermissions.length} onClick={() => void submit("grant")} className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-50">{saving ? "Saving…" : selectedUser.role === "admin" ? "Save permissions" : "Promote to admin"}</button>
            </div>}
          </>}
        </section>
      </div>
    </div>
  );
}
