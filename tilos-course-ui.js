(function(){
'use strict';
const S=window.TilosStaffStore,T=window.TilosCourses,app=document.querySelector('#staffApp');
if(!S||!T||!app)return;
let scheduled=false,refreshing=false;
function text(el,value){if(el&&el.textContent!==value)el.textContent=value}
function html(el,value){if(el&&el.innerHTML!==value)el.innerHTML=value}
function coverage(l){try{return T.coverage(l,S.observations(l.id))||{percent:0,count:0,total:0,label:T.isNVQ(l)?'AC coverage':'KSB coverage'}}catch(error){console.error('Andros coverage failed',error);return{percent:0,count:0,total:0,label:T.isNVQ(l)?'AC coverage':'KSB coverage'}}}
function refresh(){
  if(refreshing)return;
  refreshing=true;
  try{
    app.querySelectorAll('[data-open-learner]').forEach(row=>{
      const l=S.learner(row.dataset.openLearner),small=row.querySelector('small'),mini=row.querySelector('.mini-progress');
      if(!l)return;
      text(small,`${l.employer||'Employer not recorded'} · ${T.label(l)}`);
      const c=coverage(l);
      if(mini){text(mini.querySelector('b'),`${c.percent}%`);text(mini.querySelector('small'),T.isNVQ(l)?'AC':'KSB')}
    });
    const selected=app.querySelector('.selected-learner[data-learner]');
    if(selected){
      const l=S.learner(selected.dataset.learner),em=selected.querySelector('em');
      if(l){const c=coverage(l);text(em,`${l.employer||'Employer not recorded'} · ${T.label(l)} · ${c.percent}% ${c.label}`)}
    }
    const form=app.querySelector('#learnerForm'),id=form?.querySelector('input[name="id"]')?.value,l=id?S.learner(id):null,lock=form?.querySelector('.course-lock');
    if(l&&lock)html(lock,`<small>COURSE</small><strong>${T.label(l)}</strong><span>${T.longLabel(l)}</span>`);
    const hero=app.querySelector('.learner-hero');
    if(hero){
      const lid=app.querySelector('[data-new-observation]')?.dataset.newObservation||S.selectedLearnerId(),learner=lid?S.learner(lid):null;
      if(learner){
        const c=coverage(learner),copy=hero.querySelector('div');
        if(copy){text(copy.querySelector('strong'),`${c.percent}%`);text(copy.querySelector('span'),`${c.label} · ${c.count}/${c.total}`)}
        text(app.querySelector('.staff-page-head small'),T.longLabel(learner));
        const grid=app.querySelector('.ksb-progress-grid');
        if(grid&&T.isNVQ(learner))html(grid,`<div style="grid-column:1/-1"><b>AC</b><strong>${c.percent}%</strong><small>${c.count}/${c.total}</small><i><span style="width:${c.percent}%"></span></i></div>`);
      }
    }
    app.querySelectorAll('[data-pdf-observation]').forEach(pdf=>{
      const box=pdf.parentElement,id=pdf.dataset.pdfObservation;
      if(box&&id&&!box.querySelector('[data-observation-pack]')){
        const b=document.createElement('button');b.type='button';b.dataset.observationPack=id;b.textContent='ZIP';box.insertBefore(b,pdf);
      }
    });
  }catch(error){console.error('Andros course UI refresh failed',error)}finally{refreshing=false}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh()})}
app.addEventListener('click',event=>{
  const b=event.target.closest('button,[data-view]');
  if(!b)return;
  if(b.hasAttribute('data-observation-pack'))return;
  schedule();
});
app.addEventListener('submit',schedule);
app.addEventListener('change',schedule);
app.addEventListener('click',async event=>{
  const b=event.target.closest('[data-observation-pack]');if(!b)return;
  event.preventDefault();event.stopImmediatePropagation();
  const o=S.observation(b.dataset.observationPack),l=o?S.learner(o.learnerId):null;
  if(!o||!l||!window.TilosObservationPack)return;
  b.disabled=true;const old=b.textContent;b.textContent='Building…';
  try{await window.TilosObservationPack.download(o,l,S.profile())}catch(error){console.error('Observation pack failed',error)}finally{b.disabled=false;b.textContent=old}
},true);
refresh();
window.TilosCourseUI={refresh,schedule};
}());