document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  /* ---------- Mobile menu toggle ---------- */
  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  }

  navToggle.addEventListener("click", () => {
    setMenu(!navMenu.classList.contains("open"));
  });

  // Close menu when Escape is pressed or when resizing to desktop
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) setMenu(false);
  });

  /* ---------- Smooth scrolling (with navbar offset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", id);
      setMenu(false);
    });
  });

  /* ---------- Navbar shadow + active link on scroll ---------- */
  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);

    const probe = window.scrollY + navbar.offsetHeight + 120;
    let current = sections[0].id;
    sections.forEach((sec) => {
      if (probe >= sec.offsetTop) current = sec.id;
    });

    navLinks.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal-on-scroll animation ---------- */
  const revealEls = document.querySelectorAll(
    ".section-head, .card, .hero-inner > *, .contact-photo, .contact-info"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  // Variations + staggered delays
  document.querySelectorAll(".hero-inner > *").forEach((el, i) => {
    el.style.transitionDelay = i * 0.12 + "s";
  });
  document.querySelectorAll(".skills-grid .card, .projects-grid .card").forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 0.15 + "s";
  });
  document.querySelector(".profile-card")?.classList.add("reveal-left");
  document.querySelector(".background-card")?.classList.add("reveal-right");
  document.querySelector(".contact-photo")?.classList.add("reveal-left");
  document.querySelector(".contact-info")?.classList.add("reveal-right");
  document.querySelector(".contact-card")?.classList.add("reveal-zoom");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            const t = entry.target;
            setTimeout(() => { t.style.transitionDelay = ""; }, 1200);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- Project images: hide broken ones so the placeholder shows ---------- */
  document.querySelectorAll(".project-image img").forEach((img) => {
    img.addEventListener("error", () => img.classList.add("broken"));
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll progress bar ---------- */
  const bar = document.getElementById("scrollProgress");
  function updateBar() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateBar, { passive: true });
  updateBar();

  /* ---------- Typing effect for the role ---------- */
  const typed = document.getElementById("typed");
  if (typed && !reduce) {
    const text = typed.dataset.text.replace("&amp;", "&");
    typed.textContent = "";
    let i = 0;
    setTimeout(function type() {
      typed.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 70);
    }, 900);
  }

  /* ---------- Cursor glow + 3D tilt on cards (desktop only) ---------- */
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce) {
    const glow = document.getElementById("cursorGlow");
    window.addEventListener("mousemove", (e) => {
      glow.classList.add("on");
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.addEventListener("mouseleave", () => glow.classList.remove("on"));

    document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .1s, border-color .35s, box-shadow .35s, background .35s";
        card.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "";
        card.style.transform = "";
      });
    });
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
