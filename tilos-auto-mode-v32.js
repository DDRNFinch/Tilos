(function(){
'use strict';
const A=window.TilosAssistant;if(!A)return;
const KEY='tilosAutoMode:v1';
let enabled=localStorage.getItem(KEY)==='1',taps=0,lastTap=0,resetTimer=0,helpTimer=0,spinning=false;
const bridgeBlue='#2c8be6';
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const face=()=>document.querySelector('#tilosOverlay .evia-stage>.evia-face');
function toast(text){const x=document.querySelector('#saveToast');if(!x)return;x.textContent=text;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1700)}
function ensureAccent(f){if(!f)return null;let a=f.querySelector('.tilos-auto-bridge');if(!a){a=document.createElement('div');a.className='tilos-auto-bridge';a.setAttribute('aria-hidden','true');f.appendChild(a)}return a}
function applyState(on){const f=face();if(!f)return;ensureAccent(f);f.classList.toggle('tilos-auto-on',!!on)}
function react(){const f=face();if(!f)return;try{f.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:300,easing:'ease-out'})}catch(_){}}
function animateToggle(next){const f=face();if(!f){enabled=Boolean(next);localStorage.setItem(KEY,enabled?'1':'0');toast(enabled?'Auto mode on':'Auto mode off');document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));return}
 const finalValue=Boolean(next);
 enabled=finalValue;localStorage.setItem(KEY,enabled?'1':'0');
 if(spinning){applyState(finalValue);toast(enabled?'Auto mode on':'Auto mode off');document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));return}
 if(reduceMotion()){
  applyState(finalValue);react();toast(enabled?'Auto mode on':'Auto mode off');document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));
  return;
 }
 spinning=true;
 f.classList.remove('tilos-auto-spin');
 void f.offsetWidth;
 f.classList.add('tilos-auto-spin');
 setTimeout(()=>applyState(finalValue),280);
 setTimeout(()=>{
  spinning=false;
  f.classList.remove('tilos-auto-spin');
  react();
  toast(enabled?'Auto mode on':'Auto mode off');
  document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));
 },560);
}
function set(value){animateToggle(Boolean(value))}
function toggle(){set(!enabled)}
function requestHelp(){document.dispatchEvent(new CustomEvent('tilos-face-help-request'))}
function tap(){
 const now=Date.now();if(now-lastTap>900)taps=0;taps++;lastTap=now;clearTimeout(resetTimer);clearTimeout(helpTimer);
 resetTimer=setTimeout(()=>{taps=0},1300);
 if(taps>=5){taps=0;clearTimeout(helpTimer);toggle();return}
 helpTimer=setTimeout(()=>{if(taps>0&&taps<5){taps=0;requestHelp()}},700);
}
if(!document.querySelector('#tilos-auto-css-v46')){const s=document.createElement('style');s.id='tilos-auto-css-v46';s.textContent=`
#tilosOverlay .evia-stage>.evia-face{pointer-events:auto!important;cursor:pointer!important;overflow:visible}
#tilosOverlay .evia-stage>.evia-face .evia-eyes{transition:transform .22s ease,width .22s ease,height .22s ease,filter .22s ease}
#tilosOverlay .evia-stage>.evia-face .evia-eye{transition:transform .22s ease,border-color .22s ease,opacity .22s ease}
.tilos-auto-bridge{position:absolute;left:50%;top:50%;width:19%;height:11%;transform:translate(-50%,-14%) scale(.75);border:4px solid ${bridgeBlue};border-bottom:0;border-radius:22px 22px 0 0;opacity:0;pointer-events:none;z-index:6;filter:drop-shadow(0 2px 4px rgba(44,139,230,.18));transition:opacity .18s ease,transform .24s ease}
.tilos-auto-on .tilos-auto-bridge{opacity:1;transform:translate(-50%,-8%) scale(1)}
.tilos-auto-on .evia-eyes{width:74%;height:42%;transform:translateY(2%)}
.tilos-auto-on .evia-eye{transform:scale(1.16);border-color:#ffffff}
.tilos-auto-spin{animation:tilosAutoSpin .56s cubic-bezier(.45,.05,.2,1)}
@keyframes tilosAutoSpin{0%{transform:rotateY(0deg)}45%{transform:rotateY(90deg)}55%{transform:rotateY(270deg)}100%{transform:rotateY(360deg)}}
@media(prefers-reduced-motion:reduce){.tilos-auto-bridge,#tilosOverlay .evia-stage>.evia-face .evia-eyes,#tilosOverlay .evia-stage>.evia-face .evia-eye{transition:none}.tilos-auto-spin{animation:none}}
`;document.head.appendChild(s)}
document.addEventListener('click',e=>{if(e.target.closest('#tilosOverlay .evia-stage>.evia-face')){e.preventDefault();e.stopImmediatePropagation();tap()}},true);
const open=A.open;A.open=function(){open();requestAnimationFrame(()=>applyState(enabled))};
window.TilosAutoMode={enabled:()=>enabled,set,toggle,refresh:()=>applyState(enabled),humanise:r=>r};
requestAnimationFrame(()=>applyState(enabled));
}());
