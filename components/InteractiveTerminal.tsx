'use client'
import { useState, useEffect } from "react";
import { Terminal, Play, RotateCcw, CheckCircle2 } from "lucide-react";

export function InteractiveTerminal({ steps }: { steps: { code: string; comment?: string }[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [executed, setExecuted] = useState<number[]>([]);
  const [output, setOutput] = useState<string[]>(["$ git status", "On branch main", "nothing to commit, working tree clean"]);

  const runStep = (idx: number) => {
    if (executed.includes(idx)) return;
    
    const step = steps[idx];
    setOutput(prev => [...prev, `$ ${step.code}`, `> ${step.comment || "Executing..."}`, "Done."]);
    setExecuted(prev => [...prev, idx]);
    if (currentStep < steps.length - 1) {
      setCurrentStep(idx + 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setExecuted([]);
    setOutput(["$ git status", "On branch main", "nothing to commit, working tree clean"]);
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-800 shadow-2xl font-mono text-sm group">
      <div className="bg-[#323233] px-4 py-2 flex items-center justify-between border-b border-[#252526]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-400" />
          <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">Interactive Sandbox</span>
        </div>
        <button onClick={reset} className="text-gray-500 hover:text-white transition-colors">
          <RotateCcw size={14} />
        </button>
      </div>
      
      <div className="p-4 h-48 overflow-y-auto scrollbar-hide space-y-1">
        {output.map((line, i) => (
          <div key={i} className={line.startsWith('$') ? "text-green-400" : line.startsWith('>') ? "text-blue-400 italic" : "text-gray-300"}>
            {line}
          </div>
        ))}
        <div className="animate-pulse inline-block w-2 h-4 bg-gray-500 ml-1" />
      </div>

      <div className="p-4 bg-[#252526] border-t border-[#1e1e1e] flex flex-col gap-2">
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Click to simulate commands</p>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => runStep(idx)}
              disabled={executed.includes(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${executed.includes(idx) ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-[#37373d] text-gray-300 border border-[#454545] hover:bg-[#454545] active:scale-95'}`}
            >
              {executed.includes(idx) ? <CheckCircle2 size={12} /> : <Play size={12} />}
              {step.code.split(' ')[1] || "step"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
