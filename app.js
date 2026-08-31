const D=window.TRIP_DATA;
const $=(s)=>document.querySelector(s);
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actionHtml=(a)=>{const [label,url,type]=a;const cls=type==='route'?'route-button':type==='map'?'map-button':'button';return `<a class="${cls}" target="_blank" rel="noopener" href="${esc(url)}">${esc(label)}</a>`};
const transportHtml=(t)=>!t?'':`<div class="transport"><div class="transport-head"><span>${esc(t.head)}</span><span class="fare">${esc(t.fare||'')}</span></div>${(t.steps||[]).map(s=>`<div class="step">${esc(s)}</div>`).join('')}</div>`;

$('#quickLinks').innerHTML=D.quickLinks.map(x=>`<div class="quick-item"><div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div><a class="button" target="_blank" rel="noopener" href="${esc(x.url)}">${esc(x.label)}</a></div>`).join('');
$('#costGrid').innerHTML=D.costs.map(([a,b])=>`<div class="cost-box"><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('');
$('#days').innerHTML=D.days.map(day=>`<section class="card day" id="${esc(day.id)}"><div class="day-head"><div><div class="day-no">${esc(day.no)}</div><div class="day-title">${esc(day.title)}</div></div><div class="day-date">${esc(day.date)}</div></div><div class="day-cover"><img src="${esc(day.image)}" alt="${esc(day.alt)}" loading="lazy" referrerpolicy="no-referrer"></div>${day.items.map(item=>`<div class="item"><div class="time">${esc(item.time)}</div><div><h3>${esc(item.title)}</h3>${item.desc?`<p>${esc(item.desc)}</p>`:''}${transportHtml(item.transport)}${item.actions?.length?`<div class="actions">${item.actions.map(actionHtml).join('')}</div>`:''}</div></div>`).join('')}</section>`).join('');
$('#travelInfo').innerHTML=D.travelInfo.map(x=>`<div class="info-item"><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></div>`).join('');
$('#checklist').innerHTML=D.checklist.map(([title,items])=>`<div class="check-title">${esc(title)}</div>${items.map(([k,title,desc])=>`<label class="check"><input type="checkbox" data-k="${esc(k)}"><span><b>${esc(title)}</b><small>${esc(desc)}</small></span></label>`).join('')}`).join('');
$('#bottomNav').innerHTML=D.days.map((d,i)=>`<button class="nav${i===0?' active':''}" data-id="${esc(d.id)}"><b>D${i+1}</b>${esc(['抵達','購物','京都','USJ','回台'][i])}</button>`).join('');

document.querySelectorAll('[data-k]').forEach(c=>{const k='osaka_2026_'+c.dataset.k;c.checked=localStorage.getItem(k)==='1';c.addEventListener('change',()=>localStorage.setItem(k,c.checked?'1':'0'))});
const navs=[...document.querySelectorAll('.nav')];
navs.forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.id)?.scrollIntoView({behavior:'smooth',block:'start'})));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)navs.forEach(b=>b.classList.toggle('active',b.dataset.id===e.target.id))}),{rootMargin:'-35% 0px -52% 0px',threshold:0});
document.querySelectorAll('.day').forEach(el=>observer.observe(el));

if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
