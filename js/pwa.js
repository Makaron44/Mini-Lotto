
(function(){
  let deferredPrompt=null; const bannerId='a2hs-banner';
  function createBanner(){ if(document.getElementById(bannerId))return;
    const bar=document.createElement('div'); bar.id=bannerId; bar.style.position='fixed';
    bar.style.left='calc(16px + env(safe-area-inset-left))'; bar.style.right='calc(16px + env(safe-area-inset-right))';
    bar.style.bottom='calc(16px + env(safe-area-inset-bottom))'; bar.style.background='var(--panel)';
    bar.style.border='1px solid var(--border)'; bar.style.borderRadius='12px'; bar.style.padding='10px';
    bar.style.paddingBottom='calc(10px + env(safe-area-inset-bottom))'; bar.style.boxShadow='0 10px 30px rgba(0,0,0,.2)'; bar.style.zIndex=9999;
    bar.innerHTML=`<div class="split"><div>✅ Zainstaluj Mini Lotto App</div><div class="toolbar"><button id="installBtn" class="btn primary">Zainstaluj</button><button id="dismissBtn" class="btn">Nie teraz</button></div></div>`;
    document.body.appendChild(bar);
    document.getElementById('dismissBtn').addEventListener('click',()=>bar.remove());
    document.getElementById('installBtn').addEventListener('click',async()=>{ if(!deferredPrompt)return; deferredPrompt.prompt(); const {outcome}=await deferredPrompt.userChoice; deferredPrompt=null; bar.remove(); if(outcome==='accepted')localStorage.setItem('mini-lotto-installed','1'); });
  }
  window.addEventListener('beforeinstallprompt',(e)=>{ e.preventDefault(); deferredPrompt=e; if(!localStorage.getItem('mini-lotto-installed')) createBanner(); });
  window.addEventListener('appinstalled',()=>{ localStorage.setItem('mini-lotto-installed','1'); const bar=document.getElementById(bannerId); if(bar)bar.remove(); });
})();
