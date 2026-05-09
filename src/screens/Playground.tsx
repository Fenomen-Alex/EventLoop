import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RotateCcw, 
  StepForward, 
  Code, 
  Layers, 
  History, 
  Zap, 
  Terminal as TerminalIcon,
  Globe,
  Settings,
  Activity,
  Cpu,
  Monitor,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

type Environment = 'browser' | 'node';

interface CodeLine {
  text: string;
  indent?: boolean;
  action?: () => void;
}

const EXAMPLES = {
  basic: {
    name: 'Async Basics',
    description: 'Standard event loop behavior with SetTimeout and Promises.',
    env: 'browser' as Environment,
    code: [
      { text: "console.log('1');", action: (s: any) => s.log('1') },
      { text: "setTimeout(() => {", action: (s: any) => s.macrotask("cb: log('2')", "Timer 0ms") },
      { text: "  console.log('2');", indent: true },
      { text: "}, 0);", action: () => {} },
      { text: "Promise.resolve().then(() => {", action: (s: any) => s.microtask("cb: log('3')") },
      { text: "  console.log('3');", indent: true },
      { text: "});", action: () => {} },
      { text: "console.log('4');", action: (s: any) => s.log('4') },
    ],
    handlers: {
      microtask: (s: any) => { s.log('3'); s.stack('Promise callback'); },
      macrotask: (s: any) => { s.log('2'); s.stack('Timer callback'); }
    }
  },
  starvation: {
    name: 'Microtask Starvation',
    description: 'See how a continuous promise chain can block macrotasks.',
    env: 'browser' as Environment,
    code: [
      { text: "setTimeout(() => log('Macro'), 0);", action: (s: any) => s.macrotask("cb: log('Macro')", "Timer") },
      { text: "function loop() {", action: () => {} },
      { text: "  Promise.resolve().then(loop);", indent: true, action: (s: any) => s.microtask("recursion: loop()") },
      { text: "}", action: () => {} },
      { text: "loop();", action: (s: any) => s.stack('loop()') },
    ],
    handlers: {
      microtask: (s: any) => { s.microtask("recursion: loop()"); s.stack('loop()'); },
      macrotask: (s: any) => { s.log('Macro'); s.stack('Timer callback'); }
    }
  },
  nodeSpec: {
    name: 'Tick vs Immediate',
    description: 'Node.js specific queue priority: nextTick always runs first.',
    env: 'node' as Environment,
    code: [
      { text: "setImmediate(() => log('Immediate'));", action: (s: any) => s.macrotask("cb: Immediate", "Check Phase") },
      { text: "process.nextTick(() => log('NextTick'));", action: (s: any) => s.microtask("cb: NextTick") },
      { text: "console.log('Main');", action: (s: any) => s.log('Main') },
    ],
    handlers: {
      microtask: (s: any) => { s.log('NextTick'); s.stack('nextTick callback'); },
      macrotask: (s: any) => { s.log('Immediate'); s.stack('Immediate callback'); }
    }
  },
  animation: {
    name: 'Smooth Rendering',
    description: 'requestAnimationFrame runs before the browser repaints.',
    env: 'browser' as Environment,
    code: [
      { text: "setTimeout(() => log('Timeout'), 0);", action: (s: any) => s.macrotask("cb: Timeout", "Timer") },
      { text: "requestAnimationFrame(() => {", action: (s: any) => s.apiTask("cb: raf", "Render Pipeline") },
      { text: "  log('Frame');", indent: true },
      { text: "});", action: () => {} },
      { text: "log('Sync');", action: (s: any) => s.log('Sync') },
    ],
    handlers: {
      api: (s: any) => { s.log('Frame'); s.stack('rAF callback'); },
      macrotask: (s: any) => { s.log('Timeout'); s.stack('Timer callback'); }
    }
  }
};

export default function Playground() {
  const [env, setEnv] = useState<Environment>('browser');
  const [exampleId, setExampleId] = useState<keyof typeof EXAMPLES>('basic');
  const [currentLine, setCurrentLine] = useState(-1);
  const [stack, setStack] = useState<string[]>(['anonymous']);
  const [microtasks, setMicrotasks] = useState<string[]>([]);
  const [macrotasks, setMacrotasks] = useState<string[]>([]);
  const [apiTasks, setApiTasks] = useState<string[]>([]);
  const [output, setOutput] = useState<string[]>([]);

  const example = EXAMPLES[exampleId];

  useEffect(() => {
    reset();
    setEnv(example.env);
  }, [exampleId]);

  const reset = () => {
    setCurrentLine(-1);
    setStack(['anonymous']);
    setMicrotasks([]);
    setMacrotasks([]);
    setApiTasks([]);
    setOutput([]);
  };

  const stepForward = () => {
    const s = {
      log: (msg: string) => setOutput(prev => [...prev, msg]),
      microtask: (task: string) => setMicrotasks(prev => [...prev, task]),
      macrotask: (task: string, source?: string) => setMacrotasks(prev => [...prev, `${task}${source ? ` (${source})` : ''}`]),
      apiTask: (task: string, source: string) => setApiTasks(prev => [...prev, `${task} (${source})`]),
      stack: (frame: string) => {
        setStack(prev => [...prev, frame]);
        setTimeout(() => setStack(prev => prev.slice(0, -1)), 600);
      }
    };

    if (currentLine < example.code.length - 1) {
      const nextLine = currentLine + 1;
      setCurrentLine(nextLine);
      example.code[nextLine].action?.(s);
    } else if (microtasks.length > 0) {
      setMicrotasks(prev => prev.slice(1));
      example.handlers.microtask?.(s);
    } else if (apiTasks.length > 0) {
      setApiTasks(prev => prev.slice(1));
      (example.handlers as any).api?.(s);
    } else if (macrotasks.length > 0) {
      setMacrotasks(prev => prev.slice(1));
      example.handlers.macrotask?.(s);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setEnv('browser')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all",
                  env === 'browser' ? "bg-primary text-on-primary shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Globe size={12} /> Browser
              </button>
              <button 
                onClick={() => setEnv('node')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-all",
                  env === 'node' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <TerminalIcon size={12} /> Node.js
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-on-surface tracking-tight">Execution Playground</h2>
            <p className="text-sm text-on-surface-variant max-w-2xl font-medium">
               Select an execution pattern to trace its path through the {env === 'browser' ? 'Web' : 'Node'} runtime engine.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full md:w-auto bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <select 
              value={exampleId}
              onChange={(e) => setExampleId(e.target.value as any)}
              className="bg-transparent text-[11px] font-black uppercase tracking-widest text-slate-400 px-4 py-2 outline-none cursor-pointer hover:text-on-surface transition-colors"
            >
              {Object.entries(EXAMPLES).map(([id, ex]) => (
                <option key={id} value={id} className="bg-slate-950">{ex.name}</option>
              ))}
            </select>
            <div className="w-px h-6 bg-slate-800" />
            <div className="flex gap-1">
              <button 
                onClick={reset}
                className="p-2 rounded-lg text-slate-500 hover:text-on-surface hover:bg-slate-800 transition-all" 
                title="Reset Execution"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                onClick={stepForward}
                className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] uppercase tracking-[0.2em] hover:brightness-110 transition-all flex items-center gap-3 shadow-[0_4px_15px_rgba(var(--primary-rgb),0.2)]"
              >
                <StepForward size={14} strokeWidth={3} />
                Next Step
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Editor Area */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <section className="rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col relative h-[450px]">
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code size={14} className="text-primary" />
                <span className="font-mono text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">trace_engine.js</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald" />
                    <span className="text-[9px] font-black uppercase text-emerald tracking-widest">Active</span>
                 </div>
              </div>
            </div>

            <div className="p-8 font-mono text-[13px] bg-slate-900/50 flex-1 relative overflow-auto custom-scrollbar">
              <div className="flex">
                <div className="w-10 text-right pr-6 border-r border-slate-800/50 mr-6 text-slate-600 select-none font-black text-[11px]">
                  {example.code.map((_, i) => <div key={i} className="leading-8">{i + 1}</div>)}
                </div>
                <div className="flex-1 space-y-1 relative">
                  {example.code.map((line, i) => (
                    <motion.div 
                      key={i}
                      animate={currentLine === i ? { opacity: 1, x: 0 } : { opacity: 0.6, x: -2 }}
                      className={cn(
                        "leading-8 px-4 rounded transition-all relative flex items-center gap-4 group",
                        currentLine === i ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_15px_rgba(var(--primary-rgb),0.05)]" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30",
                        line.indent && "pl-12"
                      )}
                    >
                      {currentLine === i && (
                        <motion.div 
                          layoutId="active-marker"
                          className="absolute -left-2 w-1.5 h-4 bg-primary rounded-full shadow-[0_0_10px_theme('colors.primary')]"
                        />
                      )}
                      <span className="font-medium whitespace-pre">{line.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-slate-950/80 px-6 py-4 border-t border-slate-800 flex flex-col gap-2">
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Trace Context</span>
               <p className="text-[11px] text-slate-400 font-medium italic">
                  {example.description}
               </p>
            </div>
          </section>

          {/* Runtime Context */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex items-center gap-3">
               <Cpu size={18} className="text-secondary" />
               <h3 className="text-[11px] font-black uppercase tracking-widest">Runtime Environment</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <div className="text-[8px] font-black uppercase text-slate-600 tracking-widest mb-1">Architecture</div>
                  <div className="text-xs font-bold text-on-surface">{env === 'browser' ? 'V8 + Chromium' : 'V8 + Libuv'}</div>
               </div>
               <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
                  <div className="text-[8px] font-black uppercase text-slate-600 tracking-widest mb-1">Execution Mode</div>
                  <div className="text-xs font-bold text-on-surface">Single Threaded</div>
               </div>
            </div>
          </section>
        </div>

        {/* State Side */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QueuePanel 
              title="Microtask Queue" 
              icon={Zap} 
              items={microtasks} 
              accentColor="text-emerald" 
              bgGlow="from-emerald/5" 
              borderColor="border-emerald/20"
              itemBorder="border-emerald/40"
              itemBg="bg-emerald/5"
              desc="Promises & MutationObservers"
            />
             <QueuePanel 
              title="Macrotask Queue" 
              icon={History} 
              items={macrotasks} 
              accentColor="text-cyan" 
              bgGlow="from-cyan/5" 
              borderColor="border-cyan/20"
              itemBorder="border-cyan/40"
              itemBg="bg-cyan/5"
              desc="Timers, I/O, & GUI Events"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="flex flex-col gap-6">
              {/* Specialized API Pool */}
              <section className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col relative overflow-hidden h-[200px]">
                <header className="px-5 py-3 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center">
                  <h3 className="text-[10px] uppercase font-black text-slate-300 tracking-widest flex items-center gap-2">
                    <Monitor size={14} className="text-primary" /> {env === 'browser' ? 'Web APIs' : 'Node APIs'}
                  </h3>
                  <span className="text-[9px] font-black text-slate-600 uppercase">External_Threads</span>
                </header>
                <div className="flex-1 p-4 flex flex-wrap gap-2 content-start overflow-y-auto">
                   <AnimatePresence>
                      {apiTasks.map((task, i) => (
                        <motion.div 
                          key={i+task}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-[10px] font-mono text-primary flex items-center gap-2"
                        >
                           <Settings size={10} className="animate-spin-slow" />
                           {task}
                        </motion.div>
                      ))}
                   </AnimatePresence>
                   {apiTasks.length === 0 && (
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-20 grayscale">
                         <Globe size={32} className="mb-2" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Calls</span>
                      </div>
                   )}
                </div>
              </section>

              {/* Call Stack */}
              <section className="bg-slate-900 border border-slate-800 rounded-2xl flex-col relative overflow-hidden flex-1 min-h-[250px]">
                <header className="px-5 py-3 border-b border-slate-800 bg-orange/5 flex justify-between items-center">
                  <h3 className="text-[10px] uppercase font-black text-orange tracking-widest flex items-center gap-2">
                    <Layers size={14} /> Execution Stack
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase">LIFO</span>
                    <div className="w-px h-3 bg-slate-800" />
                    <span className="text-[9px] font-black text-orange opacity-40 uppercase">{stack.length} Frames</span>
                  </div>
                </header>
                <div className="flex-1 bg-slate-950 flex flex-col-reverse justify-start p-6 gap-3 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {stack.map((frame, i) => (
                      <motion.div
                        key={i + frame}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={cn(
                          "p-4 rounded-xl border font-mono text-[11px] transition-all relative overflow-hidden group",
                          i === stack.length - 1 
                            ? "bg-orange/10 border-orange/40 text-orange shadow-[0_10px_20px_rgba(249,115,22,0.1)]" 
                            : "bg-slate-900/50 border-slate-800 text-slate-500 opacity-60"
                        )}
                      >
                        <div className="flex justify-between items-center relative z-10">
                          <div className="flex items-center gap-2">
                             {i === stack.length - 1 && <ChevronRight size={14} strokeWidth={3} className="text-orange" />}
                             <span className="font-bold">{frame}</span>
                          </div>
                          <span className="text-[8px] opacity-40 uppercase font-black tracking-widest">{i === 0 ? 'MAIN_ENTRY' : 'V8_CONTEXT'}</span>
                        </div>
                        {i === stack.length - 1 && <div className="absolute inset-0 bg-gradient-to-r from-orange/5 to-transparent pointer-events-none" />}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            </div>

            {/* Output Console */}
            <section className="bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden relative shadow-2xl">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TerminalIcon size={14} className="text-emerald" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stream Output</span>
                </div>
                <button onClick={() => setOutput([])} className="text-slate-600 hover:text-slate-400 transition-colors p-1 rounded hover:bg-slate-800">
                   <RotateCcw size={14} />
                </button>
              </div>
              <div className="p-8 flex-1 font-mono text-[13px] text-on-surface space-y-2 overflow-y-auto custom-scrollbar">
                {output.map((out, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-emerald font-black opacity-30 select-none">[{i.toString().padStart(2, '0')}]</span>
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      className="text-emerald-400 font-black tracking-tight"
                    >
                      {out}
                    </motion.span>
                  </div>
                ))}
                <div className="flex items-center gap-4">
                  <span className="text-slate-700 font-black opacity-30 select-none">[{output.length.toString().padStart(2, '0')}]</span>
                  <motion.div 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-2 h-4 bg-emerald-500/60"
                  />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function QueuePanel({ title, icon: Icon, items, accentColor, bgGlow, borderColor, itemBorder, itemBg, desc }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.03] pointer-events-none", bgGlow)} />
      <header className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <h3 className={cn("text-[11px] uppercase font-black flex items-center gap-2 tracking-[0.2em]", accentColor)}>
            <Icon size={14} /> {title}
          </h3>
          <p className="text-[9px] text-slate-500 font-medium">{desc}</p>
        </div>
        <span className={cn("text-[8px] font-black border px-2 py-1 rounded-md uppercase tracking-tight", borderColor)}>FIFO-BUF</span>
      </header>
      <div className="flex-1 flex gap-3 items-center overflow-x-auto pb-4 relative z-10 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {items.map((item: any, i: number) => (
            <motion.div 
              key={i + item}
              initial={{ x: -20, opacity: 0, rotate: -5 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className={cn("shrink-0 w-44 h-24 border-2 rounded-2xl flex flex-col p-4 relative shadow-2xl backdrop-blur-md group/item", itemBg, itemBorder)}
            >
              <div className="flex justify-between items-start mb-2">
                 <div className={cn("w-2 h-2 rounded-full", accentColor.replace('text-', 'bg-'))} />
                 <span className="text-[8px] font-black text-slate-500 uppercase">Wait_Pos: {i}</span>
              </div>
              <div className="flex-1 flex flex-col">
                <span className={cn("font-mono text-[11px] font-black leading-tight mb-1", accentColor)}>{item.split(' (')[0]}</span>
                {item.includes('(') && (
                   <span className="text-[8px] font-mono text-slate-500 bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800 w-fit">
                      {item.split(' (')[1].replace(')', '')}
                   </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <div className="flex-1 h-24 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col gap-2 items-center justify-center bg-slate-950/30 py-6 opacity-30 group-hover:opacity-50 transition-opacity">
            <Icon size={20} className="text-slate-700" />
            <span className="text-[9px] uppercase font-black tracking-[0.3em] text-slate-700">Buffers Clear</span>
          </div>
        )}
      </div>
    </div>
  );
}

