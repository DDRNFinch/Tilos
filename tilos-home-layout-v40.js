(function(){
'use strict';
const app=document.querySelector('#staffApp');
if(!app)return;
function active(){return Boolean(app.querySelector(':scope > .assessor-value-home'))}
function apply(){
  const on=active();
  document.body.classList.toggle('tilos-home-centred-v40',on);
  if(!on)return;
  const home=app.querySelector(':scope > .assessor-value-home');
  const arches=home?.querySelector('.vh-arches');
  const utilities=home?.querySelector('.vh-utility-actions');
  if(home&&arches&&utilities&&utilities.nextElementSibling!==arches)home.insertBefore(utilities,arches);
}
if(!document.querySelector('#tilos-home-layout-v40-style')){
  const s=document.createElement('style');
  s.id='tilos-home-layout-v40-style';
  s.textContent=`
body.tilos-home-centred-v40{overflow:hidden!important}
body.tilos-home-centred-v40 main{position:relative!important;height:100svh!important;height:100dvh!important;min-height:100svh!important;min-height:100dvh!important;overflow:hidden!important;box-sizing:border-box!important}
body.tilos-home-centred-v40 .staff-face-panel{position:fixed!important;left:50%!important;top:50svh!important;top:50dvh!important;transform:translate(-50%,-50%)!important;width:min(calc(100vw - 40px),460px)!important;margin:0!important;padding:0!important;z-index:6!important}
body.tilos-home-centred-v40 .staff-face-panel .home-evia-space{height:auto!important;min-height:132px!important;margin:0!important}
body.tilos-home-centred-v40 #staffApp{position:fixed!important;left:50%!important;bottom:max(10px,env(safe-area-inset-bottom))!important;transform:translateX(-50%)!important;width:min(calc(100vw - 40px),460px)!important;z-index:7!important;margin:0!important;padding:0!important}
body.tilos-home-centred-v40 #staffApp>.assessor-value-home{display:flex!important;flex-direction:column!important;gap:8px!important;margin:0!important;padding:0!important}
body.tilos-home-centred-v40 .assessor-value-home>.vh-utility-actions{order:1!important;margin:0 0 2px!important;padding:0 3px!important}
body.tilos-home-centred-v40 .assessor-value-home>.vh-arches{order:2!important;margin:0!important;padding:0 2px!important}
@media(max-width:390px){body.tilos-home-centred-v40 .staff-face-panel,body.tilos-home-centred-v40 #staffApp{width:calc(100vw - 28px)!important}}
@media(max-height:580px){body.tilos-home-centred-v40 .staff-face-panel .home-evia-stage{width:112px!important;height:112px!important;min-width:112px!important;max-width:112px!important;min-height:112px!important;max-height:112px!important}body.tilos-home-centred-v40 .staff-face-panel .home-evia-stage>#eviaFace.evia-face{width:90px!important;height:90px!important;min-width:90px!important;max-width:90px!important;min-height:90px!important;max-height:90px!important;flex-basis:90px!important}}
`;
  document.head.appendChild(s);
}
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;apply()})}).observe(app,{childList:true,subtree:false});
document.addEventListener('tilos-planning-changed',()=>setTimeout(apply,0));
window.addEventListener('pageshow',()=>setTimeout(apply,0));
apply();
window.TilosHomeLayoutV40={apply};
}());
