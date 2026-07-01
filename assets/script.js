(function(){
  var css = '.brand{gap:0!important;align-items:center!important}.brand-mark{display:none!important}.brand-text{font-size:22px!important;font-weight:1000!important;letter-spacing:1.3px!important;line-height:1!important;white-space:nowrap!important}.brand-text .zen{color:#1f6fe5!important}.brand-text .texa{color:#84df68!important}.brand-text .svc{color:#f4f7fb!important;font-size:19px!important;font-weight:800!important;margin-left:8px!important;text-transform:uppercase!important}.footer .zen{color:#1f6fe5!important}.footer .texa{color:#84df68!important}.glass h3{color:#0a2a5e!important;margin-bottom:10px!important}.glass p,.hero .glass p{color:#4b5870!important;font-size:15px!important;line-height:1.75!important;margin-bottom:0!important}.hero-card .glass:nth-child(2) h3{font-size:0!important}.hero-card .glass:nth-child(2) h3:after{content:"What we handle"!important;font-size:19px!important;color:#0a2a5e!important}@media(max-width:760px){.brand-text{font-size:18px!important}.brand-text .svc{font-size:16px!important;margin-left:6px!important}}@media(max-width:430px){.brand-text .svc{display:none!important}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

var routeMap = {'services.html':'our-services.html','ai-automation.html':'automation.html','contact.html':'get-in-touch.html'};
document.querySelectorAll('a[href]').forEach(function(a){
  var h = a.getAttribute('href');
  if(routeMap[h]) a.setAttribute('href', routeMap[h]);
});

document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.brand-text .svc').forEach(function(el){ el.textContent = 'SERVICES'; });
  document.querySelectorAll('.hero-card .glass:nth-child(2) h3').forEach(function(el){ el.textContent = 'What we handle'; });
});

function toggleMenu(){
  var nav = document.getElementById('navLinks');
  if(nav) nav.classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(function(a){
  a.addEventListener('click', function(){
    var nav = document.getElementById('navLinks');
    if(nav) nav.classList.remove('open');
  });
});

window.addEventListener('scroll', function(){
  var siteNav = document.getElementById('siteNav');
  if(siteNav) siteNav.classList.toggle('scrolled', window.scrollY > 30);
});

window.addEventListener('load', function(){
  var items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)) return;
  items.forEach(function(el){ el.classList.add('hide'); });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.remove('hide');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: .08});
  items.forEach(function(el){ io.observe(el); });
  setTimeout(function(){
    document.querySelectorAll('.reveal.hide').forEach(function(el){ el.classList.remove('hide'); });
  }, 1300);
});

function showForm(success, msg){
  var ok = document.getElementById('fsuccess');
  var er = document.getElementById('ferror');
  if(!ok || !er) return;
  ok.style.display = success ? 'block' : 'none';
  er.style.display = success ? 'none' : 'block';
  if(msg) er.textContent = msg;
}

function submitForm(){
  var required = ['fname','femail','fphone','fservice','fmessage'];
  for(var i = 0; i < required.length; i++){
    var field = document.getElementById(required[i]);
    if(!field || !field.value.trim()){
      showForm(false, 'Please fill in all required fields.');
      return;
    }
  }
  showForm(true, 'Thank you! Zentexa Services will get back to you within 24 hours.');
}
