import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Terminal, 
  PlayCircle, 
  MemoryStick as Memory, 
  Search, 
  Settings, 
  HelpCircle,
  Play,
  FileText,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils'; // I'll create this helper

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'hub', label: 'Hub', icon: LayoutDashboard, path: '/' },
    { id: 'browser', label: 'Browser', icon: Globe, path: '/browser' },
    { id: 'node', label: 'Node.js', icon: Terminal, path: '/node' },
    { id: 'playground', label: 'Playground', icon: PlayCircle, path: '/playground' },
    { id: 'memory', label: 'Memory', icon: Memory, path: '/memory' },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/50 backdrop-blur-md border-b border-outline h-16 flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center text-on-primary font-bold text-xl group-hover:scale-105 transition-transform">JS</div>
            <div>
              <h1 className="text-lg font-bold text-on-surface leading-tight tracking-tight">LoopEngine</h1>
              <p className="text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-black">Performance Lab v3.0</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-all py-1 border-b-2",
                location.pathname === item.path ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-on-surface"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4 text-on-surface-variant">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald shadow-[0_0_8px_theme('colors.emerald')]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald">Internal_OK</span>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className={cn(
          "fixed left-0 top-16 bottom-12 z-40 bg-surface/30 backdrop-blur-xl border-r border-outline transition-all duration-300 flex flex-col py-6 px-4 gap-2",
          isSidebarOpen ? "w-60" : "w-20"
        )}>
          <div className="mb-6 px-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full bg-primary text-on-primary py-2.5 px-4 rounded-md font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary/10 mb-4"
            >
              <Play size={16} fill="currentColor" />
              {isSidebarOpen && <span className="uppercase tracking-widest text-[11px] font-black">Run Trace</span>}
            </button>
            <div className="h-px bg-outline/50 w-full mb-4" />
          </div>

          <div className="flex-1 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary border-l-2 border-primary" 
                    : "text-on-surface-variant hover:bg-surface-bright/40 hover:text-on-surface"
                )}
              >
                <item.icon size={18} className={cn("transition-colors", location.pathname === item.path ? "text-primary" : "text-on-surface-variant group-hover:text-primary")} />
                {isSidebarOpen && <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className={cn(
          "flex-1 transition-all duration-300 pb-12",
          isSidebarOpen ? "md:ml-60" : "md:ml-20"
        )}>
          <div className="p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-7rem)]">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="fixed bottom-0 w-full bg-background border-t border-outline px-6 py-2.5 flex items-center justify-between text-[11px] font-mono z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant uppercase tracking-widest opacity-50 font-bold">Engine Thread:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse shadow-[0_0_8px_theme('colors.emerald')]" />
              <span className="text-emerald font-bold">IDLE</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant uppercase tracking-widest opacity-50 font-bold">Queue:</span>
            <span className="text-on-surface font-medium">0 Microtasks | 0 Macrotasks</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="uppercase tracking-widest opacity-50 font-bold">Visual Simulation Only</span>
          <div className="w-px h-3 bg-outline" />
          <span className="text-on-surface uppercase font-bold tracking-tighter">v3.0.4 - PREVIEW</span>
        </div>
      </footer>
    </div>
  );
}
