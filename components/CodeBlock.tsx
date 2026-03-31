'use client'
import { Copy, Check, Info } from "lucide-react";
import { useState } from "react";

export function CodeBlock({ code, comment }: { code: string; comment?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex flex-col gap-2 p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg font-mono text-sm hover:border-black dark:hover:border-white transition-colors">
      <div className="flex justify-between items-start">
        <code className="text-black dark:text-gray-100 break-all whitespace-pre-wrap">{code}</code>
        <button
          onClick={copy}
          className="p-1 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={16} className="text-green-600 dark:text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      {comment && (
        <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400 italic text-xs">
          <Info size={12} className="mt-0.5" />
          <span>{comment}</span>
        </div>
      )}
    </div>
  );
}
