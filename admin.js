/**
 * Ribhi Queder — Studio Executive Dashboard Engine
 * Modular SPA Router, Telemetry, and Full Soft-Delete CRUD System with Local File Uploads
 */

const DB = {
  get(key, fallback = []) {
    try {
      const data = localStorage.getItem('rq_' + key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem('rq_' + key, JSON.stringify(val));
    } catch (e) {
      alert("Storage quota warning: If you are uploading large files, prefer pasting direct CDN/Video URLs.");
    }
  }
};

const DEFAULT_SEED_DATA = {
  bookings: [
    {
      id: "BKG-2026-0042",
      clientName: "Rivan Fashion Boutique",
      phone: "+962790000000",
      email: "contact@rivan.jo",
      packageKey: "growth",
      addons: ["script", "stills"],
      turnaround: "rush",
      date: "2026-09-18",
      time: "01:30 PM",
      status: "confirmed",
      payment: "deposit",
      brief: "4 vertical cuts for Autumn collection showroom launch.",
      notes: "Studio lighting truck required on location.",
      total: 160,
      isDeleted: false,
      deletedAt: null
    },
    {
      id: "BKG-2026-0043",
      clientName: "Burger Makers Gourmet",
      phone: "+962791112233",
      email: "ops@burgermakers.jo",
      packageKey: "starter",
      addons: ["voiceover"],
      turnaround: "standard",
      date: "2026-09-22",
      time: "10:00 AM",
      status: "pending",
      payment: "unpaid",
      brief: "Culinary commercial for new smash burger menu in Abdali.",
      notes: "",
      total: 90,
      isDeleted: false,
      deletedAt: null
    }
  ],
  packages: {
    starter: {
      name: "Starter Reel & Stills",
      price: 70,
      desc: "2 vertical reels (9:16) + 4 photos",
      deliverables: ["2x High-Retention Vertical Reels", "4x Color-Graded Photos", "Standard 48h Turnaround"],
      active: true,
      isDeleted: false,
      deletedAt: null
    },
    growth: {
      name: "Growth Content Pack",
      price: 120,
      desc: "4 vertical reels + 8 grid stills",
      deliverables: ["4x High-Retention Vertical Reels", "8x Grid Photos", "Creative Hook Scripting"],
      active: true,
      isDeleted: false,
      deletedAt: null
    },
    halfday: {
      name: "Commercial Shoot",
      price: 220,
      desc: "Full venue shoot + 7 vertical cuts",
      deliverables: ["Half-Day Production", "7x High-Converting Reels", "15+ Image Bank"],
      active: true,
      isDeleted: false,
      deletedAt: null
    },
    monthly: {
      name: "Monthly Content Retainer",
      price: 450,
      desc: "12 reels/month + ongoing asset bank",
      deliverables: ["12x Reels / Month", "2 Production Sessions", "Ongoing Revisions"],
      active: true,
      isDeleted: false,
      deletedAt: null
    }
  },
  portfolio: [
    {
      id: "media-reel-1",
      type: "reels",
      title: "Shelf Pick-up Macro",
      category: "Macro Demo",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      desc: "Slow motion tactile product interaction designed to hook feed retention.",
      views: "180K Organic",
      retention: "86% 3s Hold",
      gear: "Sony FX3 Cinema Line",
      software: "DaVinci Resolve Studio",
      objective: "Drive direct-to-shelf consumer pull.",
      hook: "0.5-second macro snap interrupt.",
      roi: "+38% direct retail sales acceleration.",
      isDeleted: false,
      deletedAt: null
    },
    {
      id: "media-reel-2",
      type: "reels",
      title: "Showroom Walkthrough",
      category: "Retail Tour",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
      desc: "High-energy commercial walkthrough with on-screen price callouts.",
      views: "240K Organic",
      retention: "82% 3s Hold",
      gear: "Sony FX3 + DJI RS3 Pro",
      software: "DaVinci Resolve Studio",
      objective: "Showcase physical store footprint in Amman.",
      hook: "Rapid entrance motion ramp.",
      roi: "Record foot-traffic weekend.",
      isDeleted: false,
      deletedAt: null
    },
    {
      id: "media-still-1",
      type: "stills",
      title: "Minimal Timepiece",
      category: "4:5 Feed",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
      desc: "Studio product shot color-graded with deep blacks for the grid.",
      views: "Photo Asset",
      retention: "High Res",
      isDeleted: false,
      deletedAt: null
    },
    {
      id: "media-still-2",
      type: "stills",
      title: "Artisan Burger Set",
      category: "4:5 Feed",
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop",
      desc: "Culinary lighting highlighting macro texture and fresh ingredients.",
      views: "Photo Asset",
      retention: "High Res",
      isDeleted: false,
      deletedAt: null
    }
  ],
  reviews: [
    { id: 1, author: "Rivan Fashion Boutique", project: "Commercial Campaign", rating: 5, quote: "Exceeded 450K organic views.", status: "published", isDeleted: false },
    { id: 2, author: "Burger Makers Gourmet", project: "Culinary Commercial", rating: 5, quote: "Final graded cuts delivered same day.", status: "published", isDeleted: false }
  ],
  settings: {
    studioName: "Ribhi Queder Studio",
    phone: "+962 7 9000 0000",
    email: "ribhi.queder@gmail.com",
    rushFee: 25,
    scriptFee: 15,
    audioFee: 20
  }
};

const AdminApp = {
  currentView: 'dashboard',
  tableScope: 'active',
  packageScope: 'active',
  portfolioTab: 'reels',
  portfolioScope: 'active',
  calViewMonth: 8,
  calViewYear: 2026,

  init() {
    this.ensureSeedData();
    this.setupSidebarNav();
    this.setupGlobalEvents();
    this.switchView('dashboard');
    this.updateNotificationBadge();
  },

  ensureSeedData() {
    if (!localStorage.getItem('rq_bookings')) DB.set('bookings', DEFAULT_SEED_DATA.bookings);
    if (!localStorage.getItem('rq_packages')) DB.set('packages', DEFAULT_SEED_DATA.packages);
    if (!localStorage.getItem('rq_portfolio')) DB.set('portfolio', DEFAULT_SEED_DATA.portfolio);
    if (!localStorage.getItem('rq_reviews')) DB.set('reviews', DEFAULT_SEED_DATA.reviews);
    if (!localStorage.getItem('rq_settings')) DB.set('settings', DEFAULT_SEED_DATA.settings);
  },

  showToast(message, undoAction = null) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    if (undoAction) {
      const undoBtn = document.createElement('button');
      undoBtn.className = 'toast-undo-btn';
      undoBtn.textContent = 'Undo';
      undoBtn.onclick = () => { undoAction(); toast.remove(); };
      toast.appendChild(undoBtn);
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  setupSidebarNav() {
    const nav = document.getElementById('sidebarNav');
    const sections = [
      { key: 'dashboard', label: 'Telemetry', icon: '📊' },
      { key: 'bookings', label: 'Commercial Shoots', icon: '📅' },
      { key: 'packages', label: 'Packages Matrix', icon: '📦' },
      { key: 'portfolio', label: 'Portfolio Assets', icon: '🎬' },
      { key: 'reviews', label: 'Endorsements', icon: '⭐' },
      { key: 'settings', label: 'Studio Settings', icon: '⚙️' }
    ];

    nav.innerHTML = '';
    sections.forEach(s => {
      const btn = document.createElement('button');
      btn.className = `nav-item-btn ${s.key === this.currentView ? 'active' : ''}`;
      btn.innerHTML = `<span class="nav-icon">${s.icon}</span> <span>${s.label}</span>`;
      btn.addEventListener('click', () => this.switchView(s.key));
      nav.appendChild(btn);
    });
  },

  switchView(viewKey) {
    this.currentView = viewKey;
    document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewKey}`);
    if (targetView) targetView.classList.add('active');

    const activeBtn = Array.from(document.querySelectorAll('.nav-item-btn'))
      .find(b => b.textContent.toLowerCase().includes(viewKey.slice(0, 4)));
    if (activeBtn) activeBtn.classList.add('active');

    if (viewKey === 'dashboard') this.renderDashboard();
    if (viewKey === 'bookings') this.renderBookingsView();
    if (viewKey === 'packages') this.renderPackagesView();
    if (viewKey === 'portfolio') this.renderPortfolioView();
    if (viewKey === 'reviews') this.renderReviewsView();
    if (viewKey === 'settings') this.renderSettingsView();
  },

  /* -------------------------------------------------------------
     Dashboard View
     ------------------------------------------------------------- */
  renderDashboard() {
    const bookings = DB.get('bookings').filter(b => !b.isDeleted);
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const totalYield = bookings.reduce((acc, b) => acc + (b.total || 0), 0);

    const kpiTotal = document.getElementById('kpiTotal');
    const kpiPending = document.getElementById('kpiPending');
    const kpiConfirmed = document.getElementById('kpiConfirmed');
    const kpiRevenue = document.getElementById('kpiRevenue');

    if (kpiTotal) kpiTotal.textContent = bookings.length;
    if (kpiPending) kpiPending.textContent = pending;
    if (kpiConfirmed) kpiConfirmed.textContent = confirmed;
    if (kpiRevenue) kpiRevenue.innerHTML = `${totalYield.toLocaleString()} <small>JOD</small>`;

    const timelineList = document.getElementById('dashTimelineList');
    if (timelineList) {
      timelineList.innerHTML = '';
      bookings.slice(0, 4).forEach(b => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
          <div class="tl-info">
            <strong>${b.clientName}</strong>
            <span>${b.date} · ${b.time} · ${(b.packageKey || '').toUpperCase()}</span>
          </div>
          <span class="status-tag ${b.status}">${b.status}</span>
        `;
        timelineList.appendChild(item);
      });
    }

    this.renderChart();
  },

  renderChart() {
    const ctx = document.getElementById('revenueChartCanvas');
    if (!ctx) return;
    if (window.rqChart) window.rqChart.destroy();

    window.rqChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep (Current)'],
        datasets: [{
          label: 'Revenue (JOD)',
          data: [1200, 1850, 2400, 2900, 3400, 4250],
          borderColor: '#06b6d4',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          fill: true,
          tension: 0.35,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
        }
      }
    });
  },

  /* -------------------------------------------------------------
     Bookings System
     ------------------------------------------------------------- */
  renderBookingsView() {
    this.renderCalendarMatrix();
    this.renderBookingsTable();
  },

  renderCalendarMatrix() {
    const matrix = document.getElementById('adminCalMatrix');
    if (!matrix) return;
    const bookings = DB.get('bookings').filter(b => !b.isDeleted);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthTitle = document.getElementById('adminCalMonthYear');
    if (monthTitle) monthTitle.textContent = `${monthNames[this.calViewMonth]} ${this.calViewYear}`;

    matrix.innerHTML = '';
    const totalDays = new Date(this.calViewYear, this.calViewMonth + 1, 0).getDate();
    const firstDayIdx = new Date(this.calViewYear, this.calViewMonth, 1).getDay();

    for (let i = 0; i < firstDayIdx; i++) {
      const blank = document.createElement('div');
      blank.className = 'admin-cal-cell disabled';
      blank.style.opacity = '0.15';
      matrix.appendChild(blank);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${this.calViewYear}-${String(this.calViewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayBookings = bookings.filter(b => b.date === dateStr);

      const cell = document.createElement('div');
      cell.className = 'admin-cal-cell';
      cell.innerHTML = `
        <div class="cal-cell-header">
          <span>${d}</span>
          ${dayBookings.length ? `<span class="badge-mini">${dayBookings.length}</span>` : ''}
        </div>
        <div class="cell-badges-stack">
          ${dayBookings.slice(0, 2).map(b => `<span class="cell-bkg-pill ${b.status}">${b.clientName}</span>`).join('')}
        </div>
      `;

      cell.addEventListener('click', () => this.openDayDrawer(d, dayBookings, dateStr));
      matrix.appendChild(cell);
    }
  },

  openDayDrawer(day, dayBookings, dateStr) {
    const drawer = document.getElementById('dayDrawer');
    const title = document.getElementById('drawerDateTitle');
    const body = document.getElementById('drawerBody');

    if (title) title.textContent = `Production slate: ${dateStr}`;
    if (!body) return;
    body.innerHTML = '';

    if (!dayBookings.length) {
      body.innerHTML = `<p class="text-dim">No commercial production booked for this calendar day.</p>`;
    } else {
      dayBookings.forEach(b => {
        const card = document.createElement('div');
        card.className = 'panel-card';
        card.innerHTML = `
          <div class="panel-header">
            <strong>${b.clientName}</strong>
            <span class="status-tag ${b.status}">${b.status}</span>
          </div>
          <p style="font-size:0.8rem;color:#94a3b8;margin:8px 0;">${b.brief}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
            <strong style="color:#06b6d4;">${b.total} JOD</strong>
            <button class="btn btn-xs btn-main" onclick="AdminApp.openBookingModal('${b.id}')">Inspect</button>
          </div>
        `;
        body.appendChild(card);
      });
    }

    if (drawer) drawer.classList.add('active');
  },

  renderBookingsTable() {
    const tbody = document.getElementById('bookingsTableBody');
    if (!tbody) return;
    const allBookings = DB.get('bookings');
    const searchInput = document.getElementById('bookingSearchInput');
    const query = (searchInput ? searchInput.value : '').toLowerCase();
    const statusSelect = document.getElementById('statusFilterSelect');
    const statusFilter = statusSelect ? statusSelect.value : 'all';

    const trashedCount = allBookings.filter(b => b.isDeleted).length;
    const trashBadge = document.getElementById('trashCountBadge');
    if (trashBadge) trashBadge.textContent = trashedCount;

    tbody.innerHTML = '';

    let filtered = allBookings.filter(b => {
      return this.tableScope === 'trash' ? b.isDeleted : !b.isDeleted;
    });

    filtered = filtered.filter(b => {
      const matchesQuery = (b.clientName || '').toLowerCase().includes(query) ||
                           (b.brief || '').toLowerCase().includes(query) ||
                           (b.phone || '').includes(query);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    const bulkDel = document.getElementById('bulkDeleteBtn');
    const bulkRes = document.getElementById('bulkRestoreBtn');
    if (bulkDel) bulkDel.style.display = this.tableScope === 'trash' ? 'none' : 'inline-block';
    if (bulkRes) bulkRes.style.display = this.tableScope === 'trash' ? 'inline-block' : 'none';

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center" style="padding:40px;color:#64748b;">No bookings found in this view.</td></tr>`;
      return;
    }

    filtered.forEach(b => {
      const tr = document.createElement('tr');
      if (b.isDeleted) tr.classList.add('is-deleted-row');

      tr.innerHTML = `
        <td><input type="checkbox" class="row-checkbox" data-id="${b.id}" /></td>
        <td><small style="color:#64748b;">${b.id}</small></td>
        <td>
          <strong>${b.clientName}</strong>
          <br><small><a href="https://wa.me/${(b.phone || '').replace(/[^0-9]/g, '')}" target="_blank" style="color:#06b6d4;text-decoration:none;">${b.phone} ↗</a></small>
        </td>
        <td><span style="font-weight:600;">${(b.packageKey || '').toUpperCase()}</span></td>
        <td>${b.date}<br><small style="color:#64748b;">${b.time}</small></td>
        <td><span class="status-tag ${b.isDeleted ? 'deleted' : b.status}">${b.isDeleted ? 'TRASHED' : b.status}</span></td>
        <td><span class="badge-mini">${(b.payment || '').toUpperCase()}</span></td>
        <td><strong>${b.total} JOD</strong></td>
        <td class="text-right">
          <div class="action-btns-cell">
            ${b.isDeleted ? `
              <button class="btn btn-xs btn-restore" onclick="AdminApp.restoreBooking('${b.id}')">Restore</button>
              <button class="btn btn-xs btn-danger" onclick="AdminApp.permanentlyDeleteBooking('${b.id}')">Purge</button>
            ` : `
              <button class="btn btn-xs btn-secondary" onclick="AdminApp.openBookingModal('${b.id}')">Edit</button>
              <button class="btn btn-xs btn-danger" onclick="AdminApp.softDeleteBooking('${b.id}')">Delete</button>
            `}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    this.bindRowCheckboxes();
  },

  softDeleteBooking(bookingId) {
    const bookings = DB.get('bookings');
    const b = bookings.find(item => item.id === bookingId);
    if (!b) return;

    b.isDeleted = true;
    b.deletedAt = new Date().toISOString();
    DB.set('bookings', bookings);

    this.renderBookingsView();
    this.renderDashboard();
    this.updateNotificationBadge();

    this.showToast(`Booking ${b.clientName} moved to Trash.`, () => {
      this.restoreBooking(bookingId);
    });
  },

  restoreBooking(bookingId) {
    const bookings = DB.get('bookings');
    const b = bookings.find(item => item.id === bookingId);
    if (!b) return;

    b.isDeleted = false;
    b.deletedAt = null;
    DB.set('bookings', bookings);

    this.renderBookingsView();
    this.renderDashboard();
    this.updateNotificationBadge();
    this.showToast(`Booking ${b.clientName} restored.`);
  },

  permanentlyDeleteBooking(bookingId) {
    if (confirm('Permanently purge this record? This action cannot be reversed.')) {
      let bookings = DB.get('bookings');
      bookings = bookings.filter(b => b.id !== bookingId);
      DB.set('bookings', bookings);
      this.renderBookingsTable();
      this.showToast(`Record permanently deleted from storage.`);
    }
  },

  openBookingModal(bookingId) {
    const bookings = DB.get('bookings');
    const b = bookings.find(item => item.id === bookingId) || {
      id: `BKG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: '',
      phone: '+962 7 ',
      email: '',
      packageKey: 'starter',
      addons: [],
      turnaround: 'standard',
      date: '2026-09-20',
      time: '10:00 AM',
      status: 'pending',
      payment: 'unpaid',
      brief: '',
      notes: '',
      total: 70,
      isDeleted: false,
      deletedAt: null
    };

    const modal = document.getElementById('universalModal');
    const content = document.getElementById('universalModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="modal-head">
        <span class="section-badge">COMMERCIAL FILE: ${b.id}</span>
        <h2 style="margin:4px 0 16px;">${b.clientName ? b.clientName : 'New Commercial Reservation'}</h2>
      </div>

      <form id="bookingEditForm" style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="form-group">
            <label>Client / Brand Name</label>
            <input type="text" id="mClientName" value="${b.clientName}" required />
          </div>
          <div class="form-group">
            <label>WhatsApp Number</label>
            <input type="text" id="mPhone" value="${b.phone}" required />
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;">
          <div class="form-group">
            <label>Package Scope</label>
            <select id="mPackage">
              <option value="starter" ${b.packageKey === 'starter' ? 'selected' : ''}>Starter (70 JOD)</option>
              <option value="growth" ${b.packageKey === 'growth' ? 'selected' : ''}>Growth (120 JOD)</option>
              <option value="halfday" ${b.packageKey === 'halfday' ? 'selected' : ''}>Commercial (220 JOD)</option>
              <option value="monthly" ${b.packageKey === 'monthly' ? 'selected' : ''}>Retainer (450 JOD)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Production Status</label>
            <select id="mStatus">
              <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label>Financial Status</label>
            <select id="mPayment">
              <option value="unpaid" ${b.payment === 'unpaid' ? 'selected' : ''}>Unpaid</option>
              <option value="deposit" ${b.payment === 'deposit' ? 'selected' : ''}>Deposit Paid</option>
              <option value="paid" ${b.payment === 'paid' ? 'selected' : ''}>Paid in Full</option>
            </select>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
          <div class="form-group">
            <label>Filming Date</label>
            <input type="date" id="mDate" value="${b.date}" required />
          </div>
          <div class="form-group">
            <label>Time Slot</label>
            <input type="text" id="mTime" value="${b.time}" required />
          </div>
        </div>

        <div class="form-group">
          <label>Deliverable Strategy Brief</label>
          <textarea id="mBrief" rows="3">${b.brief}</textarea>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;border-top:1px solid var(--border);padding-top:14px;">
          <div>
            ${bookingId ? `
              <button type="button" class="btn btn-danger btn-xs" id="modalSoftDeleteBtn">Move to Trash</button>
            ` : ''}
          </div>
          <div style="display:flex;gap:10px;">
            <a href="https://wa.me/${(b.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${b.clientName}, Ribhi Queder Studio here regarding your booking ${b.id} on${b.date}.`)}" target="_blank" class="btn btn-secondary btn-sm">
              Open WhatsApp ↗
            </a>
            <button type="submit" class="btn btn-main btn-sm">Save Booking File</button>
          </div>
        </div>
      </form>
    `;

    const modalDeleteBtn = document.getElementById('modalSoftDeleteBtn');
    if (modalDeleteBtn) {
      modalDeleteBtn.onclick = () => {
        modal.classList.remove('active');
        this.softDeleteBooking(b.id);
      };
    }

    const bookingForm = document.getElementById('bookingEditForm');
    if (bookingForm) {
      bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        b.clientName = document.getElementById('mClientName').value;
        b.phone = document.getElementById('mPhone').value;
        b.packageKey = document.getElementById('mPackage').value;
        b.status = document.getElementById('mStatus').value;
        b.payment = document.getElementById('mPayment').value;
        b.date = document.getElementById('mDate').value;
        b.time = document.getElementById('mTime').value;
        b.brief = document.getElementById('mBrief').value;

        const idx = bookings.findIndex(item => item.id === b.id);
        if (idx >= 0) bookings[idx] = b;
        else bookings.unshift(b);

        DB.set('bookings', bookings);
        modal.classList.remove('active');
        this.renderBookingsView();
        this.renderDashboard();
        this.updateNotificationBadge();
        this.showToast(`Booking file for ${b.clientName} successfully updated.`);
      });
    }

    modal.classList.add('active');
  },

  bindRowCheckboxes() {
    const selectAll = document.getElementById('selectAllCheckbox');
    const checkboxes = document.querySelectorAll('.row-checkbox');
    const bulkToolbar = document.getElementById('bulkToolbar');
    const selectedCountLabel = document.getElementById('selectedCountLabel');

    const updateToolbar = () => {
      const selected = Array.from(checkboxes).filter(cb => cb.checked);
      if (selected.length > 0) {
        if (bulkToolbar) bulkToolbar.classList.add('active');
        if (selectedCountLabel) selectedCountLabel.textContent = `${selected.length} bookings selected`;
      } else {
        if (bulkToolbar) bulkToolbar.classList.remove('active');
      }
    };

    if (selectAll) {
      selectAll.onchange = (e) => {
        checkboxes.forEach(cb => cb.checked = e.target.checked);
        updateToolbar();
      };
    }

    checkboxes.forEach(cb => cb.onchange = updateToolbar);

    const bulkDel = document.getElementById('bulkDeleteBtn');
    if (bulkDel) {
      bulkDel.onclick = () => {
        const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.dataset.id);
        const bookings = DB.get('bookings');
        bookings.forEach(b => {
          if (selectedIds.includes(b.id)) {
            b.isDeleted = true;
            b.deletedAt = new Date().toISOString();
          }
        });
        DB.set('bookings', bookings);
        this.renderBookingsView();
        this.renderDashboard();
        this.showToast(`${selectedIds.length} bookings moved to Trash.`);
      };
    }

    const bulkRes = document.getElementById('bulkRestoreBtn');
    if (bulkRes) {
      bulkRes.onclick = () => {
        const selectedIds = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.dataset.id);
        const bookings = DB.get('bookings');
        bookings.forEach(b => {
          if (selectedIds.includes(b.id)) {
            b.isDeleted = false;
            b.deletedAt = null;
          }
        });
        DB.set('bookings', bookings);
        this.renderBookingsView();
        this.renderDashboard();
        this.showToast(`${selectedIds.length} bookings restored.`);
      };
    }
  },

  /* -------------------------------------------------------------
     Packages Management Engine
     ------------------------------------------------------------- */
  renderPackagesView() {
    const container = document.getElementById('packagesAdminGrid');
    if (!container) return;
    const packages = DB.get('packages');
    container.innerHTML = '';

    const trashedCount = Object.values(packages).filter(p => p.isDeleted).length;
    const badge = document.getElementById('pkgTrashCountBadge');
    if (badge) badge.textContent = trashedCount;

    const filteredEntries = Object.entries(packages).filter(([key, pkg]) => {
      return this.packageScope === 'trash' ? pkg.isDeleted : !pkg.isDeleted;
    });

    if (!filteredEntries.length) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #64748b;">No packages found in this view.</div>`;
      return;
    }

    filteredEntries.forEach(([key, pkg]) => {
      const card = document.createElement('div');
      card.className = `package-admin-card ${pkg.isDeleted ? 'is-deleted-pkg' : ''}`;
      const deliverablesHtml = (pkg.deliverables || [pkg.desc]).map(d => `<li><i>✓</i> <span>${d}</span></li>`).join('');

      card.innerHTML = `
        <div>
          <div class="panel-header">
            <span class="section-badge">${key.toUpperCase()}</span>
            <strong style="color:#06b6d4; font-size:1.3rem;">${pkg.price} JOD</strong>
          </div>
          <h3 style="margin: 4px 0 8px; font-size: 1.15rem;">${pkg.name}</h3>
          <p style="color:#94a3b8; font-size:0.82rem; line-height: 1.4;">${pkg.desc || ''}</p>
          <ul class="pkg-deliverables-list">${deliverablesHtml}</ul>
        </div>
        <div class="pkg-card-actions">
          ${pkg.isDeleted ? `
            <button class="btn btn-xs btn-restore" onclick="AdminApp.restorePackage('${key}')">Restore</button>
            <button class="btn btn-xs btn-danger" onclick="AdminApp.permanentlyDeletePackage('${key}')">Purge</button>
          ` : `
            <button class="btn btn-xs btn-secondary" onclick="AdminApp.openPackageModal('${key}')">Edit</button>
            <button class="btn btn-xs btn-danger" onclick="AdminApp.softDeletePackage('${key}')">Delete</button>
          `}
        </div>
      `;
      container.appendChild(card);
    });
  },

  softDeletePackage(key) {
    const packages = DB.get('packages');
    if (!packages[key]) return;
    packages[key].isDeleted = true;
    packages[key].deletedAt = new Date().toISOString();
    DB.set('packages', packages);
    this.renderPackagesView();
    this.showToast(`Package "${packages[key].name}" moved to trash.`, () => this.restorePackage(key));
  },

  restorePackage(key) {
    const packages = DB.get('packages');
    if (!packages[key]) return;
    packages[key].isDeleted = false;
    packages[key].deletedAt = null;
    DB.set('packages', packages);
    this.renderPackagesView();
    this.showToast(`Package "${packages[key].name}" restored.`);
  },

  permanentlyDeletePackage(key) {
    if (confirm(`Permanently delete package "${key}"?`)) {
      const packages = DB.get('packages');
      delete packages[key];
      DB.set('packages', packages);
      this.renderPackagesView();
      this.showToast(`Package permanently purged.`);
    }
  },

  openPackageModal(key = null) {
    const packages = DB.get('packages');
    const isEdit = key && packages[key];
    const pkg = isEdit ? packages[key] : { name: '', price: 100, desc: '', deliverables: [], active: true, isDeleted: false };

    const modal = document.getElementById('universalModal');
    const content = document.getElementById('universalModalContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="modal-head">
        <span class="section-badge">${isEdit ? 'EDIT: ' + key.toUpperCase() : 'NEW PACKAGE'}</span>
        <h2 style="margin: 4px 0 16px;">${isEdit ? pkg.name : 'Create Production Package'}</h2>
      </div>
      <form id="packageEditForm" style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label>Key</label>
            <input type="text" id="pkgKey" value="${key || ''}" ${isEdit ? 'readonly style="opacity:0.6;"' : ''} placeholder="e.g. starter" required />
          </div>
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="pkgName" value="${pkg.name}" placeholder="e.g. Growth Pack" required />
          </div>
        </div>
        <div class="form-group">
          <label>Price (JOD)</label>
          <input type="number" id="pkgPrice" value="${pkg.price}" required />
        </div>
        <div class="form-group">
          <label>Deliverables (one per line)</label>
          <textarea id="pkgDeliverables" rows="4">${(pkg.deliverables || []).join('\n')}</textarea>
        </div>
        <div style="display:flex; justify-content: flex-end; gap:10px; margin-top:14px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('universalModal').classList.remove('active')">Cancel</button>
          <button type="submit" class="btn btn-main btn-sm">Save Package</button>
        </div>
      </form>
    `;

    document.getElementById('packageEditForm').onsubmit = (e) => {
      e.preventDefault();
      const targetKey = document.getElementById('pkgKey').value.trim().toLowerCase();
      packages[targetKey] = {
        name: document.getElementById('pkgName').value.trim(),
        price: parseFloat(document.getElementById('pkgPrice').value) || 0,
        deliverables: document.getElementById('pkgDeliverables').value.split('\n').map(s => s.trim()).filter(Boolean),
        active: true,
        isDeleted: isEdit ? pkg.isDeleted : false
      };
      DB.set('packages', packages);
      modal.classList.remove('active');
      this.renderPackagesView();
      this.showToast('Package saved.');
    };

    modal.classList.add('active');
  },

  /* -------------------------------------------------------------
     Portfolio Media Management Engine (Reels & Stills + File Uploads)
     ------------------------------------------------------------- */
  renderPortfolioView() {
    const container = document.getElementById('portfolioAdminGrid');
    if (!container) return;
    const media = DB.get('portfolio', []);
    container.innerHTML = '';

    const trashedCount = media.filter(m => m.isDeleted).length;
    const badge = document.getElementById('portTrashCountBadge');
    if (badge) badge.textContent = trashedCount;

    const filtered = media.filter(m => {
      const matchType = m.type === this.portfolioTab;
      const matchScope = this.portfolioScope === 'trash' ? m.isDeleted : !m.isDeleted;
      return matchType && matchScope;
    });

    if (!filtered.length) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 40px; text-align: center; color: #64748b;">
        No ${this.portfolioTab} found in this view.
      </div>`;
      return;
    }

    filtered.forEach(m => {
      const card = document.createElement('div');
      card.className = `port-item-card ${m.type === 'stills' ? 'is-still' : ''} ${m.isDeleted ? 'is-deleted-media' : ''}`;

      card.innerHTML = `
        <div>
          <div class="port-preview-wrap">
            <span class="port-badge-tag">${m.category || m.type.toUpperCase()}</span>
            ${m.type === 'reels' ? `
              <video src="${m.url}" muted loop playsinline onmouseover="this.play()" onmouseout="this.pause()"></video>
            ` : `
              <img src="${m.url}" alt="${m.title}" loading="lazy" />
            `}
          </div>

          <div class="port-item-details">
            <h4>${m.title}</h4>
            <p>${m.desc || ''}</p>
            <div class="port-metrics-strip">
              <span>👁 ${m.views || 'Asset'}</span>
              <span>📈 ${m.retention || 'Ready'}</span>
            </div>
          </div>
        </div>

        <div class="port-card-actions">
          ${m.isDeleted ? `
            <button class="btn btn-xs btn-restore" onclick="AdminApp.restorePortfolioMedia('${m.id}')">Restore</button>
            <button class="btn btn-xs btn-danger" onclick="AdminApp.permanentlyDeletePortfolioMedia('${m.id}')">Purge</button>
          ` : `
            <button class="btn btn-xs btn-secondary" onclick="AdminApp.openPortfolioModal('${m.id}')">Edit</button>
            <button class="btn btn-xs btn-danger" onclick="AdminApp.softDeletePortfolioMedia('${m.id}')">Delete</button>
          `}
        </div>
      `;
      container.appendChild(card);
    });
  },

  softDeletePortfolioMedia(id) {
    const media = DB.get('portfolio', []);
    const item = media.find(m => m.id === id);
    if (!item) return;

    item.isDeleted = true;
    item.deletedAt = new Date().toISOString();
    DB.set('portfolio', media);
    this.renderPortfolioView();
    this.showToast(`Asset "${item.title}" moved to trash.`, () => this.restorePortfolioMedia(id));
  },

  restorePortfolioMedia(id) {
    const media = DB.get('portfolio', []);
    const item = media.find(m => m.id === id);
    if (!item) return;

    item.isDeleted = false;
    item.deletedAt = null;
    DB.set('portfolio', media);
    this.renderPortfolioView();
    this.showToast(`Asset "${item.title}" restored.`);
  },

  permanentlyDeletePortfolioMedia(id) {
    if (confirm("Permanently delete this media asset?")) {
      let media = DB.get('portfolio', []);
      media = media.filter(m => m.id !== id);
      DB.set('portfolio', media);
      this.renderPortfolioView();
      this.showToast(`Asset permanently purged.`);
    }
  },

  openPortfolioModal(id = null) {
    const media = DB.get('portfolio', []);
    const isEdit = id && media.find(m => m.id === id);
    const item = isEdit || {
      id: `media-${Date.now()}`,
      type: this.portfolioTab,
      title: '',
      category: this.portfolioTab === 'reels' ? 'Macro Demo' : '4:5 Feed',
      url: '',
      desc: '',
      views: this.portfolioTab === 'reels' ? '180K Organic' : 'Photo Asset',
      retention: this.portfolioTab === 'reels' ? '85% 3s Hold' : 'High Res',
      gear: 'Sony FX3 Cinema Line',
      software: 'DaVinci Resolve Studio',
      objective: 'High-retention commercial cut.',
      hook: 'Pattern interrupt.',
      roi: 'Organic view acceleration.',
      isDeleted: false
    };

    const modal = document.getElementById('universalModal');
    const content = document.getElementById('universalModalContent');
    if (!modal || !content) return;

    let currentUploadMode = item.url.startsWith('data:') ? 'upload' : 'url';

    content.innerHTML = `
      <div class="modal-head">
        <span class="section-badge">${isEdit ? 'EDIT MEDIA ASSET' : 'NEW PORTFOLIO ASSET'}</span>
        <h2 style="margin:4px 0 16px;">${isEdit ? item.title : 'Add to Portfolio Inventory'}</h2>
      </div>

      <form id="portfolioEditForm" style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label>Asset Type</label>
            <select id="pType">
              <option value="reels" ${item.type === 'reels' ? 'selected' : ''}>Vertical Reel (9:16 Video)</option>
              <option value="stills" ${item.type === 'stills' ? 'selected' : ''}>Editorial Still (Photo 4:5 / 1:1)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Asset Title</label>
            <input type="text" id="pTitle" value="${item.title}" placeholder="e.g. Minimal Timepiece / Shelf Pick-up" required />
          </div>
        </div>

        <!-- Mode Toggle: File Upload vs Direct URL -->
        <div class="form-group">
          <label>Media Asset Source</label>
          <div class="upload-mode-toggle">
            <button type="button" class="upload-mode-btn ${currentUploadMode === 'upload' ? 'active' : ''}" id="modeUploadBtn">📁 Upload File from Device</button>
            <button type="button" class="upload-mode-btn ${currentUploadMode === 'url' ? 'active' : ''}" id="modeUrlBtn">🔗 Direct Video / CDN URL</button>
          </div>

          <!-- Direct URL Input -->
          <div id="urlInputContainer" style="${currentUploadMode === 'url' ? 'display:block;' : 'display:none;'}">
            <input type="url" id="pUrlInput" value="${item.url.startsWith('data:') ? '' : item.url}" placeholder="https://domain.com/video.mp4 or photo.jpg" />
          </div>

          <!-- File Upload Dropzone -->
          <div id="dropzoneContainer" style="${currentUploadMode === 'upload' ? 'display:block;' : 'display:none;'}">
            <div class="file-dropzone" id="portDropzone">
              <span class="dropzone-icon">☁️</span>
              <span class="dropzone-label">Click or Drag &amp; Drop video/photo here</span>
              <span class="dropzone-sub">Supported formats: MP4, WebM, JPG, PNG, WebP (under 5MB recommended)</span>
              <input type="file" id="portFileInput" class="file-hidden-input" accept="video/mp4,video/webm,image/jpeg,image/png,image/webp" />
            </div>
          </div>

          <!-- Hidden storage for final Media URL / Base64 -->
          <input type="hidden" id="pFinalUrl" value="${item.url}" />

          <!-- Live Preview Box inside Modal -->
          <div class="modal-media-preview-box" id="modalMediaPreviewBox" style="${item.url ? 'display:flex;' : 'display:none;'}">
            ${item.url ? (item.type === 'reels' ? `<video src="${item.url}" controls muted></video>` : `<img src="${item.url}" />`) : ''}
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label>Category Tag</label>
            <input type="text" id="pCategory" value="${item.category || ''}" placeholder="e.g. Macro Demo / 4:5 Feed" />
          </div>
          <div class="form-group">
            <label>Views / Ratio Label</label>
            <input type="text" id="pViews" value="${item.views || ''}" placeholder="e.g. 180K / 4:5 Feed" />
          </div>
          <div class="form-group">
            <label>Retention / Quality Label</label>
            <input type="text" id="pRetention" value="${item.retention || ''}" placeholder="e.g. 86% / Ultra-HD" />
          </div>
        </div>

        <div class="form-group">
          <label>Campaign / Creative Description</label>
          <textarea id="pDesc" rows="2" placeholder="Brief outline of the video hook or lighting approach...">${item.desc || ''}</textarea>
        </div>

        <!-- Optional Deep Dive Case Study Details (for Reels) -->
        <details style="border: 1px solid var(--border); border-radius: 12px; padding: 12px; background: rgba(255,255,255,0.01);">
          <summary style="cursor:pointer; font-size:0.85rem; font-weight:700; color:var(--accent-cyan);">+ Advanced Case Study Presentation Data</summary>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px;">
            <div class="form-group">
              <label>Camera Setup</label>
              <input type="text" id="pGear" value="${item.gear || 'Sony FX3 Cinema Line'}" />
            </div>
            <div class="form-group">
              <label>Post Software Pipeline</label>
              <input type="text" id="pSoftware" value="${item.software || 'DaVinci Resolve Studio'}" />
            </div>
            <div class="form-group">
              <label>2-Second Hook Strategy</label>
              <input type="text" id="pHook" value="${item.hook || 'Pattern interrupt.'}" />
            </div>
            <div class="form-group">
              <label>Commercial ROI / Impact</label>
              <input type="text" id="pRoi" value="${item.roi || '+38% conversion surge.'}" />
            </div>
          </div>
        </details>

        <div style="display:flex; justify-content: flex-end; gap:10px; margin-top:14px; border-top:1px solid var(--border); padding-top:14px;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="document.getElementById('universalModal').classList.remove('active')">Cancel</button>
          <button type="submit" class="btn btn-main btn-sm">${isEdit ? 'Save Changes' : 'Publish to Inventory'}</button>
        </div>
      </form>
    `;

    // Mode Switching Logic
    const modeUploadBtn = document.getElementById('modeUploadBtn');
    const modeUrlBtn = document.getElementById('modeUrlBtn');
    const urlContainer = document.getElementById('urlInputContainer');
    const dropzoneContainer = document.getElementById('dropzoneContainer');
    const finalUrlInput = document.getElementById('pFinalUrl');
    const urlInput = document.getElementById('pUrlInput');
    const fileInput = document.getElementById('portFileInput');
    const previewBox = document.getElementById('modalMediaPreviewBox');
    const pTypeSelect = document.getElementById('pType');

    const updatePreview = (url, isVideo) => {
      finalUrlInput.value = url;
      previewBox.style.display = 'flex';
      previewBox.innerHTML = isVideo ? `<video src="${url}" controls muted autoplay style="max-height:220px;"></video>` : `<img src="${url}" style="max-height:220px;" />`;
    };

    modeUploadBtn.onclick = () => {
      modeUploadBtn.classList.add('active');
      modeUrlBtn.classList.remove('active');
      dropzoneContainer.style.display = 'block';
      urlContainer.style.display = 'none';
    };

    modeUrlBtn.onclick = () => {
      modeUrlBtn.classList.add('active');
      modeUploadBtn.classList.remove('active');
      urlContainer.style.display = 'block';
      dropzoneContainer.style.display = 'none';
    };

    urlInput.oninput = () => {
      const url = urlInput.value.trim();
      if (url) updatePreview(url, pTypeSelect.value === 'reels');
    };

    // File Upload Handler (FileReader -> Base64)
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const isVideo = file.type.startsWith('video');
      pTypeSelect.value = isVideo ? 'reels' : 'stills';

      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target.result;
        updatePreview(resultUrl, isVideo);
      };
      reader.readAsDataURL(file);
    };

    document.getElementById('portfolioEditForm').onsubmit = (e) => {
      e.preventDefault();
      const finalUrl = finalUrlInput.value.trim() || urlInput.value.trim();

      if (!finalUrl) {
        alert('Please provide a video/photo URL or upload a file from your device.');
        return;
      }

      item.type = pTypeSelect.value;
      item.title = document.getElementById('pTitle').value.trim();
      item.url = finalUrl;
      item.category = document.getElementById('pCategory').value.trim();
      item.views = document.getElementById('pViews').value.trim();
      item.retention = document.getElementById('pRetention').value.trim();
      item.desc = document.getElementById('pDesc').value.trim();
      item.gear = document.getElementById('pGear').value.trim();
      item.software = document.getElementById('pSoftware').value.trim();
      item.hook = document.getElementById('pHook').value.trim();
      item.roi = document.getElementById('pRoi').value.trim();

      const idx = media.findIndex(m => m.id === item.id);
      if (idx >= 0) media[idx] = item;
      else media.unshift(item);

      DB.set('portfolio', media);
      modal.classList.remove('active');
      this.portfolioTab = item.type;
      this.renderPortfolioView();
      this.showToast(`Asset "${item.title}" successfully added to inventory.`);
    };

    modal.classList.add('active');
  },

  /* -------------------------------------------------------------
     Reviews View
     ------------------------------------------------------------- */
  renderReviewsView() {
    const tbody = document.getElementById('reviewsAdminTableBody');
    if (!tbody) return;
    const reviews = DB.get('reviews').filter(r => !r.isDeleted);
    tbody.innerHTML = '';

    reviews.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.author}</strong></td>
        <td>${r.project}</td>
        <td style="color:#facc15;">★ ${r.rating}.0</td>
        <td><small>"${r.quote}"</small></td>
        <td><span class="status-tag ${r.status === 'published' ? 'confirmed' : 'pending'}">${r.status}</span></td>
        <td class="text-right">
          <button class="btn btn-xs btn-danger" onclick="AdminApp.softDeleteReview(${r.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  },

  softDeleteReview(id) {
    const reviews = DB.get('reviews');
    const r = reviews.find(item => item.id === id);
    if (r) {
      r.isDeleted = true;
      DB.set('reviews', reviews);
      this.renderReviewsView();
      this.showToast(`Review from ${r.author} moved to trash.`);
    }
  },

  /* -------------------------------------------------------------
     Settings View
     ------------------------------------------------------------- */
  renderSettingsView() {
    const s = DB.get('settings');
    const nameEl = document.getElementById('settingStudioName');
    const phoneEl = document.getElementById('settingPhone');
    const emailEl = document.getElementById('settingEmail');
    if (nameEl) nameEl.value = s.studioName || '';
    if (phoneEl) phoneEl.value = s.phone || '';
    if (emailEl) emailEl.value = s.email || '';
  },

  updateNotificationBadge() {
    const bookings = DB.get('bookings').filter(b => !b.isDeleted);
    const pending = bookings.filter(b => b.status === 'pending');
    const notifCount = document.getElementById('notifCount');
    const notifBadge = document.getElementById('notifPendingBadge');

    if (notifCount) notifCount.textContent = pending.length;
    if (notifBadge) notifBadge.textContent = `${pending.length} New`;

    const list = document.getElementById('notifList');
    if (!list) return;
    list.innerHTML = '';
    pending.forEach(b => {
      const item = document.createElement('div');
      item.className = 'notif-item';
      item.innerHTML = `<strong>${b.clientName}</strong> requested ${(b.packageKey || '').toUpperCase()} for ${b.date}`;
      item.addEventListener('click', () => {
        const dd = document.getElementById('notifDropdown');
        if (dd) dd.classList.remove('active');
        this.openBookingModal(b.id);
      });
      list.appendChild(item);
    });
  },

  /* -------------------------------------------------------------
     Global Event Listeners
     ------------------------------------------------------------- */
  setupGlobalEvents() {
    // Media Tabs (Reels vs Stills)
    document.querySelectorAll('.type-tab-btn').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.type-tab-btn').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.portfolioTab = tab.dataset.type;
        this.renderPortfolioView();
      };
    });

    // Media Scope Tabs (Active vs Trash)
    document.querySelectorAll('.port-scope-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.port-scope-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.portfolioScope = tab.dataset.portScope;
        this.renderPortfolioView();
      };
    });

    // Package Scope Tabs
    document.querySelectorAll('.pkg-scope-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.pkg-scope-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.packageScope = tab.dataset.pkgScope;
        this.renderPackagesView();
      };
    });

    // Bookings Scope Tabs
    document.querySelectorAll('.scope-tab:not(.pkg-scope-tab):not(.port-scope-tab)').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.scope-tab:not(.pkg-scope-tab):not(.port-scope-tab)').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.tableScope = tab.dataset.scope;
        this.renderBookingsTable();
      };
    });

    const addPkgBtn = document.getElementById('addNewPackageBtn');
    if (addPkgBtn) addPkgBtn.onclick = () => this.openPackageModal();

    const addPortBtn = document.getElementById('addNewPortfolioBtn');
    if (addPortBtn) addPortBtn.onclick = () => this.openPortfolioModal();

    const createBkgBtn = document.getElementById('createBookingBtn');
    if (createBkgBtn) createBkgBtn.onclick = () => this.openBookingModal();

    const topbarBkgBtn = document.getElementById('topbarNewBookingBtn');
    if (topbarBkgBtn) topbarBkgBtn.onclick = () => this.openBookingModal();

    const closeUModal = document.getElementById('closeUniversalModalBtn');
    if (closeUModal) closeUModal.onclick = () => document.getElementById('universalModal').classList.remove('active');

    const closeDrawer = document.getElementById('closeDayDrawerBtn');
    if (closeDrawer) closeDrawer.onclick = () => document.getElementById('dayDrawer').classList.remove('active');

    const notifBell = document.getElementById('notifBellBtn');
    if (notifBell) notifBell.onclick = () => document.getElementById('notifDropdown').classList.toggle('active');

    const sidebarToggle = document.getElementById('sidebarToggleBtn');
    if (sidebarToggle) sidebarToggle.onclick = () => document.getElementById('adminSidebar').classList.toggle('open');

    const searchInput = document.getElementById('bookingSearchInput');
    if (searchInput) searchInput.oninput = () => this.renderBookingsTable();

    const statusSelect = document.getElementById('statusFilterSelect');
    if (statusSelect) statusSelect.onchange = () => this.renderBookingsTable();

    // Export CSV
    const exportCsv = document.getElementById('exportCsvBtn');
    if (exportCsv) {
      exportCsv.onclick = () => {
        const bookings = DB.get('bookings').filter(b => !b.isDeleted);
        const csv = "ID,Client,Phone,Package,Date,Time,Status,Total\n" +
          bookings.map(b => `"${b.id}","${b.clientName}","${b.phone}","${b.packageKey}","${b.date}","${b.time}","${b.status}","${b.total}"`).join("\n");
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `ribhi_bookings_${new Date().toISOString().slice(0,10)}.csv`);
        a.click();
      };
    }

    // Save Settings
    const saveSettings = document.getElementById('saveSettingsBtn');
    if (saveSettings) {
      saveSettings.onclick = () => {
        const s = DB.get('settings');
        s.studioName = document.getElementById('settingStudioName').value;
        s.phone = document.getElementById('settingPhone').value;
        s.email = document.getElementById('settingEmail').value;
        s.rushFee = parseFloat(document.getElementById('settingRushFee').value) || 25;
        s.scriptFee = parseFloat(document.getElementById('settingScriptFee').value) || 15;
        s.audioFee = parseFloat(document.getElementById('settingAudioFee').value) || 20;
        DB.set('settings', s);
        this.showToast('Studio parameters saved.');
      };
    }

    // Reset Seed
    const resetBtn = document.getElementById('resetSeedDataBtn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Reset all studio records back to initial seed data?')) {
          localStorage.clear();
          this.ensureSeedData();
          this.switchView('dashboard');
          this.showToast('Database reset to defaults.');
        }
      };
    }
  }
};

document.addEventListener('DOMContentLoaded', () => AdminApp.init());