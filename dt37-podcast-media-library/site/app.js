const fallbackEpisodes = [
{id:1,title:"Nghệ thuật bắt đầu lại",category:"Phát triển",duration:"18:42",host:"Minh Anh",symbol:"↗",cover:"green",description:"Những thay đổi nhỏ giúp bạn xây dựng một phiên bản tốt hơn của chính mình.",audio_url:null},
{id:2,title:"Công nghệ đang đổi thay",category:"Công nghệ",duration:"24:16",host:"Hoàng Nam",symbol:"⌘",cover:"blue",description:"Cùng nhìn vào những xu hướng công nghệ đang định hình cuộc sống.",audio_url:null},
{id:3,title:"Chậm lại giữa thành phố",category:"Đời sống",duration:"16:08",host:"Thảo My",symbol:"☼",cover:"orange",description:"Tìm những khoảng bình yên nhỏ giữa lịch trình bận rộn mỗi ngày.",audio_url:null},
{id:4,title:"Tư duy sáng tạo mỗi ngày",category:"Phát triển",duration:"21:35",host:"Gia Huy",symbol:"✳",cover:"pink",description:"Cách nuôi dưỡng trí tò mò và biến ý tưởng thành hành động.",audio_url:null},
{id:5,title:"AI và tương lai công việc",category:"Công nghệ",duration:"29:04",host:"Bảo Linh",symbol:"⌬",cover:"night",description:"Hiểu AI bằng ngôn ngữ gần gũi và chuẩn bị cho những thay đổi mới.",audio_url:null},
{id:6,title:"Một tách trà, một câu chuyện",category:"Đời sống",duration:"14:52",host:"Khánh Vy",symbol:"☕",cover:"purple",description:"Những câu chuyện đời thường nhắc ta trân trọng hiện tại.",audio_url:null}
];
const grid=document.querySelector("#podcast-grid"), searchInput=document.querySelector("#search-input");
const resultCount=document.querySelector("#result-count"), emptyState=document.querySelector("#empty-state");
const savedCount=document.querySelector("#saved-count"), toast=document.querySelector("#toast");
let episodes=[...fallbackEpisodes], activeCategory="Tất cả", currentView="all", currentEpisode=null, isPlaying=false;
let saved=new Set(), recent=[], toastTimer;
function notify(msg){toast.textContent=msg;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
async function loadEpisodes(){
 try{const response=await fetch("/api/episodes");if(!response.ok)throw Error("API unavailable");const rows=await response.json();
  if(Array.isArray(rows)&&rows.length)episodes=rows.map((ep,i)=>({...ep,symbol:["↗","⌘","☼","✳","⌬","☕"][i%6],cover:ep.cover_theme||"green"}));
 }catch(_e){/* Giao diện vẫn dùng dữ liệu mẫu nếu API chưa chạy. */}
 render();
}
function visibleEpisodes(){const query=searchInput.value.trim().toLocaleLowerCase("vi");return episodes.filter(ep=>{
 const matches=`${ep.title} ${ep.category} ${ep.host} ${ep.description||""}`.toLocaleLowerCase("vi").includes(query);
 const category=activeCategory==="Tất cả"||ep.category===activeCategory;
 const view=currentView==="saved"?saved.has(Number(ep.id)):currentView==="recent"?recent.includes(Number(ep.id)):true;
 return matches&&category&&view;
})}
function render(){const list=visibleEpisodes();resultCount.textContent=`${list.length} tập podcast`;savedCount.textContent=saved.size;
 emptyState.classList.toggle("hidden",list.length!==0);grid.classList.toggle("hidden",list.length===0);
 grid.innerHTML=list.map(ep=>`<article class="podcast-card"><div class="cover ${safe(ep.cover)}"><span class="cover-tag">SOUNDIFY ORIGINAL</span><span class="cover-symbol">${safe(ep.symbol||"♫")}</span><span class="cover-duration">${safe(ep.duration||"00:00")}</span></div><div class="card-meta"><span class="category-pill">${safe(ep.category)}</span><span>● Được chọn lọc</span></div><h3>${safe(ep.title)}</h3><p>${safe(ep.description||"Khám phá tập podcast mới trong thư viện.")}</p><div class="card-bottom"><div class="host"><span class="host-avatar">${safe((ep.host||"S").charAt(0))}</span>${safe(ep.host||"Soundify")}</div><div class="card-actions"><button class="icon-button ${saved.has(Number(ep.id))?"saved":""}" data-save="${Number(ep.id)}" aria-label="Lưu tập">♥</button><button class="icon-button play-card" data-play="${Number(ep.id)}" aria-label="Phát tập">▶</button></div></div></article>`).join("");
}
function safe(value){return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}
function selectEpisode(id){currentEpisode=episodes.find(ep=>Number(ep.id)===Number(id));if(!currentEpisode)return;
 recent=[Number(id),...recent.filter(x=>x!==Number(id))].slice(0,8);
 document.querySelector("#now-title").textContent=currentEpisode.title;document.querySelector("#now-subtitle").textContent=`${currentEpisode.host} · ${currentEpisode.category}`;
 document.querySelector("#player-cover").textContent=currentEpisode.symbol||"♫";document.querySelector("#total-time").textContent=currentEpisode.duration||"0:00";
 document.querySelector("#current-time").textContent="0:00";document.querySelector("#progress").value=0;
 isPlaying=true;document.querySelector("#main-play").textContent="Ⅱ";
 document.querySelector("#like-current").textContent=saved.has(Number(id))?"♥":"♡";render();
 notify(currentEpisode.audio_url?"Đã chọn tập podcast.":"Đã chọn tập — bản demo chưa có tệp âm thanh thật.");
}
grid.addEventListener("click",event=>{const saveButton=event.target.closest("[data-save]"),playButton=event.target.closest("[data-play]");
 if(saveButton){const id=Number(saveButton.dataset.save);saved.has(id)?saved.delete(id):saved.add(id);if(currentEpisode&&Number(currentEpisode.id)===id)document.querySelector("#like-current").textContent=saved.has(id)?"♥":"♡";render();notify(saved.has(id)?"Đã thêm vào tập yêu thích.":"Đã bỏ khỏi tập yêu thích.");}
 else if(playButton)selectEpisode(Number(playButton.dataset.play));
});
searchInput.addEventListener("input",()=>{if(searchInput.value.trim())currentView="all";render()});
document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("selected",b===btn));render()}));
document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{currentView=btn.dataset.view==="search"?"all":btn.dataset.view;document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b===btn));const labels={all:"Dành riêng cho bạn",saved:"Tập đã thích",recent:"Nghe gần đây"};document.querySelector("#library-title").textContent=labels[currentView]||labels.all;if(currentView==="search")searchInput.focus();document.querySelector("#library").scrollIntoView({behavior:"smooth",block:"start"});render()}));
function playFirst(){if(!currentEpisode)selectEpisode(visibleEpisodes()[0]?.id||episodes[0]?.id);else{isPlaying=!isPlaying;document.querySelector("#main-play").textContent=isPlaying?"Ⅱ":"▶";notify(isPlaying?"Đang ở trạng thái phát demo.":"Đã tạm dừng.");}}
document.querySelector("#main-play").addEventListener("click",()=>{if(!currentEpisode){notify("Hãy chọn một podcast trước nhé.");return}playFirst()});
document.querySelector("#hero-play").addEventListener("click",()=>selectEpisode(episodes[0].id));
document.querySelector("#playlist-play").addEventListener("click",()=>selectEpisode(episodes[0].id));
document.querySelector("#like-current").addEventListener("click",()=>{if(!currentEpisode){notify("Chọn một tập trước nhé.");return}const id=Number(currentEpisode.id);saved.has(id)?saved.delete(id):saved.add(id);document.querySelector("#like-current").textContent=saved.has(id)?"♥":"♡";render();notify(saved.has(id)?"Đã thêm vào tập yêu thích.":"Đã bỏ yêu thích.")});
function moveEpisode(delta){let index=episodes.findIndex(ep=>Number(ep.id)===Number(currentEpisode?.id));if(index<0)index=delta>0?-1:0;selectEpisode(episodes[(index+delta+episodes.length)%episodes.length].id)}
document.querySelector("#previous-button").addEventListener("click",()=>moveEpisode(-1));document.querySelector("#next-button").addEventListener("click",()=>moveEpisode(1));
document.querySelector("#progress").addEventListener("input",event=>{const total=(currentEpisode?.duration||"0:00").split(":").reduce((a,v)=>a*60+Number(v),0);const seconds=Math.floor(total*Number(event.target.value)/100);document.querySelector("#current-time").textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,"0")}`});
loadEpisodes();
