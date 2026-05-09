import React from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  RotateCw, 
  MousePointer2, 
  History, 
  Monitor, 
  Layers,
  Palette,
  Maximize2,
  BoxSelect,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

export default function Browser() {
  const renderingSteps = [
    { 
      id: 1, 
      title: 'Style Calculation', 
      desc: 'Recalculates styles for elements based on CSSOM and DOM tree modifications.', 
      icon: Gauge, 
      color: 'text-primary',
      borderColor: 'border-primary',
      glowColor: 'glow-primary'
    },
    { 
      id: 2, 
      title: 'Layout (Reflow)', 
      desc: 'Calculates the exact position and size of every element. Expensive operation.', 
      icon: Maximize2, 
      color: 'text-emerald',
      borderColor: 'border-emerald',
      glowColor: 'glow-emerald',
      triggers: 'width, height, margin'
    },
    { 
      id: 3, 
      title: 'Paint', 
      desc: 'Fills in pixels for each visual part of the element (colors, borders, shadows) into layers.', 
      icon: Palette, 
      color: 'text-orange',
      borderColor: 'border-orange',
      glowColor: 'glow-secondary',
      triggers: 'color, bg-color, box-shadow'
    },
    { 
      id: 4, 
      title: 'Composite Layers', 
      desc: 'Draws the painted layers onto the screen in the correct order. GPU accelerated.', 
      icon: Layers, 
      color: 'text-blue',
      borderColor: 'border-blue',
      glowColor: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      triggers: 'transform, opacity'
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_theme('colors.emerald')]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald">Environment: Browser</span>
          </div>
          <h2 className="text-4xl font-bold text-on-surface tracking-tight">Execution Context Pipeline</h2>
          <p className="text-sm text-on-surface-variant max-w-3xl font-medium">
            Deep dive into browser-specific event loop mechanics: rendering pipeline, requestAnimationFrame, and UI composition.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex items-center gap-6 border-l-4 border-l-primary">
          <div>
            <p className="text-[9px] uppercase font-black text-slate-500 mb-1 tracking-widest">Pipeline Pulse</p>
            <p className="font-mono text-sm font-bold text-primary tracking-tight italic">IDLE_WAITING</p>
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-t border-primary rounded-full"
            />
            <RefreshCw size={16} className="text-primary/50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Events & Tasks */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* UI Events */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 border-l-4 border-l-emerald relative overflow-hidden shadow-xl">
            <div className="absolute -right-8 -top-8 opacity-[0.03] text-emerald">
              <RefreshCw size={200} />
            </div>
            <h3 className="text-lg font-bold text-emerald flex items-center gap-3 mb-6 tracking-tight">
              <MousePointer2 size={24} />
              UI Events & Macro Tasks
            </h3>
            <div className="space-y-4 relative z-10">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-4 group hover:border-emerald/50 transition-all">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald shadow-[0_0_10px_theme('colors.emerald')]" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs font-bold text-on-surface">MouseEvent: click</span>
                    <span className="text-[9px] font-black text-emerald/60 bg-emerald/10 px-2 py-0.5 rounded uppercase tracking-tighter">Queue</span>
                  </div>
                  <div className="font-mono text-xs text-on-surface-variant bg-slate-900/50 p-3 rounded border border-slate-800 overflow-x-auto whitespace-pre">
                    <span className="text-blue">button</span>.<span className="text-orange">addEventListener</span>(<span className="text-primary">'click'</span>, cb)
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl flex items-start gap-4 opacity-40">
                <div className="mt-1.5 w-2 h-2 rounded-full bg-slate-700" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs font-bold text-on-surface">setTimeout</span>
                    <span className="text-[9px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded uppercase tracking-tighter">Queue</span>
                  </div>
                   <div className="font-mono text-xs text-slate-600 bg-slate-900/30 p-3 rounded border border-slate-800/50">
                    <span className="text-blue">setTimeout</span>(cb, <span className="text-primary/70">16</span>)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Animation Frames */}
          <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 border-l-4 border-l-primary shadow-xl">
            <h3 className="text-lg font-bold text-primary flex items-center gap-3 mb-4 tracking-tight">
              <Zap size={24} fill="currentColor" />
              Animation Frame Callbacks
            </h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed font-medium">
              Executes just before the Rendering Pipeline. Ideal for visual updates to ensure they are synchronized with the display refresh rate.
            </p>
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-sm font-bold text-on-surface">requestAnimationFrame()</span>
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">High Priority</span>
              </div>
              <div className="font-mono text-[11px] text-on-surface-variant bg-slate-900/40 p-4 rounded border border-slate-800">
                <pre className="overflow-x-auto">
{`function animate() {
  // Sync with refresh rate
  updateLayout();
  
  requestAnimationFrame(animate);
}`}
                </pre>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Rendering Pipeline */}
        <div className="lg:col-span-7">
          <section className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-10 h-full relative overflow-hidden shadow-2xl">
            <header className="flex items-center justify-between mb-12 border-b border-slate-800 pb-5">
              <h3 className="text-xl font-bold text-on-surface flex items-center gap-3 tracking-tight">
                <Monitor size={24} className="text-primary" />
                Rendering Pipeline
              </h3>
              <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-black uppercase tracking-widest opacity-60">
                <History size={16} />
                ~16.6ms budget (60FPS)
              </div>
            </header>

            <div className="relative space-y-8">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[23px] top-4 bottom-4 w-px bg-slate-800" />

              {renderingSteps.map((step) => (
                <div key={step.id} className="relative z-10 flex gap-6 group">
                  <div className={cn(
                    "w-12 h-12 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center transition-all group-hover:scale-110",
                    step.glowColor
                  )}>
                    <step.icon size={20} className={step.color} />
                  </div>
                  <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                       <h4 className={cn("font-mono text-sm font-bold", step.color)}>{step.id}. {step.title}</h4>
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">Step</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed mb-4 font-medium opacity-80">{step.desc}</p>
                    {step.triggers && (
                      <div className="flex gap-2">
                        <span className="px-3 py-1 rounded bg-error/10 text-error border border-error/30 text-[9px] font-black uppercase tracking-widest">
                          Triggers: {step.triggers}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Background design pattern */}
            <div className="absolute bottom-0 right-0 p-10 opacity-5 pointer-events-none">
                <Layers size={180} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
