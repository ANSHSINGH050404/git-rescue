'use client'
import { useState, useRef, useEffect } from "react";
import { Search, X, Bot, Loader2, Sparkles, Shield, ShieldOff, History, Trash2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { aiResponse, type AIResponse } from "../app/actions/ai";
import { SolutionCard } from "./SolutionCard";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [context, setContext] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [safeMode, setSafeMode] = useState(true);
  const [history, setHistory] = useState<AIResponse[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Load preferences and history
  useEffect(() => {
    const savedSafeMode = localStorage.getItem("git-safe-mode");
    if (savedSafeMode !== null) setSafeMode(savedSafeMode === "true");

    const savedHistory = localStorage.getItem("git-rescue-history");
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Handle shared solutions from URL
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get("solution");
    if (sharedData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(sharedData)));
        setResponse(decoded);
        setQuery(decoded.title);
      } catch (e) {
        console.error("Failed to decode shared solution", e);
      }
    }
  }, []);

  const saveToHistory = (res: AIResponse) => {
    setHistory(prev => {
      const updated = [res, ...prev.filter(h => h.id !== res.id)].slice(0, 10);
      localStorage.setItem("git-rescue-history", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("git-rescue-history");
  };

  const toggleSafeMode = () => {
    const newVal = !safeMode;
    setSafeMode(newVal);
    localStorage.setItem("git-safe-mode", String(newVal));
  };

  const handleSearch = async (e?: React.FormEvent, customQuery?: string) => {
    e?.preventDefault();
    const finalQuery = customQuery || query;
    if (!finalQuery.trim() || loadingAi) return;

    try {
      setLoadingAi(true);
      setError(null);
      setResponse(null);
      setShowHistory(false);
      
      const res = await aiResponse(finalQuery, context);
      if (res) {
        if (safeMode && res.severity === "nuclear") {
          setError("SAFE MODE: A 'Nuclear' solution was blocked. Disable Safe Mode to see destructive fixes.");
        } else {
          setResponse(res);
          saveToHistory(res);
          // Update URL for sharing
          try {
            const encoded = btoa(encodeURIComponent(JSON.stringify(res)));
            window.history.replaceState(null, "", `?solution=${encoded}`);
          } catch (e) {
            console.error("Failed to encode solution for sharing", e);
          }
        }
      } else {
        setError("Failed to generate a valid response. Please try rephrasing your question.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setContext("");
    setResponse(null);
    setError(null);
    window.history.replaceState(null, "", "/");
    inputRef.current?.focus();
  };

  const quickFixes = [
    { title: "Committed to wrong branch", icon: "🌱" },
    { title: "Undo last commit (keep changes)", icon: "⏪" },
    { title: "Accidentally added large files", icon: "📦" },
    { title: "Merge conflict in 20 files", icon: "⚔️" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-semibold tracking-wider uppercase">
            <Bot size={14} />
            Git Rescue Agent
          </div>
          <button 
            onClick={toggleSafeMode}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors ${safeMode ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'}`}
          >
            {safeMode ? <Shield size={14} /> : <ShieldOff size={14} />}
            {safeMode ? "Safe Mode ON" : "Safe Mode OFF"}
          </button>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-black dark:text-white">
          Git disaster? <span className="text-gray-400 dark:text-gray-600">Fixed.</span>
        </h1>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto group">
          <div className={`relative flex items-center bg-white dark:bg-black border-2 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm ${loadingAi ? 'border-black dark:border-white ring-4 ring-gray-50 dark:ring-gray-900 ring-opacity-50' : 'border-gray-200 dark:border-gray-800 group-focus-within:border-black dark:group-focus-within:border-white group-focus-within:shadow-xl dark:group-focus-within:shadow-gray-900/40 group-focus-within:-translate-y-1'}`}>
            <div className="pl-6 text-gray-400 dark:text-gray-600">
              <Search size={24} />
            </div>
            <input
              ref={inputRef}
              placeholder="I accidentally committed my node_modules..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loadingAi}
              className="w-full p-6 text-xl outline-none placeholder:text-gray-300 dark:placeholder:text-gray-700 bg-transparent text-black dark:text-white disabled:opacity-50"
            />
            <div className="pr-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                title="History"
              >
                <History size={20} />
              </button>
              {query && !loadingAi && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              )}
              <button
                type="submit"
                disabled={loadingAi || !query.trim()}
                className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${loadingAi || !query.trim() ? 'bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700' : 'bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 shadow-lg shadow-gray-200 dark:shadow-none'}`}
              >
                {loadingAi ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span className="hidden md:inline font-bold px-1">RESCUE ME</span>
                    <Sparkles size={20} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* History Dropdown */}
          {showHistory && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Recent Rescues</span>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                    <Trash2 size={12} /> Clear
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No history yet. Start rescuing!</div>
                ) : (
                  history.map((h) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => {
                        setResponse(h);
                        setQuery(h.title);
                        setShowHistory(false);
                      }}
                      className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900 border-b border-gray-100 dark:border-gray-900 last:border-0 transition-colors flex items-center gap-3"
                    >
                      <span className="text-2xl">{h.emoji}</span>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-bold text-sm truncate dark:text-white">{h.title}</div>
                        <div className="text-xs text-gray-500 truncate">{h.description}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </form>

        {/* Status Indicators */}
        <div className="mt-4 h-6 text-center">
          {loadingAi && (
            <p className="text-sm font-medium text-gray-400 dark:text-gray-600 animate-pulse flex items-center justify-center gap-2">
              <Bot size={14} className="animate-bounce" />
              Thinking... Git is complicated, but I'm on it.
            </p>
          )}
          {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
        </div>

        {/* Git Context Toggle */}
        <div className="max-w-2xl mx-auto flex justify-center pb-2">
          <button
            type="button"
            onClick={() => setShowContext(!showContext)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <FileText size={12} />
            {showContext ? "Hide Context" : "Add Context (Status/Log)"}
            {showContext ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {showContext && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
            <textarea
              placeholder="Paste git status, log, or terminal error for precise commands..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="w-full p-4 bg-white dark:bg-black border-2 border-gray-100 dark:border-gray-900 rounded-xl text-sm font-mono focus:border-black dark:focus:border-white outline-none transition-all resize-none shadow-inner"
            />
          </div>
        )}

        {/* Quick Fixes */}
        {!response && !loadingAi && (
          <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
            {quickFixes.map((fix) => (
              <button
                key={fix.title}
                onClick={() => {
                  setQuery(fix.title);
                  handleSearch(undefined, fix.title);
                }}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-black text-sm font-medium transition-all duration-200 flex items-center gap-2"
              >
                <span>{fix.icon}</span>
                {fix.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="pt-8">
        {response && (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-4 text-gray-300 dark:text-gray-800">
              <div className="h-[1px] w-12 bg-gray-200 dark:bg-gray-800" />
              <p className="text-sm font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600">Resolution Found</p>
              <div className="h-[1px] w-12 bg-gray-200 dark:bg-gray-800" />
            </div>
            <SolutionCard solution={response} />
          </div>
        )}
      </div>
    </div>
  );
}
