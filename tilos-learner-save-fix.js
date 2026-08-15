(function(){
'use strict';
const S=window.TilosStaffStore,T=window.TilosCourses,app=document.querySelector('#staffApp');if(!S||!T||!app)return;
function toast(text){const x=document.querySelector('#saveToast');if(!x)return;x.textContent=text;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2200)}
function save(form){if(!form.reportValidity())return;const fd=new FormData(form),id=String(fd.get('id')||''),old=id?S.learner(id):null,courseSelect=form.querySelector('#lmMainCourse'),courseId=courseSelect?.value||T.resolveCourseId?.(old)||old?.courseId||'ST0095';const saved=S.saveLearner({...old,id:id||undefined,name:String(fd.get('name')||'').trim(),employer:String(fd.get('employer')||'').trim(),startDate:String(fd.get('startDate')||''),plannedEndDate:String(fd.get('plannedEndDate')||''),apprenticeNumber:String(fd.get('apprenticeNumber')||'').trim(),courseId,nvqOptionalUnitIds:T.isNVQ(courseId)?fd.getAll('lmOptionalUnit').map(String):(old?.nvqOptionalUnitIds||[]),status:old?.status||'Active'});S.selectLearner(saved.id);toast('Learner saved');setTimeout(()=>location.reload(),120)}
app.addEventListener('click',e=>{const b=e.target.closest('#learnerForm button[type="submit"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();save(b.form||app.querySelector('#learnerForm'))},true);
app.addEventListener('submit',e=>{if(e.target.id!=='learnerForm')return;e.preventDefault();e.stopImmediatePropagation();save(e.target)},true);
window.TilosLearnerSaveFix={save};
}());
