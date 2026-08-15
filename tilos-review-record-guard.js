(function(){
'use strict';
const A=window.TilosAssistant,S=window.TilosStaffStore,app=document.querySelector('#staffApp');if(!A||!S||!app)return;
const legacyAutoSteps=[2,3,4,7,9,11,17,18];
app.addEventListener('click',e=>{const b=e.target.closest('[data-open-review]');if(!b)return;const r=S.review(b.dataset.openReview),l=r?S.learner(r.learnerId):null;if(!r||!l||!window.TilosReviewV2)return;e.preventDefault();e.stopImmediatePropagation();A.open();S.selectLearner(l.id);A.flow={kind:'review2',step:0,learner:l,record:r,autoFilled:new Set(legacyAutoSteps)};window.TilosReviewV2.render()},true);
}());
