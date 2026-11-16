(function(){"use strict";
if(window.Celestia)return;
/* ============ 1) الإعدادات: عدّل من هنا ============ */
const CONFIG={
  typingMs:500,                                   /* مدة نقط الكتابة قبل كل رسالة */
  fontUrl:"https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap",
  voice:{
  enabled:true,
  lang:"en-US",
  rate:.85,
  pitch:1.1,
  voiceName:"Google US English|Samantha|Aria|Zira|David|Daniel|Alex|English"

},
  music:{enabled:true,volume:.12,duck:.35},  /* موسيقى الفضاء: volume (0-1) واطي عشان ما يغطيش على الكلام | duck = مستواها وقت كلام الشخصية */
  steps:11                                         /* عدد خطوات الحكاية لكل شخصية (للشريط) */
};
/* match = بيطابق نص اللينك في Start | voice = بيغيّر الافتراضي لشخصية بعينها */
const CHARACTERS=[
 {id:"voyager",match:/voyager/i,name:"Voyager 1 & 2",sub:"NASA probes between the stars 🌌",icon:"🛰️",img:"assets/images/avatar-voyager-1-2.jpg",voice:{pitch:.95}},
 {id:"opportunity",match:/opportunit/i,name:"Opportunity",sub:"NASA rover on Mars 🔴",icon:"🤖",img:"assets/images/avatar-opportunity.jpg",voice:{pitch:1.15}},
 {id:"apollo",match:/apollo/i,name:"Apollo 15",sub:"Science station on the Moon 🌕",icon:"🌕",img:"assets/images/avatar-apollo-15.jpg",voice:{pitch:1.05}}
];


/* ============ صور الأدوات (معرض Photos) ============ */
const PHOTOS=[
 {id:"opp-concept",file:"celestia-opp-concept.jpg",title:"Artist's concept of the Mars rover 🤖",img:"assets/images/celestia-opp-concept.jpg",
  desc:"NASA artist's concept of the rover on the surface of Mars (Opportunity and its twin Spirit share this design). The solar panels on top charge its batteries, and the robotic arm in front carries tools for studying rocks. It landed in January 2004 for a mission planned to last 90 days, and kept going for about 14 years. Source: NASA/JPL."},
 {id:"opp-victoria",file:"celestia-opp-victoria.jpg",title:"Cliff in Victoria Crater 🪨",img:"assets/images/celestia-opp-victoria.jpg",
  desc:"A black-and-white Pancam image from Opportunity of a rocky cliff on the rim of Victoria Crater, about 800 meters across. The layers in the rock led scientists to conclude this place was once a field of sand dunes, like a desert, shaped by wind. Source: NASA/JPL-Caltech/Cornell."},
 {id:"mer-3d",file:"celestia-mer-3d.jpg",title:"3D model of a Mars rover 🛞",img:"assets/images/celestia-mer-3d.jpg",
  desc:"A 3D model of a Mars Exploration Rover. You can see its six wheels, each with its own motor, the tall mast carrying the cameras that act as the rover's eyes, and the solar panels spread out on both sides. Source: NASA/JPL-Caltech."},
 {id:"opp-selfie",file:"celestia-opp-selfie.jpg",title:"Opportunity's self-portrait from above 📸",img:"assets/images/celestia-opp-selfie.jpg",
  desc:"A self-portrait of Opportunity taken from above, stitched together from many Pancam images, which is why there are black edges and missing patches. It shows the layer of dust on the solar panels, which reduces power until the wind cleans it off. Source: NASA/JPL-Caltech/Cornell/ASU."},
 {id:"opp-endeavour",file:"celestia-opp-endeavour.jpg",title:"Late afternoon at Endeavour Crater 🌅",img:"assets/images/celestia-opp-endeavour.jpg",
  desc:"This mosaic was assembled from images taken on March 9, 2012, in the late afternoon Mars time, with Opportunity parked on the western rim of Endeavour Crater, about 22 km wide. The colors are exaggerated on purpose to show differences between materials, so dark dunes look blue-green. The shadow in the foreground is the rover's own. Source: NASA/JPL-Caltech/Cornell/ASU."},
 {id:"apollo15-crew",file:"celestia-apollo15-crew.jpg",title:"The Apollo 15 crew 👨‍🚀",img:"assets/images/celestia-apollo15-crew.jpg",
  desc:"The Apollo 15 crew: David Scott (commander) on the left, Alfred Worden (command module pilot) in the middle, and James Irwin (lunar module pilot) on the right. The mission launched on July 26, 1971. Scott and Irwin landed at Hadley-Apennine while Worden orbited the Moon. Source: NASA."},
 {id:"apollo15-flag",file:"celestia-apollo15-flag.jpg",title:"Irwin salutes the flag 🇺🇸",img:"assets/images/celestia-apollo15-flag.jpg",
  desc:"James Irwin salutes the American flag next to the lunar module Falcon. On the right is the Lunar Roving Vehicle with its white antenna dish. The photo was taken by David Scott on August 1, 1971. Source: NASA."},
 {id:"voyager-ptm",file:"celestia-voyager-ptm.jpg",title:"Voyager test model 🔧",img:"assets/images/celestia-voyager-ptm.jpg",
  desc:"An archival photo of the Voyager proof test model at JPL in January 1977, being prepared for weight and center-of-gravity tests before the flight spacecraft. The stacked white cylinders on the boom appear to stand in for the nuclear power generators that power the real spacecraft. Source: NASA/JPL-Caltech."},
 {id:"voyager-dish",file:"celestia-voyager-dish.jpg",title:"Voyager's big antenna dish 📡",img:"assets/images/celestia-voyager-dish.jpg",
  desc:"A technician inspects the large high-gain antenna dish used by the Voyager spacecraft. The dish is about 3.7 meters wide, and it lets the spacecraft send pictures and data to Earth and receive commands from billions of kilometers away. Source: NASA/JPL-Caltech."},
 {id:"apollo15-lrv",file:"celestia-apollo15-lrv.jpg",title:"The lunar rover at Hadley 🚙",img:"assets/images/celestia-apollo15-lrv.jpg",
  desc:"One of the Apollo 15 astronauts next to the Lunar Roving Vehicle, with the mountains of the Hadley region behind. It was the first time a vehicle was used on the Moon, and Scott and Irwin drove it about 28 km over 3 moonwalks. The large dark shadow in the foreground is probably the lander's. Source: NASA."},
 {id:"voyager-team",file:"celestia-voyager-team.jpg",title:"Preparing a Voyager spacecraft for launch 🧑‍🔬",img:"assets/images/celestia-voyager-team.jpg",
  desc:"An archival photo of technicians in clean-room suits working on one of the two Voyager spacecraft before their 1977 launches (Voyager 2 on August 20, Voyager 1 on September 5). The big dish and science instruments are visible. Source: NASA/JPL-Caltech."},
 {id:"golden-record",file:"celestia-golden-record.jpg",title:"The Golden Record: Sounds of Earth 🥇",img:"assets/images/celestia-golden-record.jpg",
  desc:"The Golden Record carried by both Voyager 1 and 2: a gold-plated copper disc labeled The Sounds of Earth. It holds 115 images, sounds from nature, greetings in 55 languages and about 90 minutes of music, a message for anyone who might find it in space. Source: NASA/JPL-Caltech."},
 {id:"golden-record-voyager",file:"celestia-golden-record-voyager.jpg",title:"The record, its cover and Voyager 🛰️",img:"assets/images/celestia-golden-record-voyager.jpg",
  desc:"An illustration of the Golden Record, its aluminum cover and the Voyager spacecraft. The cover is etched with diagrams that explain how to play the record, and a map that points to Earth's location in the galaxy. Source: NASA/JPL-Caltech."},
 {id:"jupiter-grs",file:"celestia-jupiter-grs.jpg",title:"Jupiter's Great Red Spot 🪐",img:"assets/images/celestia-jupiter-grs.jpg",
  desc:"The Great Red Spot, a giant storm on Jupiter larger than planet Earth, photographed by Voyager 1 in March 1979 as it flew past the planet. Below it is a white oval, another storm, and the clouds around them swirl in eddies. Source: NASA/JPL."},
 {id:"record-install",file:"celestia-record-install.jpg",title:"Preparing the Golden Record for installation ✨",img:"assets/images/celestia-record-install.jpg",
  desc:"A technician in white gloves handles the Golden Record and its aluminum cover before they were installed on a Voyager spacecraft in 1977. The record is handled with great care so that no one scratches it. Source: NASA/JPL-Caltech."}
];

/* ============ 2.5) موسيقى الفضاء الخلفية (متولّدة بالكود، من غير ملفات) ============ */
/* هادية جداً: pad ناعم + نغمات صغيرة متفرقة بصدى. بتهدّى لوحدها وقت كلام الشخصية. */
const music=(function(){
  const AC=window.AudioContext||window.webkitAudioContext,M=CONFIG.music;
  let ctx=null,master=null,duckG=null,pad=null,delay=null,on=!!M.enabled,running=false,chordT=null,bleepT=null,dT=null,ci=0;
  const CH=[[110,164.81,220,261.63,329.63],[87.31,130.81,174.61,220,261.63],[98,146.83,196,246.94,293.66],[110,164.81,196,246.94,329.63]];
  const SC=[440,523.25,587.33,659.25,783.99,880,1046.5];
  function init(){
    ctx=new AC();
    master=ctx.createGain();master.gain.value=0;
    duckG=ctx.createGain();duckG.gain.value=1;
    master.connect(duckG);duckG.connect(ctx.destination);
    delay=ctx.createDelay(2);delay.delayTime.value=.55;
    const fb=ctx.createGain();fb.gain.value=.38;
    const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1800;
    const wet=ctx.createGain();wet.gain.value=.5;
    delay.connect(lp);lp.connect(fb);fb.connect(delay);lp.connect(wet);wet.connect(master);
    pad=ctx.createBiquadFilter();pad.type="lowpass";pad.frequency.value=700;pad.Q.value=.6;pad.connect(master);
    const lfo=ctx.createOscillator(),lg=ctx.createGain();lfo.frequency.value=.06;lg.gain.value=250;lfo.connect(lg);lg.connect(pad.frequency);lfo.start();
  }
  function chord(){
    const t=ctx.currentTime,dur=13,notes=CH[ci++%CH.length];
    notes.forEach((f,i)=>[-5,5].forEach(det=>{
      const o=ctx.createOscillator(),g=ctx.createGain(),v=i<2?.16:.08;
      o.type=i<2?"sine":"triangle";o.frequency.value=f;o.detune.value=det;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+4);g.gain.setValueAtTime(v,t+dur-4);g.gain.linearRampToValueAtTime(0,t+dur+1);
      o.connect(g);g.connect(pad);o.start(t);o.stop(t+dur+1.2);
    }));
  }
  function bleep(){
    if(!running)return;
    const t=ctx.currentTime,n=Math.random()<.35?3:1,i=Math.floor(Math.random()*4);
    for(let k=0;k<n;k++){
      const o=ctx.createOscillator(),g=ctx.createGain(),st=t+k*.2;
      o.type="sine";o.frequency.value=SC[i+k];
      g.gain.setValueAtTime(0,st);g.gain.linearRampToValueAtTime(.2,st+.02);g.gain.exponentialRampToValueAtTime(.0008,st+1.4);
      o.connect(g);g.connect(master);g.connect(delay);o.start(st);o.stop(st+1.5);
    }
    bleepT=setTimeout(bleep,2500+Math.random()*4500);
  }
  function start(){
    if(!AC||!on)return;
    try{
      if(!ctx)init();
      ctx.resume();
      if(!running){running=true;chord();chordT=setInterval(chord,12000);bleepT=setTimeout(bleep,3000)}
      master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(M.volume,ctx.currentTime,1.5);
    }catch(e){console.error("[Celestia] music",e)}
  }
  function pause(){
    clearInterval(chordT);clearTimeout(bleepT);running=false;
    if(ctx){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(0,ctx.currentTime,.3)}
  }
  function duck(f){
    if(!ctx)return;clearTimeout(dT);
    const go=()=>duckG.gain.setTargetAtTime(f?M.duck:1,ctx.currentTime,f?.25:.9);
    f?go():(dT=setTimeout(go,800));
  }
  document.addEventListener("visibilitychange",()=>{if(!ctx||!running)return;document.hidden?ctx.suspend():ctx.resume()});
  return{start:start,pause:pause,duck:duck,
    toggle(){on=!on;on?start():pause();return on},
    get on(){return on}};
})();

/* ============ 2) أحداث بسيطة عشان تضيف سكريبتات بعدين ============ */
/* Celestia.on("passage"|"say"|"choice"|"character"|"home", fn) */
const H={};
const on=(e,f)=>{(H[e]=H[e]||[]).push(f);return api};
const emit=(e,d)=>(H[e]||[]).forEach(f=>{try{f(d)}catch(x){console.error("[Celestia]",e,x)}});

/* ============ 3) الصوت (provider قابل للتبديل) ============ */
const synth=window.speechSynthesis||null;let voices=[];
const loadVoices=()=>{if(synth)voices=synth.getVoices()};
if(synth){loadVoices();synth.onvoiceschanged=loadVoices}
function findVoice(p){
  if(!voices.length)return null;
  if(p.voiceName){const re=p.voiceName instanceof RegExp?p.voiceName:new RegExp(p.voiceName,"i");const v=voices.find(x=>re.test(x.name));if(v)return v}
  const l=String(p.lang||"ar-EG").toLowerCase().replace("_","-");
  const n=v=>v.lang.toLowerCase().replace("_","-");
  return voices.find(v=>n(v)===l)||voices.find(v=>n(v).slice(0,2)===l.slice(0,2))||null;
}
/* العقد: speak(text, profile, ctx) => Promise بتخلص لما الكلام يخلص | stop() | unlock() اختياري */
const webSpeech={available:!!synth,
  unlock(){if(synth){const u=new SpeechSynthesisUtterance(" ");u.volume=0;synth.speak(u)}},
  speak(text,p){return new Promise(res=>{
    const u=new SpeechSynthesisUtterance(text),v=findVoice(p);
    u.lang=(v&&v.lang)||p.lang;if(v)u.voice=v;u.rate=p.rate;u.pitch=p.pitch;
    let done=false;const fin=()=>{if(!done){done=true;clearTimeout(tm);res()}};
    const tm=setTimeout(fin,text.length*130+3000);u.onend=fin;u.onerror=fin;synth.speak(u)})},
  stop(){if(synth)synth.cancel()}};
let provider=webSpeech;
const clean=t=>t.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu,"").trim();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const profile=c=>Object.assign({},CONFIG.voice,c&&c.voice);
let soundOn=true,current=null;
async function speak(text,kind){
  const t=clean(text),p=profile(current);
  if(!soundOn||!p.enabled||!provider||provider.available===false||!t){await wait(Math.min(text.length*45,2500));return}
  ui.av.classList.add("talk");music.duck(true);
  try{await provider.speak(t,p,{raw:text,kind:kind,char:current})}catch(e){console.error("[Celestia] voice",e)}
  ui.av.classList.remove("talk");music.duck(false);
}
const stop=()=>{try{provider&&provider.stop&&provider.stop()}catch(e){}ui.av&&ui.av.classList.remove("talk");music.duck(false)};

/* ============ 4) الواجهة (شكل opportunity) ============ */
const ui={};
function build(){
  const lk=document.createElement("link");lk.rel="stylesheet";lk.href=CONFIG.fontUrl;document.head.appendChild(lk);
  document.documentElement.lang="en";
  const r=document.createElement("div");r.id="cz";
  for(let i=0;i<16;i++){const s=document.createElement("div"),z=Math.random()*2.5+1;s.className="star";
    s.style.cssText="width:"+z+"px;height:"+z+"px;left:"+Math.random()*100+"%;top:"+Math.random()*100+"%;animation-delay:"+Math.random()*5+"s";r.appendChild(s)}
  [["🪐","4%","14%"],["🌍","88%","32%"],["🛰️","86%","78%"]].forEach((a,i)=>{const p=document.createElement("div");p.className="planet";p.textContent=a[0];
    p.style.cssText="left:"+a[1]+";top:"+a[2]+";animation-delay:"+i*2+"s";r.appendChild(p)});
  r.insertAdjacentHTML("beforeend",
   '<div class="cz-app"><div class="cz-head"><div class="cz-av" id="czAv">✦</div><div class="cz-t"><h1 id="czName">Celestia Chatbot</h1><small id="czSub"></small></div>'+
   '<div class="cz-tools"><button class="cz-ic" id="czHomeBtn" title=\"Characters">🏠</button><button class="cz-ic cz-ph" id="czPhotosBtn" title=\"Photos">📷 Photos</button><button class="cz-ic" id="czReplay" title=\"Listen again">🔁</button><button class="cz-ic" id="czMusic" title=\"Space music">🎵</button><button class="cz-ic" id="czMute" title=\"Sound">🔊</button><div class="cz-score" id="czScore">⭐ 0</div></div><div class="cz-prog" id="czProg"><div class="cz-bar" id="czBar"><i id="czFill"></i></div><small id="czProgTxt"></small></div></div>'+
   '<div id="czChat"></div><div id="czChoices"></div></div>'+
   '<div class="cz-home" id="czHome"><div class="cz-logo">✦</div><h2>Celestia Chatbot</h2><p>Pick your space friend. They will tell you their story in their own voice and quiz you along the way. Turn the sound on and get your ears ready 🎧</p><div class="cz-grid" id="czGrid"></div><button class="cz-photos-home" id="czPhotosHome">📷 Photos</button><div id="czNote"></div></div>');
  document.body.appendChild(r);
  ["Av","Name","Sub","Chat","Choices","Score","Grid","Home","Note","HomeBtn","Replay","Mute","PhotosBtn","PhotosHome","Music","Prog","Bar","Fill","ProgTxt"].forEach(k=>ui[k[0].toLowerCase()+k.slice(1)]=document.getElementById("cz"+k));
  ui.chat=ui.chat;
  ui.mute.onclick=()=>{soundOn=!soundOn;ui.mute.textContent=soundOn?"🔊":"🔇";if(!soundOn)stop()};
  ui.bar.style.setProperty("--n",CONFIG.steps);
  ui.music.onclick=()=>{ui.music.classList.toggle("off",!music.toggle())};
  r.addEventListener("pointerdown",()=>music.start(),{once:true});   /* المتصفح بيسمح بالصوت بعد أول لمسة */
  const gal=document.createElement("div");gal.className="cz-gal hide";gal.id="czGal";
  gal.innerHTML='<div class="cz-gal-bar"><h2>📷 Photos</h2><button class="cz-ic" id="czGalClose" title=\"Close">✕</button></div>';
  PHOTOS.forEach(p=>{const c=document.createElement("div");c.className="cz-gcard";
    c.innerHTML='<img alt=""><h3></h3><p></p><a class="cz-dl">⬇️ Download photo</a>';
    c.querySelector("img").src=p.img;c.querySelector("h3").textContent=p.title;c.querySelector("p").textContent=p.desc;
    const a=c.querySelector("a");a.href=p.img;a.download=p.file;gal.appendChild(c)});
  r.appendChild(gal);
  const openGal=()=>{gal.classList.remove("hide");gal.scrollTop=0},closeGal=()=>gal.classList.add("hide");
  ui.photosBtn.onclick=openGal;ui.photosHome.onclick=openGal;gal.querySelector("#czGalClose").onclick=closeGal;
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeGal()});
  ui.homeBtn.onclick=()=>{const l=document.querySelector('tw-hook[name="home"] tw-link,tw-hook[name="home"] .enchantment-link');l?l.click():location.reload()};
  ui.replay.onclick=async()=>{if(!last)return;const my=++run;stop();ui.choices.innerHTML="";
    for(const l of last.lines){if(l.kind==="big")continue;if(my!==run)return;await speak(l.text,l.kind)}
    if(my===run)choices(last.links,my)};
  ui.av=ui.av;
  setTimeout(()=>{ui.note.textContent=!synth?"This browser does not support speech, so you will read the story as text.":(voices.some(v=>/^en/i.test(v.lang))?"":"If the voice is not English, install an English text-to-speech voice in your device settings.")},900);
}
const down=()=>ui.chat.scrollTop=ui.chat.scrollHeight;
function addMsg(t,cls){const d=document.createElement("div");d.className="msg "+cls;d.textContent=t;ui.chat.appendChild(d);down();return d}
function setScore(n){ui.score.textContent="⭐ "+n}

/* ============ 5) المحرك: بيقرأ بسايات Twine ويعرضها كشات ============ */
/* في كل بسّة:  |m>[رسالة]  |q>[سؤال]  |big>[إيموجي]  واللينكات = الأزرار
   تاج home = صفحة اختيار الشخصيات | تاج hint = تلميح بعد إجابة غلط (بيرجع لوحده) */
let run=0,last=null,step=0;const seen=new Set();
function setProg(){const T=CONFIG.steps,s=Math.min(step,T);
  ui.fill.style.width=Math.round(s/T*100)+"%";
  ui.progTxt.textContent=s>=T?"🏅 You finished the whole story!":(s?"You're at step "+s+" of "+T+" • "+(T-s)+" to go":"Let's start the journey 🚀");
  ui.prog.classList.toggle("done",s>=T);emit("progress",{step:s,total:T})}
const LINKS="tw-link,.enchantment-link",HOOKS='tw-hook[name="m"],tw-hook[name="q"],tw-hook[name="big"]';
function read(p){
  const lines=[...p.querySelectorAll(HOOKS)].map(h=>({kind:h.getAttribute("name"),text:h.textContent.replace(/\s+/g," ").trim()})).filter(x=>x.text);
  const links=[...p.querySelectorAll(LINKS)].filter(l=>!l.closest('tw-hook[name="home"],tw-hook[name="score"]'));
  const s=p.querySelector('tw-hook[name="score"]');
  return{lines:lines,links:links,score:s?parseInt(s.textContent,10):NaN};
}
async function narrate(lines,my){
  for(const l of lines){
    if(my!==run)return false;
    if(l.kind==="big"){const e=document.createElement("div");e.className="big";e.textContent=l.text;ui.chat.appendChild(e);down();continue}
    const t=addMsg("","bot typing");t.innerHTML="<i></i><i></i><i></i>";await wait(CONFIG.typingMs);t.remove();
    if(my!==run)return false;
    addMsg(l.text,"bot");emit("say",{text:l.text,kind:l.kind,char:current});await speak(l.text,l.kind);
  }
  return my===run;
}
function choices(links,my){
  ui.choices.innerHTML="";
  links.filter(l=>l.isConnected).forEach((l,i)=>{const b=document.createElement("button");b.className="btn";b.textContent=l.textContent.trim();b.style.animationDelay=i*.1+"s";
    b.onclick=()=>{if(my!==run)return;run++;stop();ui.choices.innerHTML="";addMsg(b.textContent,"me");emit("choice",{text:b.textContent,char:current});setTimeout(()=>l.click(),350)};
    ui.choices.appendChild(b)});
  down();
}
const nameOf=t=>t.replace(/[\p{Extended_Pictographic}\uFE0F\u200d]/gu,"").replace(/\s+/g," ").trim();
const findChar=t=>CHARACTERS.find(c=>c.match.test(t))||null;
function setChar(c,fallbackName){
  current=c;ui.name.textContent=(c&&c.name)||fallbackName||"Celestia Chatbot";ui.sub.textContent=(c&&c.sub)||"";
  ui.av.textContent="";if(c&&c.img){const im=document.createElement("img");im.src=c.img;im.alt="";im.onerror=()=>{im.remove();ui.av.textContent=c.icon};ui.av.appendChild(im)}else ui.av.textContent=(c&&c.icon)||"✦";
}
function showHome(p,d){
  run++;stop();seen.clear();last=null;step=0;setProg();ui.chat.innerHTML="";ui.choices.innerHTML="";setScore(0);setChar(null);ui.grid.innerHTML="";
  d.links.forEach(l=>{const raw=l.textContent.trim(),c=findChar(raw),nm=(c&&c.name)||nameOf(raw);
    const b=document.createElement("button");b.className="cz-card";
    b.innerHTML=(c&&c.img?'<img alt="">':'<b></b>')+"<span></span>";b.lastChild.textContent=nm;
    if(c&&c.img){const im=b.firstChild;im.src=c.img;im.onerror=()=>{const f=document.createElement("b");f.textContent=c.icon;im.replaceWith(f)}}else b.firstChild.textContent=(c&&c.icon)||nm.charAt(0);
    b.onclick=()=>{if(provider&&provider.unlock)try{provider.unlock()}catch(e){}ui.home.classList.add("hide");setChar(c,nm);emit("character",c);l.click()};
    ui.grid.appendChild(b)});
  ui.home.classList.remove("hide");emit("home",null);
}
async function chatPassage(p,d,tags){
  const my=++run;stop();ui.choices.innerHTML="";
  if(!isNaN(d.score))setScore(d.score);
  if(tags.includes("hint")){                                  /* تلميح: يتقال وبعدين يرجع للسؤال */
    if(!await narrate(d.lines,my))return;
    if(d.links.length===1){await wait(250);if(my===run)d.links[0].click()}else choices(d.links,my);
    return}
  const key=d.lines.filter(l=>l.kind==="q").map(l=>l.text).join("|")+"#"+d.links.map(l=>l.textContent.trim()).join("|");
  const retry=seen.has(key);seen.add(key);last=d;if(!retry){step++;setProg()}
  emit("passage",{lines:d.lines,links:d.links,retry:retry,char:current,passage:p});
  if(!retry&&!await narrate(d.lines,my))return;               /* لو رجع من تلميح يعرض الأزرار بس */
  if(my===run)choices(d.links,my);
}
function handle(p,n){
  if(p.classList.contains("transition-out"))return;
  const tags=(p.getAttribute("tags")||"").split(/\s+/),d=read(p);
  if(!d.lines.length&&!d.links.length&&(n||0)<5)return void setTimeout(()=>handle(p,(n||0)+1),100);
  tags.includes("home")?showHome(p,d):chatPassage(p,d,tags);
}
const done=new WeakSet();
function scan(){document.querySelectorAll("tw-story > tw-passage").forEach(p=>{if(!done.has(p)){done.add(p);setTimeout(()=>handle(p),0)}})}
function init(){
  build();
  new MutationObserver(()=>requestAnimationFrame(scan)).observe(document.querySelector("tw-story")||document.body,{childList:true});
  scan();emit("ready",null);
}

/* ============ 6) API عامة للسكريبتات القادمة ============ */
const api=window.Celestia={
  config:CONFIG,characters:CHARACTERS,on:on,emit:emit,
  character:id=>CHARACTERS.find(c=>c.id===id),
  get current(){return current},
  setProvider(p){provider=p||webSpeech;return api},            /* بدّل الصوت بالكامل (ElevenLabs, ملفات صوت...) */
  speak:t=>speak(t,"api"),stop:stop,
  async say(lines){const my=run;await narrate([].concat(lines).map(t=>({kind:"m",text:t})),my)}   /* رسالة بوت من أي سكريبت */
};
document.body?init():document.addEventListener("DOMContentLoaded",init);
})();
