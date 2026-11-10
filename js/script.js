/* =========================================================
   Mylenna — Soluções Tecnológicas | interações
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Tema ---------- */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");
  const themeIcon = themeBtn.querySelector("i");

  const applyTheme = (theme) => {
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    themeIcon.className = theme === "light" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  };

  let saved = null;
  try { saved = localStorage.getItem("mylenna-theme"); } catch (_) {}
  applyTheme(saved || "dark");

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem("mylenna-theme", next); } catch (_) {}
  });

  /* ---------- Navbar ---------- */
  const navbar = $("#navbar");
  const nav = $("#nav");
  const menuToggle = $("#menuToggle");
  const links = $$(".nav__link");
  const progress = $(".scroll-progress");

  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    navbar.classList.toggle("menu-open", open);
    root.classList.toggle("menu-open", open); // trava a rolagem da página enquanto o painel está aberto
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menuToggle.setAttribute("aria-expanded", String(open));
  };
  const menuOpen = () => nav.classList.contains("open");
  menuToggle.addEventListener("click", () => setMenu(!menuOpen()));
  links.forEach((l) => l.addEventListener("click", () => setMenu(false)));
  // Fecha ao tocar fora do painel (o fundo escurecido), ao apertar Esc e quando a tela cresce e o menu vira barra
  document.addEventListener("click", (e) => {
    if (menuOpen() && !nav.contains(e.target) && !e.target.closest(".navbar__actions")) setMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOpen()) { setMenu(false); menuToggle.focus(); }
  });
  window.matchMedia("(max-width: 900px)").addEventListener("change", (e) => { if (!e.matches) setMenu(false); });

  const sections = $$("main section[id]");
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 30);

    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";

    let current = sections[0]?.id;
    for (const s of sections) {
      if (y >= s.offsetTop - 140) current = s.id;
    }
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Efeito de digitação ---------- */
  const typed = $("#typed");
  const phrases = [
    "automatizo o que sua equipe ainda faz na mão.",
    "transformo suas planilhas em dashboards e decisões.",
    "integro os sistemas do seu negócio com Power Platform e Python.",
    "já economizei +200 horas/mês para as áreas que atendo. 💗",
  ];
  let pi = 0, ci = 0, deleting = false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const type = () => {
    const text = phrases[pi];
    typed.textContent = deleting ? text.slice(0, --ci) : text.slice(0, ++ci);
    let delay = deleting ? 35 : 65;
    if (!deleting && ci === text.length) { delay = 2000; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
    setTimeout(type, delay);
  };
  if (reduce) typed.textContent = phrases[0]; else type();

  /* ---------- Reveal, contadores e barras ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");

      $$(".stat__num", e.target).forEach(animateCount);
      $$(".bar__fill", e.target).forEach((b) => (b.style.width = b.dataset.width + "%"));

      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));

  function animateCount(el) {
    const target = +el.dataset.count;
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Abas de habilidades ---------- */
  $$(".tab").forEach((tab) => tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.remove("active"));
    $$(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    const panel = $("#tab-" + tab.dataset.tab);
    panel.classList.add("active");
    $$(".reveal", panel).forEach((el) => {
      el.classList.add("visible");
      $$(".bar__fill", el).forEach((b) => (b.style.width = b.dataset.width + "%"));
    });
  }));

  /* ---------- Filtro de projetos ---------- */
  $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
    $$(".filter").forEach((f) => f.classList.remove("active"));
    btn.classList.add("active");
    const f = btn.dataset.filter;
    $$(".project").forEach((p) => {
      const show = f === "all" || p.dataset.cat === f || p.dataset.cat === "all";
      p.classList.toggle("hidden", !show);
      if (show) p.classList.add("visible");
    });
  }));

  /* ---------- Formulário → WhatsApp ---------- */
  const WHATSAPP = "5521971164026";
  $("#contactForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const nome = $("#nome").value.trim();
    const email = $("#email").value.trim();
    const msg = $("#mensagem").value.trim();
    const texto = `Olá Mylenna! Me chamo ${nome}.\nE-mail: ${email}\n\n${msg}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  });

  /* ---------- Brilho que segue o mouse ---------- */
  const glow = $(".cursor-glow");
  window.addEventListener("pointermove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }, { passive: true });

  /* ---------- Partículas (rede tecnológica) ---------- */
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let W, H, pts = [];

  const resize = () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    const n = Math.min(90, Math.floor((W * H) / 16000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };
  window.addEventListener("resize", resize);
  resize();

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const light = root.getAttribute("data-theme") === "light";
    const dot = light ? "rgba(199,21,111,0.45)" : "rgba(255,111,183,0.75)";
    const line = light ? "199,21,111" : "255,45,149";

    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dot;
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 130) {
          ctx.strokeStyle = `rgba(${line},${(1 - d / 130) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  };
  if (!reduce) draw();

  /* ---------- Janela de ampliação dos painéis ---------- */
  const lb = $("#lightbox");
  if (lb && typeof lb.showModal === "function") {
    const lbImg = document.createElement("img");
    $(".lightbox__fig", lb).prepend(lbImg);
    const lbCap = $("#lbCap"), lbCount = $("#lbCount");
    let group = [], idx = 0;
    const render = () => {
      const t = group[idx];
      lbImg.src = t.getAttribute("href");
      lbImg.alt = t.dataset.alt || (t.querySelector("img") && t.querySelector("img").alt) || t.dataset.caption || "";
      lbCap.textContent = t.dataset.caption || "";
      lbCount.textContent = `${idx + 1} / ${group.length}`;
      lb.classList.toggle("is-single", group.length < 2);
    };
    const step = (d) => { idx = (idx + d + group.length) % group.length; render(); };
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-lightbox]");
      if (!t || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      group = $$(`[data-lightbox="${t.dataset.lightbox}"]`);
      idx = Math.max(0, group.indexOf(t));
      render();
      lb.showModal();
    });
    $(".lightbox__close", lb).addEventListener("click", () => lb.close());
    $(".lightbox__nav--prev", lb).addEventListener("click", () => step(-1));
    $(".lightbox__nav--next", lb).addEventListener("click", () => step(1));
    lb.addEventListener("keydown", (e) => {
      if (group.length < 2) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", () => lbImg.removeAttribute("src"));
  }

  /* ---------- Ano no rodapé ---------- */
  $("#year").textContent = new Date().getFullYear();
});
