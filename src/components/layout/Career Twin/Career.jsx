// ✅ AI-POWERED Career Twin
// Uses: apiGetMe, apiGetMyProgress, apiGetDashboardStats, apiGetRoadmap
// AI: Google Gemini (free) → OpenRouter (free) → Smart rule-based fallback
// Add VITE_GEMINI_API_KEY to .env — free key: https://aistudio.google.com/app/apikey
import { useState } from 'react';
import { useCareerTwin } from '../../../hooks/useCareerTwin';
import styles from './Career.module.css';

function SourceBadge({ source }) {
  const m={gemini:{l:'Google Gemini AI',c:'#10b981'},openrouter:{l:'OpenRouter AI',c:'#8b5cf6'},local:{l:'Smart Predictions',c:'#f59e0b'}};
  const{l,c}=m[source]||m.local;
  return <span style={{fontSize:'10px',color:c,background:`${c}18`,padding:'2px 8px',borderRadius:'20px',fontWeight:600}}>⚡ {l}</span>;
}

function Skeleton() {
  const p={background:'linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.4s ease-in-out infinite',borderRadius:'8px'};
  return(
    <div className={styles.careerWrapper}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div className={styles.centerContent}>
        <div className={styles.profileBanner}>
          <div className={styles.profileLeft}>
            <div style={{...p,width:56,height:56,borderRadius:'50%',flexShrink:0}}/>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <div style={{...p,width:140,height:10}}/><div style={{...p,width:200,height:18}}/><div style={{...p,width:260,height:12}}/>
            </div>
          </div>
        </div>
        {[1,2,3].map(i=><div key={i} className={styles.journeySection} style={{padding:'24px',gap:'12px',display:'flex',flexDirection:'column'}}><div style={{...p,width:'45%',height:16}}/><div style={{...p,width:'100%',height:12}}/><div style={{...p,width:'80%',height:12}}/></div>)}
      </div>
    </div>
  );
}

function SkillsCard({skills,pct}){
  const[tab,setTab]=useState('now');
  const shown=tab==='now'?skills.current:tab==='mid'?skills.atFifty:skills.atHundred;
  return(
    <div className={styles.innerCard}>
      <h4>🔧 Skills Evolution</h4>
      <div className={styles.miniTabs} style={{marginBottom:'14px'}}>
        {[{k:'now',l:'Current'},{k:'mid',l:'At 50%'},{k:'full',l:'At 100%'}].map(({k,l})=>(
          <span key={k} className={tab===k?styles.tabItemActive:styles.tabItem} onClick={()=>setTab(k)} style={{cursor:'pointer'}}>{l}</span>
        ))}
      </div>
      <p className={styles.sectionSectionTitle}>{tab==='now'?'Skills You Have Now':tab==='mid'?'Predicted at 50% Completion':'Full Skill Set at 100%'}</p>
      <div className={styles.tagGroup}>
        {(shown||[]).map((s,i)=><span key={i} className={tab==='now'?styles.tagActive:styles.tagLock}>{tab!=='now'?'+ ':''}{s}</span>)}
        {(!shown||!shown.length)&&<span style={{fontSize:'12px',color:'#525f77'}}>Keep learning to unlock skills!</span>}
      </div>
      {tab!=='now'&&<p style={{fontSize:'11px',color:'#525f77',marginTop:'10px',marginBottom:0}}>{tab==='mid'?`Unlock at 50% (you're at ${pct}%)`:'Complete the full course to unlock all skills'}</p>}
    </div>
  );
}

export default function Career() {
  const { loading, error, profile, prediction, source, reload } = useCareerTwin();

  if (loading) return <Skeleton />;

  if (error && !prediction) return (
    <div className={styles.careerWrapper}>
      <div className={styles.centerContent}>
        <div className={styles.journeySection} style={{alignItems:'center',padding:'40px',gap:'16px',display:'flex',flexDirection:'column'}}>
          <div style={{fontSize:'36px'}}>⚠️</div>
          <h3 style={{color:'#f87171',fontSize:'16px',fontWeight:600}}>Failed to load career data</h3>
          <p style={{color:'#8a94a6',fontSize:'13px',textAlign:'center',lineHeight:1.6}}>{error}</p>
          <button className={styles.actionBtn} onClick={reload}>Try Again</button>
        </div>
      </div>
    </div>
  );

  const { skills, careers, salary, advice, futureMsg } = prediction;
  const pct  = profile?.progressPct ?? 0;
  const name = profile?.name ?? 'Student';

  return (
    <div className={styles.careerWrapper}>
    <div className={styles.centerContent}>

      {/* Profile Banner */}
      <div className={styles.profileBanner}>
        <div className={styles.profileLeft}>
          <div className={styles.avatarWrapper}>
            <div className={styles.iconCircle} style={{width:56,height:56,fontSize:22,background:'rgba(0,229,255,0.1)',border:'2px solid rgba(0,229,255,0.3)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>🧠</div>
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.aiBadge}>AI Career Simulation &nbsp;·&nbsp; <SourceBadge source={source}/></span>
            <h2>Meet Your Career Twin</h2>
            <p>Based on <strong style={{color:'#fff'}}>{profile?.courseName||'your course'}</strong> · {pct}% complete · {profile?.completedLessons||0} lessons done</p>
          </div>
        </div>
        <div style={{textAlign:'right'}}>
          <span className={styles.salaryAmount}>{pct}%</span>
          <span className={styles.salarySubText}>Course Progress</span>
        </div>
      </div>

      {/* Salary Timeline */}
      <div className={styles.journeySection}>
        <h3>💰 Salary Prediction Timeline</h3>
        <div className={styles.timelineRow}>
          <div className={styles.timelineCard}>
            <div className={styles.iconCircle}>🎓</div>
            <span className={styles.activeTimeLabel}>Now</span>
            <p className={styles.roleLabel}>Current Level</p>
            <span className={styles.salaryLabel}>{salary.now}</span>
          </div>
          <div className={styles.arrowConnector}>›</div>
          <div className={styles.timelineCard}>
            <div className={styles.iconCircle}>📈</div>
            <span className={styles.timeLabel}>At 50%</span>
            <p className={styles.roleLabel}>Growing</p>
            <span className={styles.salaryLabel}>{salary.atFifty}</span>
          </div>
          <div className={styles.arrowConnector}>›</div>
          <div className={`${styles.timelineCard} ${styles.starCard}`}>
            <div className={styles.iconCircle}>⭐</div>
            <span className={styles.starTimeLabel}>Course Done</span>
            <p className={styles.roleLabel}>Job-Ready</p>
            <span className={styles.salaryLabel}>{salary.atFull}</span>
          </div>
          <div className={styles.arrowConnector}>›</div>
          <div className={styles.timelineCard}>
            <div className={styles.iconCircle}>🌍</div>
            <span className={styles.timeLabel}>Remote</span>
            <p className={styles.roleLabel}>Global Market</p>
            <span className={styles.salaryLabel}>{salary.remote}</span>
          </div>
        </div>
      </div>

      {/* Skills + AI Prediction */}
      <div className={styles.splitGrid}>
        <SkillsCard skills={skills} pct={pct}/>
        <div className={styles.innerCard}>
          <h4>AI Career Prediction</h4>
          <div className={styles.predictionList}>
            {(careers||[]).map((job,i)=>(
              <div key={i} className={styles.predictRow}>
                <div className={styles.percentBox} style={{fontSize:'16px',borderColor:['#00e5ff','#10b981','#8b5cf6','#f59e0b'][i%4],color:['#00e5ff','#10b981','#8b5cf6','#f59e0b'][i%4]}}>{job.icon||'💼'}</div>
                <div className={styles.percentTextBox}>
                  <h5>{job.title}</h5>
                  <p>{job.company} · {job.salary} · <span style={{color:'#10b981'}}>{job.match}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Timeline */}
      <p className={styles.timelineTitle}>Jobs Available After Next Milestone</p>
      <div className={styles.jobContainer}>
        {(careers||[]).map((job,i)=>(
          <div key={i} className={styles.jobItemCard}>
            <div className={styles.jobCardLeft}>
              <div className={styles.buildingIcon}>{job.icon||'🏢'}</div>
              <div className={styles.jobMetaText}><h5>{job.title}</h5><p>{job.company}</p></div>
            </div>
            <div className={styles.jobCardRight}>
              <span className={styles.jobCardSalary}>{job.salary}</span>
              <span className={styles.jobCardMatch}>{job.match}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Coach */}
      <div className={styles.innerCard} style={{marginTop:'20px'}}>
        <h4>🤖 AI Career Coach</h4>
        <div className={styles.predictionList}>
          {(advice||[]).map((tip,i)=>(
            <div key={i} className={styles.predictRow}>
              <div className={styles.percentBox} style={{color:['#00e5ff','#10b981','#8b5cf6','#f59e0b','#f87171'][i%5],borderColor:['#00e5ff','#10b981','#8b5cf6','#f59e0b','#f87171'][i%5],fontSize:'14px'}}>{['💡','📌','🎯','🔑','⚡'][i%5]}</div>
              <div className={styles.percentTextBox}><p style={{fontSize:'12px',color:'#c9d5e8',margin:0,lineHeight:1.55}}>{tip}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Future Self Message */}
      <div className={styles.actionBanner}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
          <div style={{width:40,height:40,fontSize:18,flexShrink:0,background:'rgba(0,229,255,0.1)',border:'1px solid rgba(0,229,255,0.2)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>🔮</div>
          <div style={{textAlign:'left'}}>
            <p style={{margin:0,fontSize:'11px',color:'#525f77',textTransform:'uppercase',letterSpacing:'0.5px'}}>Message from your Future Self</p>
            <p style={{margin:'2px 0 0',fontSize:'12px',color:'#00e5ff',fontWeight:600}}>{name} · {pct}% there</p>
          </div>
        </div>
        <p style={{fontSize:'13px',lineHeight:1.65,color:'#c9d5e8',textAlign:'left',fontStyle:'italic',margin:'0 0 16px'}}>"{futureMsg}"</p>
        <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
          <button className={styles.actionBtn} onClick={()=>window.location.href='/dashboard/roadmap'}>View My Roadmap →</button>
          <button onClick={reload} style={{background:'transparent',border:'1px solid rgba(0,229,255,0.3)',color:'#00e5ff',padding:'10px 20px',borderRadius:'8px',fontWeight:600,fontSize:'13px',cursor:'pointer'}}>↺ Re-analyze</button>
        </div>
      </div>

    </div>
    </div>
  );
}
