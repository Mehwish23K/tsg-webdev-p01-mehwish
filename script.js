// ==========================================================
// FEATURE 0 — LIGHT / DARK THEME TOGGLE
// Swaps two CSS custom properties (--bg-rgb / --fg-rgb) that
// nearly everything else in style.css is built on top of.
// ==========================================================
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'light') {
    root.setAttribute('data-theme', 'light');
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    root.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeToggle.setAttribute('aria-pressed', 'false');
  }
  localStorage.setItem('mehwish-theme', theme);
}

const savedTheme = localStorage.getItem('mehwish-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  applyTheme(isLight ? 'dark' : 'light');
  updateBgMorph(); // refresh immediately instead of waiting for next scroll
});

// ---------- MOBILE MENU TOGGLE ----------
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
  menuToggle.innerHTML = isOpen
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

// close mobile menu after clicking a link
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

// ---------- SCROLL TO TOP BUTTON ----------
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- SKILL BARS FILL ON SCROLL ----------
const skillsGrid = document.getElementById('skillsGrid');
if (skillsGrid) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.bar-fill').forEach((bar) => {
            bar.style.width = `${bar.dataset.width}%`;
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillObserver.observe(skillsGrid);
}

// ---------- TECH MARQUEE ----------
const STACK = [
  { name: 'HTML5', icon: 'fa-brands fa-html5' },
  { name: 'CSS3', icon: 'fa-brands fa-css3-alt' },
  { name: 'JavaScript', icon: 'fa-brands fa-js' },
  { name: 'React', icon: 'fa-brands fa-react' },
  { name: 'Node.js', icon: 'fa-brands fa-node-js' },
  { name: 'Git', icon: 'fa-brands fa-git-alt' },
  { name: 'GitHub', icon: 'fa-brands fa-github' },
  { name: 'Figma', icon: 'fa-brands fa-figma' },
];

const track = document.getElementById('marqueeTrack');
const buildBadges = () =>
  STACK.map(
    (t) => `<div class="tech-badge"><i class="${t.icon}"></i>${t.name}</div>`
  ).join('');
track.innerHTML = buildBadges() + buildBadges(); // duplicate for seamless loop

// ---------- CONTACT FORM VALIDATION ----------
const form = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');
const formSuccess = document.getElementById('formSuccess');

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateField(input, errorEl, message, isValid) {
  if (!isValid) {
    input.classList.add('invalid');
    errorEl.textContent = message;
    return false;
  }
  input.classList.remove('invalid');
  errorEl.textContent = '';
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.remove('show');

  const nameOk = validateField(
    nameInput, nameError, 'Please enter your name.',
    nameInput.value.trim().length >= 2
  );
  const emailOk = validateField(
    emailInput, emailError, 'Please enter a valid email.',
    isValidEmail(emailInput.value.trim())
  );
  const messageOk = validateField(
    messageInput, messageError, 'Message can\'t be empty.',
    messageInput.value.trim().length >= 5
  );

  if (nameOk && emailOk && messageOk) {
    formSuccess.classList.add('show');
    form.reset();
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }
});

// clear error state as the user types
[nameInput, emailInput, messageInput].forEach((input) => {
  input.addEventListener('input', () => {
    input.classList.remove('invalid');
  });
});

// ==========================================================
// FEATURE 1 — SCROLL-DRIVEN BACKGROUND MORPH
// Background color shifts based on scroll POSITION, not time.
// ==========================================================
const bgMorph = document.getElementById('bgMorph');

// color stops: charcoal -> deep violet-charcoal -> deep coral-charcoal -> charcoal
const darkStops = [
  { pos: 0,    color: [17, 17, 20] },   // charcoal
  { pos: 0.35, color: [26, 20, 40] },   // violet-tinted dark
  { pos: 0.7,  color: [34, 18, 24] },   // coral-tinted dark
  { pos: 1,    color: [17, 17, 20] },   // back to charcoal
];
// light-theme equivalent: soft paper tones instead of near-black
const lightStops = [
  { pos: 0,    color: [242, 238, 230] }, // bone
  { pos: 0.35, color: [235, 231, 245] }, // soft violet tint
  { pos: 0.7,  color: [248, 231, 228] }, // soft coral tint
  { pos: 1,    color: [242, 238, 230] }, // back to bone
];

function lerp(a, b, t) { return a + (b - a) * t; }

function colorAt(percent) {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const stops = isLight ? lightStops : darkStops;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (percent >= a.pos && percent <= b.pos) {
      const t = (percent - a.pos) / (b.pos - a.pos);
      const r = lerp(a.color[0], b.color[0], t);
      const g = lerp(a.color[1], b.color[1], t);
      const bl = lerp(a.color[2], b.color[2], t);
      return `rgb(${r | 0}, ${g | 0}, ${bl | 0})`;
    }
  }
  return `rgb(${stops[0].color.join(',')})`;
}

function updateBgMorph() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? scrollTop / docHeight : 0;
  bgMorph.style.backgroundColor = colorAt(Math.min(Math.max(percent, 0), 1));
}

window.addEventListener('scroll', updateBgMorph, { passive: true });
window.addEventListener('resize', updateBgMorph);
updateBgMorph();

// ==========================================================
// FEATURE 2 — CUSTOM MAGNETIC CURSOR
// A trailing dot + ring, and elements with .magnetic pull
// slightly toward the cursor when nearby.
// ==========================================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

if (!isTouchDevice) {
  document.body.classList.add('has-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // ring trails behind the dot with easing
  function animateRing() {
    ringX = lerp(ringX, mouseX, 0.18);
    ringY = lerp(ringY, mouseY, 0.18);
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // magnetic pull + cursor ring grow on hoverable elements
  const magneticEls = document.querySelectorAll(
    '.magnetic, .project-card, .skill-card, .nav-links a, .social-row a, #robotCanvas'
  );

  magneticEls.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('hover');
      el.style.transform = '';
    });
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const pull = 0.18;
      el.style.transform = `translate(${relX * pull}px, ${relY * pull}px)`;
    });
  });
}

// ==========================================================
// FEATURE 3 — EXPANDING PROJECT CARDS (FLIP animation)
// Cards animate from their in-grid position/size to a full
// case-study panel using the FLIP technique (no libraries).
// ==========================================================
const projectCards = document.querySelectorAll('.project-card');
const caseOverlay = document.getElementById('caseOverlay');
const caseBackdrop = document.getElementById('caseBackdrop');
const caseClose = document.getElementById('caseClose');

const caseFields = {
  status: document.getElementById('caseStatus'),
  tag: document.getElementById('caseTag'),
  title: document.getElementById('caseTitle'),
  desc: document.getElementById('caseDesc'),
  problem: document.getElementById('caseProblem'),
  approach: document.getElementById('caseApproach'),
  improve: document.getElementById('caseImprove'),
  stack: document.getElementById('caseStack'),
  link: document.getElementById('caseLink'),
};

let activeCard = null;

function openCase(card) {
  activeCard = card;
  const startRect = card.getBoundingClientRect();

  // fill overlay content from data attributes
  caseFields.title.textContent = card.dataset.title;
  caseFields.tag.textContent = card.dataset.tag;
  caseFields.desc.textContent = card.dataset.desc;
  caseFields.problem.textContent = card.dataset.problem;
  caseFields.approach.textContent = card.dataset.approach;
  caseFields.improve.textContent = card.dataset.improve;
  caseFields.link.href = card.dataset.link;

  caseFields.status.textContent = card.dataset.statusLabel;
  caseFields.status.className = `case-status ${card.dataset.status}`;

  caseFields.stack.innerHTML = card.dataset.stack
    .split(',')
    .map((s) => `<span>${s.trim()}</span>`)
    .join('');

  card.setAttribute('aria-expanded', 'true');
  card.classList.add('flip-hidden');

  // FIRST: place overlay exactly over the card's current position (no transition)
  caseOverlay.classList.add('active');
  caseOverlay.style.top = `${startRect.top}px`;
  caseOverlay.style.left = `${startRect.left}px`;
  caseOverlay.style.width = `${startRect.width}px`;
  caseOverlay.style.height = `${startRect.height}px`;
  caseOverlay.style.borderRadius = '4px';
  caseOverlay.setAttribute('aria-hidden', 'false');

  caseBackdrop.classList.add('show');
  document.body.classList.add('case-open');

  // force reflow so the browser registers the starting position
  void caseOverlay.offsetHeight;

  caseOverlay.classList.add('animating');

  // LAST + PLAY: animate to full expanded panel size on next frame
  requestAnimationFrame(() => {
    const targetWidth = Math.min(window.innerWidth * 0.86, 760);
    const targetHeight = Math.min(window.innerHeight * 0.86, 720);
    const targetTop = (window.innerHeight - targetHeight) / 2;
    const targetLeft = (window.innerWidth - targetWidth) / 2;

    caseOverlay.style.top = `${targetTop}px`;
    caseOverlay.style.left = `${targetLeft}px`;
    caseOverlay.style.width = `${targetWidth}px`;
    caseOverlay.style.height = `${targetHeight}px`;
    caseOverlay.style.borderRadius = '8px';
    caseOverlay.classList.add('open');
  });
}

function closeCase() {
  if (!activeCard) return;
  const endRect = activeCard.getBoundingClientRect();

  caseOverlay.classList.remove('open');
  caseBackdrop.classList.remove('show');

  // animate back down to the card's position
  caseOverlay.style.top = `${endRect.top}px`;
  caseOverlay.style.left = `${endRect.left}px`;
  caseOverlay.style.width = `${endRect.width}px`;
  caseOverlay.style.height = `${endRect.height}px`;
  caseOverlay.style.borderRadius = '4px';

  activeCard.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('case-open');

  setTimeout(() => {
    caseOverlay.classList.remove('animating');
    caseOverlay.classList.remove('active');
    caseOverlay.setAttribute('aria-hidden', 'true');
    if (activeCard) activeCard.classList.remove('flip-hidden');
    activeCard = null;
  }, 450);
}

projectCards.forEach((card) => {
  card.addEventListener('click', () => openCase(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openCase(card);
    }
  });
});

caseClose.addEventListener('click', closeCase);
caseBackdrop.addEventListener('click', closeCase);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && activeCard) closeCase();
});

// ==========================================================
// FEATURE 4 — 3D ROBOT MASCOT (built from primitives in Three.js)
// Every part below is a basic shape (sphere/cylinder/torus) —
// no imported model file, so it's fully explainable piece by piece.
// ==========================================================
if (typeof THREE !== 'undefined') {
  const canvas = document.getElementById('robotCanvas');
  const wrap = document.getElementById('robotWrap');
  const speechBubble = document.getElementById('speechBubble');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0.05, 8.6);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function sizeRenderer() {
    const size = wrap.clientWidth;
    renderer.setSize(size, size);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  sizeRenderer();
  window.addEventListener('resize', sizeRenderer);

  // lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0xff4d6d, 0.6, 10);
  rimLight.position.set(-3, 1, -2);
  scene.add(rimLight);

  // ----- build the robot from primitive shapes -----
  const robot = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.45, metalness: 0.1 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0x8b7fe8, roughness: 0.4 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xe8b94a, roughness: 0.3, metalness: 0.3 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x111114, roughness: 0.5 });

  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.85, 32, 32), bodyMat);
  head.position.y = 1.05;
  // group all head parts so they can rotate together (for the cursor-tracking look-at effect)
  const headGroup = new THREE.Group();
  robot.add(headGroup);

  headGroup.add(head);

  // eyes (bigger dark spheres, slightly oval for a friendlier look) + lashes
  const eyeGeo = new THREE.SphereGeometry(0.145, 20, 20);
  const eyeL = new THREE.Mesh(eyeGeo, darkMat);
  eyeL.position.set(-0.3, 1.08, 0.75);
  eyeL.scale.set(1, 1.2, 0.8);
  const eyeR = new THREE.Mesh(eyeGeo, darkMat);
  eyeR.position.set(0.3, 1.08, 0.75);
  eyeR.scale.set(1, 1.2, 0.8);
  headGroup.add(eyeL, eyeR);

  // tiny eye-shine dots — makes the eyes read as glassy/alive instead of flat black
  const shineGeo = new THREE.SphereGeometry(0.035, 10, 10);
  const shineMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const shineL = new THREE.Mesh(shineGeo, shineMat);
  shineL.position.set(-0.25, 1.13, 0.86);
  const shineR = new THREE.Mesh(shineGeo, shineMat);
  shineR.position.set(0.35, 1.13, 0.86);
  headGroup.add(shineL, shineR);

  // lashes — three tiny angled cylinders flicking outward from the top-outer
  // corner of each eye, mirrored left/right
  const lashGeo = new THREE.CylinderGeometry(0.012, 0.008, 0.13, 6);
  const lashAngles = [-0.15, 0.15, 0.4]; // fan of three per eye
  lashAngles.forEach((angle) => {
    const lashL = new THREE.Mesh(lashGeo, darkMat);
    lashL.position.set(-0.42, 1.2, 0.78);
    lashL.rotation.z = Math.PI / 2 + angle;
    headGroup.add(lashL);

    const lashR = new THREE.Mesh(lashGeo, darkMat);
    lashR.position.set(0.42, 1.2, 0.78);
    lashR.rotation.z = Math.PI / 2 - angle;
    headGroup.add(lashR);
  });

  // blush cheeks (small coral spheres — cute detail)
  const blushMat = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.6, transparent: true, opacity: 0.55 });
  const blushGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const blushL = new THREE.Mesh(blushGeo, blushMat);
  blushL.position.set(-0.55, 0.93, 0.62);
  blushL.scale.set(1, 0.7, 0.5);
  const blushR = new THREE.Mesh(blushGeo, blushMat);
  blushR.position.set(0.55, 0.93, 0.62);
  blushR.scale.set(1, 0.7, 0.5);
  headGroup.add(blushL, blushR);

  // antenna (thin cylinder + small gold sphere on top)
  const antennaStem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8), darkMat);
  antennaStem.position.y = 1.9;
  const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), goldMat);
  antennaTip.position.y = 2.12;
  headGroup.add(antennaStem, antennaTip);

  // headband / bow (torus, coral)
  const bowMat = new THREE.MeshStandardMaterial({ color: 0xff4d6d, roughness: 0.4 });
  const headband = new THREE.Mesh(new THREE.TorusGeometry(0.87, 0.05, 12, 40, Math.PI), bowMat);
  headband.rotation.x = Math.PI / 2.4;
  headband.position.y = 1.4;
  headGroup.add(headband);

  // body (rounded cylinder) — bulkier + more segments for a solid, structural feel
  const bodyMatSolid = new THREE.MeshStandardMaterial({ color: 0x8b7fe8, roughness: 0.35, metalness: 0.15, flatShading: false });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.78, 1.6, 32), bodyMatSolid);
  body.position.y = -0.72;
  robot.add(body);

  // chest plate (flattened torus) — adds structural detail to the torso
  const chestPlate = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.045, 12, 32), goldMat);
  chestPlate.position.set(0, -0.58, 0.62);
  chestPlate.rotation.x = Math.PI / 2.1;
  robot.add(chestPlate);

  // shoulder spheres — where the arms attach, makes the silhouette read as solid
  const shoulderGeo = new THREE.SphereGeometry(0.22, 20, 20);
  const shoulderL = new THREE.Mesh(shoulderGeo, bodyMatSolid);
  shoulderL.position.set(-0.72, -0.05, 0.1);
  const shoulderR = new THREE.Mesh(shoulderGeo, bodyMatSolid);
  shoulderR.position.set(0.72, -0.05, 0.1);
  robot.add(shoulderL, shoulderR);

  // base ring — grounds the floating body visually, like a solid rim
  const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.65, 0.18, 32), darkMat);
  baseRing.position.y = -1.58;
  robot.add(baseRing);

  // little legs + feet — short cylinders with flattened oval feet
  const legGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.4, 16);
  const legL = new THREE.Mesh(legGeo, bodyMatSolid);
  legL.position.set(-0.28, -1.85, 0.06);
  const legR = new THREE.Mesh(legGeo, bodyMatSolid);
  legR.position.set(0.28, -1.85, 0.06);
  robot.add(legL, legR);

  const footGeo = new THREE.SphereGeometry(0.2, 18, 18);
  const footL = new THREE.Mesh(footGeo, darkMat);
  footL.position.set(-0.28, -2.08, 0.14);
  footL.scale.set(1, 0.55, 1.35);
  const footR = new THREE.Mesh(footGeo, darkMat);
  footR.position.set(0.28, -2.08, 0.14);
  footR.scale.set(1, 0.55, 1.35);
  robot.add(footL, footR);

  // neck trim ring
  const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.06, 12, 32), goldMat);
  neckRing.rotation.x = Math.PI / 2;
  neckRing.position.y = 0.02;
  robot.add(neckRing);

  // arms (cylinders) — right arm is a separate pivot group so it can wave
  const armGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.7, 16);
  const handGeo = new THREE.SphereGeometry(0.15, 18, 18);

  const leftArm = new THREE.Mesh(armGeo, bodyMat);
  leftArm.position.set(-0.8, -0.46, 0.16);
  leftArm.rotation.z = Math.PI / 10;
  const leftHand = new THREE.Mesh(handGeo, bodyMatSolid);
  leftHand.position.set(0, -0.4, 0); // local to leftArm, at the cylinder's tip
  leftArm.add(leftHand);
  robot.add(leftArm);

  const armPivot = new THREE.Group();
  armPivot.position.set(0.8, -0.05, 0.16);
  const rightArm = new THREE.Mesh(armGeo, bodyMat);
  rightArm.position.set(0, -0.36, 0);
  rightArm.rotation.z = -Math.PI / 10;
  const rightHand = new THREE.Mesh(handGeo, bodyMatSolid);
  rightHand.position.set(0, -0.4, 0); // local to rightArm — waves along with the arm
  rightArm.add(rightHand);
  armPivot.add(rightArm);
  robot.add(armPivot);

  scene.add(robot);

  // ----- she "watches" the cursor: subtle head-turn toward the mouse -----
  let lookTargetX = 0;
  let lookTargetY = 0;
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // clamp so the turn stays subtle even if the cursor is far away
    lookTargetX = Math.max(-1, Math.min(1, (e.clientX - centerX) / 500));
    lookTargetY = Math.max(-1, Math.min(1, (e.clientY - centerY) / 500));
  });

  // ----- floating idle animation -----
  const clock = new THREE.Clock();
  let waveTime = null; // set when a wave should play

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    robot.position.y = Math.sin(t * 1.4) * 0.08;
    robot.rotation.y = Math.sin(t * 0.6) * 0.15;

    // ease the head toward the cursor rather than snapping — feels alive, not robotic-glitchy
    headGroup.rotation.y = lerp(headGroup.rotation.y, lookTargetX * 0.4, 0.06);
    headGroup.rotation.x = lerp(headGroup.rotation.x, -lookTargetY * 0.22, 0.06);

    if (waveTime !== null) {
      const elapsed = t - waveTime;
      if (elapsed < 1.4) {
        // raise the arm up first, THEN wiggle side-to-side at the wrist —
        // reads as an actual wave instead of a stiff side-tilt
        const raise = Math.min(elapsed / 0.35, 1) * -1.9; // lift arm up and out
        const wiggle = elapsed > 0.35 ? Math.sin((elapsed - 0.35) * 14) * 0.35 : 0;
        armPivot.rotation.z = raise;
        armPivot.rotation.x = wiggle * 0.3;
        rightArm.rotation.y = wiggle;
      } else {
        armPivot.rotation.z = 0;
        armPivot.rotation.x = 0;
        rightArm.rotation.y = 0;
        waveTime = null;
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  function playWave() {
    waveTime = clock.getElapsedTime();
  }

  function showBubble(text) {
    speechBubble.textContent = text;
    speechBubble.classList.add('show');
    setTimeout(() => speechBubble.classList.remove('show'), 2600);
  }

  // ----- greet on load, and again when scrolling back to the hero -----
  let hasLeftHero = false;
  const heroEl = document.getElementById('home');

  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playWave();
          showBubble(hasLeftHero ? 'hi again!' : 'hii! 👋');
          wrap.classList.remove('floating');
          wrap.style.top = '';
        } else {
          hasLeftHero = true;
          if (window.matchMedia('(min-width: 900px)').matches) {
            wrap.classList.add('floating');
          }
        }
      });
    },
    { threshold: 0.5 }
  );
  heroObserver.observe(heroEl);

  // ----- follow the reader: slide to sit alongside whichever section
  // is currently in view, once she's left the hero and gone "floating".
  // Desktop only — on small screens a floating avatar sliding around
  // while someone's trying to read is distraction, not delight. -----
  const canFollow = window.matchMedia('(min-width: 900px)').matches;

  const followSections = canFollow
    ? ['about', 'skills', 'projects', 'contact']
        .map((id) => document.getElementById(id))
        .filter(Boolean)
    : [];

  function positionNearActiveSection(sectionEl) {
    if (!wrap.classList.contains('floating')) return;
    const rect = sectionEl.getBoundingClientRect();
    const wrapHeight = 220 * 0.4; // matches the .floating scale(0.4)
    // reserve extra space at the bottom so she never overlaps #scrollTop
    // (which sits fixed at bottom:26px, ~44px tall)
    const bottomReserved = 110;
    let targetTop = rect.top + rect.height / 2 - wrapHeight / 2;
    targetTop = Math.max(80, Math.min(targetTop, window.innerHeight - wrapHeight - bottomReserved));
    wrap.style.top = `${targetTop}px`;
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      // pick whichever intersecting section covers the most viewport
      let best = null;
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
          best = entry;
        }
      });
      if (best) positionNearActiveSection(best.target);
    },
    { threshold: [0.3, 0.5, 0.7] }
  );
  followSections.forEach((sec) => sectionObserver.observe(sec));

  // click the robot to open the chat panel
  canvas.addEventListener('click', () => openBot());
}

// ==========================================================
// FEATURE 5 — SCRIPTED CHAT PANEL
// Button-driven Q&A (not a live AI) — reliable, no API key,
// and fully explainable: every reply is a fixed string below.
// ==========================================================
const botPanel = document.getElementById('botPanel');
const botBackdrop = document.getElementById('botBackdrop');
const botClose = document.getElementById('botClose');
const botBody = document.getElementById('botBody');
const botQuickReplies = document.getElementById('botQuickReplies');

const botReplies = {
  projects: {
    label: 'Her projects',
    reply: "She's built SupplyCircle (a B2B marketplace with live negotiation), the Sapphire store simulator, and a Barber Shop frontend build. Scroll to the Projects section and click a card for the full case study!",
  },
  skills: {
    label: 'Her skills',
    reply: "She's a junior full-stack dev focused mainly on frontend — solid in HTML, CSS, JavaScript and React, and leveling up in Node.js and databases (PostgreSQL/MongoDB). Check the Skills section for the full breakdown.",
  },
  contact: {
    label: 'How to contact her',
    reply: "Best way is the contact form below, or mehwishkalim23@gmail.com. She's straightforward — tell her what you need and she'll tell you honestly if she can help.",
  },
  education: {
    reply: "She's a final-year Computer Science student at the University of Karachi.",
  },
  internship: {
    reply: "She spent about a year as a junior developer intern at DataFortress IT before building her own projects.",
  },
};

// simple keyword → topic matching for the free-text input.
// Not real NLP — just a mapping, which is exactly why it's reliable
// and easy to explain: no external API, no hallucination risk.
const keywordMap = [
  { topic: 'projects', keywords: ['project', 'built', 'build', 'supplycircle', 'barber', 'barbershop', 'sapphire', 'portfolio', 'work on'] },
  { topic: 'skills', keywords: ['skill', 'tech', 'stack', 'react', 'node', 'javascript', 'css', 'html', 'database', 'postgres', 'mongo'] },
  { topic: 'contact', keywords: ['contact', 'email', 'reach', 'hire', 'role', 'job', 'work with'] },
  { topic: 'education', keywords: ['study', 'school', 'university', 'karachi', 'degree', 'education', 'student'] },
  { topic: 'internship', keywords: ['intern', 'internship', 'experience', 'datafortress'] },
];

function findReply(text) {
  const lower = text.toLowerCase();
  const match = keywordMap.find((entry) => entry.keywords.some((k) => lower.includes(k)));
  return match ? botReplies[match.topic] : null;
}

const FALLBACK_REPLY =
  "I don't have a scripted answer for that one — try asking about her projects, skills, education, or how to contact her.";

function openBot() {
  botPanel.classList.add('show');
  botBackdrop.classList.add('show');
  botPanel.setAttribute('aria-hidden', 'false');
}

function closeBot() {
  botPanel.classList.remove('show');
  botBackdrop.classList.remove('show');
  botPanel.setAttribute('aria-hidden', 'true');
}

function addBotMessage(text, from) {
  const msg = document.createElement('div');
  msg.className = `bot-msg ${from}`;
  msg.textContent = text;
  botBody.appendChild(msg);
  botBody.scrollTop = botBody.scrollHeight;
}

botQuickReplies.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-topic]');
  if (!btn) return;
  const topic = botReplies[btn.dataset.topic];
  addBotMessage(topic.label, 'user');
  addBotMessage(topic.reply, 'bot');
});

const botAskForm = document.getElementById('botAskForm');
const botAskInput = document.getElementById('botAskInput');

botAskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const question = botAskInput.value.trim();
  if (!question) return;
  addBotMessage(question, 'user');
  const matched = findReply(question);
  addBotMessage(matched ? matched.reply : FALLBACK_REPLY, 'bot');
  botAskInput.value = '';
});

botClose.addEventListener('click', closeBot);
botBackdrop.addEventListener('click', closeBot);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && botPanel.classList.contains('show')) closeBot();
});
