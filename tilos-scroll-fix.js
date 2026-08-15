(function(){
'use strict';
const A=window.TilosAssistant;if(!A)return;const O=A.O,D=A.D;
function pin(){const f=O.querySelector('.evia-stage>.evia-face');if(!f)return;f.style.setProperty('animation','none','important');f.style.setProperty('transform','none','important');f.style.setProperty('transition','filter .35s ease','important');}
function top(){try{O.scrollTop=0;D.scrollTop=0;const w=O.querySelector('.evia-wizard');if(w)w.scrollTop=0;pin()}catch(_){}}
A.top=top;pin();
const copy=A.copy;A.copy=function(t,h=''){copy(t,h);pin();requestAnimationFrame(()=>requestAnimationFrame(top))};
const open=A.open;A.open=function(){pin();open();top();requestAnimationFrame(()=>requestAnimationFrame(top))};
D.addEventListener('focusin',e=>{if(!O.classList.contains('open'))return;pin();const r=e.target.getBoundingClientRect(),wr=O.querySelector('.evia-wizard')?.getBoundingClientRect();if(wr&&r.top<wr.top+8)requestAnimationFrame(top)});
}());
