// 🔥 FIREBASE CONFIG (PUT YOUR REAL KEYS)
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