import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

// --- Reveal wrapper ---
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function RevealLine({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

// --- Diagram components ---
function DiagramBox({ label, sub, color = "orange", className = "" }: { label: string; sub?: string; color?: "orange" | "white" | "dark" | "teal"; className?: string }) {
  const colors = {
    orange: "bg-[#FF6200] text-white border-[#FF6200]",
    white: "bg-white text-[#1a1a1a] border-gray-200",
    dark: "bg-[#1a1a2e] text-white border-[#2a2a4e]",
    teal: "bg-[#00C4CC]/10 text-[#00C4CC] border-[#00C4CC]/30",
  };
  return (
    <div className={`px-4 py-3 rounded-xl border-2 text-center ${colors[color]} ${className}`}>
      <div className="font-bold text-sm">{label}</div>
      {sub && <div className="text-xs opacity-70 mt-0.5">{sub}</div>}
    </div>
  );
}

function Arrow({ direction = "down" }: { direction?: "down" | "right" }) {
  if (direction === "right") return <div className="flex items-center px-2"><div className="w-8 h-0.5 bg-[#FF6200]" /><div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#FF6200]" /></div>;
  return <div className="flex flex-col items-center py-1"><div className="w-0.5 h-6 bg-[#FF6200]" /><div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-[#FF6200]" /></div>;
}

// --- Section wrapper ---
function Section({ id, dark = false, accent = false, children, className = "" }: { id: string; dark?: boolean; accent?: boolean; children: React.ReactNode; className?: string }) {
  const bg = accent ? "bg-gradient-to-br from-[#FF6200] to-[#e54d00]" : dark ? "bg-[#0d0d1a]" : "bg-white";
  const text = (dark || accent) ? "text-white" : "text-[#1a1a1a]";
  return (
    <section id={id} className={`min-h-screen flex items-center justify-center px-6 md:px-16 py-24 ${bg} ${text} ${className}`}>
      <div className="max-w-5xl w-full">{children}</div>
    </section>
  );
}

// --- Slide label ---
function SlideNum({ n }: { n: number }) {
  return <div className="text-[10px] font-mono tracking-[0.3em] uppercase opacity-30 mb-6">Slide {String(n).padStart(2, "0")}</div>;
}

// --- Large stat ---
function BigStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="mb-8">
        <div className="text-7xl md:text-9xl font-black tracking-tight leading-none" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>{value}</div>
        <div className="text-lg md:text-xl opacity-60 mt-2 max-w-md">{label}</div>
      </div>
    </Reveal>
  );
}

// --- Tool table row ---
function ToolRow({ name, desc, delay = 0 }: { name: string; desc: string; delay?: number }) {
  return (
    <RevealLine delay={delay}>
      <div className="flex items-baseline gap-4 py-3 border-b border-white/10 group">
        <code className="text-[#FF6200] font-mono text-sm shrink-0 w-52">{name}</code>
        <span className="text-white/60 text-sm">{desc}</span>
      </div>
    </RevealLine>
  );
}

// --- Navigation dots ---
function NavDots({ sections, active }: { sections: string[]; active: string }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-2">
      {sections.map((id, i) => (
        <a key={id} href={`#${id}`}
          className={`block w-2 h-2 rounded-full transition-all duration-300 ${active === id ? "bg-[#FF6200] scale-150" : "bg-gray-400/40 hover:bg-gray-400/70"}`}
          title={`Slide ${i + 1}`} />
      ))}
    </div>
  );
}

// --- Page ---
const SECTION_IDS = [
  "s1","s2","s3","s4","s5","s6","s7","s8","s9","s10",
  "s11","s12","s13","s14","s15","s16","s17","s18",
  "s19","s20","s21","s22","s23","s24","s25"
];

export function SlidesPage() {
  const [activeSection, setActiveSection] = useState("s1");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    }, { threshold: 0.4 });
    SECTION_IDS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-[#0d0d1a] selection:bg-[#FF6200]/30 selection:text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />

      <NavDots sections={SECTION_IDS} active={activeSection} />

      {/* ========== SLIDE 1 — Title ========== */}
      <Section id="s1" accent>
        <div className="text-center py-16">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="text-8xl md:text-[10rem] font-black tracking-tight leading-none mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              ING Leo
            </div>
            <div className="text-xl md:text-2xl font-light opacity-80 tracking-wide">
              AI-Powered Financial Education & Banking
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ========== SLIDE 2 — The Problem ========== */}
      <Section id="s2" dark>
        <SlideNum n={2} />
        <BigStat value="1 in 5" label="young people in Germany is in debt before 25" />
        <BigStat value="90%" label="of teenagers say they never got financial education in school" delay={0.3} />
      </Section>

      {/* ========== SLIDE 3 — The Gap ========== */}
      <Section id="s3">
        <SlideNum n={3} />
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            Where do young people<br />learn about money?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex gap-4 mb-8 flex-wrap">
            {["TikTok", "YouTube", "Finfluencers"].map((s, i) => (
              <span key={s} className="text-2xl md:text-4xl font-black text-[#FF6200]">{s}{i < 2 ? "." : ""}</span>
            ))}
          </div>
          <p className="text-xl text-gray-500 max-w-lg">Not from banks. Not from schools.</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 4 — The Solution ========== */}
      <Section id="s4" dark>
        <SlideNum n={4} />
        <Reveal>
          <h2 className="text-5xl md:text-7xl font-black mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>ING Leo</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <Reveal delay={0.1}>
            <div className="p-8 rounded-2xl bg-[#00C4CC]/10 border border-[#00C4CC]/20">
              <div className="text-3xl mb-2">🎮</div>
              <h3 className="text-2xl font-bold text-[#00C4CC] mb-2">Leo Junior</h3>
              <p className="text-white/60">Learn with virtual money. Real card, safe playground.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="p-8 rounded-2xl bg-[#FF6200]/10 border border-[#FF6200]/20">
              <div className="text-3xl mb-2">🦁</div>
              <h3 className="text-2xl font-bold text-[#FF6200] mb-2">Leo Pro</h3>
              <p className="text-white/60">Real banking with AI coaching. Proactive insights.</p>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.3}>
          <p className="text-xl text-white/50">Connected at one moment: <strong className="text-[#FF6200]">the 18th birthday</strong></p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 5 — Dual System ========== */}
      <Section id="s5">
        <SlideNum n={5} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>The Dual System</h2>
          <p className="text-gray-500 text-xl mb-12">Real ING debit card + Virtual money for learning. Two systems. Side by side.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-8 rounded-2xl text-center">
              <div className="text-5xl mb-4">💳</div>
              <h3 className="font-bold text-xl mb-2">Real Card</h3>
              <p className="text-gray-500">ING debit card for real purchases. Parent-controlled limits.</p>
            </div>
            <div className="bg-[#00C4CC]/5 p-8 rounded-2xl text-center border border-[#00C4CC]/20">
              <div className="text-5xl mb-4">v€</div>
              <h3 className="font-bold text-xl mb-2 text-[#00C4CC]">Virtual Money</h3>
              <p className="text-gray-500">Virtual salary, taxes, investments. Zero risk learning.</p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========== SLIDE 6 — Salary & Taxes ========== */}
      <Section id="s6" dark>
        <SlideNum n={6} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Virtual Salary & Taxes</h2>
          <p className="text-white/50 text-xl mb-8">Virtual salary with real tax deductions</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-lg">
            <p className="text-white/40 text-sm mb-4 italic">Lili asks:</p>
            <p className="text-2xl font-bold text-white mb-4">"Where did my money go?"</p>
            <p className="text-white/60">Leo explains — in simple language. Tax breakdown, social contributions, net vs. gross. Learning by experiencing.</p>
          </div>
        </Reveal>
      </Section>

      {/* ========== SLIDE 7 — Investment Simulator ========== */}
      <Section id="s7">
        <SlideNum n={7} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Investment Simulator</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: "📈", title: "Real Prices", desc: "Live stock data. Apple, Tesla, Deutsche Bank." },
            { icon: "v€", title: "Virtual Money", desc: "Practice trading with zero risk." },
            { icon: "🦁", title: "Leo Fragen", desc: "Full AI analysis. Ask follow-up questions." },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.15}>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========== SLIDE 8 — Quizzes & Battles ========== */}
      <Section id="s8" dark>
        <SlideNum n={8} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Quizzes & Battles</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "🤖", label: "AI-generated questions — unique every time" },
            { icon: "🏅", label: "13 badges — from Quiz-Starter to Finanz-Guru" },
            { icon: "🏆", label: "Leaderboard: weekly, all-time, school" },
            { icon: "💶", label: "Weekly winner: €25 to real account at 18" },
          ].map((item, i) => (
            <RevealLine key={item.label} delay={i * 0.1}>
              <div className="flex items-start gap-4 bg-white/5 p-5 rounded-xl border border-white/10">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-white/80">{item.label}</span>
              </div>
            </RevealLine>
          ))}
        </div>
        <Reveal delay={0.5}>
          <div className="mt-8 p-6 bg-[#FF6200]/10 rounded-2xl border border-[#FF6200]/20 text-center">
            <p className="text-[#FF6200] font-bold text-xl">Live Quiz Battles — like Kahoot</p>
            <p className="text-white/50 text-sm mt-1">Entire audience joins from their phones</p>
          </div>
        </Reveal>
      </Section>

      {/* ========== SLIDE 9 — Savings Goals ========== */}
      <Section id="s9">
        <SlideNum n={9} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Savings Goals</h2>
          <p className="text-gray-500 text-xl">Set a goal. Track progress. Leo encourages.</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 10 — Birthday Transition ========== */}
      <Section id="s10" accent>
        <div className="text-center py-12">
          <Reveal>
            <div className="text-6xl mb-6">🎂</div>
            <h2 className="text-5xl md:text-7xl font-black mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>The Birthday</h2>
            <p className="text-xl opacity-80 max-w-lg mx-auto">The moment everything changes. Junior becomes Adult. The animation IS the slide.</p>
          </Reveal>
          <Reveal delay={0.3}>
            <a href="/demo/birthday" target="_blank" className="inline-block mt-8 bg-white text-[#FF6200] px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
              Watch the Animation →
            </a>
          </Reveal>
        </div>
      </Section>

      {/* ========== SLIDE 11 — Adult Dashboard ========== */}
      <Section id="s11" dark>
        <SlideNum n={11} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>This Is Your App</h2>
          <p className="text-white/50 text-xl">The real ING app — enhanced with Leo</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex gap-4 flex-wrap">
            {["Girokonto", "Extra Konto", "Depot"].map(a => (
              <div key={a} className="bg-white/5 border border-white/10 px-6 py-4 rounded-xl">
                <div className="text-white/40 text-xs mb-1">{a}</div>
                <div className="text-white font-bold text-xl">€{(Math.random() * 10000 + 1000).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ========== SLIDE 12 — Anomaly Detection ========== */}
      <Section id="s12">
        <SlideNum n={12} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Anomaly Detection</h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-gray-500 text-xl mb-8">Leo finds problems you would not notice:</p>
        </Reveal>
        <div className="space-y-4">
          {[
            { icon: "🔄", label: "Duplicate subscriptions", color: "bg-red-50 border-red-100 text-red-700" },
            { icon: "⚠️", label: "Unusual charges", color: "bg-amber-50 border-amber-100 text-amber-700" },
            { icon: "📊", label: "Spending spikes", color: "bg-blue-50 border-blue-100 text-blue-700" },
          ].map((item, i) => (
            <RevealLine key={item.label} delay={i * 0.15}>
              <div className={`flex items-center gap-4 p-5 rounded-xl border ${item.color}`}>
                <span className="text-2xl">{item.icon}</span>
                <span className="font-bold text-lg">{item.label}</span>
              </div>
            </RevealLine>
          ))}
        </div>
      </Section>

      {/* ========== SLIDE 13 — Proactive Coaching ========== */}
      <Section id="s13" dark>
        <SlideNum n={13} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Proactive Coaching</h2>
          <p className="text-white/50 text-xl mb-10">Leo reaches out before you ask:</p>
        </Reveal>
        <div className="space-y-4 max-w-2xl">
          {[
            "\"Rent due in 3 days — balance is low\"",
            "\"Delivery 4x this week — €62. Last week: €15\"",
            "\"You hit your savings goal early!\"",
          ].map((msg, i) => (
            <RevealLine key={i} delay={i * 0.2}>
              <div className="flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center shrink-0 text-white font-bold text-lg">🦁</div>
                <p className="text-white/80 text-lg italic">{msg}</p>
              </div>
            </RevealLine>
          ))}
        </div>
      </Section>

      {/* ========== SLIDE 14 — Subscription Manager ========== */}
      <Section id="s14">
        <SlideNum n={14} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Subscription Manager</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="font-bold text-lg text-red-700 mb-2">Detects Unused</h3>
              <p className="text-red-600/70 text-sm">AI analyzes usage patterns and flags subscriptions you haven't used in months.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
              <div className="text-2xl mb-3">✉️</div>
              <h3 className="font-bold text-lg text-green-700 mb-2">Drafts Cancellation</h3>
              <p className="text-green-600/70 text-sm">Leo writes the cancellation email for you. One tap to send.</p>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========== SLIDE 15 — AI Chat with Widgets ========== */}
      <Section id="s15" dark>
        <SlideNum n={15} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>AI Chat with Widgets</h2>
        </Reveal>
        <div className="space-y-6 max-w-2xl">
          {[
            { msg: "\"Send 50€ to Ben\"", widget: "→ transfer widget", color: "text-violet-400" },
            { msg: "\"How did I spend this month?\"", widget: "→ spending chart", color: "text-blue-400" },
            { msg: "\"How are my investments?\"", widget: "→ portfolio analysis", color: "text-emerald-400" },
          ].map((item, i) => (
            <RevealLine key={i} delay={i * 0.15}>
              <div className="flex items-center gap-4">
                <span className="text-white/80 text-lg">{item.msg}</span>
                <span className={`font-mono text-sm ${item.color}`}>{item.widget}</span>
              </div>
            </RevealLine>
          ))}
        </div>
        <Reveal delay={0.5}>
          <p className="text-white/40 text-xl mt-10">One message. One tap.</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 16 — Investment Agent ========== */}
      <Section id="s16">
        <SlideNum n={16} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Investment Agent</h2>
          <p className="text-gray-500 text-xl mb-8">Real-time market news. Sector analysis. Risk assessment.</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="bg-gray-50 p-8 rounded-2xl max-w-lg">
            <p className="text-xl italic text-gray-700">"Your portfolio is 60% tech. Consider diversifying."</p>
            <p className="text-sm text-gray-400 mt-4">— Leo, analyzing your holdings</p>
          </div>
        </Reveal>
      </Section>

      {/* ========== SLIDE 17 — Parent Dashboard ========== */}
      <Section id="s17" dark>
        <SlideNum n={17} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Parent Dashboard</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-8">
          <Reveal delay={0.1}>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-[#00C4CC] font-bold text-lg mb-4">Parents See</h3>
              {["Learning progress", "Quiz scores & achievements", "Savings goals"].map(s => (
                <div key={s} className="text-white/60 py-1.5 border-b border-white/5 text-sm">{s}</div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-[#FF6200] font-bold text-lg mb-4">Parents Control</h3>
              {["Daily spending limits", "Category restrictions", "Risk profile"].map(s => (
                <div key={s} className="text-white/60 py-1.5 border-b border-white/5 text-sm">{s}</div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========== SLIDE 18 — Trust & Compliance ========== */}
      <Section id="s18">
        <SlideNum n={18} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Trust & Compliance</h2>
        </Reveal>
        <div className="space-y-6">
          {[
            { n: "1", text: "Your data stays yours — no third-party sharing" },
            { n: "2", text: "Leo suggests — you decide. Never acts alone." },
            { n: "3", text: "GDPR + EU AI Act compliant. Every recommendation explainable." },
          ].map((item, i) => (
            <RevealLine key={item.n} delay={i * 0.15}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#FF6200] rounded-full flex items-center justify-center text-white font-bold shrink-0">{item.n}</div>
                <p className="text-lg text-gray-700 pt-2">{item.text}</p>
              </div>
            </RevealLine>
          ))}
        </div>
        <Reveal delay={0.5}>
          <p className="text-gray-400 mt-8">Minors: parental consent, age verification, simple language</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 19 — Tech: Vibe Coding ========== */}
      <Section id="s19" dark>
        <SlideNum n={19} />
        <Reveal>
          <div className="text-[#FF6200] text-xs font-mono tracking-widest uppercase mb-4">Technical Deep Dive</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>How We Built It</h2>
          <p className="text-3xl font-bold text-[#FF6200] mb-10">Vibe Coding</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex items-center gap-4 flex-wrap mb-10">
            <DiagramBox label="Describe" sub="What you want" color="white" />
            <Arrow direction="right" />
            <DiagramBox label="AI Builds" sub="Claude Code" color="orange" />
            <Arrow direction="right" />
            <DiagramBox label="Working App" sub="Test immediately" color="white" />
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-white/50 text-lg mb-6">No Figma. No static mockups. Working prototype in hours.</p>
          <p className="text-white/30 font-mono text-sm">Stack: React 19 · Node.js · TypeScript · PostgreSQL</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 20 — Tech: How Leo Works ========== */}
      <Section id="s20" className="bg-[#0a0a16]">
        <SlideNum n={20} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>How Leo's AI Works</h2>
          <p className="text-white/50 text-xl mb-12">Leo is an <strong className="text-[#FF6200]">AI agent</strong> — not a chatbot</p>
        </Reveal>

        {/* Architecture diagram */}
        <Reveal delay={0.2}>
          <div className="flex flex-col items-center gap-1 mb-12">
            <DiagramBox label="User Message" sub={'"How did I spend?"'} color="white" />
            <Arrow />
            <DiagramBox label="AI Model (GPT)" sub="Reads message, decides action" color="dark" className="border-[#FF6200]" />
            <Arrow />
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <DiagramBox label="get_transactions()" color="teal" />
              <DiagramBox label="show_spending_chart()" color="teal" />
            </div>
            <Arrow />
            <DiagramBox label="AI Analyzes Data" sub="Generates response + widget" color="dark" className="border-[#FF6200]" />
            <Arrow />
            <DiagramBox label="User Sees" sub="Text + interactive chart" color="orange" />
          </div>
        </Reveal>

        {/* 10 Tools Table */}
        <Reveal delay={0.3}>
          <h3 className="text-white font-bold text-lg mb-4">10 Agent Tools</h3>
        </Reveal>
        <div className="max-w-2xl">
          <ToolRow name="show_stock_widget" desc="Display stock price and analysis" delay={0.05} />
          <ToolRow name="show_transfer_widget" desc="Start a money transfer" delay={0.1} />
          <ToolRow name="start_quiz" desc="Launch a quiz" delay={0.15} />
          <ToolRow name="show_achievement" desc="Show a badge or reward" delay={0.2} />
          <ToolRow name="show_savings_goal" desc="Display savings progress" delay={0.25} />
          <ToolRow name="show_spending_chart" desc="Visualize spending" delay={0.3} />
          <ToolRow name="navigate_to_screen" desc="Go to a specific screen" delay={0.35} />
          <ToolRow name="get_portfolio_data" desc="Fetch investment data" delay={0.4} />
          <ToolRow name="get_account_balance" desc="Get account balances" delay={0.45} />
          <ToolRow name="get_recent_transactions" desc="Get transaction history" delay={0.5} />
        </div>

        <Reveal delay={0.6}>
          <p className="text-white/40 mt-8">Same AI for Junior and Adult — different personality via system prompts</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 21 — Tech: AI Coding Agents ========== */}
      <Section id="s21" dark>
        <SlideNum n={21} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>How ING Can Build This Fast</h2>
          <p className="text-white/50 text-xl mb-10">AI Coding Agents — built into GitHub today</p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="flex items-center gap-3 flex-wrap mb-10">
            <DiagramBox label="Task Described" color="white" />
            <Arrow direction="right" />
            <DiagramBox label="AI Agent Writes Code" color="orange" />
            <Arrow direction="right" />
            <DiagramBox label="Runs Tests" color="dark" className="border-white/20" />
            <Arrow direction="right" />
            <DiagramBox label="Human Reviews" color="white" />
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="text-white/40">Multiple AI engines: Copilot, Claude, Codex</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 22 — Enterprise Controls ========== */}
      <Section id="s22">
        <SlideNum n={22} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Enterprise Controls</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "Custom Instructions", desc: "Company coding standards — AI follows them", icon: "📋" },
            { title: "Skills", desc: "Step-by-step recipes for common tasks", icon: "⚡" },
            { title: "MCP", desc: "Universal plug to connect any internal tool", icon: "🔌" },
            { title: "Hooks", desc: "Safety rules + full audit log", icon: "🛡️" },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========== SLIDE 23 — What This Means ========== */}
      <Section id="s23" dark>
        <SlideNum n={23} />
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-bold mb-10" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>What This Means for ING</h2>
        </Reveal>
        <div className="space-y-6 max-w-2xl">
          <RevealLine delay={0.1}>
            <div className="flex gap-4 items-baseline">
              <span className="text-[#FF6200] font-bold text-sm w-24 shrink-0">Morning</span>
              <span className="text-white/70 text-lg">Someone describes a task</span>
            </div>
          </RevealLine>
          <RevealLine delay={0.2}>
            <div className="flex gap-4 items-baseline">
              <span className="text-[#FF6200] font-bold text-sm w-24 shrink-0">Afternoon</span>
              <span className="text-white/70 text-lg">AI agent delivers working code</span>
            </div>
          </RevealLine>
          <RevealLine delay={0.3}>
            <div className="flex gap-4 items-baseline">
              <span className="text-[#FF6200] font-bold text-sm w-24 shrink-0">Review</span>
              <span className="text-white/70 text-lg">Senior developer checks in 10 minutes</span>
            </div>
          </RevealLine>
        </div>
        <Reveal delay={0.5}>
          <p className="text-white/30 mt-10 text-lg">Test fails at 2 AM? Agent fixes it overnight.</p>
        </Reveal>
      </Section>

      {/* ========== SLIDE 24 — Closing ========== */}
      <Section id="s24" accent>
        <div className="py-12">
          <Reveal>
            <div className="text-7xl md:text-9xl font-black mb-8" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>1 in 5</div>
            <p className="text-xl opacity-80 mb-12 max-w-lg">young people in Germany is in debt. We built something that fits inside the app you already have.</p>
          </Reveal>
          <div className="space-y-4 max-w-xl">
            <RevealLine delay={0.1}><p className="text-lg"><strong>For kids:</strong> learn by doing — real card, virtual money</p></RevealLine>
            <RevealLine delay={0.2}><p className="text-lg"><strong>For adults:</strong> AI that coaches, catches problems, makes banking easier</p></RevealLine>
            <RevealLine delay={0.3}><p className="text-lg"><strong>For parents:</strong> visibility and control</p></RevealLine>
            <RevealLine delay={0.4}><p className="text-lg"><strong>For ING dev:</strong> build faster with AI agents</p></RevealLine>
          </div>
        </div>
      </Section>

      {/* ========== SLIDE 25 — Q&A ========== */}
      <Section id="s25" dark>
        <div className="text-center py-24">
          <Reveal>
            <h2 className="text-6xl md:text-8xl font-black mb-6" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>Thank You</h2>
            <p className="text-white/40 text-xl">We are ready for your questions.</p>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
