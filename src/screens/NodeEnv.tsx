import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  Clock, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Activity,
  Zap,
  Server,
  Network,
  Cpu,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function NodeEnv() {
  const phases = [
    { 
      id: 'timers', 
      title: 'Timers', 
      icon: Clock, 
      color: 'text-primary', 
      borderColor: 'border-primary',
      desc: 'Executes callbacks scheduled by setTimeout() and setInterval().',
      types: 'setTimeout, setInterval'
    },
    { 
      id: 'pending', 
      title: 'Pending Callbacks', 
      icon: Network, 
      color: 'text-slate-500', 
      borderColor: 'border-slate-800',
      desc: 'Executes I/O callbacks deferred to the next loop iteration (e.g. TCP errors).',
      types: 'ECONNREFUSED'
    },
    { 
      id: 'idle', 
      title: 'Idle / Prepare', 
      icon: Activity, 
      color: 'text-slate-500', 
      borderColor: 'border-slate-800',
      desc: 'Internal only housekeeping. No application code executed here.'
    },
    { 
      id: 'poll', 
      title: 'Poll', 
      icon: RotateCw, 
      color: 'text-orange', 
      borderColor: 'border-orange',
      active: true,
      desc: 'Retrieves new I/O events; executes I/O related callbacks. Blocks if empty.',
      types: 'I/O callbacks, incoming'
    },
    { 
      id: 'check', 
      title: 'Check', 
      icon: CheckCircle2, 
      color: 'text-blue', 
      borderColor: 'border-blue',
      desc: 'Dedicated exclusively to setImmediate() callbacks.',
      types: 'setImmediate()'
    },
    { 
      id: 'close', 
      title: 'Close Callbacks', 
      icon: Trash2, 
      color: 'text-error', 
      borderColor: 'border-error',
      desc: 'Executes cleanup operations (e.g. socket.on(\'close\')).',
      types: 'socket close'
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-800 pb-8 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange shadow-[0_0_8px_theme('colors.orange')]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange">Server Runtime</span>
          </div>
          <h2 className="text-4xl font-bold text-on-surface tracking-tight">libuv Architecture Analysis</h2>
          <p className="text-sm text-on-surface-variant max-w-3xl font-medium">
            High-fidelity inspection of the Node.js event loop phases and the precise evaluation checkpoints for processing microtask queues.
          </p>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-6 py-4 flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-orange shadow-[0_0_10px_theme('colors.orange')]" />
            <div className="absolute inset-0 rounded-full bg-orange animate-ping opacity-25" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest">Active State</span>
            <span className="font-mono text-xs font-bold text-orange tracking-tight uppercase">Phase: Poll</span>
          </div>
        </div>
      </header>

      {/* Main Illustration Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Execution Flow */}
        <section className="xl:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-10 relative overflow-hidden flex flex-col items-center">
          <div className="absolute -left-20 -top-20 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="w-full flex justify-between items-center mb-16">
            <h3 className="text-lg font-bold text-on-surface tracking-tight">Loop Lifecycle</h3>
            <div className="px-3 py-1 bg-slate-950 border border-slate-800 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">
              libuv.c:204
            </div>
          </div>

          <div className="flex flex-col items-center w-full max-w-md relative pb-10">
            {/* Top Microtask Node */}
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="bg-slate-950 border border-emerald/30 text-emerald px-6 py-4 rounded-xl flex items-center gap-3 z-20 mb-12 shadow-xl"
            >
              <Zap size={18} fill="currentColor" className="opacity-80" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest">Priority Entry</span>
                <span className="font-mono text-xs font-bold">process.nextTick()</span>
              </div>
            </motion.div>

            {/* Loop Phases */}
            <div className="w-full space-y-6 relative">
              {/* Connector dots line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-slate-800 -translate-x-1/2 z-0" />
              
              <PhaseItem 
                id="timers"
                title="1. Timers"
                icon={Clock}
                color="text-primary"
                borderColor="border-l-primary"
                sub="setTimeout / setInterval"
              />
              
              <div className="flex justify-center relative z-10">
                <div className="bg-slate-950 border border-emerald/20 text-emerald px-4 py-1.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-widest shadow-lg">
                  Microtask Delta Check
                </div>
              </div>

              <PhaseItem 
                id="poll"
                title="2. Poll"
                icon={RotateCw}
                color="text-orange"
                borderColor="border-l-orange"
                sub="I/O callbacks, data"
                active
              />

              <div className="flex justify-center relative z-10">
                 <div className="bg-slate-950 border border-emerald/20 text-emerald px-4 py-1.5 rounded-full font-mono text-[9px] font-bold uppercase tracking-widest shadow-lg">
                  Microtask Delta Check
                </div>
              </div>

              <PhaseItem 
                id="check"
                title="3. Check"
                icon={CheckCircle2}
                color="text-blue"
                borderColor="border-l-blue"
                sub="setImmediate callbacks"
              />
            </div>
          </div>
        </section>

        {/* Priority Stack */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-on-surface flex items-center gap-3 tracking-tight">
              <Zap size={24} fill="currentColor" className="text-emerald" />
              The In-Between
            </h3>
            <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed font-medium opacity-90">
              <p>
                Microtasks (like Promise callbacks) and <code className="font-mono text-emerald bg-emerald/10 px-2 py-0.5 rounded text-[11px]">process.nextTick()</code> are <strong>not technically part of the event loop.</strong>
              </p>
              <p>
                They are evaluated and executed immediately after the current operation finishes, entirely draining their queues <em className="text-on-surface italic underline decoration-emerald">between every single phase</em> of the loop.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner space-y-5 relative z-10">
            <div className="text-[9px] uppercase font-black text-slate-600 border-b border-slate-900 pb-3 tracking-[0.2em]">Execution Hierarchy</div>
            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex items-center gap-4 opacity-40">
                <span className="w-4 text-right">01</span>
                <span>Main Thread Stack</span>
              </div>
              <div className="flex items-center gap-4 text-emerald bg-emerald/5 py-3 px-4 rounded border border-emerald/20 -mx-1">
                <span className="w-4 text-right font-black italic">02</span>
                <span className="font-bold">process.nextTick()</span>
              </div>
              <div className="flex items-center gap-4 text-emerald/70 px-4">
                <span className="w-4 text-right">03</span>
                <span>Promise Callbacks</span>
              </div>
              <div className="pt-2 border-t border-slate-900 flex items-center gap-4 opacity-30">
                <span className="w-4 text-right">04</span>
                <span className="text-[10px] italic uppercase">Event Loop Phases</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Anatomy section */}
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-on-background tracking-tight">Detailed Phase Anatomy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((phase) => (
            <motion.div 
              key={phase.id}
              whileHover={{ y: -4 }}
              className={cn(
                "group bg-slate-900/30 border border-slate-800 p-8 rounded-2xl border-l-4 transition-all duration-300 relative overflow-hidden",
                phase.borderColor,
                phase.active ? "bg-slate-900/60 shadow-2xl scale-[1.02] border-slate-700" : ""
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={cn("p-2.5 rounded-xl bg-slate-950 border border-slate-800 shadow-sm transition-colors group-hover:border-slate-700", phase.color)}>
                  <phase.icon size={24} />
                </div>
                {phase.active && (
                  <span className="px-3 py-1 rounded bg-orange text-on-primary font-mono text-[9px] font-black uppercase tracking-widest shadow-lg shadow-orange/20">Current State</span>
                )}
              </div>
              <h4 className="font-mono font-bold text-on-surface mb-3 text-lg leading-none">{phase.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed opacity-80 font-medium mb-6">
                {phase.desc}
              </p>
              {phase.types && (
                <div className="pt-4 border-t border-slate-800/50">
                   <p className="text-[10px] font-mono text-slate-600 uppercase font-black tracking-widest">{phase.types}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PhaseItem({ title, icon: Icon, color, borderColor, sub, active = false }: any) {
  return (
    <div className={cn(
      "w-full bg-slate-900/50 border border-slate-800 border-l-4 p-5 flex justify-between items-center relative z-10 transition-all rounded-r-xl",
      borderColor,
      active && "bg-slate-900 scale-105 shadow-2xl border-slate-700"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn("p-2.5 rounded-lg bg-slate-950 border border-slate-800 shadow-sm", active ? "bg-orange/5 border-orange/30" : "")}>
          <Icon size={20} className={active ? "text-orange" : color} />
        </div>
        <span className={cn("font-mono text-lg font-bold tracking-tight", active ? "text-on-surface" : "text-on-surface-variant")}>{title}</span>
      </div>
      <span className={cn("text-[10px] font-mono uppercase font-black tracking-tighter opacity-40 italic", active && "text-orange opacity-100 font-black")}>{sub}</span>
      {active && (
        <div className="absolute -right-2 -top-2 bg-orange text-on-primary font-mono text-[9px] font-black px-3 py-1 rounded shadow-lg shadow-orange/20 uppercase tracking-widest">Selected</div>
      )}
    </div>
  );
}
