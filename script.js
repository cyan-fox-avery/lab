const screens = [...document.querySelectorAll('.screen')];
const memoryScreens = [...document.querySelectorAll('.memory-screen')];
const progressPill = document.getElementById('progress-pill');
const openBoxButton = document.getElementById('open-box');
const drawer = document.getElementById('memory-drawer');
const drawerButton = document.getElementById('drawer-button');
const drawerCloseTargets = [...document.querySelectorAll('[data-close-drawer]')];
const jumpLinks = [...document.querySelectorAll('[data-jump]')];
const finaleButton = document.querySelector('[data-finale-button]');
const drawerLinks = [...document.querySelectorAll('.drawer-link[data-jump]')];
const progressStorageKey = 'fiona-27-unlocked-v1';
const firstNoteHint = document.getElementById('first-note-hint');

const music = document.getElementById('background-music');
const musicToggle = document.getElementById('music-toggle');
const musicTargetVolume = 0.10;
let musicOn = false;
let audioContext = null;
let gainNode = null;
let mediaSource = null;
let fallbackFadeTimer = null;

let highestUnlocked = (() => {
  try {
    const saved = Number.parseInt(localStorage.getItem(progressStorageKey) || '0', 10);
    return Number.isFinite(saved) ? Math.max(0, Math.min(27, saved)) : 0;
  } catch {
    return 0;
  }
})();

function updateFirstNoteHint(screen = document.querySelector('.memory-screen.active')) {
  if (!firstNoteHint) return;
  const shouldShow = screen?.id === 'memory-01' && !screen.classList.contains('note-open');
  firstNoteHint.hidden = !shouldShow;
}

function updateDrawerLocks() {
  drawerLinks.forEach((link) => {
    const match = link.dataset.jump?.match(/memory-(\d{2})/);
    if (!match) return;
    const number = Number.parseInt(match[1], 10);
    const locked = number > highestUnlocked;
    link.classList.toggle('is-locked', locked);
    link.setAttribute('aria-disabled', String(locked));
    if (locked) link.setAttribute('tabindex', '-1');
    else link.removeAttribute('tabindex');
  });
}

function unlockMemory(number) {
  if (!Number.isFinite(number) || number < 1 || number > 27 || number <= highestUnlocked) return;
  highestUnlocked = number;
  try { localStorage.setItem(progressStorageKey, String(highestUnlocked)); } catch {}
  updateDrawerLocks();
}

function sizeNote(screen) {
  const note = screen?.querySelector('.tucked-note');
  if (!note) return;
  note.style.setProperty('--note-open-height', `${note.scrollHeight + 24}px`);
}

function resetNameRoll(screen) {
  const roll = screen?.querySelector('[data-name-roll]');
  if (!roll) return;
  const current = roll.querySelector('.name-roll-current');
  (roll._timers || []).forEach(clearTimeout);
  roll._timers = [];
  roll.dataset.played = 'false';
  if (current) {
    current.textContent = '';
    current.classList.remove('is-visible', 'is-switching');
  }
}

function resetMemory(screen) {
  if (!screen) return;
  screen.classList.remove('note-open');
  screen.querySelectorAll('[data-toggle-note]').forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
  const note = screen.querySelector('.tucked-note');
  if (note) note.setAttribute('aria-hidden', 'true');
  screen.querySelector('[data-wish-candle]')?.classList.remove('blown');
  resetNameRoll(screen);
  updateFirstNoteHint(screen);
}

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) return;

  screens.forEach((screen) => {
    screen.classList.remove('active');
    if (screen.classList.contains('memory-screen')) resetMemory(screen);
  });

  document.body.classList.toggle('cover-mode', id === 'cover');
  document.body.classList.toggle('epilogue-mode', id === 'epilogue');
  target.classList.add('active');

  if (target.dataset.memory && target.dataset.memory !== '00') {
    unlockMemory(Number.parseInt(target.dataset.memory, 10));
    progressPill.textContent = `${target.dataset.memory} / 27`;
    requestAnimationFrame(() => sizeNote(target));
  } else if (id === 'epilogue') {
    progressPill.textContent = '27 / 27';
  } else {
    progressPill.textContent = '01 / 27';
  }

  updateFirstNoteHint(target);
  closeDrawer();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleNote(screen) {
  if (!screen) return;
  sizeNote(screen);
  const isOpen = screen.classList.toggle('note-open');
  screen.querySelectorAll('[data-toggle-note]').forEach((toggle) => toggle.setAttribute('aria-expanded', String(isOpen)));
  const note = screen.querySelector('.tucked-note');
  if (note) note.setAttribute('aria-hidden', String(!isOpen));
  updateFirstNoteHint(screen);
}

function openDrawer() {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
}

function closeDrawer() {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
}

// Memory 13: Grandma's mental Rolodex plays when the names actually reach the viewport.
const nameRoll = document.querySelector('[data-name-roll]');
const nameSequence = ['Deborah,', 'Donna,', 'Siobhan,', 'Kelly,', 'Tammy,', 'Hannah,', 'Fiona.'];

function playNameRoll(roll) {
  if (!roll || roll.dataset.played === 'true') return;
  const current = roll.querySelector('.name-roll-current');
  if (!current) return;

  roll.dataset.played = 'true';
  roll._timers = [];
  let index = 0;

  const showNext = () => {
    current.classList.add('is-switching');
    const swapTimer = setTimeout(() => {
      current.textContent = nameSequence[index];
      current.classList.remove('is-switching');
      requestAnimationFrame(() => current.classList.add('is-visible'));
      index += 1;

      if (index < nameSequence.length) {
        const nextTimer = setTimeout(() => {
          current.classList.remove('is-visible');
          showNext();
        }, 520);
        roll._timers.push(nextTimer);
      }
    }, index === 0 ? 60 : 150);
    roll._timers.push(swapTimer);
  };

  showNext();
}

if ('IntersectionObserver' in window && nameRoll) {
  const nameRollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.55) playNameRoll(entry.target);
    });
  }, { threshold: [0.55], rootMargin: '0px 0px -8% 0px' });
  nameRollObserver.observe(nameRoll);
} else if (nameRoll) {
  nameRoll.addEventListener('click', () => playNameRoll(nameRoll));
}

// Memory 22: drag one loose end toward the other; the thread snaps into a bow.
const reconnectWidgets = [...document.querySelectorAll('[data-reconnect-thread]')];

function setupReconnectThread(widget) {
  const stage = widget.querySelector('[data-thread-stage]');
  const moveEnd = widget.querySelector('[data-thread-move]');
  const targetEnd = widget.querySelector('[data-thread-target]');
  const leftPath = widget.querySelector('[data-thread-left]');
  const tieButton = widget.querySelector('[data-thread-tie]');
  if (!stage || !moveEnd || !targetEnd || !leftPath) return;

  let dragging = false;
  let activePointer = null;

  const metrics = () => {
    const rect = stage.getBoundingClientRect();
    return {
      rect,
      startX: rect.width * 0.32,
      targetX: rect.width * 0.70,
      minX: rect.width * 0.16,
      maxX: rect.width * 0.74,
    };
  };

  const updatePath = (xPixels) => {
    const { rect } = metrics();
    if (!rect.width) return;
    const x = Math.max(58, Math.min(270, (xPixels / rect.width) * 360));
    const control = Math.max(72, x - 42);
    leftPath.setAttribute('d', `M 8 83 C 60 30, ${control.toFixed(1)} 104, ${x.toFixed(1)} 63`);
  };

  const placeEnd = (xPixels) => {
    moveEnd.style.left = `${xPixels}px`;
    updatePath(xPixels);
  };

  const resetLooseEnd = () => {
    if (widget.classList.contains('is-tied')) return;
    const { startX } = metrics();
    placeEnd(startX);
  };

  const tieThread = () => {
    if (widget.classList.contains('is-tied')) return;
    widget.classList.add('is-tied');
    moveEnd.disabled = true;
    tieButton && (tieButton.disabled = true);
    widget.setAttribute('aria-label', 'The two thread ends are tied together in a bow.');
  };

  moveEnd.addEventListener('pointerdown', (event) => {
    if (widget.classList.contains('is-tied')) return;
    dragging = true;
    activePointer = event.pointerId;
    moveEnd.setPointerCapture?.(event.pointerId);
  });

  moveEnd.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== activePointer || widget.classList.contains('is-tied')) return;
    const { rect, targetX, minX, maxX } = metrics();
    const x = Math.max(minX, Math.min(maxX, event.clientX - rect.left));
    placeEnd(x);
    if (Math.abs(x - targetX) <= 42) tieThread();
  });

  const finishDrag = (event) => {
    if (!dragging || (activePointer !== null && event.pointerId !== activePointer)) return;
    dragging = false;
    activePointer = null;
    if (!widget.classList.contains('is-tied')) resetLooseEnd();
  };

  moveEnd.addEventListener('pointerup', finishDrag);
  moveEnd.addEventListener('pointercancel', finishDrag);
  tieButton?.addEventListener('click', tieThread);

  widget._reflow = resetLooseEnd;
  requestAnimationFrame(resetLooseEnd);
}

reconnectWidgets.forEach(setupReconnectThread);

// Memory 24: tap the black bar to reveal the word, tap again to censor it.
document.querySelectorAll('[data-censor-toggle]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const revealed = button.classList.toggle('is-revealed');
    button.setAttribute('aria-pressed', String(revealed));
    button.setAttribute('aria-label', revealed ? 'Censor the word again' : 'Reveal the censored word');
  });
});

// Memory 26: each tarot card flips independently.
document.querySelectorAll('[data-tarot-card]').forEach((card) => {
  card.addEventListener('click', (event) => {
    event.stopPropagation();
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
  });
});

// Optional soundtrack. It starts only after the visitor taps the music button.
function setMusicUI(on) {
  musicOn = on;
  if (!musicToggle) return;
  musicToggle.classList.toggle('is-on', on);
  musicToggle.setAttribute('aria-pressed', String(on));
  musicToggle.setAttribute('aria-label', on ? 'Pause background music' : 'Play background music');
}

async function ensureAudioGraph() {
  if (!music) return false;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  if (!audioContext) {
    audioContext = new AudioContextClass();
    mediaSource = audioContext.createMediaElementSource(music);
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    mediaSource.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }

  if (audioContext.state === 'suspended') await audioContext.resume();
  return true;
}

function rampGain(target, seconds = 0.9) {
  if (!gainNode || !audioContext) return;
  const now = audioContext.currentTime;
  const current = gainNode.gain.value;
  gainNode.gain.cancelScheduledValues(now);
  gainNode.gain.setValueAtTime(current, now);
  gainNode.gain.linearRampToValueAtTime(target, now + seconds);
}

function fallbackFade(target, milliseconds = 900, done) {
  if (!music) return;
  clearInterval(fallbackFadeTimer);
  const start = music.volume;
  const steps = 18;
  let step = 0;
  fallbackFadeTimer = setInterval(() => {
    step += 1;
    music.volume = start + ((target - start) * (step / steps));
    if (step >= steps) {
      clearInterval(fallbackFadeTimer);
      fallbackFadeTimer = null;
      music.volume = target;
      done?.();
    }
  }, milliseconds / steps);
}

async function turnMusicOn() {
  if (!music || !musicToggle) return;
  try {
    const usingWebAudio = await ensureAudioGraph();
    if (!usingWebAudio) music.volume = 0;
    await music.play();
    setMusicUI(true);
    if (usingWebAudio) rampGain(musicTargetVolume, 1.1);
    else fallbackFade(musicTargetVolume, 1000);
  } catch {
    musicToggle.disabled = true;
    musicToggle.setAttribute('aria-label', 'Background music unavailable');
  }
}

function turnMusicOff() {
  if (!music || !musicToggle) return;
  setMusicUI(false);
  if (gainNode && audioContext) {
    rampGain(0, 0.75);
    setTimeout(() => { if (!musicOn) music.pause(); }, 800);
  } else {
    fallbackFade(0, 700, () => { if (!musicOn) music.pause(); });
  }
}

if (musicToggle && music) {
  music.addEventListener('error', () => {
    musicToggle.disabled = true;
    musicToggle.setAttribute('aria-label', 'Background music unavailable');
  });
  music.querySelector('source')?.addEventListener('error', () => {
    musicToggle.disabled = true;
    musicToggle.setAttribute('aria-label', 'Background music unavailable');
  });
  musicToggle.addEventListener('click', () => {
    if (musicOn) turnMusicOff();
    else turnMusicOn();
  });
}

openBoxButton?.addEventListener('click', () => showScreen('memory-01'));
drawerButton?.addEventListener('click', openDrawer);
drawerCloseTargets.forEach((el) => el.addEventListener('click', closeDrawer));

memoryScreens.forEach((screen) => {
  screen.querySelectorAll('[data-toggle-note]').forEach((toggle) => {
    toggle.addEventListener('click', () => toggleNote(screen));
  });
});

jumpLinks.forEach((link) => link.addEventListener('click', (event) => {
  const id = link.dataset.jump;
  if (!id) return;
  if (link.classList.contains('drawer-link') && link.classList.contains('is-locked')) {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  showScreen(id);
}));

document.querySelectorAll('[data-wish-candle]').forEach((candle) => {
  candle.addEventListener('click', (event) => {
    event.stopPropagation();
    candle.classList.toggle('blown');
  });
});

finaleButton?.addEventListener('click', () => showScreen('epilogue'));

let touchStartX = null;
let touchStartY = null;

function activeMemoryIndex() {
  return memoryScreens.findIndex((screen) => screen.classList.contains('active'));
}

document.addEventListener('touchstart', (event) => {
  if (event.target.closest('[data-thread-move], [data-tarot-card], [data-wish-candle], [data-censor-toggle], #music-toggle, #drawer-button, .drawer')) {
    touchStartX = null;
    touchStartY = null;
    return;
  }
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  if (touchStartX === null || touchStartY === null) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) > 75 && Math.abs(deltaY) < 60) {
    const index = activeMemoryIndex();
    if (index !== -1) {
      if (deltaX < 0 && memoryScreens[index + 1]) showScreen(memoryScreens[index + 1].id);
      else if (deltaX > 0 && memoryScreens[index - 1]) showScreen(memoryScreens[index - 1].id);
    }
  }

  touchStartX = null;
  touchStartY = null;
}, { passive: true });

window.addEventListener('resize', () => {
  const active = document.querySelector('.memory-screen.active');
  if (active) sizeNote(active);
  reconnectWidgets.forEach((widget) => widget._reflow?.());
});

updateDrawerLocks();
updateFirstNoteHint();
showScreen('cover');
