const pages = document.querySelectorAll(".page");

const answers = {};

function showPage(id) {
  pages.forEach(page => {
    page.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =========================
// FLOATING HEARTS
// =========================

const heartContainer = document.querySelector(".floating-hearts");

for (let i = 0; i < 15; i++) {
  const heart = document.createElement("span");

  heart.className = "heart";
  heart.textContent = Math.random() > .5 ? "♡" : "♥";

  heart.style.left = Math.random() * 100 + "%";
  heart.style.animationDuration = (8 + Math.random() * 8) + "s";
  heart.style.animationDelay = (-Math.random() * 10) + "s";
  heart.style.fontSize = (12 + Math.random() * 18) + "px";

  heartContainer.appendChild(heart);
}


// =========================
// SOUND
// =========================

let audioContext;

function sound(type = "click") {

  try {

    if (!audioContext) {
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "success") {

      oscillator.frequency.setValueAtTime(500, now);
      oscillator.frequency.exponentialRampToValueAtTime(800, now + .15);

    } else {

      oscillator.frequency.setValueAtTime(400, now);
      oscillator.frequency.exponentialRampToValueAtTime(600, now + .1);

    }

    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.06, now + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .18);

    oscillator.start(now);
    oscillator.stop(now + .2);

  } catch (e) {}
}


// =========================
// LOGIN
// =========================

const pinInput = document.getElementById("pinInput");
const enterBtn = document.getElementById("enterBtn");
const loginError = document.getElementById("loginError");

enterBtn.addEventListener("click", () => {

  sound("click");

  const value = pinInput.value.trim();

  if (value === "150926" || value === "T+L=♡") {

    sound("success");

    showPage("introPage");

  } else {

    loginError.textContent =
      "hmm... PIN/password-nya belum benar 🥺";

    pinInput.classList.remove("shake");

    void pinInput.offsetWidth;

    pinInput.classList.add("shake");

    pinInput.value = "";
  }
});

pinInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {
    enterBtn.click();
  }

});


// =========================
// NEXT BUTTONS
// =========================

const nextButtons = document.querySelectorAll(".next-btn");

const destinations = [
  "section1",
  "section2",
  "section3",
  "section4",
  "section5"
];

nextButtons.forEach((button, index) => {

  button.addEventListener("click", () => {

    sound("click");

    saveAnswers();

    if (index < destinations.length) {
      showPage(destinations[index]);
    }

  });

});


// =========================
// SAVE ANSWERS
// =========================

function saveAnswers() {

  const currentPage =
    document.querySelector(".page.active");

  if (!currentPage) return;

  const fields =
    currentPage.querySelectorAll(".answer");

  fields.forEach(field => {

    const key = field.dataset.key;

    if (!key) return;

    let value = field.value.trim();

    if (value !== "") {
      answers[key] = value;
    }

  });

}


// =========================
// FINISH
// =========================

const finishBtn =
  document.getElementById("finishBtn");

finishBtn.addEventListener("click", () => {

  sound("success");

  saveAnswers();

  createProfile();

  showPage("resultPage");

});


// =========================
// CREATE PROFILE
// =========================

function createProfile() {

  const result =
    document.getElementById("profileResult");

  result.innerHTML = "";

  const keys = Object.keys(answers);

  if (keys.length === 0) {

    result.innerHTML = `
      <div class="profile-item">
        <span class="value">
          ternyata kamu memilih jadi misterius ya 😭🤍
        </span>
      </div>
    `;

    return;
  }

  keys.forEach(key => {

    const item =
      document.createElement("div");

    item.className = "profile-item";

    const keyElement =
      document.createElement("span");

    keyElement.className = "key";
    keyElement.textContent = key;

    const valueElement =
      document.createElement("div");

    valueElement.className = "value";
    valueElement.textContent = answers[key];

    item.appendChild(keyElement);
    item.appendChild(valueElement);

    result.appendChild(item);

  });

}


// =========================
// WHATSAPP
// =========================

const whatsappBtn =
  document.getElementById("whatsappBtn");

whatsappBtn.addEventListener("click", () => {

  sound("success");

  let message =
`💌 HASIL GET TO KNOW YOU ♡

Aku baru selesai mengenal kamu sedikit lebih jauh.

`;

  Object.entries(answers).forEach(([key, value]) => {

    message += `♡ ${key}
${value}

`;

  });

  message +=
`Makasih udah mau cerita 🤍
— dari Liyaa ♡`;

  const encoded =
    encodeURIComponent(message);

  // Tidak menentukan nomor tujuan.
  // WhatsApp akan meminta pengguna memilih kontak sendiri.
  const whatsappURL =
    `https://wa.me/?text=${encoded}`;

  window.open(
    whatsappURL,
    "_blank"
  );

});


// =========================
// RESTART
// =========================

document
  .getElementById("restartBtn")
  .addEventListener("click", () => {

    sound("click");

    Object.keys(answers).forEach(key => {
      delete answers[key];
    });

    document
      .querySelectorAll(".answer")
      .forEach(field => {
        field.value = "";
      });

    showPage("introPage");

  });


// =========================
// SOUND ON INTERACTIONS
// =========================

document.addEventListener("click", event => {

  const target = event.target;

  if (
    target.tagName === "BUTTON" &&
    target.id !== "enterBtn" &&
    target.id !== "finishBtn" &&
    target.id !== "whatsappBtn" &&
    !target.classList.contains("next-btn") &&
    target.id !== "restartBtn"
  ) {
    sound("click");
  }

});