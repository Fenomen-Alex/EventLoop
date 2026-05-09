import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  RotateCw, 
  Globe, 
  Database, 
  Activity, 
  Layers,
  Cpu,
  History
} from 'lucide-react';

export default function Hub() {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_theme('colors.primary')]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Orchestrator</span>
          </div>
          <h2 className="text-4xl font-bold text-on-surface tracking-tight">Main Thread Architecture</h2>
          <p className="text-sm text-on-surface-variant max-w-2xl font-medium">
            Real-time inspection of the V8 engine execution stack and I/O polling queues.
          </p>
        </div>
        
        {/* Status Indicators */}
        <div className="bg-surface/30 border border-outline rounded-lg px-6 py-3 flex items-center gap-8 w-max">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase font-black text-on-surface-variant/50 tracking-widest">Engine Status</span>
            <span className="font-mono text-xs font-bold text-emerald tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
              IDLE_WAITING
            </span>
          </div>
          <div className="w-px h-8 bg-outline/50" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase font-black text-on-surface-variant/50 tracking-widest">Active Queue</span>
            <span className="font-mono text-xs font-bold text-primary tracking-tight">MICROTASKS</span>
          </div>
        </div>
      </div>

      {/* Visualization Grid */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        {/* JS Engine */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl relative z-10 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-orange/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange" />
              <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-orange/80">Call Stack</h3>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">LIFO</span>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 relative min-h-[180px] shadow-inner">
               <div className="flex flex-col-reverse gap-2 h-full justify-start">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded border border-orange/30 bg-orange/10 font-mono text-[11px] text-orange-200 flex justify-between items-center"
                  >
                    <span>Promise.then callback</span>
                    <span className="text-[9px] opacity-50">Active</span>
                  </motion.div>
                  <div className="p-3 rounded border border-slate-800 bg-slate-900/40 font-mono text-[11px] text-slate-500 opacity-50 flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    (anonymous)
                  </div>
               </div>
            </div>
            <div className="h-24 bg-slate-950 border border-slate-800 rounded-lg p-4 relative">
              <span className="text-[9px] uppercase font-bold text-slate-600 absolute top-3 left-4">Heap Allocation</span>
              <div className="mt-6 flex items-end h-full gap-1 opacity-20">
                {[30, 70, 50, 90, 40, 65, 35].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-orange rounded-t-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Web APIs */}
        <div className="lg:col-start-9 lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl relative z-10 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-blue/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue" />
              <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-blue/80">Web APIs / Background</h3>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">IO</span>
          </div>
          <div className="p-6 space-y-3">
            {[
              { label: 'Timer (100ms)', active: true, color: 'blue' },
              { label: 'Fetch (Pending)', active: false, color: 'blue' },
              { label: 'DOM Mutation', active: false, color: 'blue' },
            ].map((api, i) => (
              <div 
                key={i}
                className={cn(
                  "p-4 rounded-lg border flex flex-col gap-1 transition-all",
                  api.active 
                    ? "bg-blue/10 border-blue/40 border-dashed" 
                    : "bg-slate-950 border-slate-800 opacity-40"
                )}
              >
                <div className="flex justify-between items-center w-full">
                   <span className="text-[10px] uppercase font-bold text-blue/80 tracking-widest">Async Context</span>
                   {api.active && <span className="w-1.5 h-1.5 rounded-full bg-blue shadow-[0_0_8px_theme('colors.blue')]" />}
                </div>
                <span className="font-mono text-xs font-bold text-on-surface">{api.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Loop Core */}
        <div className="lg:col-start-5 lg:col-span-4 lg:row-span-2 flex items-center justify-center relative z-20 py-12 lg:py-0">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/10 blur-[60px] rounded-full scale-150 group-hover:scale-175 transition-transform duration-1000" />
            <div className="relative w-72 h-72 rounded-full border border-outline/30 flex items-center justify-center bg-background/40 backdrop-blur-xl">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-1.5 rounded-full border border-dashed border-primary/20"
              />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 rounded-full bg-primary shadow-[0_0_15px_theme('colors.primary')]" />
              </motion.div>

              <div className="w-24 h-24 rounded-full border-4 border-slate-800 border-t-primary flex flex-col items-center justify-center relative shadow-2xl bg-surface">
                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Looping</span>
              </div>
              
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-surface-bright/80 border border-outline px-4 py-1.5 rounded text-[10px] font-mono font-bold text-on-surface-variant flex items-center gap-2">
                <RotateCw size={12} className="animate-spin-slow text-primary" />
                ORCHESTRATOR_ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Microtasks */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl relative z-10 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-emerald/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald" />
              <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-emerald/80">Microtask Queue</h3>
            </div>
            <span className="text-[9px] font-black text-emerald bg-emerald/10 px-2 py-0.5 rounded uppercase tracking-tighter">Priority</span>
          </div>
          <div className="p-6">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              <div className="shrink-0 w-44 h-20 bg-emerald/10 border border-emerald/30 rounded p-4 flex flex-col">
                <span className="text-[9px] text-emerald uppercase font-bold tracking-tight">Promise Resolution</span>
                <span className="text-[11px] font-mono mt-1 text-on-surface leading-snug">() =&gt; log('Resolved')</span>
              </div>
              <div className="shrink-0 w-44 h-20 border border-dashed border-slate-800 rounded flex items-center justify-center text-slate-800 text-sm font-black">+</div>
            </div>
          </div>
        </div>

        {/* Macrotasks */}
        <div className="lg:col-start-9 lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-xl relative z-10 flex flex-col overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-cyan/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan" />
              <h3 className="font-mono text-[11px] font-black uppercase tracking-widest text-cyan/80">Macrotasks</h3>
            </div>
            <span className="text-[9px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded uppercase tracking-tighter">Queue</span>
          </div>
          <div className="p-6">
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              <div className="shrink-0 w-44 h-20 bg-cyan/10 border border-cyan/40 rounded p-4 flex flex-col">
                <span className="text-[9px] text-cyan uppercase font-bold tracking-tight">Timer Callback</span>
                <span className="text-[11px] font-mono mt-1 text-on-surface leading-snug">() =&gt; log('Timeout')</span>
              </div>
              <div className="shrink-0 w-44 h-20 border border-dashed border-slate-800 rounded flex items-center justify-center text-slate-800 text-sm font-black opacity-40">+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
