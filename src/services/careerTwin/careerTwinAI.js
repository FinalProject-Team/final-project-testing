/**
 * careerTwinAI.js — FREE AI for Career Twin
 * 
 * Priority: Gemini (free) → OpenRouter (free) → Rule-based fallback
 * 
 * Add ONE key to .env (both are free, no credit card):
 *   VITE_GEMINI_API_KEY  → https://aistudio.google.com/app/apikey  (recommended)
 *   VITE_OPENROUTER_KEY  → https://openrouter.ai
 */

async function callGemini(prompt) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) throw new Error('no_key');
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ contents:[{parts:[{text:prompt}]}], generationConfig:{temperature:0.7,maxOutputTokens:1800} }) }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const d = await res.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function callOpenRouter(prompt) {
  const key = import.meta.env.VITE_OPENROUTER_KEY;
  if (!key) throw new Error('no_key');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`,'HTTP-Referer':window.location.origin},
    body: JSON.stringify({ model:'mistralai/mistral-7b-instruct:free', max_tokens:1800, messages:[{role:'user',content:prompt}] })
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const d = await res.json();
  return d.choices?.[0]?.message?.content ?? '';
}

async function callAI(prompt) {
  if (import.meta.env.VITE_GEMINI_API_KEY) {
    try { return await callGemini(prompt); } catch(e) {
      if (!import.meta.env.VITE_OPENROUTER_KEY) throw e;
    }
  }
  if (import.meta.env.VITE_OPENROUTER_KEY) return await callOpenRouter(prompt);
  throw new Error('no_key');
}

function extractJSON(text) {
  const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
  const s = clean.indexOf('{'), e = clean.lastIndexOf('}');
  if (s<0||e<0) throw new Error('No JSON');
  return JSON.parse(clean.slice(s,e+1));
}

// ── Rule-based fallback (always works) ────────────────────────────────────────
function localFallback(profile) {
  const { track='Frontend Development', progressPct=0, currentSkills=[] } = profile;
  const pct = Number(progressPct)||0;

  const tracks = {
    'Frontend Development': {
      now:['HTML','CSS','JavaScript','Git'],
      mid:['React','TypeScript','Tailwind CSS','REST APIs'],
      full:['Next.js','GraphQL','Testing','CI/CD'],
      jobs:[
        {title:'Junior Frontend Developer',icon:'💻',company:'Startups & Agencies',salary:'8K–14K EGP',match:'88%'},
        {title:'React Developer',icon:'⚛️',company:'Tech Companies',salary:'12K–20K EGP',match:'82%'},
        {title:'Frontend Intern',icon:'🎓',company:'Any Tech Company',salary:'3K–6K EGP',match:'95%'},
        {title:'Freelance Frontend Dev',icon:'🌐',company:'Upwork / Fiverr',salary:'$15–40/hr',match:'72%'},
      ],
      salary:{now:'4K–8K EGP',atFifty:'10K–18K EGP',atFull:'18K–35K EGP',remote:'$1,500–4,000/mo'},
      advice:['Master CSS Flexbox/Grid — tested in every frontend interview','Build 3 complete React projects before applying','Learn TypeScript — required in 60% of Frontend job listings','Push every project to GitHub with live demo links','Apply for internships at 40%+ progress'],
    },
    'Backend Development': {
      now:['Python/Node.js basics','REST','Git'],
      mid:['Express.js','PostgreSQL','JWT Auth','Docker'],
      full:['Microservices','Redis','AWS','System Design'],
      jobs:[
        {title:'Junior Backend Developer',icon:'⚙️',company:'Product Companies',salary:'10K–18K EGP',match:'85%'},
        {title:'Node.js Developer',icon:'🖥️',company:'Startups',salary:'12K–22K EGP',match:'79%'},
        {title:'API Developer',icon:'🔌',company:'SaaS Companies',salary:'10K–18K EGP',match:'74%'},
        {title:'Backend Intern',icon:'🎓',company:'Any Tech Company',salary:'3K–7K EGP',match:'93%'},
      ],
      salary:{now:'5K–9K EGP',atFifty:'12K–22K EGP',atFull:'22K–40K EGP',remote:'$2,000–5,000/mo'},
      advice:['Build a REST API with authentication as portfolio','Learn SQL deeply — most backend interviews test DB design','Deploy something to Railway or Render','Study HTTP status codes and REST principles','Learn Docker basics before mid-level applications'],
    },
    'Full-Stack': {
      now:['HTML','CSS','JavaScript','Node.js basics'],
      mid:['React','Express','MongoDB','REST APIs'],
      full:['TypeScript','Docker','AWS','System Design'],
      jobs:[
        {title:'Junior Full-Stack Developer',icon:'🔄',company:'Startups',salary:'12K–22K EGP',match:'87%'},
        {title:'MERN Developer',icon:'💻',company:'Tech Companies',salary:'15K–28K EGP',match:'80%'},
        {title:'Freelance Developer',icon:'🌐',company:'Upwork',salary:'$20–50/hr',match:'73%'},
        {title:'Full-Stack Intern',icon:'🎓',company:'Any Tech Company',salary:'4K–8K EGP',match:'92%'},
      ],
      salary:{now:'5K–10K EGP',atFifty:'14K–25K EGP',atFull:'25K–48K EGP',remote:'$2,500–6,000/mo'},
      advice:['Deploy a full-stack project (frontend + backend + DB)','Learn Docker — major salary leverage','Contribute to 1 open-source project on GitHub','Practice system design basics','Build one freelance project for real client experience'],
    },
  };

  const key = Object.keys(tracks).find(k=>track.toLowerCase().includes(k.split(' ')[0].toLowerCase()))||'Frontend Development';
  const d = tracks[key];
  const nowSkills = currentSkills.length ? currentSkills : d.now.slice(0,Math.max(2,Math.ceil(pct/20)));

  const msg = pct<30
    ? `You're ${pct}% into your ${track} journey — every expert started exactly where you are. Complete the next 20% and you'll have enough skills for your first internship.`
    : pct<60
    ? `At ${pct}% you've passed the point where most learners quit. The next 25% unlocks skills that separate junior from mid-level salaries.`
    : pct<90
    ? `You're ${pct}% through your ${track} course — start applying for junior roles now, you already have enough for your first interview.`
    : `At ${pct}% you're in the top 5% who make it this far. Update your LinkedIn, polish your GitHub, and start applying this week.`;

  return {
    skills:{ current:nowSkills, atFifty:[...nowSkills,...d.mid].slice(0,8), atHundred:[...nowSkills,...d.mid,...d.full] },
    careers:d.jobs, salary:d.salary, advice:d.advice, futureMsg:msg, source:'local',
  };
}

function buildPrompt(p) {
  return `Career coach AI. Student studies ${p.track} via "${p.courseName}". Progress: ${p.progressPct}% (${p.completedLessons}/${p.totalLessons} lessons). Skills: ${(p.currentSkills||[]).join(', ')||'basics'}.

Return ONLY valid JSON (no markdown):
{"skills":{"current":["..."],"atFifty":["..."],"atHundred":["..."]},"careers":[{"title":"...","icon":"💻","company":"...","salary":"X–Y EGP","match":"XX%"}],"salary":{"now":"X–Y EGP","atFifty":"X–Y EGP","atFull":"X–Y EGP","remote":"$X–Y/mo"},"advice":["tip1","tip2","tip3","tip4","tip5"],"futureMsg":"2-3 sentence message mentioning ${p.progressPct}% and ${p.track}"}
Rules: 4 career options inc internship+freelance. Salaries in EGP. Advice specific to ${p.track} at ${p.progressPct}%.`;
}

let _cache=null,_key=null;
export async function analyzeStudentProgress(profile) {
  const k=JSON.stringify(profile);
  if(_cache&&_key===k) return _cache;
  if(import.meta.env.VITE_GEMINI_API_KEY||import.meta.env.VITE_OPENROUTER_KEY){
    try{
      const text=await callAI(buildPrompt(profile));
      const parsed=extractJSON(text);
      _cache={...parsed,source:import.meta.env.VITE_GEMINI_API_KEY?'gemini':'openrouter'};
      _key=k; return _cache;
    }catch(e){console.warn('AI fallback:',e.message);}
  }
  _cache=localFallback(profile); _key=k; return _cache;
}
