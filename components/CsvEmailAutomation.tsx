"use client";

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Cloud, FileSpreadsheet, Link2, LogOut, Mail, Send, Upload, X } from "lucide-react";

type CsvRow = Record<string, string>;
type GoogleSpreadsheet = { id: string; name: string; modifiedTime?: string };
type GoogleSheetTab = { title: string; sheetId?: number };
type GoogleAccount = { name: string; email: string; photoUrl?: string };

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
    const normalized = header.replace(/[^\p{L}\p{N}_-]+/gu, "_").replace(/^_+|_+$/g, "").toLowerCase() || `column_${index + 1}`;
    return rawHeaders.slice(0, index).some((item) => item.toLowerCase() === header.toLowerCase()) ? `${normalized}_${index + 1}` : normalized;
  });
  const rows = records.slice(0, 500).map((values) => Object.fromEntries(headers.map((header, index) => [header, (values[index] || "").trim()])));
  return { headers, rows, wasLimited: records.length > 500 };
}

const renderTemplate = (template: string, alias: string, row?: CsvRow) => {
  if (!row) return template;
  return template
    .replace(/\{\{\s*([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_-]+)\s*\}\}/g, (match, source, column) =>
      source.toLowerCase() === alias.toLowerCase() && column in row ? row[column] : match)
    .replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (match, column) => column in row ? row[column] : match);
};

export default function CsvEmailAutomation({ close }: { close: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [fileName, setFileName] = useState("");
  const [alias, setAlias] = useState("contacts");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [emailColumn, setEmailColumn] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleAccount, setGoogleAccount] = useState<GoogleAccount | null>(null);
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [spreadsheets, setSpreadsheets] = useState<GoogleSpreadsheet[]>([]);
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [sheetTabs, setSheetTabs] = useState<GoogleSheetTab[]>([]);
  const [sheetName, setSheetName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const selectedRows = useMemo(() => selectedIndexes.map((index) => rows[index]).filter(Boolean), [rows, selectedIndexes]);
  const validRows = useMemo(() => selectedRows.filter((row) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[emailColumn] || "")), [selectedRows, emailColumn]);
  const uniqueCount = new Set(validRows.map((row) => row[emailColumn].toLowerCase())).size;
  const sample = validRows[0] || selectedRows[0];

  const loadGoogle = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/google-sheets", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load Google Sheets.");
      setGoogleConnected(Boolean(data.connected)); setGoogleAccount(data.account || null); setSpreadsheets(data.spreadsheets || []); setShowGoogle(true);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load Google Sheets."); }
    finally { setBusy(false); }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("googleSheets") === "connected") void loadGoogle();
  }, [loadGoogle]);

  const connectGoogle = () => {
    window.location.assign("/api/admin/google-sheets/connect");
  };

  const disconnectGoogle = async () => {
    if (!window.confirm(`Disconnect ${googleAccount?.email || "this Google account"} from your CSV Email Campaign?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/google-sheets", { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to disconnect Google Sheets.");
      setGoogleConnected(false); setGoogleAccount(null); setSpreadsheets([]); setSpreadsheetId(""); setSheetTabs([]); setSheetName("");
      setNotice("Your Google account was disconnected from Google Sheets.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to disconnect Google Sheets."); }
    finally { setBusy(false); }
  };

  const chooseSpreadsheet = async (id: string) => {
    setSpreadsheetId(id); setSheetName(""); setSheetTabs([]); setBusy(true); setError("");
    if (!id) { setBusy(false); return; }
    try {
      const response = await fetch(`/api/admin/google-sheets?spreadsheetId=${encodeURIComponent(id)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load worksheets.");
      setSheetTabs(data.sheets || []);
      if (data.sheets?.length === 1) setSheetName(data.sheets[0].title);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to load worksheets."); }
    finally { setBusy(false); }
  };

  const importGoogleSheet = async (targetSpreadsheetId = spreadsheetId, targetSheetName = sheetName, spreadsheetLabel?: string) => {
    if (!targetSpreadsheetId || !targetSheetName) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/google-sheets?spreadsheetId=${encodeURIComponent(targetSpreadsheetId)}&sheetName=${encodeURIComponent(targetSheetName)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to import worksheet.");
      const importedHeaders: string[] = data.headers || [];
      const importedRows: CsvRow[] = data.rows || [];
      const selectedSpreadsheet = spreadsheets.find((sheet) => sheet.id === targetSpreadsheetId);
      const sourceName = spreadsheetLabel || selectedSpreadsheet?.name || "Google Sheet";
      const detected = importedHeaders.find((header) => /^(email|email_address|emailaddress|e_mail)$/i.test(header)) || importedHeaders.find((header) => header.includes("email")) || "";
      setHeaders(importedHeaders); setRows(importedRows); setSelectedIndexes([]); setEmailColumn(detected);
      setFileName(`${sourceName} - ${targetSheetName}`);
      setAlias(sourceName.replace(/[^a-zA-Z0-9_-]+/g, "_").toLowerCase() || "google_sheet");
      setShowComposer(false); setShowGoogle(false);
      setNotice(`${importedRows.length} rows imported from Google Sheets${data.wasLimited ? " (first 500 only)" : ""}.`);
      return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to import worksheet."); return false; }
    finally { setBusy(false); }
  };

  const importGoogleLink = async () => {
    const match = googleSheetUrl.trim().match(/^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9_-]{10,200})(?:\/|$)/i);
    if (!match) { setError("Paste a valid Google Sheets URL."); return; }
    const id = match[1];
    const gidMatch = googleSheetUrl.match(/(?:[?#&]gid=)(\d+)/i);
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/admin/google-sheets?spreadsheetId=${encodeURIComponent(id)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to open this Google Sheet.");
      const tabs: GoogleSheetTab[] = data.sheets || [];
      if (!tabs.length) throw new Error("No worksheet was found in this spreadsheet.");
      const selectedTab = (gidMatch ? tabs.find((tab) => String(tab.sheetId) === gidMatch[1]) : undefined) || tabs[0];
      setSpreadsheetId(id); setSheetTabs(tabs); setSheetName(selectedTab.title);
      if (await importGoogleSheet(id, selectedTab.title, data.spreadsheetName || "Google Sheet")) setGoogleSheetUrl("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to import this Google Sheet."); }
    finally { setBusy(false); }
  };

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(""); setNotice(""); setShowComposer(false);
    if (file.size > 2 * 1024 * 1024) { setError("CSV files must be 2 MB or smaller."); return; }
    try {
      const parsed = parseCsv(await file.text());
      const base = file.name.replace(/\.csv$/i, "").replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase() || "contacts";
      const detected = parsed.headers.find((header) => /^(email|email_address|emailaddress|e_mail)$/i.test(header)) || parsed.headers.find((header) => header.includes("email")) || "";
      setFileName(file.name); setAlias(base); setHeaders(parsed.headers); setRows(parsed.rows); setEmailColumn(detected); setSelectedIndexes([]);
      setNotice(`${parsed.rows.length} rows loaded${parsed.wasLimited ? " (first 500 only)" : ""}. Select the recipients for this campaign.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to read this CSV."); }
  };

  const insertVariable = (header: string) => {
    const token = `{{${header}}}`;
    const textarea = messageRef.current;
    if (!textarea) { setMessage((value) => `${value}${token}`); return; }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setMessage((value) => `${value.slice(0, start)}${token}${value.slice(end)}`);
    requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(start + token.length, start + token.length); });
  };

  const send = async () => {
    if (!window.confirm(`Send one personalized email to ${uniqueCount} selected recipients? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/csv-email-automation", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, emailColumn, subject, message, rows: selectedRows }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Campaign could not be sent.");
      setNotice(`Campaign complete: ${data.sent} sent${data.failed ? `, ${data.failed} failed` : ""}${data.duplicatesSkipped ? `, ${data.duplicatesSkipped} duplicates skipped` : ""}.`);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Campaign could not be sent."); }
    finally { setBusy(false); }
  };

  return <div className="absolute inset-0 z-20 min-h-[820px] overflow-y-auto bg-slate-50">
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-7">
      <div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-2 text-blue-600"><FileSpreadsheet className="h-5 w-5" /></div><div><h2 className="text-lg font-black text-slate-900">CSV Email Campaign</h2><p className="text-xs font-medium text-slate-500">{rows.length ? `${selectedIndexes.length} of ${rows.length} selected` : "Upload a contact list to begin"}</p></div></div>
      <button type="button" onClick={close} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
    </header>
    {notice && <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 md:px-7"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
    {error && <div className="flex items-center gap-2 border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm font-bold text-rose-700 md:px-7"><AlertCircle className="h-4 w-4" />{error}</div>}
    <div className="p-5 md:p-7">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 p-4">
        <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={upload} className="hidden" />
        <div className="flex min-w-0 items-center gap-3"><div className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm"><Upload className="h-5 w-5" /></div><div className="min-w-0"><p className="truncate text-sm font-black text-slate-900">{fileName || "Upload contact CSV"}</p><p className="text-[10px] font-semibold text-slate-400">Maximum 500 rows · 2 MB</p></div></div>
        <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void loadGoogle()} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-xs font-black text-blue-700 hover:bg-blue-50"><Cloud className="h-4 w-4" /> Google Sheets</button><button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-700">{fileName ? "Replace CSV" : "Choose CSV"}</button></div>
      </section>

      {showGoogle && <section className="mt-4 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3"><div><h3 className="font-black text-slate-900">Import from Google Sheets</h3><p className="text-xs text-slate-500">{googleConnected ? `Connected as ${googleAccount?.email || "your Google account"}. Only your spreadsheets are shown.` : "Connect your Google account to access your private spreadsheets."}</p></div><button onClick={() => setShowGoogle(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
        {!googleConnected ? <button type="button" onClick={connectGoogle} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white"><Cloud className="h-4 w-4" /> Connect Google Sheets</button> :
          <><div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4"><label className="text-[10px] font-black uppercase tracking-wider text-blue-700">Paste Google Sheets link</label><div className="mt-2 flex flex-col gap-2 sm:flex-row"><div className="relative min-w-0 flex-1"><Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" /><input type="url" value={googleSheetUrl} onChange={(event) => setGoogleSheetUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void importGoogleLink(); } }} placeholder="https://docs.google.com/spreadsheets/d/..." className="w-full rounded-xl border border-blue-200 bg-white py-3 pl-10 pr-4 text-sm font-semibold outline-none focus:border-blue-400" /></div><button type="button" onClick={() => void importGoogleLink()} disabled={busy || !googleSheetUrl.trim()} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40">{busy ? "Importing..." : "Parse & import"}</button></div><p className="mt-2 text-[11px] font-medium text-blue-600">The worksheet in the link will be detected automatically. Without a worksheet ID, the first tab will be imported.</p></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3"><div className="flex items-center gap-3">{googleAccount?.photoUrl ? <img src={googleAccount.photoUrl} alt="" className="h-9 w-9 rounded-full" /> : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-emerald-700">{(googleAccount?.name || googleAccount?.email || "G").charAt(0).toUpperCase()}</div>}<div><p className="text-xs font-black text-emerald-900">{googleAccount?.name || "Google account"}</p><p className="text-[11px] font-semibold text-emerald-700">{googleAccount?.email}</p></div></div><button type="button" onClick={() => void disconnectGoogle()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-black text-rose-600 hover:bg-rose-50 disabled:opacity-50"><LogOut className="h-3.5 w-3.5" /> Sign out Google</button></div><div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Spreadsheet<select value={spreadsheetId} onChange={(event) => void chooseSpreadsheet(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal"><option value="">Select spreadsheet</option>{spreadsheets.map((sheet) => <option key={sheet.id} value={sheet.id}>{sheet.name}</option>)}</select></label><label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Worksheet<select value={sheetName} onChange={(event) => setSheetName(event.target.value)} disabled={!spreadsheetId} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-bold normal-case tracking-normal disabled:opacity-50"><option value="">Select worksheet</option>{sheetTabs.map((sheet) => <option key={sheet.sheetId ?? sheet.title} value={sheet.title}>{sheet.title}</option>)}</select></label><button type="button" onClick={() => void importGoogleSheet()} disabled={busy || !spreadsheetId || !sheetName} className="self-end rounded-xl bg-slate-900 px-5 py-3 text-sm font-black text-white disabled:opacity-40">Import</button></div></>}
      </section>}

      {headers.length > 0 && <>
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 p-4">
            <div><h3 className="text-sm font-black text-slate-900">CSV recipients</h3><p className="text-xs text-slate-500">Choose the rows that should receive this campaign.</p></div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Email column<select value={emailColumn} onChange={(event) => setEmailColumn(event.target.value)} className="ml-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold normal-case tracking-normal text-slate-800"><option value="">Select column</option>{headers.map((header) => <option key={header}>{header}</option>)}</select></label>
          </div>
          <div className="max-h-[430px] overflow-auto"><table className="w-full min-w-max text-left text-xs"><thead className="sticky top-0 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr><th className="w-12 px-4 py-3"><input type="checkbox" checked={rows.length > 0 && selectedIndexes.length === rows.length} onChange={(event) => setSelectedIndexes(event.target.checked ? rows.map((_, index) => index) : [])} className="h-4 w-4 accent-blue-600" /></th><th className="w-14 px-2 py-3">#</th>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{rows.map((row, index) => <tr key={index} className={selectedIndexes.includes(index) ? "bg-blue-50/50" : "hover:bg-slate-50"}><td className="px-4 py-3"><input type="checkbox" checked={selectedIndexes.includes(index)} onChange={(event) => setSelectedIndexes((current) => event.target.checked ? [...current, index] : current.filter((value) => value !== index))} className="h-4 w-4 accent-blue-600" /></td><td className="px-2 py-3 font-bold text-slate-400">{index + 1}</td>{headers.map((header) => <td key={header} className="max-w-72 truncate px-4 py-3 text-slate-700">{row[header] || "—"}</td>)}</tr>)}</tbody>
          </table></div>
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3"><p className="text-xs font-bold text-slate-500">{selectedIndexes.length} selected · {validRows.length} valid email rows</p><button type="button" onClick={() => setShowComposer(true)} disabled={!emailColumn || validRows.length === 0} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-black text-white disabled:opacity-40"><Mail className="h-4 w-4" /> Compose message</button></div>
        </section>

        {showComposer && <section className="mt-5 grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <div className="flex items-center justify-between gap-3"><div><h3 className="font-black text-slate-900">Compose campaign</h3><p className="text-xs text-slate-500">{uniqueCount} unique recipients</p></div><button onClick={() => setShowComposer(false)} className="text-xs font-black text-slate-500">Close composer</button></div>
            <label className="mt-4 block text-xs font-black uppercase tracking-wider text-slate-500">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Your email subject" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-400" /></label>
            <div className="mt-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">Insert CSV field</p><div className="mt-2 flex flex-wrap gap-2">{headers.map((header) => <button type="button" key={header} onClick={() => insertVariable(header)} className="rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1.5 font-mono text-[11px] font-bold text-blue-700 hover:border-blue-300 hover:bg-blue-100">{`{{${header}}}`}</button>)}</div></div>
            <label className="mt-4 block text-xs font-black uppercase tracking-wider text-slate-500">Message<textarea ref={messageRef} value={message} onChange={(event) => setMessage(event.target.value)} rows={9} placeholder="Click a CSV field above to insert it into your message." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-7 outline-none focus:border-blue-400" /></label>
          </div>
          <aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">First selected recipient</p><p className="mt-3 truncate text-xs font-bold text-slate-500">To: {sample?.[emailColumn] || "—"}</p><p className="mt-2 border-b border-slate-200 pb-3 text-sm font-black text-slate-900">{renderTemplate(subject, alias, sample) || "Subject preview"}</p><p className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap text-sm font-medium leading-6 text-slate-600">{renderTemplate(message, alias, sample) || "Message preview"}</p><button type="button" onClick={() => void send()} disabled={busy || !subject.trim() || !message.trim() || uniqueCount === 0} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white disabled:opacity-40"><Send className="h-4 w-4" />{busy ? "Sending..." : `Send to ${uniqueCount}`}</button></aside>
        </section>}
      </>}
    </div>
  </div>;
}
