(function(){
'use strict';
const A=window.TilosAssistant;if(!A)return;
const KEY='tilosAutoMode:v1';
let enabled=localStorage.getItem(KEY)==='1',taps=0,lastTap=0,resetTimer=0,helpTimer=0,animating=false;
const themeBlue='var(--yellow, #59bde7)';
const reduceMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
const face=()=>document.querySelector('#tilosOverlay .evia-stage>.evia-face');
const eyesWrap=()=>face()?.querySelector('.evia-eyes');
function toast(text){const x=document.querySelector('#saveToast');if(!x)return;x.textContent=text;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),1700)}
function ensureGlasses(){
  const wrap=eyesWrap();
  if(!wrap)return null;
  let g=wrap.querySelector('.tilos-auto-glasses');
  if(!g){
    g=document.createElement('div');
    g.className='tilos-auto-glasses';
    g.setAttribute('aria-hidden','true');
    g.innerHTML='<i class="left"></i><b></b><i class="right"></i>';
    wrap.appendChild(g);
  }
  return g;
}
function applyState(on){
  const f=face();
  if(!f)return;
  ensureGlasses();
  f.classList.toggle('tilos-auto-on',!!on);
}
function pulse(){
  const f=face();
  if(!f)return;
  try{f.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:320,easing:'cubic-bezier(.2,.8,.2,1)'})}catch(_){ }
}
function animateToggle(next){
  const f=face();
  enabled=Boolean(next);
  localStorage.setItem(KEY,enabled?'1':'0');
  if(!f){
    toast(enabled?'Auto mode on':'Auto mode off');
    document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));
    return;
  }
  if(animating){
    applyState(enabled);
    return;
  }
  if(reduceMotion()){
    applyState(enabled);
    pulse();
    toast(enabled?'Auto mode on':'Auto mode off');
    document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));
    return;
  }
  animating=true;
  const g=ensureGlasses();
  applyState(enabled);
  g?.classList.remove('pulse');
  void g?.offsetWidth;
  g?.classList.add('pulse');
  pulse();
  setTimeout(()=>{
    g?.classList.remove('pulse');
    animating=false;
    toast(enabled?'Auto mode on':'Auto mode off');
    document.dispatchEvent(new CustomEvent('tilos-auto-mode-changed',{detail:{enabled}}));
  },340);
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
if(!document.querySelector('#tilos-auto-css-v47')){const s=document.createElement('style');s.id='tilos-auto-css-v47';s.textContent=`
#tilosOverlay .evia-stage>.evia-face{pointer-events:auto!important;cursor:pointer!important;overflow:visible}
#tilosOverlay .evia-stage>.evia-face .evia-eyes{position:relative;transition:transform .22s ease,width .22s ease,height .22s ease,filter .22s ease}
#tilosOverlay .evia-stage>.evia-face .evia-eye{transition:opacity .18s ease,transform .18s ease,border-color .18s ease}
.tilos-auto-glasses{position:absolute;left:50%;top:50%;width:86%;height:62%;transform:translate(-50%,-50%) scale(.8);display:grid;grid-template-columns:1fr 12% 1fr;align-items:center;opacity:0;pointer-events:none;z-index:7;transition:opacity .16s ease,transform .22s ease}
.tilos-auto-glasses i{display:block;width:100%;height:100%;border:4px solid ${themeBlue};border-radius:50%;box-sizing:border-box;background:transparent}
.tilos-auto-glasses b{display:block;height:4px;background:${themeBlue};border-radius:999px;transform:translateY(1px)}
.tilos-auto-on .evia-eye{opacity:0;transform:scale(.65)}
.tilos-auto-on .tilos-auto-glasses{opacity:1;transform:translate(-50%,-50%) scale(1)}
.tilos-auto-glasses.pulse{animation:tilosGlassesPulse .32s ease-out}
@keyframes tilosGlassesPulse{0%{transform:translate(-50%,-50%) scale(.84)}55%{transform:translate(-50%,-50%) scale(1.1)}100%{transform:translate(-50%,-50%) scale(1)}}
@media(prefers-reduced-motion:reduce){#tilosOverlay .evia-stage>.evia-face .evia-eyes,#tilosOverlay .evia-stage>.evia-face .evia-eye,.tilos-auto-glasses{transition:none}.tilos-auto-glasses.pulse{animation:none}}
`;document.head.appendChild(s)}
document.addEventListener('click',e=>{if(e.target.closest('#tilosOverlay .evia-stage>.evia-face')){e.preventDefault();e.stopImmediatePropagation();tap()}},true);
const open=A.open;A.open=function(){open();requestAnimationFrame(()=>applyState(enabled))};
window.TilosAutoMode={enabled:()=>enabled,set,toggle,refresh:()=>applyState(enabled),humanise:r=>r};
requestAnimationFrame(()=>applyState(enabled));
}());
