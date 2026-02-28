// =========================
// 1) Scroll reveal cadenciado por seção (exceto hero e #como-funciona)
// =========================
const sectionStaggerDelay = 350;
const staggerSections = Array.from(
  document.querySelectorAll(
    "main section:not(.hero):not(#topo):not(#como-funciona)",
  ),
);

function resetSectionReveal(section) {
  section.querySelectorAll(".animate-on-scroll").forEach((el) => {
    el.classList.remove("visible");
    el.style.transitionDelay = "0ms";
  });
}

function runSectionReveal(section, restart = false) {
  if (!section) return;

  const items = Array.from(section.querySelectorAll(".animate-on-scroll"));
  if (!items.length) return;

  if (restart) {
    resetSectionReveal(section);
    void section.offsetHeight;
  }

  items.forEach((el, idx) => {
    el.style.transitionDelay = `${idx * sectionStaggerDelay}ms`;
    el.classList.add("visible");
  });
}

staggerSections.forEach((section) => resetSectionReveal(section));

const sectionRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const section = entry.target;
      if (entry.isIntersecting) {
        runSectionReveal(section, false);
        sectionRevealObserver.unobserve(section);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -2% 0px" },
);

staggerSections.forEach((section) => sectionRevealObserver.observe(section));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    const href = anchor.getAttribute("href") || "";
    if (!href || href === "#" || href === "#como-funciona") return;

    const target = document.querySelector(href);
    if (!target || !(target instanceof HTMLElement)) return;
    if (target.matches(".hero, #topo")) return;
    if (!target.closest("main")) return;

    window.setTimeout(() => runSectionReveal(target, true), 480);
  });
});

// =========================
// 2) FAQ Toggle
// =========================
document.querySelectorAll("[data-faq]").forEach((q) => {
  q.addEventListener("click", () => {
    const faqItem = q.closest(".faq-item");
    if (!faqItem) return;

    const faqList = faqItem.closest(".faq-list");
    const shouldOpen = !faqItem.classList.contains("active");

    if (faqList) {
      faqList.querySelectorAll(".faq-item.active").forEach((item) => {
        item.classList.remove("active");
        const answer = item.querySelector(".faq-answer");
        if (answer instanceof HTMLElement) {
          answer.style.maxHeight = "0px";
        }
      });
    }

    if (shouldOpen) {
      faqItem.classList.add("active");
      const answer = faqItem.querySelector(".faq-answer");
      if (answer instanceof HTMLElement) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    }
  });
});

window.addEventListener("resize", () => {
  document
    .querySelectorAll(".faq-item.active .faq-answer")
    .forEach((answer) => {
      if (answer instanceof HTMLElement) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
});

// =========================
// 3) Menu Mobile
// =========================
function toggleMenu() {
  document.body.classList.toggle("menu-open");
}
window.toggleMenu = toggleMenu;

document.querySelectorAll(".nav-links a").forEach((a) => {
  a.addEventListener("click", () =>
    document.body.classList.remove("menu-open"),
  );
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) document.body.classList.remove("menu-open");
});

// =========================
// 4) Voltar ao topo
// =========================
function voltarAoTopo() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.voltarAoTopo = voltarAoTopo;

// =========================
// 5) Navbar shrink ao rolar
// =========================
const nav = document.querySelector(".nav");
let lastY = 0;

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY || 0;
    if (!nav) return;

    if (y > 18) nav.classList.add("nav--scrolled");
    else nav.classList.remove("nav--scrolled");

    if (y <= 24) {
      nav.classList.remove("nav--hidden");
    } else if (y < lastY - 4) {
      nav.classList.remove("nav--hidden");
    } else if (y > lastY + 4) {
      nav.classList.add("nav--hidden");
    }

    lastY = y;
  },
  { passive: true },
);

// =========================
// 6) Contador de "Resultados" quando entrar na tela
// =========================
function animateCount(el, target, duration = 900) {
  const start = 0;
  const t0 = performance.now();

  function frame(t) {
    const p = Math.min((t - t0) / duration, 1);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(start + (target - start) * eased);
    el.textContent = value;

    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll("[data-count]").forEach((n) => {
        const target = Number(n.getAttribute("data-count") || "0");
        animateCount(n, target);
      });

      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.25 },
);

const resultados = document.querySelector("#resultados");
if (resultados) statsObserver.observe(resultados);

// =========================
// 7) Como Funciona - reveal cadenciado
// =========================
const comoFuncionaSection = document.querySelector("#como-funciona");

function runComoFuncionaReveal(restart = false) {
  if (!comoFuncionaSection) return;

  const cfHead = comoFuncionaSection.querySelector(".cf-head");
  const cfSteps = Array.from(comoFuncionaSection.querySelectorAll(".cf-step"));

  if (restart) {
    comoFuncionaSection.classList.remove("cf-reveal");
    void comoFuncionaSection.offsetHeight;
  }

  if (cfHead) cfHead.style.transitionDelay = "0ms";
  cfSteps.forEach((step, idx) => {
    step.style.transitionDelay = `${(idx + 1) * 550}ms`;
  });

  comoFuncionaSection.classList.add("cf-reveal");
}

if (comoFuncionaSection) {
  const resetComoFuncionaReveal = () => {
    comoFuncionaSection.classList.remove("cf-reveal");
  };

  resetComoFuncionaReveal();

  const comoFuncionaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runComoFuncionaReveal(false);
          comoFuncionaObserver.unobserve(comoFuncionaSection);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -2% 0px" },
  );

  comoFuncionaObserver.observe(comoFuncionaSection);
}

document.querySelectorAll('a[href="#como-funciona"]').forEach((anchor) => {
  anchor.addEventListener("click", () => {
    if (!comoFuncionaSection) return;
    comoFuncionaSection.classList.remove("cf-reveal");
    window.setTimeout(() => runComoFuncionaReveal(true), 520);
  });
});

// =========================
// 8) Fallback para link de e-mail (mailto -> Gmail compose)
// =========================
const contactEmailLink = document.querySelector("#contactEmailLink");

if (contactEmailLink instanceof HTMLAnchorElement) {
  contactEmailLink.addEventListener("click", (event) => {
    event.preventDefault();

    const mailtoHref = contactEmailLink.getAttribute("href") || "";
    const gmailCompose =
      contactEmailLink.getAttribute("data-gmail-compose") || "";

    if (!mailtoHref) return;

    let appOpened = false;
    const onVisibilityChange = () => {
      if (document.hidden) appOpened = true;
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.location.href = mailtoHref;

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (!appOpened && gmailCompose) {
        window.open(gmailCompose, "_blank", "noopener,noreferrer");
      }
    }, 900);
  });
}
