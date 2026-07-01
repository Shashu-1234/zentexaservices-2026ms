var routeMap={'services.html':'our-services.html','ai-automation.html':'automation.html','contact.html':'get-in-touch.html'};
var siteUrl='https://zentexaservices.vercel.app';
var pageSeo={
  '/': ['Zentexa Services | Business Support, Web Development & Automation','Zentexa Services helps growing businesses with data entry, back-office support, customer support, business research, web development, dashboards and automation.','Zentexa Services, business support, web development, automation, data entry, back office, Belagavi'],
  '/index.html': ['Zentexa Services | Business Support, Web Development & Automation','Zentexa Services helps growing businesses with data entry, back-office support, customer support, business research, web development, dashboards and automation.','Zentexa Services, business support, web development, automation, data entry, back office, Belagavi'],
  '/about.html': ['About Zentexa Services | Business Support & Automation Company','Learn about Zentexa Services, a Belagavi-based business support, web development and automation company focused on quality-first delivery.','about Zentexa Services, business support company, automation company, Belagavi'],
  '/our-services.html': ['Services | Zentexa Services','Explore Zentexa Services for data entry, back-office support, customer support, business research, HR support, dashboards, web development and automation.','data entry, back office support, customer support, web development, business research, dashboards'],
  '/automation.html': ['Automation | Zentexa Services','Automation services for small businesses including chat systems, booking flows, reminders, CRM updates and workflow automation.','AI automation, workflow automation, appointment booking, CRM updates, reminders'],
  '/portfolio.html': ['Portfolio | Zentexa Services','View Zentexa Services portfolio examples including business software, trackers, websites, research workflows, HR support and automation systems.','Zentexa portfolio, business software, trackers, web development portfolio'],
  '/pricing.html': ['Pricing | Zentexa Services','Flexible pricing for Zentexa Services including per-task, monthly support and automation project pricing.','Zentexa pricing, business support pricing, web development pricing, automation pricing'],
  '/get-in-touch.html': ['Contact Zentexa Services | Get a Project Quote','Contact Zentexa Services for data entry, business support, web development, dashboards and automation projects.','contact Zentexa Services, project quote, business support Belagavi']
};

function setMeta(attr,key,value){
  var selector='meta['+attr+'="'+key+'"]';
  var el=document.head.querySelector(selector);
  if(!el){el=document.createElement('meta');el.setAttribute(attr,key);document.head.appendChild(el);}
  el.setAttribute('content',value);
}
function setCanonical(url){
  var el=document.head.querySelector('link[rel="canonical"]');
  if(!el){el=document.createElement('link');el.setAttribute('rel','canonical');document.head.appendChild(el);}
  el.setAttribute('href',url);
}
function applySeo(){
  var path=window.location.pathname || '/';
  if(path==='/services.html') path='/our-services.html';
  if(path==='/contact.html') path='/get-in-touch.html';
  if(path==='/ai-automation.html') path='/automation.html';
  var data=pageSeo[path]||pageSeo['/'];
  var canonical=siteUrl+(path==='/'?'/':path);
  document.title=data[0];
  setMeta('name','description',data[1]);
  setMeta('name','keywords',data[2]);
  setMeta('name','author','Zentexa Services');
  setMeta('name','robots','index, follow');
  setMeta('name','theme-color','#041223');
  setMeta('property','og:title',data[0]);
  setMeta('property','og:description',data[1]);
  setMeta('property','og:type','website');
  setMeta('property','og:url',canonical);
  setMeta('property','og:site_name','Zentexa Services');
  setMeta('name','twitter:card','summary_large_image');
  setMeta('name','twitter:title',data[0]);
  setMeta('name','twitter:description',data[1]);
  setCanonical(canonical);
}
function loadMobileCss(){
  if(!document.querySelector('link[href="assets/mobile.css"]')){
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='assets/mobile.css';
    document.head.appendChild(link);
  }
}
function applySharedFixes(){
  loadMobileCss();
  applySeo();
  document.querySelectorAll('a[href]').forEach(function(a){
    var href=a.getAttribute('href');
    if(routeMap[href]) a.setAttribute('href',routeMap[href]);
  });
  document.querySelectorAll('.brand-mark').forEach(function(el){el.style.display='none';});
  document.querySelectorAll('.brand-text .svc').forEach(function(el){el.textContent='SERVICES';});
  document.querySelectorAll('.hero-card .glass:nth-child(2)').forEach(function(el){el.remove();});
}
applySharedFixes();
document.addEventListener('DOMContentLoaded',applySharedFixes);
function toggleMenu(){var nav=document.getElementById('navLinks');if(nav)nav.classList.toggle('open');}
document.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',function(){var nav=document.getElementById('navLinks');if(nav)nav.classList.remove('open');});});
window.addEventListener('scroll',function(){var siteNav=document.getElementById('siteNav');if(siteNav)siteNav.classList.toggle('scrolled',window.scrollY>30);});
window.addEventListener('load',function(){var items=document.querySelectorAll('.reveal');if(!('IntersectionObserver'in window)){items.forEach(function(el){el.classList.remove('hide');});return;}items.forEach(function(el){el.classList.add('hide');});var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.remove('hide');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -20px 0px'});items.forEach(function(el){observer.observe(el);});setTimeout(function(){document.querySelectorAll('.reveal.hide').forEach(function(el){el.classList.remove('hide');});},1300);});
function showForm(success,message){var ok=document.getElementById('fsuccess');var err=document.getElementById('ferror');if(!ok||!err)return;ok.style.display=success?'block':'none';err.style.display=success?'none':'block';if(message){if(success)ok.textContent=message;else err.textContent=message;}}
function submitForm(){var name=document.getElementById('fname');var email=document.getElementById('femail');var phone=document.getElementById('fphone');var company=document.getElementById('fcompany');var service=document.getElementById('fservice');var message=document.getElementById('fmessage');var button=document.querySelector('.form-submit');if(!name||!email||!phone||!service||!message)return;var payload={name:name.value.trim(),email:email.value.trim(),phone:phone.value.trim(),company:company?company.value.trim():'',service:service.value,message:message.value.trim(),source:'Zentexa Services website'};if(!payload.name||!payload.email||!payload.phone||!payload.service||!payload.message){showForm(false,'Please fill in all required fields.');return;}if(!/^\S+@\S+\.\S+$/.test(payload.email)){showForm(false,'Please enter a valid email address.');return;}if(button){button.disabled=true;button.textContent='Sending...';}fetch('https://formspree.io/f/xgordwok',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)}).then(function(response){if(response.ok){showForm(true,'✅ Thank you! Zentexa Services will get back to you within 24 hours.');['fname','femail','fphone','fcompany','fservice','fmessage'].forEach(function(id){var field=document.getElementById(id);if(field)field.value='';});}else{showForm(false,'Message could not be sent. Please email zentexa.services@gmail.com directly.');}}).catch(function(){showForm(false,'Network error. Please email zentexa.services@gmail.com directly.');}).finally(function(){if(button){button.disabled=false;button.textContent='Send Message →';}});}
