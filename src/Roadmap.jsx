import { useState, useEffect, useCallback, useRef } from "react";
import { Scale, Briefcase, Coffee, ChevronRight, AlertTriangle, Clock, Target, Link2, Sun, Moon, Plane, ArrowUpRight, MapPin, Check } from "lucide-react";

const GOALS = {
  pdh: { id:"pdh", label:"Pareja de Hecho", short:"Legal", color:"var(--gold)", bg:"var(--gold-bg)", Icon:Scale },
  work: { id:"work", label:"Employment", short:"Work", color:"var(--steel)", bg:"var(--steel-bg)", Icon:Briefcase },
  setup: { id:"setup", label:"Daily Life", short:"Setup", color:"var(--sage)", bg:"var(--sage-bg)", Icon:Coffee },
};

const PHASES = [
  { id:"now", date:"Now — Apr '26", label:"Start here", num:"01", dominant:"work",
    context:"You have roughly a year before arrival. This window is the most valuable thing you have.",
    steps:[
      { goal:"work", title:"Start studying for CompTIA A+", detail:"This certification — combined with Network+ — is your employment passport in Spain. IT support roles don't require fluent Spanish, many are remote, and the certs are internationally recognised. Professor Messer on YouTube is free and excellent.", cost:"$530 for both exams" },
      { goal:"setup", title:"Open a Wise account", detail:"wise.com — gives you a European IBAN (BE...) immediately. Handles USD ↔ EUR. No issues for US citizens. Your financial bridge until you have a traditional Spanish account.", cost:"Free" },
      { goal:"setup", title:"Start learning Spanish", detail:"You don't need fluency — aim for survival-level. Language Transfer (free, genuinely effective) for foundations. Duolingo for daily habit.", cost:"Free" },
      { goal:"work", title:"Save toward $2,000–3,000", detail:"Your arrival runway. Zaragoza is affordable and you won't be paying rent, so it stretches — but having it means you can be patient with job hunting." },
    ],
  },
  { id:"summer2026", date:"Jun — Sep '26", label:"Build credentials", num:"02", dominant:"work",
    context:"The certifications are the most impactful thing this summer.",
    steps:[
      { goal:"work", title:"Pass CompTIA A+ (both parts)", detail:"Once you pass, immediately start Network+ prep — material overlaps and momentum matters.", cost:"$530", urgent:true },
      { goal:"work", title:"Scout the Spanish IT job market", detail:"Browse InfoJobs, LinkedIn Spain, Tecnoempleo. Search 'IT support Zaragoza', 'helpdesk Madrid remote'. Not hunting yet — orientation.", cost:"Free" },
      { goal:"setup", title:"Sort out loose ends at home", detail:"Check passport expiry (must be valid well past your arrival). Decide bring vs ship vs let go. Cancel subscriptions.", cost:"$130–165 if passport renewal" },
    ],
  },
  { id:"late2026", date:"Oct — Dec '26", label:"Finish certifications", num:"03", dominant:"work",
    context:"Finish Network+. A+ and Network+ together are the priority.",
    steps:[
      { goal:"work", title:"Pass CompTIA Network+", detail:"This opens real doors. Network tech, IT support, remote helpdesk — all accessible with these two certs.", cost:"$390", urgent:true },
      { goal:"work", title:"Update CV, start remote applications", detail:"Lead with certs. Apply to remote English-language IT roles now — some companies will hire you to start remotely.", cost:"Free" },
      { goal:"pdh", title:"Book your one-way flight", detail:"Via Madrid or Barcelona. Spring 2027 target. Book early — prices rise.", cost:"$400–800" },
    ],
  },
  { id:"jan2027", date:"Jan '27", label:"Documents begin", num:"04", dominant:"pdh",
    context:"~4 months out. US documents take time to obtain and prepare. Start now.",
    steps:[
      { goal:"pdh", title:"Order Kansas birth certificate × 2", detail:"Original certified copies via VitalChek or call 877-305-8315. Two copies — one backup. Will be apostilled and translated.", cost:"$30–50", urgent:true, chain:true },
      { goal:"pdh", title:"Request Verification of No Marriage Letter", detail:"Call Kansas Office of Vital Statistics (785-296-1400) and request a Verification of No Marriage Letter. This serves as your single status certificate.", cost:"Free", urgent:true, chain:true },
    ],
  },
  { id:"feb2027", date:"Feb '27", label:"Apostilles & insurance", num:"05", dominant:"pdh",
    context:"~3 months out. Apostilling makes your US docs legally valid in Spain. Timing matters: ~3 month validity.",
    steps:[
      { goal:"pdh", title:"Apostille birth certificate", detail:"Kansas Secretary of State, 915 SW Harrison St, Topeka KS 66612. Include Form DC, $10 fee, prepaid FedEx return. 3–10 days.", cost:"$40–60", urgent:true, chain:true, warning:"Do this in February, not earlier. Documents must be used within ~3 months of apostille date." },
      { goal:"pdh", title:"Apostille Single Status document", detail:"Same office, same process. Submit both in one package.", cost:"$40–60", urgent:true, chain:true },
      { goal:"pdh", title:"Find a sworn translator", detail:"Traductor jurado — licensed by Spain's Ministry of Foreign Affairs. Find at exteriores.gob.es. Many work remotely.", cost:"~€50–80/doc", chain:true },
      { goal:"setup", title:"Choose health insurance plan", detail:"No public access until employed. Compare Sanitas, Adeslas, Asisa. Must be a policy 'sin copagos' (no copays) with full coverage to qualify for residency later. Have a plan selected before landing.", cost:"~€50–100/mo" },
    ],
  },
  { id:"mar2027", date:"Mar '27", label:"Translations & appointments", num:"06", dominant:"pdh",
    context:"~2 months out. Translations and the NIE appointment — harder to get than it sounds.",
    steps:[
      { goal:"pdh", title:"Send apostilled docs to translator", detail:"Send both to traductor jurado for sworn translations. 3–7 day turnaround. Keep originals safe.", cost:"€100–160", urgent:true, chain:true },
      { goal:"pdh", title:"Your partner: get civil status certificate", detail:"Registro Civil de Zaragoza, Calle Alfonso I nº 17. In person. Proves they're single.", cost:"Free", urgent:true },
      { goal:"pdh", title:"Book NIE appointment — immediately", detail:"sede.administracionespublicas.gob.es → Zaragoza. Book for 1–2 weeks after arrival. Check daily.", cost:"Free / €50–100 gestoría", urgent:true, warning:"NIE appointments fill up fast. Known bottleneck. Start day one of March." },
    ],
  },
  { id:"apr2027", date:"Apr '27", label:"Final preparation", num:"07", dominant:"pdh",
    context:"~1 month out. Verify everything, book the notary, assemble the folder.",
    steps:[
      { goal:"pdh", title:"Check every document for name consistency", detail:"Name must be identical across birth cert, apostille, translation, passport. Even a middle name difference → rejection.", urgent:true, chain:true, warning:"Name inconsistency is the #1 rejection reason at the Aragón registry." },
      { goal:"pdh", title:"Book notary appointment", detail:"Escritura pública for pareja estable. Any Notaría in Zaragoza. Book for ~2–3 weeks after arrival.", cost:"€80–150", urgent:true },
      { goal:"pdh", title:"Your partner: call Aragón registry", detail:"Call 976 716 205. Confirm what they accept as proof of single status for a US citizen.", cost:"Free", urgent:true },
      { goal:"pdh", title:"Assemble master document folder", detail:"One physical folder with all apostilled docs, translations, passports, proof of address, registration form.", chain:true },
      { goal:"setup", title:"Get a Spanish SIM card ready", detail:"Needed within hours of arriving. Lebara or Lycamobile prepaid. Your partner can have it waiting.", cost:"€10–20" },
    ],
  },
  { id:"arrival", date:"Spring '27", label:"You arrive", num:"08", milestone:true, dominant:"pdh",
    context:"The first week matters. A few things need to happen fast because other steps depend on them.",
    steps:[
      { goal:"pdh", title:"Get empadronado — days 1–3", detail:"Ayuntamiento de Zaragoza. Passport + partner's DNI + proof of address. Same-day. Get 3+ copies.", cost:"Free", urgent:true },
      { goal:"setup", title:"Activate SIM + health insurance — day 1", detail:"Both on day one. No safe gap for health coverage.", cost:"€60–120", urgent:true },
      { goal:"setup", title:"Open a European digital bank account", detail:"Services like Revolut or N26 give you a European IBAN (LT or DE) immediately. A traditional Spanish bank (ES IBAN) comes later.", cost:"Free", urgent:true },
      { goal:"pdh", title:"Attend NIE appointment — week 1–2", detail:"Passport, EX-15 form, empadronamiento, photo, Tasa 790 receipt. The NIE is a number — card comes later.", cost:"€10.50", urgent:true },
      { goal:"work", title:"Begin serious job hunting — week 2+", detail:"LinkedIn to Zaragoza. Remote-first + English IT. Lead with certs. Register at SEPE.", cost:"Free" },
    ],
  },
  { id:"post1", date:"Arrival + 1 mo", label:"Legal process begins", num:"09", dominant:"pdh",
    context:"Pareja de Hecho paperwork enters its final stage. Notary first, then registry.",
    steps:[
      { goal:"pdh", title:"Sign escritura pública at notary", detail:"Both attend with passports + empadronamiento. Notary prepares deed. Copy on the day.", cost:"€80–150", urgent:true },
      { goal:"pdh", title:"Book Aragón registry appointment", detail:"Call 976 716 205 / 976 715 973 immediately after notary. 2–4 week wait.", cost:"Free", urgent:true },
      { goal:"setup", title:"Open traditional Spanish bank account", detail:"Santander recommended for US citizens. W-9 + SSN — normal. Becomes payroll account.", cost:"Free with payroll" },
    ],
  },
  { id:"post2", date:"Arrival + 2 mo", label:"Registration day", num:"10", milestone:true, dominant:"pdh",
    context:"The moment the whole roadmap builds toward.",
    steps:[
      { goal:"pdh", title:"Attend Pareja de Hecho registration", detail:"Plaza del Pilar nº 3, Zaragoza. Mon–Fri, 9–14:00. Both attend. Bring the complete folder.", cost:"Free", urgent:true },
    ],
  },
  { id:"post3", date:"Arrival + 3–5 mo", label:"Residency & settling", num:"11", dominant:"setup",
    context:"Legal foundation established. Residency card is the final step.",
    steps:[
      { goal:"pdh", title:"Apply for Tarjeta de Residencia", detail:"Extranjería with pareja de hecho cert. 1–3 month processing. Receipt = legal proof. Use a gestoría.", cost:"€10.50 + €150–300 gestoría", urgent:true },
      { goal:"work", title:"Register for Seguridad Social number", detail:"Tesorería General. Free. With this + residency card, you're fully equipped to work.", cost:"Free" },
      { goal:"work", title:"Target bridging jobs if needed", detail:"Need income while hunting for IT roles? Skip Spanish supermarkets (they require fluent Spanish to pass interviews). Instead, leverage being a native speaker: apply to local English academies in Zaragoza or post ads for private conversation classes (€15–20/hr).", cost:"Free" },
      { goal:"setup", title:"US taxes — every April, forever", detail:"File annually. Foreign Earned Income Exclusion = likely owe nothing. FBAR if >$10K foreign accounts.", cost:"$150–300 first year" },
    ],
  },
];

const totalSteps = PHASES.reduce((a,p)=>a+p.steps.length,0);
const pdhSteps = PHASES.reduce((a,p)=>a+p.steps.filter(s=>s.goal==="pdh").length,0);
function getCosts(){
  let uMin=0,uMax=0,eMin=0,eMax=0;
  PHASES.forEach(p=>p.steps.forEach(s=>{
    if(!s.cost||s.cost==="Free"||s.cost==="Free with payroll")return;
    const isE=s.cost.includes("€"),isU=s.cost.includes("$");
    const nums=(s.cost.match(/[\d,]+/g)||[]).map(n=>parseInt(n.replace(",",""))).filter(n=>!isNaN(n));
    if(!nums.length)return;const lo=Math.min(...nums),hi=Math.max(...nums);
    if(isE){eMin+=lo;eMax+=hi}if(isU){uMin+=lo;uMax+=hi}
  }));
  return{usd:`$${Math.round(uMin/50)*50}–${Math.round(uMax/50)*50}`,eur:`€${Math.round(eMin/50)*50}–${Math.round(eMax/50)*50}`};
}

const GOAL_COLORS_RAW = { pdh:"#C4956A", work:"#4E8CAF", setup:"#5E9E58" };

export default function Roadmap(){
  const[phase,setPhase]=useState("now");
  const[dark,setDark]=useState(false);
  const[expanded,setExpanded]=useState(null);
  const[activeFilter,setActiveFilter]=useState(null);

  const [checked, setChecked] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spain-roadmap-checked");
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("spain-roadmap-checked", JSON.stringify(checked));
  }, [checked]);

  const toggleCheck = useCallback((e, id) => {
    e.stopPropagation();
    setChecked(prev => ({...prev, [id]: !prev[id]}));
  }, []);

  useEffect(() => {
    setExpanded(null);
    setTimeout(() => {
      const activeBtn = document.querySelector('.ph-btn.on');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }, [phase]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setPhase(curr => {
          const i = PHASES.findIndex(p => p.id === curr);
          return i < PHASES.length - 1 ? PHASES[i + 1].id : curr;
        });
      } else if (e.key === "ArrowLeft") {
        setPhase(curr => {
          const i = PHASES.findIndex(p => p.id === curr);
          return i > 0 ? PHASES[i - 1].id : curr;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cur=PHASES.find(p=>p.id===phase)||PHASES[0];
  const costs=getCosts();
  const idx=PHASES.findIndex(p=>p.id===phase);
  
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalSteps > 0 ? ((checkedCount / totalSteps) * 100).toFixed(0) : 0;
  
  const domColor = GOAL_COLORS_RAW[cur.dominant]||GOAL_COLORS_RAW.pdh;

  const mobNavRef = useRef(null);
  const [navAtEnd, setNavAtEnd] = useState(false);
  useEffect(() => {
    const el = mobNavRef.current;
    if (!el) return;
    const check = () => setNavAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    check();
    el.addEventListener('scroll', check, {passive: true});
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  return(
    <div className={dark?"root dark":"root"} style={{background:dark?"#0E0D0B":"#EFEBE4",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.cdnfonts.com/css/clash-display');
        .root{
          --gold:#C4956A;--steel:#4E8CAF;--sage:#5E9E58;
          --gold-bg:rgba(196,149,106,0.1);--steel-bg:rgba(78,140,175,0.08);--sage-bg:rgba(94,158,88,0.08);
          --gold-border:rgba(196,149,106,0.25);--steel-border:rgba(78,140,175,0.2);--sage-border:rgba(94,158,88,0.2);
          --bg:#EFEBE4;--surface:#F7F5F0;--card:#FFFFFF;
          --text:#1A1612;--sub:#5A5248;--muted:#8A8078;--dim:#C2BAB0;
          --border:rgba(0,0,0,0.07);--border-l:rgba(0,0,0,0.04);
          --accent:#8B5E20;--hl:rgba(184,147,106,0.13);
          --warn-bg:rgba(195,55,40,0.06);--warn-b:rgba(195,55,40,0.22);--warn-t:#B83A2A;
          --free-bg:rgba(40,130,60,0.08);--free-t:#1E7535;
          --marker:rgba(253, 224, 71, 0.65);
          --shadow:0 2px 8px rgba(0,0,0,0.04);
          --grain:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
        }
        .root.dark{
          --gold:#D4A87A;--steel:#6AACCE;--sage:#7ABE74;
          --gold-bg:rgba(212,168,122,0.1);--steel-bg:rgba(106,172,206,0.08);--sage-bg:rgba(122,190,116,0.07);
          --gold-border:rgba(212,168,122,0.2);--steel-border:rgba(106,172,206,0.15);--sage-border:rgba(122,190,116,0.15);
          --bg:#0E0D0B;--surface:#161513;--card:#1C1A17;
          --text:#E8E0D4;--sub:#B5ADA3;--muted:#7A7268;--dim:#3A3530;
          --border:rgba(255,255,255,0.06);--border-l:rgba(255,255,255,0.03);
          --accent:#D4A87A;--hl:rgba(212,168,122,0.1);
          --warn-bg:rgba(220,80,60,0.08);--warn-b:rgba(220,80,60,0.22);--warn-t:#F0A090;
          --free-bg:rgba(122,190,116,0.08);--free-t:#7ABE74;
          --marker:rgba(253, 224, 71, 0.35);
          --shadow:0 2px 8px rgba(0,0,0,0.3);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        .root{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Open Sans', Helvetica, Arial, sans-serif;transition:background .3s,color .3s;position:relative}
        .root::before{content:'';position:fixed;inset:0;background-image:var(--grain);background-repeat:repeat;background-size:256px;pointer-events:none;z-index:999;opacity:.5}
        @keyframes si{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        @keyframes stamp{from{opacity:0;transform:scale(.6) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(-4deg)}}
        .layout{display:grid;grid-template-columns:250px 1fr;min-height:calc(100vh - 48px)}
        @media(max-width:1024px){.layout{grid-template-columns:1fr}.sidebar{display:none !important}.mob-nav-wrap{display:block !important;position:sticky !important;top:48px;background:var(--bg);z-index:9;border-bottom:1px solid var(--border)}.mob-b{font-size:11px;padding:7px 13px;border-radius:16px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}}
        .sidebar{border-right:1px solid var(--border);position:sticky;top:48px;height:calc(100vh - 48px);overflow-y:auto;display:flex;flex-direction:column}
        .sidebar::-webkit-scrollbar{width:0}
        .ph-btn{display:flex;align-items:flex-start;gap:12px;padding:9px 20px;cursor:pointer;border:none;background:none;text-align:left;width:100%;color:var(--text);transition:all .12s;position:relative;font-family:'Open Sans', Helvetica, Arial, sans-serif}
        .ph-btn:hover{background:var(--hl)}
        .ph-btn.on{background:var(--hl)}
        .spine{position:absolute;left:33px;top:0;bottom:0;width:1px;background:var(--border)}
        .mob-nav-wrap{display:none;position:relative}
        .mob-nav{display:flex;gap:8px;padding:10px 14px;overflow-x:auto;-webkit-overflow-scrolling:touch}
        .mob-nav::-webkit-scrollbar{display:none}
        .mob-nav-fade{position:absolute;right:0;top:0;bottom:0;width:64px;background:linear-gradient(to right, transparent, var(--bg));display:flex;align-items:center;justify-content:flex-end;padding-right:12px;pointer-events:none;transition:opacity .25s}
        .mob-nav-arrow{pointer-events:auto;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;padding:0;transition:background .15s}
        .mob-nav-arrow:hover{background:var(--hl)}
        .mob-b{white-space:nowrap;padding:5px 11px;border-radius:14px;border:1px solid var(--border);background:none;color:var(--muted);font-size:10.5px;font-family:'Open Sans', Helvetica, Arial, sans-serif;cursor:pointer;font-weight:500}
        .mob-b.on{background:var(--accent);color:var(--bg);border-color:var(--accent)}
        .hero-card{border-radius:16px;padding:28px 32px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;border:none}
        .hero-card:hover{transform:translateY(-1px)}
        .step-row{display:flex;align-items:flex-start;gap:14px;padding:12px 14px;border-radius:10px;cursor:pointer;transition:all .25s cubic-bezier(0.2, 0.8, 0.2, 1);border:none}
        .step-row:hover{background:var(--surface);transform:translateX(4px)}
        .step-row.open{background:var(--card);box-shadow:var(--shadow);transform:translateX(4px) scale(1.01)}
        .pill{display:inline-flex;align-items:center;gap:3px;font-size:9.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
        .stamp{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border:2.5px solid;border-radius:3px;transform:rotate(-4deg);font-weight:700;font-size:10px;letter-spacing:.12em;text-transform:uppercase;animation:stamp .4s cubic-bezier(.34,1.56,.64,1)}
        .goal-legend{display:flex;gap:4px}
        .goal-chip{display:flex;align-items:center;gap:4px;font-size:9px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:4px 10px;border-radius:20px;border:none;cursor:pointer;transition:all .2s;opacity:0.6;position:relative;overflow:hidden}
        .goal-chip:hover{opacity:1;transform:translateY(-1px)}
        .goal-chip.active{opacity:1;transform:scale(1.02);box-shadow:0 4px 12px rgba(0,0,0,0.05)}
        .goal-chip.inactive{opacity:0.3;filter:grayscale(1)}
        .hero-card.checked { opacity: 0.75; }
        .hero-card.checked:hover { opacity: 1; }
        .step-row.checked { opacity: 0.6; }
        .step-row.checked:hover, .step-row.checked.open { opacity: 1; }
        @media print {
          .sidebar, .print-hide, .root::before { display: none !important; }
          .layout { display: block !important; }
          .root { background: white !important; color: black !important; min-height: auto !important; }
          .hero-detail, .step-detail { display: block !important; }
          .hero-summary { display: none !important; }
          .hero-card, .step-row { break-inside: avoid; page-break-inside: avoid; }
          .hero-card { margin-bottom: 20px !important; box-shadow: none !important; border: 2px solid var(--border) !important; }
          .step-row { margin-bottom: 10px !important; border: 1px solid var(--border) !important; }
        }
        .topbar{height:48px;display:flex;justify-content:space-between;align-items:center;padding:0 24px;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:10}
        .topbar-right{display:flex;align-items:center;gap:14px}
        .topbar-sep{width:1px;height:14px;background:var(--border);flex-shrink:0}
        .topbar-cost{font-size:10px;font-weight:500;color:var(--muted);white-space:nowrap}
        .main-pane{background:var(--card);flex:1;min-width:0;overflow-x:hidden}
        .main-content{padding:44px 52px 80px;overflow:hidden}
        .footer{border-top:1px solid var(--border);padding:24px 52px;text-align:center}
        @media(max-width:1024px){
          .topbar{padding:0 16px}
          .topbar-right{gap:10px}
          .main-content{padding:28px 28px 60px}
          .footer{padding:20px 28px}
        }
        @media(max-width:540px){
          .topbar-cost{display:none}
          .topbar-sep{display:none}
        }
        @media(max-width:480px){
          .topbar{padding:0 14px}
          .main-content{padding:18px 16px 48px}
          .footer{padding:18px 16px}
          .hero-card{padding:20px 18px !important;border-radius:12px !important}
          .step-row{padding:10px 10px;gap:10px}
          .mob-b{font-size:10.5px;padding:6px 11px}
        }
      `}</style>

      {/* TOP BAR */}
      <div className="print-hide topbar" style={{background:dark?"#0E0D0B":"#EFEBE4"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Plane size={14} strokeWidth={2} style={{color:"var(--accent)"}}/>
          <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:16,fontWeight:600,color:"var(--text)",letterSpacing:"-0.02em"}}>Your move to Spain</span>
        </div>
        <div className="topbar-right">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,fontWeight:600,color:"var(--muted)",width:24,textAlign:"right"}}>{progress}%</span>
            <div style={{position:"relative",width:72,height:4,borderRadius:3,background:"var(--border)"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,borderRadius:3,background:`linear-gradient(90deg, var(--gold), var(--steel))`,width:`${progress}%`,transition:"width .6s cubic-bezier(0.34, 1.56, 0.64, 1)"}}/>
              <div style={{position:"absolute",left:`${progress}%`,top:"50%",transition:"left .6s cubic-bezier(0.34, 1.56, 0.64, 1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
                <Plane size={11} strokeWidth={2.5} style={{color:"var(--steel)",fill:"var(--bg)",transform:"translate(-50%, -50%) rotate(45deg)",marginTop:-1}}/>
              </div>
            </div>
          </div>
          <div className="topbar-sep"/>
          <span className="topbar-cost">{costs.usd} + {costs.eur}</span>
          <button onClick={()=>setDark(!dark)} style={{background:"none",border:"1px solid var(--border)",borderRadius:6,padding:"3px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:10,fontWeight:500,color:"var(--muted)",fontFamily:"'Open Sans', Helvetica, Arial, sans-serif"}}>
            {dark?<Sun size={10} strokeWidth={2}/>:<Moon size={10} strokeWidth={2}/>}
          </button>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="mob-nav-wrap print-hide">
        <div className="mob-nav" ref={mobNavRef}>
          {PHASES.map(p=><button key={p.id} className={`mob-b ${phase===p.id?"on":""}`} onClick={()=>setPhase(p.id)}>{p.num} &bull; {p.label}</button>)}
        </div>
        <div className="mob-nav-fade" style={{opacity: navAtEnd ? 0 : 1, pointerEvents: navAtEnd ? 'none' : 'auto'}}>
          <button className="mob-nav-arrow" onClick={() => mobNavRef.current?.scrollBy({left: 180, behavior: 'smooth'})}>
            <ChevronRight size={14} strokeWidth={2.5} style={{color:"var(--sub)"}}/>
          </button>
        </div>
      </div>

      <div className="layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div style={{padding:"20px 20px 14px"}}>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:19,fontWeight:500,color:"var(--text)",marginBottom:4}}>The journey</div>
            <p style={{fontSize:10,color:"var(--muted)"}}>{pdhSteps} of {totalSteps} steps for legal status</p>
          </div>
          <div style={{flex:1,position:"relative",paddingTop:2}}>
            <div className="spine"/>
            {PHASES.map((p, i)=>{
              const dc = GOAL_COLORS_RAW[p.dominant]||GOAL_COLORS_RAW.pdh;
              const isOn = phase===p.id;
              const phaseChecked = p.steps.length > 0 && p.steps.every((_, stepIdx) => checked[`${p.id}-${stepIdx}`]);
              
              const isPart1 = i === 0;
              const isPart2 = i === 7;
              
              return(
                <span key={p.id} style={{display:"block", width:"100%"}}>
                  {isPart1 && <div style={{fontSize:10, fontWeight:700, color:"var(--dim)", textTransform:"uppercase", letterSpacing:".1em", margin:"14px 20px 10px", display:"flex", alignItems:"center", gap:6}}><Target size={11} strokeWidth={2.5}/> Part 1: The US Prep</div>}
                  {isPart2 && <div style={{fontSize:10, fontWeight:700, color:"var(--dim)", textTransform:"uppercase", letterSpacing:".1em", margin:"32px 20px 10px", display:"flex", alignItems:"center", gap:6}}><Plane size={11} strokeWidth={2.5}/> Part 2: In Spain</div>}
                  <button className={`ph-btn ${isOn?"on":""}`} onClick={()=>setPhase(p.id)}
                    style={isOn?{borderRight:`3px solid ${dc}`}:{}}>
                  <div style={{
                    width:10,height:10,borderRadius:"50%",flexShrink:0,marginTop:3,zIndex:1,
                    border:`2px solid ${isOn||phaseChecked?dc:"var(--dim)"}`,
                    background:isOn||phaseChecked?dc:"var(--bg)",
                    boxShadow:isOn?`0 0 0 3px ${dc}22`:"none",
                    transition:"all .2s",
                    display:"flex",alignItems:"center",justifyContent:"center"
                  }}>
                    {phaseChecked && !isOn && <Check size={6} color="#fff" strokeWidth={4}/>}
                    {phaseChecked && isOn && <Check size={6} color="var(--bg)" strokeWidth={4}/>}
                  </div>
                  <div>
                    <div style={{fontSize:9.5,fontWeight:600,color:isOn?dc:"var(--dim)",letterSpacing:".05em",textTransform:"uppercase",marginBottom:1}}>{p.date}</div>
                    <div style={{fontSize:12,fontWeight:isOn?600:400,color:isOn?"var(--text)":"var(--muted)",lineHeight:1.3}}>{p.label}</div>
                    {p.milestone&&isOn&&(
                      <div className="stamp" style={{fontSize:7,padding:"2px 7px",marginTop:4,borderColor:dc,color:dc}}>
                        <MapPin size={8} strokeWidth={3}/> Milestone
                      </div>
                    )}
                  </div>
                </button>
              </span>
              );
            })}
          </div>
          <div style={{padding:"20px",borderTop:"1px solid var(--border)"}}>
            <div style={{fontSize:9.5, fontWeight:700, color:"var(--dim)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12}}>Category Progress & Filters</div>
            <div className="goal-legend" style={{display:"flex", flexDirection:"column", gap:8}}>
              {Object.values(GOALS).map(g=>{
                const total = PHASES.reduce((a,p) => a + p.steps.filter(s=>s.goal === g.id).length, 0);
                const completed = PHASES.reduce((a,p) => a + p.steps.filter((s,i)=>s.goal === g.id && checked[`${p.id}-${i}`]).length, 0);
                const pct = total ? Math.round((completed/total)*100) : 0;

                const isActive = activeFilter === g.id;
                const isInactive = activeFilter && !isActive;
                return (
                  <button key={g.id} className={`goal-chip ${isActive?"active":isInactive?"inactive":""}`} style={{color:g.color,background:"var(--surface)", width:"100%", padding:"10px 12px", borderRadius:12, border:`1px solid ${isActive ? g.color : "var(--border)"}`}}
                    onClick={()=>setActiveFilter(isActive ? null : g.id)}>
                    <div style={{position:"absolute", left:0, top:0, bottom:0, width:`${pct}%`, background:g.color, opacity:0.1, transition:"width 0.5s ease"}} />
                    <div style={{display:"flex", alignItems:"center", gap:10, flex:1, position:"relative", zIndex:2}}>
                      <div style={{width:26, height:26, borderRadius:"50%", background:g.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                        <g.Icon size={13} strokeWidth={2.5}/>
                      </div>
                      <div style={{textAlign:"left", flex:1}}>
                        <div style={{fontSize:10.5, fontWeight:700, letterSpacing:".02em", color:isActive?g.color:"var(--text)"}}>{g.label}</div>
                        <div style={{fontSize:9, fontWeight:500, color:"var(--muted)", textTransform:"none"}}>{completed} of {total} done</div>
                      </div>
                      <div style={{fontSize:11, fontWeight:700, color:g.color}}>{pct}%</div>
                    </div>
                  </button>
                )
              })}
            </div>
            {activeFilter && (
              <div style={{fontSize:9, fontWeight:600, color:"var(--dim)", marginTop:12, textAlign:"center", letterSpacing:".05em", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:4}}>
                <div style={{width:6, height:6, borderRadius:"50%", background:GOALS[activeFilter].color, animation:"fi 1s infinite alternate"}}/>
                Filtering by {GOALS[activeFilter].label}
              </div>
            )}
          </div>
        </div>

        {/* MAIN PANE */}
        <div className="main-pane">
          <div className="main-content" key={phase}>
            <div style={{maxWidth:720,animation:"si .5s cubic-bezier(0.34, 1.56, 0.64, 1)"}}>

            {/* PHASE HEADER */}
            <div style={{marginBottom:36}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:16,marginBottom:14}}>
                <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(64px,8vw,88px)",fontWeight:400,lineHeight:.82,color:domColor,opacity:.2}}>{cur.num}</span>
                <div style={{paddingBottom:4,flex:1}}>
                  <div style={{fontSize:11,fontWeight:600,color:domColor,letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>{cur.date}</div>
                  <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(32px,4.5vw,48px)",fontWeight:600,letterSpacing:"-0.03em",lineHeight:1}}>
                    {cur.label}
                  </h1>
                </div>
                {cur.milestone&&<div className="stamp" style={{marginBottom:8,borderColor:domColor,color:domColor}}><MapPin size={11} strokeWidth={2.5}/>Milestone</div>}
              </div>
              <p style={{fontSize:15,color:"var(--sub)",lineHeight:1.65,fontWeight:400,maxWidth:500}}>{cur.context}</p>
            </div>

            {/* FILTERING LOGIC */}
            {(()=>{
              const stepsWithIndex = cur.steps.map((s, i) => ({ ...s, originalIndex: i }));
              const visibleSteps = activeFilter ? stepsWithIndex.filter(s => s.goal === activeFilter) : stepsWithIndex;

              if (visibleSteps.length === 0) {
                return (
                  <div style={{padding:"40px 20px", textAlign:"center", border:"1.5px dashed var(--border)", borderRadius:16, marginTop:10}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:0.2}}><Target size={32}/></div>
                    <div style={{fontSize:14, color:"var(--sub)", fontWeight:500, marginBottom:8}}>No {GOALS[activeFilter].short} steps in this phase.</div>
                    <button onClick={()=>setActiveFilter(null)} style={{background:"none", border:"none", color:"var(--accent)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Open Sans', Helvetica, Arial, sans-serif"}}>Clear filter</button>
                  </div>
                );
              }

              return (
                <>
                  {/* HERO STEP — colored card */}
                  {(()=>{
                    const s0 = visibleSteps[0];
                    const s0Idx = s0.originalIndex;
                    const G0 = GOALS[s0.goal];
                    const free = s0.cost==="Free";
                    return(
                        <div className={`hero-card ${checked[`${cur.id}-${s0Idx}`]?"checked":""}`} onClick={()=>setExpanded(expanded===s0Idx?null:s0Idx)}
                        style={{background:G0.bg,border:"none",marginBottom:32,boxShadow:`0 4px 20px ${G0.color}10`}}>
                        {/* colored top stripe */}
                        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${G0.color}, ${G0.color}44)`,borderRadius:"16px 16px 0 0"}}/>
                        {/* large background icon watermark */}
                        <G0.Icon size={180} strokeWidth={0.7} style={{position:"absolute",bottom:-30,right:-30,color:G0.color,opacity:0.1,transform:"rotate(-15deg)",pointerEvents:"none"}}/>
                        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:36,color:G0.color,lineHeight:1}}>{s0Idx+1}</span>
                            <div style={{width:1,height:28,background:`${G0.color}33`}}/>
                            <button onClick={(e) => toggleCheck(e, `${cur.id}-${s0Idx}`)} style={{width:24,height:24,borderRadius:"50%",border:checked[`${cur.id}-${s0Idx}`]?"none":`2px solid ${G0.color}44`,background:checked[`${cur.id}-${s0Idx}`]?G0.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s",padding:0,marginRight:4}}>
                              {checked[`${cur.id}-${s0Idx}`] && <Check size={14} color="#fff" strokeWidth={3}/>}
                            </button>
                            <span className="pill" style={{color:G0.color,fontSize:10}}><G0.Icon size={11} strokeWidth={2.5}/>{G0.label}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            {s0.urgent&&<span style={{fontSize:9,fontWeight:700,color:"var(--warn-t)",background:"var(--warn-bg)",padding:"2px 7px",borderRadius:3,display:"flex",alignItems:"center",gap:3,letterSpacing:".05em",textTransform:"uppercase"}}><Clock size={8} strokeWidth={3}/>Urgent</span>}
                            {s0.cost&&<span style={{fontSize:11,fontWeight:600,color:free?"var(--free-t)":G0.color,background:free?"var(--free-bg)":`${G0.color}15`,padding:"3px 10px",borderRadius:5}}>{s0.cost}</span>}
                          </div>
                        </div>
                        <h2 style={{position:"relative",fontFamily:"'Clash Display',sans-serif",fontSize:24,fontWeight:600,lineHeight:1.15,marginBottom:12,letterSpacing:"-0.02em",color:checked[`${cur.id}-${s0Idx}`]?"var(--sub)":"inherit",textDecoration:checked[`${cur.id}-${s0Idx}`]?"line-through":"none",transition:"all .2s"}}>{s0.title}</h2>
                        <div className="hero-detail" style={{display: expanded===s0Idx ? "block" : "none", position:"relative",animation:"fi .2s ease"}}>
                          {s0.warning&&(
                            <div style={{padding:"8px 12px",marginBottom:10,borderRadius:6,background:"var(--warn-bg)",borderLeft:"3px solid var(--warn-b)",display:"flex",alignItems:"flex-start",gap:6}}>
                              <AlertTriangle size={12} strokeWidth={2.5} style={{color:"var(--warn-t)",flexShrink:0,marginTop:1}}/>
                              <span style={{fontSize:12,color:"var(--warn-t)",lineHeight:1.55}}>{s0.warning}</span>
                            </div>
                          )}
                          <p style={{fontSize:14,color:"var(--sub)",lineHeight:1.7}}>{s0.detail}</p>
                        </div>
                        <div className="hero-summary" style={{display: expanded===s0Idx ? "none" : "flex", position:"relative",alignItems:"center",gap:5,color:G0.color,fontSize:11,fontWeight:600}}>
                          Tap to read more <ArrowUpRight size={11} strokeWidth={2.5}/>
                        </div>
                        {s0.chain&&<div style={{position:"relative",display:"flex",alignItems:"center",gap:4,marginTop:10,fontSize:9.5,color:"var(--gold)",fontWeight:500}}><Link2 size={9} strokeWidth={2.5}/>Part of the document chain</div>}
                      </div>
                    );
                  })()}

                  {/* REMAINING STEPS — colored left border per goal */}
                  {visibleSteps.length>1&&(
                    <div>
                      <div style={{fontSize:10,fontWeight:600,color:"var(--dim)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:8,paddingLeft:4}}>
                        {visibleSteps.length-1} more step{visibleSteps.length>2?"s":""}
                      </div>
                      {visibleSteps.slice(1).map((step, mappedIdx)=>{
                        const si=step.originalIndex;
                        const isOpen=expanded===si;
                        const free=step.cost==="Free"||step.cost==="Free with payroll";
                        const G=GOALS[step.goal];
                        return(
                          <div key={si} className={`step-row ${isOpen?"open":""} ${checked[`${cur.id}-${si}`]?"checked":""}`} onClick={()=>setExpanded(isOpen?null:si)}
                            style={{animation:`si .4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards`,animationDelay:`${mappedIdx*40}ms`}}>
                            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:20,color:isOpen?G.color:"var(--dim)",width:22,textAlign:"right",flexShrink:0,lineHeight:1.2,transition:"color .15s"}}>{si+1}</span>
                            <button onClick={(e) => toggleCheck(e, `${cur.id}-${si}`)} style={{flexShrink:0,marginTop:1,width:20,height:20,borderRadius:"50%",border:checked[`${cur.id}-${si}`]?"none":`2px solid var(--border)`,background:checked[`${cur.id}-${si}`]?G.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s",padding:0}}>
                              {checked[`${cur.id}-${si}`] && <Check size={12} color="#fff" strokeWidth={3}/>}
                            </button>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                                <div>
                                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:3}}>
                                    <span style={{fontSize:13.5,fontWeight:500,color:checked[`${cur.id}-${si}`]?"var(--muted)":"var(--text)",textDecoration:checked[`${cur.id}-${si}`]?"line-through":"none",lineHeight:1.3,transition:"all .2s"}}>{step.title}</span>
                                    {step.urgent&&<span style={{fontSize:8,fontWeight:700,color:"var(--warn-t)",background:"var(--warn-bg)",padding:"1px 5px",borderRadius:2,display:"flex",alignItems:"center",gap:2,letterSpacing:".05em",textTransform:"uppercase"}}><Clock size={7} strokeWidth={3}/>Urgent</span>}
                                  </div>
                                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                                    <span className="pill" style={{color:G.color}}><G.Icon size={9} strokeWidth={2.5}/>{G.short}</span>
                                    {step.cost&&<span style={{fontSize:9.5,fontWeight:600,color:free?"var(--free-t)":G.color,background:free?"var(--free-bg)":`${G.color}12`,padding:"1px 7px",borderRadius:3}}>{step.cost}</span>}
                                    {step.chain&&<span className="pill" style={{color:"var(--gold)",fontSize:8.5}}><Link2 size={8} strokeWidth={2.5}/>Chain</span>}
                                  </div>
                                </div>
                                <ChevronRight size={13} strokeWidth={2} style={{color:"var(--dim)",flexShrink:0,transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",marginTop:4}}/>
                              </div>
                              <div className="step-detail" style={{display: isOpen ? "block" : "none", marginTop:10,paddingTop:10,borderTop:"1px solid var(--border-l)",animation:"fi .2s ease"}}>
                                {step.warning&&(
                                  <div style={{padding:"8px 12px",marginBottom:10,borderRadius:6,background:"var(--warn-bg)",borderLeft:"3px solid var(--warn-b)",display:"flex",alignItems:"flex-start",gap:6}}>
                                    <AlertTriangle size={12} strokeWidth={2.5} style={{color:"var(--warn-t)",flexShrink:0,marginTop:1}}/>
                                    <span style={{fontSize:12,color:"var(--warn-t)",lineHeight:1.55}}>{step.warning}</span>
                                  </div>
                                )}
                                <p style={{fontSize:13,color:"var(--sub)",lineHeight:1.7}}>{step.detail}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            })()}

            {/* NAV */}
            <div className="print-hide" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:40,paddingTop:20,borderTop:"1px solid var(--border)"}}>
              {idx>0?(
                <button onClick={()=>setPhase(PHASES[idx-1].id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"var(--muted)",fontSize:12,fontWeight:500,fontFamily:"'Open Sans', Helvetica, Arial, sans-serif"}}>
                  <ChevronRight size={12} strokeWidth={2} style={{transform:"rotate(180deg)"}}/> {PHASES[idx-1].label}
                </button>
              ):<div/>}
              {idx<PHASES.length-1&&(
                <button onClick={()=>setPhase(PHASES[idx+1].id)} style={{background:GOAL_COLORS_RAW[PHASES[idx+1].dominant]||"var(--accent)",border:"none",borderRadius:8,padding:"9px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,color:"#fff",fontSize:12,fontWeight:600,fontFamily:"'Open Sans', Helvetica, Arial, sans-serif",transition:"opacity .12s",boxShadow:`0 2px 8px ${GOAL_COLORS_RAW[PHASES[idx+1].dominant]||"var(--accent)"}33`}}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  Next: {PHASES[idx+1].label} <ChevronRight size={12} strokeWidth={2}/>
                </button>
              )}
            </div>

          </div>
        </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p style={{fontFamily:"'Clash Display',sans-serif",fontSize:16,color:"var(--sub)",lineHeight:1.6}}>
          By the end of this you'll be working, legal, banked, and settled. <span style={{color:"var(--accent)"}}>The life you've been building toward finally exists in the same room.</span>
        </p>
      </div>
    </div>
  );
}