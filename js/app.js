/**
 * Romantic Greeting Web App – Order Form & Payment Flow
 * Tiers: Free (preview), Standard 5,000₮, Premium 20,000₮
 * Language: Mongolian
 */

(function () {
  'use strict';

  const MAX_PHOTOS = 5;
  const CONFIRM_DELAY_MS = 2500;
  const BASE_URL = 'greeting.html';
  const API_URL = window.LOVEWEB_API_URL || 'http://localhost:3000';
  const STANDARD_PRICE = 5000;
  const PREMIUM_PRICE = 20000;
  const AI_PRICE = 30000;
  const STANDARD_MESSAGE_MAX = 200;
  const VIDEO_MIN_SEC = 30;
  const VIDEO_MAX_SEC = 90;

  const tierCards = document.getElementById('tierCards');
  const formScreen = document.getElementById('formScreen');
  const successScreen = document.getElementById('successScreen');
  const orderForm = document.getElementById('orderForm');
  const recipientNameInput = document.getElementById('recipientName');
  const messageInput = document.getElementById('message');
  const messageShortInput = document.getElementById('messageShort');
  const contactInput = document.getElementById('contact');
  const photoInput = document.getElementById('photoInput');
  const photoUpload = document.getElementById('photoUpload');
  const photoPreviews = document.getElementById('photoPreviews');
  const freePreviewGroup = document.getElementById('freePreviewGroup');
  const photoGroup = document.getElementById('photoGroup');
  const messageStandardGroup = document.getElementById('messageStandardGroup');
  const messagePremiumGroup = document.getElementById('messagePremiumGroup');
  const videoGroup = document.getElementById('videoGroup');
  const videoInput = document.getElementById('videoInput');
  const videoUpload = document.getElementById('videoUpload');
  const videoHint = document.getElementById('videoHint');
  const videoPreview = document.getElementById('videoPreview');
  const musicGroup = document.getElementById('musicGroup');
  const musicInput = document.getElementById('musicInput');
  const musicUpload = document.getElementById('musicUpload');
  const contactGroup = document.getElementById('contactGroup');
  const paymentBtnGroup = document.getElementById('paymentBtnGroup');
  const showPaymentBtn = document.getElementById('showPaymentBtn');
  const paymentSection = document.getElementById('paymentSection');
  const paymentCard = document.querySelector('.payment-card');
  const paymentAmountEl = document.getElementById('paymentAmount');
  const receiptInput = document.getElementById('receiptInput');
  const receiptUpload = document.getElementById('receiptUpload');
  const receiptPreviews = document.getElementById('receiptPreviews');
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const generatedUrlEl = document.getElementById('generatedUrl');
  const urlSlugEl = document.getElementById('urlSlug');
  const openWebBtn = document.getElementById('openWebBtn');
  const copyUrlBtn = document.getElementById('copyUrlBtn');
  const newWebBtn = document.getElementById('newWebBtn');
  const previewFreeBtn = document.getElementById('previewFreeBtn');
  const charCountStandard = document.getElementById('charCountStandard');

  let selectedTier = null;
  let photoFiles = [];
  let receiptFile = null;
  let videoFile = null;
  let musicFile = null;
  let voiceFile = null;
  let generatedSlug = '';

  function generateUniqueId() {
    return Math.random().toString(36).slice(2, 10);
  }

  function slugify(name) {
    return String(name)
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]/gu, '')
      .slice(0, 30) || 'recipient';
  }

  function getBaseOrigin() {
    const path = window.location.pathname.replace(/index\.html?$/i, '');
    return window.location.origin + path;
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function updateFormVisibility() {
    const freeOnly = document.querySelectorAll('.form-group-free-only');
    const paid = document.querySelectorAll('.form-group-paid');
    const byTier = document.querySelectorAll('[data-visible-tier]');

    freeOnly.forEach(el => { el.style.display = selectedTier === 'free' ? 'block' : 'none'; });
    paid.forEach(el => { el.style.display = (selectedTier === 'standard' || selectedTier === 'premium' || selectedTier === 'ai') ? 'block' : 'none'; });

    byTier.forEach(el => {
      const tiers = (el.getAttribute('data-visible-tier') || '').split(' ');
      el.style.display = tiers.includes(selectedTier) ? 'block' : 'none';
    });

    if (paymentAmountEl) {
      if (selectedTier === 'ai') paymentAmountEl.textContent = AI_PRICE.toLocaleString() + '₮';
      else if (selectedTier === 'premium') paymentAmountEl.textContent = PREMIUM_PRICE.toLocaleString() + '₮';
      else paymentAmountEl.textContent = STANDARD_PRICE.toLocaleString() + '₮';
    }
    if (contactInput) {
      contactInput.required = (selectedTier === 'standard' || selectedTier === 'premium' || selectedTier === 'ai');
    }

    if (paymentCard) paymentCard.classList.remove('visible');
    paymentSection.classList.remove('visible');
    receiptFile = null;
    renderReceiptPreview();
    confirmPaymentBtn.disabled = true;
  }

  function validateForm() {
    const name = recipientNameInput.value.trim();
    if (!name) {
      recipientNameInput.focus();
      return false;
    }
    if (selectedTier === 'standard' || selectedTier === 'premium' || selectedTier === 'ai') {
      const contact = contactInput.value.trim();
      if (!contact) {
        contactInput.focus();
        return false;
      }
      if (selectedTier === 'standard') {
        const useCustom = document.querySelector('input[name="messageType"]:checked')?.value === 'custom';
        if (useCustom && !messageShortInput.value.trim()) {
          messageShortInput.focus();
          return false;
        }
      }
    }
    return true;
  }

  // Tier selection
  if (tierCards) {
    tierCards.querySelectorAll('.tier-card').forEach(card => {
      card.addEventListener('click', function () {
        selectedTier = this.getAttribute('data-tier');
        tierCards.querySelectorAll('.tier-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
        updateFormVisibility();
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // Free preview
  if (previewFreeBtn) {
    previewFreeBtn.addEventListener('click', function () {
      const name = recipientNameInput.value.trim();
      if (!name) {
        recipientNameInput.focus();
        return;
      }
      const url = BASE_URL + '?tier=free&name=' + encodeURIComponent(name);
      window.open(url, '_blank');
    });
  }

  // Standard: message type toggle
  const messageTypeRadios = document.querySelectorAll('input[name="messageType"]');
  if (messageTypeRadios.length) {
    messageTypeRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        const isCustom = this.value === 'custom';
        if (messageShortInput) messageShortInput.style.display = isCustom ? 'block' : 'none';
        if (charCountStandard) charCountStandard.style.display = isCustom ? 'inline' : 'none';
      });
    });
  }
  if (messageShortInput && charCountStandard) {
    messageShortInput.addEventListener('input', function () {
      charCountStandard.textContent = this.value.length + ' / ' + STANDARD_MESSAGE_MAX;
    });
  }

  // Photo upload
  if (photoUpload) photoUpload.addEventListener('click', () => photoInput && photoInput.click());
  if (photoUpload) photoUpload.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); photoInput && photoInput.click(); } });
  if (photoInput) {
    photoInput.addEventListener('change', function () {
      const files = Array.from(this.files || []);
      const remaining = MAX_PHOTOS - photoFiles.length;
      const toAdd = files.slice(0, remaining);
      photoFiles = photoFiles.concat(toAdd).slice(0, MAX_PHOTOS);
      renderPhotoPreviews();
      this.value = '';
    });
  }

  function renderPhotoPreviews() {
    if (!photoPreviews) return;
    photoPreviews.innerHTML = '';
    photoFiles.forEach((file, index) => {
      const src = URL.createObjectURL(file);
      const div = document.createElement('div');
      div.className = 'preview-item';
      div.innerHTML = '<img src="' + src + '" alt="Preview ' + (index + 1) + '"><button type="button" class="remove-preview" aria-label="Устгах">×</button>';
      div.querySelector('.remove-preview').addEventListener('click', () => {
        photoFiles.splice(index, 1);
        URL.revokeObjectURL(src);
        renderPhotoPreviews();
      });
      photoPreviews.appendChild(div);
    });
  }

  // Video upload (Premium): check duration 30–90 sec (client-side approximate via file size or video element)
  if (videoUpload) videoUpload.addEventListener('click', () => videoInput && videoInput.click());
  if (videoInput) {
    videoInput.addEventListener('change', function () {
      const file = this.files && this.files[0];
      videoFile = file || null;
      videoPreview.innerHTML = '';
      if (!videoHint) return;
      if (!file) {
        videoHint.textContent = '';
        return;
      }
      if (!file.type.startsWith('video/')) {
        videoHint.textContent = 'Зөвхөн MP4 видео оруулна уу.';
        videoHint.style.color = 'var(--rose-500)';
        return;
      }
      videoHint.textContent = 'Видео: ' + file.name + ' (уртыг нээхэд шалгана)';
      videoHint.style.color = '';
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = function () {
        const sec = Math.floor(video.duration);
        if (sec < VIDEO_MIN_SEC || sec > VIDEO_MAX_SEC) {
          videoHint.textContent = 'Видео 30–90 секунд байх ёстой. Одоогоор: ' + sec + ' сек.';
          videoHint.style.color = 'var(--rose-500)';
          videoFile = null;
        } else {
          videoHint.textContent = 'Видео: ' + sec + ' секунд ✓';
          videoHint.style.color = 'green';
        }
      };
      video.onerror = function () {
        videoHint.textContent = 'Видео унших боломжгүй.';
        videoHint.style.color = 'var(--rose-500)';
      };
      video.src = URL.createObjectURL(file);
      const thumb = document.createElement('div');
      thumb.className = 'preview-item';
      thumb.innerHTML = '<span>🎬 ' + file.name + '</span>';
      videoPreview.appendChild(thumb);
      this.value = '';
    });
  }

  // Music upload (Premium)
  if (musicUpload) musicUpload.addEventListener('click', () => musicInput && musicInput.click());
  if (musicInput) {
    musicInput.addEventListener('change', function () {
      musicFile = this.files && this.files[0] || null;
      this.value = '';
    });
  }

  // Voice upload (Premium/AI)
  const voiceUpload = document.getElementById('voiceUpload');
  const voiceInput = document.getElementById('voiceInput');
  if (voiceUpload) voiceUpload.addEventListener('click', () => voiceInput && voiceInput.click());
  if (voiceInput) {
    voiceInput.addEventListener('change', function () {
      voiceFile = this.files && this.files[0] || null;
      this.value = '';
    });
  }

  // Receipt upload
  if (receiptUpload) receiptUpload.addEventListener('click', () => receiptInput && receiptInput.click());
  if (receiptUpload) receiptUpload.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); receiptInput && receiptInput.click(); } });
  if (receiptInput) {
    receiptInput.addEventListener('change', function () {
      receiptFile = this.files && this.files[0] || null;
      renderReceiptPreview();
      confirmPaymentBtn.disabled = !receiptFile;
      this.value = '';
    });
  }

  function renderReceiptPreview() {
    if (!receiptPreviews) return;
    receiptPreviews.innerHTML = '';
    if (!receiptFile) return;
    const src = URL.createObjectURL(receiptFile);
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = '<img src="' + src + '" alt="Төлбөрийн баримт"><button type="button" class="remove-preview" aria-label="Устгах">×</button>';
    div.querySelector('.remove-preview').addEventListener('click', () => {
      receiptFile = null;
      URL.revokeObjectURL(src);
      renderReceiptPreview();
      confirmPaymentBtn.disabled = true;
    });
    receiptPreviews.appendChild(div);
  }

  function scrollToPayment() {
    if (paymentCard) paymentCard.classList.add('visible');
    paymentSection.classList.add('visible');
    const card = paymentSection.closest('.card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showPaymentBtn.addEventListener('click', function () {
    if (!validateForm()) return;
    scrollToPayment();
  });

  function getMessageForUrl() {
    if (selectedTier === 'standard') {
      const useCustom = document.querySelector('input[name="messageType"]:checked')?.value === 'custom';
      if (useCustom) return messageShortInput ? messageShortInput.value.trim() : '';
      return '';
    }
    if (selectedTier === 'premium') return messageInput ? messageInput.value.trim() : '';
    if (selectedTier === 'ai') return document.getElementById('aiMessage') ? document.getElementById('aiMessage').value.trim() : '';
    return '';
  }

  function getAiOptions() {
    const mood = document.querySelector('input[name="aiMood"]:checked')?.value || 'romantic';
    const tone = document.querySelector('input[name="aiTone"]:checked')?.value || 'romantic';
    const keywords = document.getElementById('aiKeywords')?.value.trim() || '';
    return { mood, tone, keywords };
  }

  function buildGreetingUrl(name, id, message, tier) {
    const params = new URLSearchParams();
    params.set('name', name);
    params.set('tier', tier || selectedTier || 'standard');
    if (id) params.set('id', id);
    const msg = message || getMessageForUrl();
    if (msg && msg.length < 800) params.set('message', msg);
    if (selectedTier === 'ai') {
      const ai = getAiOptions();
      params.set('mood', ai.mood);
      params.set('tone', ai.tone);
      if (ai.keywords) params.set('keywords', ai.keywords);
    }
    return BASE_URL + '?' + params.toString();
  }

  confirmPaymentBtn.addEventListener('click', async function () {
    if (!receiptFile || !selectedTier || selectedTier === 'free') return;
    loadingOverlay.classList.add('visible');
    const name = recipientNameInput.value.trim();
    const id = generateUniqueId();
    const message = getMessageForUrl();
    generatedSlug = slugify(name) + '-' + id;
    const url = buildGreetingUrl(name, id, message, selectedTier);

    const senderName = document.getElementById('senderName')?.value.trim();
    const tc = document.querySelector('input[name="timeCapsule"]:checked')?.value;
    let photos = [], voice = '', video = '', music = '';
    const ai = selectedTier === 'ai' ? getAiOptions() : {};
    const aiStory = selectedTier === 'ai' ? {
      met: document.getElementById('aiStoryMet')?.value.trim(),
      love: document.getElementById('aiStoryLove')?.value.trim(),
      future: document.getElementById('aiStoryFuture')?.value.trim()
    } : {};

    try {
      if ((selectedTier === 'premium' || selectedTier === 'standard') && photoFiles.length) {
        photos = await Promise.all(photoFiles.slice(0, 5).map(f => fileToDataUrl(f)));
      }
      if ((selectedTier === 'premium' || selectedTier === 'ai') && voiceFile) {
        voice = await fileToDataUrl(voiceFile);
      }
      if (selectedTier === 'premium') {
        if (videoFile && videoFile.size < 5 * 1024 * 1024) video = await fileToDataUrl(videoFile);
        if (musicFile && musicFile.size < 3 * 1024 * 1024) music = await fileToDataUrl(musicFile);
      }

      sessionStorage.setItem('greeting_message_' + id, message || '');
      sessionStorage.setItem('greeting_name_' + id, name);
      if (senderName) sessionStorage.setItem('greeting_sender_' + id, senderName);
      if (photos.length) sessionStorage.setItem('greeting_photos_' + id, JSON.stringify(photos));
      if (voice) sessionStorage.setItem('greeting_voice_' + id, voice);
      if (video) sessionStorage.setItem('greeting_video_' + id, video);
      if (music) sessionStorage.setItem('greeting_music_' + id, music);
      if (tc === '6months') sessionStorage.setItem('greeting_timecapsule_' + id, '6months');
      if (selectedTier === 'ai') {
        sessionStorage.setItem('greeting_ai_mood_' + id, ai.mood || '');
        sessionStorage.setItem('greeting_ai_tone_' + id, ai.tone || '');
        if (ai.keywords) sessionStorage.setItem('greeting_ai_keywords_' + id, ai.keywords);
        if (aiStory.met || aiStory.love || aiStory.future) sessionStorage.setItem('greeting_ai_story_' + id, JSON.stringify(aiStory));
      }

      try {
        await fetch(API_URL + '/api/greeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id, name, message, tier: selectedTier, senderName,
            photos, voice, video, music, timeCapsule: tc === '6months' ? '6months' : '',
            aiStory, aiMood: ai.mood, aiTone: ai.tone, aiKeywords: ai.keywords
          })
        });
      } catch (apiErr) {
        console.warn('Backend save failed (using sessionStorage):', apiErr);
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }

    setTimeout(() => {
      loadingOverlay.classList.remove('visible');
      urlSlugEl.textContent = generatedSlug;
      generatedUrlEl.textContent = getBaseOrigin() + url;
      openWebBtn.href = url;
      formScreen.classList.add('hidden');
      successScreen.classList.add('visible');
    }, CONFIRM_DELAY_MS);
  });

  openWebBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const url = this.getAttribute('href');
    if (url && url !== '#') window.location.href = url;
  });

  copyUrlBtn.addEventListener('click', function () {
    const url = generatedUrlEl.textContent || (getBaseOrigin() + BASE_URL);
    navigator.clipboard.writeText(url).then(() => {
      const t = this.textContent;
      this.textContent = 'Хуулсан!';
      setTimeout(() => { this.textContent = t; }, 2000);
    });
  });

  newWebBtn.addEventListener('click', function () {
    formScreen.classList.remove('hidden');
    successScreen.classList.remove('visible');
    orderForm.reset();
    if (paymentCard) paymentCard.classList.remove('visible');
    paymentSection.classList.remove('visible');
    photoFiles = [];
    receiptFile = null;
    videoFile = null;
    musicFile = null;
    voiceFile = null;
    renderPhotoPreviews();
    renderReceiptPreview();
    if (videoPreview) videoPreview.innerHTML = '';
    if (videoHint) videoHint.textContent = '';
    if (charCountStandard) charCountStandard.textContent = '0 / ' + STANDARD_MESSAGE_MAX;
    confirmPaymentBtn.disabled = true;
    generatedSlug = '';
  });
})();
