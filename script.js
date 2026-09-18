/* ==========================================================================
   TOJI FUSHIGURO - MANGA INTERACTIVE SCRIPT WITH LIGHTBOX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  highlightActiveNav();
  initSoundEffects();
  initContractCalculator();
  initGalleryModal();
});

function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

function initSoundEffects() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
  }

  window.playSlashSound = function() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio error');
    }
  };

  document.querySelectorAll('.btn-manga, .gallery-card').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (typeof window.playSlashSound === 'function') window.playSlashSound();
    });
  });
}

function initContractCalculator() {
  const targetSelect = document.getElementById('target-type');
  const domainCheck = document.getElementById('has-domain');
  const guardCheck = document.getElementById('has-guards');
  const urgentCheck = document.getElementById('is-urgent');
  const priceDisplay = document.getElementById('total-price');

  if (!targetSelect || !priceDisplay) return;

  function calculatePrice() {
    let basePrice = parseInt(targetSelect.value) || 0;

    if (domainCheck && domainCheck.checked) basePrice += 150000000;
    if (guardCheck && guardCheck.checked) basePrice += 50000000;
    if (urgentCheck && urgentCheck.checked) basePrice *= 1.5;

    const formattedYen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(basePrice);
    const rubEquivalent = (basePrice * 0.62).toLocaleString('ru-RU');

    priceDisplay.innerHTML = `${formattedYen} <br><span style="font-size: 1.2rem; color: #aaa;">(~${rubEquivalent} ₽)</span>`;
  }

  [targetSelect, domainCheck, guardCheck, urgentCheck].forEach(elem => {
    if (elem) elem.addEventListener('change', calculatePrice);
  });

  calculatePrice();
}

// Модальное окно просмотра кадра в галерее
function initGalleryModal() {
  const galleryItems = document.querySelectorAll('.gallery-card');
  if (!galleryItems.length) return;

  const modal = document.createElement('div');
  modal.id = 'gallery-modal';
  modal.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.92); display: none; justify-content: center;
    align-items: center; z-index: 9999; cursor: pointer; padding: 20px;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: #f4f0ea; border: 5px solid #e60012; padding: 20px;
    max-width: 800px; width: 100%; color: #000; text-align: center;
    box-shadow: 0 0 35px rgba(230,0,18,0.6); position: relative;
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img')?.src || '';
      const title = item.querySelector('h3')?.innerText || 'Кадр Манги';
      const desc = item.querySelector('p')?.innerText || '';
      const sfx = item.querySelector('.sfx-badge')?.innerText || 'ズズズ';

      modalContent.innerHTML = `
        <div style="position: absolute; top: 10px; right: 20px; font-family: 'Noto Sans JP'; font-size: 2.5rem; color: #e60012;">${sfx}</div>
        <img src="${imgSrc}" style="width: 100%; max-height: 500px; object-fit: contain; border: 3px solid #000; margin-bottom: 15px; background: #000;">
        <h2 style="font-family: 'Bebas Neue'; font-size: 2.5rem; line-height: 1;">${title}</h2>
        <p style="font-weight: 700; font-size: 1.1rem; margin-top: 10px;">${desc}</p>
        <p style="margin-top: 15px; font-size: 0.85rem; color: #666; text-transform: uppercase;">[ Кликните в любом месте для закрытия ]</p>
      `;

      modal.style.display = 'flex';
      if (window.playSlashSound) window.playSlashSound();
    });
  });

  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}