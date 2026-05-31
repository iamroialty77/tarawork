"use client";

import { useState } from "react";
import { PortfolioItem } from "../types";
import { Plus, Trash2, Briefcase, Sparkles, Brain } from "lucide-react";
import PortfolioPreview from "./PortfolioPreview";
import AIAgent from "./AIAgent";

interface PortfolioManagerProps {
  items: PortfolioItem[];
  onAdd: (item: Partial<PortfolioItem>) => void;
  onUpdate?: (item: PortfolioItem) => void;
  onRemove: (id: string) => void;
  isOwner: boolean;
}

export default function PortfolioManager({ items, onAdd, onUpdate, onRemove, isOwner }: PortfolioManagerProps) {
  const [isAuditing, setIsAuditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: "",
    description: "",
    project_url: "",
    technologies: [],
  });
  const [techInput, setTechInput] = useState("");

  const handleAdd = () => {
    if (editingItem && onUpdate) {
      onUpdate({ ...editingItem, ...newItem } as PortfolioItem);
      setEditingItem(null);
      setNewItem({ title: "", description: "", project_url: "", technologies: [] });
      setIsAdding(false);
    } else if (newItem.title) {
      onAdd(newItem);
      setNewItem({ title: "", description: "", project_url: "", technologies: [] });
      setIsAdding(false);
    }
  };

  const startEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setNewItem({
      title: item.title,
      description: item.description,
      project_url: item.project_url,
      technologies: item.technologies,
    });
    setIsAdding(true);
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
      <AIAgent 
        isOpen={isAuditing} 
        onClose={() => setIsAuditing(false)} 
        mode="audit" 
        targetData={items} 
      />

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Professional Portfolio</h3>
          <p className="text-sm text-slate-500">Showcase your best work.</p>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsAuditing(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-md group"
            >
              <Brain className="w-4 h-4 text-indigo-400 group-hover:animate-pulse" />
              Request AI Audit
            </button>
          )}
          {isOwner && !isAdding && (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              <Plus className="w-4 h-4" />
              Magdagdag
            </button>
          )}
        </div>
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
                placeholder="Project Name"
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
              placeholder="What did you do in this project?"
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
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingItem(null);
                setNewItem({ title: "", description: "", project_url: "", technologies: [] });
              }}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newItem.title}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {editingItem ? "I-update Proyekto" : "I-save Proyekto"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
            <Briefcase className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No portfolio items listed yet.</p>
          </div>
        )}
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <PortfolioPreview item={item} />
            {isOwner && (
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-2 bg-white/90 backdrop-blur shadow-xl text-indigo-600 rounded-xl hover:bg-white transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="p-2 bg-white/90 backdrop-blur shadow-xl text-red-500 rounded-xl hover:bg-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
