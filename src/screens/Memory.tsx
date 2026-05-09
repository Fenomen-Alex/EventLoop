import React from 'react';
import { motion } from 'motion/react';
import { 
  MemoryStick as MemoryIcon, 
  Layers, 
  ArrowRight, 
  AlertTriangle, 
  Terminal, 
  Info,
  Database,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Memory() {
  const hoistingData = [
    { declaration: 'var', hoisted: 'Yes', initialValue: 'undefined', scope: 'Function / Global', color: 'text-emerald' },
    { declaration: 'let', hoisted: 'Yes', initialValue: '<uninitialized> (TDZ)', scope: 'Block', color: 'text-emerald-500/60' },
    { declaration: 'const', hoisted: 'Yes', initialValue: '<uninitialized> (TDZ)', scope: 'Block', color: 'text-emerald-500/60' },
    { declaration: 'function()', hoisted: 'Yes', initialValue: 'Function Reference', scope: 'Function / Global', color: 'text-cyan' },
    { declaration: 'class', hoisted: 'Yes', initialValue: '<uninitialized> (TDZ)', scope: 'Block', color: 'text-primary' },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_theme('colors.primary')]" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">V8 Engine Internals</span>
        </div>
        <h2 className="text-5xl font-black text-on-surface tracking-tighter uppercase leading-[0.9]">Storage & Lifecycle</h2>
        <p className="text-base text-on-surface-variant max-w-3xl font-medium">
          A definitive guide to memory allocation, variable hoisting, and the mechanics of the Temporal Dead Zone (TDZ).
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Hoisting Table */}
        <section className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-2">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-primary" />
              <h2 className="text-lg font-black uppercase tracking-tight text-on-surface">Hoisting Matrix</h2>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-950 px-2 py-1 rounded">Execution_Context_v1</span>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                  <th className="py-4 px-2">Syntax Unit</th>
                  <th className="py-4 px-2">Registry Phase</th>
                  <th className="py-4 px-2">Initial Pointer</th>
                  <th className="py-4 px-2">Resolution Scope</th>
                </tr>
              </thead>
              <tbody className="text-[13px] font-medium">
                {hoistingData.map((row, i) => (
                  <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors">
                    <td className={cn("py-5 px-2 font-mono font-black", row.color)}>{row.declaration}</td>
                    <td className="py-5 px-2 text-slate-400 font-bold group-hover:text-primary transition-colors">Creation Phase</td>
                    <td className={cn("py-5 px-2 font-mono text-[11px] font-bold", row.initialValue.includes('TDZ') ? 'text-orange-400/80' : 'text-slate-500')}>{row.initialValue}</td>
                    <td className="py-5 px-2 text-slate-400 font-black tracking-tighter">{row.scope}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Heap vs Stack */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col gap-8 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
            <Layers size={20} className="text-orange" />
            <h2 className="text-lg font-black uppercase tracking-tight text-on-surface">Segment Partitioning</h2>
          </div>
          <div className="space-y-6 relative z-10">
            <div className="bg-slate-950 p-6 rounded-xl border-l-4 border-l-orange shadow-lg">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-orange mb-3 flex items-center gap-2">
                <Layers size={14} /> Execution Stack
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Optimized for fast access. Stores primitives and stack frames. Fixed-size LIFO structure.
              </p>
            </div>
            <div className="bg-slate-950 p-6 rounded-xl border-l-4 border-l-cyan shadow-lg">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan mb-3 flex items-center gap-2">
                <Database size={14} /> Memory Heap
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                Large, unordered pool. Stores reference types like Objects and Closures. Stack frames hold pointers to these addresses.
              </p>
            </div>
          </div>
        </section>

        {/* Temporal Dead Zone Visualization */}
        <section className="xl:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col md:flex-row gap-12 shadow-2xl relative">
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-6">
              <AlertTriangle size={24} className="text-orange shadow-[0_0_15px_theme('colors.orange')]" />
              <h2 className="text-3xl font-black text-on-surface tracking-tight uppercase">Temporal Dead Zone</h2>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
              The period from block-entry until variable initialization. Accessing 
              <code className="mx-2 font-mono text-primary bg-slate-950 px-2 py-1 rounded border border-slate-800">let</code> 
              or 
              <code className="mx-2 font-mono text-primary bg-slate-950 px-2 py-1 rounded border border-slate-800">const</code> 
              before declaration triggers a <span className="text-orange font-black">ReferenceError</span>.
            </p>
            <div className="bg-slate-950 rounded-2xl p-8 font-mono text-[13px] leading-relaxed relative overflow-hidden border border-slate-800">
               <div className="flex items-center gap-2 mb-6 border-b border-slate-900 pb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <span className="text-[9px] font-black uppercase text-slate-700 tracking-[0.3em] ml-2">TDZ_DEBUG_OUTPUT</span>
               </div>
              <div className="space-y-1">
                <div className="text-slate-500"><span className="text-primary font-bold">const</span> globalScope = <span className="text-emerald">"Persisted"</span>;</div>
                <div className="text-slate-400">{"{"}</div>
                <div className="text-slate-700 italic text-[11px] mb-1">  // TDZ Cycle Begins for local 'data'</div>
                <div className="text-slate-400">  console.log(globalScope); <span className="text-slate-700 opacity-40">// Valid access</span></div>
                <div className="bg-orange/10 border-l-4 border-orange -mx-2 px-6 py-2 my-2 rounded-sm shadow-[inset_0_0_10px_rgba(249,115,22,0.1)]">
                  <span className="text-on-surface">console.log(data);</span> <span className="text-orange font-black ml-4 uppercase text-[10px]">ReferenceError!</span>
                </div>
                <div className="text-slate-400">  <span className="text-primary font-bold">let</span> data = <span className="text-emerald">"Hydrated"</span>; <span className="text-slate-700 opacity-40 ml-4">// TDZ ends here</span></div>
                <div className="text-slate-400">  console.log(data); <span className="text-slate-700 opacity-40 ml-4">// "Hydrated"</span></div>
                <div className="text-slate-400">{"}"}</div>
              </div>
            </div>
          </div>

          {/* Stack Frame Diagram */}
          <div className="w-full md:w-[450px] bg-slate-950 rounded-2xl border border-slate-800 p-10 flex flex-col gap-8 shadow-inner relative">
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none select-none">
                <Layers size={180} />
             </div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary border-b border-slate-900 pb-4">Stack Allocation Model</h3>
             
             <div className="space-y-6">
                <motion.div 
                  initial={{ x: -10, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative"
                >
                  <div className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-widest">Global Memory</div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-emerald font-bold">globalScope</span>
                    <span className="text-slate-500">"Persisted"</span>
                  </div>
                </motion.div>

                <div className="flex justify-center -my-2">
                  <ArrowDown size={14} className="text-slate-800" />
                </div>

                <motion.div 
                  initial={{ x: 10, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-slate-900 border-2 border-orange/20 rounded-xl p-5 relative shadow-[0_10px_20px_rgba(249,115,22,0.05)]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[9px] font-black uppercase text-orange tracking-widest">Block Segment</div>
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="w-2 h-2 rounded-full bg-orange shadow-[0_0_10px_theme('colors.orange')]" />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300">data</span>
                    <span className="text-orange/60 font-black uppercase text-[9px] tracking-tighter">uninitialized</span>
                  </div>
                </motion.div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
