(function(){
'use strict';
const API=window.TilosStaffPdf,F=window.TilosFormat||{};if(!API||typeof API.downloadReview!=='function')return;
const base=API.downloadReview.bind(API),duration=m=>F.duration?F.duration(m):`${Math.floor(Number(m||0)/60)}h:${String(Math.round(Number(m||0))%60).padStart(2,'0')}m`,clean=v=>String(v||'').replace(/\s+/g,' ').trim();
API.downloadReview=async function(r,l,p){const q=JSON.parse(JSON.stringify(r||{})),rows=q.portfolioSnapshot?.recentLearning||[];const learning=rows.map(x=>Array.isArray(x)?`${duration(Number(x[1])||0)} — ${clean(x[2]||x[3]||'Planned learning')}`:`${duration(Number(x?.minutes)||0)} — ${clean(x?.topic||'Planned learning')}`).filter(Boolean).slice(0,6);if(learning.length){q.progress=q.progress||{};const line=`Recorded learning: ${learning.join('; ')}.`;if(!clean(q.progress.newLearning).includes('Recorded learning:'))q.progress.newLearning=[clean(q.progress.newLearning),line].filter(Boolean).join('\n\n')}return base(q,l,p)};
window.TilosReviewPdfHoursV33={duration};
}());
