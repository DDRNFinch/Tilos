(function(){
'use strict';
document.documentElement.lang='en-GB';
const pad=n=>String(n).padStart(2,'0');
function date(v){
  if(!v)return'';
  const s=String(v).trim();
  const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m)return`${m[3]}/${m[2]}/${m[1]}`;
  const d=v instanceof Date?v:new Date(v);
  if(Number.isNaN(d.getTime()))return s;
  return`${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
}
function iso(v){
  const s=String(v||'').trim();
  let m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(m){const d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),12);if(d.getFullYear()===Number(m[3])&&d.getMonth()===Number(m[2])-1&&d.getDate()===Number(m[1]))return`${m[3]}-${m[2]}-${m[1]}`;return''}
  m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?s:'';
}
function duration(minutes){const n=Math.max(0,Math.round(Number(minutes)||0)),h=Math.floor(n/60),m=n%60;return`${h}h:${pad(m)}m`}
const native=Date.prototype.toLocaleDateString;
if(!Date.prototype.__tilosGbDatePatched){
  Object.defineProperty(Date.prototype,'__tilosGbDatePatched',{value:true,configurable:true});
  Date.prototype.toLocaleDateString=function(locale,options){
    if(Number.isNaN(this.getTime()))return native.call(this,locale,options);
    const opts=options||{};
    const en=!locale||String(Array.isArray(locale)?locale[0]:locale).toLowerCase().startsWith('en');
    const asksDate=!options||opts.day||opts.month||opts.year;
    if(en&&asksDate){const core=date(this);if(opts.weekday){const w=native.call(this,'en-GB',{weekday:opts.weekday});return`${w} ${core}`}return core}
    return native.call(this,locale,options);
  };
}
function replaceIsoText(root=document.body){
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const p=node.parentElement;if(!p||/^(SCRIPT|STYLE|TEXTAREA|OPTION)$/i.test(p.tagName)||p.closest('input,textarea,[contenteditable="true"]'))return NodeFilter.FILTER_REJECT;return /\b\d{4}-\d{2}-\d{2}\b/.test(node.nodeValue||'')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const rows=[];while(walker.nextNode())rows.push(walker.currentNode);for(const node of rows)node.nodeValue=node.nodeValue.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g,'$3/$2/$1');
}
function syncDisplay(hidden){const display=hidden?._tilosDateDisplay;if(display&&display.value!==date(hidden.value)){display.value=date(hidden.value);display.setCustomValidity('')}}
function decorateDateInput(input){
  if(!input||input.dataset.tilosDateIso==='1'||input.type!=='date')return;
  input.dataset.tilosDateIso='1';
  const display=document.createElement('input');display.type='text';display.inputMode='numeric';display.autocomplete='off';display.placeholder='dd/mm/yyyy';display.value=date(input.value);display.className=input.className;display.dataset.tilosDateDisplay='1';display.setAttribute('aria-label',input.getAttribute('aria-label')||input.name||'Date');
  const required=input.required;input.required=false;display.required=required;display.disabled=input.disabled;display.readOnly=input.readOnly;
  input.type='hidden';input.hidden=true;input._tilosDateDisplay=display;display._tilosDateIso=input;input.insertAdjacentElement('afterend',display);
  const update=kind=>{const raw=display.value.trim(),next=iso(raw);display.setCustomValidity(raw&&!next?'Use dd/mm/yyyy':'');input.value=next;input.dispatchEvent(new Event(kind,{bubbles:true}));setTimeout(()=>document.querySelectorAll('input[data-tilos-date-iso="1"]').forEach(syncDisplay),0)};
  display.addEventListener('input',()=>update('input'));display.addEventListener('change',()=>update('change'));
  input.addEventListener('input',()=>syncDisplay(input));input.addEventListener('change',()=>syncDisplay(input));
}
function decorateDates(root=document){root.querySelectorAll?.('input[type="date"]:not([data-tilos-date-iso="1"])').forEach(decorateDateInput)}
let queued=false;const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;decorateDates(document);replaceIsoText(document.querySelector('#staffApp'));replaceIsoText(document.querySelector('#tilosContent'));document.querySelectorAll('input[data-tilos-date-iso="1"]').forEach(syncDisplay)})};
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
schedule();
window.TilosFormat={date,iso,duration,replaceIsoText,decorateDates};
}());
