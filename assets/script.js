var routeMap={'services.html':'our-services.html','ai-automation.html':'automation.html','contact.html':'get-in-touch.html'};

function applySharedFixes(){
  document.querySelectorAll('a[href]').forEach(function(a){
    var href=a.getAttribute('href');
    if(routeMap[href]) a.setAttribute('href',routeMap[href]);
  });
  document.querySelectorAll('.brand-text .svc').forEach(function(el){el.textContent='SERVICES';});
  document.querySelectorAll('.hero-card .glass:nth-child(2)').forEach(function(el){el.remove();});
}

applySharedFixes();
document.addEventListener('DOMContentLoaded',applySharedFixes);

function toggleMenu(){
  var nav=document.getElementById('navLinks');
  if(nav) nav.classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(function(a){
  a.addEventListener('click',function(){
    var nav=document.getElementById('navLinks');
    if(nav) nav.classList.remove('open');
  });
});

window.addEventListener('scroll',function(){
  var siteNav=document.getElementById('siteNav');
  if(siteNav) siteNav.classList.toggle('scrolled',window.scrollY>30);
});

window.addEventListener('load',function(){
  var items=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(function(el){el.classList.remove('hide');});
    return;
  }
  items.forEach(function(el){el.classList.add('hide');});
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.remove('hide');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -20px 0px'});
  items.forEach(function(el){observer.observe(el);});
  setTimeout(function(){
    document.querySelectorAll('.reveal.hide').forEach(function(el){el.classList.remove('hide');});
  },1300);
});

function showForm(success,message){
  var ok=document.getElementById('fsuccess');
  var err=document.getElementById('ferror');
  if(!ok||!err) return;
  ok.style.display=success?'block':'none';
  err.style.display=success?'none':'block';
  if(message){
    if(success) ok.textContent=message;
    else err.textContent=message;
  }
}

function submitForm(){
  var name=document.getElementById('fname');
  var email=document.getElementById('femail');
  var phone=document.getElementById('fphone');
  var company=document.getElementById('fcompany');
  var service=document.getElementById('fservice');
  var message=document.getElementById('fmessage');
  var button=document.querySelector('.form-submit');

  if(!name||!email||!phone||!service||!message) return;
  var payload={
    name:name.value.trim(),
    email:email.value.trim(),
    phone:phone.value.trim(),
    company:company?company.value.trim():'',
    service:service.value,
    message:message.value.trim(),
    source:'Zentexa Services website'
  };

  if(!payload.name||!payload.email||!payload.phone||!payload.service||!payload.message){
    showForm(false,'Please fill in all required fields.');
    return;
  }
  if(!/^\S+@\S+\.\S+$/.test(payload.email)){
    showForm(false,'Please enter a valid email address.');
    return;
  }

  if(button){button.disabled=true;button.textContent='Sending...';}
  fetch('https://formspree.io/f/xgordwok',{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify(payload)
  }).then(function(response){
    if(response.ok){
      showForm(true,'✅ Thank you! Zentexa Services will get back to you within 24 hours.');
      ['fname','femail','fphone','fcompany','fservice','fmessage'].forEach(function(id){
        var field=document.getElementById(id);
        if(field) field.value='';
      });
    }else{
      showForm(false,'Message could not be sent. Please email zentexa.services@gmail.com directly.');
    }
  }).catch(function(){
    showForm(false,'Network error. Please email zentexa.services@gmail.com directly.');
  }).finally(function(){
    if(button){button.disabled=false;button.textContent='Send Message →';}
  });
}
