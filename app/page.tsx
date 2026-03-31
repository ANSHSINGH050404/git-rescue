import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-black relative overflow-hidden flex items-center justify-center transition-colors duration-300">
      {/* Mesh Background for modern feel */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <SearchBar />
      </div>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center text-gray-300 dark:text-gray-700 text-sm font-mono tracking-tighter">
        Built with Google GenAI SDK & Next.js 15
      </footer>
    </main>
  );
}
