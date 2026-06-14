/**
 * useCareerTwin — fetches real student data from API then runs AI analysis
 * APIs: getStudentProfile, getStudentProgress, getStudentStats, getStudentRoadmap
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { analyzeStudentProgress } from '../services/careerTwin/careerTwinAI';
import { 
  getStudentProfile, 
  getStudentProgress, 
  getStudentStats, 
  getStudentRoadmap 
} from '../services/careerTwin/careerTwinService';

const TRACK_MAP=[
  {kw:['frontend','react','vue','angular','css','html','next'],t:'Frontend Development'},
  {kw:['backend','node','express','django','laravel'],t:'Backend Development'},
  {kw:['full stack','fullstack','mern','mean'],t:'Full-Stack'},
  {kw:['ui','ux','figma','design'],t:'UI/UX Design'},
  {kw:['data science','pandas','numpy'],t:'Data Science'},
  {kw:['machine learning','deep learning','ai','nlp'],t:'AI / Machine Learning'},
  {kw:['devops','docker','kubernetes','cloud'],t:'DevOps / Cloud'},
  {kw:['mobile','flutter','react native'],t:'Mobile Development'},
  {kw:['cyber','security'],t:'Cybersecurity'},
];
function detectTrack(title='',roadmap=''){
  const txt=`${title} ${roadmap}`.toLowerCase();
  for(const{kw,t}of TRACK_MAP)if(kw.some(k=>txt.includes(k)))return t;
  return 'Full-Stack';
}
const SKILL_TOKENS=['html','css','javascript','typescript','react','vue','angular','next.js','node','express','graphql','rest','sql','postgresql','mongodb','redis','docker','git','python','pandas','numpy','figma','tailwind'];
function extractSkills(lessons=[]){
  const found=new Set();
  lessons.forEach(l=>{const t=(l.title||l.name||'').toLowerCase();SKILL_TOKENS.forEach(s=>{if(t.includes(s))found.add(s.toUpperCase());});});
  return[...found];
}

export function useCareerTwin(){
  const[state,setState]=useState({loading:true,error:null,profile:null,prediction:null,source:null});
  const mounted=useRef(true);

  const load=useCallback(async()=>{
    setState(s=>({...s,loading:true,error:null}));
    mounted.current=true;
    try{
      const[meR,progR,statsR,roadR]=await Promise.allSettled([getStudentProfile(),getStudentProgress(),getStudentStats(),getStudentRoadmap()]);
      if(!mounted.current)return;

      const me=meR.status==='fulfilled'?(meR.value?.user||meR.value):{};
      const prog=progR.status==='fulfilled'?progR.value:{};
      const stats=statsR.status==='fulfilled'?statsR.value:{};
      const roadmap=roadR.status==='fulfilled'?roadR.value:{};

      const enrollments=Array.isArray(prog)?prog:prog?.enrollments||prog?.courses||[];
      const course=enrollments[0]||{};
      const courseName=course.title||course.course_title||'Tech Course';
      const progressPct=Math.round(course.progress_percentage??stats?.courses?.completion_percentage??stats?.overall_progress??0);
      const completedLessons=course.completed_lessons??stats?.lessons?.done??0;
      const totalLessons=course.total_lessons??stats?.lessons?.total??0;
      const lessons=course.lessons||prog?.completed_lessons||[];

      const track=detectTrack(courseName,roadmap?.track||'');
      const extracted=extractSkills(Array.isArray(lessons)?lessons:[]);
      const currentSkills=extracted.length?extracted:(Array.isArray(me?.skills)?me.skills:[]);

      const studentProfile={
        name:me?.full_name||me?.name||me?.email?.split('@')[0]||'Student',
        email:me?.email||'',courseName,track,progressPct,completedLessons,totalLessons,currentSkills,
        xp:stats?.xp?.total||me?.xp||0,streak:stats?.streak?.days||0,
      };

      const prediction=await analyzeStudentProgress(studentProfile);
      if(!mounted.current)return;
      setState({loading:false,error:null,profile:studentProfile,prediction,source:prediction.source});
    }catch(err){
      if(!mounted.current)return;
      setState(s=>({...s,loading:false,error:err.message}));
    }
  },[]);

  useEffect(()=>{mounted.current=true;load();return()=>{mounted.current=false;};},[load]);
  return{...state,reload:load};
}
