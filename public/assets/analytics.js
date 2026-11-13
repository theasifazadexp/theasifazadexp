/* asifazad.com analytics: Google Analytics 4, loaded only after the visitor accepts.
   Measurement ID: G-B2QGFDW302 (set in GA_ID below).
   In GA, mark "book_call_click" as a key event.
   Visitors get a one-line choice the first time; nothing is sent to Google unless they accept. */
(function(){
  var GA_ID='G-B2QGFDW302';
  if(!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || GA_ID==='G-XXXXXXXXXX') return;
  var KEY='aa-consent', loaded=false;
  function get(){ try{return localStorage.getItem(KEY);}catch(e){return null;} }
  function set(v){ try{localStorage.setItem(KEY,v);}catch(e){} }
  function load(){
    if(loaded) return; loaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){dataLayer.push(arguments);};
    gtag('js',new Date());
    gtag('config',GA_ID);
    var s=document.createElement('script'); s.async=true;
    s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }
  function track(name,params){ if(loaded&&window.gtag) gtag('event',name,params||{}); }
  function where(el){ var s=el.closest('[id]'); return s?s.id:'page'; }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a,button'); if(!a) return;
    var href=a.getAttribute('href')||'';
    if(href.indexOf('cal.com/asifazad')>-1) return track('book_call_click',{link_location:where(a),link_text:(a.textContent||'').trim().slice(0,60)});
    if(href.indexOf('mailto:')===0) return track('email_click',{link_location:where(a)});
    if(href.indexOf('chat.whatsapp.com')>-1) return track('community_join_click',{link_location:where(a)});
    if(a.hasAttribute('data-about')) return track('about_open',{link_location:where(a)});
    if(a.classList.contains('tile')) return track('dock_click',{platform:(a.getAttribute('aria-label')||'').split(':')[0]});
    if(a.classList.contains('wc')) return track('case_study_open',{case_study:a.id||''});
    if(a.closest('.tvid')) return track('testimonial_video_play',{});
    if(a.closest('.fcard')) return track('content_open',{title:(a.textContent||'').trim().slice(0,80)});
    if(a.classList.contains('feat')) return track('feature_open',{title:((a.querySelector('.feat-t')||a).textContent||'').trim().slice(0,80)});
  },true);
  var c=get();
  if(c==='yes'){ load(); return; }
  if(c==='no') return;
  var b=document.createElement('div'); b.className='cnst'; b.setAttribute('role','region'); b.setAttribute('aria-label','Analytics choice');
  b.innerHTML='<p>Can I use analytics cookies to see which parts of this site are useful?</p><div><button type="button" data-v="no">No thanks</button><button type="button" class="ok" data-v="yes">Accept</button></div>';
  b.addEventListener('click',function(e){ var v=e.target.getAttribute('data-v'); if(!v) return; set(v); b.remove(); if(v==='yes') load(); });
  document.body.appendChild(b);
})();
