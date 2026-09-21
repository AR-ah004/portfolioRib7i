/**
 * Ribhi Queder — Neo-Brutalist & 3D Interactive Portfolio Engine
 * Updated & Fixed:
 * 1. Video Autoplay & Modal Source Sync
 * 2. Non-breaking CSS-class Stills Filtering
 * 3. Clean Estimator Calculation (No Add-ons)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. THREE.JS 3D IPHONE 17 PRO MAX CINEMATIC CAMERA SYSTEM
     ========================================================================== */
  const canvas = document.getElementById('webgl3dCanvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.0012);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 75);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
    cyanRimLight.position.set(50, 40, 50);
    scene.add(cyanRimLight);

    const purpleBackLight = new THREE.DirectionalLight(0x6366f1, 2);
    purpleBackLight.position.set(-50, -30, -40);
    scene.add(purpleBackLight);

    const phoneRoot = new THREE.Group();
    scene.add(phoneRoot);

    const phoneWidth = 24;
    const phoneHeight = 48;
    const phoneDepth = 2.4;
    const cornerRadius = 3.6;

    const bodyShape = new THREE.Shape();
    const w = phoneWidth / 2, h = phoneHeight / 2, r = cornerRadius;
    bodyShape.moveTo(-w + r, h);
    bodyShape.lineTo(w - r, h);
    bodyShape.quadraticCurveTo(w, h, w, h - r);
    bodyShape.lineTo(w, -h + r);
    bodyShape.quadraticCurveTo(w, -h, w - r, -h);
    bodyShape.lineTo(-w + r, -h);
    bodyShape.quadraticCurveTo(-w, -h, -w, -h + r);
    bodyShape.lineTo(-w, h - r);
    bodyShape.quadraticCurveTo(-w, h, -w + r, h);

    const extrudeSettings = { depth: phoneDepth, bevelEnabled: true, bevelSegments: 6, steps: 1, bevelSize: 0.5, bevelThickness: 0.5 };
    const phoneGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
    phoneGeo.center();

    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d14,
      metalness: 0.92,
      roughness: 0.28,
      wireframe: false
    });
    const phoneMesh = new THREE.Mesh(phoneGeo, titaniumMat);
    phoneRoot.add(phoneMesh);

    const phoneWireframe = new THREE.LineSegments(
      new THREE.EdgesGeometry(phoneGeo),
      new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.35 })
    );
    phoneRoot.add(phoneWireframe);

    const camPlateauShape = new THREE.Shape();
    const pw = 12, ph = 12, pr = 2.4;
    camPlateauShape.moveTo(-pw / 2 + pr, ph / 2);
    camPlateauShape.lineTo(pw / 2 - pr, ph / 2);
    camPlateauShape.quadraticCurveTo(pw / 2, ph / 2, pw / 2, ph / 2 - pr);
    camPlateauShape.lineTo(pw / 2, -ph / 2 + pr);
    camPlateauShape.quadraticCurveTo(pw / 2, -ph / 2, pw / 2 - pr, -ph / 2);
    camPlateauShape.lineTo(-pw / 2 + pr, -ph / 2);
    camPlateauShape.quadraticCurveTo(-pw / 2, -ph / 2, -pw / 2, -ph / 2 + pr);
    camPlateauShape.lineTo(-pw / 2, ph / 2 - pr);
    camPlateauShape.quadraticCurveTo(-pw / 2, ph / 2, -pw / 2 + pr, ph / 2);

    const camPlateauGeo = new THREE.ExtrudeGeometry(camPlateauShape, { depth: 0.8, bevelEnabled: true, bevelSize: 0.3, bevelThickness: 0.3 });
    camPlateauGeo.center();

    const plateauMat = new THREE.MeshStandardMaterial({ color: 0x141520, metalness: 0.85, roughness: 0.2 });
    const camPlateauMesh = new THREE.Mesh(camPlateauGeo, plateauMat);
    camPlateauMesh.position.set(-3.5, 14.5, (phoneDepth / 2) + 0.5);
    phoneRoot.add(camPlateauMesh);

    const lensPositions = [
      { x: -5.8, y: 17 },
      { x: -5.8, y: 12 },
      { x: -1.4, y: 14.5 }
    ];

    const lensRingMat = new THREE.MeshStandardMaterial({ color: 0x222634, metalness: 0.95, roughness: 0.15 });
    const lensGlassMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.4,
      roughness: 0.05,
      emissive: 0x023440,
      emissiveIntensity: 0.6
    });

    lensPositions.forEach((pos) => {
      const ringGeo = new THREE.CylinderGeometry(2.3, 2.5, 1.2, 32);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, lensRingMat);
      ringMesh.position.set(pos.x, pos.y, (phoneDepth / 2) + 1.2);
      phoneRoot.add(ringMesh);

      const glassGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.4, 28);
      glassGeo.rotateX(Math.PI / 2);
      const glassMesh = new THREE.Mesh(glassGeo, lensGlassMat);
      glassMesh.position.set(pos.x, pos.y, (phoneDepth / 2) + 1.7);
      phoneRoot.add(glassMesh);

      const innerApertureGeo = new THREE.RingGeometry(0.7, 1.1, 24);
      const innerApertureMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const apertureMesh = new THREE.Mesh(innerApertureGeo, innerApertureMat);
      apertureMesh.position.set(pos.x, pos.y, (phoneDepth / 2) + 1.95);
      phoneRoot.add(apertureMesh);
    });

    const flashGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 16);
    flashGeo.rotateX(Math.PI / 2);
    const flashMesh = new THREE.Mesh(flashGeo, new THREE.MeshBasicMaterial({ color: 0xfff2b2 }));
    flashMesh.position.set(-1.4, 18, (phoneDepth / 2) + 0.9);
    phoneRoot.add(flashMesh);

    const lidarGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
    lidarGeo.rotateX(Math.PI / 2);
    const lidarMesh = new THREE.Mesh(lidarGeo, new THREE.MeshBasicMaterial({ color: 0x050508 }));
    lidarMesh.position.set(-1.4, 11.2, (phoneDepth / 2) + 0.9);
    phoneRoot.add(lidarMesh);

    const screenGeo = new THREE.PlaneGeometry(phoneWidth - 1.2, phoneHeight - 1.2);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x040407 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, -(phoneDepth / 2) - 0.55);
    screenMesh.rotation.y = Math.PI;
    phoneRoot.add(screenMesh);

    const islandGeo = new THREE.PlaneGeometry(5.2, 1.2);
    const islandMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.set(0, 19.5, -(phoneDepth / 2) - 0.58);
    islandMesh.rotation.y = Math.PI;
    phoneRoot.add(islandMesh);

    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 120;
      dustPos[i + 1] = (Math.random() - 0.5) * 90;
      dustPos[i + 2] = (Math.random() - 0.5) * 60;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({ color: 0x06b6d4, size: 1.5, transparent: true, opacity: 0.45 });
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    let mouseX = 0, mouseY = 0;
    let targetRotX = 0.2, targetRotY = -0.55;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0012;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0012;
    });

    let currentScroll = 0;
    window.addEventListener('scroll', () => {
      currentScroll = window.scrollY;
    });

    phoneRoot.position.set(20, -2, -10);
    phoneRoot.rotation.set(0.15, -0.6, 0.08);

    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      const scrollRotation = (currentScroll * 0.0025);

      targetRotY = -0.55 + (mouseX * 1.5) + Math.sin(scrollRotation) * 0.8;
      targetRotX = 0.15 + (mouseY * 1.2) + Math.cos(scrollRotation) * 0.3;

      phoneRoot.rotation.y += (targetRotY - phoneRoot.rotation.y) * 0.06;
      phoneRoot.rotation.x += (targetRotX - phoneRoot.rotation.x) * 0.06;

      phoneRoot.position.y = -2 + Math.sin(elapsed * 1.5) * 1.5 - (currentScroll * 0.02);

      if (window.innerWidth > 992) {
        phoneRoot.position.x = 22 + (mouseX * 8);
      } else {
        phoneRoot.position.x = 0;
        phoneRoot.position.z = -18;
      }

      dustField.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ==========================================================================
     2. 3D CARD TILT EFFECT (MOTION-HEAVY INTERACTIVITY)
     ========================================================================== */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });

  /* ==========================================================================
     3. VIEWFINDER CURSOR & CROSSHAIR FOCUS
     ========================================================================== */
  const vfCursor = document.getElementById('viewfinderCursor');
  const glow = document.getElementById('cursorGlow');

  if (vfCursor && glow) {
    window.addEventListener('mousemove', (e) => {
      vfCursor.style.left = `${e.clientX}px`;
      vfCursor.style.top = `${e.clientY}px`;
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('.magnetic-target, .neo-card, .neo-option, a, button').forEach(target => {
      target.addEventListener('mouseenter', () => vfCursor.classList.add('focus-mode'));
      target.addEventListener('mouseleave', () => vfCursor.classList.remove('focus-mode'));
    });
  }

  /* ==========================================================================
     4. DYNAMIC SYNCHRONIZATION WITH ADMIN LOCALSTORAGE
     ========================================================================== */
  const storedPortfolio = JSON.parse(localStorage.getItem('rq_portfolio') || 'null');
  const storedPackages = JSON.parse(localStorage.getItem('rq_packages') || 'null');

  if (storedPortfolio) {
    const reelsCarousel = document.getElementById('clipsCarousel');
    const activeReels = storedPortfolio.filter(m => m.type === 'reels' && !m.isDeleted);

    if (reelsCarousel && activeReels.length > 0) {
      reelsCarousel.innerHTML = activeReels.map(m => `
        <div class="clip-card neo-card magnetic-target" data-tilt
             data-title="${m.title || 'Commercial Cut'}"
             data-category="${m.category || 'Macro Cut'}"
             data-video-src="${m.url}"
             data-views="${m.views || '180K Organic'}"
             data-retention="${m.retention || '85% 3s Hold'}"
             data-desc="${m.desc || 'High-retention vertical cut.'}"
             data-gear="${m.gear || 'Sony FX3 Cinema Line'}"
             data-software="${m.software || 'DaVinci Resolve Studio'}"
             data-objective="${m.objective || 'Accelerate conversion pull.'}"
             data-hook="${m.hook || 'Immediate pattern interrupt.'}"
             data-roi="${m.roi || '+35% organic engagement surge.'}">
          <div class="clip-media-box">
            <video class="carousel-video" autoplay loop muted playsinline preload="metadata">
              <source src="${m.url}" type="video/mp4">
            </video>
            <span class="card-badge">DECRYPT STRATEGY &nearr;</span>
          </div>
          <div class="clip-details">
            <div>
              <strong>${m.title}</strong>
              <span>${m.category || 'Vertical Reel'}</span>
            </div>
            <span class="telemetry-badge">${m.retention || '84% 3S_HOLD'}</span>
          </div>
        </div>
      `).join('');
    }

    const stillsGallery = document.getElementById('stillsGallery');
    const activeStills = storedPortfolio.filter(m => m.type === 'stills' && !m.isDeleted);

    if (stillsGallery && activeStills.length > 0) {
      stillsGallery.innerHTML = activeStills.map(m => `
        <div class="still-card neo-card" data-tilt data-category="${m.category ? m.category.toLowerCase().replace(/[^a-z]/g, '') : 'product'}">
          <div class="still-img-wrap">
            <img src="${m.url}" alt="${m.title}" loading="lazy">
            <div class="still-overlay"><span class="preview-btn">INSPECT STILL &nearr;</span></div>
          </div>
          <div class="still-meta">
            <strong>${m.title}</strong>
            <span class="format-pill">${m.category || '4:5 Feed'}</span>
          </div>
        </div>
      `).join('');
    }
  }

  /* ==========================================================================
     5. REELS CAROUSEL SLIDER & COUNTER
     ========================================================================== */
  const carousel = document.getElementById('clipsCarousel');
  const prevBtn = document.getElementById('prevReelBtn');
  const nextBtn = document.getElementById('nextReelBtn');
  const counter = document.getElementById('carouselCounter');

  if (carousel && counter) {
    const updateCounter = () => {
      const cards = carousel.querySelectorAll('.clip-card');
      if (!cards[0]) return;
      const cardWidth = cards[0].offsetWidth + 24;
      const currentIdx = Math.min(Math.round(carousel.scrollLeft / cardWidth) + 1, cards.length);
      counter.textContent = `${String(currentIdx).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    };

    if (nextBtn) nextBtn.onclick = () => carousel.scrollBy({ left: 300, behavior: 'smooth' });
    if (prevBtn) prevBtn.onclick = () => carousel.scrollBy({ left: -300, behavior: 'smooth' });
    carousel.addEventListener('scroll', updateCounter);
    updateCounter();
  }

  /* ==========================================================================
     6. STILLS FILTER (FIXED: NO CSS-BREAKING INLINE DISPLAY)
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const lightbox = document.getElementById('stillsLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  filterTabs.forEach(tab => {
    tab.onclick = () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const val = (tab.getAttribute('data-filter') || 'all').toLowerCase();

      document.querySelectorAll('.still-card').forEach(card => {
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        if (val === 'all' || cat.includes(val)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    };
  });

  const bindStillsLightbox = () => {
    document.querySelectorAll('.still-card').forEach(card => {
      card.onclick = () => {
        const img = card.querySelector('img');
        const title = card.querySelector('strong') ? card.querySelector('strong').textContent : 'Asset';
        if (lightbox && lightboxImg && img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = title;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      };
    });
  };
  bindStillsLightbox();

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 200);
    }
  };
  if (closeLightboxBtn) closeLightboxBtn.onclick = closeLightbox;
  if (lightbox) lightbox.onclick = (e) => { if (e.target === lightbox) closeLightbox(); };

  /* ==========================================================================
     7. ESTIMATOR (JOD PACKAGES) WITHOUT ADD-ONS
     ========================================================================== */
  const defaultPackages = {
    starter: {
      name: 'Starter Reel & Stills',
      price: 70,
      deliverables: [
        '2x High-Retention 9:16 Vertical Reels',
        '4x Color-Graded Location/Product Photos',
        '4K Capture + Audio SFX & Captions',
        'Standard 48-72h Delivery'
      ]
    },
    growth: {
      name: 'Growth Content Pack',
      price: 120,
      deliverables: [
        '4x High-Retention 9:16 Vertical Reels',
        '8x Color-Graded Grid & Story Photos',
        'Hook Scripting & Fast-Paced Edit',
        'Standard 48-72h Delivery'
      ]
    },
    halfday: {
      name: 'Commercial Shoot',
      price: 220,
      deliverables: [
        'Full Venue Half-Day Production',
        '7x High-Converting Vertical Reels',
        'Comprehensive 15+ Image Bank',
        'Cinema Rig + Master Sound Design'
      ]
    },
    monthly: {
      name: 'Monthly Content Retainer',
      price: 450,
      deliverables: [
        '12x Strategic Reels / Month',
        '2 Dedicated Production Sessions',
        'Full Grid Photography Bank',
        'Dedicated Content Calendar & Revisions'
      ]
    }
  };

  const packages = storedPackages ? { ...defaultPackages, ...storedPackages } : defaultPackages;
  let currentPkg = 'starter';
  let rushSurplus = 0;

  const estPrice = document.getElementById('estPriceDisplay');
  const estList = document.getElementById('estDeliverablesList');

  const updateEstimator = () => {
    const pkg = packages[currentPkg] || packages.starter;
    let total = pkg.price + rushSurplus;

    if (estPrice) estPrice.textContent = `${total} JOD`;

    if (estList) {
      estList.innerHTML = '';
      (pkg.deliverables || []).forEach(d => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="check-icon">✓</span> ${d}`;
        estList.appendChild(li);
      });
    }
  };

  document.querySelectorAll('.format-option').forEach(opt => {
    opt.onclick = () => {
      document.querySelectorAll('.format-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input');
      if (radio) {
        radio.checked = true;
        currentPkg = radio.value;
        updateEstimator();
      }
    };
  });

  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      rushSurplus = btn.dataset.speed === 'rush' ? 25 : 0;
      updateEstimator();
    };
  });

  const lockEstimateBtn = document.getElementById('lockEstimateBtn');
  if (lockEstimateBtn) {
    lockEstimateBtn.onclick = () => {
      const typeSelect = document.getElementById('shootType');
      const brief = document.getElementById('clientBrief');
      if (typeSelect) typeSelect.value = currentPkg;
      if (brief) brief.value = `[Estimator Total: ${estPrice.textContent}] Package: ${(packages[currentPkg] || {}).name}`;
      const cal = document.getElementById('calendar');
      if (cal) cal.scrollIntoView({ behavior: 'smooth' });
    };
  }
  updateEstimator();

  /* ==========================================================================
     8. CASE STUDY OVERLAY (FIXED VIDEO PLAYBACK)
     ========================================================================== */
  const projectOverlay = document.getElementById('projectPageOverlay');
  const closeProjectBtn = document.getElementById('closeProjectPageBtn');
  const projectVideo = document.getElementById('projectPageVideo');

  const attachCaseStudyClicks = () => {
    document.querySelectorAll('.clip-card').forEach(card => {
      // إزالة أي تكرار للأحداث
      card.onclick = null;
      card.onclick = function() {
        document.getElementById('projTitle').textContent = this.dataset.title || 'Commercial Cut';
        document.getElementById('projCategory').textContent = this.dataset.category || 'Reel';
        document.getElementById('projViews').textContent = this.dataset.views || 'Organic';
        document.getElementById('projObjective').textContent = this.dataset.objective || 'High conversion vertical cut.';
        document.getElementById('projHook').textContent = this.dataset.hook || 'Immediate pattern interrupt.';
        document.getElementById('projRoi').textContent = this.dataset.roi || 'Significant organic conversion acceleration.';
        document.getElementById('projGear').textContent = this.dataset.gear || 'Sony FX3 Cinema Line';
        document.getElementById('projSoftware').textContent = this.dataset.software || 'DaVinci Resolve Studio';
        document.getElementById('projRetention').textContent = this.dataset.retention || '85%+ Hold';

        // جلب مسار الفيديو الصحيح سواء من الخاصية أو من وسم الفيديو الداخلي
        const innerVideo = this.querySelector('video source') || this.querySelector('video');
        const videoSrc = this.getAttribute('data-video-src') || (innerVideo ? (innerVideo.src || innerVideo.getAttribute('src')) : '');

        if (projectVideo && videoSrc) {
          projectVideo.pause();
          projectVideo.muted = true; // إجباري للسماح بالتشغيل بدون حظر من المتصفح
          projectVideo.setAttribute('playsinline', '');
          projectVideo.src = videoSrc;
          projectVideo.load();
          
          // تأكيد التشغيل
          const playPromise = projectVideo.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // إذا منعه المتصفح، سيتمكن المستخدم من تشغيله يدوياً من زر play لأنه يحتوي على controls
            });
          }
        }

        projectOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      };
    });
  };

  // تشغيل الربط فوراً
  attachCaseStudyClicks();
  // وإعادة تشغيله بعد ثانية لضمان التقاط الكروت لو كانت مولدة ديناميكياً
  setTimeout(attachCaseStudyClicks, 1000);

  const closeCaseStudy = () => {
    if (projectOverlay) {
      projectOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (projectVideo) {
        projectVideo.pause();
        projectVideo.src = '';
      }
    }
  };
  if (closeProjectBtn) closeProjectBtn.onclick = closeCaseStudy;
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCaseStudy(); });
  /* ==========================================================================
     9. PRODUCTION CALENDAR & WHATSAPP DISPATCH
     ========================================================================== */
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let currentDate = new Date(2026, 8, 16);
  let selectedDay = 18;
  let activeTimeSlot = '10:00 AM';

  const scheduleData = {
    16: { status: 'partial', slots: ['02:00 PM', '05:00 PM'], booked: ['10:00 AM'] },
    17: { status: 'booked', slots: [], booked: ['Full Day Filming'] },
    18: { status: 'available', slots: ['10:00 AM', '01:30 PM', '04:00 PM', '07:00 PM'], booked: [] },
    19: { status: 'available', slots: ['11:00 AM', '03:00 PM', '06:30 PM'], booked: [] },
    20: { status: 'booked', slots: [], booked: ['Commercial Set'] },
    21: { status: 'partial', slots: ['04:00 PM'], booked: ['11:00 AM'] },
    22: { status: 'available', slots: ['10:00 AM', '02:00 PM', '05:00 PM'], booked: [] }
  };

  const calDays = document.getElementById('calendarDays');
  const calMonth = document.getElementById('calendarMonth');
  const calYear = document.getElementById('calendarYear');
  const selectedDateText = document.getElementById('selectedDateText');
  const timeSlotsList = document.getElementById('timeSlotsList');

  function renderCal() {
    if (!calDays) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (calMonth) calMonth.textContent = monthNames[month];
    if (calYear) calYear.textContent = year;
    calDays.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day disabled';
      calDays.appendChild(blank);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.innerHTML = `<span>${d}</span>`;

      const info = scheduleData[d];
      if (info) {
        const dotBox = document.createElement('div');
        dotBox.className = 'day-dots';
        dotBox.innerHTML = `<span class="dot-indicator dot-${info.status}"></span>`;
        dayEl.appendChild(dotBox);
      }

      if (d === selectedDay) {
        dayEl.classList.add('selected');
        updateSlotList(d, info);
      }

      dayEl.onclick = () => {
        document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
        dayEl.classList.add('selected');
        selectedDay = d;
        updateSlotList(d, scheduleData[d]);
      };
      calDays.appendChild(dayEl);
    }
  }

  function updateSlotList(day, info) {
    if (selectedDateText) selectedDateText.textContent = `${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`;
    if (!timeSlotsList) return;
    timeSlotsList.innerHTML = '';

    if (!info || !info.slots.length) {
      timeSlotsList.innerHTML = '<div style="grid-column: span 2; font-size:0.8rem; color:#ef4444;">No open windows for this date. Please select another day.</div>';
      activeTimeSlot = null;
      return;
    }

    info.slots.forEach((slot, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `time-slot-btn ${idx === 0 ? 'active' : ''}`;
      if (idx === 0) activeTimeSlot = slot;
      btn.textContent = slot;
      btn.onclick = () => {
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTimeSlot = slot;
      };
      timeSlotsList.appendChild(btn);
    });
  }

  const prevMonth = document.getElementById('prevMonthBtn');
  const nextMonth = document.getElementById('nextMonthBtn');
  if (prevMonth) prevMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCal(); };
  if (nextMonth) nextMonth.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCal(); };
  renderCal();

  const bookingForm = document.getElementById('bookingForm');
  const confirmModal = document.getElementById('bookingConfirmModal');
  const waBtn = document.getElementById('whatsappActionBtn');
  const pill = document.getElementById('confirmSummaryPill');

  if (bookingForm) {
    bookingForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const typeSelect = document.getElementById('shootType');
      const type = typeSelect.options[typeSelect.selectedIndex].text;
      const brief = document.getElementById('clientBrief').value.trim();

      if (!activeTimeSlot) {
        alert('Please choose an available filming slot first.');
        return;
      }

      const dateStr = `${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`;

      // --- حفظ الحجز فوراً في Firebase Realtime Database ---
      if (typeof db !== 'undefined') {
        db.ref('bookings').push({
          clientName: name,
          phone: document.getElementById('clientPhone').value.trim(),
          package: type,
          date: dateStr,
          timeSlot: activeTimeSlot,
          brief: brief,
          status: 'pending',
          createdAt: new Date().toISOString()
        }).then(() => {
          console.log("Booking saved to Firebase Cloud 24/7!");
        }).catch(err => {
          console.error("Firebase Error:", err);
        });
      }

      if (pill) pill.textContent = `${name} // ${dateStr} @ ${activeTimeSlot} // ${type}`;

      const msg = encodeURIComponent(
        `Hi Ribhi! Production reservation dispatched from your site:\n\n` +
        `• Client/Brand: ${name}\n` +
        `• Shoot Date: ${dateStr}\n` +
        `• Time Slot: ${activeTimeSlot}\n` +
        `• Format Scope: ${type}\n` +
        (brief ? `• Strategy Brief: ${brief}\n\n` : `\n`) +
        `Let's confirm the production logistics!`
      );

      if (waBtn) waBtn.href = `https://wa.me/962790000000?text=${msg}`;
      if (confirmModal) confirmModal.classList.add('active');
    };
  }

  const closeConfirm = document.getElementById('closeConfirmModalBtn');
  const dismissConfirm = document.getElementById('dismissConfirmBtn');
  if (closeConfirm) closeConfirm.onclick = () => confirmModal.classList.remove('active');
  if (dismissConfirm) dismissConfirm.onclick = () => confirmModal.classList.remove('active');

  /* ==========================================================================
     10. REVIEWS MODAL
     ========================================================================== */
  const openRev = document.getElementById('openReviewModalBtn');
  const closeRev = document.getElementById('closeReviewModalBtn');
  const revModal = document.getElementById('reviewModal');
  const revForm = document.getElementById('newReviewForm');
  const reviewsGrid = document.getElementById('reviewsGrid');

  if (openRev && revModal) openRev.onclick = () => revModal.classList.add('active');
  if (closeRev && revModal) closeRev.onclick = () => revModal.classList.remove('active');

  if (revForm && reviewsGrid) {
    revForm.onsubmit = (e) => {
      e.preventDefault();
      const author = document.getElementById('revAuthor').value.trim();
      const project = document.getElementById('revProject').value.trim();
      const content = document.getElementById('revContent').value.trim();

      const card = document.createElement('div');
      card.className = 'review-card neo-card';
      card.setAttribute('data-tilt', '');
      card.innerHTML = `
        <div class="review-top">
          <div class="client-avatar">${author.substring(0, 2).toUpperCase()}</div>
          <div class="client-meta">
            <h4>${author}</h4>
            <span>${project}</span>
          </div>
          <div class="review-stars">★★★★★</div>
        </div>
        <p class="review-quote">"${content}"</p>
        <div class="review-date">VERIFIED COMMERCIAL PARTNER</div>
      `;
      reviewsGrid.prepend(card);
      revForm.reset();
      revModal.classList.remove('active');
    };
  }

});

