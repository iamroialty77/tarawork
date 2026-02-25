"use client";

import { useState } from "react";
import { PortfolioItem } from "../types";
import { Plus, Trash2, ExternalLink, Code, Image as ImageIcon, Briefcase, MessageSquare, Github, Layout, Sparkles } from "lucide-react";
import Link from "next/link";
import PortfolioPreview from "./PortfolioPreview";

interface PortfolioManagerProps {
  items: PortfolioItem[];
  onAdd: (item: Partial<PortfolioItem>) => void;
  onRemove: (id: string) => void;
  isOwner: boolean;
}

export default function PortfolioManager({ items, onAdd, onRemove, isOwner }: PortfolioManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: "",
    description: "",
    project_url: "",
    technologies: [],
  });
  const [techInput, setTechInput] = useState("");

  const handleAdd = () => {
    if (newItem.title) {
      onAdd(newItem);
      setNewItem({ title: "", description: "", project_url: "", technologies: [] });
      setIsAdding(false);
    }
  };

  const addTech = () => {
    if (techInput && !newItem.technologies?.includes(techInput)) {
      setNewItem({
        ...newItem,
        technologies: [...(newItem.technologies || []), techInput],
      });
      setTechInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Professional Portfolio</h3>
          <p className="text-sm text-slate-500">Ipakita ang iyong mga pinakamahusay na gawa.</p>
        </div>
        {isOwner && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            <Plus className="w-4 h-4" />
            Magdagdag
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Project Title</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Pangalan ng Proyekto"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Project URL (Optional)</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={newItem.project_url}
                onChange={(e) => setNewItem({ ...newItem, project_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Description</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
              rows={3}
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              placeholder="Ano ang nagawa mo sa proyektong ito?"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Technologies Used</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTech()}
                placeholder="e.g. React, Node.js"
              />
              <button
                type="button"
                onClick={addTech}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {newItem.technologies?.map((tech) => (
                <span key={tech} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newItem.title}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              I-save Proyekto
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
            <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Wala pang portfolio items na nakalista.</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <PortfolioPreview item={item} />
            {isOwner && (
              <button
                onClick={() => onRemove(item.id)}
                className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur shadow-xl text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
