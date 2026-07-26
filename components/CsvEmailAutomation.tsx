"use client";

import { ChangeEvent, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Send, Upload, X } from "lucide-react";

type CsvRow = Record<string, string>;

function parseCsv(text: string) {
  const records: string[][] = [];
  let row: string[] = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted;
    } else if (char === "," && !quoted) { row.push(field); field = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field); if (row.some((value) => value.trim())) records.push(row); row = []; field = "";
    } else field += char;
  }
  row.push(field); if (row.some((value) => value.trim())) records.push(row);
  if (quoted) throw new Error("The CSV contains an unclosed quoted value.");
  const rawHeaders = records.shift()?.map((value) => value.replace(/^\uFEFF/, "").trim()) || [];
  if (!rawHeaders.length || rawHeaders.some((header) => !header)) throw new Error("Every CSV column must have a header.");
  const headers = rawHeaders.map((header, index) => {
    const clean = header.replace(/[^\p{L}\p{N}_-]+/gu, "_").replace(/^_+|_+$/g, "").toLowerCase() || `column_${index + 1}`;
    return rawHeaders.slice(0, index).some((item) => item.toLowerCase() === header.toLowerCase()) ? `${clean}_${index + 1}` : clean;
  });
  const rows = records.slice(0, 500).map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
  return { headers, rows, wasLimited: records.length > 500 };
}

const renderTemplate = (template: string, alias: string, row?: CsvRow) =>
  template.replace(/\{\{\s*([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\s*\}\}/g, (match, source, column) =>
    source.toLowerCase() === alias.toLowerCase() && row && column in row ? row[column] : match);

export default function CsvEmailAutomation({ close }: { close: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");
  const [alias, setAlias] = useState("contacts");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [emailColumn, setEmailColumn] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const validRows = useMemo(() => rows.filter((row) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[emailColumn] || "")), [rows, emailColumn]);
  const duplicateCount = validRows.length - new Set(validRows.map((row) => row[emailColumn].toLowerCase())).size;
  const sample = validRows[0] || rows[0];

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(""); setNotice("");
    if (file.size > 2 * 1024 * 1024) { setError("CSV files must be 2 MB or smaller."); return; }
    try {
      const parsed = parseCsv(await file.text());
      const base = file.name.replace(/\.csv$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase() || "contacts";
      const detected = parsed.headers.find((header) => /^(email|email_address|emailaddress|e_mail)$/i.test(header)) || parsed.headers.find((header) => header.includes("email")) || "";
      setFileName(file.name); setAlias(base); setHeaders(parsed.headers); setRows(parsed.rows); setEmailColumn(detected);
      setNotice(`${parsed.rows.length} rows loaded${parsed.wasLimited ? " (first 500 only)" : ""}. Select the email column and review your campaign.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to read this CSV."); }
  };

  const send = async () => {
    if (!window.confirm(`Send one personalized email to ${new Set(validRows.map((row) => row[emailColumn].toLowerCase())).size} unique recipients? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/csv-email-automation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, emailColumn, subject, message, rows }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Campaign could not be sent.");
      setNotice(`Campaign complete: ${data.sent} sent${data.failed ? `, ${data.failed} failed` : ""}${data.duplicatesSkipped ? `, ${data.duplicatesSkipped} duplicates skipped` : ""}.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Campaign could not be sent."); }
    finally { setBusy(false); }
  };

  return <div className="absolute inset-0 z-20 overflow-y-auto bg-white">
    <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <div><div className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-blue-600" /><h2 className="text-xl font-black text-slate-900">CSV Email Campaign</h2></div><p className="mt-1 text-sm font-medium text-slate-500">Send safe, personalized emails from an uploaded contact list.</p></div>
      <button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
    </div>
    {notice && <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 md:px-8"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
    {error && <div className="flex items-center gap-2 border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 md:px-8"><AlertCircle className="h-4 w-4" />{error}</div>}
    <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] md:p-8">
      <div>
        <section className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 p-6 text-center">
          <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={upload} className="hidden" />
          <div className="mx-auto w-fit rounded-2xl bg-white p-3 text-blue-600 shadow-sm"><Upload className="h-6 w-6" /></div>
          <h3 className="mt-3 font-black text-slate-900">{fileName || "Upload your contact CSV"}</h3>
          <p className="mt-1 text-xs font-medium text-slate-500">Header row required · maximum 500 contacts · 2 MB</p>
          <button type="button" onClick={() => inputRef.current?.click()} className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700">{fileName ? "Replace CSV" : "Choose CSV file"}</button>
        </section>
        {headers.length > 0 && <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Template name<input value={alias} onChange={(e) => setAlias(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase())} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold normal-case tracking-normal" /></label>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email column<select value={emailColumn} onChange={(e) => setEmailColumn(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal"><option value="">Select a column</option>{headers.map((header) => <option key={header}>{header}</option>)}</select></label>
          </div>
          <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Subject<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={`Hello {{${alias}.name}}`} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold normal-case tracking-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
          <label className="mt-5 block text-xs font-black uppercase tracking-wider text-slate-500">Professional message<textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={10} placeholder={`Hello {{${alias}.name}},\n\nWrite your message here.`} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-7 normal-case tracking-normal outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" /></label>
          <div className="mt-3 flex flex-wrap gap-2">{headers.map((header) => <button type="button" key={header} onClick={() => setMessage((value) => `${value}{{${alias}.${header}}}`)} className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-mono text-[11px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700">{`{{${alias}.${header}}}`}</button>)}</div>
        </>}
      </div>
      <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="font-black text-slate-900">Campaign review</h3>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-white p-3"><p className="text-lg font-black">{rows.length}</p><p className="text-[9px] font-black uppercase text-slate-400">Rows</p></div><div className="rounded-xl bg-white p-3"><p className="text-lg font-black text-emerald-600">{validRows.length}</p><p className="text-[9px] font-black uppercase text-slate-400">Valid</p></div><div className="rounded-xl bg-white p-3"><p className="text-lg font-black text-amber-600">{rows.length - validRows.length}</p><p className="text-[9px] font-black uppercase text-slate-400">Invalid</p></div></div>
        {duplicateCount > 0 && <p className="mt-3 text-xs font-bold text-amber-700">{duplicateCount} duplicate email{duplicateCount === 1 ? "" : "s"} will be skipped.</p>}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">First-recipient preview</p><p className="mt-3 text-xs font-bold text-slate-500">To: {sample?.[emailColumn] || "—"}</p><p className="mt-2 border-b border-slate-100 pb-3 text-sm font-black text-slate-900">{renderTemplate(subject, alias, sample) || "Your subject appears here"}</p><p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-600">{renderTemplate(message, alias, sample) || "Your personalized message appears here."}</p></div>
        <button type="button" onClick={() => void send()} disabled={busy || !alias || !emailColumn || !subject.trim() || !message.trim() || validRows.length === 0} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" />{busy ? "Sending campaign..." : `Send to ${new Set(validRows.map((row) => row[emailColumn]?.toLowerCase())).size} recipients`}</button>
        <p className="mt-3 text-center text-[10px] font-medium leading-4 text-slate-400">Each recipient receives a separate email. Addresses are never exposed to other recipients.</p>
      </aside>
    </div>
  </div>;
}
