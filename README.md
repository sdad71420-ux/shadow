# shadow
/* 🔥 FONTS */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Poppins:wght@300;600&display=swap');

/* 🌌 BODY */
body{
margin:0;
font-family:'Poppins', sans-serif;
color:white;
background: linear-gradient(-45deg,#000,#1a0000,#000,#300000);
background-size:400% 400%;
animation:bg 10s infinite alternate;
}

/* BACKGROUND ANIMATION */
@keyframes bg{
0%{background-position:0% 50%;}
100%{background-position:100% 50%;}
}

/* 🔝 HEADER */
header{
display:flex;
justify-content:space-between;
align-items:center;
padding:15px;
background:#000;
border-bottom:1px solid red;
position:sticky;
top:0;
z-index:1000;
}

/* LOGO */
.logo{
font-family:'Orbitron';
font-size:1.6rem;
letter-spacing:2px;
text-shadow:0 0 10px red,0 0 20px red;
}

/* NAV */
nav button{
background:none;
border:none;
color:white;
margin:0 8px;
cursor:pointer;
transition:0.3s;
}

nav button:hover{
color:red;
text-shadow:0 0 10px red;
}

/* SECTIONS */
section{
display:none;
padding:20px;
}
.active{
display:block;
}

/* HEADINGS */
h2{
font-family:'Orbitron';
text-shadow:0 0 10px red;
}

/* 🎮 GRID */
.grid{
display:flex;
gap:15px;
overflow-x:auto;
padding-top:10px;
}

/* 🎮 GAME CARDS */
.card{
min-width:200px;
background:#120000;
padding:10px;
border-radius:10px;
border:1px solid red;
transition:0.3s;
}

.card:hover{
transform:scale(1.07);
box-shadow:0 0 25px red;
}

.card img{
width:100%;
height:120px;
object-fit:cover;
border-radius:8px;
}

/* BUTTONS */
button{
background:red;
color:white;
border:none;
padding:10px;
margin-top:8px;
width:100%;
cursor:pointer;
border-radius:6px;
transition:0.3s;
}

button:hover{
background:#ff1a1a;
box-shadow:0 0 15px red;
}

/* INPUTS */
input, select{
width:100%;
padding:10px;
margin:5px 0;
background:#000;
color:white;
border:1px solid red;
border-radius:5px;
}

/* 🎬 NETFLIX STYLE */
.netflix-row{
display:flex;
gap:10px;
overflow-x:auto;
padding:10px;
}

.netflix-card{
min-width:160px;
height:240px;
position:relative;
cursor:pointer;
transition:0.3s;
}

.netflix-card img{
width:100%;
height:100%;
object-fit:cover;
border-radius:6px;
}

.netflix-card:hover{
transform:scale(1.1);
z-index:10;
}

.overlay{
position:absolute;
bottom:0;
width:100%;
background:linear-gradient(transparent, black);
padding:10px;
opacity:0;
transition:0.3s;
}

.netflix-card:hover .overlay{
opacity:1;
}

/* 🎬 MOVIE PLAYER */
.movie-player{
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:black;
z-index:3000;
justify-content:center;
align-items:center;
}

.movie-content{
width:90%;
max-width:900px;
text-align:center;
}

.movie-content video{
width:100%;
border-radius:10px;
box-shadow:0 0 30px red;
}

/* 🎧 SPOTIFY PLAYER */
.music-player{
position:fixed;
bottom:0;
left:0;
width:100%;
background:#000;
display:flex;
align-items:center;
justify-content:space-between;
padding:10px;
border-top:1px solid red;
z-index:2000;
}

.music-player img{
width:50px;
height:50px;
border-radius:5px;
}

.music-info{
flex:1;
margin:0 10px;
}

.controls button{
width:auto;
margin:0 5px;
}

/* 📦 POPUP */
.popup{
display:none;
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.9);
justify-content:center;
align-items:center;
z-index:2500;
}

.popup-content{
background:#120000;
padding:20px;
border-radius:10px;
border:1px solid red;
box-shadow:0 0 20px red;
width:300px;
position:relative;
}

.close{
position:absolute;
top:10px;
right:15px;// 🔥 FIREBASE CONFIG (PUT YOUR REAL KEYS)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_ID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// =======================
// 📄 NAVIGATION
// =======================
function showPage(page){
  document.querySelectorAll("section").forEach(sec=>{
    sec.classList.remove("active")
  })
  document.getElementById(page).classList.add("active")
}

// =======================
// 🎮🎬🎧 LOAD CONTENT
// =======================
let playlist = []

function loadContent(){

  db.collection("content")
  .where("approved","==",true)
  .get()
  .then(snapshot=>{

    document.getElementById("games").innerHTML = ""
    document.getElementById("movies").innerHTML = ""
    document.getElementById("music").innerHTML = ""

    playlist = []

    snapshot.forEach(doc=>{

      let item = doc.data()
      item.id = doc.id

      let card = document.createElement("div")
      card.className = "card"

      // 🎮 GAMES
      if(item.category === "games"){
        card.innerHTML = `
          <img src="${item.image}">
          <h3>${item.title}</h3>
          <p>🎮 PC Game (.RAR)</p>

          <button onclick="buyGame('${item.id}','${item.link}')">
          Download
          </button>
        `
        document.getElementById("games").appendChild(card)
      }

      // 🎬 MOVIES (NETFLIX STYLE)
      else if(item.category === "movies"){

        let mcard = document.createElement("div")
        mcard.className = "netflix-card"

        mcard.innerHTML = `
          <img src="${item.image}">
          <div class="overlay">
            <h4>${item.title}</h4>

            <button onclick="watchMovie('${item.link}','${item.title}')">
            ▶ Play
            </button>

            <button onclick="downloadGame('${item.id}','${item.link}')">
            ⬇
            </button>
          </div>
        `

        document.getElementById("movies").appendChild(mcard)
      }

      // 🎧 MUSIC (SPOTIFY STYLE)
      else if(item.category === "music"){

        playlist.push(item)

        card.innerHTML = `
          <img src="${item.image}">
          <h3>${item.title}</h3>

          <button onclick="playMusic('${item.link}','${item.title}','${item.image}')">
          ▶ Play
          </button>

          <button onclick="downloadGame('${item.id}','${item.link}')">
          ⬇ Download
          </button>
        `
        document.getElementById("music").appendChild(card)
      }

    })

  })
}

// =======================
// 🎬 MOVIE PLAYER
// =======================
function watchMovie(link, title){

  const player = document.getElementById("moviePlayer")
  const video = document.getElementById("movieVideo")

  player.style.display = "flex"
  video.src = link
  document.getElementById("movieTitle").innerText = title

  video.play()
}

function closeMovie(){
  const video = document.getElementById("movieVideo")
  video.pause()
  video.src = ""
  document.getElementById("moviePlayer").style.display = "none"
}

function toggleFullscreen(){
  const video = document.getElementById("movieVideo")
  if(video.requestFullscreen){
    video.requestFullscreen()
  }
}

// =======================
// 🎧 MUSIC PLAYER
// =======================
let currentAudio = new Audio()
let currentIndex = 0

function playMusic(link, title, image){

  currentAudio.src = link
  currentAudio.play()

  document.getElementById("musicTitle").innerText = title
  document.getElementById("musicCover").src = image

  currentIndex = playlist.findIndex(p => p.link === link)
}

// PLAY / PAUSE
function togglePlay(){
  if(currentAudio.paused){
    currentAudio.play()
  }else{
    currentAudio.pause()
  }
}

// NEXT
function nextSong(){
  currentIndex++
  if(currentIndex >= playlist.length) currentIndex = 0

  let item = playlist[currentIndex]
  playMusic(item.link, item.title, item.image)
}

// PREVIOUS
function prevSong(){
  currentIndex--
  if(currentIndex < 0) currentIndex = playlist.length - 1

  let item = playlist[currentIndex]
  playMusic(item.link, item.title, item.image)
}

// =======================
// ⬇ DOWNLOAD + INSTALL POPUP
// =======================
function downloadGame(id, link){

  const ref = db.collection("content").doc(id)

  ref.get().then(doc=>{

    let current = doc.data().downloads || 0

    ref.update({
      downloads: current + 1
    })

    window.open(link, "_blank")

    setTimeout(()=>{
      showPopup()
    },1000)

  })

}

// =======================
// 💳 PAYMENT (DEMO)
// =======================
function buyGame(id, link){

  alert("Processing payment 💳")

  setTimeout(()=>{
    alert("Payment successful ✅")
    downloadGame(id, link)
    trackEarnings(id)
  },2000)

}

// =======================
// 💰 TRACK EARNINGS
// =======================
function trackEarnings(id){

  const ref = db.collection("content").doc(id)

  ref.get().then(doc=>{

    let data = doc.data()
    let earnings = data.earnings || 0

    earnings += Number(data.price || 0)

    ref.update({ earnings })

  })

}

// =======================
// 📦 INSTALL POPUP
// =======================
function showPopup(){
  document.getElementById("installPopup").style.display = "flex"
}

function closePopup(){
  document.getElementById("installPopup").style.display = "none"
}

// =======================
// 📤 UPLOAD SYSTEM
// =======================
const form = document.getElementById("uploadForm")

if(form){
form.addEventListener("submit", e=>{

  e.preventDefault()

  db.collection("content").add({
    title: title.value,
    category: category.value,
    image: image.value,
    link: link.value,
    price: Number(price.value) || 0,
    approved: false,
    downloads: 0,
    earnings: 0
  })

  alert("Uploaded! Waiting for approval 🔥")
  form.reset()

})
}

// =======================
// 🔐 AUTH
// =======================
function signup(){
  auth.createUserWithEmailAndPassword(email.value, password.value)
  .then(()=>alert("Account created"))
  .catch(err=>alert(err.message))
}

function login(){
  auth.signInWithEmailAndPassword(email.value, password.value)
  .then(()=>alert("Logged in"))
  .catch(err=>alert(err.message))
}

// =======================
// 👤 PROFILE
// =======================
auth.onAuthStateChanged(user=>{

  if(!user) return

  document.getElementById("userEmail").innerText = user.email

  db.collection("content").get().then(snapshot=>{

    const container = document.getElementById("myUploads")
    container.innerHTML = ""

    snapshot.forEach(doc=>{
      let item = doc.data()

      let card = document.createElement("div")
      card.className = "card"

      card.innerHTML = `
        <h3>${item.title}</h3>
        <p>⬇ ${item.downloads || 0}</p>
      `

      container.appendChild(card)
    })

  })

})

// =======================
// 🛡 ADMIN
// =======================
function loadAdmin(){

  const container = document.getElementById("adminContent")
  if(!container) return

  db.collection("content").get().then(snapshot=>{

    container.innerHTML = ""

    snapshot.forEach(doc=>{

      let item = doc.data()

      let div = document.createElement("div")
      div.className = "card"

      div.innerHTML = `
        <h3>${item.title}</h3>
        <button onclick="approve('${doc.id}')">Approve</button>
        <button onclick="deleteItem('${doc.id}')">Delete</button>
      `

      container.appendChild(div)

    })

  })
}

function approve(id){
  db.collection("content").doc(id).update({approved:true})
  alert("Approved")
}

function deleteItem(id){
  db.collection("content").doc(id).delete()
  alert("Deleted")
}

// =======================
// 📊 DASHBOARD
// =======================
function loadDashboard(){

  let downloads = 0
  let earnings = 0

  db.collection("content").get().then(snapshot=>{

    snapshot.forEach(doc=>{
      let data = doc.data()
      downloads += data.downloads || 0
      earnings += data.earnings || 0
    })
<!DOCTYPE html>
<html>
<head>
<title>ShadowPlay</title>

<link rel="stylesheet" href="css/style.css">

<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Poppins:wght@300;600&display=swap" rel="stylesheet">

<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"></script>

<script src="https://js.stripe.com/v3/"></script>

</head>

<body>

<!-- HEADER -->
<header>
<div class="logo">ShadowPlay</div>

<nav>
<button onclick="showPage('home')">Home</button>
<button onclick="showPage('upload')">Upload</button>
<button onclick="showPage('login')">Login</button>
<button onclick="showPage('profile')">Profile</button>
<button onclick="showPage('admin')">Admin</button>
<button onclick="showPage('dashboard')">Dashboard</button>
</nav>
</header>

<!-- HOME -->
<section id="home" class="active">

<!-- 🎮 GAMES -->
<h2>🎮 Games</h2>
<div class="grid" id="games"></div>

<!-- 🎬 NETFLIX MOVIES -->
<h2>🔥 Trending Movies</h2>
<div class="netflix-row" id="movies"></div>

<!-- 🎵 MUSIC -->
<h2>🎧 Music</h2>
<div class="grid" id="music"></div>

</section>

<!-- UPLOAD -->
<section id="upload">

<h2>Upload Content</h2>

<form id="uploadForm">

<input id="title" placeholder="Title" required>

<select id="category">
<option value="games">🎮 Game (.RAR)</option>
<option value="movies">🎬 Movie</option>
<option value="music">🎵 Music</option>
</select>

<input id="image" placeholder="Image URL">
<input id="trailer" placeholder="YouTube Trailer (games)">
<input id="link" placeholder="File / Stream Link">
<input id="price" type="number" placeholder="Price ($)">

<button type="submit">Upload</button>

</form>

</section>

<!-- LOGIN -->
<section id="login">

<h2>Login</h2>

<input id="email" placeholder="Email">
<input id="password" placeholder="Password">

<button onclick="signup()">Sign Up</button>
<button onclick="login()">Login</button>

</section>

<!-- PROFILE -->
<section id="profile">

<h2 id="userEmail"></h2>
<div class="grid" id="myUploads"></div>

</section>

<!-- ADMIN -->
<section id="admin">

<h2>Admin Panel</h2>
<div id="adminContent"></div>

</section>

<!-- DASHBOARD -->
<section id="dashboard">

<h2>Dashboard</h2>

<p>Total Downloads: <span id="totalDownloads">0</span></p>
<p>Total Earnings: <span id="totalEarnings">$0</span></p>

</section>

<!-- 🎬 MOVIE PLAYER -->
<div id="moviePlayer" class="movie-player">
<div class="movie-content">

<span class="close" onclick="closeMovie()">×</span>

<video id="movieVideo" controls></video>
<h3 id="movieTitle"></h3>

<button onclick="toggleFullscreen()">⛶ Fullscreen</button>

</div>
</div>

<!-- 🎧 SPOTIFY PLAYER -->
<div id="musicPlayer" class="music-player">

<img id="musicCover">

<div class="music-info">
<h4 id="musicTitle">No song playing</h4>
<input type="range" id="progress">
</div>

<div class="controls">
<button onclick="prevSong()">⏮</button>
<button onclick="togglePlay()">▶</button>
<button onclick="nextSong()">⏭</button>
</div>

</div>

<!-- 📦 INSTALL POPUP -->
<div id="installPopup" class="popup">
<div class="popup-content">

<span class="close" onclick="closePopup()">×</span>

<h2>How to Install Game</h2>
<p>1. Download .RAR</p>
<p>2. Extract with WinRAR</p>
<p>3. Run setup.exe</p>
<p>4. Enjoy 🔥</p>

</div>
</div>

<script src="js/app.js"></script>

</body>
</html>
    document.getElementById("totalDownloads").innerText = downloads
    document.getElementById("totalEarnings").innerText = "$" + earnings

  })

}

// =======================
// 🚀 INIT
// =======================
window.onload = ()=>{
  loadContent()
  loadAdmin()
  loadDashboard()
}
font-size:22px;
cursor:pointer;
color:red;
}

/* SCROLLBAR */
::-webkit-scrollbar{
height:8px;
}
::-webkit-scrollbar-thumb{
background:red;
border-radius:10px;
}

/* FADE IN */
body{
opacity:0;
animation:fade 1s forwards, bg 10s infinite alternate;
}

@keyframes fade{
to{opacity:1;}
}
