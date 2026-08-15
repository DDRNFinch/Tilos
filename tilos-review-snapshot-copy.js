(function(){
'use strict';
const A=window.TilosAssistant,D=A?.D;if(!A||!D)return;
function sync(){if(A.flow?.kind!=='review2'||A.flow.step!==1)return;A.copy('Snapshot the learner’s portfolio','Scan the anonymous progress QR from Evia, or enter the current figures manually.')}
new MutationObserver(sync).observe(D,{childList:true,subtree:true});
window.addEventListener('tilos-portfolio-snapshot-changed',sync);
sync();
}());
