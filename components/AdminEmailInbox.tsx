"use client";

import { useMemo, useState } from "react";
import { Archive, ChevronLeft, FilePenLine, Inbox, Mail, PenLine, RefreshCw, RotateCcw, Search, Send, Trash2, X } from "lucide-react";

type Folder = "inbox" | "sent" | "drafts" | "trash";
type Compose = { draftId?: string; to: string; subject: string; message: string };
const emptyCompose: Compose = { to: "", subject: "", message: "" };

export default function AdminEmailInbox({ messages, refresh, reply }: { messages: any[]; refresh: () => void; reply: (id: string, body: string) => Promise<void> }) {
  const [items, setItems] = useState(messages);
  const [folder, setFolder] = useState<Folder>("inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [compose, setCompose] = useState<Compose | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const trashed = (item: any) => Boolean(item.metadata?.trashedAt);
  const inFolder = (item: any, target: Folder) => target === "trash" ? trashed(item) : !trashed(item) && (target === "drafts" ? item.status === "draft" : target === "sent" ? item.direction === "outbound" && item.status !== "draft" : item.direction !== "outbound" && item.status !== "draft");
  const visible = useMemo(() => items.filter((item) => inFolder(item, folder)).filter((item) => `${item.from_name || ""} ${item.from_email || ""} ${item.to_email || ""} ${item.subject || ""} ${item.text_body || ""}`.toLowerCase().includes(query.toLowerCase())), [items, folder, query]);
  const selected = visible.find((item) => item.id === selectedId);
  const folders = [{ id: "inbox", label: "Inbox", icon: Inbox }, { id: "sent", label: "Sent", icon: Send }, { id: "drafts", label: "Drafts", icon: FilePenLine }, { id: "trash", label: "Trash", icon: Trash2 }] as const;

  const mutate = async (id: string, action: "read" | "unread" | "trash" | "restore") => {
    const response = await fetch("/api/admin/email-messages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    const data = await response.json();
    if (!response.ok) return setNotice(data.error || "Unable to update email.");
    setItems((current) => current.map((item) => item.id === id ? { ...item, metadata: data.metadata } : item));
    if (action === "trash" || action === "restore") setSelectedId(null);
  };
  const remove = async (id: string) => {
    if (!window.confirm("Permanently delete this email? This cannot be undone.")) return;
    const response = await fetch(`/api/admin/email-messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) return setNotice(data.error || "Unable to delete email.");
    setItems((current) => current.filter((item) => item.id !== id)); setSelectedId(null);
  };
  const processCompose = async (action: "draft" | "send") => {
    if (!compose) return;
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/email-compose", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...compose, action }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to process email.");
      setItems((current) => [data.message, ...current.filter((item) => item.id !== data.message.id)]);
      setNotice(action === "send" ? `Email sent to ${data.message.to_email}.` : "Draft saved.");
      setCompose(null); setFolder(action === "send" ? "sent" : "drafts");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to process email."); }
    finally { setBusy(false); }
  };

  return <div className="relative grid min-h-[700px] grid-cols-1 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 lg:grid-cols-[230px_360px_minmax(0,1fr)]">
    <aside className="border-b border-slate-200 bg-slate-50/80 p-4 lg:border-b-0 lg:border-r">
      <div className="mb-4 flex items-center gap-3 px-3 py-2"><div className="rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-2 text-white"><Mail className="h-5 w-5" /></div><div><h3 className="font-black text-slate-900">TaraWork Mail</h3><p className="text-[11px] font-semibold text-slate-400">Admin workspace</p></div></div>
      <button onClick={() => { setCompose({ ...emptyCompose }); setSelectedId(null); }} className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"><PenLine className="h-4 w-4" />Compose email</button>
      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-1">{folders.map((item) => <button key={item.id} onClick={() => { setFolder(item.id); setSelectedId(null); setCompose(null); }} className={`flex min-w-fit items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition lg:w-full ${folder === item.id && !compose ? "bg-indigo-100 text-indigo-800" : "text-slate-600 hover:bg-slate-100"}`}><item.icon className="h-4 w-4" /><span className="flex-1 text-left">{item.label}</span><span className="text-xs">{items.filter((mail) => inFolder(mail, item.id)).length}</span></button>)}</nav>
    </aside>
    <section className={`border-slate-200 lg:border-r ${selected || compose ? "hidden lg:block" : "block"}`}>
      <div className="flex gap-2 border-b border-slate-200 p-4"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${folder}`} className="w-full rounded-xl bg-slate-100 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200" /></div><button onClick={refresh} title="Refresh" className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><RefreshCw className="h-4 w-4" /></button></div>
      <div className="max-h-[635px] divide-y divide-slate-100 overflow-y-auto">{visible.length ? visible.map((mail) => <button key={mail.id} onClick={() => { if (mail.status === "draft") { setCompose({ draftId: mail.id, to: mail.to_email || "", subject: mail.subject === "(No subject)" ? "" : mail.subject || "", message: mail.text_body || "" }); setSelectedId(null); } else { setSelectedId(mail.id); setCompose(null); if (!mail.metadata?.isRead) void mutate(mail.id, "read"); } }} className={`block w-full p-4 text-left transition hover:bg-slate-50 ${selectedId === mail.id ? "bg-indigo-50" : ""}`}><div className="flex gap-2"><p className={`flex-1 truncate text-sm text-slate-900 ${mail.metadata?.isRead ? "font-semibold" : "font-black"}`}>{folder === "sent" || folder === "drafts" ? `To: ${mail.to_email || "No recipient"}` : mail.from_name || mail.from_email || "TaraWork"}</p>{!mail.metadata?.isRead && folder === "inbox" && <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-600" />}</div><p className="mt-1 truncate text-sm font-bold text-slate-700">{mail.subject || "(No subject)"}</p><p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{mail.text_body || "Empty draft"}</p><p className="mt-2 text-[10px] font-bold uppercase text-slate-400">{mail.created_at ? new Date(mail.created_at).toLocaleString() : ""}</p></button>) : <div className="p-12 text-center"><Archive className="mx-auto h-9 w-9 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-400">No messages in {folder}.</p></div>}</div>
    </section>
    <section className={`${selected || compose ? "block" : "hidden lg:flex"} min-w-0 flex-col`}>
      {notice && <div className="border-b border-indigo-100 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-700">{notice}</div>}
      {compose ? <div className="flex h-full flex-col"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div className="flex items-center gap-3"><button onClick={() => setCompose(null)} className="text-slate-500 lg:hidden"><ChevronLeft /></button><div><h2 className="font-black text-slate-900">{compose.draftId ? "Edit draft" : "New message"}</h2><p className="text-xs font-medium text-slate-400">Send a professional email from TaraWork</p></div></div><button onClick={() => setCompose(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div><div className="flex-1 p-5 md:p-7"><label className="text-xs font-black uppercase tracking-wider text-slate-400">Recipient email</label><input type="email" value={compose.to} onChange={(event) => setCompose({ ...compose, to: event.target.value })} placeholder="name@company.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /><label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-400">Subject</label><input value={compose.subject} onChange={(event) => setCompose({ ...compose, subject: event.target.value })} placeholder="Email subject" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /><label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-400">Message</label><textarea value={compose.message} onChange={(event) => setCompose({ ...compose, message: event.target.value })} rows={14} placeholder="Write your message here..." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-7 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" /></div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4"><button onClick={() => void processCompose("draft")} disabled={busy} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 disabled:opacity-50">Save draft</button><button onClick={() => void processCompose("send")} disabled={busy || !compose.to.trim() || !compose.message.trim()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-black text-white disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Processing..." : "Send email"}</button></div></div> : selected ? <div className="flex-1 p-5 md:p-7"><div className="mb-5 flex justify-between"><button onClick={() => setSelectedId(null)} className="flex items-center font-bold text-indigo-600 lg:hidden"><ChevronLeft className="h-4 w-4" />Back</button><div className="ml-auto flex gap-2"><button title={selected.metadata?.isRead ? "Mark unread" : "Mark read"} onClick={() => void mutate(selected.id, selected.metadata?.isRead ? "unread" : "read")} className="rounded-lg border p-2 text-slate-500"><Mail className="h-4 w-4" /></button>{folder === "trash" ? <><button title="Restore" onClick={() => void mutate(selected.id, "restore")} className="rounded-lg border p-2 text-slate-500"><RotateCcw className="h-4 w-4" /></button><button title="Delete permanently" onClick={() => void remove(selected.id)} className="rounded-lg border border-red-100 p-2 text-red-600"><Trash2 className="h-4 w-4" /></button></> : <button title="Move to trash" onClick={() => void mutate(selected.id, "trash")} className="rounded-lg border p-2 text-slate-500"><Trash2 className="h-4 w-4" /></button>}</div></div><h2 className="text-2xl font-black text-slate-900">{selected.subject || "(No subject)"}</h2><div className="mt-5 border-b pb-5 text-sm"><p className="font-bold text-slate-800">{selected.from_name || selected.from_email || "Unknown sender"}</p><p className="text-xs text-slate-400">From: {selected.from_email || "unknown"} · To: {selected.to_email || "unknown"}</p></div><div className="mt-6 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{selected.text_body}</div>{selected.direction !== "outbound" && folder !== "trash" && <div className="mt-8"><textarea value={replyBody} onChange={(event) => setReplyBody(event.target.value)} rows={6} placeholder="Write a professional response..." className="w-full rounded-xl border p-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200" /><button onClick={async () => { setBusy(true); await reply(selected.id, replyBody); setReplyBody(""); setBusy(false); }} disabled={busy || !replyBody.trim()} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Sending..." : "Send reply"}</button></div>}</div> : <div className="m-auto text-center"><Mail className="mx-auto h-12 w-12 text-slate-200" /><p className="mt-4 font-bold text-slate-400">Select an email or compose a new one</p></div>}
    </section>
  </div>;
}
