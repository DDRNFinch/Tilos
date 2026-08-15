(function(){
'use strict';
const A=window.TilosAssistant,app=document.querySelector('#staffApp'),base=window.TilosPageGuidance;if(!A||!base)return;
const g=(title,how,example='')=>({title,how,example});
function special(){const f=A.flow;if(f?.kind==='ov3'){
 const map={
  learner:g('Choose the learner','Search for and select the learner you are assessing. Tilos will use the course attached to that learner for the rest of the observation.','Choose the learner whose work you are physically observing today.'),
  where:g('Observation location','Record where the assessment is actually taking place.','Site, college workshop or employer premises.'),
  task:g('Task being observed','Describe the whole job in normal working language. This gives the observation context before you choose the qualification areas.','Setting out and building a cavity wall section from the supplied drawing.'),
  unit:g('Main assessment area','Choose the course area or NVQ unit that best matches the work being carried out.','For a cavity-wall task, choose the cavity-wall area rather than a general unrelated unit.'),
  skills:g('Select the work covered','Select every planned part of this same piece of work that you genuinely expect to see.','Setting out, constructing the wall, installing components and checking the finished work can sit in one observation when they happen together.'),
  capture:g('Capture evidence','Use Take photos to keep the camera open and take several photographs without leaving the camera. Each shot saves in the background. Record video only where it adds useful evidence.','Take a sequence showing set-out, early courses, cavity components and the finished wall.'),
  'discuss?':g('Professional discussion','Add a discussion when you need to confirm relevant knowledge. Choose Move on when the practical evidence is enough for today.','Ask a short discussion about why cavity components are positioned in a particular way when that knowledge is relevant.'),
  kselect:g('Choose discussion topics','Select only the knowledge that is relevant to the work you have just observed.','Choose drawing interpretation if the learner used and explained the drawing during the task.'),
  question:g('Record the discussion','Use the prompts to ask the learner in their own words. Record the answer so the knowledge evidence is retained with the observation.','Ask the open question first, then use the direct prompt only if you need to clarify the answer.'),
  report:g('Observation report','Check the report Tilos has drafted from the practical areas, photographs, videos and recorded discussion. Keep it factual and no more than 100 words, then choose Competent or Needs more training.','The learner set out and built the wall to line and level, with photographs showing the work at key stages. The recorded discussion confirmed their understanding of the relevant cavity components.'),
  sign:g('Assessor sign-off','Check the mapping, observation report and assessment decision before signing. Your signature confirms that the record reflects what you assessed.','If the report or decision is not right, use the back arrow and correct it before signing.')
 };return map[f.p]||null}
 if(app?.querySelector('.p33-planner'))return g('Planning','Select a day to see its agenda. Add reviews, observations, visits or other activity, and use the week arrows to plan ahead.','Book the learner’s review on the agreed date and add a short preparation note if useful.');
 if(app?.querySelector('.p33-plan-form'))return g('Add to planning','Enter the date as dd/mm/yyyy, choose the learner and activity, then set the time and expected duration.','23/10/2026 · Learner review · 09:30 · 1 hour.');
 return null}
function current(){return special()||base.current?.()||null}
function show(x=current()){return base.show?.(x)||false}
window.addEventListener('tilos-face-help-request',e=>{const x=special();if(!x)return;e.stopPropagation();e.stopImmediatePropagation();show(x)},true);
window.TilosPageGuidance={...base,current,show};
}());
