(function(){
  'use strict';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var state={mode:'services',focus:0,manual:false,cycle:null,packetAnim:null,resizeTimer:null};
  var modes={
    services:{
      button:'Services',toolbar:'Service routing map',hub:'OPERATIONS',log:'Routing one incoming task through the right Zentexa capability.',sequential:false,
      nodes:[
        ['01','Data & Reports',14,25],['02','Research',40,14],['03','Customer Support',79,23],['04','Websites',88,50],['05','Automation',76,79],['06','Dashboards',47,88],['07','Back Office',14,74]
      ]
    },
    process:{
      button:'How We Work',toolbar:'Delivery process map',hub:'DELIVERY CORE',log:'The same visual system now follows Zentexa’s delivery process.',sequential:true,
      nodes:[
        ['01','Requirement',14,26],['02','Understand',40,14],['03','Sample',79,23],['04','Execute',88,50],['05','Human Review',76,79],['06','Deliver',47,88],['07','Improve',14,74]
      ]
    },
    product:{
      button:'Ice Cream Product',toolbar:'Ice cream distribution map',hub:'DISTRIBUTION',log:'The same map now follows the real Ice Cream Distribution Manager workflow.',sequential:true,
      nodes:[
        ['01','Company Stock',14,26],['02','Batch & Expiry',40,14],['03','Shop Order & Bill',79,23],['04','Delivery',88,50],['05','Payment',76,79],['06','Shop Khata',47,88],['07','Returns & Reports',14,74]
      ]
    }
  };

  function markup(){
    return '<section class="zo-map-section" id="living-map" aria-labelledby="zo-map-title">'+
      '<div class="container">'+
        '<div class="zo-map-head"><div><span class="eyebrow">Living Operations Map</span><h2 class="title" id="zo-map-title">One map. Different Zentexa workflows.</h2><p class="lead">Move across the nodes, then switch modes. The same spatial system changes from service routing to delivery process to the Ice Cream Distribution Manager workflow.</p></div><div class="zo-map-controls" role="group" aria-label="Map mode"><button class="zo-mode active" type="button" data-mode="services">Services</button><button class="zo-mode" type="button" data-mode="process">How We Work</button><button class="zo-mode" type="button" data-mode="product">Ice Cream Product</button></div></div>'+
        '<div class="zo-map-shell" data-zo-map>'+
          '<div class="zo-map-toolbar"><span class="zo-toolbar-title">Service routing map</span><span class="zo-map-live"><i></i>Interactive workflow</span></div>'+
          '<div class="zo-map-stage">'+
            '<svg class="zo-map-lines" aria-hidden="true"></svg>'+
            '<div class="zo-port in"><span>Incoming</span><b>NEW TASK</b></div>'+
            '<div class="zo-port out"><span>Outcome</span><b>DELIVERED ✓</b></div>'+
            '<div class="zo-hub"><div><b>ZENTEXA</b><span class="zo-hub-label">OPERATIONS</span><em>ROUTE • REVIEW • OUTPUT</em></div></div>'+
            '<button class="zo-node" type="button" data-node="0"></button>'+
            '<button class="zo-node" type="button" data-node="1"></button>'+
            '<button class="zo-node" type="button" data-node="2"></button>'+
            '<button class="zo-node" type="button" data-node="3"></button>'+
            '<button class="zo-node" type="button" data-node="4"></button>'+
            '<button class="zo-node" type="button" data-node="5"></button>'+
            '<button class="zo-node" type="button" data-node="6"></button>'+
            '<div class="zo-packet" aria-hidden="true"></div><div class="zo-packet-label" aria-hidden="true">NEW TASK</div>'+
            '<div class="zo-map-tip">Hover or tap a node to reroute the task</div>'+
          '</div>'+
          '<div class="zo-map-log"><em>ROUTE</em><span class="zo-log-text"><strong>Services:</strong> Routing one incoming task through the right Zentexa capability.</span><span class="zo-log-mode">services mode</span></div>'+
        '</div>'+
      '</div>'+
    '</section>';
  }

  function insertMap(){
    if(document.querySelector('[data-zo-map]'))return;
    var hero=document.querySelector('#visual-lab')||document.querySelector('.hero');if(!hero)return;
    var holder=document.createElement('div');holder.innerHTML=markup();hero.insertAdjacentElement('afterend',holder.firstElementChild);
    var firstHeroButton=hero.querySelector('.btn-primary');if(firstHeroButton){firstHeroButton.setAttribute('href','#living-map');firstHeroButton.textContent='Open the Living Map →';}
    bind();applyMode('services',true);
  }

  function bind(){
    document.querySelectorAll('.zo-mode').forEach(function(btn){btn.addEventListener('click',function(){applyMode(btn.dataset.mode,false);});});
    document.querySelectorAll('.zo-node').forEach(function(node){
      node.addEventListener('pointerenter',function(){state.manual=true;focusNode(Number(node.dataset.node),true);});
      node.addEventListener('pointerleave',function(){state.manual=false;focusNode(state.focus,false);});
      node.addEventListener('focus',function(){state.manual=true;focusNode(Number(node.dataset.node),true);});
      node.addEventListener('blur',function(){state.manual=false;focusNode(state.focus,false);});
      node.addEventListener('click',function(){state.focus=Number(node.dataset.node);focusNode(state.focus,true);restartPacket();});
    });
    window.addEventListener('resize',function(){clearTimeout(state.resizeTimer);state.resizeTimer=setTimeout(function(){drawLinks();restartPacket();},120);},{passive:true});
  }

  function applyMode(name,instant){
    var mode=modes[name];if(!mode)return;state.mode=name;state.focus=0;state.manual=false;
    document.querySelectorAll('.zo-mode').forEach(function(btn){btn.classList.toggle('active',btn.dataset.mode===name);btn.setAttribute('aria-pressed',btn.dataset.mode===name?'true':'false');});
    var shell=document.querySelector('[data-zo-map]');if(shell)shell.dataset.mode=name;
    var toolbar=document.querySelector('.zo-toolbar-title');if(toolbar)toolbar.textContent=mode.toolbar;
    var hubLabel=document.querySelector('.zo-hub-label');if(hubLabel)hubLabel.textContent=mode.hub;
    var logMode=document.querySelector('.zo-log-mode');if(logMode)logMode.textContent=mode.button+' mode';
    document.querySelectorAll('.zo-node').forEach(function(node,i){var n=mode.nodes[i];node.style.setProperty('--x',n[2]+'%');node.style.setProperty('--y',n[3]+'%');node.innerHTML='<small><span>'+n[0]+'</span><i>'+mode.button+'</i></small><strong>'+n[1]+'</strong>';node.classList.remove('hidden','dimmed','focused');});
    updateLog(mode.button,mode.log);
    clearInterval(state.cycle);state.cycle=null;
    var redraw=function(){drawLinks();focusNode(0,false);restartPacket();startCycle();};
    if(instant)requestAnimationFrame(redraw);else setTimeout(redraw,690);
  }

  function stageMetrics(){
    var stage=document.querySelector('.zo-map-stage');if(!stage)return null;var w=stage.clientWidth,h=stage.clientHeight,mobile=w<650;
    return {stage:stage,w:w,h:h,hub:{x:w*.5,y:h*.5},input:mobile?{x:58,y:h-48}:{x:62,y:h*.5},output:mobile?{x:w-58,y:h-48}:{x:w-62,y:h*.5}};
  }
  function nodePoint(index,m){var n=modes[state.mode].nodes[index];return{x:m.w*n[2]/100,y:m.h*n[3]/100};}
  function pathD(a,b,bend){
    var dx=b.x-a.x,dy=b.y-a.y;if(!bend)return'M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' L '+b.x.toFixed(1)+' '+b.y.toFixed(1);
    var cx=(a.x+b.x)/2+(dy>0?-1:1)*Math.min(42,Math.abs(dy)*.08),cy=(a.y+b.y)/2+(dx>0?1:-1)*Math.min(42,Math.abs(dx)*.08);
    return'M '+a.x.toFixed(1)+' '+a.y.toFixed(1)+' Q '+cx.toFixed(1)+' '+cy.toFixed(1)+' '+b.x.toFixed(1)+' '+b.y.toFixed(1);
  }

  function drawLinks(){
    var m=stageMetrics(),svg=document.querySelector('.zo-map-lines');if(!m||!svg)return;svg.setAttribute('viewBox','0 0 '+m.w+' '+m.h);var mode=modes[state.mode],html=[];
    if(!mode.sequential){
      html.push('<path class="zo-link route-in active" data-edge="in" d="'+pathD(m.input,m.hub,true)+'"/>');
      mode.nodes.forEach(function(_,i){html.push('<path class="zo-link radial" data-edge="n'+i+'" d="'+pathD(m.hub,nodePoint(i,m),true)+'"/>');});
      html.push('<path class="zo-link route-out active" data-edge="out" d="'+pathD(m.hub,m.output,true)+'"/>');
    }else{
      mode.nodes.forEach(function(_,i){html.push('<path class="zo-link secondary radial" data-edge="r'+i+'" d="'+pathD(m.hub,nodePoint(i,m),false)+'"/>');});
      var prev=m.input;mode.nodes.forEach(function(_,i){var p=nodePoint(i,m);html.push('<path class="zo-link sequence" data-edge="s'+i+'" d="'+pathD(prev,p,true)+'"/>');prev=p;});
      html.push('<path class="zo-link sequence" data-edge="sout" d="'+pathD(prev,m.output,true)+'"/>');
    }
    svg.innerHTML=html.join('');highlightLinks(state.focus);
  }

  function highlightLinks(index){
    var mode=modes[state.mode];document.querySelectorAll('.zo-link').forEach(function(p){p.classList.remove('active');});
    if(!mode.sequential){
      var a=document.querySelector('[data-edge="in"]'),b=document.querySelector('[data-edge="n'+index+'"]'),c=document.querySelector('[data-edge="out"]');if(a)a.classList.add('active');if(b)b.classList.add('active');if(c)c.classList.add('active');
    }else{
      document.querySelectorAll('.zo-link.radial').forEach(function(p,i){p.classList.toggle('active',i===index);});
      document.querySelectorAll('.zo-link.sequence').forEach(function(p,i){p.classList.toggle('active',i<=index+1);});
    }
  }

  function focusNode(index,manual){
    var mode=modes[state.mode];state.focus=index;document.querySelectorAll('.zo-node').forEach(function(n,i){n.classList.toggle('focused',i===index);n.classList.toggle('dimmed',manual&&i!==index);});highlightLinks(index);
    var item=mode.nodes[index];
    if(manual){updateLog(item[1],mode.sequential?'This step is part of the '+mode.button+' sequence.':'Incoming work is routed through '+item[1]+' and returns to the Zentexa operations core.');if(!mode.sequential)restartPacket();}
    else updateLog(mode.button,mode.log);
  }

  function updateLog(label,text){var el=document.querySelector('.zo-log-text');if(el)el.innerHTML='<strong>'+label+':</strong> '+text;}

  function packetPoints(){
    var m=stageMetrics();if(!m)return[];var mode=modes[state.mode];
    if(!mode.sequential)return[m.input,m.hub,nodePoint(state.focus,m),m.hub,m.output];
    var arr=[m.input];mode.nodes.forEach(function(_,i){arr.push(nodePoint(i,m));});arr.push(m.output);return arr;
  }
  function restartPacket(){
    if(state.packetAnim){try{state.packetAnim.cancel();}catch(e){}state.packetAnim=null;}
    var packet=document.querySelector('.zo-packet'),label=document.querySelector('.zo-packet-label'),pts=packetPoints();if(!packet||!label||!pts.length)return;
    var frames=pts.map(function(p,i){return{left:p.x+'px',top:p.y+'px',offset:i/(pts.length-1)};});
    packet.style.left=pts[0].x+'px';packet.style.top=pts[0].y+'px';label.style.left=pts[0].x+'px';label.style.top=pts[0].y+'px';
    if(reduce)return;
    var duration=modes[state.mode].sequential?9000:4400;
    state.packetAnim=packet.animate(frames,{duration:duration,iterations:Infinity,easing:'linear'});
    label.animate(frames,{duration:duration,iterations:Infinity,easing:'linear'});
  }

  function startCycle(){
    if(reduce)return;clearInterval(state.cycle);
    state.cycle=setInterval(function(){if(state.manual)return;state.focus=(state.focus+1)%modes[state.mode].nodes.length;focusNode(state.focus,false);if(!modes[state.mode].sequential)restartPacket();},2600);
  }

  function init(){insertMap();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
