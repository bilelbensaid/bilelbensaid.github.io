/* ================================================================
   PORTFOLIO — BILEL BEN SAID
   script.js : Interactivité & animations
   ================================================================ */

/* ----------------------------------------------------------------
   1. CURSEUR PERSONNALISÉ
   Suit la souris avec un léger décalage pour un effet "suivi"
---------------------------------------------------------------- */
(function initCursor() {
  const cursor = document.getElementById("cursor");
  const cursorDot = document.getElementById("cursorDot");
  if (!cursor || !cursorDot) return;

  let mouseX = 0,
    mouseY = 0;
  let curX = 0,
    curY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Le point suit immédiatement
    cursorDot.style.left = mouseX + "px";
    cursorDot.style.top = mouseY + "px";
  });

  // Le cercle suit avec un léger délai (lerp)
  function animateCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursor.style.left = curX + "px";
    cursor.style.top = curY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Agrandir le cercle au survol des éléments cliquables
  const clickables = document.querySelectorAll(
    "a, button, .project-card, .info-card",
  );
  clickables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.width = "52px";
      cursor.style.height = "52px";
      cursor.style.borderColor = "rgba(0, 212, 255, 0.6)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.width = "36px";
      cursor.style.height = "36px";
      cursor.style.borderColor = "var(--accent)";
    });
  });
})();

/* ----------------------------------------------------------------
   2. NAVBAR — fond au scroll
---------------------------------------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const handler = () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handler, { passive: true });
  handler(); // check initial state
})();

/* ----------------------------------------------------------------
   3. MENU HAMBURGER (mobile)
---------------------------------------------------------------- */
(function initHamburger() {
  const btn = document.getElementById("hamburger");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    links.classList.toggle("open");
  });

  // Fermer le menu au clic sur un lien
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("active");
      links.classList.remove("open");
    });
  });
})();

/* ----------------------------------------------------------------
   4. TERMINAL ANIMÉ — texte qui se tape
---------------------------------------------------------------- */
(function initTerminal() {
  const body = document.getElementById("terminalBody");
  if (!body) return;

  /* 🔧 PERSONNALISER : les lignes du terminal */
  const lines = [
    { type: "cmd", text: "whoami" },
    { type: "out", text: "bilel.bensaid — eleve-ingenieur" },
    { type: "cmd", text: "cat competences.txt" },
    { type: "out", text: "C · Python · Linux · Git · Embedded" },
    { type: "cmd", text: "ls ./projets/" },
    { type: "out", text: "interpreter/  adc8bits/  frequencemetre/" },
    { type: "cmd", text: "echo $SECTEURS" },
    { type: "out", text: "auto · aéro · IoT · spatial" },
    { type: "cmd", text: "git status" },
    { type: "out", text: "On branch main · 1 work-in-progress" },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let currentEl = null;

  function typeNextChar() {
    if (lineIndex >= lines.length) {
      // Ajouter le curseur clignotant à la fin
      const cursorEl = document.createElement("span");
      cursorEl.className = "t-cursor";
      body.appendChild(cursorEl);
      return;
    }

    const line = lines[lineIndex];

    // Créer un nouvel élément de ligne si nécessaire
    if (charIndex === 0) {
      currentEl = document.createElement("span");
      currentEl.className = "terminal-line";

      if (line.type === "cmd") {
        currentEl.innerHTML =
          '<span class="prompt">$ </span><span class="cmd"></span>';
      } else {
        currentEl.innerHTML = '<span class="out"></span>';
      }
      body.appendChild(currentEl);
    }

    // Trouver la cible (dernier span du currentEl)
    const target = currentEl.lastElementChild;
    target.textContent += line.text[charIndex];
    charIndex++;

    if (charIndex >= line.text.length) {
      // Ligne terminée : saut de ligne
      body.appendChild(document.createElement("br"));
      lineIndex++;
      charIndex = 0;
      currentEl = null;
      // Pause plus longue entre les lignes
      setTimeout(typeNextChar, line.type === "cmd" ? 400 : 120);
    } else {
      // Délai variable pour simuler la frappe humaine
      const delay =
        line.type === "cmd" ? 60 + Math.random() * 60 : 20 + Math.random() * 20;
      setTimeout(typeNextChar, delay);
    }
  }

  // Démarrer après un délai
  setTimeout(typeNextChar, 800);
})();

/* ----------------------------------------------------------------
   5. INTERSECTION OBSERVER — animations au scroll
   Déclenche les classes .visible pour les éléments .line-reveal
   et .fade-up quand ils entrent dans le viewport
---------------------------------------------------------------- */
(function initScrollReveal() {
  // Ajouter la classe fade-up aux cartes / sections
  const targets = document.querySelectorAll(
    ".project-card, .skill-category, .info-card, .cert-item, .timeline-item, .contact-link",
  );
  targets.forEach((el, i) => {
    el.classList.add("fade-up");
    el.style.transitionDelay = (i % 4) * 0.08 + "s";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // une seule fois
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".line-reveal, .fade-up").forEach((el) => {
    observer.observe(el);
  });

  // Révéler immédiatement les éléments du hero
  setTimeout(() => {
    document.querySelectorAll("#hero .line-reveal").forEach((el) => {
      el.classList.add("visible");
    });
  }, 100);
})();

/* ----------------------------------------------------------------
   6. COMPTEURS ANIMÉS (hero stats)
   Anime les nombres de 0 vers la valeur cible (data-target)
---------------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10);
        const duration = 1400; // ms
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Easing easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ----------------------------------------------------------------
   7. BARRES DE PROGRESSION (compétences)
   Anime la largeur des barres au scroll
---------------------------------------------------------------- */
(function initSkillBars() {
  const bars = document.querySelectorAll(".bar-fill[data-width]");
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const w = el.getAttribute("data-width");
        // Légère pause avant d'animer
        setTimeout(() => {
          el.style.width = w + "%";
        }, 200);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  bars.forEach((el) => observer.observe(el));
})();

/* ----------------------------------------------------------------
   8. FORMULAIRE DE CONTACT
   Validation basique + retour visuel
   🔧 PERSONNALISER : remplacer l'URL fetch par ton endpoint Formspree
      ex: https://formspree.io/f/XXXXXXXX
---------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form || !note) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    // Validation simple
    if (!name || !email || !message) {
      note.textContent = "⚠ Veuillez remplir tous les champs.";
      note.style.color = "var(--yellow)";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      note.textContent = "⚠ Adresse email invalide.";
      note.style.color = "var(--yellow)";
      return;
    }

    // Afficher un état de chargement
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = "Envoi…";
    btn.disabled = true;

    try {
      const response = await fetch("https://formspree.io/f/xgopopbw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error("Erreur réseau");

      note.textContent =
        "✓ Message envoyé ! Je reviendrai vers vous rapidement.";
      note.style.color = "var(--green)";
      form.reset();
    } catch (err) {
      note.textContent =
        "✗ Erreur lors de l'envoi. Contactez-moi directement par email.";
      note.style.color = "var(--red)";
    } finally {
      btn.textContent = "Envoyer le message";
      btn.disabled = false;
    }
  });
})();

/* ----------------------------------------------------------------
   9. NAVIGATION ACTIVE AU SCROLL (highlight du lien actif)
   Met en évidence le lien de nav correspondant à la section visible
---------------------------------------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === "#" + id) {
              link.style.color = "var(--accent)";
            }
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" },
  );

  sections.forEach((s) => observer.observe(s));
})();

/* ----------------------------------------------------------------
   10. SMOOTH SCROLL pour les ancres internes
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
