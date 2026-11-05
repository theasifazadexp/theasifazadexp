/* ===== theme ===== */
(function(){
  var root=document.documentElement, fav=document.getElementById('fav'), tc=document.getElementById('themeColor');
  function set(t,save){
    root.setAttribute('data-theme',t);
    if(fav) fav.href=(t==='dark'?window.__FAV_D:window.__FAV_L);
    if(tc) tc.setAttribute('content',t==='dark'?'#0B0B0B':'#DCDBD8');
    [].forEach.call(document.querySelectorAll('[data-theme-toggle]'),function(b){b.setAttribute('aria-label',t==='dark'?'Switch to light mode':'Switch to dark mode');});
    if(save){try{localStorage.setItem('aa-theme',t);}catch(e){}}
  }
  set(root.getAttribute('data-theme')||'light',false);
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-theme-toggle]'); if(!b) return;
    set(root.getAttribute('data-theme')==='dark'?'light':'dark',true);
  });
  try{
    var mq=window.matchMedia('(prefers-color-scheme: dark)');
    var onSys=function(ev){var s=null;try{s=localStorage.getItem('aa-theme');}catch(e){} if(s!=='dark'&&s!=='light') set(ev.matches?'dark':'light',false);};
    if(mq.addEventListener) mq.addEventListener('change',onSys); else if(mq.addListener) mq.addListener(onSys);
  }catch(e){}
})();


/* shared: year, About transition point */
(function(){
  var y=document.getElementById('yr'); if(y) y.textContent=new Date().getFullYear();
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[data-about]'); if(!a) return;
    var r=a.getBoundingClientRect();
    try{ sessionStorage.setItem('aa-vt',Math.round(r.left+r.width/2)+'px,'+Math.round(r.top+r.height/2)+'px'); }catch(_){}
  });
})();
