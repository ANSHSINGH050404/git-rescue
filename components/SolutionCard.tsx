'use client'
import { type AIResponse } from "@/app/actions/ai";
import { SeverityBadge } from "./SeverityBadge";
import { CodeBlock } from "./CodeBlock";
import { InteractiveTerminal } from "./InteractiveTerminal";
import { VisualGitGraph } from "./VisualGitGraph";
import { Info, AlertTriangle, MessageSquare, Share2, TerminalSquare, GitBranch } from "lucide-react";
import { useState } from "react";

export function SolutionCard({ solution }: { solution: AIResponse }) {
  const [activeTab, setActiveTab] = useState<"steps" | "sandbox" | "visual">("steps");

  const share = () => {
    const encoded = btoa(encodeURIComponent(JSON.stringify(solution)));
    const url = `${window.location.origin}/?solution=${encoded}`;
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  return (
    <div className="max-w-3xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 dark:border-gray-900 flex items-start gap-6 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-black dark:via-black dark:to-gray-900/10">
          <div className="text-5xl bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 aspect-square flex items-center justify-center shadow-inner">
            {solution.emoji || "💡"}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-none">
                  {solution.title}
                </h2>
                <SeverityBadge severity={solution.severity} />
              </div>
              <button 
                onClick={share}
                className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-xl transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                title="Share Solution"
              >
                <Share2 size={20} />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              {solution.description}
            </p>
          </div>
        </div>

        {/* Tab Switching */}
        <div className="flex px-8 border-b border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-gray-900/10">
          <button 
            onClick={() => setActiveTab("steps")}
            className={`px-4 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === "steps" ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            Resolution Steps
          </button>
          <button 
            onClick={() => setActiveTab("sandbox")}
            className={`px-4 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === "sandbox" ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <TerminalSquare size={14} />
            Sandbox
          </button>
          <button 
            onClick={() => setActiveTab("visual")}
            className={`px-4 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === "visual" ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <GitBranch size={14} />
            Visualizer
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === "steps" && (
            <div className="space-y-6">
              <div className="space-y-4">
                {solution.steps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[41px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold flex items-center justify-center border-4 border-white dark:border-black shadow-sm">
                      {idx + 1}
                    </div>
                    <CodeBlock code={step.code} comment={step.comment} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sandbox" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <InteractiveTerminal steps={solution.steps} />
            </div>
          )}

          {activeTab === "visual" && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <VisualGitGraph severity={solution.severity} />
            </div>
          )}
        </div>

        {/* Footer info: Warning & Tags */}
        <div className="bg-gray-50/50 dark:bg-gray-900/20 border-t border-gray-100 dark:border-gray-900 p-8 space-y-6">
          {solution.warning && (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl flex gap-3 text-red-800 dark:text-red-400 animate-in zoom-in-95 duration-500">
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="font-bold text-sm uppercase tracking-wide">Warning: Destructive Action</p>
                <p className="text-sm leading-relaxed font-medium">{solution.warning}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {solution.note && (
              <div className="flex gap-3 text-gray-500 dark:text-gray-400">
                <MessageSquare className="flex-shrink-0 mt-0.5" size={16} />
                <p className="text-xs italic leading-relaxed">{solution.note}</p>
              </div>
            )}
            {solution.tags && solution.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-end">
                {solution.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded text-[10px] text-gray-400 dark:text-gray-500 font-mono uppercase tracking-tighter shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
