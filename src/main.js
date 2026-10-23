import './style.css';
import confetti from 'canvas-confetti';
import { gsap } from 'gsap';
import { Romance3DScene } from './threeScene';
import { RomanticAudioEngine } from './audio';
import { sendOfficialLoveEmail, EMAIL_CONFIG } from './email';

// ======================================================
// Initialize 3D Graphics & Audio
// ======================================================
const canvas = document.getElementById('webgl-canvas');
const romanceScene = new Romance3DScene(canvas);
const audioEngine = new RomanticAudioEngine();

// Create floating rose petals
createPetals();

// ======================================================
// DOM References
// ======================================================
const musicBtn = document.getElementById('music-btn');
const sceneEnvelope = document.getElementById('scene-envelope');
const envelopeCard = document.getElementById('envelope-card');
const sceneJourney = document.getElementById('scene-journey');
const btnNextStory = document.getElementById('btn-next-story');
const storyCards = document.querySelectorAll('.story-card');
const storyDots = document.querySelectorAll('.story-dots .dot');
const sceneProposal = document.getElementById('scene-proposal');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const dodgeBubble = document.getElementById('dodge-bubble');
const proposalActions = document.getElementById('proposal-actions-area');
const sceneCelebration = document.getElementById('scene-celebration');
const btnMoreFireworks = document.getElementById('btn-more-fireworks');
const btnSaveCert = document.getElementById('btn-save-cert');
const emailStatusCard = document.getElementById('email-status-card');
const emailStatusTitle = document.getElementById('email-status-title');
const emailStatusDesc = document.getElementById('email-status-desc');
const timerDays = document.getElementById('timer-days');
const timerHours = document.getElementById('timer-hours');
const timerMins = document.getElementById('timer-mins');
const timerSecs = document.getElementById('timer-secs');

const LOVE_START_KEY = 'ngoc_love_start_ts';

let storyIndex = 0;
let dodgeCount = 0;
let loveStartTime = null;
let timerInterval = null;

// Playful messages when she tries to click "No"
const dodgeMessages = [
  'Ơ kìa, đừng bấm vào đây mà 🥺',
  'Ngọc ơi, suy nghĩ lại đi mà! 💕',
  'Nút này đang ngại... chọn nút hồng kia nha! 🙈',
  'Anh hứa sẽ chiều chuộng em mà! 🌹',
  'Không cho Ngọc từ chối đâu nà! 🏃💨',
  'Bé Ngọc bấm nhầm nút rồi kìa! 🥰',
  'Dạ em đồng ý đi mà, năn nỉ đó nha ❤️',
  'Đừng làm anh buồn mà 😭',
  'Nút này đang chạy trốn vì biết em thích anh quá rồi 😌',
  'Chọn nút đỏ đi em ơi, anh đang cười rồi đó 💖',
  'Em cười rồi thì hãy bấm nút hồng đi thôi 🩷',
  'Ngọc ơi, anh đã làm bánh, còn gì nữa đâu? 😅',
];

// ======================================================
// 0b. RESTORE SESSION — jump to celebration if already said YES
// ======================================================
(function restoreSession() {
  const saved = localStorage.getItem(LOVE_START_KEY);
  if (!saved) return;

  const ts = parseInt(saved, 10);
  if (isNaN(ts)) return;

  // Hide all scenes, show celebration directly
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  sceneCelebration.classList.add('active');

  // Update email card to show already-confirmed state
  emailStatusCard.classList.add('success');
  emailStatusTitle.textContent = '✨ Tình yêu đã được chứng nhận!';
  emailStatusDesc.innerHTML = `
    Thư xác nhận đã được gửi tới <strong>${EMAIL_CONFIG.partnerEmail}</strong>
    và <strong>${EMAIL_CONFIG.myEmail}</strong> kể từ khi em đồng ý.
    <br><span style="color:rgba(255,192,203,0.8);font-size:0.75rem;">
      (Tải lại trang không xoá được ký ức này 💕)
    </span>
  `;

  // Start timer from the original timestamp
  loveStartTime = ts;
  startLoveTimer();
})();

// ======================================================
// 0. FLOATING PETALS
// ======================================================
function createPetals() {
  const layer = document.getElementById('petals-layer');
  if (!layer) return;
  const count = window.innerWidth < 600 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 12 + Math.random() * 14;
    const left = Math.random() * 100;
    const duration = 8 + Math.random() * 14;
    const delay = Math.random() * -20;
    const hue = 340 + Math.random() * 30;
    petal.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size * 1.2}px;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      background: radial-gradient(ellipse at 40% 30%,
        hsla(${hue},90%,80%,0.9),
        hsla(${hue},75%,55%,0.5));
      transform: rotate(${Math.random() * 360}deg);
    `;
    layer.appendChild(petal);
  }
}

// ======================================================
// 1. MUSIC CONTROLLER
// ======================================================
musicBtn.addEventListener('click', () => {
  const isPlaying = audioEngine.toggleMusic();
  musicBtn.classList.toggle('playing', isPlaying);
});

// ======================================================
// 2. SCENE 1 → SCENE 2: OPEN ENVELOPE
// ======================================================
envelopeCard.addEventListener('click', () => {
  audioEngine.playSparkleSound();
  audioEngine.startMusic();
  musicBtn.classList.add('playing');

  gsap.to(envelopeCard, {
    scale: 1.12,
    opacity: 0,
    duration: 0.75,
    ease: 'power3.in',
    onComplete: () => {
      sceneEnvelope.classList.remove('active');
      sceneJourney.classList.add('active');
      gsap.fromTo(
        '.journey-container',
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    },
  });
});

// ======================================================
// 3. SCENE 2: STORY CARD PROGRESSION
// ======================================================
btnNextStory.addEventListener('click', () => {
  audioEngine.playSparkleSound();
  storyIndex++;

  if (storyIndex < storyCards.length) {
    storyCards.forEach((card, idx) => card.classList.toggle('active', idx === storyIndex));
    storyDots.forEach((dot, idx) => dot.classList.toggle('active', idx === storyIndex));

    if (storyIndex === storyCards.length - 1) {
      btnNextStory.querySelector('span').textContent = 'Điều anh muốn nói nhất 💖';
    }
  } else {
    gsap.to(sceneJourney, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        sceneJourney.classList.remove('active');
        sceneProposal.classList.add('active');
        gsap.fromTo(
          '.proposal-container',
          { opacity: 0, scale: 0.88, y: 24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.5)' }
        );
      },
    });
  }
});

// ======================================================
// 4. SCENE 3: NO BUTTON — Jumps inside the actions box
// ======================================================
function showDodgeBubble() {
  const msg = dodgeMessages[dodgeCount % dodgeMessages.length];
  dodgeBubble.textContent = msg;
  dodgeBubble.classList.remove('show');
  void dodgeBubble.offsetWidth;
  dodgeBubble.classList.add('show');

  clearTimeout(dodgeBubble._timer);
  dodgeBubble._timer = setTimeout(() => dodgeBubble.classList.remove('show'), 2200);
}

function dodgeNoButton(e) {
  if (e) e.preventDefault();
  audioEngine.playWhooshSound();
  dodgeCount++;

  const areaRect = proposalActions.getBoundingClientRect();
  const btnRect = btnNo.getBoundingClientRect();
  const yesRect = btnYes.getBoundingClientRect();

  const margin = 12;
  const buttonWidth = Math.max(120, btnRect.width || 128);
  const buttonHeight = Math.max(38, btnRect.height || 42);
  const xMin = margin;
  const yMin = margin;
  const xMax = Math.max(xMin, areaRect.width - buttonWidth - margin);
  const yMax = Math.max(yMin, areaRect.height - buttonHeight - margin);

  const yesCenterX = yesRect.left - areaRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top - areaRect.top + yesRect.height / 2;
  const clickX = e ? e.clientX - areaRect.left : areaRect.width * 0.82;
  const clickY = e ? e.clientY - areaRect.top : areaRect.height * 0.18;

  const candidates = [];
  const stepX = 24;
  const stepY = 20;

  for (let x = xMin; x <= xMax; x += stepX) {
    for (let y = yMin; y <= yMax; y += stepY) {
      const centerX = x + buttonWidth / 2;
      const centerY = y + buttonHeight / 2;
      const distanceFromClick = Math.hypot(centerX - clickX, centerY - clickY);
      const distanceFromYes = Math.hypot(centerX - yesCenterX, centerY - yesCenterY);

      if (distanceFromYes < 95) continue;

      candidates.push({
        x,
        y,
        score: distanceFromClick + distanceFromYes * 0.9 + Math.random() * 25,
      });
    }
  }

  let best = candidates.sort((a, b) => b.score - a.score)[0];

  if (!best) {
    best = {
      x: Math.min(xMax, Math.max(xMin, areaRect.width - buttonWidth - margin)),
      y: Math.min(yMax, Math.max(yMin, margin)),
      score: 0,
    };
  }

  const rotate = ((Math.random() - 0.5) * 18).toFixed(1);
  const scale = (0.96 + Math.random() * 0.14).toFixed(2);

  btnNo.style.position = 'absolute';
  btnNo.style.left = `${best.x}px`;
  btnNo.style.top = `${best.y}px`;
  btnNo.style.bottom = 'auto';
  btnNo.style.right = 'auto';
  btnNo.style.transform = `rotate(${rotate}deg) scale(${scale})`;
  btnNo.style.transition = 'left 0.18s cubic-bezier(0.2, 0.9, 0.2, 1), top 0.18s cubic-bezier(0.2, 0.9, 0.2, 1), transform 0.18s ease';
  btnNo.style.zIndex = '60';

  showDodgeBubble();

  const scaleYes = Math.min(1.28, 1 + dodgeCount * 0.045);
  gsap.to(btnYes, { scale: scaleYes, duration: 0.25, ease: 'back.out(2)' });
}

btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
btnNo.addEventListener('pointerdown', dodgeNoButton, { passive: false });

// ======================================================
// 5. YES BUTTON — Celebration!
// ======================================================
btnYes.addEventListener('click', async () => {
  audioEngine.playCelebrationSound();
  romanceScene.triggerSupernova();
  triggerFullCelebrationConfetti();

  gsap.to(sceneProposal, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      sceneProposal.classList.remove('active');
      btnNo.style.display = 'none';
      dodgeBubble.classList.remove('show');
      sceneCelebration.classList.add('active');

      loveStartTime = Date.now();
      localStorage.setItem(LOVE_START_KEY, String(loveStartTime));
      startLoveTimer();
    },
  });

  // Send email
  try {
    const result = await sendOfficialLoveEmail();
    if (result.success) {
      emailStatusCard.classList.add('success');
      emailStatusTitle.textContent = '✨ Thư chứng nhận tình yêu đã được kích hoạt!';
      emailStatusDesc.innerHTML = `
        Đã gửi thông báo chính thức tới <strong>${EMAIL_CONFIG.partnerEmail}</strong> và <strong>${EMAIL_CONFIG.myEmail}</strong>.
        <br><span style="color:rgba(255,192,203,0.8);font-size:0.75rem;">Thời gian ghi nhận: ${result.timestamp}</span>
      `;
    }
  } catch (err) {
    console.error('Email error:', err);
  }
});

// ======================================================
// 6. CONFETTI ENGINE
// ======================================================
function triggerFullCelebrationConfetti() {
  const duration = 6000;
  const endTime = Date.now() + duration;
  const colors = ['#ff2d60', '#ff758c', '#ffd1dc', '#ffeaa7', '#c084fc'];

  // Initial center burst
  confetti({
    particleCount: 130,
    spread: 100,
    origin: { y: 0.58 },
    colors,
    shapes: ['circle', 'square'],
  });

  // Side cannons
  const frame = () => {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < endTime) requestAnimationFrame(frame);
  };
  frame();
}

btnMoreFireworks.addEventListener('click', () => {
  audioEngine.playCelebrationSound();
  triggerFullCelebrationConfetti();
});

btnSaveCert.addEventListener('click', () => {
  alert('📸 Hãy chụp lại màn hình để lưu kỷ niệm ngày hai ta chính thức yêu nhau nhé, Ngọc yêu! ❤️');
});

// ======================================================
// 7. LOVE STOPWATCH TIMER
// ======================================================
function startLoveTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!loveStartTime) return;
    const diff = Date.now() - loveStartTime;
    const secs = Math.floor((diff / 1000) % 60);
    const mins = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 86400000);
    timerDays.textContent = String(days).padStart(2, '0');
    timerHours.textContent = String(hours).padStart(2, '0');
    timerMins.textContent = String(mins).padStart(2, '0');
    timerSecs.textContent = String(secs).padStart(2, '0');
  }, 1000);
}
