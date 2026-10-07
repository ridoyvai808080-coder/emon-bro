// Firebase Authentication configuration
// 1) Create a Firebase project.
// 2) Enable Authentication -> Google and Phone.
// 3) Add your GitHub Pages domain to Authentication -> Settings -> Authorized domains.
// 4) Copy your Firebase Web App config below.
const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

const demoConfigMissing = firebaseConfig.apiKey.startsWith("PASTE_");
let app=null,auth=null,confirmation=null,recaptcha=null;
if(!demoConfigMissing){
  app=initializeApp(firebaseConfig); auth=getAuth(app);
  onAuthStateChanged(auth,user=>{
    if(user){ showUser(user); showPage("homePage"); }
    else showPage("loginPage");
  });
}else{
  // The page is intentionally not pretending to have a real account system
  // until the owner's Firebase project is connected.
  showPage("loginPage");
  setStatus("Real Gmail/Phone login চালু করতে Firebase config বসাতে হবে।");
}

function showPage(id){document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));document.getElementById(id).classList.add("active");window.scrollTo(0,0)}
function setStatus(t){document.getElementById("authStatus").textContent=t||""}
window.showLogin=function(type){
 document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
 event.currentTarget.classList.add("active");
 document.getElementById("googleBox").classList.toggle("hidden",type!=="google");
 document.getElementById("phoneBox").classList.toggle("hidden",type!=="phone");
 setStatus("");
}
window.googleLogin=async function(){
 if(demoConfigMissing){setStatus("Firebase config এখনো বসানো হয়নি।");return}
 try{await signInWithPopup(auth,new GoogleAuthProvider())}catch(e){setStatus(e.message)}
}
window.sendOTP=async function(){
 if(demoConfigMissing){setStatus("Firebase config এখনো বসানো হয়নি।");return}
 const raw=document.getElementById("phone").value.replace(/\D/g,"");
 if(raw.length!==10 || !raw.startsWith("1")){setStatus("সঠিক বাংলাদেশি ফোন নম্বর দিন।");return}
 try{
   if(!recaptcha) recaptcha=new RecaptchaVerifier(auth,"phoneBox",{size:"invisible"});
   confirmation=await signInWithPhoneNumber(auth,"+880"+raw,recaptcha);
   document.getElementById("otpBox").classList.remove("hidden");setStatus("OTP পাঠানো হয়েছে।");
 }catch(e){setStatus(e.message)}
}
window.verifyOTP=async function(){
 if(!confirmation)return;
 try{await confirmation.confirm(document.getElementById("otp").value.trim())}catch(e){setStatus("OTP সঠিক নয় বা মেয়াদ শেষ হয়েছে।")}
}
function showUser(user){
 const label=user.displayName || user.phoneNumber || user.email || "Customer";
 document.getElementById("userName").textContent=label;
}
window.logout=async function(){if(auth) await signOut(auth);else showPage("loginPage")}
window.goHome=function(){showPage("homePage")}

const products={
 "Free Fire ID Code":[["100 Diamonds",75],["310 Diamonds",220],["520 Diamonds",350],["1060 Diamonds",690],["2180 Diamonds",1350]],
 "FF UniPin":[["UniPin 100",80],["UniPin 310",235],["UniPin 520",375],["UniPin 1060",720]],
 "Free Fire 200 Like":[["200 Like",49],["200 Like Fast",59]],
 "Evo Access":[["Evo Access",150],["Evo Access Premium",250]],
 "New Level Up Pass":[["Level Up Pass",120],["Level Up Pass Plus",220]],
 "PUBG Mobile UC":[["60 UC",110],["325 UC",490],["660 UC",960],["1800 UC",2450]]
};
let currentGame="",selectedPackage=null,selectedPayment="";
window.openGame=function(game,icon){
 currentGame=game;selectedPackage=null;selectedPayment="";
 document.getElementById("gameTitle").textContent=game;document.getElementById("gameIcon").textContent=icon;
 document.getElementById("sumGame").textContent=game;document.getElementById("sumPackage").textContent="—";document.getElementById("sumAmount").textContent="৳0";document.getElementById("sumPayment").textContent="—";
 document.getElementById("playerId").value="";document.getElementById("trxId").value="";
 document.querySelectorAll(".pay-btn").forEach(x=>x.classList.remove("selected"));
 document.getElementById("playerLabel").textContent=game==="Free Fire 200 Like"?"TikTok/Player ID":"Player ID";
 const box=document.getElementById("packages");box.innerHTML="";
 products[game].forEach((p,i)=>{let b=document.createElement("button");b.className="pkg";b.innerHTML=`<b>${p[0]}</b><small>৳${p[1]}</small>`;b.onclick=()=>selectPackage(i,b);box.appendChild(b)});
 showPage("orderPage");
}
function selectPackage(i,el){document.querySelectorAll(".pkg").forEach(x=>x.classList.remove("selected"));el.classList.add("selected");selectedPackage=products[currentGame][i];document.getElementById("sumPackage").textContent=selectedPackage[0];document.getElementById("sumAmount").textContent="৳"+selectedPackage[1]}
window.selectPayment=function(m){selectedPayment=m;document.querySelectorAll(".pay-btn").forEach(x=>x.classList.remove("selected"));document.getElementById(m==="bKash"?"bkashBtn":"nagadBtn").classList.add("selected");document.getElementById("sumPayment").textContent=m}
window.buyNow=function(){
 const player=document.getElementById("playerId").value.trim(),trx=document.getElementById("trxId").value.trim();
 if(!selectedPackage)return alert("একটি package নির্বাচন করুন");
 if(!player)return alert("Player ID দিন");
 if(!selectedPayment)return alert("Payment method নির্বাচন করুন");
 if(!trx)return alert("Transaction ID দিন");
 const [pkg,amount]=selectedPackage;
 const msg=`Assalamu Alaikum, Emon Top Up-এ নতুন order.%0A%0AGame: ${encodeURIComponent(currentGame)}%0APackage: ${encodeURIComponent(pkg)}%0APlayer ID: ${encodeURIComponent(player)}%0AAmount: ৳${amount}%0APayment Method: ${encodeURIComponent(selectedPayment)}%0ATransaction ID: ${encodeURIComponent(trx)}%0A%0Aঅনুগ্রহ করে order verify করুন।`;
 location.href=`https://wa.me/8801960261023?text=${msg}`;
}
