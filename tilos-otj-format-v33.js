(function(){
'use strict';
const D=document.querySelector('#tilosContent'),F=window.TilosFormat||{};if(!D)return;
const duration=m=>F.duration?F.duration(m):`${Math.floor(Number(m||0)/60)}h:${String(Math.round(Number(m||0))%60).padStart(2,'0')}m`;
function run(){for(const box of D.querySelectorAll('.rv-snapshot-lines')){if(!/^Recent learning$/i.test(box.querySelector(':scope > strong')?.textContent?.trim()||''))continue;for(const b of box.querySelectorAll('span>b')){const m=b.textContent.trim().match(/^(\d+)\s*min(?:utes?)?$/i);if(m)b.textContent=duration(Number(m[1]))}}}
new MutationObserver(run).observe(D,{childList:true,subtree:true});run();
window.TilosOtjFormatV33={duration,run};
}());
