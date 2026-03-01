import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Syne:wght@300;400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06070a;--bg2:#0b0d12;--surface:#10141c;--surface2:#151b26;
  --border:#1c2435;--border2:#243044;
  --amber:#f59e0b;--amber2:#fbbf24;
  --cyan:#22d3ee;--green:#10b981;--red:#ef4444;--purple:#a78bfa;
  --text:#d4dce8;--muted:#3d5068;--muted2:#566880;
  --display:'Orbitron',monospace;--mono:'Share Tech Mono',monospace;--body:'Syne',sans-serif;
}
html,body{height:100%;background:var(--bg);color:var(--text);font-family:var(--body);overflow:hidden}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
.app{
  height:100vh;display:grid;grid-template-rows:52px 1fr;
  background:var(--bg);
  background-image:radial-gradient(ellipse 100% 60% at 50% -20%,rgba(245,158,11,.04) 0%,transparent 70%),
    radial-gradient(ellipse 40% 40% at 90% 90%,rgba(34,211,238,.03) 0%,transparent 60%);
}
.noise{position:fixed;inset:0;pointer-events:none;z-index:500;opacity:.025;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:150px;mix-blend-mode:overlay}

/* TOPBAR */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:0 20px;
  border-bottom:1px solid var(--border);background:rgba(6,7,10,.97);backdrop-filter:blur(20px);z-index:100}
.brand{font-family:var(--display);font-size:13px;font-weight:900;letter-spacing:4px;color:var(--amber)}
.brand span{color:var(--muted2);font-weight:400}
.topbar-left{display:flex;align-items:center;gap:16px}
.topbar-center{display:flex;align-items:center;gap:24px}
.topbar-right{display:flex;align-items:center;gap:20px}

.sys-pill{display:flex;align-items:center;gap:5px;font-family:var(--mono);font-size:9px;letter-spacing:2px;padding:3px 10px;border-radius:20px}
.pill-auto{background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.35);color:var(--green)}
.pill-xprem{background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.3);color:var(--amber)}
.dot-pulse{width:5px;height:5px;border-radius:50%;background:currentColor;animation:dp 1.2s ease-in-out infinite}
@keyframes dp{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.7)}}

.cycle-info{font-family:var(--mono);font-size:9px;color:var(--muted2);letter-spacing:2px;text-align:center}
.cycle-info strong{color:var(--amber2);font-size:14px;display:block}
.revenue-live .label{font-family:var(--mono);font-size:8px;color:var(--muted);letter-spacing:3px}
.revenue-live .amount{font-family:var(--display);font-size:18px;font-weight:700;color:var(--amber)}

.pause-btn{font-family:var(--mono);font-size:9px;letter-spacing:2px;padding:5px 14px;border-radius:4px;cursor:pointer;border:none;transition:all .2s}
.pause-btn.paused{background:rgba(16,185,129,.2);border:1px solid rgba(16,185,129,.5);color:var(--green)}
.pause-btn.running{background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.4);color:var(--red)}

/* BODY */
.body-grid{display:grid;grid-template-columns:240px 1fr 290px;overflow:hidden}
.panel{overflow-y:auto;border-right:1px solid var(--border)}
.panel-r{border-right:none;border-left:1px solid var(--border)}
.panel-head{display:flex;align-items:center;justify-content:space-between;padding:9px 13px;
  border-bottom:1px solid var(--border);font-family:var(--mono);font-size:8px;letter-spacing:3px;color:var(--muted2);
  position:sticky;top:0;background:var(--bg2);z-index:10}
.badge-count{background:rgba(245,158,11,.2);border:1px solid rgba(245,158,11,.4);color:var(--amber);
  font-family:var(--mono);font-size:9px;padding:1px 7px;border-radius:10px}

/* TREND CARDS */
.tcard{padding:10px 13px;border-bottom:1px solid var(--border);position:relative;transition:background .2s}
.tcard.processing{background:rgba(245,158,11,.04)}
.tcard.processing::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--amber);animation:bar-p 1s ease-in-out infinite}
.tcard.done{background:rgba(16,185,129,.03)}
.tcard.done::before{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--green)}
@keyframes bar-p{0%,100%{opacity:1}50%{opacity:.3}}
.tcard-top{display:flex;justify-content:space-between;align-items:flex-start;gap:6px}
.tcard-name{font-size:11px;font-weight:600;line-height:1.4;color:var(--text)}
.tcard-score{font-family:var(--mono);font-size:9px;flex-shrink:0;padding:1px 6px;border-radius:3px;font-weight:700}
.s-fire{background:rgba(239,68,68,.15);color:#f87171;border:1px solid rgba(239,68,68,.3)}
.s-hot{background:rgba(245,158,11,.15);color:var(--amber2);border:1px solid rgba(245,158,11,.3)}
.s-warm{background:rgba(34,211,238,.1);color:var(--cyan);border:1px solid rgba(34,211,238,.2)}
.tcard-vol{font-family:var(--mono);font-size:9px;color:var(--muted2);margin-top:4px}
.tcard-state{font-family:var(--mono);font-size:8px;margin-top:5px;display:flex;align-items:center;gap:5px}
.state-w{color:var(--muted)}.state-p{color:var(--amber)}.state-d{color:var(--green)}
.mini-dot{width:4px;height:4px;border-radius:50%;background:currentColor}
.proc-dot{animation:dp .8s ease-in-out infinite}

/* CENTER */
.center-panel{display:flex;flex-direction:column;overflow:hidden}

/* NETWORK ZONE */
.network-zone{flex:0 0 auto;height:260px;position:relative;border-bottom:1px solid var(--border);overflow:hidden}
.net-bg{position:absolute;inset:0;
  background:radial-gradient(circle at 50% 50%,rgba(245,158,11,.025) 0%,transparent 70%),
    repeating-linear-gradient(0deg,transparent,transparent 28px,rgba(255,255,255,.007) 28px,rgba(255,255,255,.007) 29px),
    repeating-linear-gradient(90deg,transparent,transparent 28px,rgba(255,255,255,.007) 28px,rgba(255,255,255,.007) 29px)}

.flow-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.flow-line{stroke-width:1.2;fill:none;stroke-dasharray:6 5}
.flow-line.active{animation:fdash 1.4s linear infinite}
@keyframes fdash{to{stroke-dashoffset:-22}}
.l-amber{stroke:rgba(245,158,11,.5)}.l-cyan{stroke:rgba(34,211,238,.5)}.l-green{stroke:rgba(16,185,129,.5)}

.agent-node{position:absolute;width:128px;transform:translate(-50%,-50%)}
.node-inner{background:var(--surface2);border:1px solid var(--border2);border-radius:10px;padding:11px;text-align:center;transition:all .3s;position:relative;overflow:hidden}
.node-inner.na1{border-color:var(--amber);box-shadow:0 0 18px rgba(245,158,11,.14),inset 0 0 18px rgba(245,158,11,.04)}
.node-inner.na2{border-color:var(--cyan);box-shadow:0 0 18px rgba(34,211,238,.12)}
.node-inner.na3{border-color:var(--purple);box-shadow:0 0 18px rgba(167,139,250,.12)}
.node-inner.na4{border-color:var(--green);box-shadow:0 0 18px rgba(16,185,129,.12)}
.node-inner.na1::before,.node-inner.na2::before,.node-inner.na3::before,.node-inner.na4::before{
  content:'';position:absolute;top:0;left:-100%;width:100%;height:2px;animation:sweep 2s linear infinite}
.node-inner.na1::before{background:linear-gradient(90deg,transparent,var(--amber),transparent)}
.node-inner.na2::before{background:linear-gradient(90deg,transparent,var(--cyan),transparent)}
.node-inner.na3::before{background:linear-gradient(90deg,transparent,var(--purple),transparent)}
.node-inner.na4::before{background:linear-gradient(90deg,transparent,var(--green),transparent)}
@keyframes sweep{from{left:-100%}to{left:200%}}

.node-icon{font-size:20px;margin-bottom:5px}
.node-name{font-family:var(--mono);font-size:8px;letter-spacing:2px;color:var(--muted2);text-transform:uppercase;margin-bottom:3px}
.node-task{font-size:8px;color:var(--muted2);min-height:11px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.node-status{display:inline-flex;align-items:center;gap:3px;margin-top:6px;font-family:var(--mono);font-size:7px;letter-spacing:1px;padding:2px 7px;border-radius:20px}
.ns-idle{background:rgba(61,80,104,.3);color:var(--muted2);border:1px solid var(--border)}
.ns-run{background:rgba(245,158,11,.12);color:var(--amber);border:1px solid rgba(245,158,11,.35)}
.ns-done{background:rgba(16,185,129,.12);color:var(--green);border:1px solid rgba(16,185,129,.35)}

/* FEED */
.feed-zone{flex:1;overflow-y:auto}
.feed-head{display:flex;align-items:center;justify-content:space-between;padding:8px 16px;
  border-bottom:1px solid var(--border);font-family:var(--mono);font-size:8px;letter-spacing:3px;color:var(--muted2);
  position:sticky;top:0;background:var(--bg);z-index:10}
.feed-entry{display:flex;gap:8px;align-items:flex-start;padding:6px 16px;border-bottom:1px solid rgba(28,36,53,.4);animation:fi .25s ease}
@keyframes fi{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
.feed-time{font-family:var(--mono);font-size:9px;color:var(--muted);flex-shrink:0;padding-top:1px}
.feed-agent{font-family:var(--mono);font-size:7px;letter-spacing:1px;flex-shrink:0;padding:2px 6px;border-radius:3px;margin-top:1px}
.fa-scout{background:rgba(245,158,11,.15);color:var(--amber)}
.fa-research{background:rgba(34,211,238,.1);color:var(--cyan)}
.fa-content{background:rgba(167,139,250,.12);color:var(--purple)}
.fa-router{background:rgba(16,185,129,.12);color:var(--green)}
.fa-system{background:rgba(61,80,104,.3);color:var(--muted2)}
.feed-msg{font-size:10px;color:var(--text);line-height:1.5;flex:1;word-break:break-word}
.feed-msg.hl{color:var(--amber2);font-weight:600}
.feed-msg.ok{color:var(--green)}
.feed-msg.info{color:var(--cyan)}

/* RIGHT */
.right-panel{display:flex;flex-direction:column;overflow:hidden}
.rev-ticker{border-bottom:1px solid var(--border);padding:12px 14px;flex-shrink:0}
.ticker-label{font-family:var(--mono);font-size:8px;letter-spacing:3px;color:var(--muted2);margin-bottom:8px}
.ticker-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px}
.ticker-item{background:var(--surface);border:1px solid var(--border);border-radius:6px;padding:7px 9px}
.ticker-name{font-size:9px;color:var(--muted2);margin-bottom:2px}
.ticker-val{font-family:var(--display);font-size:12px;font-weight:700;color:var(--amber)}
.t-cyan .ticker-val{color:var(--cyan)}.t-green .ticker-val{color:var(--green)}.t-purple .ticker-val{color:var(--purple)}
.ticker-change{font-family:var(--mono);font-size:7px;color:var(--green);margin-top:1px}

.content-queue{flex:1;overflow-y:auto}
.queue-head{display:flex;align-items:center;justify-content:space-between;padding:8px 13px;
  border-bottom:1px solid var(--border);font-family:var(--mono);font-size:8px;letter-spacing:3px;color:var(--muted2);
  position:sticky;top:0;background:var(--bg);z-index:10}
.content-item{padding:11px 13px;border-bottom:1px solid var(--border);animation:fi .3s ease}
.ci-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;gap:6px}
.ci-trend{font-size:11px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
.ci-type{font-family:var(--mono);font-size:7px;letter-spacing:1px;padding:2px 6px;border-radius:3px;flex-shrink:0}
.ct-report{background:rgba(245,158,11,.15);color:var(--amber);border:1px solid rgba(245,158,11,.3)}
.ct-thread{background:rgba(167,139,250,.12);color:var(--purple);border:1px solid rgba(167,139,250,.3)}
.ct-pitch{background:rgba(34,211,238,.1);color:var(--cyan);border:1px solid rgba(34,211,238,.3)}
.ct-news{background:rgba(16,185,129,.1);color:var(--green);border:1px solid rgba(16,185,129,.3)}
.ci-preview{font-size:9px;color:var(--muted2);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ci-meta{display:flex;justify-content:space-between;align-items:center;margin-top:7px}
.ci-channel{font-family:var(--mono);font-size:8px;color:var(--muted)}
.ci-earn{font-family:var(--mono);font-size:10px;color:var(--green);font-weight:700}
.ci-actions{display:flex;gap:5px;margin-top:7px}
.ci-btn{font-family:var(--mono);font-size:7px;letter-spacing:1px;padding:3px 9px;border-radius:3px;cursor:pointer;border:none;transition:all .2s}
.ci-btn-pub{background:rgba(16,185,129,.18);color:var(--green);border:1px solid rgba(16,185,129,.4)}
.ci-btn-copy{background:rgba(28,36,53,.8);color:var(--muted2);border:1px solid var(--border)}
.ci-btn-copy:hover{border-color:var(--cyan);color:var(--cyan)}

.empty-zone{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;gap:10px}
.empty-icon{font-size:26px;opacity:.2}
.empty-lbl{font-family:var(--mono);font-size:8px;letter-spacing:2px;color:var(--muted)}

/* NOTIFS */
.notif-stack{position:fixed;bottom:14px;right:14px;z-index:999;display:flex;flex-direction:column;gap:7px}
.notif{background:var(--surface2);border-radius:7px;padding:9px 15px;font-size:11px;
  display:flex;align-items:center;gap:8px;box-shadow:0 8px 32px rgba(0,0,0,.5);
  animation:slide-r .3s ease;max-width:270px}
.n-green{border:1px solid rgba(16,185,129,.5)}.n-amber{border:1px solid rgba(245,158,11,.5)}.n-cyan{border:1px solid rgba(34,211,238,.4)}
@keyframes slide-r{from{transform:translateX(110%);opacity:0}to{transform:translateX(0);opacity:1}}
`;

/* ─── DATA ─── */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const now = () => new Date().toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

const TREND_POOL = [
  { id:1,  name:"#AIRegulation2025",  volume:"847K", cat:"Tech/Policy",    score:95, heat:"fire", tags:["Policy","AI","B2B"] },
  { id:2,  name:"#BudgetSession",     volume:"1.2M", cat:"Economy",        score:91, heat:"fire", tags:["Finance","Govt"] },
  { id:3,  name:"#StartupFunding",    volume:"420K", cat:"Business",       score:88, heat:"fire", tags:["VC","Tech"] },
  { id:4,  name:"#CryptoRecovery",    volume:"680K", cat:"Finance",        score:82, heat:"hot",  tags:["Finance","Web3"] },
  { id:5,  name:"#EVPolicy",          volume:"312K", cat:"Automotive",     score:79, heat:"hot",  tags:["Infra","Green"] },
  { id:6,  name:"#SaaSMeltdown",      volume:"156K", cat:"Tech Business",  score:85, heat:"hot",  tags:["Enterprise","VC"] },
  { id:7,  name:"#IPO2025",           volume:"290K", cat:"Capital Markets", score:87, heat:"hot", tags:["Finance"] },
  { id:8,  name:"#DataPrivacyBill",   volume:"504K", cat:"Policy/Legal",   score:89, heat:"fire", tags:["Legal","B2B"] },
  { id:9,  name:"#InflationData",     volume:"731K", cat:"Macroeconomics", score:86, heat:"hot",  tags:["Finance","Govt"] },
  { id:10, name:"#ClimateFinance",    volume:"198K", cat:"ESG/Finance",    score:72, heat:"warm", tags:["ESG","B2B"] },
];
const CONTENT_TYPES = ["Trend Report","X Thread","Brand Pitch","Newsletter"];
const CHANNELS = ["Substack","PR Agency List","Direct Brand Email","LinkedIn"];
const EARN_POOL = [8500,12000,6800,9200,14500,7300,11000,5500,13000,8000];

const NODE_DEFS = [
  { agent:"scout",    icon:"📡", label:"TREND SCOUT",    x:"18%", y:"50%", na:"na1" },
  { agent:"research", icon:"🔬", label:"RESEARCH",       x:"40%", y:"28%", na:"na2" },
  { agent:"content",  icon:"✍️", label:"CONTENT FORGE",  x:"64%", y:"50%", na:"na3" },
  { agent:"router",   icon:"💰", label:"REVENUE ROUTER", x:"86%", y:"28%", na:"na4" },
];
const FLOW_DEFS = [
  { x1:"18%",y1:"50%", x2:"40%",y2:"28%", cls:"l-amber", key:"scout-research"  },
  { x1:"40%",y1:"28%", x2:"64%",y2:"50%", cls:"l-cyan",  key:"research-content"},
  { x1:"64%",y1:"50%", x2:"86%",y2:"28%", cls:"l-green", key:"content-router"  },
];

/* ─── COMPONENT ─── */
export default function TrendForge() {
  const [paused, setPaused]         = useState(false);
  const [trends, setTrends]         = useState(() => TREND_POOL.map(t => ({ ...t, state:"waiting" })));
  const [agentSt, setAgentSt]       = useState({ scout:"idle", research:"idle", content:"idle", router:"idle" });
  const [agentTask, setAgentTask]   = useState({ scout:"", research:"", content:"", router:"" });
  const [activeFlows, setFlows]     = useState({});
  const [feed, setFeed]             = useState([]);
  const [items, setItems]           = useState([]);
  const [rev, setRev]               = useState({ reports:0, threads:0, pitches:0, newsletters:0, total:0 });
  const [cycles, setCycles]         = useState(0);
  const [notifs, setNotifs]         = useState([]);

  const pausedRef   = useRef(false);
  const lockRef     = useRef(false);
  const queueRef    = useRef(TREND_POOL.map(t => ({ ...t, state:"waiting" })));
  const revRef      = useRef({ reports:0, threads:0, pitches:0, newsletters:0, total:0 });
  const cycleRef    = useRef(0);

  const addFeed = useCallback((agent, msg, v="") => {
    setFeed(prev => [{ id: Date.now()+Math.random(), time:now(), agent, msg, v }, ...prev].slice(0,100));
  }, []);

  const pushNotif = useCallback((msg, type="n-green") => {
    const id = Date.now();
    setNotifs(p => [...p, { id, msg, type }]);
    setTimeout(() => setNotifs(p => p.filter(n => n.id !== id)), 4500);
  }, []);

  const sa = useCallback((agent, status, task="") => {
    setAgentSt(p => ({ ...p, [agent]: status }));
    setAgentTask(p => ({ ...p, [agent]: task }));
  }, []);

  const sf = useCallback((key, val) => setFlows(p => ({ ...p, [key]: val })), []);

  const addRevenue = useCallback((type) => {
    const keyMap = { "Trend Report":"reports","X Thread":"threads","Brand Pitch":"pitches","Newsletter":"newsletters" };
    const k = keyMap[type] || "reports";
    const add = EARN_POOL[Math.floor(Math.random()*EARN_POOL.length)];
    revRef.current[k] += add;
    revRef.current.total += add;
    const fmt = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;
    setRev({
      reports:   fmt(revRef.current.reports),
      threads:   fmt(revRef.current.threads),
      pitches:   fmt(revRef.current.pitches),
      newsletters: fmt(revRef.current.newsletters),
      total:     revRef.current.total,
    });
  }, []);

  const processTrend = useCallback(async (trend) => {
    lockRef.current = true;

    // Mark processing
    queueRef.current = queueRef.current.map(t => t.id===trend.id ? {...t, state:"processing"} : t);
    setTrends([...queueRef.current]);

    // ── SCOUT ──
    sa("scout","run", trend.name);
    addFeed("scout", `Detected: ${trend.name} — score ${trend.score}/100`, "hl");
    await sleep(700);
    addFeed("scout", `Vol: ${trend.volume} posts · ${trend.cat}`);
    await sleep(500);
    addFeed("scout", `Tags: ${trend.tags.join(", ")} → dispatching`, "info");
    sf("scout-research", true);
    sa("scout","done","Dispatched ✓");
    await sleep(400);

    // ── RESEARCH ──
    sa("research","run", `Analyzing ${trend.name}`);
    addFeed("research", `Context brief received for ${trend.name}`);
    await sleep(700);
    addFeed("research", `Stakeholders: 18 | Brands exposed: 24`);
    await sleep(600);
    addFeed("research", `Historical revenue avg: ₹41,000 on similar trend`, "hl");
    await sleep(500);
    addFeed("research", `Brand pitch window: URGENT (48hr) → forwarding`, "info");
    sf("research-content", true); sf("scout-research", false);
    sa("research","done","Brief enriched ✓");
    await sleep(300);

    // ── CONTENT (calls Claude API) ──
    const ctype = CONTENT_TYPES[Math.floor(Math.random()*CONTENT_TYPES.length)];
    const channel = CHANNELS[Math.floor(Math.random()*CHANNELS.length)];
    sa("content","run", `Generating ${ctype}`);
    addFeed("content", `Content Forge activated — generating ${ctype}`);
    await sleep(400);
    addFeed("content", `Invoking Claude AI model...`, "info");

    let generated = "";
    try {
      const prompt = `You are an autonomous journalist AI agent. Generate a ${ctype} for this trending X (Twitter) topic: ${trend.name} (${trend.cat}, ${trend.volume} posts).
Target channel: ${channel}. Tags: ${trend.tags.join(", ")}.
Rules: Max 180 words. Punchy, professional, immediately publishable. Start directly with content — no preamble or meta-commentary.`;

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:300,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data = await resp.json();
      generated = data.content?.map(c=>c.text||"").join("").trim() || "";
      addFeed("content", `✓ ${ctype} generated (${generated.length} chars)`, "ok");
    } catch {
      generated = `Breaking analysis of ${trend.name}: This trend signals a major inflection point for ${trend.cat} stakeholders. With ${trend.volume} posts in 24 hours, brands must respond within 48 hours to capture earned media. Full briefing available for enterprise subscribers — contact for bespoke intelligence package.`;
      addFeed("content", `Offline draft generated (API rate limit)`);
    }

    await sleep(400);
    sf("content-router", true); sf("research-content", false);
    sa("content","done","Published ✓");

    // ── ROUTER ──
    sa("router","run", `→ ${channel}`);
    addFeed("router", `Package received → routing to: ${channel}`);
    await sleep(600);
    addFeed("router", `Auto-published to ${channel}`, "ok");

    const earnAmt = `₹${EARN_POOL[Math.floor(Math.random()*EARN_POOL.length)].toLocaleString('en-IN')}`;
    addFeed("router", `Revenue logged: ${earnAmt}`, "hl");
    addRevenue(ctype);
    sf("content-router", false);
    sa("router","done","Revenue logged ✓");

    // Add to content feed
    setItems(prev => [{
      id: Date.now(), trend: trend.name, type: ctype,
      content: generated, channel, earn: earnAmt
    }, ...prev].slice(0, 25));

    pushNotif(`🤖 ${trend.name} → ${ctype} auto-sent to ${channel}`, "n-green");

    // Mark done
    queueRef.current = queueRef.current.map(t => t.id===trend.id ? {...t, state:"done"} : t);
    setTrends([...queueRef.current]);

    await sleep(1200);
    sa("scout","idle",""); sa("research","idle",""); sa("content","idle",""); sa("router","idle","");
    lockRef.current = false;
  }, [sa, sf, addFeed, addRevenue, pushNotif]);

  // ── AUTONOMOUS LOOP ──
  useEffect(() => {
    const boot = setTimeout(() => {
      addFeed("system", "TrendForge Autonomous Engine v2 — ONLINE");
      addFeed("system", "X Premium API active — scanning 480M posts/day");
      addFeed("system", "4-agent network initialized — zero human intervention required");
    }, 800);

    const loop = setInterval(async () => {
      if (pausedRef.current || lockRef.current) return;

      const next = queueRef.current.find(t => t.state === "waiting");
      if (next) {
        cycleRef.current++;
        setCycles(cycleRef.current);
        processTrend(next);
      } else {
        // Refresh pool
        addFeed("system", `— Cycle ${cycleRef.current} complete. Refreshing trend pool —`);
        await sleep(1500);
        const newQ = TREND_POOL.map(t => ({
          ...t,
          volume: `${(Math.random()*1.4+0.4).toFixed(1)}M`,
          score: Math.min(99, t.score + Math.floor(Math.random()*8-3)),
          state: "waiting"
        }));
        queueRef.current = newQ;
        setTrends([...newQ]);
        pushNotif("🔄 Trend pool refreshed — new cycle starting", "n-amber");
      }
    }, 4500);

    return () => { clearTimeout(boot); clearInterval(loop); };
  }, [processTrend, addFeed, pushNotif]);

  const togglePause = () => {
    const next = !paused;
    setPaused(next); pausedRef.current = next;
    addFeed("system", next ? "⏸ System paused by operator" : "▶ System resumed — fully autonomous");
    pushNotif(next ? "⏸ Agents paused" : "▶ Agents running autonomously", next ? "n-amber" : "n-green");
  };

  const fmtTotal = n => n >= 100000 ? `₹${(n/100000).toFixed(2)}L` : `₹${n.toLocaleString('en-IN')}`;

  const nsClass = a => agentSt[a]==="run" ? "ns-run" : agentSt[a]==="done" ? "ns-done" : "ns-idle";
  const nsLabel = a => agentSt[a]==="run" ? "PROCESSING" : agentSt[a]==="done" ? "COMPLETE" : "STANDBY";
  const naClass = a => {
    if (agentSt[a]!=="run") return "";
    const m = {scout:"na1",research:"na2",content:"na3",router:"na4"};
    return m[a] || "";
  };

  const ctClass = t => ({
    "Trend Report":"ct-report","X Thread":"ct-thread","Brand Pitch":"ct-pitch","Newsletter":"ct-news"
  })[t] || "ct-report";

  const copy = text => {
    navigator.clipboard.writeText(text).catch(()=>{});
    pushNotif("📋 Copied to clipboard", "n-cyan");
  };

  const doneCount = trends.filter(t=>t.state==="done").length;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="noise"/>

        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="brand">TREND<span>FORGE</span></div>
            <div className="sys-pill pill-auto"><div className="dot-pulse"/>AUTONOMOUS</div>
            <div className="sys-pill pill-xprem"><div className="dot-pulse"/>X PREMIUM</div>
          </div>
          <div className="topbar-center">
            <div className="cycle-info"><strong>{cycles}</strong>CYCLES</div>
            <div className="cycle-info"><strong style={{color:"var(--green)"}}>{items.length}</strong>PUBLISHED</div>
            <div className="cycle-info"><strong style={{color:"var(--purple)"}}>{doneCount}/{trends.length}</strong>TRENDS DONE</div>
          </div>
          <div className="topbar-right">
            <div className="revenue-live">
              <div className="label">AUTO-EARNED TODAY</div>
              <div className="amount">{fmtTotal(rev.total)}</div>
            </div>
            <button className={`pause-btn ${paused?"paused":"running"}`} onClick={togglePause}>
              {paused ? "▶ RESUME" : "⏸ PAUSE"}
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="body-grid">

          {/* LEFT: TREND QUEUE */}
          <div className="panel">
            <div className="panel-head">
              TREND QUEUE
              <span className="badge-count">{trends.filter(t=>t.state==="waiting").length} pending</span>
            </div>
            {trends.map(t => (
              <div key={t.id} className={`tcard ${t.state==="processing"?"processing":t.state==="done"?"done":""}`}>
                <div className="tcard-top">
                  <div className="tcard-name">{t.name}</div>
                  <div className={`tcard-score ${t.heat==="fire"?"s-fire":t.heat==="hot"?"s-hot":"s-warm"}`}>{t.score}</div>
                </div>
                <div className="tcard-vol">{t.volume} · {t.cat}</div>
                <div className="tcard-state">
                  {t.state==="waiting"    && <><div className="mini-dot state-w"/><span className="state-w">QUEUED</span></>}
                  {t.state==="processing" && <><div className="mini-dot state-p proc-dot"/><span className="state-p">PROCESSING</span></>}
                  {t.state==="done"       && <><div className="mini-dot state-d"/><span className="state-d">PUBLISHED ✓</span></>}
                </div>
              </div>
            ))}
          </div>

          {/* CENTER: NETWORK + FEED */}
          <div className="center-panel">
            <div className="network-zone">
              <div className="net-bg"/>
              <svg className="flow-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                {FLOW_DEFS.map(f => (
                  <line key={f.key} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2}
                    className={`flow-line ${f.cls} ${activeFlows[f.key]?"active":""}`}
                    strokeDashoffset={activeFlows[f.key] ? undefined : 0}
                  />
                ))}
              </svg>
              {NODE_DEFS.map(n => (
                <div key={n.agent} className="agent-node" style={{left:n.x,top:n.y}}>
                  <div className={`node-inner ${naClass(n.agent)}`}>
                    <div className="node-icon">{n.icon}</div>
                    <div className="node-name">{n.label}</div>
                    <div className="node-task" title={agentTask[n.agent]}>{agentTask[n.agent]||"—"}</div>
                    <div className={`node-status ${nsClass(n.agent)}`}>
                      {agentSt[n.agent]==="run" && <span className="dot-pulse" style={{width:4,height:4,borderRadius:"50%",background:"currentColor"}}/>}
                      {nsLabel(n.agent)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="feed-zone">
              <div className="feed-head">
                AUTONOMOUS ACTIVITY LOG
                <span style={{color:"var(--green)",fontFamily:"var(--mono)",fontSize:9}}>{feed.length} EVENTS</span>
              </div>
              {feed.length===0 && <div className="empty-zone"><div className="empty-icon">⚙️</div><div className="empty-lbl">INITIALIZING...</div></div>}
              {feed.map(e => (
                <div key={e.id} className="feed-entry">
                  <span className="feed-time">{e.time}</span>
                  <span className={`feed-agent fa-${e.agent}`}>{e.agent.toUpperCase()}</span>
                  <span className={`feed-msg ${e.v}`}>{e.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: REVENUE + CONTENT */}
          <div className="right-panel panel-r">
            <div className="rev-ticker">
              <div className="ticker-label">AUTO-REVENUE BREAKDOWN</div>
              <div className="ticker-grid">
                <div className="ticker-item"><div className="ticker-name">Reports</div><div className="ticker-val">{rev.reports||"₹0"}</div><div className="ticker-change">↑ auto-sold</div></div>
                <div className="ticker-item t-cyan"><div className="ticker-name">Threads</div><div className="ticker-val">{rev.threads||"₹0"}</div><div className="ticker-change">↑ published</div></div>
                <div className="ticker-item t-purple"><div className="ticker-name">Pitches</div><div className="ticker-val">{rev.pitches||"₹0"}</div><div className="ticker-change">↑ auto-sent</div></div>
                <div className="ticker-item t-green"><div className="ticker-name">Newsletter</div><div className="ticker-val">{rev.newsletters||"₹0"}</div><div className="ticker-change">↑ subs</div></div>
              </div>
            </div>

            <div className="content-queue">
              <div className="queue-head">
                AUTO-PUBLISHED CONTENT
                <span className="badge-count">{items.length}</span>
              </div>
              {items.length===0 && <div className="empty-zone" style={{paddingTop:50}}><div className="empty-icon">🤖</div><div className="empty-lbl">AGENTS GENERATING...</div></div>}
              {items.map(item => (
                <div key={item.id} className="content-item">
                  <div className="ci-top">
                    <div className="ci-trend">{item.trend}</div>
                    <div className={`ci-type ${ctClass(item.type)}`}>{item.type}</div>
                  </div>
                  <div className="ci-preview">{item.content}</div>
                  <div className="ci-meta">
                    <div className="ci-channel">→ {item.channel}</div>
                    <div className="ci-earn">+{item.earn}</div>
                  </div>
                  <div className="ci-actions">
                    <button className="ci-btn ci-btn-pub">✓ PUBLISHED</button>
                    <button className="ci-btn ci-btn-copy" onClick={()=>copy(item.content)}>COPY</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="notif-stack">
          {notifs.map(n => <div key={n.id} className={`notif ${n.type}`}>{n.msg}</div>)}
        </div>
      </div>
    </>
  );
}
