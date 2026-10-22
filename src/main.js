import './style.css';
import confetti from 'canvas-confetti';
import { gsap } from 'gsap';
import { Romance3DScene } from './threeScene';
import { RomanticAudioEngine } from './audio';
import { sendOfficialLoveEmail, getFormattedCurrentTime, EMAIL_CONFIG } from './email';

// Initialize 3D Graphics & Audio
const canvas = document.getElementById('webgl-canvas');
const romanceScene = new Romance3DScene(canvas);
const audioEngine = new RomanticAudioEngine();

// DOM Elements
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

const sceneCelebration = document.getElementById('scene-celebration');
const btnMoreFireworks = document.getElementById('btn-more-fireworks');
const btnSaveCert = document.getElementById('btn-save-cert');

const emailStatusCard = document.getElementById('email-status-card');
const emailStatusTitle = document.getElementById('email-status-title');
const emailStatusDesc = document.getElementById('email-status-desc');

// Timer digits
const timerDays = document.getElementById('timer-days');
const timerHours = document.getElementById('timer-hours');
const timerMins = document.getElementById('timer-mins');
const timerSecs = document.getElementById('timer-secs');

let storyIndex = 0;
let dodgeCount = 0;
let loveStartTime = null;
let timerInterval = null;

// Playful messages when she tries to click "No"
const dodgeMessages = [
  'Ơ kìa, đừng bấm vào đây mà 🥺',
  'Ngọc ơi, suy nghĩ lại một xíu đi mừ! 💕',
  'Nút này bị khoá rùi, chọn nút bên kia nha 🙈',
  'Anh hứa sẽ luôn yêu thương và chiều chuộng em mà!',
  'Không cho Ngọc từ chối đâu nà! 🏃💨',
  'Bé Ngọc bấm nhầm nút đúng hông? Bấm nút hồng kìa 🥰',
  'Dạ em đồng ý đi mà, năn nỉ đó nha ❤️'
];

/* ========================================================= */
/* 1. MUSIC CONTROLLER                                       */
/* ========================================================= */
musicBtn.addEventListener('click', () => {
  const isPlaying = audioEngine.toggleMusic();
  musicBtn.classList.toggle('playing', isPlaying);
});

/* ========================================================= */
/* 2. SCENE 1 -> SCENE 2: OPEN ENVELOPE                      */
/* ========================================================= */
envelopeCard.addEventListener('click', () => {
  audioEngine.playSparkleSound();
  audioEngine.startMusic();
  musicBtn.classList.add('playing');

  // GSAP Envelope opening animation
  gsap.to(envelopeCard, {
    scale: 1.15,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.in',
    onComplete: () => {
      sceneEnvelope.classList.remove('active');
      sceneJourney.classList.add('active');

      gsap.fromTo(
        '.journey-container',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  });
});

/* ========================================================= */
/* 3. SCENE 2: STORY CARDS PROGRESSION                       */
/* ========================================================= */
btnNextStory.addEventListener('click', () => {
  audioEngine.playSparkleSound();
  storyIndex++;

  if (storyIndex < storyCards.length) {
    // Switch to next card
    storyCards.forEach((card, idx) => {
      card.classList.toggle('active', idx === storyIndex);
    });
    storyDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === storyIndex);
    });

    if (storyIndex === storyCards.length - 1) {
      btnNextStory.querySelector('span').textContent = 'Điều anh muốn nói nhất 💖';
    }
  } else {
    // Transition to Scene 3: Proposal
    gsap.to(sceneJourney, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        sceneJourney.classList.remove('active');
        sceneProposal.classList.add('active');

        gsap.fromTo(
          '.proposal-container',
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.4)' }
        );
      }
    });
  }
});

/* ========================================================= */
/* 4. SCENE 3: PROPOSAL INTERACTION                          */
/* ========================================================= */

// Playful runaway function for "No" button
function dodgeNoButton(e) {
  if (e) e.preventDefault();
  audioEngine.playWhooshSound();
  dodgeCount++;

  const rect = btnNo.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width - 40;
  const maxY = window.innerHeight - rect.height - 40;

  const randomX = Math.max(20, Math.floor(Math.random() * maxX));
  const randomY = Math.max(60, Math.floor(Math.random() * maxY));

  // Change style to fixed to freely jump around screen
  btnNo.style.position = 'fixed';
  btnNo.style.left = `${randomX}px`;
  btnNo.style.top = `${randomY}px`;
  btnNo.style.zIndex = '9999';

  // Show cute tooltip message
  const msg = dodgeMessages[dodgeCount % dodgeMessages.length];
  dodgeBubble.textContent = msg;
  dodgeBubble.classList.add('show');

  // Grow the Yes button slightly to encourage clicking
  const yesScale = Math.min(1.35, 1 + dodgeCount * 0.05);
  btnYes.style.transform = `scale(${yesScale})`;

  // Reposition tooltip bubble right below runaway button
  dodgeBubble.style.position = 'fixed';
  dodgeBubble.style.left = `${Math.min(window.innerWidth - 180, Math.max(20, randomX - 30))}px`;
  dodgeBubble.style.top = `${randomY + 54}px`;
}

btnNo.addEventListener('mouseenter', dodgeNoButton);
btnNo.addEventListener('touchstart', dodgeNoButton, { passive: false });
btnNo.addEventListener('click', dodgeNoButton);

// "YES" BUTTON CLICKED!
btnYes.addEventListener('click', async () => {
  // Celebration sounds & 3D supernova
  audioEngine.playCelebrationSound();
  romanceScene.triggerSupernova();

  // Multi-stage fireworks & confetti bursts
  triggerFullCelebrationConfetti();

  // Transition to Celebration Scene
  gsap.to(sceneProposal, {
    opacity: 0,
    duration: 0.6,
    onComplete: () => {
      sceneProposal.classList.remove('active');
      btnNo.style.display = 'none';
      dodgeBubble.classList.remove('show');
      sceneCelebration.classList.add('active');

      // Start Love Timer
      loveStartTime = Date.now();
      startLoveTimer();
    }
  });

  // Dispatch Email Notification to both emails
  try {
    const result = await sendOfficialLoveEmail();
    if (result.success) {
      emailStatusCard.classList.add('success');
      emailStatusTitle.textContent = '✨ Thư chứng nhận tình yêu đã được kích hoạt!';
      emailStatusDesc.innerHTML = `
        Đã gửi thông báo chính thức tới <strong>${EMAIL_CONFIG.partnerEmail}</strong> và <strong>${EMAIL_CONFIG.myEmail}</strong>.
        <br><span style="color:#ffbed0; font-size:0.75rem;">Thời gian ghi nhận: ${result.timestamp}</span>
      `;
    }
  } catch (err) {
    console.error('Email trigger error:', err);
  }
});

/* ========================================================= */
/* 5. FIREWORKS & CONFETTI ENGINE                            */
/* ========================================================= */
function triggerFullCelebrationConfetti() {
  const duration = 6 * 1000;
  const animationEnd = Date.now() + duration;

  // Initial center blast with hearts & stars
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.6 },
    colors: ['#ff3366', '#ff758c', '#ffd1dc', '#ffeaa7', '#a855f7'],
    shapes: ['circle', 'square']
  });

  // Continuous side cannons
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#ff2d60', '#ff9472', '#ffeaa7']
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#ff2d60', '#ff758c', '#ffd1dc']
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

btnMoreFireworks.addEventListener('click', () => {
  audioEngine.playCelebrationSound();
  triggerFullCelebrationConfetti();
});

btnSaveCert.addEventListener('click', () => {
  alert('📸 Hãy chụp lại màn hình hoặc lưu link này để giữ làm kỷ niệm ngày hai ta chính thức yêu nhau nhé, Ngọc yêu! ❤️');
});

/* ========================================================= */
/* 6. LOVE STOPWATCH TIMER                                   */
/* ========================================================= */
function startLoveTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (!loveStartTime) return;
    const diff = Date.now() - loveStartTime;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    timerDays.textContent = String(days).padStart(2, '0');
    timerHours.textContent = String(hours).padStart(2, '0');
    timerMins.textContent = String(minutes).padStart(2, '0');
    timerSecs.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}
