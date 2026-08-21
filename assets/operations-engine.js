(function(){
  var initTimer=null,logTimer=null,productTimer=null,scrollBound=false,observer=null;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var logMessages=['New task received → identifying workflow','Routing work → matching the right service','Validation check → structure before speed','Human review → quality gate active','Output ready → organized for delivery'];
  var logIndex=0;

  function ensureCss(){
    if(document.querySelector('link[href="assets/operations-engine.css"]'))return;
    var link=document.createElement('link');link.rel='stylesheet';link.href='assets/operations-engine.css';document.head.appendChild(link);
  }
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  function ease(v){return v<.5?2*v*v:1-Math.pow(-2*v+2,2)/2;}

  function engineMarkup(){
    return '<div class="loe-engine reveal" aria-label="Zentexa Living Operations Engine">'+
      '<div class="loe-topbar"><span>Zentexa Operations Engine</span><span class="loe-live"><i></i>Live workflow</span></div>'+
      '<svg viewBox="0 0 520 440" aria-hidden="true">'+
        '<path id="loe-data" class="loe-track active" d="M92 108 C150 125 200 177 260 220"/>'+
        '<path id="loe-support" class="loe-track active" d="M428 108 C370 125 320 177 260 220"/>'+
        '<path id="loe-research" class="loe-track active" d="M260 52 C260 112 260 164 260 220"/>'+
        '<path id="loe-back" class="loe-track active" d="M92 332 C155 315 202 266 260 220"/>'+
        '<path id="loe-auto" class="loe-track active" d="M428 332 C365 315 318 266 260 220"/>'+
        '<path id="loe-web" class="loe-track active" d="M260 388 C260 328 260 276 260 220"/>'+
        '<path id="loe-out" class="loe-track active" d="M260 220 C338 220 414 220 510 220"/>'+
        '<circle class="loe-packet" r="3.5" fill="#a6ff8f"><animateMotion dur="4.9s" begin="-1.1s" repeatCount="indefinite"><mpath href="#loe-data"/></animateMotion></circle>'+
        '<circle class="loe-packet cyan" r="3.2" fill="#4a8fff"><animateMotion dur="5.7s" begin="-3s" repeatCount="indefinite"><mpath href="#loe-support"/></animateMotion></circle>'+
        '<circle class="loe-packet" r="3.1" fill="#a6ff8f"><animateMotion dur="5.3s" begin="-2.2s" repeatCount="indefinite"><mpath href="#loe-research"/></animateMotion></circle>'+
        '<circle class="loe-packet cyan" r="3.2" fill="#4a8fff"><animateMotion dur="6.1s" begin="-4.4s" repeatCount="indefinite"><mpath href="#loe-back"/></animateMotion></circle>'+
        '<circle class="loe-packet" r="3.4" fill="#a6ff8f"><animateMotion dur="5.6s" begin="-1.8s" repeatCount="indefinite"><mpath href="#loe-auto"/></animateMotion></circle>'+
        '<circle class="loe-packet cyan" r="3.1" fill="#4a8fff"><animateMotion dur="6.4s" begin="-3.5s" repeatCount="indefinite"><mpath href="#loe-web"/></animateMotion></circle>'+
        '<circle class="loe-packet" r="4" fill="#a6ff8f"><animateMotion dur="3.1s" begin="-.7s" repeatCount="indefinite"><mpath href="#loe-out"/></animateMotion></circle>'+
      '</svg>'+
      '<div class="loe-core"><div><strong>ZENTEXA</strong><small>OPERATIONS</small></div></div>'+
      '<div class="loe-node" data-key="data"><b>01</b><span>Data & Reports</span></div>'+
      '<div class="loe-node" data-key="support"><b>02</b><span>Customer Support</span></div>'+
      '<div class="loe-node" data-key="research"><b>03</b><span>Research</span></div>'+
      '<div class="loe-node" data-key="backoffice"><b>04</b><span>Back Office</span></div>'+
      '<div class="loe-node" data-key="automation"><b>05</b><span>Automation</span></div>'+
      '<div class="loe-node" data-key="websites"><b>06</b><span>Websites</span></div>'+
      '<div class="loe-output">Organized output →</div>'+
      '<div class="loe-engine-log"><em>ENGINE</em><span class="loe-log-text">'+logMessages[0]+'</span></div>'+
    '</div>';
  }

  function initEngine(){
    if(!document.body.classList.contains('home-page'))return;
    if(document.querySelector('.loe-engine')){bindServiceFocus();return;}
    var target=document.querySelector('.workflow-visual')||document.querySelector('.hero-card');
    if(!target)return;
    var holder=document.createElement('div');holder.innerHTML=engineMarkup();var engine=holder.firstElementChild;target.replaceWith(engine);
    bindServiceFocus();startEngineLog();
  }

  function startEngineLog(){
    if(logTimer)clearInterval(logTimer);
    if(reduce)return;
    logTimer=setInterval(function(){
      var text=document.querySelector('.loe-log-text');var engine=document.querySelector('.loe-engine');if(!text||!engine)return;
      if(engine.dataset.focus)return;
      text.classList.add('swap');
      setTimeout(function(){logIndex=(logIndex+1)%logMessages.length;text.textContent=logMessages[logIndex];text.classList.remove('swap');},220);
    },2350);
  }

  function fingerprintSvg(seed){
    var y1=10+(seed%3)*4,y2=20+(seed%4)*3,y3=34-(seed%2)*4;
    return '<svg viewBox="0 0 80 56" aria-hidden="true">'+
      '<path d="M3 '+y1+' C18 '+(3+seed)+' 24 '+(28-seed)+' 39 '+y2+' S61 '+(8+seed)+' 77 '+(18+seed%5)+'"/>'+
      '<path d="M4 '+(20+seed%4)+' C17 '+(36-seed)+' 29 '+(5+seed)+' 43 '+y3+' S61 '+(42-seed)+' 76 '+(31+seed%4)+'"/>'+
      '<path d="M8 '+(44-seed%5)+' C24 '+(30+seed)+' 34 '+(48-seed)+' 49 '+(22+seed)+' S65 '+(16+seed)+' 73 '+(8+seed%3)+'"/>'+
      '</svg>';
  }

  function bindServiceFocus(){
    var cards=document.querySelectorAll('.home-page .section.soft .grid-3 .card');
    var map=['backoffice','research','websites','support','automation','data'];
    cards.forEach(function(card,i){
      if(!card.querySelector('.loe-fingerprint')){var fp=document.createElement('div');fp.className='loe-fingerprint';fp.innerHTML=fingerprintSvg(i+1);card.appendChild(fp);}
      card.dataset.loeKey=map[i]||'data';
      if(card.dataset.loeBound==='1')return;card.dataset.loeBound='1';
      card.addEventListener('pointerenter',function(){
        var engine=document.querySelector('.loe-engine');if(!engine)return;var key=card.dataset.loeKey;engine.dataset.focus=key;
        try{sessionStorage.setItem('zentexa_visual_focus',key);}catch(e){}
        var text=engine.querySelector('.loe-log-text');if(text){var title=card.querySelector('h3');text.textContent='Focus route → '+(title?title.textContent:'selected service');}
      });
      card.addEventListener('pointerleave',function(){var engine=document.querySelector('.loe-engine');if(engine)delete engine.dataset.focus;});
    });
  }

  function transformMarkup(){
    return '<section class="section loe-transform-section" data-loe-transform><div class="container">'+
      '<div class="center"><span class="eyebrow">Mess → System</span><h2 class="title">Watch unstructured work become an operating process.</h2><p class="lead">This is an illustrative workflow visual: scroll through it and the same loose tasks are routed through one control point, then reorganized into clear states.</p></div>'+
      '<div class="loe-transform-wrap"><div class="loe-transform-stage">'+
        '<div class="loe-zone-label left">Unstructured input</div><div class="loe-zone-label right">Organized operation</div>'+
        '<div class="loe-transform-core"><div><strong>Z</strong><span>ROUTE + REVIEW</span></div></div>'+
        '<div class="loe-lane one"><strong>VALIDATED</strong><p>Information checked and structured.</p></div>'+
        '<div class="loe-lane two"><strong>ASSIGNED</strong><p>Work routed to the right process.</p></div>'+
        '<div class="loe-lane three"><strong>READY</strong><p>Clear output prepared for action.</p></div>'+
        '<div class="loe-task" data-task="0"><b>Raw lead list</b><span>Needs structure</span></div>'+
        '<div class="loe-task" data-task="1"><b>Customer query</b><span>Needs routing</span></div>'+
        '<div class="loe-task" data-task="2"><b>Invoice note</b><span>Needs validation</span></div>'+
        '<div class="loe-task" data-task="3"><b>Duplicate row</b><span>Needs review</span></div>'+
        '<div class="loe-task" data-task="4"><b>Follow-up</b><span>Needs ownership</span></div>'+
        '<div class="loe-task" data-task="5"><b>Unsorted records</b><span>Needs output</span></div>'+
      '</div><div class="loe-transform-meter"><span>MESSY INPUT</span><div class="loe-meter-line"><i></i></div><span>CONTROLLED OUTPUT</span></div></div></div></section>';
  }

  function initTransform(){
    if(!document.body.classList.contains('home-page')||document.querySelector('[data-loe-transform]'))return;
    var core=document.querySelector('.home-page .section.soft');if(!core)return;
    var temp=document.createElement('div');temp.innerHTML=transformMarkup();core.parentNode.insertBefore(temp.firstElementChild,core);
    updateTransform();
  }

  function updateTransform(){
    var section=document.querySelector('[data-loe-transform]');if(!section)return;
    var stage=section.querySelector('.loe-transform-stage');if(!stage)return;
    var rect=section.getBoundingClientRect();var total=Math.max(1,rect.height+window.innerHeight*.2);var p=clamp((window.innerHeight*.78-rect.top)/total,0,1);var ep=ease(p);
    section.style.setProperty('--loe-transform',p.toFixed(3));stage.dataset.progress=p>.78?'done':'moving';
    var w=stage.clientWidth,h=stage.clientHeight,mobile=w<700;
    var source=mobile?[[.08,.10],[.47,.12],[.13,.24],[.52,.25],[.08,.38],[.48,.39]]:[[.06,.18],[.25,.14],[.10,.40],[.28,.48],[.07,.68],[.25,.76]];
    var dest=mobile?[[.11,.60],[.53,.61],[.12,.74],[.54,.75],[.11,.88],[.53,.89]]:[[.63,.18],[.77,.20],[.65,.45],[.78,.47],[.64,.71],[.77,.73]];
    var core=[.5,.5];
    section.querySelectorAll('.loe-task').forEach(function(task,i){
      var s=source[i],d=dest[i],x,y,rot=(i%2?1:-1)*(10+i*2)*(1-p);
      if(ep<.54){var q=ease(ep/.54);x=(s[0]+(core[0]-s[0])*q)*w;y=(s[1]+(core[1]-s[1])*q)*h;}
      else{var q2=ease((ep-.54)/.46);x=(core[0]+(d[0]-core[0])*q2)*w;y=(core[1]+(d[1]-core[1])*q2)*h;}
      task.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-50%) rotate('+rot.toFixed(1)+'deg)';
      task.classList.toggle('organized',p>.76);
      var label=task.querySelector('span');if(label&&p>.82)label.textContent=i<2?'Validated':i<4?'Assigned':'Ready for action';
    });
  }

  function initProcessTimeline(){
    if(!document.body.classList.contains('home-page'))return;
    var grids=document.querySelectorAll('.home-page .dark-section .grid-4');if(!grids.length)return;var grid=grids[0];
    if(!grid.classList.contains('loe-process-grid')){grid.classList.add('loe-process-grid');var orbit=document.createElement('div');orbit.className='loe-process-orbit';orbit.innerHTML='<i></i>';grid.appendChild(orbit);}
    updateProcessTimeline();
  }
  function updateProcessTimeline(){
    var grid=document.querySelector('.loe-process-grid');if(!grid)return;var rect=grid.getBoundingClientRect();var p=clamp((window.innerHeight*.72-rect.top)/Math.max(1,rect.height+window.innerHeight*.34),0,1);grid.style.setProperty('--loe-process',p.toFixed(3));
    var cards=grid.querySelectorAll(':scope > .dark-card');var active=Math.min(cards.length-1,Math.floor(p*cards.length));cards.forEach(function(c,i){c.classList.toggle('loe-step-active',i<=active);});
  }

  function productMarkup(){
    var steps=[['01','Receive Company Stock','incoming'],['02','Track Batch & Expiry','checked'],['03','Create Shop Order & Bill','ordered'],['04','Deliver & Deduct Stock','delivered'],['05','Record Full / Partial Payment','paid'],['06','Track Shop Khata & Dues','tracked'],['07','Returns & Monthly Reports','reported']];
    return '<div class="loe-product-engine reveal" aria-label="Ice cream distribution operations engine"><div class="loe-product-title">Ice Cream Distribution Operations Rail</div><div class="loe-product-rail"><i></i></div><div class="loe-product-steps">'+steps.map(function(s){return '<div class="loe-product-step"><b>'+s[0]+'</b><span>'+s[1]+'</span><small>'+s[2]+'</small></div>';}).join('')+'</div><div class="loe-product-status"><strong>LIVE FLOW</strong><span>Company stock entering the distributor workflow</span></div></div>';
  }
  function initProductEngine(){
    if(!document.body.classList.contains('product-page')){if(productTimer){clearInterval(productTimer);productTimer=null;}return;}
    if(document.querySelector('.loe-product-engine'))return;
    var flow=document.querySelector('.product-flow');if(!flow)return;var temp=document.createElement('div');temp.innerHTML=productMarkup();flow.replaceWith(temp.firstElementChild);startProductFlow();
  }
  function startProductFlow(){
    if(productTimer)clearInterval(productTimer);var idx=0;function paint(){var box=document.querySelector('.loe-product-engine');if(!box)return;var steps=box.querySelectorAll('.loe-product-step');steps.forEach(function(s,i){s.classList.toggle('active',i===idx);});box.style.setProperty('--loe-product-packet',(6+idx*(88/Math.max(1,steps.length-1))).toFixed(1)+'%');var status=box.querySelector('.loe-product-status span');if(status)status.textContent=steps[idx].querySelector('span').textContent;idx=(idx+1)%steps.length;}paint();if(!reduce)productTimer=setInterval(paint,1450);}

  function onScroll(){updateTransform();updateProcessTimeline();}
  function bindScroll(){if(scrollBound)return;scrollBound=true;var ticking=false;var run=function(){if(ticking)return;ticking=true;requestAnimationFrame(function(){ticking=false;onScroll();});};window.addEventListener('scroll',run,{passive:true});window.addEventListener('resize',run,{passive:true});}

  function initPreview(){
    ensureCss();initEngine();initTransform();initProcessTimeline();initProductEngine();bindScroll();
  }
  function scheduleInit(){clearTimeout(initTimer);initTimer=setTimeout(initPreview,80);}

  ensureCss();initPreview();
  document.addEventListener('DOMContentLoaded',initPreview);window.addEventListener('load',initPreview);
  observer=new MutationObserver(function(mutations){var relevant=mutations.some(function(m){return m.type==='childList'&&m.addedNodes.length;});if(relevant)scheduleInit();});observer.observe(document.body,{childList:true,subtree:false});
})();
