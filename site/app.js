const runBtn = document.getElementById('runTrial');
const topicInput = document.getElementById('topic');
const statusEl = document.getElementById('trialStatus');
const resultsEl = document.getElementById('results');
const csvBtn = document.getElementById('csvBtn');
let latest = [];

function esc(v){return String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function setStatus(text){statusEl.textContent=text;}
function clean(s){return String(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}

async function runTrial(){
  const topic = topicInput.value.trim();
  if(topic.length < 2){setStatus('Enter at least 2 characters.'); topicInput.focus(); return;}
  runBtn.disabled=true; csvBtn.disabled=true; latest=[];
  setStatus('Searching the limited public trial source…');
  resultsEl.innerHTML='<tr><td colspan="3" class="empty">Searching…</td></tr>';
  try{
    const url=new URL('https://en.wikipedia.org/w/api.php');
    url.searchParams.set('action','query'); url.searchParams.set('list','search'); url.searchParams.set('srsearch',topic); url.searchParams.set('format','json'); url.searchParams.set('utf8','1'); url.searchParams.set('srlimit','10'); url.searchParams.set('origin','*');
    const r=await fetch(url);
    if(!r.ok) throw new Error('Public trial source returned an error.');
    const data=await r.json();
    latest=(data.query?.search||[]).slice(0,10).map(x=>({title:clean(x.title),source:'Wikipedia',url:'https://en.wikipedia.org/wiki/'+encodeURIComponent(String(x.title||'').replaceAll(' ','_')),snippet:clean(x.snippet).slice(0,500)}));
    if(!latest.length){resultsEl.innerHTML='<tr><td colspan="3" class="empty">No trial records found.</td></tr>'; setStatus('No results. Try a broader topic.'); return;}
    resultsEl.innerHTML=latest.map((x,i)=>`<tr><td>${i+1}</td><td><a class="result-link" href="${esc(x.url)}" target="_blank" rel="noreferrer">${esc(x.title)}</a></td><td>${esc(x.source)}</td></tr>`).join('');
    setStatus(`${latest.length} source-backed trial records found.`); csvBtn.disabled=false;
  }catch(e){
    resultsEl.innerHTML='<tr><td colspan="3" class="empty">Trial service is unavailable right now.</td></tr>'; setStatus(e.message || 'Trial failed.');
  }finally{runBtn.disabled=false;}
}
runBtn.addEventListener('click',runTrial); topicInput.addEventListener('keydown',e=>{if(e.key==='Enter')runTrial();});
csvBtn.addEventListener('click',()=>{
  if(!latest.length)return;
  const rows=[['title','source','url','snippet'],...latest.map(x=>[x.title,x.source,x.url,x.snippet||''])];
  const csv=rows.map(r=>r.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\n');
  const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='datascrappe-trial.csv'; a.click(); URL.revokeObjectURL(a.href);
});
