import { useState, useEffect, useCallback, useRef, Fragment, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Scale, Briefcase, Coffee, ChevronRight, ChevronDown, AlertTriangle, Clock, Target, Link2, Sun, Moon, Plane, MapPin, Check, BookOpen, FileText, ExternalLink, Phone, Calendar, Award, Send, Download, Globe, DollarSign } from "lucide-react";

const GOALS = {
  pdh: { id:"pdh", label:"Pareja de Hecho", short:"Legal", color:"var(--gold)", theme:"gold", bg:"var(--gold-bg)", Icon:Scale },
  work: { id:"work", label:"Employment", short:"Work", color:"var(--steel)", theme:"steel", bg:"var(--steel-bg)", Icon:Briefcase },
  setup: { id:"setup", label:"Daily Life", short:"Setup", color:"var(--sage)", theme:"sage", bg:"var(--sage-bg)", Icon:Coffee },
};

const PHASES = [
  { id:"now", date:"Now — Apr '26", label:"Start here", num:"01", dominant:"work",
    context:`You have roughly a year before arrival — and that window is not "extra time" you can spend later. Certifications take months to sit and pass. US documents have ordering delays and apostilles have a ~3‑month validity clock once stamped. Spanish compounds day by day. Treat this year as the only runway you get: use it now so you are not scrambling in March with half-finished exams and half-ordered papers.`,
    steps:[
      { goal:"work", title:"Start studying for CompTIA A+", detail:`A+ is two exams: Core 1 (220‑1101) and Core 2 (220‑1102). Budget ~2–3 focused hours per day and about three months per exam if you are starting from zero — faster if you already know hardware/OS basics. Book through Pearson VUE when ready. Free video: Professor Messer (professormesser.com). Paid depth: Mike Meyers or Jason Dion on Udemy. In Spain, A+ plus Network+ signals "hireable IT support" without fluent Spanish — many helpdesk and remote roles list them explicitly. Exam fees run about $530 total for both parts.`, cost:"$530 for both exams" },
      { goal:"setup", title:"Open a Wise account", detail:`Sign up at wise.com with your US passport. You get a European IBAN (Belgian BE…) you can give employers, landlords, and Spanish paperwork before you have a Spanish bank. Fund it from your US bank via ACH or debit; convert USD→EUR at Wise's rate and hold or spend in euros. Limits depend on verification level — complete ID early. Wise is not a full bank: you will not run Spanish utility direct debits from it long term, but it is the cleanest bridge for wires, rent deposits, and day‑one money movement.`, cost:"Free" },
      { goal:"setup", title:"Start learning Spanish", detail:`Aim for about A2 by arrival — enough to read simple forms, follow an office clerk with help, and not freeze in a shop. You do not need C1. Foundations: Language Transfer (free, ~15 hours of audio, genuinely strong on structure). Daily habit: Duolingo for vocabulary and streak discipline. Conversation: HelloTalk or Tandem once you can string sentences. Zaragoza is standard Castilian — clear for learners and useful everywhere in Spain.`, cost:"Free" },
      { goal:"work", title:"Save toward $2,000–3,000", detail:`This is your job-hunt and bureaucracy cushion in euros after you land. Zaragoza is cheaper than Madrid or Barcelona; without rent your burn rate is mostly food, transport, phone, insurance co-pays, and occasional gestoría fees. $2–3k is roughly a 3–6 month runway if you are frugal — enough to say no to bad jobs and to absorb "we need one more document" delays without panic. Keep part of it in Wise/EUR so you are not waiting on US transfers during week one.`, },
    ],
  },
  { id:"summer2026", date:"Jun — Sep '26", label:"Build credentials", num:"02", dominant:"work",
    context:`Summer is your certification sprint. Stopping after A+ to "take a break" costs you the overlap with Network+ (OSI model, TCP/IP, troubleshooting) while it is still fresh. The goal this season is momentum: pass A+, roll straight into Network+ prep, and keep your study habit hot through September.`,
    steps:[
      { goal:"work", title:"Pass CompTIA A+ (both parts)", detail:`The day you pass Core 2: screenshot your Pearson transcript, download your digital badge from CompTIA, and update LinkedIn the same day. That night, start Network+ — even one Jason Dion section — so you do not lose the networking muscle memory from Core 1. Order Network+ study materials before you celebrate; the overlap is real and your retention window is weeks, not months.`, cost:"$530", urgent:true },
      { goal:"work", title:"Scout the Spanish IT job market", detail:`You are not applying yet — you are building a mental map. On InfoJobs, Tecnoempleo, and LinkedIn (Spain), search: soporte IT, helpdesk inglés, IT support remoto, técnico de sistemas, incidencias. Note which certs appear in ads (A+, Network+, ITIL). Typical Zaragoza on-site IT support: roughly €18k–28k gross; remote English-first roles often €25k–40k depending on employer. Notice who hires English without native Spanish: multinationals, MSPs, and BPOs (e.g. Atento, Teleperformance class employers). Save 10–15 job posts as templates for how you will word your CV in phase 03.`, cost:"Free" },
      { goal:"setup", title:"Sort out loose ends at home", detail:`Passport: must be valid at least six months beyond your planned entry — renew now if it is within a year of expiry. Mail: USPS forwarding or a trusted person for Kansas/state mail. Stuff: decide ship vs sell vs store; label boxes "original documents — do not ship sea" if you move papers separately. Banking: confirm your US bank can send international wires without surprise fees — you will use it with Wise and for emergencies. Cancel US subscriptions you will not use abroad.`, cost:"$130–165 if passport renewal" },
    ],
  },
  { id:"late2026", date:"Oct — Dec '26", label:"Finish certifications", num:"03", dominant:"work",
    context:`A+ alone says "I can fix a PC." A+ plus Network+ says "I can work on a corporate network" — that is the line many Spanish employers draw for first IT hire. Together they are internationally recognised, exam-based proof you are not bluffing. Finish Network+ this window so document season in January is not competing with study guilt.`,
    steps:[
      { goal:"work", title:"Pass CompTIA Network+", detail:`Current exam track: CompTIA Network+ (check comptia.org for the active exam code — e.g. N10‑009 series). It unlocks network tech, junior sysadmin, L2 support, and stronger remote helpdesk roles. Use Jason Dion's course plus practice exams; Professor Messer has free Network+ material as a supplement. Exam is multiple choice and performance-based simulations; book via Pearson VUE. Budget ~$390 for the exam; pass date should land before the holidays so January is 100% documents.`, cost:"$390", urgent:true },
      { goal:"work", title:"Update CV, start remote applications", detail:`Spanish CVs usually skip the US-style summary paragraph; lead with certs and tools (Windows, AD, ticketing) in the first screen. Add a Spanish and an English version of your LinkedIn headline. Optional but strong: a short cover letter in Spanish — even basic Spanish signals respect for the market. Keywords that beat ATS: soporte técnico, helpdesk, incidencias, remoto, CompTIA. Apply to remote English IT roles now; some employers will hire you to start remotely and transfer later.`, cost:"Free" },
      { goal:"pdh", title:"Book your one-way flight", detail:`Target spring 2027; book 3–4 months out for better fares. US–Spain directs often land Madrid (MAD) or Barcelona (BCN); Zaragoza (ZAZ) has limited transatlantic service — Madrid is the usual hub, then train or bus to Zaragoza (~1.5h by high-speed train from Madrid). Compare Iberia, Vueling, Level, and major US carriers. Keep a PDF of the booking in your document folder — some steps ask for proof of travel intent.`, cost:"$400–800" },
    ],
  },
  { id:"jan2027", date:"Jan '27", label:"Documents begin", num:"04", dominant:"pdh",
    context:`You are about four months out. US civil documents are not instant: VitalChek queues, mail time, and corrections all eat weeks. Everything that follows — apostille, sworn translation, registry — hangs off these originals. Starting in January is how you keep slack for mistakes without blowing the March NIE booking.`,
    steps:[
      { goal:"pdh", title:"Order Kansas birth certificate × 2", detail:`Use VitalChek (vitalchek.com) or phone Kansas vital records at 877‑305‑8315. Order certified copies with the state seal — not a notarized photocopy. You need two: one for the apostille chain and one sealed backup if anything is damaged or rejected. Mail: often 7–10 business days; expedited can be 3–5. Open the envelope when they arrive and verify every line matches your passport exactly (full name, including middle).`, cost:"$30–50", urgent:true, chain:true },
      { goal:"pdh", title:"Request Verification of No Marriage Letter", detail:`Kansas Office of Vital Statistics — phone 785‑296‑1400. Ask for a "Verification of No Record of Marriage" (single-status letter) for use in Spain. If you can visit: 1000 SW Jackson St, Topeka — often same day. By mail: usually 5–7 business days. Tell them it is for a foreign partnership registration; they know the format embassies and registries expect. Keep the original pristine — it will be apostilled like the birth certificate.`, cost:"Free", urgent:true, chain:true },
    ],
  },
  { id:"feb2027", date:"Feb '27", label:"Apostilles & insurance", num:"05", dominant:"pdh",
    context:`An apostille is a one-page Hague Convention stamp that says your state's signature on a document is real. Spanish offices will not accept plain US certificates without it. Critical: many registries expect you to present documents within ~3 months of the apostille date — the clock starts when Kansas stamps it, not when you walk into an office in Spain. February is the sweet spot for a spring arrival.`,
    steps:[
      { goal:"pdh", title:"Apostille birth certificate", detail:`Kansas Secretary of State authenticates documents for foreign use. Mailing address often listed as 915 SW Harrison St, Topeka KS 66612; you can also confirm current instructions at sos.ks.gov. Include Form DC, $10 per document, and a prepaid return envelope (FedEx or USPS with tracking). Processing often 3–5 business days; call 785‑296‑4564 before you mail if rules changed. Send by tracked mail — these papers are your legal identity abroad.`, cost:"$40–60", urgent:true, chain:true, warning:"Do this in February, not earlier. Documents must be used within ~3 months of apostille date." },
      { goal:"pdh", title:"Apostille Single Status document", detail:`Same envelope, same office, same fee structure as the birth certificate apostille. Staple a short cover letter listing both documents and your return address. One tracked package saves a week of mail time and reduces the risk the two apostilles end up on different dates. When they return, verify the apostille is attached to the correct original — do not separate them.`, cost:"$40–60", urgent:true, chain:true },
      { goal:"pdh", title:"Find a sworn translator", detail:`You need a traductor jurado listed on Spain's Ministry of Foreign Affairs registry. Official list: exteriores.gob.es → Servicios al ciudadano → Traductores e intérpretes (filter inglés). Email 2–3 for quotes per document and turnaround; ask explicitly that they are active on the current MFA list. Many accept PDF scans for a quote, then need originals by courier (DHL). Get the quote and delivery promise in writing. Typical range ~€50–80 per document, but confirm with each translator.`, cost:"~€50–80/doc", chain:true },
      { goal:"setup", title:"Choose health insurance plan", detail:`Until you are employed in Spain's system, you need private coverage. For later residency (tarjeta), Extranjería expects a policy sin copagos (no copay per visit) with full coverage — plans with high copays get rejected. Compare Sanitas, Adeslas, and Asisa; Sanitas Más Salud Sin Copago (or similar "sin copagos" product) is a common choice. Request a formal certificado de cobertura in Spanish before you travel — you will need it in the residency dossier. Budget roughly €50–100/month depending on age and product.`, cost:"~€50–100/mo" },
    ],
  },
  { id:"mar2027", date:"Mar '27", label:"Translations & appointments", num:"06", dominant:"pdh",
    context:`The NIE (Número de Identidad de Extranjero) is a number, not a lifestyle — but without it you cannot open most Spanish bank accounts, sign many contracts, or complete official steps. It is the first domino after you land. March is when sworn translations should be in hand and when you fight for an appointment before slots vanish.`,
    steps:[
      { goal:"pdh", title:"Send apostilled docs to translator", detail:`Email scans first for quote and timeline; ship originals via DHL with tracking and insurance. The jurado returns each original stapled to their stamped translation on official letterhead — do not pull them apart. Store flat in a rigid folder; never fold an apostille. Turnaround is often 3–7 business days once they receive originals. Keep a scan of every page in cloud backup the day you get them back.`, cost:"€100–160", urgent:true, chain:true },
      { goal:"pdh", title:"Your partner: get civil status certificate", detail:`Registro Civil de Zaragoza, Calle Alfonso I nº 17 — in person, usually 10–15 minutes. They issue a certificado de estado civil / fe de soltería proving your partner is single. Bring DNI and, if asked, empadronamiento. This is their side of the mirror to your US single-status paper — the registry will want both stories to match.`, cost:"Free", urgent:true },
      { goal:"pdh", title:"Book NIE appointment — immediately", detail:`Portal: sede.administracionespublicas.gob.es — choose extranjería / NIE as appropriate for your flow and province (Aragón / Zaragoza). New slots often appear early morning; check daily. Book roughly 1–2 weeks after your planned landing so you have empadronamiento first. If the site is impossible, a gestoría (€50–100) often books faster — worth it if you lose a week refreshing the page. The NIE appointment is a known bottleneck — treat March day one as go-time.`, cost:"Free / €50–100 gestoría", urgent:true, warning:"NIE appointments fill up fast. Known bottleneck. Start day one of March." },
    ],
  },
  { id:"apr2027", date:"Apr '27", label:"Final preparation", num:"07", dominant:"pdh",
    context:`One month out is not for starting new tasks — it is for verification, packing, and removing surprises. Every name must match. Every apostille must be legible. The notary and registry should hear from you now, not the week you land.`,
    steps:[
      { goal:"pdh", title:"Check every document for name consistency", detail:`Line up: US passport → birth certificate → apostille → sworn translation → any US notarized affidavits. Middle names, hyphens, and suffixes must match character for character. If anything differs (maiden vs married, missing middle, typo), get a US notary affidavit explaining the discrepancy before you fly — Aragón's registry is strict and "it is obviously me" is not a document.`, urgent:true, chain:true, warning:"Name inconsistency is the #1 rejection reason at the Aragón registry." },
      { goal:"pdh", title:"Book notary appointment", detail:`Call any Notaría in Zaragoza directly — many do not use online booking for this. Ask for an escritura de pareja estable (Aragón's framework for unmarried stable partners). They will want both passports and will expect you to have empadronamiento and NIE timing roughly aligned — say you are booking for 2–3 weeks post-arrival. Bring your full folder to the preliminary call or email photos if they allow — notaries hate surprises on the day.`, cost:"€80–150", urgent:true },
      { goal:"pdh", title:"Your partner: call Aragón registry", detail:`Call Registro de Parejas de Hecho (e.g. 976 716 205) and ask, in Spanish if possible: "¿Qué documentación exacta necesita un ciudadano estadounidense para inscribir una pareja de hecho en Aragón?" Write down the clerk's name, date, and answer. If they contradict something your gestoría said, believe the registry. This 10-minute call prevents a catastrophic "we do not accept this Kansas letter" moment on registration day.`, cost:"Free", urgent:true },
      { goal:"pdh", title:"Assemble master document folder", detail:`Physical checklist to pack: (1) US passport + photocopy (2) birth certificate original (3) apostilled birth cert (4) sworn translation of birth cert (5) single-status original (6) apostilled single-status (7) sworn translation of single-status (8) partner's DNI + copy (9) partner's civil status cert (10) proof of shared life/address if you have it (11) empadronamiento — you will insert after arrival (12) NIE resguardo — after appointment (13) notary escritura — after signing (14) two recent passport photos. Use sheet protectors; originals never leave the folder except at offices.`, chain:true },
      { goal:"setup", title:"Get a Spanish SIM card ready", detail:`Lebara or Lycamobile prepaid are low-friction for newcomers. Your partner can buy a SIM at Carrefour, FNAC, or a phone shop — counter activation often works without a DNI, while online activation sometimes demands Spanish ID. Ask the shop to activate and test a call before you leave. You need data working within hours of landing for maps, bank SMS, and appointment confirmations. Budget €10–20 for SIM + first top-up.`, cost:"€10–20" },
    ],
  },
  { id:"arrival", date:"Spring '27", label:"You arrive", num:"08", milestone:true, dominant:"pdh",
    context:`The dependency chain is brutal but simple: empadronamiento unlocks NIE paperwork credibility; NIE unlocks Spanish banking and contracts; a Spanish account unlocks payroll and direct debits. Week one is not for sightseeing — it is for closing those three gates. Everything else — notary, registry, residency — sits on top of this foundation.`,
    steps:[
      { goal:"pdh", title:"Get empadronado — days 1–3", detail:`Empadronamiento is registration on the municipal padrón at the Ayuntamiento (Oficina de Empadronamiento). It proves you live at an address in Zaragoza — required for NIE, health card, schools, and more. Bring: passport, partner's DNI, and proof of address (utility bill, rental contract, or a declaración responsable your partner signs). Same-day service is normal. Request at least three certificados de empadronamiento originals — you will burn one at NIE, one at the notary, one at registry. Free.`, cost:"Free", urgent:true },
      { goal:"setup", title:"Activate SIM + health insurance — day 1", detail:`Call your chosen insurer the morning you land — coverage must be live from day one; Spanish insurers generally do not backdate. Have your policy number and payment method ready. Insert the Spanish SIM, send a test message, and install the carrier app (Lebara lets you top up with any card). You want zero hours without data or coverage — both are safety and bureaucracy insurance.`, cost:"€60–120", urgent:true },
      { goal:"setup", title:"Open Revolut EU (after empadronamiento)", detail:`If you already use Revolut US, that account does not "become" European — Revolut US and Revolut EU are separate products under different licences. You cannot open a Lithuanian (LT) IBAN EU account from a US address; you need proof of an EU/EEA address. After empadronamiento (days 1–3), sign up for or upgrade to Revolut in Spain using your certificado de empadronamiento — the LT IBAN usually arrives within 24–48 hours. Until then, keep using Wise (BE IBAN) and your US Revolut for USD↔EUR. N26 often wants stronger EU residency proof than day-one newcomers have — Revolut EU plus Wise is the practical pair. A Spanish ES IBAN at Santander still comes a little later.`, cost:"Free", urgent:true },
      { goal:"pdh", title:"Attend NIE appointment — week 1–2", detail:`Bring: EX‑15 form filled in advance (download from extranjería.gob.es), passport plus photocopy of the photo page, empadronamiento, one passport photo, and modelo 790 código 012 paid (€10.50 — pay online or at a cooperating bank; keep the receipt). At the desk they take fingerprints and papers; you leave with a resguardo that lists your NIE number — that number is what banks and employers need. The physical card (TIE) comes later with residency.`, cost:"€10.50", urgent:true },
      { goal:"work", title:"Begin serious job hunting — week 2+", detail:`Register as a job seeker at SEPE (Servicio Público de Empleo Estatal) in Zaragoza — brings you into the national system and unlocks their board. Set LinkedIn location to Zaragoza and Zaragoza Province. Message recruiters in Spanish and English; lead with CompTIA. Spanish SMEs often respond better to direct InMail than to blind portal applies. Keep a spreadsheet of every application — you will need it for residency proof of activity later.`, cost:"Free" },
    ],
  },
  { id:"post1", date:"Arrival + 1 mo", label:"Legal process begins", num:"09", dominant:"pdh",
    context:`The notary's escritura pública is the private contract that declares your stable partnership before a neutral official — it is not the same as inscription in the registry. The registry is the public record Aragón relies on for legal effects. You need both: notary first (deed), then registry (inscription). Skipping either leaves you without the certificate Extranjería wants for residency.`,
    steps:[
      { goal:"pdh", title:"Sign escritura pública at notary", detail:`Both partners attend with passports, empadronamiento, and your full document folder. The notary reads the deed (names, nationalities, address, declaration of stable partnership), you both sign, and you pay fees + IVA. Duration is often ~45 minutes. You receive stamped copies the same day — scan them before you leave the building. This escritura is what you carry to the registry appointment.`, cost:"€80–150", urgent:true },
      { goal:"pdh", title:"Book Aragón registry appointment", detail:`Call 976 716 205 or 976 715 973 the same day you sign at the notary — waits are often 2–4 weeks. The office is at Plaza del Pilar nº 3. They will tell you exactly which copies they need; bring the folder plus extra empadronamiento certs. After successful inscription you receive (or are mailed) the certificado de inscripción — that certificate is the golden key for the tarjeta de residencia application.`, cost:"Free", urgent:true },
      { goal:"setup", title:"Open traditional Spanish bank account", detail:`Santander is commonly used by US citizens in Spain because they are used to W‑9 / FATCA paperwork — you will fill a US tax form; it is normal, not a red flag. Bring passport, NIE resguardo, and empadronamiento. Ask for a cuenta corriente with a debit card and online banking. This account becomes your payroll and utilities IBAN (ES…) once you are hired.`, cost:"Free with payroll" },
    ],
  },
  { id:"post2", date:"Arrival + 2 mo", label:"Registration day", num:"10", milestone:true, dominant:"pdh",
    context:`This is the emotional peak of the roadmap — the moment the partnership is inscribed in the public record you have been feeding with apostilles and translations for a year. Legally, that certificate is what transforms "we are together" into a document Spanish immigration law recognises for residency. Take breaths; bring every paper; ask for a resguardo if the final certificate is mailed later.`,
    steps:[
      { goal:"pdh", title:"Attend Pareja de Hecho registration", detail:`Plaza del Pilar nº 3, Zaragoza — ground floor civil registry area. Monday–Friday, usually 09:00–14:00; confirm hours when you book. Both partners attend with the complete folder: passports, DNI, empadronamiento, escritura pública, civil status certificates, apostilles, sworn translations, photos. The clerk reviews the file; processing often 15–30 minutes if nothing is missing. If the definitive certificate is mailed, request a stamped resguardo on the spot — many gestorías use that as interim proof for Extranjería.`, cost:"Free", urgent:true },
    ],
  },
  { id:"post3", date:"Arrival + 3–5 mo", label:"Residency & settling", num:"11", dominant:"setup",
    context:`You are no longer "surviving arrival" — you are consolidating: residency card, social security affiliation, income, and the boring forever chore of US taxes. What is left is paperwork volume, not existential risk. A gestoría for Extranjería is money well spent; the NUSS is free and fast; teaching English pays bills while you hunt the IT role you actually want.`,
    steps:[
      { goal:"pdh", title:"Apply for Tarjeta de Residencia", detail:`File at Extranjería / Oficina de Extranjeros in Zaragoza (confirm current address on extranjería.gob.es — commonly cited near Paseo de la Independencia). Typical bundle: EX‑19, passport, NIE proof, empadronamiento, full health insurance certificate (sin copagos), pareja de hecho certificate, and proof of economic means (partner's payslips, bank statements). Government fee is modest; a gestoría often charges €150–300 to prepare the file and chase status — recommended because rejections for missing commas happen. Processing commonly 1–3 months; the stamped receipt you get when filing is legal proof you are in process.`, cost:"€10.50 + €150–300 gestoría", urgent:true },
      { goal:"work", title:"Register for Seguridad Social number", detail:`Go to the Tesorería General de la Seguridad Social (TGSS) office in Zaragoza — C/ Doctor Cerrada is often listed; confirm on seg-social.es before you go. Bring passport, NIE documentation, and empadronamiento. You receive a NUSS / número de afiliación on the spot — free. That number goes on every Spanish employment contract and is required once you have a formal job offer.`, cost:"Free" },
      { goal:"work", title:"Target bridging jobs if needed", detail:`If IT hiring is slow, pivot to English-native work that does not demand C1 Spanish: language academies (EOI pipeline, private academies, kids' schools), conversation tutoring advertised on Wallapop / Milanuncios / Facebook "Zaragoza inglés" groups, and online UK/US time-zone support. Supermarkets and front-line retail often fail you on Spanish interview bars — English teaching pays roughly €15–20/hr and respects your visa story on a CV.`, cost:"Free" },
      { goal:"setup", title:"US taxes — every April, forever", detail:`As a US citizen you file IRS Form 1040 every year. Living in Spain, Form 2555 (Foreign Earned Income Exclusion) often zeros out US tax on earned income up to an annual limit that adjusts with inflation (check IRS Pub 54 for the current figure). If the aggregate of all foreign bank accounts exceeded $10,000 at any point in the year, file FinCEN Form 114 (FBAR) electronically at bsaefiling.fincen.treas.gov — separate from the 1040, due April 15. Year one, consider Greenback Tax, MyExpatTaxes, or similar so you do not guess wrong on FEIE vs foreign tax credit. Budget $150–300 for professional help the first season.`, cost:"$150–300 first year" },
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

const GOAL_COLORS_RAW = { pdh:"var(--gold)", work:"var(--steel)", setup:"var(--sage)" };
const GOAL_THEMES = { pdh:"gold", work:"steel", setup:"sage" };

/** Concrete outcomes you will have after each chapter — shown as scannable chips on the overview. */
const CHAPTER_OUTCOMES = {
  foundation: ["CompTIA A+", "CompTIA Network+", "Flight booked", "~A2 Spanish"],
  bureaucracy: ["Apostilled docs", "Sworn translations", "NIE appointment booked"],
  landing: ["Empadronamiento", "NIE number", "EU bank (Revolut)"],
  legal: ["Pareja de Hecho cert", "Residency card", "NUSS / taxes plan"],
};

/** Phases that show the document dependency mini-diagram (paperwork chain). */
const DOCUMENT_CHAIN_PHASE_IDS = ["jan2027", "feb2027", "mar2027", "apr2027"];

/** Four pipeline stages for US → Spain civil docs; stepIds are `${phaseId}-${stepIndex}`. */
const DOCUMENT_CHAIN_STAGES = [
  { id: "usdocs", label: "US docs", stepIds: ["jan2027-0", "jan2027-1"] },
  { id: "apostille", label: "Apostille", stepIds: ["feb2027-0", "feb2027-1"] },
  { id: "translation", label: "Sworn translation", stepIds: ["feb2027-2", "mar2027-0"] },
  { id: "registry", label: "Registry-ready", stepIds: ["apr2027-0", "apr2027-3"] },
];

/** Which stages are “in focus” while viewing each paperwork phase. */
const CHAIN_FOCUS_BY_PHASE = {
  jan2027: [0],
  feb2027: [1, 2],
  mar2027: [2],
  apr2027: [3],
};

/** Four high-level chapters grouping the 11 phases — used by the calming starter overview. */
const CHAPTERS = [
  { id:"foundation", title:"The Foundation", range:"Now — Dec '26", durationLabel:"~12 months", blurb:"IT certifications, Spanish basics, Wise, savings, and booking your flight — everything before the paperwork storm.", phaseIds:["now","summer2026","late2026"], Icon:BookOpen, theme:"steel" },
  { id:"bureaucracy", title:"The paperwork", range:"Jan — Apr '27", durationLabel:"~4 months", blurb:"US documents, apostilles, sworn translator, insurance, translations, NIE booking, and your master folder.", phaseIds:["jan2027","feb2027","mar2027","apr2027"], Icon:FileText, theme:"gold" },
  { id:"landing", title:"The landing", range:"Spring '27", durationLabel:"~2–4 weeks", blurb:"Empadronamiento, SIM, insurance, Revolut EU, NIE appointment, and ramping up job search.", phaseIds:["arrival"], Icon:Plane, theme:"sage" },
  { id:"legal", title:"Legal status", range:"After you land", durationLabel:"~3–5 months", blurb:"Notary escritura, registry, Spanish bank, pareja de hecho day, residency card, Seguridad Social, and taxes.", phaseIds:["post1","post2","post3"], Icon:Scale, theme:"gold" },
];

/** Key resources mentioned across steps — rendered as prominent cards with CTAs. */
const KEY_RESOURCES = {
  wise: {
    name: "Wise",
    desc: "European IBAN without a Spanish bank",
    url: "https://wise.com",
    cta: "Open account",
    Icon: Globe
  },
  pearsonvue: {
    name: "Pearson VUE",
    desc: "Book CompTIA certification exams",
    url: "https://home.pearsonvue.com/comptia",
    cta: "Book exam",
    Icon: Calendar
  },
  vitalchek: {
    name: "VitalChek",
    desc: "Order US vital records online",
    url: "https://vitalchek.com",
    cta: "Order documents",
    Icon: FileText
  },
  comptia: {
    name: "CompTIA",
    desc: "IT certification provider",
    url: "https://comptia.org",
    cta: "View certifications",
    Icon: Award
  },
  professormesser: {
    name: "Professor Messer",
    desc: "Free CompTIA training videos",
    url: "https://professormesser.com",
    cta: "Watch videos",
    Icon: BookOpen
  }
};

/** Visual flow diagrams for complex multi-step processes. */
const STEP_FLOWS = {
  "feb2027-0": [ // Apostille birth certificate
    { icon: FileText, label: "Fill Form DC" },
    { icon: DollarSign, label: "Pay $10" },
    { icon: Send, label: "Mail" },
    { icon: Clock, label: "Wait 3-5 days" },
    { icon: Check, label: "Receive" }
  ],
  "feb2027-1": [ // Apostille single status
    { icon: FileText, label: "Cover letter" },
    { icon: Send, label: "Same package" },
    { icon: Clock, label: "Wait 3-5 days" },
    { icon: Check, label: "Verify attached" }
  ],
  "mar2027-0": [ // Send docs to translator
    { icon: Send, label: "Ship via DHL" },
    { icon: Clock, label: "Wait 3-7 days" },
    { icon: FileText, label: "Translations return" },
    { icon: Download, label: "Scan + backup" }
  ]
};

/** Sub-steps for multi-part tasks — shown as mini checklists. */
const STEP_SUBSTEPS = {
  "now-0": [ // Start studying for CompTIA A+
    { id: "a-plus-core1", label: "Core 1 (220-1101)" },
    { id: "a-plus-core2", label: "Core 2 (220-1102)" }
  ],
  "summer2026-0": [ // Pass CompTIA A+ (both parts)
    { id: "a-plus-pass-core1", label: "Pass Core 1" },
    { id: "a-plus-pass-core2", label: "Pass Core 2" },
    { id: "a-plus-linkedin", label: "Update LinkedIn" }
  ],
  "jan2027-0": [ // Order Kansas birth certificate × 2
    { id: "birth-cert-order", label: "Order 2 certified copies" },
    { id: "birth-cert-verify", label: "Verify name matches passport" }
  ]
};

/** Glossary of Spanish terms, US documents, and technical concepts referenced throughout. */
const GLOSSARY = {
  spanish: {
    title: "Spanish Terms",
    terms: [
      { term: "Apostille", def: "A Hague Convention stamp that authenticates a document for international use. Required for US documents to be accepted in Spain." },
      { term: "Ayuntamiento", def: "City hall / municipal government office where you register your address." },
      { term: "Certificado de empadronamiento", def: "Certificate proving you are registered at a Spanish address. Required for opening bank accounts, NIE, and many official processes." },
      { term: "DNI (Documento Nacional de Identidad)", def: "Spanish national ID card for citizens. Your partner will use this for most official paperwork." },
      { term: "Empadronamiento", def: "Municipal registration that proves you live at a specific address in Spain. One of the first steps after arrival." },
      { term: "Escritura pública", def: "Public deed signed before a notary. For pareja de hecho, this is the legal contract declaring your partnership." },
      { term: "Extranjería", def: "Immigration office that handles foreign resident permits and legal status." },
      { term: "Fe de soltería", def: "Certificate of single status, proving you are not married. Spanish equivalent of the US 'Verification of No Marriage' letter." },
      { term: "Gestoría", def: "Administrative service that helps with Spanish bureaucracy. They can book appointments, prepare documents, and navigate official processes for a fee (~€50-300)." },
      { term: "NIE (Número de Identidad de Extranjero)", def: "Foreigner identification number. Required to open bank accounts, sign contracts, work legally, and complete most official processes in Spain." },
      { term: "NUSS (Número de Afiliación a la Seguridad Social)", def: "Social Security number required for formal employment in Spain." },
      { term: "Notaría", def: "Notary office where official documents are signed and authenticated." },
      { term: "Padrón", def: "Municipal register of residents. Being 'on the padrón' means you are empadronado." },
      { term: "Pareja de Hecho", def: "Registered domestic partnership (unmarried stable partnership). Legal status in Aragón that allows family reunification for residency." },
      { term: "Registro Civil", def: "Civil registry office that issues official certificates (birth, marriage, single status)." },
      { term: "Resguardo", def: "Receipt or proof document given while waiting for the final official document. For example, NIE resguardo proves your NIE is in process." },
      { term: "SEPE (Servicio Público de Empleo Estatal)", def: "Public employment service. Register here to access their job board and be in the national unemployment system." },
      { term: "Sin copagos", def: "Without copayments. Health insurance with sin copagos means no per-visit fees, required for residency applications." },
      { term: "Tarjeta de Residencia / TIE", def: "Physical residence card proving your legal right to live in Spain. Obtained after pareja de hecho registration." },
      { term: "Traductor jurado", def: "Sworn translator officially registered with Spain's Ministry of Foreign Affairs. Only their translations are accepted for legal documents." },
    ]
  },
  us: {
    title: "US Documents & Processes",
    terms: [
      { term: "Apostille", def: "Authentication stamp issued by your state's Secretary of State that validates a document for international use under the Hague Convention. Kansas: ~$10 per document, 3-5 business days." },
      { term: "FBAR (FinCEN Form 114)", def: "Report of Foreign Bank and Financial Accounts. Required if your foreign accounts exceed $10,000 at any point in the year. Filed separately from your tax return." },
      { term: "FEIE (Foreign Earned Income Exclusion)", def: "IRS Form 2555 that lets you exclude foreign earned income from US taxes up to an annual limit (~$120k+)." },
      { term: "Form EX-15", def: "Spanish immigration form used to apply for your NIE." },
      { term: "Form EX-19", def: "Spanish immigration form used to apply for residency card (tarjeta de residencia)." },
      { term: "Modelo 790 código 012", def: "Spanish government fee payment form (€10.50) required when applying for NIE." },
      { term: "Pearson VUE", def: "Testing center network where CompTIA certification exams are booked and taken." },
      { term: "Single Status Letter", def: "Official document from Kansas Vital Statistics certifying you have no record of marriage. Also called 'Verification of No Marriage' or 'Certificate of No Record.'" },
      { term: "VitalChek", def: "Online service to order certified copies of US vital records (birth certificates, etc.). Phone: 877-305-8315." },
      { term: "W-9", def: "US tax form you will fill out at Spanish banks. Required for FATCA reporting if you are a US citizen banking abroad." },
    ]
  },
  tech: {
    title: "IT Certifications & Work",
    terms: [
      { term: "A+ (CompTIA A+)", def: "Entry-level IT certification covering hardware, OS basics, troubleshooting, and networking fundamentals. Two exams: Core 1 (220-1101) and Core 2 (220-1102). Cost: ~$530 total." },
      { term: "ATS (Applicant Tracking System)", def: "Software that scans resumes for keywords before a human sees them. Use terms like 'soporte técnico', 'helpdesk', 'incidencias', 'remoto', 'CompTIA' in your Spanish CV." },
      { term: "BPO (Business Process Outsourcing)", def: "Companies that handle customer service, tech support, and back-office work for other businesses. Often hire English speakers in Spain (e.g. Atento, Teleperformance)." },
      { term: "Helpdesk / Service Desk", def: "First point of contact for IT support. Typical entry role in Spain for English speakers with A+ and Network+. Spanish: 'soporte técnico' or 'mesa de ayuda'." },
      { term: "ITIL", def: "IT Infrastructure Library. Framework for IT service management sometimes mentioned in Spanish job ads alongside CompTIA certs." },
      { term: "MSP (Managed Service Provider)", def: "Company that manages IT infrastructure for multiple clients. Often hires for remote helpdesk and on-site support roles." },
      { term: "Network+ (CompTIA Network+)", def: "Certification covering networking concepts, protocols, troubleshooting, and security. Unlocks network tech and junior sysadmin roles. One exam: ~$390." },
    ]
  },
  financial: {
    title: "Banking & Money",
    terms: [
      { term: "ACH (Automated Clearing House)", def: "US bank transfer system. Used to fund your Wise account from your US bank." },
      { term: "BE IBAN", def: "Belgian IBAN (starts with BE). Wise provides this as your 'European' account number before you have a Spanish bank." },
      { term: "ES IBAN", def: "Spanish IBAN (starts with ES). Your 'real' Spanish bank account from Santander, etc. Needed for payroll and Spanish direct debits long-term." },
      { term: "FATCA", def: "Foreign Account Tax Compliance Act. US law requiring foreign banks to report US citizens' accounts. Why Spanish banks ask you to fill W-9 forms." },
      { term: "IBAN", def: "International Bank Account Number. Standardized format used across Europe for bank transfers. Starts with country code (BE for Belgium, ES for Spain, LT for Lithuania)." },
      { term: "LT IBAN", def: "Lithuanian IBAN (starts with LT). Revolut EU accounts use this." },
      { term: "N26", def: "German digital bank. Often requires stronger EU residency proof than day-one newcomers have. Wise + Revolut EU is the easier pair." },
      { term: "Revolut EU", def: "European version of Revolut (Lithuanian IBAN). Separate from Revolut US. Need EU address proof to open." },
      { term: "Wise (formerly TransferWise)", def: "Money transfer service that provides a Belgian (BE) IBAN for receiving euros before you have a Spanish bank. Not a full bank — no Spanish direct debits." },
    ]
  }
};

/** Flat list of all glossary terms for quick lookup in text. */
const ALL_GLOSSARY_TERMS = Object.values(GLOSSARY).flatMap(section => 
  section.terms.map(t => ({
    term: t.term,
    def: t.def,
    // Extract main term without parenthetical aliases for matching
    mainTerm: t.term.split(' (')[0].trim()
  }))
);

/** Find glossary term definition by matching text. */
function findGlossaryTerm(text) {
  const lowerText = text.toLowerCase();
  return ALL_GLOSSARY_TERMS.find(t => 
    lowerText === t.term.toLowerCase() || 
    lowerText === t.mainTerm.toLowerCase()
  );
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Split plain text into string segments and glossary markers for inline tooltips. */
function enrichTextWithTooltips(text) {
  if (!text || typeof text !== "string") return text;
  const uniqueMainTerms = [...new Set(ALL_GLOSSARY_TERMS.map((t) => t.mainTerm))]
    .filter((t) => t.length >= 2)
    .sort((a, b) => b.length - a.length);
  if (uniqueMainTerms.length === 0) return text;

  const pattern = uniqueMainTerms.map(escapeRegExp).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const matched = match[0];
    parts.push({
      type: "glossary",
      term: matched,
      key: `${match.index}-${matched}-${matched.length}`,
    });
    lastIndex = match.index + matched.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  const hasGlossary = parts.some((p) => typeof p === "object" && p && p.type === "glossary");
  if (!hasGlossary) return text;
  return parts;
}

function getChapterProgress(chapter, checked){
  let done = 0, total = 0;
  chapter.phaseIds.forEach((pid)=>{
    const p = PHASES.find(x=>x.id===pid);
    if(!p) return;
    p.steps.forEach((_, i)=>{
      total++;
      if(checked[`${p.id}-${i}`]) done++;
    });
  });
  return { done, total, pct: total ? Math.round((done/total)*100) : 0 };
}

function getChapterComposition(chapter){
  let pdh = 0, work = 0, setup = 0;
  chapter.phaseIds.forEach((pid)=>{
    const p = PHASES.find(x=>x.id===pid);
    if(!p) return;
    p.steps.forEach((s)=>{
      if (s.goal === "pdh") pdh++;
      else if (s.goal === "work") work++;
      else setup++;
    });
  });
  const total = pdh + work + setup;
  return { pdh, work, setup, total };
}

function accumulateCostStrings(steps){
  let uMin = 0, uMax = 0, eMin = 0, eMax = 0;
  steps.forEach((s)=>{
    if (!s.cost || s.cost === "Free" || s.cost === "Free with payroll") return;
    const isE = s.cost.includes("€"), isU = s.cost.includes("$");
    const nums = (s.cost.match(/[\d,]+/g) || []).map(n => parseInt(n.replace(",", ""), 10)).filter(n => !isNaN(n));
    if (!nums.length) return;
    const lo = Math.min(...nums), hi = Math.max(...nums);
    if (isE) { eMin += lo; eMax += hi; }
    if (isU) { uMin += lo; uMax += hi; }
  });
  return { uMin, uMax, eMin, eMax };
}

function getChapterCost(chapter){
  const allSteps = [];
  chapter.phaseIds.forEach((pid)=>{
    const p = PHASES.find(x=>x.id===pid);
    if (p) allSteps.push(...p.steps);
  });
  const { uMin, uMax, eMin, eMax } = accumulateCostStrings(allSteps);
  const parts = [];
  if (uMin || uMax) parts.push(`~$${Math.round(uMin / 50) * 50}–${Math.round(uMax / 50) * 50}`);
  if (eMin || eMax) parts.push(`~€${Math.round(eMin / 50) * 50}–${Math.round(eMax / 50) * 50}`);
  return parts.length ? parts.join(" · ") : "Mostly free";
}

function isDocumentChainStageComplete(checked, stage){
  return stage.stepIds.every((id) => checked[id]);
}

function DocumentChainDiagram({ phaseId, checked }){
  if (!DOCUMENT_CHAIN_PHASE_IDS.includes(phaseId)) return null;
  const focus = CHAIN_FOCUS_BY_PHASE[phaseId] || [];
  return (
    <div className="chain-diagram" role="img" aria-label="Document pipeline: US documents, apostille, sworn translation, registry-ready">
      {DOCUMENT_CHAIN_STAGES.map((stage, idx) => {
        const complete = isDocumentChainStageComplete(checked, stage);
        const isFocus = focus.includes(idx);
        return (
          <Fragment key={stage.id}>
            {idx > 0 && (
              <span className="chain-arrow" aria-hidden>
                <ChevronRight size={14} strokeWidth={2} style={{ color: "var(--dim)", flexShrink: 0 }} />
              </span>
            )}
            <span
              className={`chain-node ${complete ? "chain-node--done" : ""} ${isFocus ? "chain-node--focus" : ""}`}
            >
              {complete ? <Check size={12} strokeWidth={3} style={{ flexShrink: 0 }} /> : null}
              <span>{stage.label}</span>
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

function extractResources(text) {
  if (!text) return [];
  const resources = [];
  
  // Extract URLs (domain.ext format)
  const urlRegex = /\b([a-z0-9-]+\.(?:com|es|org|gov|net|edu))(?:[\/\w.-]*)?/gi;
  const urlMatches = text.match(urlRegex) || [];
  urlMatches.forEach((domain) => {
    const cleanDomain = domain.replace(/[^\w.-]/g, '');
    if (cleanDomain && !resources.find(r => r.label === cleanDomain)) {
      resources.push({
        type: 'url',
        label: cleanDomain,
        href: `https://${cleanDomain}`
      });
    }
  });
  
  // Extract phone numbers (US format)
  const phoneRegex = /\b(\d{3}[-‑]\d{3}[-‑]\d{4})\b/g;
  const phoneMatches = text.match(phoneRegex) || [];
  phoneMatches.forEach((phone) => {
    const cleanPhone = phone.replace(/[‑-]/g, '');
    resources.push({
      type: 'phone',
      label: phone,
      href: `tel:+1${cleanPhone}`
    });
  });
  
  return resources;
}

function extractDuration(text) {
  if (!text) return null;
  
  // Match time phrases like "3 months", "7-10 business days", "same day", "1-2 weeks"
  const patterns = [
    /\b(\d+[-–]\d+\s+(?:business\s+)?days?)\b/i,
    /\b(same\s+day)\b/i,
    /\b(\d+[-–]\d+\s+weeks?)\b/i,
    /\b(\d+[-–]\d+\s+months?)\b/i,
    /\b(~?\d+\s+months?)\b/i,
    /\b(\d+\s+hours?)\b/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

function getActionIcon(title, size = 14) {
  if (!title) return null;
  const lower = title.toLowerCase();
  
  if (/\b(order|request|download)\b/i.test(lower)) return <Download size={size} strokeWidth={2} />;
  if (/\b(call|phone)\b/i.test(lower)) return <Phone size={size} strokeWidth={2} />;
  if (/\b(open|sign up|create)\b/i.test(lower)) return <ExternalLink size={size} strokeWidth={2} />;
  if (/\b(book|schedule|attend)\b/i.test(lower)) return <Calendar size={size} strokeWidth={2} />;
  if (/\b(pass|complete|finish)\b/i.test(lower)) return <Award size={size} strokeWidth={2} />;
  if (/\b(send|ship|mail)\b/i.test(lower)) return <Send size={size} strokeWidth={2} />;
  
  return null;
}

function structureDetailText(text) {
  if (!text) return [];
  
  // Split by sentences and analyze structure
  const sections = [];
  let currentPara = [];
  
  // Simple sentence split
  const sentences = text.split(/\.\s+/);
  
  sentences.forEach((sentence, idx) => {
    const trimmed = sentence.trim();
    if (!trimmed) return;
    
    // Check if it ends with a colon (subheading indicator)
    if (trimmed.endsWith(':') && trimmed.length < 50) {
      if (currentPara.length > 0) {
        sections.push({ type: 'para', content: currentPara.join('. ') + '.' });
        currentPara = [];
      }
      sections.push({ type: 'subhead', content: trimmed.replace(/:$/, '') });
    } else {
      currentPara.push(trimmed);
    }
  });
  
  // Add remaining paragraph
  if (currentPara.length > 0) {
    const paraText = currentPara.join('. ');
    sections.push({ type: 'para', content: paraText.endsWith('.') ? paraText : paraText + '.' });
  }
  
  // If no structure detected, return as single paragraph
  if (sections.length === 0 || (sections.length === 1 && sections[0].type === 'para')) {
    return [{ type: 'para', content: text }];
  }
  
  return sections;
}

function getNextIncomplete(checked){
  for(const p of PHASES){
    for(let i=0;i<p.steps.length;i++){
      if(!checked[`${p.id}-${i}`]) return { phaseId:p.id, phase:p, step:p.steps[i] };
    }
  }
  return null;
}

function GlossaryTooltip({ term, children, dark }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: "above" });
  const [mobile, setMobile] = useState(false);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const glossaryEntry = findGlossaryTerm(term);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip || mobile) return;
    const r = trigger.getBoundingClientRect();
    const margin = 8;
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;
    let left = r.left + r.width / 2;
    left = Math.max(tw / 2 + margin, Math.min(left, window.innerWidth - tw / 2 - margin));
    let placement = "above";
    let top;
    if (r.top >= th + margin + 4) {
      top = r.top - th - margin;
      placement = "above";
    } else {
      top = r.bottom + margin;
      placement = "below";
    }
    if (top + th > window.innerHeight - margin && placement === "below") {
      if (r.top - th - margin >= margin) {
        top = r.top - th - margin;
        placement = "above";
      }
    }
    if (top < margin) top = margin;
    setPos({ top, left, placement });
  }, [mobile]);

  useLayoutEffect(() => {
    if (!show || !glossaryEntry || mobile) return;
    updatePosition();
  }, [show, glossaryEntry, mobile, updatePosition]);

  useLayoutEffect(() => {
    if (!show || mobile) return;
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [show, mobile, updatePosition]);

  if (!glossaryEntry) return children;

  const tooltipEl =
    show &&
    typeof document !== "undefined" &&
    createPortal(
      <span
        ref={tooltipRef}
        className={`glossary-tooltip-portal ${dark ? "glossary-tooltip-portal--dark" : ""} ${mobile ? "glossary-tooltip-portal--mobile" : ""} ${!mobile && pos.placement === "below" ? "glossary-tooltip-portal--below" : ""}`}
        role="tooltip"
        style={
          mobile
            ? undefined
            : {
                top: pos.top,
                left: pos.left,
              }
        }
      >
        <strong>{glossaryEntry.term}</strong>
        <br />
        {glossaryEntry.def}
      </span>,
      document.body
    );

  return (
    <span
      ref={triggerRef}
      className="glossary-tooltip-trigger"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShow(!show);
      }}
      role="button"
      tabIndex={0}
      aria-label={`Definition: ${glossaryEntry.def}`}
    >
      {children}
      {tooltipEl}
    </span>
  );
}

function TextWithTooltips({ text, dark }) {
  const parts = enrichTextWithTooltips(text);
  
  if (typeof parts === 'string') {
    return <>{parts}</>;
  }
  
  return (
    <>
      {parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <Fragment key={idx}>{part}</Fragment>;
        }
        if (part.type === 'glossary') {
          return (
            <GlossaryTooltip key={part.key} term={part.term} dark={dark}>
              <span className="glossary-term-highlight">{part.term}</span>
            </GlossaryTooltip>
          );
        }
        return null;
      })}
    </>
  );
}

function EnhancedStepDetail({ step, stepId, goalTheme, subChecked, toggleSubCheck, dark }) {
  const structured = structureDetailText(step.detail);
  const resources = extractResources(step.detail);
  const duration = extractDuration(step.detail);
  
  // Check for key resource mentions
  let keyResource = null;
  const lowerDetail = (step.detail || '').toLowerCase();
  if (lowerDetail.includes('wise.com') || lowerDetail.includes('wise')) keyResource = KEY_RESOURCES.wise;
  else if (lowerDetail.includes('pearson')) keyResource = KEY_RESOURCES.pearsonvue;
  else if (lowerDetail.includes('vitalchek')) keyResource = KEY_RESOURCES.vitalchek;
  else if (lowerDetail.includes('comptia')) keyResource = KEY_RESOURCES.comptia;
  else if (lowerDetail.includes('professor messer')) keyResource = KEY_RESOURCES.professormesser;
  
  const flow = STEP_FLOWS[stepId];
  const substeps = STEP_SUBSTEPS[stepId];
  
  return (
    <div>
      {/* Substeps checklist */}
      {substeps && substeps.length > 0 && (
        <div className="step-substeps">
          {substeps.map((substep) => (
            <label key={substep.id} className="substep-item">
              <input
                type="checkbox"
                checked={!!subChecked[substep.id]}
                onChange={(e) => toggleSubCheck(e, substep.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <span>{substep.label}</span>
            </label>
          ))}
        </div>
      )}
      
      {/* Key resource card */}
      {keyResource && (
        <div className="key-resource-card">
          <div className="key-resource-icon">
            <keyResource.Icon size={20} strokeWidth={2} />
          </div>
          <div className="key-resource-body">
            <div className="key-resource-name">{keyResource.name}</div>
            <div className="key-resource-desc">{keyResource.desc}</div>
          </div>
          <a href={keyResource.url} className="key-resource-cta" target="_blank" rel="noopener noreferrer">
            {keyResource.cta} <ChevronRight size={12} strokeWidth={2.5} />
          </a>
        </div>
      )}
      
      {/* Flow diagram */}
      {flow && (
        <div className="step-flow">
          {flow.map((node, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <ChevronRight size={14} className="flow-arrow" strokeWidth={2} />}
              <div className="flow-node">
                <node.icon size={16} strokeWidth={2} />
                <span>{node.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      )}
      
      {/* Structured detail text */}
      <div className="step-detail-structured">
        {structured.map((section, idx) => {
          if (section.type === 'para') {
            return (
              <p key={idx} className="detail-para">
                <TextWithTooltips text={section.content} dark={dark} />
              </p>
            );
          } else if (section.type === 'subhead') {
            return <h4 key={idx} className="detail-subhead">{section.content}</h4>;
          } else if (section.type === 'list') {
            return (
              <ul key={idx} className="detail-list">
                {section.items && section.items.map((item, i) => (
                  <li key={i}><TextWithTooltips text={item} dark={dark} /></li>
                ))}
              </ul>
            );
          } else if (section.type === 'callout') {
            return (
              <div key={idx} className="detail-callout">
                <TextWithTooltips text={section.content} dark={dark} />
              </div>
            );
          }
          return null;
        })}
      </div>
      
      {/* Extracted resources */}
      {resources.length > 0 && (
        <div className="step-resources">
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.href}
              className="resource-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              {resource.type === 'url' && <ExternalLink size={14} strokeWidth={2} />}
              {resource.type === 'phone' && <Phone size={14} strokeWidth={2} />}
              {resource.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailText({ text, style, dark }) {
  if (!text) return null;
  
  // For phase context text, apply tooltips while preserving formatting
  const parts = enrichTextWithTooltips(text);
  
  if (typeof parts === 'string') {
    // No glossary terms found, use original HTML formatting
    let formatted = text
      .replace(/([a-zA-Z0-9-]+\.(?:com|es|org|gov)(?:\/[^\s)]*)?)/g, '<span style="color:var(--accent);font-weight:500">$1</span>')
      .replace(/(€\d+[\d,.-]*|\$\d+[\d,.-]*)/g, '<span style="color:var(--text);font-weight:600">$1</span>')
      .replace(/([A-Z][a-zA-Z\s]{2,25}: )/g, '<span style="display:block;height:12px"></span><strong style="color:var(--text);font-weight:600;letter-spacing:-0.01em">$1</strong>');
    
    return (
      <div 
        style={{ color:"var(--sub)", lineHeight:1.75, textWrap:"pretty", ...style }} 
        dangerouslySetInnerHTML={{__html: formatted}} 
      />
    );
  }
  
  // Has glossary terms, render with React components
  return (
    <div style={{ color:"var(--sub)", lineHeight:1.75, textWrap:"pretty", ...style }}>
      {parts.map((part, idx) => {
        if (typeof part === 'string') {
          return <Fragment key={idx}>{part}</Fragment>;
        }
        if (part.type === 'glossary') {
          return (
            <GlossaryTooltip key={part.key} term={part.term} dark={dark}>
              <span className="glossary-term-highlight">{part.term}</span>
            </GlossaryTooltip>
          );
        }
        return null;
      })}
    </div>
  );
}

function StepTitle({ text, checked }) {
  const parts = text.split(/ — | - | – /);
  return (
    <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
      <span style={{
        fontSize:14, 
        fontWeight:500, 
        color:checked?"var(--muted)":"var(--text)", 
        textDecoration:checked?"line-through":"none",
        lineHeight:1.3,
        transition:"all .2s"
      }}>
        {parts[0]}
      </span>
      {parts[1] && (
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--dim)",
          background: "var(--border-l)",
          padding: "2px 8px",
          borderRadius: 12,
          border: "1px solid var(--border)",
          letterSpacing: ".02em",
          textDecoration: "none",
          marginTop: 1
        }}>
          {parts[1]}
        </span>
      )}
    </div>
  );
}

function HeroTitle({ text, checked }) {
  const parts = text.split(/ — | - | – /);
  return (
    <h2 style={{
      position:"relative",
      fontFamily:"'Clash Display',sans-serif",
      fontSize:24,
      fontWeight:600,
      lineHeight:1.15,
      marginBottom:16,
      letterSpacing:"-0.02em",
      color:checked?"var(--sub)":"inherit",
      textDecoration:checked?"line-through":"none",
      transition:"all .2s",
      display:"flex",
      alignItems:"center",
      gap: 12,
      flexWrap: "wrap"
    }}>
      <span>{parts[0]}</span>
      {parts[1] && (
        <span style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: "inherit",
          opacity: 0.65,
          background: "var(--border-l)",
          padding: "4px 10px",
          borderRadius: 20,
          letterSpacing: ".05em",
          textTransform: "uppercase",
          textDecoration: "none",
          marginTop: 4
        }}>
          {parts[1]}
        </span>
      )}
    </h2>
  );
}

export default function Roadmap(){
  const[view,setView]=useState("overview");
  const[glossaryTab,setGlossaryTab]=useState("spanish");
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

  const [subChecked, setSubChecked] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("spain-roadmap-substeps");
      if (saved) return JSON.parse(saved);
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem("spain-roadmap-substeps", JSON.stringify(subChecked));
  }, [subChecked]);

  const toggleSubCheck = useCallback((e, id) => {
    e.stopPropagation();
    setSubChecked(prev => ({...prev, [id]: !prev[id]}));
  }, []);

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
    if (view !== "roadmap") return;
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
  }, [view]);

  const cur=PHASES.find(p=>p.id===phase)||PHASES[0];
  const costs=getCosts();
  const idx=PHASES.findIndex(p=>p.id===phase);
  
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalSteps > 0 ? ((checkedCount / totalSteps) * 100).toFixed(0) : 0;
  
  const domColor = GOAL_COLORS_RAW[cur.dominant]||GOAL_COLORS_RAW.pdh;
  const nextUp = getNextIncomplete(checked);

  const mobNavRef = useRef(null);
  const [navAtEnd, setNavAtEnd] = useState(false);
  const [navAtStart, setNavAtStart] = useState(true);
  useEffect(() => {
    const el = mobNavRef.current;
    if (!el) return;
    const check = () => {
      setNavAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
      setNavAtStart(el.scrollLeft <= 8);
    };
    check();
    el.addEventListener('scroll', check, {passive: true});
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, []);

  const glossaryNavRef = useRef(null);
  const [glossaryNavAtEnd, setGlossaryNavAtEnd] = useState(false);
  const [glossaryNavAtStart, setGlossaryNavAtStart] = useState(true);
  useEffect(() => {
    if (view !== "glossary") return;
    const el = glossaryNavRef.current;
    if (!el) return;
    const check = () => {
      setGlossaryNavAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
      setGlossaryNavAtStart(el.scrollLeft <= 8);
    };
    check();
    el.addEventListener('scroll', check, {passive: true});
    window.addEventListener('resize', check);
    return () => { el.removeEventListener('scroll', check); window.removeEventListener('resize', check); };
  }, [view]);

  return(
    <div className={dark?"root dark":"root"} style={{background:dark?"#0E0D0B":"#EFEBE4",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
        @import url('https://fonts.cdnfonts.com/css/clash-display');
        .root{
          --gold-rgb:196,149,106;--steel-rgb:78,140,175;--sage-rgb:94,158,88;
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
          --hover-shadow:0 24px 48px rgba(0,0,0,0.09);
          --track:rgba(0,0,0,0.10);
          --grain:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
        }
        .root.dark{
          --gold-rgb:212,168,122;--steel-rgb:106,172,206;--sage-rgb:122,190,116;
          --gold:#D4A87A;--steel:#6AACCE;--sage:#7ABE74;
          --gold-bg:rgba(212,168,122,0.1);--steel-bg:rgba(106,172,206,0.08);--sage-bg:rgba(122,190,116,0.07);
          --gold-border:rgba(212,168,122,0.2);--steel-border:rgba(106,172,206,0.15);--sage-border:rgba(122,190,116,0.15);
          --bg:#0E0D0B;--surface:#161513;--card:#1C1A17;
          --text:#E8E0D4;--sub:#C4BCB3;--muted:#A8A39D;--dim:#7A7268;
          --border:rgba(255,255,255,0.06);--border-l:rgba(255,255,255,0.03);
          --accent:#D4A87A;--hl:rgba(212,168,122,0.1);
          --warn-bg:rgba(220,80,60,0.08);--warn-b:rgba(220,80,60,0.22);--warn-t:#F0A090;
          --free-bg:rgba(122,190,116,0.08);--free-t:#7ABE74;
          --marker:rgba(253, 224, 71, 0.35);
          --shadow:0 2px 8px rgba(0,0,0,0.3);
          --hover-shadow:0 24px 48px rgba(0,0,0,0.6);
          --track:rgba(255,255,255,0.10);
        }
        *{box-sizing:border-box;margin:0;padding:0}
        *:focus-visible{outline:2px solid var(--accent);outline-offset:2px;z-index:20;border-radius:2px}
        button:focus-visible{outline-color:var(--text)}
        .root{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Open Sans', Helvetica, Arial, sans-serif;transition:background .3s,color .3s;position:relative}
        .root::before{content:'';position:fixed;inset:0;background-image:var(--grain);background-repeat:repeat;background-size:256px;pointer-events:none;z-index:999;opacity:.5}
        @keyframes si{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        @keyframes stamp{from{opacity:0;transform:scale(.6) rotate(-12deg)}to{opacity:1;transform:scale(1) rotate(-4deg)}}
        @keyframes pulse-glow{0%{box-shadow:0 8px 24px rgba(139,94,32,0.25)}50%{box-shadow:0 8px 36px rgba(139,94,32,0.5)}100%{box-shadow:0 8px 24px rgba(139,94,32,0.25)}}
        @keyframes slide-right{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(3px)}}
        .layout{display:grid;grid-template-columns:250px 1fr;min-height:calc(100vh - 48px)}
        @media(max-width:1024px){.layout{grid-template-columns:1fr}.sidebar{display:none !important}.mob-nav-wrap{display:block !important;position:sticky !important;top:48px;background:var(--bg);z-index:9;border-bottom:1px solid var(--border)}.mob-b{font-size:12px;padding:8px 12px;border-radius:16px;touch-action:manipulation;-webkit-tap-highlight-color:transparent}}
        .sidebar{border-right:1px solid var(--border);position:sticky;top:48px;height:calc(100vh - 48px);overflow:hidden;display:flex;flex-direction:column}
        .sidebar::-webkit-scrollbar{width:0}
        .ph-btn{display:flex;align-items:flex-start;gap:12px;padding:12px 20px;min-height:44px;cursor:pointer;border:none;background:none;text-align:left;width:100%;color:var(--text);transition:all .12s;position:relative;font-family:'Open Sans', Helvetica, Arial, sans-serif}
        .ph-btn:hover{background:var(--hl)}
        .ph-btn.on{background:var(--hl)}
        .spine{position:absolute;left:33px;top:0;bottom:0;width:1px;background:var(--border)}
        .mob-nav-wrap{display:none;position:relative}
        .mob-nav{display:flex;gap:8px;padding:10px 14px;overflow-x:auto;-webkit-overflow-scrolling:touch}
        .mob-nav::-webkit-scrollbar{display:none}
        .mob-nav-fade{position:absolute;right:0;top:0;bottom:0;width:64px;background:linear-gradient(to right, transparent, var(--bg));display:flex;align-items:center;justify-content:flex-end;padding-right:12px;pointer-events:none;transition:opacity .25s}
        .mob-nav-fade-left{position:absolute;left:0;top:0;bottom:0;width:64px;background:linear-gradient(to left, transparent, var(--bg));display:flex;align-items:center;justify-content:flex-start;padding-left:12px;pointer-events:none;transition:opacity .25s}
        .mob-nav-arrow{pointer-events:auto;background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;padding:0;transition:background .15s}
        .mob-nav-arrow:hover{background:var(--hl)}
        .mob-b{white-space:nowrap;padding:4px 12px;min-height:44px;border-radius:22px;border:1px solid var(--border);background:none;color:var(--muted);font-size:10px;font-family:'Open Sans', Helvetica, Arial, sans-serif;cursor:pointer;font-weight:500}
        .mob-b.on{background:var(--accent);color:var(--bg);border-color:var(--accent)}
        .hero-card{border-radius:0;padding:32px 36px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
        .hero-card:hover{background:var(--surface)}
        .step-row{display:flex;align-items:flex-start;gap:16px;padding:12px 16px;border-radius:0;cursor:pointer;transition:all .25s cubic-bezier(0.2, 0.8, 0.2, 1);border:none;border-bottom:1px solid var(--border-l)}
        .step-row:hover{background:var(--surface);transform:translateX(4px)}
        .step-row.open{background:var(--card);box-shadow:var(--shadow);border-bottom-color:transparent;transform:translateX(4px) scale(1.01)}
        .pill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
        .stamp{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border:2.5px solid;border-radius:4px;transform:rotate(-4deg);font-weight:700;font-size:10px;letter-spacing:.12em;text-transform:uppercase;animation:stamp .4s cubic-bezier(.34,1.56,.64,1)}
        .goal-legend{display:flex;gap:4px}
        .goal-chip{display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:12px;min-height:44px;border:1px solid transparent;background:transparent;cursor:pointer;transition:all .2s cubic-bezier(0.2, 0.8, 0.2, 1);position:relative}
        .goal-chip:hover{background:var(--hl)}
        .goal-chip.active{}
        .goal-chip.inactive{opacity:0.6;filter:grayscale(1)}
        .hero-card.checked { opacity: 0.75; }
        .hero-card.checked:hover { opacity: 1; }
        .step-row.checked { opacity: 0.72; }
        .step-row.checked:hover, .step-row.checked.open { opacity: 1; }
        @media print {
          .sidebar, .print-hide, .overview-layout, .root::before { display: none !important; }
          .layout { display: block !important; }
          .root { background: white !important; color: black !important; min-height: auto !important; }
          .hero-detail, .step-detail { display: block !important; }
          .hero-summary { display: none !important; }
          .hero-card, .step-row { break-inside: avoid; page-break-inside: avoid; }
          .hero-card { margin-bottom: 20px !important; box-shadow: none !important; border: 2px solid var(--border) !important; }
          .step-row { margin-bottom: 10px !important; border: 1px solid var(--border) !important; }
        }
        .topbar{height:48px;display:flex;justify-content:space-between;align-items:center;padding:0 24px;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:10}
        .topbar-right{display:flex;align-items:center;gap:16px}
        .topbar-sep{width:1px;height:14px;background:var(--border);flex-shrink:0}
        .topbar-cost{font-size:12px;font-weight:500;color:var(--muted);white-space:nowrap}
        .main-pane{background:var(--card);flex:1;min-width:0;overflow-x:hidden}
        .main-content{padding:48px 56px 80px;overflow:hidden}
        .footer{border-top:1px solid var(--border);padding:24px 56px;text-align:center}
        @media(max-width:1024px){
          .topbar{padding:0 16px}
          .topbar-right{gap:8px}
          .main-content{padding:32px 32px 64px}
          .footer{padding:24px 32px}
        }
        @media(max-width:540px){
          .topbar-cost{display:none}
          .topbar-sep{display:none}
        }
        @media(max-width:480px){
          .topbar{padding:0 16px}
          .main-content{padding:16px 16px 48px}
          .footer{padding:16px 16px}
          .hero-card{padding:20px 16px !important}
          .step-row{padding:12px 12px;gap:12px}
          .mob-b{font-size:10px;padding:4px 8px;min-height:44px}
        }
        .overview-layout{max-width:1180px;margin:0 auto;padding:48px 24px 64px;animation:si .45s cubic-bezier(0.34, 1.56, 0.64, 1)}
        .overview-hero{text-align:center;margin-bottom:44px}
        .overview-hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:var(--accent);background:var(--gold-bg);padding:4px 16px;border-radius:16px;letter-spacing:.08em;text-transform:uppercase;margin-bottom:16px}
        .overview-hero h1{font-family:'Clash Display',sans-serif;font-size:clamp(32px,7vw,48px);font-weight:600;letter-spacing:-0.03em;line-height:1.15;color:var(--text);margin-bottom:16px}
        .overview-hero p{font-size:16px;line-height:1.65;color:var(--sub);max-width:580px;margin:0 auto}
        .overview-cta-wrap{display:flex;justify-content:center;margin-bottom:40px}
        .overview-cta{background:var(--text);color:var(--bg);border:none;border-radius:16px;padding:24px 32px;cursor:pointer;transition:transform .2s, box-shadow .2s;text-align:left;display:flex;align-items:center;gap:24px;width:100%;max-width:540px;box-shadow:var(--shadow)}
        .overview-cta:hover{transform:translateY(-2px);box-shadow:var(--hover-shadow)}
        .overview-cta-content{flex:1;min-width:0}
        .overview-cta-title{font-family:'Clash Display',sans-serif;font-size:24px;font-weight:600;letter-spacing:-0.02em;margin-bottom:8px;color:var(--bg)}
        .overview-cta-sub{display:block;font-size:14px;font-weight:500;color:var(--bg);opacity:0.8;line-height:1.4}
        .overview-cta-arrow{width:44px;height:44px;border-radius:50%;background:var(--bg);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text)}
        .overview-timeline{display:flex;flex-direction:column;gap:8px}
        .timeline-visual-row{width:100%;padding:0 8px 8px}
        .timeline-track{display:flex;align-items:center;width:100%;max-width:1000px;margin:0 auto 8px}
        .timeline-connector-segment{flex:1;height:3px;min-width:12px;border-radius:2px;align-self:center;transition:background .35s ease}
        .chapter-node-circle{width:56px;height:56px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;flex-shrink:0;border:2px solid var(--border);background:var(--card);color:var(--text);box-shadow:var(--shadow);transition:transform .2s, border-color .2s, box-shadow .2s;z-index:1}
        .chapter-node-circle .chapter-node-num{font-family:'Clash Display',sans-serif;font-size:11px;font-weight:600;letter-spacing:.06em;opacity:.75;line-height:1}
        .timeline-cards-row{display:flex;flex-direction:row;align-items:stretch;gap:16px;width:100%}
        .timeline-card-wrap{flex:1;min-width:0;display:flex;flex-direction:column;position:relative}
        .overview-timeline .chapter-node-circle--mobile{display:none}
        @media(max-width:680px){
          .timeline-visual-row{display:none}
          .timeline-cards-row{flex-direction:column;gap:20px}
          .timeline-card-wrap{padding-left:48px}
          .timeline-card-wrap::before{content:'';position:absolute;left:19px;top:0;bottom:-20px;width:2px;background:var(--track);border-radius:1px}
          .timeline-card-wrap:last-child::before{bottom:28px}
          .overview-timeline .chapter-node-circle--mobile{display:flex;position:absolute;left:0;top:28px;width:40px;height:40px;z-index:2}
          .chapter-node-circle--mobile .chapter-node-num{font-size:9px}
        }
        .chapter-card{position:relative;overflow:hidden;text-align:left;border:1px solid var(--border);border-radius:16px;padding:28px 24px 24px;background:var(--card);cursor:pointer;transition:all .3s cubic-bezier(0.2, 0.8, 0.2, 1);font-family:'Open Sans',Helvetica,Arial,sans-serif;color:var(--text);width:100%;-webkit-tap-highlight-color:transparent;box-shadow:var(--shadow);flex:1}
        .chapter-card:hover{background:var(--surface)}
        .chapter-card-arrow{position:absolute;right:28px;top:40px;opacity:0;transform:translateX(-10px);transition:all .3s cubic-bezier(0.2, 0.8, 0.2, 1);color:var(--text)}
        .chapter-card:hover .chapter-card-arrow{opacity:1;transform:translateX(0)}
        .chapter-card-watermark{position:absolute;right:-20px;bottom:-20px;opacity:0.03;pointer-events:none;transition:opacity .3s, transform .3s}
        .chapter-card:hover .chapter-card-watermark{opacity:0.06;transform:scale(1.05)}
        .root.dark .chapter-card-watermark{opacity:0.02}
        .root.dark .chapter-card:hover .chapter-card-watermark{opacity:0.04}
        .chapter-card-top{display:flex;align-items:flex-start;gap:16px;margin-bottom:16px;position:relative;z-index:2}
        .chapter-card-icon{width:46px;height:46px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        /* Hide the card header icon on overview timeline - icon already shows in timeline node */
        .overview-timeline .chapter-card-icon{display:none !important}
        .overview-timeline .chapter-card-top{gap:0;margin-bottom:12px}
        .chapter-card-title{font-family:'Clash Display',sans-serif;font-size:18px;font-weight:600;letter-spacing:-0.02em;margin-bottom:4px}
        .chapter-card-range{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:8px}
        .chapter-card-blurb{font-size:14px;line-height:1.55;color:var(--sub);margin-bottom:12px;position:relative;z-index:2}
        .chapter-outcomes{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;position:relative;z-index:2}
        .outcome-chip{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;letter-spacing:.02em;padding:5px 10px;border-radius:999px;border:1px solid var(--border);color:var(--sub);background:var(--surface);transition:border-color .2s, color .2s, background .2s}
        .outcome-chip svg{opacity:.85}
        .chapter-comp-wrap{margin-bottom:10px;position:relative;z-index:2}
        .chapter-comp-bar{height:6px;border-radius:4px;background:var(--track);overflow:hidden;display:flex;flex-direction:row;width:100%}
        .chapter-comp-seg{height:100%;transition:width .5s cubic-bezier(0.34, 1.56, 0.64, 1)}
        .chapter-comp-legend{display:flex;flex-wrap:wrap;gap:10px 14px;margin-top:8px;font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
        .chapter-comp-legend span{display:inline-flex;align-items:center;gap:5px}
        .chapter-comp-dot{width:7px;height:7px;border-radius:2px;flex-shrink:0}
        .chapter-card-cost-row{font-size:11px;font-weight:600;color:var(--muted);margin-bottom:10px;position:relative;z-index:2;line-height:1.45}
        .chapter-card-meta{font-size:12px;font-weight:600;color:var(--muted);position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between}
        .chain-diagram{display:flex;flex-wrap:wrap;align-items:center;gap:4px 2px;margin:0 0 28px;padding:14px 16px;border-radius:12px;background:var(--surface);border:1px solid var(--border)}
        .chain-node{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:8px 12px;border-radius:999px;border:1px solid var(--gold-border);background:var(--gold-bg);color:var(--text);transition:background .2s, color .2s, border-color .2s, box-shadow .2s}
        .chain-node--focus{box-shadow:0 0 0 2px rgba(var(--gold-rgb),0.35)}
        .chain-node--done{background:var(--gold);color:var(--bg);border-color:var(--gold)}
        .root.dark .chain-node--done{color:#1A1612}
        .chain-arrow{display:flex;align-items:center;padding:0 2px}
        .resource-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:8px;border:1.5px solid var(--border);background:var(--surface);color:var(--accent);font-size:12px;font-weight:600;text-decoration:none;transition:all .2s cubic-bezier(0.2, 0.8, 0.2, 1);font-family:'Open Sans',Helvetica,Arial,sans-serif}
        .resource-btn:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1);border-color:var(--accent)}
        .resource-btn svg{flex-shrink:0}
        .step-resources{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
        .duration-chip{display:inline-flex;align-items:center;gap:4px;padding:4px 8px;border-radius:12px;background:var(--hl);color:var(--muted);font-size:10px;font-weight:600;letter-spacing:.02em}
        .duration-chip svg{flex-shrink:0}
        .step-detail-structured{font-size:14px;line-height:1.7;color:var(--sub);max-width:100%}
        .detail-para{margin:0 0 12px;color:var(--sub);line-height:1.7}
        .detail-para:last-child{margin-bottom:0}
        .detail-subhead{font-size:14px;font-weight:700;color:var(--text);margin:18px 0 10px;letter-spacing:-0.01em}
        .detail-subhead:first-child{margin-top:0}
        .detail-list{padding-left:20px;margin:10px 0 14px;line-height:1.7;color:var(--sub)}
        .detail-list li{margin-bottom:7px}
        .detail-list li:last-child{margin-bottom:0}
        .detail-callout{padding:12px 14px;margin:14px 0;background:var(--hl);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;font-size:13px;line-height:1.6}
        .detail-callout strong{color:var(--text);font-weight:600}
        .key-resource-card{display:flex;align-items:center;gap:16px;padding:16px 18px;border:1.5px solid var(--border);border-radius:12px;background:var(--surface);box-shadow:var(--shadow);margin:14px 0;transition:all .2s cubic-bezier(0.2, 0.8, 0.2, 1)}
        .key-resource-card:hover{border-color:var(--accent);box-shadow:var(--hover-shadow)}
        .key-resource-icon{width:48px;height:48px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--hl);color:var(--accent);flex-shrink:0}
        .key-resource-body{flex:1;min-width:0}
        .key-resource-name{font-size:15px;font-weight:700;color:var(--text);margin-bottom:3px;letter-spacing:-0.01em}
        .key-resource-desc{font-size:12px;color:var(--muted);line-height:1.45}
        .key-resource-cta{display:inline-flex;align-items:center;gap:5px;padding:10px 16px;border-radius:8px;background:var(--accent);color:var(--bg);font-size:12px;font-weight:700;text-decoration:none;white-space:nowrap;transition:opacity .15s;font-family:'Open Sans',Helvetica,Arial,sans-serif}
        .key-resource-cta:hover{opacity:0.85}
        .key-resource-cta svg{flex-shrink:0}
        .step-flow{display:flex;flex-wrap:wrap;gap:10px 8px;align-items:center;margin:16px 0;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:12px}
        .flow-node{display:flex;flex-direction:column;align-items:center;gap:5px;padding:12px 14px;border:1.5px dashed var(--border);border-radius:10px;font-size:11px;font-weight:600;color:var(--sub);min-width:80px;text-align:center;transition:border-color .2s, background .2s}
        .flow-node:hover{border-color:var(--accent);background:var(--hl)}
        .flow-node svg{flex-shrink:0;color:var(--muted)}
        .flow-arrow{color:var(--dim);flex-shrink:0;margin:0}
        .step-substeps{margin:12px 0;padding:12px;background:var(--surface);border:1px solid var(--border);border-radius:8px}
        .substep-item{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:12px;color:var(--sub);cursor:pointer;transition:color .15s;border-bottom:1px solid var(--border-l)}
        .substep-item:last-child{border-bottom:none;padding-bottom:0}
        .substep-item:first-child{padding-top:0}
        .substep-item:hover{color:var(--text)}
        .substep-item input[type="checkbox"]{width:18px;height:18px;border-radius:4px;border:2px solid var(--dim);background:var(--surface);cursor:pointer;flex-shrink:0;appearance:none;position:relative;transition:all .2s}
        .substep-item input[type="checkbox"]:checked{background:var(--accent);border-color:var(--accent)}
        .substep-item input[type="checkbox"]:checked::after{content:'✓';position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);color:var(--bg);font-size:12px;font-weight:700}
        .substep-item input[type="checkbox"]:hover{border-color:var(--accent)}
        .glossary-layout{width:100%;max-width:min(1400px, calc(100vw - 48px));margin:0 auto;padding:48px clamp(20px,4vw,56px) 64px;box-sizing:border-box;animation:si .45s cubic-bezier(0.34, 1.56, 0.64, 1)}
        .glossary-hero{text-align:center;margin-bottom:32px}
        .glossary-hero h1{font-family:'Clash Display',sans-serif;font-size:clamp(32px,6vw,42px);font-weight:600;letter-spacing:-0.03em;line-height:1.15;color:var(--text);margin-bottom:12px}
        .glossary-hero p{font-size:15px;line-height:1.65;color:var(--sub);max-width:720px;margin:0 auto}
        .glossary-nav-container{position:relative;margin-bottom:40px;width:100%}
        .glossary-tabs-wrap{display:flex;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:8px;scrollbar-width:none;-ms-overflow-style:none}
        .glossary-tabs-wrap::-webkit-scrollbar{display:none}
        .glossary-nav-fade{position:absolute;right:0;top:0;bottom:8px;width:64px;background:linear-gradient(to right, transparent, var(--bg));display:flex;align-items:center;justify-content:flex-end;padding-right:0px;pointer-events:none;transition:opacity .25s;z-index:2}
        .glossary-nav-fade-left{position:absolute;left:0;top:0;bottom:8px;width:64px;background:linear-gradient(to left, transparent, var(--bg));display:flex;align-items:center;justify-content:flex-start;padding-left:0px;pointer-events:none;transition:opacity .25s;z-index:2}
        .glossary-nav-arrow{pointer-events:auto;background:var(--bg);border:1px solid var(--border);box-shadow:var(--shadow);cursor:pointer;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;padding:0;transition:all .15s}
        .glossary-nav-arrow:hover{background:var(--hl);border-color:var(--accent)}
        .glossary-tabs{display:inline-flex;background:var(--card);padding:6px;border-radius:12px;border:1px solid var(--border);box-shadow:var(--shadow);margin:0 auto;max-width:max-content}
        .glossary-tab{padding:10px 20px;border-radius:8px;border:none;background:none;font-size:14px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .2s;white-space:nowrap;display:flex;align-items:center;gap:8px;font-family:'Open Sans',Helvetica,Arial,sans-serif}
        .glossary-tab:hover{color:var(--text)}
        .glossary-tab.active{background:var(--hl);color:var(--text);box-shadow:inset 0 0 0 1px var(--border-l)}
        .glossary-grid{display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:24px;align-items:stretch}
        @media(max-width:680px){
          .glossary-tabs-wrap{padding:0 4px 8px}
          .glossary-tabs{margin:0}
          .glossary-tab{padding:10px 16px;font-size:13px}
          .glossary-grid{grid-template-columns:repeat(auto-fill, minmax(100%, 1fr));gap:16px}
        }
        .glossary-term-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;box-shadow:var(--shadow);transition:all .2s;display:flex;flex-direction:column;height:100%}
        .glossary-term-card:hover{box-shadow:var(--hover-shadow);transform:translateY(-2px);border-color:var(--accent)}
        .glossary-term-name{font-size:15px;font-weight:700;color:var(--text);margin-bottom:8px;letter-spacing:-0.01em}
        .glossary-term-def{font-size:14px;line-height:1.6;color:var(--sub);margin:0}
        .glossary-term-highlight{color:var(--accent);text-decoration:underline;text-decoration-style:dotted;text-underline-offset:2px;cursor:help}
        .glossary-tooltip-trigger{position:relative;display:inline}
        .glossary-tooltip-portal{position:fixed;z-index:10000;pointer-events:none;background:#1A1612;color:#F7F5F0;padding:10px 12px;border-radius:8px;font-size:12px;line-height:1.5;font-family:'Open Sans',Helvetica,Arial,sans-serif;max-width:min(280px,calc(100vw - 24px));width:max-content;box-shadow:0 8px 24px rgba(0,0,0,0.25);transform:translateX(-50%);animation:fi .2s ease}
        .glossary-tooltip-portal--dark{background:#E8E0D4;color:#1A1612}
        .glossary-tooltip-portal::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;border-top-color:#1A1612}
        .glossary-tooltip-portal--below::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:#1A1612}
        .glossary-tooltip-portal--dark::after{border-top-color:#E8E0D4}
        .glossary-tooltip-portal--dark.glossary-tooltip-portal--below::after{border-top-color:transparent;border-bottom-color:#E8E0D4}
        .glossary-tooltip-portal strong{display:block;margin-bottom:4px;font-weight:700}
        .glossary-tooltip-portal--mobile{top:50% !important;left:50% !important;transform:translate(-50%,-50%) !important;pointer-events:auto;max-width:calc(100vw - 40px)}
        .glossary-tooltip-portal--mobile::after{display:none}
        .overview-hint{text-align:center;font-size:14px;color:var(--muted);margin-top:32px;line-height:1.55;max-width:480px;margin-left:auto;margin-right:auto}
        .topbar-back{background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--accent);font-family:'Open Sans',Helvetica,Arial,sans-serif;padding:8px 12px;min-height:44px;border-radius:8px;margin-right:4px;flex-shrink:0}
        .topbar-back:hover{background:var(--hl)}
        .topbar-left-cluster{display:flex;align-items:center;gap:4px;min-width:0}
      `}</style>

      {/* TOP BAR */}
      <div className="print-hide topbar" style={{background:dark?"#0E0D0B":"#EFEBE4"}}>
        <div className="topbar-left-cluster">
          {(view==="roadmap" || view==="glossary")&&(
            <button type="button" className="topbar-back" onClick={()=>setView("overview")} aria-label="Back to overview">
              <ChevronRight size={14} strokeWidth={2.5} style={{transform:"rotate(180deg)"}}/>
              Overview
            </button>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
            <Plane size={14} strokeWidth={2} style={{color:"var(--accent)",flexShrink:0}}/>
            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:16,fontWeight:600,color:"var(--text)",letterSpacing:"-0.02em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Your move to Spain</span>
          </div>
        </div>
        <div className="topbar-right">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:10,fontWeight:600,color:"var(--muted)",width:24,textAlign:"right"}}>{progress}%</span>
            <div style={{position:"relative",width:72,height:4,borderRadius:3,background:"var(--track)"}}>
              <div style={{position:"absolute",left:0,top:0,bottom:0,borderRadius:3,background:`linear-gradient(90deg, var(--gold), var(--steel))`,width:`${progress}%`,transition:"width .6s cubic-bezier(0.34, 1.56, 0.64, 1)"}}/>
              <div style={{position:"absolute",left:`${progress}%`,top:"50%",transition:"left .6s cubic-bezier(0.34, 1.56, 0.64, 1)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>
                <Plane size={11} strokeWidth={2.5} style={{color:"var(--steel)",fill:"var(--bg)",transform:"translate(-50%, -50%) rotate(45deg)",marginTop:-1}}/>
              </div>
            </div>
          </div>
          {view==="roadmap"&&<>
            <div className="topbar-sep"/>
            <span className="topbar-cost">{costs.usd} + {costs.eur}</span>
          </>}
          {view!=="glossary"&&(
            <>
              <div className="topbar-sep"/>
              <button type="button" onClick={()=>setView("glossary")} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",minHeight:44,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:600,color:"var(--muted)",fontFamily:"'Open Sans', Helvetica, Arial, sans-serif",transition:"all .2s"}}>
                <BookOpen size={12} strokeWidth={2}/>
                Glossary
              </button>
            </>
          )}
          <button type="button" onClick={()=>setDark(!dark)} style={{background:"none",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",minHeight:44,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:500,color:"var(--muted)",fontFamily:"'Open Sans', Helvetica, Arial, sans-serif"}}>
            {dark?<Sun size={10} strokeWidth={2}/>:<Moon size={10} strokeWidth={2}/>}
          </button>
        </div>
      </div>

      {view==="overview"&&(
      <div className="overview-layout print-hide">
        <div className="overview-hero">
          <div className="overview-hero-badge"><Plane size={12} strokeWidth={2.5}/> Your Roadmap</div>
          <h1>Spain is closer than you think.</h1>
          <p>It looks like a lot on paper — because it is a real journey. You only ever need to do the <strong style={{color:"var(--text)",fontWeight:600}}>next right thing</strong>. This page is the map; the detailed checklist opens when you are ready.</p>
        </div>
        <div className="overview-cta-wrap">
          <button
            type="button"
            className="overview-cta"
            onClick={()=>{
              if(nextUp){ setPhase(nextUp.phaseId); setView("roadmap"); }
              else { setView("roadmap"); }
            }}
          >
            <div className="overview-cta-content">
              {nextUp ? (
                <>
                  <div className="overview-cta-title">Resume: {nextUp.phase.label}</div>
                  <span className="overview-cta-sub">Next up: {nextUp.step.title}</span>
                </>
              ) : (
                <>
                  <div className="overview-cta-title">You are fully prepared.</div>
                  <span className="overview-cta-sub">Open the full roadmap to review or celebrate</span>
                </>
              )}
            </div>
            <div className="overview-cta-arrow">
              <ChevronRight size={20} strokeWidth={2.5}/>
            </div>
          </button>
        </div>
        <div className="overview-timeline">
          <div className="timeline-visual-row print-hide" aria-hidden="true">
            <div className="timeline-track">
              {CHAPTERS.map((ch, i) => {
                const prev = i > 0 ? CHAPTERS[i - 1] : null;
                const prevComplete = prev ? getChapterProgress(prev, checked).pct === 100 : false;
                const Ci = ch.Icon;
                return (
                  <Fragment key={`node-${ch.id}`}>
                    {i > 0 && (
                      <div
                        className="timeline-connector-segment"
                        style={{
                          background: prevComplete
                            ? `linear-gradient(90deg, var(--${prev.theme}), var(--${ch.theme}))`
                            : "var(--track)",
                        }}
                      />
                    )}
                    <div
                      className="chapter-node-circle"
                      style={{
                        borderColor: `rgba(var(--${ch.theme}-rgb), 0.35)`,
                        boxShadow: `0 4px 16px rgba(var(--${ch.theme}-rgb), 0.12)`,
                        color: `var(--${ch.theme})`,
                      }}
                    >
                      <span className="chapter-node-num">{String(i + 1).padStart(2, "0")}</span>
                      <Ci size={20} strokeWidth={2} />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
          <div className="timeline-cards-row">
            {CHAPTERS.map((ch, i) => {
              const { done, total, pct } = getChapterProgress(ch, checked);
              const comp = getChapterComposition(ch);
              const costStr = getChapterCost(ch);
              const chapterComplete = pct === 100;
              const outcomes = CHAPTER_OUTCOMES[ch.id] || [];
              const Ci = ch.Icon;
              const pdhW = comp.total ? (comp.pdh / comp.total) * 100 : 0;
              const workW = comp.total ? (comp.work / comp.total) * 100 : 0;
              const setupW = comp.total ? (comp.setup / comp.total) * 100 : 0;
              return (
                <div className="timeline-card-wrap" key={ch.id}>
                  <div
                    className="chapter-node-circle chapter-node-circle--mobile"
                    style={{
                      borderColor: `rgba(var(--${ch.theme}-rgb), 0.35)`,
                      color: `var(--${ch.theme})`,
                    }}
                  >
                    <span className="chapter-node-num">{String(i + 1).padStart(2, "0")}</span>
                    <Ci size={18} strokeWidth={2} />
                  </div>
                  <button
                    type="button"
                    className="chapter-card"
                    onClick={() => {
                      setPhase(ch.phaseIds[0]);
                      setView("roadmap");
                    }}
                  >
                    <Ci className="chapter-card-watermark" size={120} strokeWidth={0.5} style={{ color: `var(--${ch.theme})` }} />
                    <div className="chapter-card-arrow">
                      <ChevronRight size={22} strokeWidth={2} />
                    </div>
                    <div className="chapter-card-top">
                      <div
                        className="chapter-card-icon"
                        style={{
                          background: `rgba(var(--${ch.theme}-rgb), 0.1)`,
                          color: `var(--${ch.theme})`,
                        }}
                      >
                        <Ci size={22} strokeWidth={2} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="chapter-card-title">{ch.title}</div>
                        <div className="chapter-card-range">{ch.range}</div>
                      </div>
                    </div>
                    <div className="chapter-outcomes">
                      {outcomes.map((label) => (
                        <span
                          key={label}
                          className="outcome-chip"
                          style={{
                            borderColor: chapterComplete
                              ? `var(--${ch.theme})`
                              : "var(--border)",
                            color: chapterComplete ? `var(--${ch.theme})` : "var(--sub)",
                          }}
                        >
                          {chapterComplete ? (
                            <Check size={11} strokeWidth={3} style={{ color: `var(--${ch.theme})` }} />
                          ) : (
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: "var(--dim)",
                                flexShrink: 0,
                              }}
                            />
                          )}
                          {label}
                        </span>
                      ))}
                    </div>
                    <div className="chapter-card-blurb">
                      <TextWithTooltips text={ch.blurb} dark={dark} />
                    </div>
                    <div className="chapter-comp-wrap">
                      <div className="chapter-comp-bar" title="Mix of Legal, Work, and Setup steps in this chapter">
                        {comp.pdh > 0 && (
                          <div
                            className="chapter-comp-seg"
                            style={{ width: `${pdhW}%`, background: "var(--gold)" }}
                          />
                        )}
                        {comp.work > 0 && (
                          <div
                            className="chapter-comp-seg"
                            style={{ width: `${workW}%`, background: "var(--steel)" }}
                          />
                        )}
                        {comp.setup > 0 && (
                          <div
                            className="chapter-comp-seg"
                            style={{ width: `${setupW}%`, background: "var(--sage)" }}
                          />
                        )}
                      </div>
                      <div className="chapter-comp-legend">
                        <span>
                          <span className="chapter-comp-dot" style={{ background: "var(--gold)" }} />
                          Legal
                        </span>
                        <span>
                          <span className="chapter-comp-dot" style={{ background: "var(--steel)" }} />
                          Work
                        </span>
                        <span>
                          <span className="chapter-comp-dot" style={{ background: "var(--sage)" }} />
                          Setup
                        </span>
                      </div>
                    </div>
                    <div className="chapter-card-cost-row">
                      {costStr}
                      <span style={{ color: "var(--dim)", fontWeight: 500 }}> · </span>
                      {ch.durationLabel}
                    </div>
                    <div className="chapter-card-meta">
                      <span>
                        {done} of {total} steps completed
                      </span>
                      <span style={{ color: `var(--${ch.theme})` }}>{pct}%</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <p className="overview-hint">
          Tap any chapter to jump in — or use the main button to land exactly where you left off. Nothing else is due until you open it.
          {" "}<button onClick={()=>setView("glossary")} style={{background:"none",border:"none",color:"var(--accent)",textDecoration:"underline",cursor:"pointer",font:"inherit",padding:0}}>View glossary</button> for definitions of Spanish terms and technical concepts.
        </p>
      </div>
      )}

      {view==="glossary"&&(
      <div className="glossary-layout print-hide">
        <div className="glossary-hero">
          <h1>Glossary</h1>
          <p>Quick reference for Spanish terms, US documents, IT certifications, and financial concepts you will encounter throughout your move to Spain.</p>
        </div>
        <div className="glossary-nav-container">
          <div className="glossary-tabs-wrap" ref={glossaryNavRef}>
            <div className="glossary-tabs">
              {Object.entries(GLOSSARY).map(([key, section]) => {
                const isActive = glossaryTab === key;
                return (
                  <button 
                    key={key} 
                    className={`glossary-tab ${isActive ? "active" : ""}`}
                    onClick={() => setGlossaryTab(key)}
                  >
                    {key === 'spanish' && <Scale size={16} strokeWidth={2} style={{color:isActive?"var(--gold)":"currentColor"}}/>}
                    {key === 'us' && <FileText size={16} strokeWidth={2} style={{color:isActive?"var(--steel)":"currentColor"}}/>}
                    {key === 'tech' && <Briefcase size={16} strokeWidth={2} style={{color:isActive?"var(--steel)":"currentColor"}}/>}
                    {key === 'financial' && <Target size={16} strokeWidth={2} style={{color:isActive?"var(--sage)":"currentColor"}}/>}
                    {section.title}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="glossary-nav-fade-left" style={{opacity: glossaryNavAtStart ? 0 : 1, pointerEvents: glossaryNavAtStart ? 'none' : 'auto'}}>
            <button className="glossary-nav-arrow" onClick={() => glossaryNavRef.current?.scrollBy({left: -180, behavior: 'smooth'})}>
              <ChevronRight size={14} strokeWidth={2.5} style={{color:"var(--sub)", transform:"rotate(180deg)"}}/>
            </button>
          </div>
          <div className="glossary-nav-fade" style={{opacity: glossaryNavAtEnd ? 0 : 1, pointerEvents: glossaryNavAtEnd ? 'none' : 'auto'}}>
            <button className="glossary-nav-arrow" onClick={() => glossaryNavRef.current?.scrollBy({left: 180, behavior: 'smooth'})}>
              <ChevronRight size={14} strokeWidth={2.5} style={{color:"var(--sub)"}}/>
            </button>
          </div>
        </div>

        <div className="glossary-grid">
          {GLOSSARY[glossaryTab]?.terms.map((item, idx) => (
            <div key={idx} className="glossary-term-card">
              <div className="glossary-term-name">{item.term}</div>
              <div className="glossary-term-def">{item.def}</div>
            </div>
          ))}
        </div>
      </div>
      )}

      {view==="roadmap"&&(<>
      {/* MOBILE NAV */}
      <div className="mob-nav-wrap print-hide">
        <div className="mob-nav" ref={mobNavRef}>
          {PHASES.map(p=><button key={p.id} className={`mob-b ${phase===p.id?"on":""}`} onClick={()=>setPhase(p.id)}>{p.num} &bull; {p.label}</button>)}
        </div>
        <div className="mob-nav-fade-left" style={{opacity: navAtStart ? 0 : 1, pointerEvents: navAtStart ? 'none' : 'auto'}}>
          <button className="mob-nav-arrow" onClick={() => mobNavRef.current?.scrollBy({left: -180, behavior: 'smooth'})}>
            <ChevronRight size={14} strokeWidth={2.5} style={{color:"var(--sub)", transform:"rotate(180deg)"}}/>
          </button>
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
          <div style={{padding:"20px 20px 16px"}}>
            <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:18,fontWeight:500,color:"var(--text)",marginBottom:4}}>The journey</div>
            <p style={{fontSize:12,color:"var(--muted)"}}>{pdhSteps} of {totalSteps} steps for legal status</p>
          </div>
          <div style={{flex:1,position:"relative",paddingTop:2,overflowY:"auto"}}>
            <div className="spine"/>
            {PHASES.map((p, i)=>{
              const dc = GOAL_COLORS_RAW[p.dominant]||GOAL_COLORS_RAW.pdh;
              const dt = GOAL_THEMES[p.dominant]||"gold";
              const isOn = phase===p.id;
              const phaseChecked = p.steps.length > 0 && p.steps.every((_, stepIdx) => checked[`${p.id}-${stepIdx}`]);
              
              const isPart1 = i === 0;
              const isPart2 = i === 7;
              
              return(
                <span key={p.id} style={{display:"block", width:"100%"}}>
                  {isPart1 && <div style={{fontSize:10, fontWeight:700, color:"var(--dim)", textTransform:"uppercase", letterSpacing:".1em", margin:"16px 20px 8px", display:"flex", alignItems:"center", gap:8}}><Target size={12} strokeWidth={2.5}/> Part 1: The US Prep</div>}
                  {isPart2 && <div style={{fontSize:10, fontWeight:700, color:"var(--dim)", textTransform:"uppercase", letterSpacing:".1em", margin:"32px 20px 8px", display:"flex", alignItems:"center", gap:8}}><Plane size={12} strokeWidth={2.5}/> Part 2: In Spain</div>}
                  <button className={`ph-btn ${isOn?"on":""}`} onClick={()=>setPhase(p.id)}
                    style={isOn?{borderRight:`3px solid ${dc}`}:{}}>
                  <div style={{
                    width:10,height:10,borderRadius:"50%",flexShrink:0,marginTop:3,zIndex:1,
                    border:`2px solid ${isOn||phaseChecked?dc:"var(--dim)"}`,
                    background:isOn||phaseChecked?dc:"var(--bg)",
                    boxShadow:isOn?`0 0 0 3px rgba(var(--${dt}-rgb), 0.15)`:"none",
                    transition:"all .2s",
                    display:"flex",alignItems:"center",justifyContent:"center"
                  }}>
                    {phaseChecked && !isOn && <Check size={6} color="#fff" strokeWidth={4}/>}
                    {phaseChecked && isOn && <Check size={6} color="var(--bg)" strokeWidth={4}/>}
                  </div>
                  <div>
                    <div style={{fontSize:10,fontWeight:600,color:isOn?dc:"var(--dim)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{p.date}</div>
                    <div style={{fontSize:12,fontWeight:isOn?600:400,color:isOn?"var(--text)":"var(--muted)",lineHeight:1.3}}>{p.label}</div>
                    {p.milestone&&isOn&&(
                      <div className="stamp" style={{fontSize:10,padding:"4px 8px",marginTop:4,borderColor:dc,color:dc}}>
                        <MapPin size={8} strokeWidth={3}/> Milestone
                      </div>
                    )}
                  </div>
                </button>
              </span>
              );
            })}
          </div>
          <div style={{padding:"20px",borderTop:"1px solid var(--border)",flexShrink:0,background:"var(--bg)"}}>            <div style={{fontSize:10, fontWeight:700, color:"var(--dim)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:12}}>Category Progress & Filters</div>
            <div className="goal-legend" style={{display:"flex", flexDirection:"column", gap:8}}>
              {Object.values(GOALS).map(g=>{
                const total = PHASES.reduce((a,p) => a + p.steps.filter(s=>s.goal === g.id).length, 0);
                const completed = PHASES.reduce((a,p) => a + p.steps.filter((s,i)=>s.goal === g.id && checked[`${p.id}-${i}`]).length, 0);
                const pct = total ? Math.round((completed/total)*100) : 0;

                const isActive = activeFilter === g.id;
                const isInactive = activeFilter && !isActive;
                return (
                  <button key={g.id} className={`goal-chip ${isActive?"active":isInactive?"inactive":""}`} style={{borderLeft:isActive?`3px solid ${g.color}`:isInactive?"3px solid transparent":"3px solid var(--border-l)", background:isActive?g.bg:"transparent", color:"var(--text)"}}
                    onClick={()=>setActiveFilter(isActive ? null : g.id)}>
                    <div style={{display:"flex", alignItems:"flex-start", gap:12, flex:1, position:"relative", zIndex:2}}>
                      <div style={{width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:isInactive?"var(--dim)":g.color, marginTop:2}}>
                        <g.Icon size={16} strokeWidth={1.5}/>
                      </div>
                      <div style={{textAlign:"left", flex:1}}>
                        <div style={{fontSize:10, fontWeight:700, letterSpacing:".02em", color:isActive?g.color:isInactive?"var(--dim)":"var(--text)", marginBottom:4}}>{g.label}</div>
                        <div style={{display:"flex", flexWrap:"wrap", gap:3}}>
                          {Array.from({length: total}).map((_, i) => (
                            <div key={i} style={{width: 9, height: 9, background: i < completed ? g.color : "var(--border)", opacity: i < completed ? 1 : 0.35}} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            {activeFilter && (
              <div style={{fontSize:10, fontWeight:600, color:"var(--dim)", marginTop:12, textAlign:"center", letterSpacing:".05em", textTransform:"uppercase", display:"flex", alignItems:"center", justifyContent:"center", gap:4}}>
                <div style={{width:6, height:6, borderRadius:"50%", background:GOALS[activeFilter].color, animation:"fi 1s infinite alternate"}}/>
                Filtering by {GOALS[activeFilter].label}
              </div>
            )}
          </div>
        </div>

        {/* MAIN PANE */}
        <div className="main-pane">
          <div className="main-content" key={phase}>
            <div style={{maxWidth:960,animation:"si .5s cubic-bezier(0.34, 1.56, 0.64, 1)"}}>

            {/* PHASE HEADER */}
            <div style={{marginBottom:36, position:"relative"}}>
              <span style={{position:"absolute", left:-20, top:-30, fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(120px,15vw,160px)",fontWeight:400,lineHeight:0.8,color:domColor,opacity:0.04, zIndex:0, pointerEvents:"none", WebkitTextStroke:`1px ${domColor}`}}>{cur.num}</span>
              <div style={{display:"flex",alignItems:"flex-end",gap:16,marginBottom:16, position:"relative", zIndex:1}}>
                <div style={{paddingBottom:4,flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:domColor,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>{cur.date}</div>
                  <h1 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(32px,4.5vw,48px)",fontWeight:600,letterSpacing:"-0.03em",lineHeight:1}}>
                    {cur.label}
                  </h1>
                </div>
                {cur.milestone&&<div className="stamp" style={{marginBottom:8,borderColor:domColor,color:domColor}}><MapPin size={12} strokeWidth={2.5}/>Milestone</div>}
              </div>
              <DetailText text={cur.context} dark={dark} style={{fontSize:16, lineHeight:1.65, fontWeight:400, position:"relative", zIndex:1}} />
            </div>

            <DocumentChainDiagram phaseId={cur.id} checked={checked} />

            {/* FILTERING LOGIC */}
            {(()=>{
              const stepsWithIndex = cur.steps.map((s, i) => ({ ...s, originalIndex: i }));
              const visibleSteps = activeFilter ? stepsWithIndex.filter(s => s.goal === activeFilter) : stepsWithIndex;

              if (visibleSteps.length === 0) {
                return (
                  <div style={{padding:"40px 20px", textAlign:"center", border:"1.5px dashed var(--border)", borderRadius:16, marginTop:10}}>
                    <div style={{display:"flex",justifyContent:"center",marginBottom:12,opacity:0.2}}><Target size={32}/></div>
                    <div style={{fontSize:14, color:"var(--sub)", fontWeight:500, marginBottom:8}}>No {GOALS[activeFilter].short} steps in this phase.</div>
                    <button onClick={()=>setActiveFilter(null)} style={{background:"none", border:"none", color:"var(--accent)", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Open Sans', Helvetica, Arial, sans-serif", padding:"12px 24px", minHeight:44, borderRadius:8, marginTop:8}}>Clear filter</button>
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
                        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${G0.color}, rgba(var(--${G0.theme}-rgb), 0.25))`,borderRadius:"16px 16px 0 0"}}/>
                        {/* large background icon watermark */}
                        <G0.Icon size={180} strokeWidth={0.7} style={{position:"absolute",bottom:-30,right:-30,color:G0.color,opacity:0.1,transform:"rotate(-15deg)",pointerEvents:"none"}}/>
                        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:32,color:G0.color,lineHeight:1}}>{s0Idx+1}</span>
                            <div style={{width:1,height:28,background:`rgba(var(--${G0.theme}-rgb), 0.2)`}}/>
                            <button onClick={(e) => toggleCheck(e, `${cur.id}-${s0Idx}`)} style={{width:44,height:44,borderRadius:"50%",border:checked[`${cur.id}-${s0Idx}`]?"none":`2px solid var(--dim)`,background:checked[`${cur.id}-${s0Idx}`]?G0.color:"var(--surface)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s",padding:0,marginRight:4}}>
                              {checked[`${cur.id}-${s0Idx}`] && <Check size={16} color="#fff" strokeWidth={3}/>}
                            </button>
                            <span className="pill" style={{color:G0.color,fontSize:10}}><G0.Icon size={12} strokeWidth={2.5}/>{G0.label}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            {s0.urgent&&<span style={{fontSize:10,fontWeight:700,color:"var(--warn-t)",background:"var(--warn-bg)",padding:"4px 8px",borderRadius:4,display:"flex",alignItems:"center",gap:4,letterSpacing:".05em",textTransform:"uppercase",boxShadow:"inset 0 0 0 1px var(--warn-b)"}}><Clock size={10} strokeWidth={3}/>Urgent</span>}
                            {s0.cost&&<span style={{fontSize:12,fontWeight:600,color:free?"var(--free-t)":G0.color,background:free?"var(--free-bg)":`rgba(var(--${G0.theme}-rgb), 0.08)`,padding:"4px 12px",borderRadius:8,boxShadow:`inset 0 0 0 1px ${free?"var(--free-t)":`rgba(var(--${G0.theme}-rgb), 0.2)`}`}}>{s0.cost}</span>}
                          </div>
                        </div>
                        <HeroTitle text={s0.title} checked={checked[`${cur.id}-${s0Idx}`]} />
                        {extractDuration(s0.detail) && (
                          <div style={{marginBottom:10}}>
                            <span className="duration-chip">
                              <Clock size={11} strokeWidth={2.5} />
                              {extractDuration(s0.detail)}
                            </span>
                          </div>
                        )}
                        <div className="hero-detail" style={{display: expanded===s0Idx ? "block" : "none", position:"relative",animation:"fi .2s ease"}}>
                          {s0.warning&&(
                            <div style={{padding:"8px 12px",marginBottom:10,borderRadius:6,background:"var(--warn-bg)",borderLeft:"3px solid var(--warn-b)",display:"flex",alignItems:"flex-start",gap:6}}>
                              <AlertTriangle size={12} strokeWidth={2.5} style={{color:"var(--warn-t)",flexShrink:0,marginTop:1}}/>
                              <span style={{fontSize:12,color:"var(--warn-t)",lineHeight:1.55}}>
                                <TextWithTooltips text={s0.warning} dark={dark} />
                              </span>
                            </div>
                          )}
                          <EnhancedStepDetail step={s0} stepId={`${cur.id}-${s0Idx}`} goalTheme={G0.theme} subChecked={subChecked} toggleSubCheck={toggleSubCheck} dark={dark} />
                        </div>
                        <div className="hero-summary" style={{display: expanded===s0Idx ? "none" : "flex", position:"relative",alignItems:"center",gap:6,color:G0.color,fontSize:12,fontWeight:600}}>
                          Tap to expand <ChevronDown size={13} strokeWidth={2.5} style={{animation:"nudge 2s ease 1.5s infinite"}}/>
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
                            style={{animation:`si .4s cubic-bezier(0.34, 1.56, 0.64, 1) backwards`,animationDelay:`${mappedIdx*40}ms`,borderLeft:`3px solid rgba(var(--${G.theme}-rgb), 0.5)`}}>
                            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:18,color:isOpen?G.color:"var(--dim)",width:24,textAlign:"right",flexShrink:0,lineHeight:1.2,transition:"color .15s"}}>{si+1}</span>
                            <button onClick={(e) => toggleCheck(e, `${cur.id}-${si}`)} style={{flexShrink:0,marginTop:0,width:44,height:44,borderRadius:"50%",border:checked[`${cur.id}-${si}`]?"none":`2px solid var(--dim)`,background:checked[`${cur.id}-${si}`]?G.color:"var(--surface)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all .2s",padding:0}}>
                              {checked[`${cur.id}-${si}`] && <Check size={16} color="#fff" strokeWidth={3}/>}
                            </button>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8}}>
                                <div>
                                  <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap",marginBottom:4}}>
                                    {getActionIcon(step.title, 13) && (
                                      <span style={{color:G.color,display:"flex",alignItems:"center"}}>
                                        {getActionIcon(step.title, 13)}
                                      </span>
                                    )}
                                    <StepTitle text={step.title} checked={checked[`${cur.id}-${si}`]} />
                                    {extractDuration(step.detail) && (
                                      <span className="duration-chip">
                                        <Clock size={11} strokeWidth={2.5} />
                                        {extractDuration(step.detail)}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginTop:8}}>
                                    {step.urgent&&<span style={{fontSize:10,fontWeight:700,color:"var(--warn-t)",background:"var(--warn-bg)",padding:"4px 8px",borderRadius:4,display:"flex",alignItems:"center",gap:4,letterSpacing:".05em",textTransform:"uppercase",boxShadow:"inset 0 0 0 1px var(--warn-b)"}}><Clock size={10} strokeWidth={3}/>Urgent</span>}
                                    <span className="pill" style={{color:G.color}}><G.Icon size={12} strokeWidth={2.5}/>{G.short}</span>
                                    {step.cost&&<span style={{fontSize:10,fontWeight:600,color:free?"var(--free-t)":G.color,background:free?"var(--free-bg)":`rgba(var(--${G.theme}-rgb), 0.07)`,padding:"4px 8px",borderRadius:4,boxShadow:`inset 0 0 0 1px ${free?"var(--free-t)":`rgba(var(--${G.theme}-rgb), 0.2)`}`}}>{step.cost}</span>}
                                    {step.chain&&<span className="pill" style={{color:"var(--gold)",fontSize:10}}><Link2 size={10} strokeWidth={2.5}/>Chain</span>}
                                  </div>
                                </div>
                                <ChevronRight size={13} strokeWidth={2} style={{color:"var(--dim)",flexShrink:0,transform:isOpen?"rotate(90deg)":"none",transition:"transform .2s",marginTop:4}}/>
                              </div>
                              <div className="step-detail" style={{display: isOpen ? "block" : "none", marginTop:12,paddingTop:12,borderTop:"1px solid var(--border-l)",animation:"fi .2s ease"}}>
                                {step.warning&&(
                                  <div style={{padding:"8px 12px",marginBottom:12,borderRadius:8,background:"var(--warn-bg)",borderLeft:"4px solid var(--warn-b)",display:"flex",alignItems:"flex-start",gap:8}}>
                                    <AlertTriangle size={16} strokeWidth={2.5} style={{color:"var(--warn-t)",flexShrink:0,marginTop:2}}/>
                                    <span style={{fontSize:12,color:"var(--warn-t)",lineHeight:1.55}}>
                                      <TextWithTooltips text={step.warning} dark={dark} />
                                    </span>
                                  </div>
                                )}
                                <EnhancedStepDetail step={step} stepId={`${cur.id}-${si}`} goalTheme={G.theme} subChecked={subChecked} toggleSubCheck={toggleSubCheck} dark={dark} />
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
                <button onClick={()=>setPhase(PHASES[idx-1].id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"var(--muted)",fontSize:12,fontWeight:500,fontFamily:"'Open Sans', Helvetica, Arial, sans-serif",minHeight:44}}>
                  <ChevronRight size={16} strokeWidth={2} style={{transform:"rotate(180deg)"}}/> {PHASES[idx-1].label}
                </button>
              ):<div/>}
              {idx<PHASES.length-1&&(
                <button onClick={()=>setPhase(PHASES[idx+1].id)} style={{background:GOAL_COLORS_RAW[PHASES[idx+1].dominant]||"var(--accent)",border:"none",borderRadius:8,padding:"12px 24px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,color:"#fff",fontSize:12,fontWeight:600,fontFamily:"'Open Sans', Helvetica, Arial, sans-serif",transition:"opacity .12s",boxShadow:`0 2px 8px rgba(var(--${GOAL_THEMES[PHASES[idx+1].dominant]||"gold"}-rgb), 0.2)`,minHeight:44}}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  Next: {PHASES[idx+1].label} <ChevronRight size={16} strokeWidth={2}/>
                </button>
              )}
            </div>

          </div>
        </div>
        </div>
      </div>
      </>)}

      {/* FOOTER */}
      <div className="footer">
        <p style={{fontFamily:"'Clash Display',sans-serif",fontSize:16,color:"var(--sub)",lineHeight:1.6}}>
          By the end of this you'll be working, legal, banked, and settled. <span style={{color:"var(--accent)"}}>The life you've been building toward finally exists in the same room.</span>
        </p>
      </div>
    </div>
  );
}