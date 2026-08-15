(function(){
'use strict';
function clean(root=document){
 root.querySelectorAll?.('[data-as-back],[data-ta-back],[data-ov-back],[data-ov-qback],[data-v33-report-back],[data-lm-back-selected]').forEach(b=>b.remove());
 root.querySelectorAll?.('.ta-actions button').forEach(b=>{const t=(b.textContent||'').replace(/\s+/g,' ').trim();if(t==='Back'||t==='Back to Andros')b.remove()});
 root.querySelectorAll?.('.ta-actions,.ov-actions').forEach(a=>{if(a.querySelectorAll(':scope > button').length===1)a.classList.add('tilos-single-action')});
}
let q=false;new MutationObserver(()=>{if(q)return;q=true;queueMicrotask(()=>{q=false;clean(document.querySelector('#tilosContent'))})}).observe(document.querySelector('#tilosContent'),{childList:true,subtree:true});
clean(document.querySelector('#tilosContent'));
window.TilosBackCleanupV38={clean};
}());
