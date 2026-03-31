'use client'
import { GitCommit, GitBranch, ArrowRight, CornerDownRight } from "lucide-react";

export function VisualGitGraph({ severity }: { severity: "low" | "medium" | "high" | "nuclear" }) {
  const isDestructive = severity === "nuclear" || severity === "high";

  return (
    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-6 border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        <GitBranch size={14} />
        Conceptual Workflow
      </div>
      
      <div className="flex items-center justify-center gap-8 md:gap-16 flex-col md:flex-row py-4">
        {/* Before */}
        <div className="flex flex-col items-center gap-4 group">
          <div className="relative">
            <div className="w-1 bg-gray-200 dark:bg-gray-800 h-24 absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="space-y-4 relative">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400">
                <GitCommit size={16} />
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500">
                <GitCommit size={16} />
              </div>
              <div className={`w-10 h-10 rounded-full ${isDestructive ? 'bg-red-100 dark:bg-red-900/30 border-red-500' : 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'} border-4 flex items-center justify-center z-10 relative ring-4 ring-white dark:ring-black`}>
                <span className="text-[10px] font-bold text-black dark:text-white">HEAD</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400">Current State</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="text-gray-300 dark:text-gray-700 hidden md:block" size={32} />
          <CornerDownRight className="text-gray-300 dark:text-gray-700 block md:hidden" size={32} />
        </div>

        {/* After */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-1 bg-gray-200 dark:bg-gray-800 h-24 absolute left-1/2 -translate-x-1/2 top-0" />
            <div className="space-y-4 relative">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 opacity-50">
                <GitCommit size={16} />
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 border-green-500 border-4 flex items-center justify-center z-10 relative ring-4 ring-white dark:ring-black">
                <span className="text-[10px] font-bold text-black dark:text-white">HEAD</span>
              </div>
              {!isDestructive && (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-green-500 border-dashed flex items-center justify-center text-gray-500">
                  <GitCommit size={16} />
                </div>
              )}
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400">Proposed Fixed State</span>
        </div>
      </div>

      <div className="p-3 bg-white dark:bg-black/40 border border-gray-100 dark:border-gray-800 rounded-lg">
        <p className="text-[10px] text-gray-500 italic text-center">
          {isDestructive 
            ? "⚠ Head pointer moves to a previous state. Dangling commits may be unreachable."
            : "✨ Head pointer remains safe. Changes are kept or cleaned up responsibly."}
        </p>
      </div>
    </div>
  );
}
