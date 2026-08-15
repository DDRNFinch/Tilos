(function(){
'use strict';
const A=window.TilosAssistant;if(!A)return;
const KEY='tilosAutoMode:v1';
let enabled=localStorage.getItem(KEY)==='1',taps=0,lastTap=0,resetTimer=0,helpTimer=0;
const face=()=>document.querySelector('#tilosOverlay .evia-stage>.evia-face');
function toast(text){const x=document.querySelector('#saveToast');if(!x)return;x.textContent=text;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1700)}
function glasses(on){const f=face();if(!f)return;let g=f.querySelector('.tilos-glasses');if(on&&!g){g=document.createElement('div');g.className='tilos-glasses';g.innerHTML='<i></i><b></b><i></i>';f.appendChild(g)}if(g)g.classList.toggle('on',on);f.classList.toggle('tilos-auto-on',on)}
function react(){const f=face();if(!f)return;try{f.animate([{scale:'1'},{scale:'1.07'},{scale:'1'}],{duration:300,easing:'ease-out'})}catch(_){}}
function set(value){enabled=Boolean(value);localStorage.setItem(KEY,enabled?'1':'0');glasses(enabled);react();toast(enabled?'Auto mode on':'Auto mode off');document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}))}
function toggle(){set(!enabled)}
function requestHelp(){document.dispatchEvent(new CustomEvent('tilos-face-help-request'))}
function tap(){
 const now=Date.now();if(now-lastTap>900)taps=0;taps++;lastTap=now;clearTimeout(resetTimer);clearTimeout(helpTimer);
 resetTimer=setTimeout(()=>{taps=0},1300);
 if(taps>=5){taps=0;clearTimeout(helpTimer);toggle();return}
 helpTimer=setTimeout(()=>{if(taps>0&&taps<5){taps=0;requestHelp()}},700);
}
if(!document.querySelector('#tilos-auto-css-v32')){const s=document.createElement('style');s.id='tilos-auto-css-v32';s.textContent=`#tilosOverlay .evia-stage>.evia-face{pointer-events:auto!important;cursor:pointer!important}.tilos-glasses{position:absolute;left:50%;top:36%;translate:-50% -18px;width:78%;height:31%;display:grid;grid-template-columns:1fr 12% 1fr;align-items:center;opacity:0;pointer-events:none;z-index:5;transition:opacity .18s ease,translate .25s ease}.tilos-glasses.on{opacity:1;translate:-50% 0}.tilos-glasses i{display:block;height:100%;border:4px solid #17333f;border-radius:16px;background:#dff5fd35;box-shadow:inset 0 0 0 2px #ffffff70}.tilos-glasses b{display:block;height:4px;background:#17333f}.tilos-auto-on .evia-eyes{filter:saturate(.8) brightness(.95)}@media(prefers-reduced-motion:reduce){.tilos-glasses{transition:none}}`;document.head.appendChild(s)}
document.addEventListener('click',e=>{if(e.target.closest('#tilosOverlay .evia-stage>.evia-face')){e.preventDefault();e.stopImmediatePropagation();tap()}},true);
const open=A.open;A.open=function(){open();requestAnimationFrame(()=>glasses(enabled))};
window.TilosAutoMode={enabled:()=>enabled,set,toggle,refresh:()=>glasses(enabled),humanise:r=>r};
requestAnimationFrame(()=>glasses(enabled));
}());
