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
    { ico: "⏰", title: "Early Opening", desc: "Doors open from 5:30 am — train before work or school." },
  ];

  // Hours provided by the gym owner (Jul 2026).
  // Sunday verified; Mon = evening continuous; Tue–Sat = morning + evening split.
  const HOURS = [
    { day: "Sunday",    time: "5:30 am – 12:00 pm", verified: true },
    { day: "Monday",    time: "5:30 am – 12:00 pm", verified: true },
    { day: "Tuesday",   time: "5:30–12:00 pm · 5:30–9:00 pm", verified: true },
    { day: "Wednesday", time: "5:30–12:00 pm · 5:30–9:00 pm", verified: true },
    { day: "Thursday",  time: "5:30–12:00 pm · 5:30–9:00 pm", verified: true },
    { day: "Friday",    time: "5:30–12:00 pm · 5:30–9:00 pm", verified: true },
    { day: "Saturday",  time: "5:30–12:00 pm · 5:30–9:00 pm", verified: true },
  ];

  const PLANS = [
    { name: "Daily / Pay-per-visit", price: "Ask at desk", unit: "per visit", feats: ["No commitment", "Walk in & train", "Use all open floor"], featured: false },
    { name: "Monthly", price: "From ₹—", unit: "/ month", feats: ["Unlimited visits", "Early-morning access", "All facilities"], featured: true },
    { name: "Quarterly / Annual", price: "Best value", unit: "long-term", feats: ["Lower effective rate", "Bring a friend option", "Priority desk support"], featured: false },
  ];

  const GALLERY = [
    { src: "assets/photos/ig_6.jpg", caption: "Inside the gym" },
    { src: "assets/photos/ig_9.jpg", caption: "Personal training" },
    { src: "assets/photos/ig_10.jpg", caption: "Back day" },
    { src: "assets/photos/ig_7.jpg", caption: "Our athlete" },
    { src: "assets/photos/ig_11.jpg", caption: "−16 kg in 100 days" },
    { src: "assets/photos/ig_2.jpg", caption: "Cardio vs Strength" },
    { src: "assets/photos/ig_5.jpg", caption: "Fuel: Greek Yogurt" },
    { src: "assets/photos/ig_8.jpg", caption: "Eid Mubarak" },
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

  /* ---------- Render: gallery (real photos + lightbox) ---------- */
  function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    if (!grid) return;
    grid.innerHTML = GALLERY.map((g, i) => `
      <div class="gallery-item reveal" data-idx="${i}" role="button" tabindex="0" aria-label="Enlarge ${g.caption}">
        <img src="${g.src}" alt="${g.caption}" loading="lazy" />
        <span class="gallery-cap">${g.caption}</span>
      </div>`).join("");
    grid.querySelectorAll(".gallery-item").forEach(el => {
      const open = () => openLightbox(parseInt(el.dataset.idx, 10));
      el.addEventListener("click", open);
      el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
    });
  }

  function openLightbox(idx) {
    let lb = document.getElementById("lightbox");
    if (!lb) {
      lb = document.createElement("div");
      lb.id = "lightbox";
      lb.className = "lightbox";
      lb.innerHTML = `<button class="lb-close" aria-label="Close">✕</button><img alt="" /><span class="lb-cap"></span>`;
      document.body.appendChild(lb);
      lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lb-close")) closeLightbox(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
    }
    const g = GALLERY[idx];
    lb.querySelector("img").src = g.src;
    lb.querySelector("img").alt = g.caption;
    lb.querySelector(".lb-cap").textContent = g.caption;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.classList.remove("open");
    document.body.style.overflow = "";
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
