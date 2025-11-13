document.addEventListener("DOMContentLoaded",()=>{
  const goals=["sdg12","sdg13","sdg14","sdg15","sdg16"];
  const visited=JSON.parse(localStorage.getItem("visitedGoals"))||[];
  const current=location.pathname.split("/").pop().replace(".html","");
  if(goals.includes(current)&&!visited.includes(current)){
    visited.push(current);
    localStorage.setItem("visitedGoals",JSON.stringify(visited));
  }
  if(document.getElementById("progress-fill")){
    const pct=(visited.length/goals.length)*100;
    document.getElementById("progress-fill").style.width=pct+"%";
    document.getElementById("progress-text").textContent=`${visited.length} of ${goals.length} Goals Explored`;
  }
  const likeBtn=document.querySelector(".like-btn");
  if(likeBtn){
    const id=likeBtn.id;
    const numEl=document.getElementById("likeCount"+id.replace("like",""));
    let count=parseInt(localStorage.getItem(id))||0;
    numEl.textContent=`${count} people support this goal`;
    if(localStorage.getItem(id+"_liked")==="true")likeBtn.classList.add("liked");
    likeBtn.addEventListener("click",()=>{
      if(likeBtn.classList.contains("liked")){
        likeBtn.classList.remove("liked");count=Math.max(0,count-1);
        localStorage.setItem(id+"_liked","false");
      }else{
        likeBtn.classList.add("liked");count++;localStorage.setItem(id+"_liked","true");
      }
      localStorage.setItem(id,count);
      numEl.textContent=`${count} people support this goal`;
    });
  }
  const commentsDiv=document.getElementById("comments");
  if(commentsDiv){
    const comments=JSON.parse(localStorage.getItem(current+"_comments"))||[];
    renderComments(comments,commentsDiv);
  }
});
function addComment(goal){
  const name=document.getElementById("name").value.trim();
  const msg=document.getElementById("message").value.trim();
  if(!name||!msg)return alert("Please enter both name and comment.");
  const comments=JSON.parse(localStorage.getItem(goal+"_comments"))||[];
  comments.push({name,msg});
  localStorage.setItem(goal+"_comments",JSON.stringify(comments));
  renderComments(comments,document.getElementById("comments"));
  document.getElementById("name").value="";
  document.getElementById("message").value="";
}
function renderComments(comments,container){
  container.innerHTML="";
  comments.forEach(c=>{
    const div=document.createElement("div");
    div.classList.add("comment");
    div.innerHTML=`<strong>${c.name}</strong><p>${c.msg}</p>`;
    container.appendChild(div);
  });
}
/* Quiz from SDG12 */
function quizAnswer(choice){
  const result=document.getElementById("result");
  if(choice==='b'){result.textContent="✅ Correct! Every small action counts!";result.style.color="#355e3b";}
  else{result.textContent="❌ Not quite. Try again!";result.style.color="#b02a37";}
}
/* SDG13 Carbon Tracker */
function calcFootprint(){
  let score=0;
  if(document.getElementById("drive").checked)score+=3;
  if(document.getElementById("meat").checked)score+=2;
  if(document.getElementById("recycle").checked)score-=1;
  if(document.getElementById("public").checked)score-=1;
  const r=document.getElementById("footprintResult");
  if(score<=1)r.textContent="🌱 Low footprint — Great job!";
  else if(score<=3)r.textContent="🌤 Moderate — You’re doing well, but can improve.";
  else r.textContent="🔥 High footprint — Try carpooling, recycling more, and eating less meat!";
}
/* SDG14 Pledge */
function savePledge(goal){
  const checks=document.querySelectorAll(".pledge:checked");
  const pledges=[...checks].map(c=>c.value);
  localStorage.setItem(goal+"_pledges",JSON.stringify(pledges));
  document.getElementById("pledgeResult").textContent=`✅ You pledged to ${pledges.length} actions for the ocean!`;
}
/* SDG15 Tree Tracker */
function saveTrees(){
  const n=parseInt(document.getElementById("trees").value);
  if(!n||n<1)return alert("Please enter a valid number.");
  localStorage.setItem("treesPlanted",n);
  document.getElementById("treeMessage").textContent=`🌳 You’ve planted ${n} tree${n>1?"s":""}!`;
}
/* SDG16 Peace pledge */
function makePeacePledge(){
  const name=document.getElementById("pledgeName").value.trim();
  if(!name)return alert("Please enter your name.");
  const pledges=JSON.parse(localStorage.getItem("peacePledges"))||[];
  pledges.push(name);
  localStorage.setItem("peacePledges",JSON.stringify(pledges));
  document.getElementById("peaceMessage").textContent=`🕊 Thank you, ${name}! ${pledges.length} people have pledged for peace.`;
}
