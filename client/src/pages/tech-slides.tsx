import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Zap, Shield, Plug, BookOpen, GitBranch, ArrowRight, Terminal, Users, Clock, Cpu, ChevronRight } from "lucide-react";

// ─── Animation variants ─────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 800 : -800, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -800 : 800, opacity: 0, scale: 0.95 }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

// ─── Shared components ──────────────────────────────────────────

function BlockTag({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#FF6200]/70 mb-6">{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-5" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{children}</h1>;
}

function Subtitle({ children }: { children: React.ReactNode }) {
  return <p className="text-lg md:text-2xl text-white/40 mb-10 max-w-2xl leading-relaxed">{children}</p>;
}

function Accent({ children }: { children: React.ReactNode }) {
  return <span className="text-[#FF6200]">{children}</span>;
}

// ─── SLIDE 1: Title ─────────────────────────────────────────────

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
        <BlockTag>Part 6 — Technical Deep Dive</BlockTag>
      </motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
        <div className="text-7xl md:text-[8rem] font-black leading-none mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          How It <Accent>Works</Accent>
        </div>
      </motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <div className="flex gap-6 mt-4">
          {[
            { letter: "A", label: "How we built it" },
            { letter: "B", label: "How the AI works" },
            { letter: "C", label: "How ING can use this" },
          ].map(b => (
            <div key={b.letter} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/20 flex items-center justify-center text-[#FF6200] font-black text-2xl mb-2">{b.letter}</div>
              <div className="text-white/40 text-xs max-w-[100px]">{b.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
        <div className="mt-16 text-white/15 text-xs font-mono flex items-center gap-2">press <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/30">→</kbd> to continue</div>
      </motion.div>
    </div>
  );
}

// ─── SLIDE 2: Vibe Coding ───────────────────────────────────────

function Slide2() {
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block A — How We Built It</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>Vibe Coding</Title></motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <Subtitle>No Figma. No mockups. Describe what you want — AI builds it — you have a working app the same day.</Subtitle>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
        <div className="flex items-center gap-5 flex-wrap mb-12">
          {[
            { label: "Describe", sub: "what you want", active: false },
            { label: "AI Builds", sub: "Claude Code", active: true },
            { label: "Working App", sub: "test immediately", active: false },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center gap-5">
              <div className={`px-8 py-5 rounded-2xl border-2 text-center ${step.active ? "bg-[#FF6200] border-[#FF6200] text-white" : "bg-white/5 border-white/10 text-white"}`}>
                <div className="font-bold text-lg">{step.label}</div>
                <div className="text-xs opacity-60 mt-1">{step.sub}</div>
              </div>
              {i < 2 && <ChevronRight className="w-6 h-6 text-[#FF6200]/30" />}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show">
        <div className="bg-gradient-to-r from-[#FF6200]/10 to-transparent border-l-4 border-[#FF6200] p-6 rounded-r-xl max-w-2xl">
          <p className="text-white/80 text-xl font-medium">Everything you saw today is a running application.</p>
          <p className="text-white/40 mt-2">Not a design file. Every button works. Every AI response is live.</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show">
        <div className="mt-10 flex gap-3 flex-wrap">
          {["React 19", "TypeScript", "Node.js", "PostgreSQL", "Claude Code"].map(t => (
            <span key={t} className="text-xs font-mono px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-white/30">{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── SLIDE 3: Chatbot vs Agent ──────────────────────────────────

function Slide3() {
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block B — How the AI Works</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>Chatbot vs <Accent>Agent</Accent></Title></motion.div>

      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold text-white/50 mb-3">Chatbot</h3>
            <p className="text-white/30 text-lg leading-relaxed">You ask a question.<br />It gives you text back.<br />That is all.</p>
            <div className="mt-6 pt-4 border-t border-white/5">
              <p className="text-white/20 text-sm italic">Like a search engine</p>
            </div>
          </div>
          <div className="p-8 rounded-3xl bg-[#FF6200]/[0.07] border-2 border-[#FF6200]/20">
            <Bot className="w-10 h-10 text-[#FF6200] mb-4" />
            <h3 className="text-2xl font-bold text-[#FF6200] mb-3">AI Agent</h3>
            <p className="text-white/60 text-lg leading-relaxed">Thinks. Decides. Acts.<br />Has tools. Picks which to use.<br />Chains them together.</p>
            <div className="mt-6 pt-4 border-t border-[#FF6200]/10">
              <p className="text-[#FF6200]/50 text-sm italic">Like an employee who gets things done</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── SLIDE 4: Architecture ──────────────────────────────────────

function Slide4() {
  const steps = [
    { icon: "💬", label: "User sends a message", sub: '"How did I spend this month?"' },
    { icon: "⚙️", label: "AI model receives it", sub: "Reads the message, understands the intent" },
    { icon: "🔧", label: "Picks the right tools", sub: "get_transactions → analyze data → show_chart" },
    { icon: "📊", label: "Returns response + widget", sub: "Text answer plus an interactive chart" },
    { icon: "✅", label: "User sees the result", sub: "Rendered right in the conversation" },
  ];
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block B — How the AI Works</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>The Architecture</Title></motion.div>

      <div className="max-w-lg">
        {steps.map((step, i) => (
          <motion.div key={i} variants={fadeUp} custom={i + 2} initial="hidden" animate="show">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">{step.icon}</div>
                {i < steps.length - 1 && <div className="w-0.5 h-8 bg-[#FF6200]/15 mt-1" />}
              </div>
              <div className={i < steps.length - 1 ? "pb-4" : ""}>
                <div className="font-bold text-white text-lg">{step.label}</div>
                <div className="text-white/35 text-sm mt-0.5">{step.sub}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 5: 10 Tools ─────────────────────────────────────────

function Slide5() {
  const tools = [
    ["get_account_balance", "Account data"],
    ["get_recent_transactions", "Transaction history"],
    ["get_portfolio_data", "Investment holdings"],
    ["show_stock_widget", "Stock chart + analysis"],
    ["show_transfer_widget", "Money transfer"],
    ["show_spending_chart", "Spending breakdown"],
    ["show_achievement", "Badge animations"],
    ["show_savings_goal", "Savings progress"],
    ["start_quiz", "Launch a quiz"],
    ["navigate_to_screen", "Go to a screen"],
  ];
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block B — How the AI Works</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title><Accent>10</Accent> Tools</Title></motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <Subtitle>The AI picks which tools to use — on its own. No rules programmed. It figures it out.</Subtitle>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
        <div className="grid grid-cols-2 gap-x-12 gap-y-0 max-w-3xl">
          {tools.map(([name, desc]) => (
            <div key={name} className="flex items-baseline gap-4 py-3 border-b border-white/5">
              <code className="text-[#FF6200] font-mono text-xs shrink-0">{name}</code>
              <span className="text-white/30 text-xs">{desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show">
        <div className="mt-10 text-white/25 text-sm max-w-xl">Same AI engine for Junior and Adult. Different <span className="text-[#FF6200]/60">personality instructions</span> change the language and behavior.</div>
      </motion.div>
    </div>
  );
}

// ─── SLIDE 6: AI Coding Agents ──────────────────────────────────

function Slide6() {
  const steps = [
    { icon: <Users className="w-5 h-5" />, label: "Someone describes a task", sub: '"Build feature X" or "Fix bug Y"' },
    { icon: <Bot className="w-5 h-5" />, label: "AI coding agent picks it up", sub: "Reads the existing code, understands context" },
    { icon: <Terminal className="w-5 h-5" />, label: "Writes the code, runs the tests", sub: "Follows your company's rules automatically" },
    { icon: <Zap className="w-5 h-5" />, label: "Delivers a finished result", sub: "Ready for a human to review" },
    { icon: <Users className="w-5 h-5" />, label: "Human reviews, gives feedback", sub: "AI adjusts. When it looks good — it goes live." },
  ];
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block C — How ING Can Develop This Fast</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>AI Coding Agents</Title></motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <Subtitle>How large companies are starting to build software.</Subtitle>
      </motion.div>

      <div className="max-w-lg">
        {steps.map((step, i) => (
          <motion.div key={i} variants={fadeUp} custom={i + 3} initial="hidden" animate="show">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-[#FF6200]/10 border border-[#FF6200]/20 flex items-center justify-center text-[#FF6200]">{step.icon}</div>
                {i < steps.length - 1 && <div className="w-0.5 h-7 bg-[#FF6200]/15 mt-1" />}
              </div>
              <div className={i < steps.length - 1 ? "pb-3" : ""}>
                <div className="font-bold text-white">{step.label}</div>
                <div className="text-white/35 text-sm mt-0.5">{step.sub}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 7: Multiple Engines ──────────────────────────────────

function Slide7() {
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block C — How ING Can Develop This Fast</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>Multiple AI Engines</Title></motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <Subtitle>Not just one AI. Use the best tool for each job. Run them in parallel. Compare results.</Subtitle>
      </motion.div>

      <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
        <div className="flex gap-6 flex-wrap mb-12">
          {[
            { name: "Copilot", desc: "GitHub's built-in AI", bg: "from-blue-500/10 to-blue-500/5", border: "border-blue-500/20", text: "text-blue-400" },
            { name: "Claude", desc: "Deep reasoning & code", bg: "from-orange-500/10 to-orange-500/5", border: "border-orange-500/20", text: "text-orange-400" },
            { name: "Codex", desc: "Fast code generation", bg: "from-emerald-500/10 to-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400" },
          ].map(e => (
            <div key={e.name} className={`flex-1 min-w-[160px] p-7 rounded-3xl bg-gradient-to-b ${e.bg} border ${e.border} text-center`}>
              <div className={`font-black text-3xl mb-2 ${e.text}`}>{e.name}</div>
              <div className="text-white/30 text-sm">{e.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show">
        <div className="flex items-center gap-3 text-white/25 text-sm">
          <ArrowRight className="w-4 h-4 text-[#FF6200]/40" />
          All built into GitHub today. Available for enterprise teams.
        </div>
      </motion.div>
    </div>
  );
}

// ─── SLIDE 8: Enterprise Controls ───────────────────────────────

function Slide8() {
  const controls = [
    { icon: <BookOpen className="w-7 h-7" />, title: "Custom Instructions", desc: "Your company's rules. Coding standards, security policies. AI reads and follows them.", accent: false },
    { icon: <GitBranch className="w-7 h-7" />, title: "Skills", desc: "Step-by-step recipes for common tasks. Write once — AI follows every time.", accent: true },
    { icon: <Plug className="w-7 h-7" />, title: "MCP", desc: "Universal plug. Connect AI to monitoring, error tracking, project management. Any system.", accent: false },
    { icon: <Shield className="w-7 h-7" />, title: "Hooks", desc: "Safety rules. Approve or block actions. Full log of everything. Controllable and traceable.", accent: true },
  ];
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block C — How ING Can Develop This Fast</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>Enterprise Controls</Title></motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <Subtitle>Four building blocks to keep AI safe in a large company.</Subtitle>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {controls.map((c, i) => (
          <motion.div key={c.title} variants={fadeUp} custom={i + 3} initial="hidden" animate="show">
            <div className={`p-7 rounded-3xl border-2 h-full ${c.accent ? "bg-[#FF6200]/[0.06] border-[#FF6200]/15" : "bg-white/[0.02] border-white/8"}`}>
              <div className="text-[#FF6200] mb-4">{c.icon}</div>
              <h3 className="font-bold text-xl text-white mb-2">{c.title}</h3>
              <p className="text-white/40 leading-relaxed">{c.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── SLIDE 9: What This Means ───────────────────────────────────

function Slide9() {
  return (
    <div>
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"><BlockTag>Block C — How ING Can Develop This Fast</BlockTag></motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show"><Title>What This Means</Title></motion.div>

      <div className="space-y-6 max-w-2xl">
        <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
          <div className="bg-white/[0.03] border border-white/8 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Clock className="w-5 h-5 text-[#FF6200]" />
              <span className="text-white/30 text-xs font-mono tracking-widest uppercase">Example 1</span>
            </div>
            <div className="space-y-3">
              <p className="text-white/70 text-xl"><strong className="text-white">Morning:</strong> someone describes a task</p>
              <p className="text-white/70 text-xl"><strong className="text-white">Afternoon:</strong> AI delivers working code</p>
              <p className="text-white/70 text-xl"><strong className="text-white">Review:</strong> senior developer checks in 10 minutes</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show">
          <div className="bg-white/[0.03] border border-white/8 p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
              <Cpu className="w-5 h-5 text-[#FF6200]" />
              <span className="text-white/30 text-xs font-mono tracking-widest uppercase">Example 2</span>
            </div>
            <div className="space-y-3">
              <p className="text-white/70 text-xl">Test fails at <strong className="text-white">2 AM</strong></p>
              <p className="text-white/70 text-xl">AI agent fixes it <strong className="text-white">overnight</strong></p>
              <p className="text-white/70 text-xl">By morning — <strong className="text-[#FF6200]">ready for review</strong></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── SLIDE 10: Closing ──────────────────────────────────────────

function Slide10() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh]">
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show">
        <div className="text-6xl md:text-[6rem] font-black leading-[1.05] mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
          The tools exist<br /><Accent>today.</Accent>
        </div>
      </motion.div>
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="show">
        <p className="text-xl md:text-2xl text-white/35 max-w-xl mx-auto mb-12">
          We built this app using exactly this approach.<br />The question is how fast you want to start.
        </p>
      </motion.div>
      <motion.div variants={fadeUp} custom={2} initial="hidden" animate="show">
        <div className="flex gap-3 flex-wrap justify-center">
          {["GitHub Copilot", "Claude Code", "Codex", "MCP", "Skills", "Hooks"].map(t => (
            <span key={t} className="text-sm font-mono px-5 py-2.5 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/20 text-[#FF6200]">{t}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Slide registry ─────────────────────────────────────────────

const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, Slide7, Slide8, Slide9, Slide10];

// ─── Main page ──────────────────────────────────────────────────

export function TechSlidesPage() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = useCallback((dir: number) => {
    setDirection(dir);
    setIndex(i => Math.max(0, Math.min(SLIDES.length - 1, i + dir)));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const CurrentSlide = SLIDES[index];

  return (
    <div
      className="h-screen w-screen bg-[#0a0a16] text-white overflow-hidden flex flex-col selection:bg-[#FF6200]/30 cursor-default"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      {/* Progress bar */}
      <div className="h-[3px] bg-white/[0.03] w-full shrink-0">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF6200] to-[#FF6200]/60"
          animate={{ width: `${((index + 1) / SLIDES.length) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Slide content */}
      <div className="flex-1 relative overflow-hidden" onClick={() => go(1)}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 px-10 md:px-20 py-12 overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto">
              <CurrentSlide />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimal bottom dots */}
      <div className="shrink-0 flex items-center justify-center py-5 gap-2">
        {SLIDES.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-400 ${i === index ? "w-6 h-1.5 bg-[#FF6200]" : "w-1.5 h-1.5 bg-white/10"}`}
          />
        ))}
      </div>
    </div>
  );
}
