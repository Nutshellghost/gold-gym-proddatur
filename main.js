/* ============================================================
   Gold Gym Proddatur — main.js
   No build step. All data is local + clearly placeholder
   where it needs owner confirmation.
   ============================================================ */
(function () {
  "use strict";

  // Add .js class so CSS reveals only apply when JS works
  document.documentElement.classList.add("js");

  /* ---------- Data (local, editable) ---------- */
  const SERVICES = [
    { ico: "🏋️", title: "Strength Floor", desc: "Free weights, racks and machines for compound and isolation work." },
    { ico: "🏃️", title: "Cardio Zone", desc: "Treadmills, bike and cross-trainer for warm-ups and fat-loss." },
    { ico: "🧘", title: "Flexibility & Mobility", desc: "Open space for stretching, mobility and cool-downs." },
    { ico: "📋", title: "Personal Coaching", desc: "Form checks and tailored plans — ask at the desk for availability." },
    { ico: "🚿", title: "Locker & Change Room", desc: "Basic changing area so you can train and go." },
    { ico: "�05:30", title: "Early Opening", desc: "Doors open from 5:30 am — train before work or school." },
  ];

  // Weekday timings are a TYPICAL gym schedule (per Maps note).
  // Sunday (0) is the only VERIFIED day from Google Maps.
  const HOURS = [
    { day: "Sunday",    time: "5:30 am – 12:00 pm", verified: true },
    { day: "Monday",    time: "5:30 am – 9:00 pm",  verified: false },
    { day: "Tuesday",   time: "5:30 am – 9:00 pm",  verified: false },
    { day: "Wednesday", time: "5:30 am – 9:00 pm",  verified: false },
    { day: "Thursday",  time: "5:30 am – 9:00 pm",  verified: false },
    { day: "Friday",    time: "5:30 am – 9:00 pm",  verified: false },
    { day: "Saturday",  time: "6:00 am – 8:00 pm",  verified: false },
  ];

  const PLANS = [
    { name: "Daily / Pay-per-visit", price: "Ask at desk", unit: "per visit", feats: ["No commitment", "Walk in & train", "Use all open floor"], featured: false },
    { name: "Monthly", price: "From ₹—", unit: "/ month", feats: ["Unlimited visits", "Early-morning access", "All facilities"], featured: true },
    { name: "Quarterly / Annual", price: "Best value", unit: "long-term", feats: ["Lower effective rate", "Bring a friend option", "Priority desk support"], featured: false },
  ];

  const GALLERY = [
    "Gym floor", "Strength area", "Cardio zone", "Reception / desk",
    "Changing room", "Group corner",
  ];

  /* ---------- Render: services ---------- */
  function renderServices() {
    const grid = document.getElementById("servicesGrid");
    if (!grid) return;
    grid.innerHTML = SERVICES.map(s => `
      <div class="card reveal">
        <div class="card-ico">${s.ico}</div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </div>`).join("");
  }

  /* ---------- Render: hours ---------- */
  function renderHours() {
    const t = document.getElementById("hoursTable");
    if (!t) return;
    const todayIdx = (new Date().getDay() + 6) % 7; // Mon=0 … Sun=6
    t.innerHTML = HOURS.map((h, i) => {
      const cls = i === todayIdx ? ' class="is-today"' : "";
      const mark = h.verified ? "" : ' <span style="color:var(--muted);font-size:.72rem">(typical)</span>';
      return `<tr${cls}><td>${h.day}</td><td>${h.time}${mark}</td></tr>`;
    }).join("");
  }

  /* ---------- Render: plans ---------- */
  function renderPlans() {
    const grid = document.getElementById("plansGrid");
    if (!grid) return;
    grid.innerHTML = PLANS.map(p => `
      <div class="card plan reveal${p.featured ? " featured" : ""}">
        <h3>${p.name}</h3>
        <div class="plan-price">${p.price} <small>${p.unit}</small></div>
        <ul class="plan-feats">
          ${p.feats.map(f => `<li>${f}</li>`).join("")}
        </ul>
      </div>`).join("");
  }

  /* ---------- Render: gallery (placeholders) ---------- */
  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = GALLERY.map(label => `
      <div class="gallery-item reveal" data-label="${label}">
        <span class="ph-icon">📷</span>
        <span class="ph-text">${label}</span>
      </div>`).join("");
  }

  /* ---------- Mobile nav toggle ---------- */
  function initNav() {
    const btn = document.getElementById("navToggle");
    const links = document.querySelector(".nav-links");
    if (!btn || !links) return;
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        links.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !items.length) {
      items.forEach(el => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  /* ---------- Enquiry form (localStorage demo) ---------- */
  function initForm() {
    const form = document.getElementById("enquiryForm");
    const status = document.getElementById("formStatus");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("fName").value.trim();
      const phone = document.getElementById("fPhone").value.trim();
      const msg = document.getElementById("fMsg").value.trim();
      if (!name || !phone) {
        status.textContent = "Please add your name and phone.";
        status.className = "form-status err";
        return;
      }
      try {
        const key = "goldgym_enquiries";
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        list.push({ name, phone, msg, at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
        status.textContent = "Thanks! Saved on this device (demo). The team will reach out.";
        status.className = "form-status ok";
        form.reset();
      } catch (err) {
        status.textContent = "Couldn't save locally — please call 091215 18822.";
        status.className = "form-status err";
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    renderServices();
    renderHours();
    renderPlans();
    renderGallery();
    initNav();
    initReveal();
    initForm();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
