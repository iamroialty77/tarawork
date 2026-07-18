"use client";

import { useEffect, useRef, useState } from "react";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const toolbarButton =
  "rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-black text-slate-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800";

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"visual" | "html">("visual");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value;
  }, [value, mode]);

  const run = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML || "");
  };

  const addLink = () => {
    const url = window.prompt("Enter the link URL (https://...):");
    if (!url) return;
    if (!/^(https?:\/\/|mailto:|\/)/i.test(url.trim())) {
      window.alert("Use a valid http(s), mailto, or internal URL.");
      return;
    }
    run("createLink", url.trim());
  };

  const addTable = () => {
    const rowInput = window.prompt("Number of rows (1–10):", "3");
    if (rowInput === null) return;
    const columnInput = window.prompt("Number of columns (1–8):", "3");
    if (columnInput === null) return;
    const rows = Math.min(10, Math.max(1, Number.parseInt(rowInput, 10) || 1));
    const columns = Math.min(8, Math.max(1, Number.parseInt(columnInput, 10) || 1));

    const header = `<tr>${Array.from({ length: columns }, (_, index) => `<th>Heading ${index + 1}</th>`).join("")}</tr>`;
    const body = Array.from({ length: Math.max(0, rows - 1) }, () =>
      `<tr>${Array.from({ length: columns }, () => "<td>Cell</td>").join("")}</tr>`,
    ).join("");
    run("insertHTML", `<table><thead>${header}</thead><tbody>${body}</tbody></table><p><br></p>`);
  };

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-100 px-3 py-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Editor mode</span>
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`rounded-md px-3 py-1.5 text-xs font-black ${mode === "visual" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`rounded-md px-3 py-1.5 text-xs font-black ${mode === "html" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
          >
            HTML
          </button>
        </div>
      </div>
      {mode === "visual" && <div className="flex flex-wrap gap-1.5 border-b border-slate-200 bg-slate-50 p-2.5">
        <select
          aria-label="Text style"
          defaultValue="p"
          onChange={(event) => run("formatBlock", event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-600"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <button type="button" className={toolbarButton} onClick={() => run("bold")} title="Bold"><strong>B</strong></button>
        <button type="button" className={toolbarButton} onClick={() => run("italic")} title="Italic"><em>I</em></button>
        <button type="button" className={toolbarButton} onClick={() => run("underline")} title="Underline"><u>U</u></button>
        <button type="button" className={toolbarButton} onClick={() => run("strikeThrough")} title="Strikethrough"><s>S</s></button>
        <button type="button" className={toolbarButton} onClick={() => run("insertUnorderedList")}>• List</button>
        <button type="button" className={toolbarButton} onClick={() => run("insertOrderedList")}>1. List</button>
        <button type="button" className={toolbarButton} onClick={addLink}>Link</button>
        <button type="button" className={toolbarButton} onClick={() => run("unlink")}>Unlink</button>
        <button type="button" className={toolbarButton} onClick={addTable}>Table</button>
        <button type="button" className={toolbarButton} onClick={() => run("justifyLeft")}>Left</button>
        <button type="button" className={toolbarButton} onClick={() => run("justifyCenter")}>Center</button>
        <button type="button" className={toolbarButton} onClick={() => run("justifyRight")}>Right</button>
        <button type="button" className={toolbarButton} onClick={() => run("undo")}>Undo</button>
        <button type="button" className={toolbarButton} onClick={() => run("redo")}>Redo</button>
        <button type="button" className={toolbarButton} onClick={() => run("removeFormat")}>Clear format</button>
      </div>}
      {mode === "visual" ? (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
          className="rich-text-editor min-h-80 px-5 py-4 text-sm font-medium leading-7 text-slate-700 outline-none"
          data-placeholder="Start writing your article..."
        />
      ) : (
        <div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            spellCheck={false}
            rows={20}
            className="min-h-80 w-full resize-y bg-slate-950 px-5 py-4 font-mono text-sm leading-7 text-emerald-200 outline-none"
            placeholder={'<h1>Article heading</h1>\n<p>Write your article here.</p>'}
          />
          <p className="border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400">
            Allowed HTML: headings, paragraphs, links, lists, tables, blockquotes, bold, italic, underline, and alignment.
          </p>
        </div>
      )}
    </div>
  );
}
