(function(){
'use strict';
const URL='https://cdn.jsdelivr.net/npm/qr-scanner@1.4.2/qr-scanner.legacy.min.js';
window.TilosQrReady=window.QrScanner?Promise.resolve(window.QrScanner):new Promise((resolve,reject)=>{
 const existing=[...document.scripts].find(s=>s.src===URL);
 if(existing){existing.addEventListener('load',()=>resolve(window.QrScanner),{once:true});existing.addEventListener('error',()=>reject(new Error('QR scanner failed to load')),{once:true});return;}
 const s=document.createElement('script');s.src=URL;s.crossOrigin='anonymous';s.onload=()=>window.QrScanner?resolve(window.QrScanner):reject(new Error('QR scanner unavailable'));s.onerror=()=>reject(new Error('QR scanner failed to load'));document.head.appendChild(s);
});
window.TilosQrVendor={url:URL,ready:window.TilosQrReady};
}());
