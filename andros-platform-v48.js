(function(){
'use strict';
const app=document.querySelector('#staffApp'),overlay=document.querySelector('#tilosOverlay'),content=document.querySelector('#tilosContent');
const A=window.TilosAssistant,S=window.TilosStaffStore;
if(!app)return;
const coarse=()=>matchMedia('(pointer:coarse)').matches||matchMedia('(hover:none)').matches;
const desktop=()=>matchMedia('(min-width:800px)').matches&&!coarse();
const android=/Android/i.test(navigator.userAgent||'');
function platform(){
 document.body.classList.toggle('andros-desktop',desktop());
 document.body.classList.toggle('andros-touch',coarse());
 document.body.classList.toggle('andros-android',android);
 document.documentElement.dataset.androsPlatform=desktop()?'desktop':android?'android':'mobile';
}
function route(){
 const home=Boolean(app.querySelector(':scope > .assessor-value-home'));
 const secondary=Boolean(app.children.length&&!home);
 document.body.classList.toggle('andros-home',home);
 document.body.classList.toggle('andros-secondary',secondary);
}
function viewport(){
 const h=Math.round(window.visualViewport?.height||window.innerHeight||0);
 const w=Math.round(window.visualViewport?.width||window.innerWidth||0);
 document.documentElement.style.setProperty('--andros-vv-height',`${h}px`);
 document.documentElement.style.setProperty('--andros-vv-width',`${w}px`);
}
function decorateDesktopLabels(root=document){
 if(!desktop())return;
 root.querySelectorAll?.('label.ov-file').forEach(label=>{
  const input=label.querySelector('input[data-ov-file="video"]');
  if(input&&!label.dataset.desktopLabel){label.dataset.desktopLabel='1';label.childNodes[0]&&(label.childNodes[0].textContent='Add video')}
 });
}
async function importDiscussionAudio(input){
 const f=A?.flow,file=input.files?.[0];
 if(!file||f?.kind!=='ov3'||f.p!=='question'||!S)return;
 const key=f.ks?.[f.ki];if(!key)return;
 const status=content?.querySelector('#ovRecStatus'),done=content?.querySelector('[data-ov-qdone]');
 if(status)status.textContent='Saving audio…';
 try{
  const m=await S.MediaStore.save(file);
  f.o.discussionRecordings=Array.isArray(f.o.discussionRecordings)?f.o.discussionRecordings:[];
  f.o.discussionRecordings.push({...m,durationMs:0,knowledgeTargets:[key]});
  f.o.hasDiscussion=true;
  f.o.discussionNotes=`${f.o.discussionRecordings.length} recorded knowledge discussion${f.o.discussionRecordings.length===1?'':'s'}.`;
  S.saveObservation(f.o);A.dirty=true;
  if(status)status.textContent='Audio saved for this knowledge item.';
  if(done)done.disabled=false;
 }catch(err){console.error('Andros audio import failed',err);if(status)status.textContent='That audio file could not be saved.'}
 input.value='';
}
function decorateAudio(){
 if(!content||A?.flow?.kind!=='ov3'||A.flow.p!=='question')return;
 const status=content.querySelector('#ovRecStatus');if(!status)return;
 const card=status.closest('.ta-card');if(!card||card.querySelector('[data-andros-audio-file]'))return;
 const label=document.createElement('label');label.className='andros-audio-file';label.innerHTML='<span>Or add an audio file</span><input data-andros-audio-file type="file" accept="audio/*">';
 status.after(label);
}
function decorate(){platform();route();viewport();decorateDesktopLabels();decorateAudio()}
if(!document.querySelector('#andros-platform-v48-style')){
 const s=document.createElement('style');s.id='andros-platform-v48-style';s.textContent=`
html{min-height:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{min-height:100dvh;overscroll-behavior-y:none}
button,input,select,textarea,label,a{touch-action:manipulation}
button{-webkit-tap-highlight-color:transparent}
.andros-audio-file{display:grid;gap:5px;margin-top:8px;padding:9px 10px;border:1px dashed #9ecfe2;border-radius:12px;background:#f3fbfe;color:#42616d;font-size:10px;font-weight:800;cursor:pointer}
.andros-audio-file input{width:100%;font:inherit;font-size:11px;color:#56666d}
@media(max-width:799px){
 body.andros-touch input:not([type=checkbox]):not([type=radio]),body.andros-touch select,body.andros-touch textarea{font-size:16px!important}
 .evia-overlay{min-height:var(--andros-vv-height,100dvh)}
 .sticky-form-actions{bottom:max(8px,env(safe-area-inset-bottom))}
 .p33-plan-form,.p33-planner{padding-bottom:max(8px,env(safe-area-inset-bottom))}
}
@media(min-width:800px){
 body{background:#e9f3f7!important;overflow-y:auto}
 main{width:min(1180px,calc(100vw - 48px))!important;max-width:1180px!important;min-height:100dvh!important;margin:0 auto!important;padding:22px 32px 34px!important;background:#f8fcfe!important;box-shadow:0 0 45px rgba(34,90,112,.08)}
 .app-header{position:sticky!important;top:0!important;z-index:35!important;max-width:1080px;margin:0 auto 12px!important;padding:12px 0!important}
 #staffApp{width:100%;max-width:1040px;margin:0 auto}
 body.andros-secondary .staff-face-panel{display:none!important}
 body.tilos-home-centred-v40 .staff-face-panel{width:min(720px,calc(100vw - 80px))!important}
 body.tilos-home-centred-v40 #staffApp{width:min(720px,calc(100vw - 80px))!important}
 body.tilos-home-centred-v40 .vh-arches{gap:18px!important;padding:0 20px!important}
 body.tilos-home-centred-v40 .vh-arch svg{width:86px!important;height:48px!important}
 .evia-overlay{padding:24px!important;display:flex;align-items:center;justify-content:center;overflow:hidden}
 .evia-wizard{width:min(920px,calc(100vw - 64px))!important;max-width:920px!important;min-height:0!important;max-height:calc(100dvh - 48px);overflow:auto;padding:14px 26px 30px!important;border:1px solid rgba(89,189,231,.24);border-radius:28px;background:#f8fcfe;box-shadow:0 28px 90px rgba(25,68,85,.22)}
 #tilosContent{max-width:820px!important;padding-bottom:14px!important}
 #tilosOverlay .evia-stage{height:124px!important;flex:0 0 124px}
 #tilosOverlay .evia-copy{max-width:760px!important}
 #tilosOverlay .evia-copy h2{font-size:30px!important}
 .ta-menu.v39-main{grid-template-columns:repeat(4,minmax(0,1fr))!important}
 .ta-menu.v39-main button{min-height:118px!important;padding:17px!important}
 .v39-learner-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important}
 .v39-learner-row{min-height:82px!important;padding:12px 14px!important}
 .v39-learner-tools{grid-template-columns:minmax(0,1fr) auto!important}
 .v39-health-summary{gap:10px!important}
 .v39-health-summary>div{padding:14px 10px!important}
 .ld-doc-list{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}
 .ld-doc-row{border:1px solid #e1e8eb!important;border-radius:14px!important;padding:12px!important}
 .ld-actions{grid-template-columns:repeat(3,minmax(0,1fr))!important}
 .ld-actions .ld-delete{grid-column:auto!important}
 .ld-detail-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
 .v39-learner-actions{grid-template-columns:1fr 1fr!important}
 .p33-planner{grid-template-columns:minmax(390px,.92fr) minmax(430px,1.08fr)!important;grid-template-rows:auto auto 1fr;column-gap:20px!important;align-items:start}
 .p33-planner>.p33-head{grid-column:1;grid-row:1}
 .p33-planner>.p33-week-nav{grid-column:1;grid-row:2}
 .p33-planner>.p33-days{grid-column:1;grid-row:3}
 .p33-planner>.p33-agenda{grid-column:2;grid-row:1/4;min-height:350px!important;padding:18px!important}
 .p33-days button{min-height:74px!important}
 .p33-plan-form{max-width:760px;margin:0 auto}
 .p33-plan-form form{padding:20px!important}
 .observation-media-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important}
 .sticky-form-actions{position:sticky;bottom:14px;max-width:760px;margin:18px auto 0}
 .staff-card{padding:18px!important}
 .staff-page-head h1{font-size:28px!important}
 .workflow-nav{top:76px!important}
 .ta-ksbs{max-height:52vh!important}
 .ta-row{grid-template-columns:1fr 1fr!important}
 .ta-actions{grid-template-columns:1fr 1fr!important}
 .ov-actions{max-width:700px;margin-left:auto!important;margin-right:auto!important}
 #v36LiveCamera{border-radius:24px;overflow:hidden}
}
@media(min-width:1200px){
 .evia-wizard{width:min(980px,calc(100vw - 96px))!important;max-width:980px!important}
 #tilosContent{max-width:860px!important}
}
`;
 document.head.appendChild(s);
}
window.addEventListener('resize',decorate,{passive:true});
window.visualViewport?.addEventListener('resize',viewport,{passive:true});
matchMedia('(min-width:800px)').addEventListener?.('change',decorate);
matchMedia('(pointer:coarse)').addEventListener?.('change',decorate);
new MutationObserver(()=>queueMicrotask(decorate)).observe(app,{childList:true,subtree:true});
if(content)new MutationObserver(()=>queueMicrotask(()=>{decorateDesktopLabels(content);decorateAudio()})).observe(content,{childList:true,subtree:true});
document.addEventListener('change',e=>{if(e.target?.matches?.('[data-andros-audio-file]'))importDiscussionAudio(e.target)},true);
try{navigator.storage?.persisted?.().then(p=>{if(!p)navigator.storage?.persist?.().catch(()=>{})})}catch(_){ }
decorate();
window.AndrosPlatformV48={desktop,android:()=>android,refresh:decorate};
}());
