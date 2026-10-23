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
    ".section-head, .card, .hero-inner > *"
  );
  revealEls.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
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

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
