/* Portfolio interactions (no frameworks, no build step).
   - Mobile menu toggle
   - Section reveal animations
   - Skill meters animation
   - Back-to-top button
   - Contact form mailto + WhatsApp prefill
*/

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  const year = new Date().getFullYear();
  const el = $("#year");
  if (el) el.textContent = String(year);
}

function initTopbarElevation() {
  const topbar = $(".topbar");
  if (!topbar) return;

  const onScroll = () => {
    topbar.dataset.elevate = window.scrollY > 10 ? "true" : "false";
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileNav() {
  const toggle = $(".nav-toggle");
  const links = $("#navLinks");
  if (!toggle || !links) return;

  const close = () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu on link click (mobile).
  links.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    close();
  });

  // Close menu when clicking outside.
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav")) return;
    close();
  });

  // Close on escape.
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    close();
  });
}

function initReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  els.forEach((el) => obs.observe(el));
}

function initMeters() {
  const meters = $$(".meter");
  if (!meters.length) return;

  const animate = (meter) => {
    const level = Number(meter.dataset.level || "0");
    const bar = $("span", meter);
    if (!bar) return;
    const safe = Math.max(0, Math.min(100, level));
    bar.style.width = `${safe}%`;
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  meters.forEach((m) => obs.observe(m));
}

function initToTop() {
  const btn = $(".to-top");
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle("show", window.scrollY > 600);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initContactForm() {
  const form = $("#contactForm");
  const wa = $("#whatsAppBtn");
  if (!form) return;

  const phoneDigits = "250790102555";
  const email = "niyirindaelise@gmail.com";

  const buildMessage = (name, fromEmail, message) => {
    const lines = [
      "Hello Elise,",
      "",
      message.trim(),
      "",
      `— ${name.trim()} (${fromEmail.trim()})`
    ];
    return lines.join("\n");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);

    const name = String(data.get("name") || "");
    const fromEmail = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const body = buildMessage(name, fromEmail, message);

    const subject = encodeURIComponent("Portfolio Inquiry — Niyirinda Elise");
    const encodedBody = encodeURIComponent(body);

    window.location.href = `mailto:${email}?subject=${subject}&body=${encodedBody}`;
  });

  if (wa) {
    form.addEventListener("input", () => {
      const data = new FormData(form);
      const name = String(data.get("name") || "");
      const fromEmail = String(data.get("email") || "");
      const message = String(data.get("message") || "");

      const body = buildMessage(name || "Your Name", fromEmail || "your@email.com", message || "I’d like to connect.");
      const url = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(body)}`;
      wa.setAttribute("href", url);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setYear();
  initTopbarElevation();
  initMobileNav();
  initReveal();
  initMeters();
  initToTop();
  initContactForm();
});

