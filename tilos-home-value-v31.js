(function(){
'use strict';
const S=window.TilosStaffStore,T=window.TilosCourses,A=window.TilosAssistant,app=document.querySelector('#staffApp');
if(!S||!A||!app)return;
const PLAN='tilosPlanning:v1';
const esc=A.esc,attr=A.attr,today=()=>S.today?.()||new Date().toISOString().slice(0,10);
const parse=v=>v?new Date(`${String(v).slice(0,10)}T12:00:00`):null;
const fmtDate=v=>{const d=parse(v);return d&&!Number.isNaN(d.getTime())?d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}):'Not set'};
const fmtTime=v=>String(v||'').slice(0,5)||'Any time';
const active=()=>S.learners().filter(l=>l.status==='Active');
const latest=l=>S.reviews(l.id).find(r=>r.status==='Completed')||null;
const plans=()=>{try{const x=JSON.parse(localStorage.getItem(PLAN)||'[]');return Array.isArray(x)?x:[]}catch(_){return[]}};
const plannedReview=l=>plans().filter(x=>x.learnerId===l.id&&/^review$/i.test(String(x.type||''))&&x.date>=today()).sort((a,b)=>String(a.date).localeCompare(String(b.date)))[0]||null;
const valid=v=>v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v));
function health(){
 const rows=active(),n=rows.length;if(!n)return{n:0,track:0,reviews:0,portfolio:0,learning:0};
 let track=0,reviews=0,portfolio=0,learning=0;
 for(const l of rows){const r=latest(l),j=r?.assessor?.judgement||'',s=r?.portfolioSnapshot,p=s?.progress||{};
  if(j==='On track'||j==='Ahead of plan')track++;
  if(plannedReview(l))reviews++;
  if(valid(p.qualification)&&valid(p.time)&&Number(p.qualification)>=Number(p.time)-10)portfolio++;
  if(valid(p.guided)&&valid(p.time)&&Number(p.guided)>=Number(p.time)-10)learning++;
 }
 const pct=x=>Math.round(x/n*100);return{n,track:pct(track),reviews:pct(reviews),portfolio:pct(portfolio),learning:pct(learning)};
}
function arch(label,value,key){return`<button class="vh-arch" type="button" data-vh-metric="${key}" aria-label="Open ${label.toLowerCase()} summary"><strong>${label}</strong><svg viewBox="0 0 80 43" aria-hidden="true"><path class="vh-track" d="M8 39 A32 32 0 0 1 72 39"/><path class="vh-value" pathLength="100" style="stroke-dasharray:${value} 100" d="M8 39 A32 32 0 0 1 72 39"/></svg><span>${value}%</span></button>`}
function todaySummary(){const rows=plans().filter(x=>x.date===today()).sort((a,b)=>String(a.time||'99:99').localeCompare(String(b.time||'99:99'))),now=new Date().toTimeString().slice(0,5),next=rows.find(x=>!x.time||x.time>=now)||rows[0]||null;if(!next)return{title:'Plan my day',sub:'Nothing booked yet'};const l=next.learnerId?S.learner(next.learnerId):null;return{title:`${fmtTime(next.time)} · ${l?.name||next.type||'Planned item'}`,sub:`${next.type||'Appointment'} · ${rows.length} item${rows.length===1?'':'s'} today`}}
function render(force=false){
 if(!force&&app.children.length&&!app.querySelector(':scope > .pa-home,:scope > .staff-stats,:scope > .selected-learner'))return;
 const m=health();app.dataset.vhRendering='1';
 app.innerHTML=`<section class="assessor-value-home" aria-label="Assessor overview"><div class="vh-arches">${arch('TRACK',m.track,'track')}${arch('REVIEWS',m.reviews,'reviews')}${arch('PORTFOLIO',m.portfolio,'portfolio')}${arch('LEARNING',m.learning,'learning')}</div></section>`;
 delete app.dataset.vhRendering;
}
function reasons(key){const out=[];for(const l of active()){const r=latest(l),s=r?.portfolioSnapshot,p=s?.progress||{};let reason='';
  if(key==='track'){const j=r?.assessor?.judgement||'';if(j!=='On track'&&j!=='Ahead of plan')reason=!r?'No completed review':j||'No current progress judgement';}
  if(key==='reviews'){const p=plannedReview(l);if(!p){if(!r)reason='No completed review or upcoming booking';else if(r.nextReviewDate&&r.nextReviewDate<today())reason=`Overdue · ${fmtDate(r.nextReviewDate)}`;else if(r.nextReviewDate)reason=`Due ${fmtDate(r.nextReviewDate)} · not booked`;else reason='No upcoming review booked';}}
  if(key==='portfolio'){if(!s)reason='No Evia portfolio snapshot yet';else if(!valid(p.qualification)||!valid(p.time))reason='Portfolio or time progress is missing';else if(Number(p.qualification)<Number(p.time)-10)reason=`Portfolio ${Number(p.qualification)}% · time ${Number(p.time)}%`;}
  if(key==='learning'){if(!s)reason='No Evia portfolio snapshot yet';else if(!valid(p.guided)||!valid(p.time))reason=`${T?.isNVQ?.(l)?'GLH':'OTJ'} or time progress is missing`;else if(Number(p.guided)<Number(p.time)-10)reason=`${T?.isNVQ?.(l)?'GLH':'OTJ'} ${Number(p.guided)}% · time ${Number(p.time)}%`;}
  if(reason)out.push({l,reason});
 }return out;
}
function metricDetail(key){const m=health(),labels={track:['Track',m.track,'Learners without a current On track/Ahead judgement are shown first.'],reviews:['Reviews',m.reviews,'Learners without an upcoming review booking are shown first.'],portfolio:['Portfolio',m.portfolio,'Learners whose latest Evia portfolio snapshot is more than 10 points behind time on programme are shown.'],learning:['Learning',m.learning,'Learners whose OTJ/GLH progress is more than 10 points behind time on programme are shown.']},x=labels[key]||labels.track,rows=reasons(key);A.open();A.flow={kind:'homeMetric',metric:key};A.copy(`${x[1]}% ${x[0].toLowerCase()} health`,x[2]);A.D.innerHTML=`<div class="ta-card vh-list">${rows.length?rows.map(({l,reason})=>`<button type="button" data-vh-learner="${attr(l.id)}"><span><strong>${esc(l.name)}</strong><small>${esc(reason)}</small><em>${esc(A.course(l))}</em></span><b>›</b></button>`).join(''):'<p>No learners are currently flagged in this area.</p>'}</div>`}
if(!document.querySelector('#vh-style')){const s=document.createElement('style');s.id='vh-style';s.textContent=`.assessor-value-home{display:grid;gap:18px}.vh-arches{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding:0 2px}.vh-arch{border:0;background:transparent;padding:2px 0;color:#1b252b;display:grid;place-items:center;font:inherit}.vh-arch strong{font-size:9px;letter-spacing:.07em;color:#68757b}.vh-arch svg{width:68px;height:39px;overflow:visible}.vh-track,.vh-value{fill:none;stroke-width:5;stroke-linecap:round}.vh-track{stroke:#e5ecef}.vh-value{stroke:#59bde7}.vh-arch span{font-size:15px;font-weight:850;margin-top:-8px}.vh-today{width:100%;border:1px solid #dce7eb;border-radius:20px;background:#fff;padding:17px 16px;display:flex;align-items:center;justify-content:space-between;text-align:left;color:#172127;box-shadow:0 8px 24px #183f500d}.vh-today span{display:grid;gap:2px}.vh-today small{font-size:9px;font-weight:850;letter-spacing:.09em;color:#3598c0}.vh-today strong{font-size:18px}.vh-today em{font-size:11px;color:#778187;font-style:normal}.vh-today>b{font-size:28px;color:#59bde7}.vh-list{padding:8px!important;gap:6px!important}.vh-list button{width:100%;min-height:62px;border:1px solid #e1e7e9;border-radius:14px;background:#fff;color:#162027;padding:10px 11px;text-align:left;display:flex;align-items:center;justify-content:space-between;gap:10px;font:inherit}.vh-list button>span{display:grid;gap:2px}.vh-list strong{font-size:12px}.vh-list small{font-size:10px;color:#68767c}.vh-list em{font-size:9px;color:#2d88aa;font-style:normal}.vh-list button>b{font-size:20px;color:#59bde7}@media(max-width:430px){.vh-arches{gap:1px}.vh-arch svg{width:61px}}`;document.head.appendChild(s)}
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.vhMetric){e.preventDefault();e.stopImmediatePropagation();metricDetail(b.dataset.vhMetric)}},true);
A.D.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.vhLearner){e.preventDefault();e.stopImmediatePropagation();const l=S.learner(b.dataset.vhLearner);if(l)A.selected(l)}else if(b.hasAttribute('data-vh-assistant')){e.preventDefault();e.stopImmediatePropagation();window.TilosAssistantHome?.menu?.()||A.menu?.()}},true);
let queued=false;new MutationObserver(()=>{if(app.dataset.vhRendering||queued)return;const old=app.querySelector(':scope > .pa-home,:scope > .staff-stats,:scope > .selected-learner');if(!app.children.length||old){queued=true;queueMicrotask(()=>{queued=false;render(true)})}}).observe(app,{childList:true});
document.addEventListener('tilos-planning-changed',()=>{if(app.querySelector('.assessor-value-home'))render(true)});
setTimeout(()=>render(false),0);
window.TilosValueHome={render,health,reasons};
}());
