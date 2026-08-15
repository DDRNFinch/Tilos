(function(){
'use strict';
const A=window.TilosAssistant,S=window.TilosStaffStore,P=window.TilosPlanningV33;
if(!A||!S||!P)return;
const today=()=>S.today?.()||new Date().toISOString().slice(0,10);
function key(id){return`review-next:${id}`}
function syncReview(r,l){if(!r||!l||!r.nextReviewDate||r.nextReviewDate<today())return null;return P.upsertAuto({learnerId:l.id,type:'Review',date:r.nextReviewDate,sourceKey:key(r.id),time:'',duration:60,notes:'Next review date agreed in the professional review.'})}
function backfill(){for(const l of S.learners().filter(x=>x.status==='Active')){const r=S.reviews(l.id).find(x=>x.status==='Completed');if(r?.nextReviewDate>=today())syncReview(r,l)}}
const oldSave=A.saveReviewStep?.bind(A);if(oldSave)A.saveReviewStep=function(fd){const f=A.flow,before=f?.kind==='review2'?f.step:null,r=f?.record,l=f?.learner;const out=oldSave(fd);if(before===0&&r&&l)syncReview(r,l);return out};
const oldDelete=S.deleteReview?.bind(S);if(oldDelete)S.deleteReview=function(id){try{P.write(P.read().filter(x=>x.sourceKey!==key(id)))}catch(_){}return oldDelete(id)};
setTimeout(backfill,0);
window.TilosReviewPlanningV39={syncReview,backfill};
}());
