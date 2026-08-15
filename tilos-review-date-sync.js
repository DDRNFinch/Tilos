(function(){
'use strict';
const A=window.TilosAssistant,D=A?.D,S=A?.S;
if(!A||!D||!S)return;
function addTenWeeks(value){
  if(!value)return'';
  const parts=String(value).split('-').map(Number);
  if(parts.length!==3||parts.some(x=>!Number.isFinite(x)))return'';
  const d=new Date(parts[0],parts[1]-1,parts[2],12,0,0,0);
  if(Number.isNaN(d.getTime()))return'';
  d.setDate(d.getDate()+70);
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
const oldNewReview=S.newReview.bind(S);
S.newReview=function(learner){
  const review=oldNewReview(learner);
  review.nextReviewDate=addTenWeeks(review.reviewDate);
  return review;
};
function record(){return A.flow?.kind==='review2'?A.flow.record:null}
function syncReviewDate(input){
  const form=input.closest('form[data-ta-form="review"]');
  if(!form||form.dataset.nextReviewManual==='1')return;
  const next=form.querySelector('[name="nextReviewDate"]');
  if(!next)return;
  const r=record(),oldExpected=addTenWeeks(r?.reviewDate||'');
  if(!next.value||next.value===oldExpected)next.value=addTenWeeks(input.value);
}
D.addEventListener('input',e=>{
  const form=e.target.closest('form[data-ta-form="review"]');
  if(!form)return;
  if(e.target.name==='nextReviewDate'){form.dataset.nextReviewManual='1';return;}
  if(e.target.name==='reviewDate')syncReviewDate(e.target);
},true);
D.addEventListener('change',e=>{
  const form=e.target.closest('form[data-ta-form="review"]');
  if(!form)return;
  if(e.target.name==='nextReviewDate'){form.dataset.nextReviewManual='1';return;}
  if(e.target.name==='reviewDate')syncReviewDate(e.target);
},true);
window.TilosReviewDates={addTenWeeks};
}());
