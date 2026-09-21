/**
 * Ribhi Queder — Commercial Portfolio Engine
 * Featured Master Reel Spotlight & Sync, Interactive Split Grade,
 * Live Dynamic Synchronization with Admin LocalStorage (Reels, Stills & Packages),
 * Dynamic Availability Calendar, and Case Study Modal.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     0. DYNAMIC SYNCHRONIZATION WITH ADMIN LOCALSTORAGE (REELS, STILLS, PACKAGES)
     ========================================================================== */
  const storedPortfolio = JSON.parse(localStorage.getItem('rq_portfolio') || 'null');
  const storedPackages = JSON.parse(localStorage.getItem('rq_packages') || 'null');

  // 1. Dynamic Reels Sync into Clips Carousel
  if (storedPortfolio) {
    const reelsCarousel = document.getElementById('clipsCarousel');
    const activeReels = storedPortfolio.filter(m => m.type === 'reels' && !m.isDeleted);

    if (reelsCarousel && activeReels.length > 0) {
      reelsCarousel.innerHTML = activeReels.map(m => `
        <div class="clip-card magnetic-target"
             data-title="${m.title || 'Commercial Reel'}"
             data-category="${m.category || 'Macro Demo'}"
             data-video-src="${m.url}"
             data-views="${m.views || '150K Organic'}"
             data-retention="${m.retention || '84% 3s Hold'}"
             data-desc="${m.desc || 'High-retention mobile commercial engineered for direct conversions.'}"
             data-gear="${m.gear || 'Sony FX3 Cinema Line'}"
             data-software="${m.software || 'DaVinci Resolve Studio'}"
             data-objective="${m.objective || 'Accelerate direct consumer conversions.'}"
             data-hook="${m.hook || 'Pattern interrupt designed for feed capture.'}"
             data-roi="${m.roi || '+35% organic engagement acceleration.'}">
          <div class="clip-media-box">
            <video class="carousel-video" autoplay loop muted playsinline preload="metadata">
              <source src="${m.url}" type="video/mp4">
            </video>
            <span class="card-badge">Inspect Strategy &nearr;</span>
          </div>
          <div class="clip-details">
            <strong>${m.title}</strong>
            <span>${m.category || 'Reel'}</span>
          </div>
        </div>
      `).join('');
    }

    // 2. Dynamic Stills Sync into Grid
    const stillsGallery = document.getElementById('stillsGallery');
    const activeStills = storedPortfolio.filter(m => m.type === 'stills' && !m.isDeleted);

    if (stillsGallery && activeStills.length > 0) {
      stillsGallery.innerHTML = activeStills.map(m => `
        <div class="still-card" data-category="${m.category ? m.category.toLowerCase().replace(/[^a-z]/g, '') : 'product'}">
          <div class="still-img-wrap">
            <img src="${m.url}" alt="${m.title}" loading="lazy">
            <div class="still-overlay"><span class="preview-btn">View Asset &nearr;</span></div>
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
     1. FEATURED MASTER REEL SYNC & CONTROLS
     ========================================================================== */
  const heroVideo = document.getElementById('heroFeaturedVideo');
  const heroTitle = document.getElementById('heroReelTitle');
  const heroCategory = document.getElementById('heroReelCategory');
  const audioBtn = document.getElementById('heroAudioToggleBtn');

  // استدعاء البورتفوليو المخزن في localStorage لاختيار أول ريل نشط أو محدد من الأدمن
  const portfolioData = JSON.parse(localStorage.getItem('rq_portfolio') || 'null');

  if (portfolioData && heroVideo) {
    // جلب الريل المميز المحدد أو أول ريل نشط
    const featuredReel = portfolioData.find(m => m.type === 'reels' && !m.isDeleted && m.isFeatured) ||
                         portfolioData.find(m => m.type === 'reels' && !m.isDeleted);

    if (featuredReel) {
      heroVideo.src = featuredReel.url;
      if (heroTitle) heroTitle.textContent = featuredReel.title;
      if (heroCategory) heroCategory.textContent = featuredReel.category || 'Featured Cut';
    }
  }

  // التحكم بالصوت (Mute / Unmute)
  if (audioBtn && heroVideo) {
    audioBtn.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      audioBtn.textContent = heroVideo.muted ? '🔇' : '🔊';
    });
  }

  /* ==========================================================================
     2. INTERACTIVE BEFORE / AFTER COLOR GRADE SLIDER
     ========================================================================== */
  const gradeComparison = document.getElementById('gradeComparison');
  const gradeFinalLayer = document.getElementById('gradeFinalLayer');
  const gradeDivider = document.getElementById('gradeDivider');

  if (gradeComparison && gradeFinalLayer && gradeDivider) {
    let isSliding = false;

    const setGradePosition = (xPos) => {
      const rect = gradeComparison.getBoundingClientRect();
      let clampedX = Math.max(0, Math.min(xPos - rect.left, rect.width));
      let percentage = (clampedX / rect.width) * 100;

      gradeFinalLayer.style.width = `${percentage}%`;
      gradeDivider.style.left = `${percentage}%`;
    };

    gradeComparison.addEventListener('mousedown', (e) => {
      isSliding = true;
      setGradePosition(e.clientX);
    });

    window.addEventListener('mouseup', () => { isSliding = false; });
    gradeComparison.addEventListener('mousemove', (e) => {
      if (isSliding) setGradePosition(e.clientX);
    });

    // Touch Handling
    gradeComparison.addEventListener('touchstart', (e) => {
      isSliding = true;
      setGradePosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isSliding = false; });
    gradeComparison.addEventListener('touchmove', (e) => {
      if (isSliding && e.touches[0]) setGradePosition(e.touches[0].clientX);
    }, { passive: true });

    // Keyboard Accessibility
    gradeComparison.setAttribute('tabindex', '0');
    gradeComparison.addEventListener('keydown', (e) => {
      const currentWidth = parseFloat(gradeFinalLayer.style.width) || 50;
      if (e.key === 'ArrowLeft') {
        const next = Math.max(5, currentWidth - 5);
        gradeFinalLayer.style.width = `${next}%`;
        gradeDivider.style.left = `${next}%`;
      } else if (e.key === 'ArrowRight') {
        const next = Math.min(95, currentWidth + 5);
        gradeFinalLayer.style.width = `${next}%`;
        gradeDivider.style.left = `${next}%`;
      }
    });
  }

  /* ==========================================================================
     3. REELS CAROUSEL & ACCURATE COUNTER
     ========================================================================== */
  const carousel = document.getElementById('clipsCarousel');
  const prevBtn = document.getElementById('prevReelBtn');
  const nextBtn = document.getElementById('nextReelBtn');
  const counter = document.getElementById('carouselCounter');

  if (carousel && counter) {
    const cards = carousel.querySelectorAll('.clip-card');
    const totalCards = cards.length;

    const updateAccurateCounter = () => {
      if (!cards[0]) return;
      const cardWidth = cards[0].offsetWidth + 24;
      const scrollPos = carousel.scrollLeft;
      const currentIdx = Math.min(Math.round(scrollPos / cardWidth) + 1, totalCards);
      counter.textContent = `${String(currentIdx).padStart(2, '0')} / ${String(totalCards).padStart(2, '0')}`;
    };

    updateAccurateCounter();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }

    carousel.addEventListener('scroll', updateAccurateCounter);
  }

  /* ==========================================================================
     4. STILLS GALLERY FILTER & LIGHTBOX ENGINE
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const lightbox = document.getElementById('stillsLightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filterValue = tab.getAttribute('data-filter');

      document.querySelectorAll('.still-card').forEach((card) => {
        if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const bindStillCardClicks = () => {
    document.querySelectorAll('.still-card').forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('strong') ? card.querySelector('strong').textContent : 'Asset';
        const format = card.querySelector('.format-pill') ? card.querySelector('.format-pill').textContent : '4:5';

        if (lightbox && lightboxImg && img) {
          lightboxImg.src = img.src;
          lightboxCaption.textContent = `${title} (${format})`;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  };
  bindStillCardClicks();

  const closeLightbox = () => {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 200);
    }
  };

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ==========================================================================
     5. INSTANT INTERACTIVE PACKAGE ESTIMATOR (JOD PACKAGES)
     ========================================================================== */
  const defaultPackages = {
    starter: {
      name: 'Starter Reel & Stills',
      price: 70,
      deliverables: [
        '2x High-Retention 9:16 Vertical Reels',
        '4x Color-Graded Location/Product Photos',
        '4K Ultra-HD Video Capture with Studio Lighting',
        'On-Screen Dynamic Captions & Licensed Music',
        '2 Rounds of Minor Cut Revisions'
      ]
    },
    growth: {
      name: 'Growth Content Pack',
      price: 120,
      deliverables: [
        '4x High-Retention 9:16 Vertical Reels',
        '8x Color-Graded Grid & Story Photos',
        'Creative Hook & Script Concept Assistance',
        '4K Resolution, Custom Color Grading & Captions',
        'Standard 48-72h Delivery'
      ]
    },
    halfday: {
      name: 'Complete Commercial Shoot',
      price: 190,
      deliverables: [
        'Complete Venue / Storefront Half-Day Production',
        '7x High-Converting Vertical Reels (Demos + Walkthroughs)',
        'Comprehensive 15+ Commercial Image Bank',
        'Multi-angle Cinema Lighting & Sound Setup',
        'Master Audio Mixing & Priority Processing'
      ]
    },
    monthly: {
      name: 'Monthly Content Retainer',
      price: 320,
      deliverables: [
        '12x Strategic Reels / Month (Consistent Brand Pipeline)',
        '2 Dedicated Half-Day Production Sessions',
        'Full Feed Photos Bank (4:5 & 1:1)',
        'Dedicated Content Calendar & Topic Planning',
        'Ongoing Revisions & Priority Turnaround'
      ]
    }
  };

  const packages = storedPackages ? { ...defaultPackages, ...storedPackages } : defaultPackages;

  let currentPackageKey = 'starter';
  let speedSurplus = 0;
  let currentSpeedLabel = 'Standard 48-72h';

  const formatOptions = document.querySelectorAll('.format-option');
  const speedBtns = document.querySelectorAll('.speed-btn');
  const estPriceDisplay = document.getElementById('estPriceDisplay');
  const estDeliverablesList = document.getElementById('estDeliverablesList');
  const lockEstimateBtn = document.getElementById('lockEstimateBtn');

  const calculateEstimate = () => {
    const pkg = packages[currentPackageKey] || packages.starter;
    let total = pkg.price + speedSurplus;

    const addonScript = document.getElementById('addonScript');
    const addonVoiceover = document.getElementById('addonVoiceover');
    const addonExtraStills = document.getElementById('addonExtraStills');

    let activeAddons = [];
    if (addonScript && addonScript.checked) {
      total += parseFloat(addonScript.value) || 15;
      activeAddons.push('Hook Scripting & Ideation');
    }
    if (addonVoiceover && addonVoiceover.checked) {
      total += parseFloat(addonVoiceover.value) || 20;
      activeAddons.push('Studio Voiceover & Foley Sound');
    }
    if (addonExtraStills && addonExtraStills.checked) {
      total += parseFloat(addonExtraStills.value) || 15;
      activeAddons.push('Multi-Format Feed Covers (4:5 & 1:1)');
    }

    if (estPriceDisplay) {
      estPriceDisplay.textContent = `${total} JOD`;
    }

    if (estDeliverablesList) {
      estDeliverablesList.innerHTML = '';
      (pkg.deliverables || []).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="check-icon">✓</span> ${item}`;
        estDeliverablesList.appendChild(li);
      });

      activeAddons.forEach(addon => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="check-icon">✓</span> [Add-on] ${addon}`;
        estDeliverablesList.appendChild(li);
      });

      const timeLi = document.createElement('li');
      timeLi.innerHTML = `<span class="check-icon">✓</span> Turnaround: ${currentSpeedLabel}`;
      estDeliverablesList.appendChild(timeLi);
    }
  };

  formatOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      formatOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        currentPackageKey = radio.value;
        calculateEstimate();
      }
    });
  });

  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const speed = btn.dataset.speed;
      speedSurplus = speed === 'rush' ? 25 : 0;
      currentSpeedLabel = speed === 'rush' ? '24-Hour Same-Day Rush (+25 JOD)' : 'Standard 48-72h Delivery';
      calculateEstimate();
    });
  });

  document.querySelectorAll('.addon-item input').forEach(input => {
    input.addEventListener('change', calculateEstimate);
  });

  if (lockEstimateBtn) {
    lockEstimateBtn.addEventListener('click', () => {
      const shootTypeSelect = document.getElementById('shootType');
      const clientBrief = document.getElementById('clientBrief');
      const selectedPkg = packages[currentPackageKey] || packages.starter;

      if (shootTypeSelect) {
        shootTypeSelect.value = currentPackageKey;
      }

      if (clientBrief) {
        clientBrief.value = `[Pre-filled Estimate] Package: ${selectedPkg.name} | Turnaround: ${currentSpeedLabel} | Total: ${estPriceDisplay.textContent}`;
      }

      const calSection = document.getElementById('calendar') || document.getElementById('booking');
      if (calSection) {
        calSection.scrollIntoView({ behavior: 'smooth' });
        const card = document.querySelector('.booking-slot-card');
        if (card) {
          card.style.borderColor = '#6366f1';
          card.style.boxShadow = '0 0 35px rgba(99, 102, 241, 0.4)';
          setTimeout(() => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
          }, 2400);
        }
      }
    });
  }

  calculateEstimate();

  /* ==========================================================================
     6. DEDICATED FULL-PAGE CASE STUDY OVERLAY
     ========================================================================== */
  const projectOverlay = document.getElementById('projectPageOverlay');
  const closeProjectBtn = document.getElementById('closeProjectPageBtn');
  const projectPageVideo = document.getElementById('projectPageVideo');
  const projTitle = document.getElementById('projTitle');
  const projCategory = document.getElementById('projCategory');
  const projViews = document.getElementById('projViews');
  const projObjective = document.getElementById('projObjective');
  const projHook = document.getElementById('projHook');
  const projDesc = document.getElementById('projDesc');
  const projRoi = document.getElementById('projRoi');
  const projGear = document.getElementById('projGear');
  const projSoftware = document.getElementById('projSoftware');
  const projRetention = document.getElementById('projRetention');
  const projBookBtn = document.getElementById('projBookBtn');

  const attachClipCardEvents = () => {
    document.querySelectorAll('.clip-card').forEach(card => {
      card.addEventListener('click', () => {
        projTitle.textContent = card.dataset.title;
        projCategory.textContent = card.dataset.category;
        projViews.textContent = card.dataset.views;
        projObjective.textContent = card.dataset.objective || 'Craft high-retention commercial vertical asset.';
        projHook.textContent = card.dataset.hook || '2-second pattern interrupt.';
        projDesc.textContent = card.dataset.desc;
        projRoi.textContent = card.dataset.roi || 'Significant organic conversion acceleration.';
        projGear.textContent = card.dataset.gear;
        projSoftware.textContent = card.dataset.software;
        projRetention.textContent = card.dataset.retention;

        projectPageVideo.src = card.dataset.videoSrc;
        projectPageVideo.play().catch(() => {});

        projectOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  };
  attachClipCardEvents();

  const closeProjectPage = () => {
    projectOverlay.classList.remove('active');
    document.body.style.overflow = '';
    projectPageVideo.pause();
    projectPageVideo.src = '';
  };

  if (closeProjectBtn) closeProjectBtn.addEventListener('click', closeProjectPage);
  if (projBookBtn) projBookBtn.addEventListener('click', closeProjectPage);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectOverlay.classList.contains('active')) {
      closeProjectPage();
    }
  });

  /* ==========================================================================
     7. LIVE BOOKING CALENDAR & AVAILABILITY ENGINE
     ========================================================================== */
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let currentDate = new Date(2026, 8, 16);
  let selectedDay = 18;

  const scheduleData = {
    16: { status: 'partial', slots: ['02:00 PM', '05:00 PM'], booked: ['10:00 AM'] },
    17: { status: 'booked', slots: [], booked: ['10:00 AM', '02:00 PM', '06:00 PM'] },
    18: { status: 'available', slots: ['10:00 AM', '01:30 PM', '04:00 PM', '07:00 PM'], booked: [] },
    19: { status: 'available', slots: ['11:00 AM', '03:00 PM', '06:30 PM'], booked: [] },
    20: { status: 'booked', slots: [], booked: ['09:00 AM', '01:00 PM', '05:00 PM'] },
    21: { status: 'partial', slots: ['04:00 PM'], booked: ['11:00 AM', '01:00 PM'] },
    22: { status: 'available', slots: ['10:00 AM', '02:00 PM', '05:00 PM'], booked: [] },
    23: { status: 'available', slots: ['12:00 PM', '03:30 PM', '06:00 PM'], booked: [] },
    24: { status: 'partial', slots: ['01:00 PM', '05:30 PM'], booked: ['10:00 AM'] },
    25: { status: 'booked', slots: [], booked: ['Full Day Commercial Shoot'] },
    26: { status: 'available', slots: ['10:00 AM', '02:00 PM', '06:00 PM'], booked: [] }
  };

  const calendarDaysEl = document.getElementById('calendarDays');
  const calendarMonthEl = document.getElementById('calendarMonth');
  const calendarYearEl = document.getElementById('calendarYear');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const selectedDateText = document.getElementById('selectedDateText');
  const dateStatusPill = document.getElementById('dateStatusPill');
  const timeSlotsList = document.getElementById('timeSlotsList');
  let activeTimeSlot = '10:00 AM';

  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    calendarMonthEl.textContent = monthNames[month];
    calendarYearEl.textContent = year;
    calendarDaysEl.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day disabled';
      calendarDaysEl.appendChild(blank);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.innerHTML = `<span>${d}</span>`;

      if (year === 2026 && month === 8 && d < 16) {
        dayEl.classList.add('disabled');
      } else {
        const dayInfo = scheduleData[d];
        if (dayInfo) {
          const dotsContainer = document.createElement('div');
          dotsContainer.className = 'day-dots';

          if (dayInfo.status === 'available') {
            dotsContainer.innerHTML = '<span class="dot-indicator dot-available"></span><span class="dot-indicator dot-available"></span>';
          } else if (dayInfo.status === 'partial') {
            dotsContainer.innerHTML = '<span class="dot-indicator dot-partial"></span>';
          } else if (dayInfo.status === 'booked') {
            dotsContainer.innerHTML = '<span class="dot-indicator dot-booked"></span>';
          }
          dayEl.appendChild(dotsContainer);
        }

        if (d === selectedDay) {
          dayEl.classList.add('selected');
          updateSlotDetails(d, dayInfo);
        }

        dayEl.addEventListener('click', () => {
          document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
          dayEl.classList.add('selected');
          selectedDay = d;
          updateSlotDetails(d, scheduleData[d]);
        });
      }

      calendarDaysEl.appendChild(dayEl);
    }
  }

  function updateSlotDetails(day, info) {
    const month = monthNames[currentDate.getMonth()];
    selectedDateText.textContent = `${month} ${day}, ${currentDate.getFullYear()}`;
    timeSlotsList.innerHTML = '';
    activeTimeSlot = null;

    if (!info || (!info.slots.length && !info.booked.length)) {
      dateStatusPill.textContent = 'Open Slate';
      dateStatusPill.style.color = '#9ca3af';
      dateStatusPill.style.background = 'rgba(255, 255, 255, 0.08)';
      timeSlotsList.innerHTML = '<div class="no-slots-placeholder">Flexible production schedule. Choose any morning or afternoon slot.</div>';
      activeTimeSlot = 'Flexible Slot';
      return;
    }

    if (info.status === 'booked') {
      dateStatusPill.textContent = 'Fully Booked';
      dateStatusPill.style.color = '#ef4444';
      dateStatusPill.style.background = 'rgba(239, 68, 68, 0.15)';
      timeSlotsList.innerHTML = '<div class="no-slots-placeholder" style="color:#ef4444">Entire day committed to active commercial filming. Please select another date.</div>';
      return;
    }

    if (info.status === 'available') {
      dateStatusPill.textContent = 'Fully Open (3+ Slots)';
      dateStatusPill.style.color = '#10b981';
      dateStatusPill.style.background = 'rgba(16, 185, 129, 0.15)';
    } else {
      dateStatusPill.textContent = 'Limited (1-2 Slots Left)';
      dateStatusPill.style.color = '#f59e0b';
      dateStatusPill.style.background = 'rgba(245, 158, 11, 0.15)';
    }

    info.slots.forEach((time, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot-btn';
      if (idx === 0) {
        btn.classList.add('active');
        activeTimeSlot = time;
      }
      btn.textContent = time;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTimeSlot = time;
      });
      timeSlotsList.appendChild(btn);
    });

    info.booked.forEach(time => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'time-slot-btn booked';
      btn.textContent = time;
      btn.disabled = true;
      timeSlotsList.appendChild(btn);
    });
  }

  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();

  // Booking Form Submission & WhatsApp Trigger
  const bookingForm = document.getElementById('bookingForm');
  const confirmModal = document.getElementById('bookingConfirmModal');
  const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
  const dismissConfirmBtn = document.getElementById('dismissConfirmBtn');
  const confirmSummaryPill = document.getElementById('confirmSummaryPill');
  const whatsappActionBtn = document.getElementById('whatsappActionBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const typeSelect = document.getElementById('shootType');
      const typeText = typeSelect.options[typeSelect.selectedIndex].text;
      const brief = document.getElementById('clientBrief').value.trim();

      if (!activeTimeSlot) {
        alert('Please choose an available time slot above first.');
        return;
      }

      const dateStr = `${monthNames[currentDate.getMonth()]} ${selectedDay}, ${currentDate.getFullYear()}`;
      confirmSummaryPill.textContent = `${name} · ${dateStr} at ${activeTimeSlot} · ${typeText}`;

      const waMessage = encodeURIComponent(
        `Hello Ribhi! I've booked a production slot on your site:\n\n` +
        `• Name/Brand: ${name}\n` +
        `• Date: ${dateStr}\n` +
        `• Time Window: ${activeTimeSlot}\n` +
        `• Project Scope: ${typeText}\n` +
        (brief ? `• Brief: ${brief}\n\n` : `\n`) +
        `Looking forward to confirming shoot logistics!`
      );

      whatsappActionBtn.href = `https://wa.me/962790000000?text=${waMessage}`;
      confirmModal.classList.add('active');
    });
  }

  const closeConfirmation = () => {
    confirmModal.classList.remove('active');
    bookingForm.reset();
  };

  if (closeConfirmModalBtn) closeConfirmModalBtn.addEventListener('click', closeConfirmation);
  if (dismissConfirmBtn) dismissConfirmBtn.addEventListener('click', closeConfirmation);

  /* ==========================================================================
     8. VERIFIED CLIENT REVIEW ENGINE & MODAL
     ========================================================================== */
  const openRevModal = document.getElementById('openReviewModalBtn');
  const closeRevModal = document.getElementById('closeReviewModalBtn');
  const reviewModal = document.getElementById('reviewModal');
  const newReviewForm = document.getElementById('newReviewForm');
  const reviewsGrid = document.getElementById('reviewsGrid');

  if (openRevModal && reviewModal) {
    openRevModal.addEventListener('click', () => reviewModal.classList.add('active'));
    closeRevModal.addEventListener('click', () => reviewModal.classList.remove('active'));

    reviewModal.addEventListener('click', (e) => {
      if (e.target === reviewModal) reviewModal.classList.remove('active');
    });
  }

  if (newReviewForm && reviewsGrid) {
    newReviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const author = document.getElementById('revAuthor').value.trim();
      const project = document.getElementById('revProject').value.trim();
      const ratingNum = parseInt(document.getElementById('revRating').value);
      const content = document.getElementById('revContent').value.trim();

      const initials = author.substring(0, 2).toUpperCase() || 'RQ';
      const stars = '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum);

      const newCard = document.createElement('div');
      newCard.className = 'review-card';
      newCard.innerHTML = `
        <div class="review-top">
          <div class="client-avatar">${initials}</div>
          <div class="client-meta">
            <h4>${author}</h4>
            <span>${project}</span>
          </div>
          <div class="review-stars">${stars}</div>
        </div>
        <p class="review-quote">"${content}"</p>
        <div class="review-date">Verified Partner · Just now</div>
      `;

      reviewsGrid.prepend(newCard);
      newReviewForm.reset();
      reviewModal.classList.remove('active');
    });
  }

  /* ==========================================================================
     9. HARDWARE-ACCELERATED SPOTLIGHT CURSOR & MAGNETIC HOVER
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');

  if (cursorDot && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });

    document.querySelectorAll('.magnetic-target, .btn, .clip-card, .still-card').forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('magnetic-active'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('magnetic-active'));
    });
  }

});