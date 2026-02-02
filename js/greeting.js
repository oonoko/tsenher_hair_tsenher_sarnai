/**
 * Romantic Greeting Page – Personalized love message
 * Features: Emotional Reveal, Hidden Love Note, Mood Switch, Voice, Handwritten animation,
 * AI Love Story, Time Capsule, Ending Scene
 */

(function () {
  'use strict';

  const recipientNameEl = document.getElementById('recipientName');
  const messageTextEl = document.getElementById('messageText');
  const greetingTitleEl = document.getElementById('greetingTitle');
  const greetingPhotosEl = document.getElementById('greetingPhotos');
  const photosGridEl = document.getElementById('photosGrid');
  const greetingVideoEl = document.getElementById('greetingVideo');
  const greetingVideoSource = document.getElementById('greetingVideoSource');
  const greetingVoiceEl = document.getElementById('greetingVoice');
  const greetingVoiceSource = document.getElementById('greetingVoiceSource');
  const greetingVoicePlayer = document.getElementById('greetingVoicePlayer');
  const voicePlayBtn = document.getElementById('voicePlayBtn');
  const greetingMusicEl = document.getElementById('greetingMusic');
  const greetingAudioSource = document.getElementById('greetingAudioSource');
  const greetingAudioPlayer = document.getElementById('greetingAudioPlayer');
  const muteToggle = document.getElementById('muteToggle');
  const greetingPaymentBox = document.getElementById('greetingPaymentBox');
  const heartsBg = document.getElementById('heartsBg');
  const aiDisclaimer = document.getElementById('aiDisclaimer');
  const greetingAiVisuals = document.getElementById('greetingAiVisuals');
  const greetingMain = document.getElementById('greetingMain');
  const revealOverlay = document.getElementById('revealOverlay');
  const revealText = document.getElementById('revealText');
  const openGiftBtn = document.getElementById('openGiftBtn');
  const heartBurst = document.getElementById('heartBurst');
  const moodSwitch = document.getElementById('moodSwitch');
  const hiddenLoveNote = document.getElementById('hiddenLoveNote');
  const easterModal = document.getElementById('easterModal');
  const closeEasterBtn = document.getElementById('closeEasterBtn');
  const typewriterCursor = document.getElementById('typewriterCursor');
  const greetingAiStory = document.getElementById('greetingAiStory');
  const aiStoryText = document.getElementById('aiStoryText');
  const greetingTimecapsule = document.getElementById('greetingTimecapsule');
  const timecapsuleDate = document.getElementById('timecapsuleDate');
  const endingSignature = document.getElementById('endingSignature');

  const defaultMessage = 'Чамайг харах бүрт миний ертөнц илүү гэрэлтдэг. Энэ бяцхан вебийг тусгайлан чамдаа зориуланхийлгэлээ. Хайртай шүү ❤';
  const freeTitle = 'Зүрхнээс ирсэн бэлэг';
  const freeMessage = 'Чамайг харах бүрт миний ертөнц илүү гэрэлтдэг. Энэ бяцхан мэндчилгээг чамдаа зориуллаа. Хайртай шүү ❤';
  const revealTextTemplate = '{{recipientName}}, чамд бяцхан нууц хүлээж байна…';
  const API_URL = window.LOVEWEB_API_URL || 'http://localhost:3000';

  let backendData = null;

  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function getTier() {
    return getQueryParam('tier') || 'standard';
  }

  function getRecipientName() {
    if (backendData?.name) return backendData.name;
    let name = getQueryParam('name');
    if (name) return decodeURIComponent(name);
    const id = getQueryParam('id');
    if (id) {
      try { name = sessionStorage.getItem('greeting_name_' + id); } catch (e) {}
      if (name) return name;
    }
    return 'Хайртай хүн';
  }

  const STORAGE_KEYS = { timeCapsule: 'timecapsule', senderName: 'sender', aiStory: 'ai_story' };
  function getStored(key) {
    if (backendData && key in backendData) return backendData[key];
    const id = getQueryParam('id');
    if (!id) return null;
    const sk = STORAGE_KEYS[key] || key.replace(/([A-Z])/g, (m) => '_' + m.toLowerCase()).replace(/^_/, '');
    try {
      const raw = sessionStorage.getItem('greeting_' + sk + '_' + id);
      if (!raw) return null;
      if (key === 'photos') return JSON.parse(raw);
      if (key === 'aiStory') return JSON.parse(raw);
      return raw;
    } catch (e) { return null; }
  }

  async function fetchBackendData() {
    const id = getQueryParam('id');
    if (!id || getTier() === 'free') return;
    try {
      const res = await fetch(API_URL + '/api/greeting/' + id);
      if (res.ok) backendData = await res.json();
    } catch (e) {}
  }

  function isPaidTier() {
    const t = getTier();
    return t === 'standard' || t === 'premium' || t === 'ai';
  }

  function hasReveal() {
    return getTier() === 'premium' || getTier() === 'ai';
  }

  function initTitle() {
    const tier = getTier();
    if (tier === 'free' && greetingTitleEl) greetingTitleEl.textContent = freeTitle;
    else if (greetingTitleEl) greetingTitleEl.textContent = 'Сэтгэлийн илгээмж';
  }

  function initRecipient() {
    const name = getRecipientName();
    if (recipientNameEl) recipientNameEl.textContent = name;
  }

  function initMessage() {
    const tier = getTier();
    if (tier === 'free') {
      if (messageTextEl) messageTextEl.textContent = freeMessage;
      return;
    }
    let message = getQueryParam('message');
    if (message) message = decodeURIComponent(message);
    if (!message) message = getStored('message');
    if (message && messageTextEl) messageTextEl.textContent = message;
  }

  function initEmotionalReveal() {
    if (!hasReveal() || !revealOverlay || !openGiftBtn) return;
    const name = getRecipientName();
    if (revealText) revealText.textContent = revealTextTemplate.replace('{{recipientName}}', name);
    revealOverlay.style.display = 'flex';
    if (greetingMain) greetingMain.style.opacity = '0';
    if (greetingMain) greetingMain.style.pointerEvents = 'none';

    openGiftBtn.addEventListener('click', function () {
      if (heartBurst) {
        heartBurst.style.display = 'block';
        heartBurst.innerHTML = '';
        ['❤', '💕', '💗'].forEach((h, i) => {
          const span = document.createElement('span');
          span.textContent = h;
          span.className = 'burst-heart';
          span.style.cssText = 'position:absolute;top:50%;left:50%;font-size:48px;animation:burstHeart 0.6s ease-out forwards;animation-delay:' + (i * 0.08) + 's;';
          heartBurst.appendChild(span);
        });
        heartBurst.classList.add('burst');
      }
      if (greetingAudioPlayer) {
        greetingAudioPlayer.muted = false;
        greetingAudioPlayer.play().catch(() => {});
      }
      setTimeout(() => {
        if (revealOverlay) revealOverlay.style.opacity = '0';
        if (revealOverlay) revealOverlay.style.pointerEvents = 'none';
        setTimeout(() => {
          if (revealOverlay) revealOverlay.style.display = 'none';
          if (greetingMain) {
            greetingMain.style.opacity = '1';
            greetingMain.style.pointerEvents = 'auto';
            greetingMain.style.transition = 'opacity 0.8s ease';
          }
          fadeInElements();
          setTimeout(initHandwrittenAnimation, 500);
        }, 500);
      }, 600);
    });
  }

  function initHiddenLoveNote() {
    if (!hasReveal() || !hiddenLoveNote || !easterModal || !closeEasterBtn) return;
    hiddenLoveNote.style.display = 'block';
    hiddenLoveNote.style.left = (10 + Math.random() * 80) + '%';
    hiddenLoveNote.style.top = (15 + Math.random() * 70) + '%';

    hiddenLoveNote.addEventListener('click', function () {
      easterModal.classList.add('visible');
      document.body.style.overflow = 'hidden';
    });
    closeEasterBtn.addEventListener('click', function () {
      easterModal.classList.remove('visible');
      document.body.style.overflow = '';
    });
    easterModal.addEventListener('click', function (e) {
      if (e.target === easterModal) {
        easterModal.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  }

  function initMoodSwitch() {
    if (!hasReveal() || !moodSwitch) return;
    moodSwitch.style.display = 'flex';
    const saved = sessionStorage.getItem('greeting_mood');
    if (saved === 'night') document.body.classList.add('night-mode');
    else document.body.classList.remove('night-mode');

    moodSwitch.addEventListener('click', function () {
      document.body.classList.toggle('night-mode');
      sessionStorage.setItem('greeting_mood', document.body.classList.contains('night-mode') ? 'night' : 'day');
    });
  }

  function initVoiceMessage() {
    const tier = getTier();
    if ((tier !== 'premium' && tier !== 'ai') || !greetingVoiceEl || !greetingVoiceSource) return;
    const src = getStored('voice');
    if (src) {
      greetingVoiceSource.src = src;
      greetingVoiceEl.style.display = 'block';
      if (voicePlayBtn && greetingVoicePlayer) {
        voicePlayBtn.addEventListener('click', function () {
          if (greetingVoicePlayer.paused) {
            greetingVoicePlayer.play();
            voicePlayBtn.textContent = '⏸ Зогсоох';
          } else {
            greetingVoicePlayer.pause();
            voicePlayBtn.textContent = '▶ Тоглуулах';
          }
        });
        greetingVoicePlayer.addEventListener('ended', () => { voicePlayBtn.textContent = '▶ Тоглуулах'; });
      }
    }
  }

  function initHandwrittenAnimation() {
    const tier = getTier();
    if (tier === 'free') return;
    if (!messageTextEl || !typewriterCursor) return;
    const fullText = messageTextEl.textContent;
    if (!fullText || fullText.length > 500) return;

    messageTextEl.textContent = '';
    typewriterCursor.style.display = 'inline';
    let i = 0;
    const speed = 50;

    function type() {
      if (i < fullText.length) {
        messageTextEl.textContent += fullText.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        typewriterCursor.style.display = 'none';
      }
    }
    setTimeout(type, 800);
  }

  function initAiLoveStory() {
    const tier = getTier();
    if (tier !== 'ai' || !greetingAiStory || !aiStoryText) return;
    const raw = getStored('aiStory');
    if (raw && (raw.met || raw.love || raw.future)) {
      const { met, love, future } = raw;
      const name = getRecipientName();
      const story = `Бид анх ${met || 'тэр өдөр'} уулзсан. ${love || 'Чи миний амьдралыг гэрэлтүүлдэг.'} Ирээдүйд ${future || 'хамтдаа аз жаргалтай амьдрахыг хүсч байна.'} Энэ бол бидний түүх — ${name}, чамтай хамт байх нь миний хамгийн том аз.`;
      aiStoryText.textContent = story;
      greetingAiStory.style.display = 'block';
    }
  }

  function initTimeCapsule() {
    const tier = getTier();
    if ((tier !== 'premium' && tier !== 'ai') || !greetingTimecapsule) return;
    const tc = getStored('timeCapsule');
    if (tc === '6months') {
      const d = new Date();
      d.setMonth(d.getMonth() + 6);
      if (timecapsuleDate) timecapsuleDate.textContent = d.toLocaleDateString('mn-MN');
      greetingTimecapsule.style.display = 'block';
    }
  }

  function initEndingScene() {
    if (!isPaidTier() || !endingSignature) return;
    const sender = getStored('senderName');
    endingSignature.textContent = sender ? 'Хайртайгаар, ' + sender : 'Хайртайгаар,';
  }

  function initAiDisclaimer() {
    if (getTier() === 'ai' && aiDisclaimer) aiDisclaimer.style.display = 'block';
  }

  function initAiVisuals() {
    if (getTier() === 'ai' && greetingAiVisuals) greetingAiVisuals.style.display = 'block';
    if (getTier() === 'ai' && greetingPhotosEl) greetingPhotosEl.style.display = 'none';
  }

  function initPhotos() {
    const tier = getTier();
    if (tier === 'free' && greetingPhotosEl) { greetingPhotosEl.style.display = 'none'; return; }
    if (tier === 'ai') return;
    if (!photosGridEl) return;
    const urls = getStored('photos');
    if (urls && Array.isArray(urls) && urls.length) {
      photosGridEl.innerHTML = '';
      urls.forEach(src => {
        const div = document.createElement('div');
        div.className = 'photo-frame';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Дурсамж';
        div.appendChild(img);
        photosGridEl.appendChild(div);
      });
    }
  }

  function initVideo() {
    const tier = getTier();
    if (tier === 'ai' && greetingVideoEl) greetingVideoEl.style.display = 'none';
    if (tier !== 'premium' || !greetingVideoEl || !greetingVideoSource) return;
    const src = getStored('video');
    if (src) {
      greetingVideoSource.src = src;
      greetingVideoEl.style.display = 'block';
      document.getElementById('greetingVideoPlayer')?.load();
    }
  }

  function initMusic() {
    const tier = getTier();
    if (tier === 'ai' && greetingMusicEl) greetingMusicEl.style.display = 'none';
    if (tier !== 'premium' || !greetingMusicEl || !greetingAudioSource) return;
    const src = getStored('music');
    if (src) {
      greetingAudioSource.src = src;
      greetingMusicEl.style.display = 'block';
      greetingAudioPlayer?.load();
      if (muteToggle) muteToggle.textContent = '🔊 Дуу асах';
    }
  }

  function initPaymentBox() {
    if (getTier() === 'free' && greetingPaymentBox) greetingPaymentBox.style.display = 'none';
  }

  function setupMuteToggle() {
    if (!muteToggle || !greetingAudioPlayer) return;
    muteToggle.addEventListener('click', function () {
      greetingAudioPlayer.muted = !greetingAudioPlayer.muted;
      muteToggle.textContent = greetingAudioPlayer.muted ? '🔊 Дуу асах' : '🔇 Дуу унтраах';
    });
  }

  function createFloatingHearts() {
    const tier = getTier();
    const count = (tier === 'premium' || tier === 'ai') ? 12 : tier === 'free' ? 5 : 8;
    const hearts = ['❤', '💕', '💗'];
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'heart-float' + (tier === 'premium' || tier === 'ai' ? ' heart-glow' : '');
      span.textContent = hearts[i % hearts.length];
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDelay = Math.random() * 5 + 's';
      span.style.animationDuration = (6 + Math.random() * 4) + 's';
      heartsBg.appendChild(span);
    }
  }

  function fadeInElements() {
    const selectors = '.ai-disclaimer, .greeting-recipient h2, .greeting-message-box, .greeting-ai-story, .greeting-ai-visuals, .greeting-photos, .greeting-video, .greeting-voice, .greeting-music, .greeting-timecapsule, .greeting-payment-box, .greeting-buttons, .greeting-ending';
    document.querySelectorAll(selectors).forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(15px)';
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, 80 * (i + 1));
      });
    });
  }

  async function run() {
    await fetchBackendData();
    initTitle();
    initRecipient();
    initMessage();
    initEmotionalReveal();
    initHiddenLoveNote();
    initMoodSwitch();
    initVoiceMessage();
    initAiLoveStory();
    initTimeCapsule();
    initEndingScene();
    initAiDisclaimer();
    initAiVisuals();
    initPhotos();
    initVideo();
    initMusic();
    initPaymentBox();
    setupMuteToggle();
    createFloatingHearts();
    if (!hasReveal()) {
      fadeInElements();
      setTimeout(initHandwrittenAnimation, 800);
    }
  }
  run();
})();
