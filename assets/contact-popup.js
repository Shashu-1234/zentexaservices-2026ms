(function(){
  'use strict';
  var delayMs=60000;
  var elapsed=false,previousFocus=null,submitting=false,dismissed=false;
  function contactPageActive(){return (location.pathname==='/get-in-touch.html'||location.pathname==='/contact.html')&&!!document.getElementById('fmessage');}
  function closePopup(){
    var layer=document.getElementById('zen-contact-popup');
    if(layer)layer.remove();
    document.body.classList.remove('zen-popup-open');
    document.removeEventListener('keydown',handleKeys,true);
    dismissed=true;
    if(previousFocus&&document.contains(previousFocus)&&typeof previousFocus.focus==='function')previousFocus.focus({preventScroll:true});
  }
  function handleKeys(event){
    var layer=document.getElementById('zen-contact-popup');
    if(!layer)return;
    if(event.key==='Escape'){event.preventDefault();closePopup();return;}
    if(event.key!=='Tab')return;
    var focusable=Array.from(layer.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'));
    if(!focusable.length){event.preventDefault();return;}
    var first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&(document.activeElement===first||!layer.contains(document.activeElement))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(document.activeElement===last||!layer.contains(document.activeElement))){event.preventDefault();first.focus();}
  }
  function showStatus(message,kind){
    var el=document.getElementById('zen-popup-status');
    if(!el)return;
    el.dataset.kind=kind;
    el.textContent=message;
  }
  function onSubmit(event){
    event.preventDefault();
    if(submitting)return;
    var form=event.currentTarget;
    if(!form.reportValidity())return;
    var fields=new FormData(form);
    var payload={
      name:String(fields.get('name')||'').trim(),
      email:String(fields.get('email')||'').trim(),
      phone:String(fields.get('phone')||'').trim(),
      company:String(fields.get('company')||'').trim(),
      service:String(fields.get('service')||'').trim(),
      message:String(fields.get('message')||'').trim(),
      source:'Zentexa Services 60-second website popup'
    };
    if(!payload.name||!payload.email||!payload.phone||!payload.service||!payload.message){showStatus('Please fill in all required fields.','error');return;}
    if(payload.name.length>120||payload.email.length>254||payload.phone.length>32||payload.company.length>160||payload.message.length>3000){showStatus('Please shorten your information and try again.','error');return;}
    var digits=payload.phone.replace(/\D/g,'');if(digits.length<7||digits.length>15){showStatus('Please enter a valid contact number.','error');return;}
    var btn=form.querySelector('.zen-popup-submit');
    submitting=true;btn.disabled=true;btn.textContent='Sending...';
    fetch('https://formspree.io/f/xgordwok',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
      .then(function(response){if(!response.ok)throw new Error('Formspree request failed');form.reset();showStatus('Thank you! Your message has been sent to Zentexa Services.','success');})
      .catch(function(){showStatus('Message could not be sent. Please email zentexa.services@gmail.com directly.','error');})
      .finally(function(){submitting=false;btn.disabled=false;btn.textContent='Send Message →';});
  }
  function showPopup(){
    if(dismissed||contactPageActive())return;
    var existing=document.getElementById('zen-contact-popup');
    if(existing){document.body.classList.add('zen-popup-open');return;}
    previousFocus=document.activeElement;
    var layer=document.createElement('div');
    layer.id='zen-contact-popup';layer.className='zen-popup-layer';
    layer.innerHTML='<div class="zen-popup-card" role="dialog" aria-modal="true" aria-labelledby="zen-popup-title" tabindex="-1">'+
      '<button class="zen-popup-close" type="button" aria-label="Close contact form" title="Close">×</button>'+
      '<h2 id="zen-popup-title">Send a Message</h2>'+
      '<form id="zen-popup-form">'+
      '<div class="zen-popup-grid">'+
        '<div class="zen-popup-field"><label for="zen-name">Your Name *</label><input id="zen-name" name="name" maxlength="120" autocomplete="name" placeholder="Your name" required></div>'+
        '<div class="zen-popup-field"><label for="zen-email">Email Address *</label><input id="zen-email" name="email" maxlength="254" type="email" autocomplete="email" placeholder="name@company.com" required></div>'+
        '<div class="zen-popup-field"><label for="zen-phone">Contact Number *</label><input id="zen-phone" name="phone" maxlength="32" type="tel" autocomplete="tel" placeholder="+91 98765 43210" required></div>'+
        '<div class="zen-popup-field"><label for="zen-company">Company / Organization</label><input id="zen-company" name="company" maxlength="160" autocomplete="organization" placeholder="Company name"></div>'+
      '</div>'+
      '<div class="zen-popup-field"><label for="zen-service">Service / Product *</label><select id="zen-service" name="service" required>'+
        '<option value="">Select an option</option><option>Ice Cream Distribution Manager Demo</option><option>Data Entry</option><option>Back-Office Support</option><option>Customer Support</option><option>Business Research</option><option>HR Support</option><option>Dashboard</option><option>Web Development</option><option>Automation</option><option>AI Calling Agents</option><option>Agentic Systems</option>'+ 
      '</select></div>'+
      '<div class="zen-popup-field"><label for="zen-details">Project Details *</label><textarea id="zen-details" name="message" maxlength="3000" placeholder="Tell us about your project, workflow, timeline or demo requirement..." required></textarea></div>'+
      '<button class="zen-popup-submit" type="submit">Send Message →</button>'+
      '<div class="zen-popup-status" id="zen-popup-status" role="status" aria-live="polite"></div>'+
      '</form></div>';
    document.body.appendChild(layer);
    document.body.classList.add('zen-popup-open');
    layer.querySelector('.zen-popup-close').addEventListener('click',closePopup);
    layer.querySelector('form').addEventListener('submit',onSubmit);
    document.addEventListener('keydown',handleKeys,true);
    layer.querySelector('.zen-popup-close').focus({preventScroll:true});
  }
  function onPageChange(){
    if(dismissed)return;
    if(document.getElementById('zen-contact-popup')){document.body.classList.add('zen-popup-open');return;}
    if(elapsed)showPopup();
  }
  window.zentexaPopupPageChange=onPageChange;
  function init(){
    window.setTimeout(function(){elapsed=true;onPageChange();},delayMs);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
