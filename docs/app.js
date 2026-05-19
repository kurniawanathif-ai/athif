function $(sel){return document.querySelector(sel)}
function show(view){document.querySelectorAll('.view').forEach(v=>v.style.display='none'); $("#"+view).style.display='block'}

document.querySelectorAll('nav button').forEach(btn=>{
  btn.addEventListener('click', ()=> show(btn.dataset.view));
});

async function loadSetup(){
  const res = await fetch('/api/setup');
  const j = await res.json();
  $('#setup-content').innerText = j.instructions + '\nSaved: ' + JSON.stringify(j.saved);
  const form = $('#setup-form');
  form.project.value = j.saved.project || '';
  form.repo.value = j.saved.repo || '';
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const body = { project: form.project.value, repo: form.repo.value };
    await fetch('/api/setup',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    loadSetup();
  });
}

async function loadBiaya(){
  const res = await fetch('/api/biaya');
  const j = await res.json();
  $('#biaya-content').innerHTML = j.plans.map(p=>`<div><strong>${p.name}</strong>: $${p.price} - ${p.notes||p.bandwidth||''}</div>`).join('');
}

async function loadBandwidth(){
  const res = await fetch('/api/bandwidth');
  const j = await res.json();
  $('#bandwidth-content').innerText = `Month ${j.usage.month}: ${j.usage.usedGB}GB used / ${j.usage.limitGB}GB limit\nOverage: $${j.overagePricePerGB}/GB`;
}

async function loadBackend(){
  const res = await fetch('/api/backend');
  const j = await res.json();
  $('#backend-content').innerText = JSON.stringify(j, null, 2);
}

// initial load
show('setup');
loadSetup(); loadBiaya(); loadBandwidth(); loadBackend();
