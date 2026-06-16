"use client";
import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const N = 60;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.6
        ? `rgba(212,175,55,${Math.random() * 0.5 + 0.1})`
        : Math.random() > 0.5
        ? `rgba(57,255,20,${Math.random() * 0.3 + 0.05})`
        : `rgba(100,149,237,${Math.random() * 0.3 + 0.05})`,
    }));
    let raf: number;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.7 }} />;
}

function CandleChart({ animated }: { animated: boolean }) {
  const candles = [
    { x: 20, open: 80, close: 55, high: 45, low: 90, bull: false },
    { x: 45, open: 55, close: 35, high: 28, low: 62, bull: true },
    { x: 70, open: 35, close: 50, high: 20, low: 58, bull: false },
    { x: 95, open: 50, close: 30, high: 22, low: 58, bull: true },
    { x: 120, open: 30, close: 15, high: 8, low: 38, bull: true },
    { x: 145, open: 15, close: 40, high: 5, low: 48, bull: false },
    { x: 170, open: 40, close: 25, high: 18, low: 48, bull: true },
    { x: 195, open: 25, close: 10, high: 3, low: 32, bull: true },
  ];
  return (
    <svg viewBox="0 0 220 100" style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 8px rgba(212,175,55,0.4))" }}>
      {[20, 40, 60, 80].map(y => (
        <line key={y} x1="0" y1={y} x2="220" y2={y} stroke="rgba(212,175,55,0.08)" strokeWidth="0.5" strokeDasharray="4,4" />
      ))}
      {candles.map((c, i) => (
        <g key={i} style={{ opacity: animated ? 1 : 0, transition: `opacity 0.4s ease ${i * 0.1}s` }}>
          <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={c.bull ? "#39FF14" : "#ff4455"} strokeWidth="1" />
          <rect x={c.x - 6} y={Math.min(c.open, c.close)} width="12" height={Math.abs(c.open - c.close) || 1} fill={c.bull ? "#39FF14" : "#ff4455"} rx="1" opacity="0.85" />
        </g>
      ))}
      <polyline points="20,72 45,48 70,42 95,35 120,22 145,28 170,32 195,18" fill="none" stroke="#D4AF37" strokeWidth="1.5" opacity="0.7"
        style={{ strokeDasharray: 200, strokeDashoffset: animated ? 0 : 200, transition: "stroke-dashoffset 2s ease" }} />
    </svg>
  );
}

function Monitor3D() {
  const [chartVisible, setChartVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setChartVisible(true), 800); return () => clearTimeout(t); }, []);
  return (
    <div style={{ perspective: "900px", width: "100%", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ transform: "rotateX(6deg) rotateY(-8deg)", transformStyle: "preserve-3d", transition: "transform 0.6s ease", filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.8))" }}>
        <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0d0d1a)", border: "1.5px solid rgba(212,175,55,0.4)", borderRadius: 12, padding: "10px 10px 0", boxShadow: "0 0 0 1px rgba(212,175,55,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            {["#ff5f57","#febc2e","#28c840"].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, height: 16, background: "rgba(255,255,255,0.04)", borderRadius: 4, marginLeft: 8, display: "flex", alignItems: "center", paddingLeft: 8 }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>bakartech.academy — XAUUSD Live</span>
            </div>
          </div>
          <div style={{ background: "#0a0a14", borderRadius: "6px 6px 0 0", padding: "12px 8px 8px", height: 200, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#D4AF37", fontSize: 10, fontFamily: "monospace", fontWeight: 700 }}>XAUUSD</span>
              <span style={{ color: "#39FF14", fontSize: 10, fontFamily: "monospace" }}>▲ 2,345.67 +12.3</span>
            </div>
            <CandleChart animated={chartVisible} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 60, height: 8, background: "linear-gradient(135deg,#1a1a2e,#0d0d1a)", borderRadius: "0 0 4px 4px", border: "1px solid rgba(212,175,55,0.2)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: 100, height: 4, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)", borderRadius: 4, marginTop: 2 }} />
        </div>
      </div>
    </div>
  );
}

function FadeSection({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function Navbar({ scrollY }: { scrollY: number }) {
  const scrolled = scrollY > 60;
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: scrolled ? "rgba(5,5,15,0.95)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? "1px solid rgba(212,175,55,0.15)" : "none", transition: "all 0.4s ease", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, direction: "rtl" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#D4AF37,#B8860B)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(212,175,55,0.6)", fontSize: 16, fontWeight: 900, color: "#000" }}>B</div>
        <div>
          <div style={{ color: "#D4AF37", fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}>BakarTech</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>Academy</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {["دوره‌ها","مسیر یادگیری","لایو ترید","تماس"].map(item => (
          <span key={item} style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, cursor: "pointer", fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{item}</span>
        ))}
        <button style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", border: "none", borderRadius: 6, padding: "8px 18px", color: "#000", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>شروع رایگان</button>
      </div>
    </nav>
  );
}

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "80px 24px 40px", position: "relative", direction: "rtl", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse 70% 60% at 30% 40%,rgba(212,175,55,0.06) 0%,transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(212,175,55,1) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", width: "100%", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(40px)", transition: "all 1s ease 0.2s" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 20, padding: "5px 14px", marginBottom: 24 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#39FF14", boxShadow: "0 0 8px #39FF14" }} />
            <span style={{ color: "#D4AF37", fontSize: 11, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>آموزش فارکس، طلا و کریپتو</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.25, marginBottom: 20, fontFamily: "'Vazirmatn','Segoe UI',sans-serif", fontWeight: 900 }}>
            <span style={{ color: "#fff", display: "block" }}>مسیر تبدیل شدن</span>
            <span style={{ background: "linear-gradient(135deg,#D4AF37,#FFD700,#B8860B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>به تریدر حرفه‌ای</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.9, marginBottom: 36, fontFamily: "'Vazirmatn','Segoe UI',sans-serif", maxWidth: 440 }}>
            آموزش فارکس، طلا، کریپتو، مدیریت سرمایه و روانشناسی معامله‌گری — <strong style={{ color: "rgba(255,255,255,0.8)" }}>با دانش، نه با شانس</strong>
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", border: "none", borderRadius: 8, padding: "14px 28px", color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer", boxShadow: "0 0 30px rgba(212,175,55,0.4)", fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>🚀 شروع آموزش</button>
            <button style={{ background: "transparent", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 8, padding: "14px 28px", color: "#D4AF37", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>مشاهده دوره‌ها</button>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 44, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[{ value: 500, suffix: "+", label: "دانشجو فعال" },{ value: 3, suffix: " سال", label: "تجربه تدریس" },{ value: 10, suffix: "+", label: "دوره تخصصی" }].map(({ value, suffix, label }) => (
              <div key={label}>
                <div style={{ color: "#D4AF37", fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}><Counter target={value} suffix={suffix} /></div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "'Vazirmatn','Segoe UI',sans-serif", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(-40px)", transition: "all 1s ease 0.5s" }}>
          <Monitor3D />
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {["XAUUSD ▲","EUR/USD ▲","BTC ▲","NASDAQ ▼"].map((t, i) => (
              <span key={i} style={{ background: "rgba(10,10,20,0.8)", border: `1px solid ${t.includes("▼") ? "rgba(255,68,85,0.4)" : "rgba(57,255,20,0.3)"}`, borderRadius: 4, padding: "4px 10px", fontSize: 10, color: t.includes("▼") ? "#ff4455" : "#39FF14", fontFamily: "monospace" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  { icon: "📚", title: "مفاهیم پایه بازار", desc: "آشنایی با بازارهای مالی، تاریخچه، انواع بازارها و نحوه کارکرد آن‌ها" },
  { icon: "🖥️", title: "ابزارهای تریدر", desc: "تسلط بر پلتفرم‌های MT5 و TradingView برای تحلیل و اجرای معاملات" },
  { icon: "📈", title: "تحلیل تکنیکال", desc: "پرایس اکشن، الگوهای کندلی، سطوح حمایت و مقاومت و ساختار بازار" },
  { icon: "💰", title: "مدیریت سرمایه", desc: "محاسبه ریسک، تعیین حجم معامله و حفظ سرمایه در شرایط مختلف" },
  { icon: "🧠", title: "روانشناسی ترید", desc: "کنترل احساسات، غلبه بر ترس و طمع و ایجاد ذهنیت معامله‌گر حرفه‌ای" },
  { icon: "📋", title: "ساخت پلن معاملاتی", desc: "طراحی استراتژی شخصی، تعیین قوانین ورود و خروج و بک‌تست گیری" },
  { icon: "📓", title: "تمرین و ژورنال", desc: "ثبت معاملات، بررسی اشتباهات و بهینه‌سازی مستمر عملکرد" },
  { icon: "🌐", title: "ورود به بازار واقعی", desc: "شروع با حساب واقعی با رویکرد محافظه‌کارانه و مدیریت ریسک کامل" },
  { icon: "🤝", title: "پشتیبانی و رفع اشکال", desc: "دسترسی به منتور، بررسی معاملات و راهنمایی در تصمیم‌گیری‌های حساس" },
  { icon: "🏆", title: "تریدر مستقل", desc: "معامله‌گری سودآور، مستقل و با اعتماد به نفس در بازارهای جهانی" },
];

function JourneySection() {
  const [activeStep, setActiveStep] = useState(-1);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const idx = parseInt((entry.target as HTMLElement).dataset.idx || "0");
        if (entry.isIntersecting) setActiveStep(prev => Math.max(prev, idx));
      });
    }, { threshold: 0.5 });
    stepRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return (
    <section style={{ padding: "100px 24px", position: "relative", direction: "rtl" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <FadeSection style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ color: "#D4AF37", fontSize: 12, letterSpacing: 3, marginBottom: 12, fontFamily: "monospace" }}>— ROADMAP —</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, fontFamily: "'Vazirmatn','Segoe UI',sans-serif", color: "#fff", marginBottom: 16 }}>مسیر تریدر حرفه‌ای</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>از صفر تا معامله‌گری مستقل — گام به گام با ما</p>
        </FadeSection>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", right: 19, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#D4AF37,rgba(212,175,55,0.1))" }} />
          {steps.map((step, i) => (
            <div key={i} ref={el => { stepRefs.current[i] = el; }} data-idx={i} style={{ display: "flex", alignItems: "flex-start", gap: 24, marginBottom: 36, opacity: activeStep >= i ? 1 : 0.15, transform: activeStep >= i ? "translateX(0)" : "translateX(-20px)", transition: `all 0.5s ease ${i * 0.05}s` }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: activeStep >= i ? "linear-gradient(135deg,#D4AF37,#B8860B)" : "rgba(255,255,255,0.05)", border: `2px solid ${activeStep >= i ? "#D4AF37" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, boxShadow: activeStep >= i ? "0 0 20px rgba(212,175,55,0.5)" : "none", transition: "all 0.4s ease", zIndex: 1, position: "relative" }}>
                  {activeStep >= i ? step.icon : <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{i + 1}</span>}
                </div>
              </div>
              <div style={{ background: activeStep >= i ? "rgba(212,175,55,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${activeStep >= i ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, padding: "16px 20px", flex: 1, transition: "all 0.4s ease" }}>
                <div style={{ color: "rgba(212,175,55,0.5)", fontSize: 10, fontFamily: "monospace", marginBottom: 6 }}>مرحله {i + 1}</div>
                <h3 style={{ color: activeStep >= i ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 16, fontWeight: 700, marginBottom: 6, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{step.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const courses = [
  { icon: "🎓", title: "دوره جامع بازارهای مالی", desc: "آموزش کامل از پایه تا پیشرفته", badge: "پرفروش", badgeColor: "#D4AF37", price: "VIP" },
  { icon: "📊", title: "آموزش فارکس و طلا", desc: "تحلیل جفت‌ارزها و XAUUSD", badge: "پیشنهاد ویژه", badgeColor: "#39FF14", price: "متوسط" },
  { icon: "💻", title: "آموزش MT5", desc: "تسلط کامل بر MetaTrader 5", badge: null, price: "مقدماتی" },
  { icon: "📉", title: "آموزش TradingView", desc: "رسم سطوح و ابزارهای تحلیل", badge: null, price: "مقدماتی" },
  { icon: "🛡️", title: "مدیریت سرمایه", desc: "محاسبه ریسک و حفاظت از حساب", badge: "ضروری", badgeColor: "#6495ED", price: "متوسط" },
  { icon: "🧬", title: "روانشناسی ترید", desc: "کنترل احساسات و انضباط معاملاتی", badge: null, price: "پیشرفته" },
  { icon: "👑", title: "پکیج VIP", desc: "همه دوره‌ها + پشتیبانی اختصاصی", badge: "جامع‌ترین", badgeColor: "#D4AF37", price: "جامع" },
];

function CoursesSection() {
  return (
    <section style={{ padding: "100px 24px", direction: "rtl" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <FadeSection style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ color: "#D4AF37", fontSize: 12, letterSpacing: 3, marginBottom: 12, fontFamily: "monospace" }}>— COURSES —</div>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, fontFamily: "'Vazirmatn','Segoe UI',sans-serif", color: "#fff" }}>دوره‌های آموزشی</h2>
        </FadeSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {courses.map((course, i) => (
            <FadeSection key={i} delay={i * 0.08}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 20px", cursor: "pointer", position: "relative" }}>
                {course.badge && <div style={{ position: "absolute", top: 14, left: 14, background: `${course.badgeColor}22`, border: `1px solid ${course.badgeColor}55`, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: course.badgeColor, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{course.badge}</div>}
                <div style={{ fontSize: 32, marginBottom: 16 }}>{course.icon}</div>
                <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 10, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{course.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.7, marginBottom: 18, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{course.desc}</p>
                <span style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 4, padding: "3px 10px", fontSize: 10, color: "#D4AF37", fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{course.price}</span>
              </div>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section style={{ padding: "100px 24px 60px", direction: "rtl" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <FadeSection>
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, fontFamily: "'Vazirmatn','Segoe UI',sans-serif", color: "#fff", marginBottom: 16 }}>آماده شروع هستید؟</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 48, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>همین الان با ما در ارتباط باشید</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "💬", label: "واتساپ", value: "+966538446545", color: "#25D366", href: "https://wa.me/966538446545" },
              { icon: "✈️", label: "تلگرام", value: "@kamalhaqjo", color: "#229ED9", href: "https://t.me/kamalhaqjo" },
              { icon: "📧", label: "ایمیل", value: "Bakartechlimited@gmail.com", color: "#D4AF37", href: "mailto:Bakartechlimited@gmail.com" },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${c.color}33`, borderRadius: 14, padding: "20px 24px", minWidth: 200, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 28 }}>{c.icon}</div>
                  <div style={{ color: c.color, fontSize: 13, fontWeight: 700, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>{c.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "monospace" }}>{c.value}</div>
                </div>
              </a>
            ))}
          </div>
        </FadeSection>
      </div>
    </section>
  );
}

export default function App() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{ background: "#050510", minHeight: "100vh", color: "#fff", fontFamily: "'Vazirmatn','Segoe UI',Tahoma,sans-serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050510; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a18; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 2px; }
      `}</style>
      <Particles />
      <Navbar scrollY={scrollY} />
      <main>
        <HeroSection />
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.2),transparent)", margin: "0 40px" }} />
        <JourneySection />
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.1),transparent)", margin: "0 40px" }} />
        <CoursesSection />
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.1),transparent)", margin: "0 40px" }} />
        <ContactSection />
      </main>
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", direction: "rtl", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg,#D4AF37,#B8860B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#000", boxShadow: "0 0 14px rgba(212,175,55,0.4)" }}>B</div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "'Vazirmatn','Segoe UI',sans-serif" }}>BakarTech Academy — آموزش ترید با دانش، نه با شانس</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "monospace" }}>© 2025 BakarTech Academy</span>
      </footer>
    </div>
  );
}
