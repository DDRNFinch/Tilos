(function(){
'use strict';
const app=document.querySelector('#staffApp'),A=window.TilosAssistant;if(!app)return;
function isValueHome(){return Boolean(app.querySelector(':scope > .assessor-value-home'))}
function isSecondary(){return Boolean(app.querySelector(':scope > .p33-planner,:scope > .p33-plan-form,:scope > .pa-planner,:scope > .pa-plan-form,#profileForm,#learnerForm,.learner-list,.record-index,.learner-hero,.staff-page-head,.course-summary,.review-form,.observation-form'))}
function oldOrEmpty(){if(isSecondary()||isValueHome())return false;if(!app.children.length)return true;return Boolean(app.querySelector(':scope > .pa-home,:scope > .staff-stats,:scope > .selected-learner,:scope > .staff-actions,:scope > .staff-action.compact'))}
function utilities(){
 const home=app.querySelector(':scope > .assessor-value-home');if(!home)return;
 const tile=home.querySelector('.vh-today');if(tile){const strong=tile.querySelector('strong'),em=tile.querySelector('em');if(strong&&strong.textContent.trim()!=='Plan my day'){const old=strong.textContent.trim();strong.textContent='Plan my day';if(em&&old&&!/^Next ·/.test(em.textContent))em.textContent=`Next · ${old}${em.textContent?` · ${em.textContent}`:''}`}}
 home.querySelectorAll(':scope > .vh-utility-actions').forEach(n=>n.remove());
 const nav=document.querySelector('.header-utility-actions');if(nav)nav.hidden=false;
}
function home(){window.TilosValueHome?.render?.(true);utilities()}
function ensure(){if(oldOrEmpty())home();else if(isValueHome())utilities()}
const top=document.querySelector('.header-actions');if(top){top.querySelectorAll('button').forEach(b=>{if(b.id==='settingsButton'||b.textContent.trim()==='!')b.hidden=true})}
if(!document.querySelector('#v33-home-style')){const s=document.createElement('style');s.id='v33-home-style';s.textContent='#settingsButton{display:none!important}';document.head.appendChild(s)}
window.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b)return;if(b.hasAttribute('data-v33-help')){e.preventDefault();e.stopImmediatePropagation();document.querySelector('#eviaFace')?.click();return}if(b.hasAttribute('data-v33-profile')){e.preventDefault();e.stopImmediatePropagation();document.querySelector('#settingsButton')?.click();return}},true);
let q=false;new MutationObserver(()=>{if(q)return;q=true;queueMicrotask(()=>{q=false;ensure()})}).observe(app,{childList:true,subtree:false});
document.querySelector('#tilosClose')?.addEventListener('click',()=>setTimeout(ensure,60),true);
window.addEventListener('pageshow',()=>setTimeout(ensure,0));document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(ensure,0)});
setTimeout(ensure,0);
window.TilosHomeV33={home,ensure,utilities};
}());
