/* â•â•â• THREE.JS â€“ BASKETBALL 3D â•â•â• */
(function(){
  const canvas = document.getElementById('hc');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, .1, 100);
  cam.position.set(0, 0, 9);

  /* Basketball texture via Canvas 2D */
  const tc = document.createElement('canvas');
  tc.width = tc.height = 1024;
  const tx = tc.getContext('2d');

  // Orange radial base
  const gr = tx.createRadialGradient(380, 330, 30, 512, 512, 640);
  gr.addColorStop(0, '#FF7733');
  gr.addColorStop(.45, '#FF5500');
  gr.addColorStop(1, '#BB2200');
  tx.fillStyle = gr;
  tx.fillRect(0, 0, 1024, 1024);

  // Black seam lines
  tx.strokeStyle = '#180500';
  tx.lineWidth = 16;
  tx.lineCap = 'round';

  // Equator
  tx.beginPath(); tx.moveTo(0,512); tx.lineTo(1024,512); tx.stroke();
  // Meridian
  tx.beginPath(); tx.moveTo(512,0); tx.lineTo(512,1024); tx.stroke();

  // Curved seams (basketball S-curves)
  tx.lineWidth = 13;
  tx.beginPath(); tx.moveTo(512,0);
  tx.bezierCurveTo(185,255,185,765,512,1024); tx.stroke();
  tx.beginPath(); tx.moveTo(512,0);
  tx.bezierCurveTo(839,255,839,765,512,1024); tx.stroke();
  tx.beginPath(); tx.moveTo(0,512);
  tx.bezierCurveTo(255,288,769,288,1024,512); tx.stroke();
  tx.beginPath(); tx.moveTo(0,512);
  tx.bezierCurveTo(255,736,769,736,1024,512); tx.stroke();

  const ballTex = new THREE.CanvasTexture(tc);

  /* Ball group */
  const group = new THREE.Group();
  scene.add(group);

  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 64, 64),
    new THREE.MeshPhongMaterial({
      map: ballTex,
      specular: new THREE.Color(.16,.08,.03),
      shininess: 58
    })
  ));

  // Soft glow shell
  group.add(new THREE.Mesh(
    new THREE.SphereGeometry(2.85, 32, 32),
    new THREE.MeshBasicMaterial({color:0xFF4400, transparent:true, opacity:.042, side:THREE.BackSide})
  ));

  group.position.set(3.6, 0, 0);

  /* Particle field */
  const N=280, pPos=new Float32Array(N*3);
  for(let i=0;i<N;i++){
    pPos[i*3]=(Math.random()-.5)*34;
    pPos[i*3+1]=(Math.random()-.5)*28;
    pPos[i*3+2]=(Math.random()-.5)*18;
  }
  const pg=new THREE.BufferGeometry();
  pg.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  scene.add(new THREE.Points(pg,
    new THREE.PointsMaterial({color:0xFF5500,size:.09,transparent:true,opacity:.5})
  ));

  /* Ring accent behind ball */
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.3, .03, 8, 120),
    new THREE.MeshBasicMaterial({color:0xFF5500, transparent:true, opacity:.18})
  );
  ring.rotation.x = Math.PI/2 * .4;
  ring.position.copy(group.position);
  scene.add(ring);

  /* Lights */
  scene.add(new THREE.AmbientLight(0x1a1020, 1.1));
  const sun=new THREE.DirectionalLight(0xFFDDBB,3.8);
  sun.position.set(7,9,7); scene.add(sun);
  const rim=new THREE.PointLight(0xFF5500,2.2,24);
  rim.position.set(-7,-3,-5); scene.add(rim);
  const fill=new THREE.PointLight(0x2244CC,.85,22);
  fill.position.set(-5,5,6); scene.add(fill);

  /* Animate */
  let t=0;
  (function loop(){
    requestAnimationFrame(loop);
    t+=.012;
    group.rotation.x+=.0048;
    group.rotation.y+=.0112;
    group.position.y=Math.sin(t*.72)*.65;
    ring.rotation.z+=.004;
    renderer.render(scene,cam);
  })();

  window.addEventListener('resize',()=>{
    const w=window.innerWidth,h=window.innerHeight;
    cam.aspect=w/h; cam.updateProjectionMatrix();
    renderer.setSize(w,h);
  });
})();

/* â•â•â• REVEAL ON SCROLL â•â•â• */
const io=new IntersectionObserver(entries=>{
  let delay=0;
  entries.forEach(e=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add('vis'),delay);
      delay+=70;
    }
  });
},{threshold:.1});
document.querySelectorAll('.rev').forEach(el=>io.observe(el));

/* â•â•â• COUNTER ANIMATION â•â•â• */
const co=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target, end=parseInt(el.dataset.to);
    let v=0;
    const id=setInterval(()=>{
      v+=end/55; if(v>=end){v=end;clearInterval(id);}
      el.textContent=Math.round(v);
    },22);
    co.unobserve(el);
  });
},{threshold:.5});
document.querySelectorAll('.sn[data-to]').forEach(el=>co.observe(el));

/* â•â•â• TOAST â•â•â• */
function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg; t.classList.add('on');
  setTimeout(()=>t.classList.remove('on'),4200);
}

/* â•â•â• LOGIN â•â•â• */
function doLogin(){
  const em=document.getElementById('li-em').value.trim();
  const pw=document.getElementById('li-pw').value;
  if(!em||!pw){toast('âš ï¸ Remplis tous les champs.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){toast('âš ï¸ Adresse email invalide.');return;}
  toast('âœ… Connexion rÃ©ussie â€” Bienvenue chez GÃ©nÃ©ration Miracle !');
}

/* â•â•â• GOOGLE SIGN-IN â•â•â• */
const GOOGLE_CLIENT_ID='REMPLACEZ_PAR_VOTRE_CLIENT_ID_GOOGLE.apps.googleusercontent.com';
let googleUser=null;

function handleGoogleCredential(response){
  const payload=JSON.parse(atob(response.credential.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
  googleUser={name:payload.name,email:payload.email};
  document.getElementById('google-status').textContent=`ConnectÃ© avec ${googleUser.email}`;
  const emailField=document.getElementById('re');
  if(!emailField.value) emailField.value=googleUser.email;
}

function initGoogleLogin(){
  const status=document.getElementById('google-status');
  if(!window.google||GOOGLE_CLIENT_ID.startsWith('REMPLACEZ_')){
    status.textContent='Configuration Google requise par le propriÃ©taire du site.';
    return;
  }
  google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,callback:handleGoogleCredential});
  google.accounts.id.renderButton(document.getElementById('google-signin-button'),{
    theme:'outline',size:'large',text:'signin_with',shape:'rectangular',width:280
  });
}
window.addEventListener('load',initGoogleLogin);

/* â•â•â• INSCRIPTION â•â•â• */
function doInscription(){
  if(!googleUser){toast('âš ï¸ Connecte-toi avec Google avant dâ€™envoyer ta candidature.');return;}
  const fields={rp:'PrÃ©nom',rn:'Nom',rd:'Date de naissance',rt:'TÃ©lÃ©phone',re:'Email'};
  for(const [id,label] of Object.entries(fields)){
    if(!document.getElementById(id).value.trim()){
      toast(`âš ï¸ Champ requis : ${label}`); return;
    }
  }
  const em=document.getElementById('re').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){toast('âš ï¸ Adresse email invalide.');return;}

  const subject=`Nouvelle candidature - ${document.getElementById('rp').value.trim()} ${document.getElementById('rn').value.trim()}`;
  const message=[
    'Nouvelle candidature - GÃ©nÃ©ration Miracle',
    '',
    `Nom : ${document.getElementById('rp').value.trim()} ${document.getElementById('rn').value.trim()}`,
    `Date de naissance : ${document.getElementById('rd').value}`,
    `TÃ©lÃ©phone : ${document.getElementById('rt').value.trim()}`,
    `Email : ${em}`,
    `Quartier / Ville : ${document.getElementById('rv').value.trim() || 'Non renseignÃ©'}`,
    `Poste prÃ©fÃ©rÃ© : ${document.getElementById('rpo').value || 'Non renseignÃ©'}`,
    `Niveau actuel : ${document.getElementById('rni').value || 'Non renseignÃ©'}`,
    `ExpÃ©rience & Motivation : ${document.getElementById('rm').value.trim() || 'Non renseignÃ©e'}`
  ].join('\n');

  const emailLink=`mailto:generationmiracle81@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  const whatsappLink=`https://wa.me/22879161527?text=${encodeURIComponent(message)}`;
  window.open(emailLink,'_blank');
  window.open(whatsappLink,'_blank');
  toast('ðŸ€ Candidature prÃ©parÃ©e : vÃ©rifie puis envoie lâ€™email ou le message WhatsApp.');
  ['rp','rn','rd','rt','re','rv','rpo','rni','rm'].forEach(id=>{
    const el=document.getElementById(id); if(el) el.value='';
  });
}

/* â•â•â• CLUB BUSINESS DATA â•â•â• */
const ADMIN_PASSWORD='GM2026';
const defaultClubData={
  nextTeams:'Notre club ðŸ†š Club B',
  nextDate:'22 septembre 2026 Â· 15h00',
  lastTeams:'Club A ðŸ†š Notre club',
  lastScore:'â€”',
  lastDate:'15 septembre 2026',
  standing:[['Notre club','18'],['Club B','16'],['Club C','14']],
  news:[['Bienvenue','Les actualitÃ©s et rÃ©sultats du club seront publiÃ©s ici.']]
};

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

function getClubData(){
  try{return {...defaultClubData,...JSON.parse(localStorage.getItem('gmClubData')||'{}')};}
  catch{return defaultClubData;}
}

function renderClubData(){
  const data=getClubData();
  document.getElementById('next-match-teams').textContent=data.nextTeams;
  document.getElementById('next-match-date').textContent=data.nextDate;
  document.getElementById('last-match-teams').textContent=data.lastTeams;
  document.getElementById('last-match-score').textContent=data.lastScore;
  document.getElementById('last-match-date').textContent=data.lastDate;
  document.getElementById('standing-body').innerHTML=data.standing.map((row,index)=>`<tr><td>${index+1}</td><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td></tr>`).join('');
  document.getElementById('news-list').innerHTML=data.news.map(item=>`<li><strong>${escapeHtml(item[0])}</strong>${escapeHtml(item[1])}</li>`).join('');
}

function openAdmin(){
  const panel=document.getElementById('admin-panel');
  panel.classList.add('open');
  panel.scrollIntoView({behavior:'smooth'});
}

function unlockAdmin(event){
  event.preventDefault();
  if(document.getElementById('admin-password').value!==ADMIN_PASSWORD){toast('âš ï¸ Mot de passe administrateur incorrect.');return;}
  const data=getClubData();
  document.getElementById('admin-login').style.display='none';
  document.getElementById('admin-editor').style.display='block';
  document.getElementById('admin-next-teams').value=data.nextTeams;
  document.getElementById('admin-next-date').value=data.nextDate;
  document.getElementById('admin-last-teams').value=data.lastTeams;
  document.getElementById('admin-last-score').value=data.lastScore;
  document.getElementById('admin-last-date').value=data.lastDate;
  document.getElementById('admin-standing').value=data.standing.map(row=>row.join('|')).join('\n');
  document.getElementById('admin-news').value=data.news.map(item=>item.join('|')).join('\n');
  toast('âœ… Espace administrateur ouvert.');
}

function lockAdmin(){
  document.getElementById('admin-editor').style.display='none';
  document.getElementById('admin-login').style.display='block';
  document.getElementById('admin-password').value='';
}

function saveAdminData(){
  const parseLines=id=>document.getElementById(id).value.split('\n').map(line=>line.split('|').map(value=>value.trim())).filter(row=>row[0]&&row[1]);
  const data={
    nextTeams:document.getElementById('admin-next-teams').value.trim(),
    nextDate:document.getElementById('admin-next-date').value.trim(),
    lastTeams:document.getElementById('admin-last-teams').value.trim(),
    lastScore:document.getElementById('admin-last-score').value.trim(),
    lastDate:document.getElementById('admin-last-date').value.trim(),
    standing:parseLines('admin-standing'),
    news:parseLines('admin-news')
  };
  localStorage.setItem('gmClubData',JSON.stringify(data));
  renderClubData();
  toast('âœ… Les informations du club sont mises Ã  jour.');
}

/* â•â•â• BOUTIQUE â•â•â• */
function selectProduct(name,price){
  document.getElementById('order-product').value=name;
  document.getElementById('order-price').value=price;
  document.getElementById('order-form').scrollIntoView({behavior:'smooth',block:'center'});
}

function submitOrder(event){
  event.preventDefault();
  const product=document.getElementById('order-product').value;
  const price=document.getElementById('order-price').value;
  const name=document.getElementById('order-name').value.trim();
  const phone=document.getElementById('order-phone').value.trim();
  const location=document.getElementById('order-location').value.trim()||'Non prÃ©cisÃ©';
  const message=`Bonjour GÃ©nÃ©ration Miracle, je souhaite commander : ${product} (${price}). Nom : ${name}. TÃ©lÃ©phone : ${phone}. Lieu de livraison : ${location}.`;
  window.open(`https://wa.me/22879161527?text=${encodeURIComponent(message)}`,'_blank');
  toast('âœ… Commande prÃ©parÃ©e sur WhatsApp.');
}

/* â•â•â• SOUTIEN & AVIS â•â•â• */
function addSupport(){
  const count=Number(localStorage.getItem('gmHeartCount')||0)+1;
  localStorage.setItem('gmHeartCount',count);
  document.getElementById('heart-count').textContent=count;
}

function renderCommunity(){
  document.getElementById('heart-count').textContent=localStorage.getItem('gmHeartCount')||0;
  let reviews=[];
  try{reviews=JSON.parse(localStorage.getItem('gmReviews')||'[]');}catch{}
  document.getElementById('review-list').innerHTML=reviews.map(review=>`<div class="review"><strong>${escapeHtml(review.name)}</strong><br>${escapeHtml(review.message)}</div>`).join('');
}

function submitReview(event){
  event.preventDefault();
  let reviews=[];
  try{reviews=JSON.parse(localStorage.getItem('gmReviews')||'[]');}catch{}
  reviews.unshift({name:document.getElementById('review-name').value.trim(),message:document.getElementById('review-message').value.trim()});
  localStorage.setItem('gmReviews',JSON.stringify(reviews.slice(0,30)));
  event.target.reset();
  renderCommunity();
  toast('âœ… Merci pour votre message de soutien.');
}

renderClubData();
renderCommunity();

/* â•â•â• NAV SCROLL â•â•â• */
window.addEventListener('scroll',()=>{
  document.getElementById('nav').style.background=
    window.scrollY>60?'rgba(5,9,22,.97)':'rgba(5,9,22,.72)';
},{passive:true});

