/* ==========================================================================
   NEXORA — interactions
   ========================================================================== */

// Product catalogue. Each colour has its own photo in /images/products/.
// Prices are placeholders — update them to your real prices.
const TEE_SIZES = ["S", "M", "L", "XL", "XXL"];
const TEE_DETAILS = ["Oversized, drop-shoulder fit", "Large-format back print", "Ribbed crew neck", "Wash inside out, cold"];

const PRODUCTS = [
  {
    id: 1, name: "Dopeday", line: "Crazy Mindset 4u", price: 45, tag: "Bestseller",
    colours: [
      ["White", "#F7F7F5", "images/products/dopeday-white.jpg"],
      ["Black", "#141414", "images/products/dopeday-black.jpg"],
    ],
    desc: "A bone-and-blossom skull crowned by bumblebees, framed in bold serif type. “In the gentle embrace of now, mindfulness whispers softly.”",
  },
  {
    id: 2, name: "Savage", line: "Fear", price: 45, tag: "New",
    colours: [
      ["Black", "#141414", "images/products/savage-black.jpg"],
      ["White", "#F7F7F5", "images/products/savage-white.jpg"],
    ],
    desc: "A suited Rottweiler on the throne, taped over with FEAR in gothic lettering. “A thief of dreams and a killer of confidence.”",
  },
  {
    id: 3, name: "Rebel Angel", line: "Restricted", price: 45, tag: "New",
    colours: [["White", "#F7F7F5", "images/products/rebel-angel-white.jpg"]],
    desc: "A winged warrior breaking her chains in lilac and plum, over graffiti script and an ESTD 1999 label.",
  },
  {
    id: 4, name: "Celestial Ethereal", line: "Cherub", price: 45,
    colours: [["Forest Green", "#1F4A3C", "images/products/celestial-green.jpg"]],
    desc: "A classical cherub wrapped in ribbon between mirrored gothic type. “The serene gaze of the cherub lies a profound mystery.”",
  },
  {
    id: 5, name: "Hysteria", line: "Crazy Mindset", price: 45, tag: "Limited",
    colours: [["Forest Green", "#1F4A3C", "images/products/hysteria-green.jpg"]],
    desc: "A halftone portrait mid-laugh with doves on the lenses and fire in the teeth. “Madmen don’t play by the rules — they rewrite the game.”",
  },
  {
    id: 6, name: "Feel My Style", line: "Under Construction", price: 45, tag: "New",
    colours: [["White", "#F7F7F5", "images/products/feel-my-style-white.jpg"]],
    desc: "A laid-back portrait in a jungle garden, splashed with magenta. “Not broken, just under construction.”",
  },
  {
    id: 7, name: "Gangster Strut", line: "Loyalty", price: 45, tag: "New",
    colours: [["Black", "#141414", "images/products/gangster-strut-black.jpg"]],
    desc: "Hooded figures by matchlight under distressed street type. “In the streets, loyalty is everything. Respect is earned, never given.”",
  },
];

// Filter key for a colour name, e.g. "Forest Green" -> "green"
const colourKey = (name) => name.toLowerCase().split(" ").pop();

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = (n) => `$${n.toLocaleString("en-US")}`;

/* ---------- Products ---------- */
function renderProducts() {
  const grid = $("#products");
  grid.innerHTML = PRODUCTS.map((p) => {
    const [first, second] = p.colours;
    return `
    <article class="product reveal" data-colours="${p.colours.map(([n]) => colourKey(n)).join(" ")}" data-id="${p.id}" tabindex="0" aria-label="${p.name} tee, ${money(p.price)}">
      <div class="product__media media">
        <img src="${first[2]}" alt="${p.name} tee in ${first[0]}, back print" loading="lazy" onerror="this.remove()" />
        ${second ? `<img src="${second[2]}" alt="" loading="lazy" onerror="this.remove()" />` : ""}
        ${p.tag ? `<span class="product__tag">${p.tag}</span>` : ""}
        <span class="product__view">Quick view</span>
      </div>
      <div class="product__row">
        <h3 class="product__name">${p.name}</h3>
        <span class="product__price">${money(p.price)}</span>
      </div>
      <p class="product__meta">Oversized tee · ${p.colours.length} colour${p.colours.length > 1 ? "s" : ""}</p>
      <div class="product__swatches">${p.colours.map(([n, c]) => `<span style="background:${c}" title="${n}"></span>`).join("")}</div>
    </article>`;
  }).join("");

  $$(".product", grid).forEach((card) => {
    const open = () => openModal(+card.dataset.id);
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}

function applyFilter(filter) {
  $$(".filter").forEach((b) => {
    const on = b.dataset.filter === filter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-selected", on);
  });
  $$(".product").forEach((card) => {
    card.classList.toggle("is-hidden", filter !== "all" && !card.dataset.colours.split(" ").includes(filter));
  });
}

/* ---------- Quick view modal ---------- */
const modal = $("#modal");
let lastFocus = null;

function openModal(id, colourIdx = 0) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  lastFocus = document.activeElement;

  const media = $("#modalMedia");
  const showColour = ([name, , src]) => {
    media.innerHTML = `<img src="${src}" alt="${p.name} tee in ${name}, back print" onerror="this.remove()" />`;
    $("#modalColourName").textContent = name;
  };

  $("#modalCat").textContent = `Oversized tee — ${p.line}`;
  $("#modalTitle").textContent = p.name;
  $("#modalPrice").textContent = money(p.price);
  $("#modalDesc").textContent = p.desc;
  $("#modalDetails").innerHTML = TEE_DETAILS.map((d) => `<li>${d}</li>`).join("");

  const swatches = $("#modalSwatches");
  swatches.innerHTML = p.colours.map(([n, c], i) =>
    `<button style="background:${c}" data-name="${n}" aria-label="${n}" class="${i === colourIdx ? "is-active" : ""}"></button>`).join("");
  showColour(p.colours[colourIdx]);
  $$("button", swatches).forEach((b, i) => b.addEventListener("click", () => {
    $$("button", swatches).forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
    showColour(p.colours[i]);
  }));

  const sizes = $("#modalSizes");
  sizes.innerHTML = TEE_SIZES.map((s) => `<button>${s}</button>`).join("");
  $$("button", sizes).forEach((b) => b.addEventListener("click", () => {
    $$("button", sizes).forEach((x) => x.classList.remove("is-active"));
    b.classList.add("is-active");
  }));

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $(".modal__close", modal).focus();
}

function closeModal(restoreFocus = true) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (restoreFocus) lastFocus?.focus({ preventScroll: true });
}

/* ---------- Hero: card stack ---------- */
const HERO_INTERVAL = 5200; // keep in sync with --dur in styles.css

// Slide order mixes colours so neighbouring cards contrast
const HERO_ORDER = [
  "dopeday-white", "savage-black", "celestial-green", "feel-my-style-white", "gangster-strut-black",
  "rebel-angel-white", "dopeday-black", "hysteria-green", "savage-white",
];

// Ambient glow colour behind each colourway
const heroTint = (colour) =>
  /green/i.test(colour) ? "#2E6A54" : /black/i.test(colour) ? "#7A5A30" : "#B08D57";

function initHero() {
  const hero = $("#hero");
  if (!hero) return;

  const all = PRODUCTS.flatMap((p) =>
    p.colours.map(([colour, , src], colourIdx) => ({ p, colour, src, colourIdx })));
  const key = (s) => s.src.split("/").pop().replace(".jpg", "");
  const slides = HERO_ORDER.map((k) => all.find((s) => key(s) === k)).filter(Boolean)
    .concat(all.filter((s) => !HERO_ORDER.includes(key(s))));
  const n = slides.length;

  const cardsEl = $("#heroCards");
  const thumbsEl = $("#heroThumbs");
  const word = $("#heroWord");
  const caption = $(".hero__caption", hero);

  cardsEl.innerHTML = slides.map((s, i) => `
    <button class="hero__card" data-i="${i}" aria-label="${s.p.name} in ${s.colour}" tabindex="-1">
      <img src="${s.src}" alt="${s.p.name} tee in ${s.colour}, back print" ${i > 2 ? 'loading="lazy"' : ""} draggable="false" />
    </button>`).join("");
  thumbsEl.innerHTML = slides.map((s, i) => `
    <button class="hero__thumb" data-i="${i}" role="tab" aria-label="${s.p.name}, ${s.colour}">
      <img src="${s.src}" alt="" loading="lazy" /><i></i>
    </button>`).join("");
  $("#heroTotal").textContent = String(n).padStart(2, "0");

  const cards = $$(".hero__card", cardsEl);
  const thumbs = $$(".hero__thumb", thumbsEl);
  let active = 0, timer = null, paused = false, inView = true, first = true;

  function go(i) {
    const same = !first && (i + n) % n === active;
    active = (i + n) % n;
    const s = slides[active];

    cards.forEach((card, k) => {
      let off = (k - active + n) % n;
      if (off > n / 2) off -= n;
      card.dataset.pos = Math.abs(off) <= 2 ? off : "hidden";
      card.tabIndex = off === 0 ? 0 : -1;
    });
    thumbs.forEach((t, k) => {
      const on = k === active;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      if (on) { t.querySelector("i").replaceWith(document.createElement("i")); } // restart progress bar
    });
    hero.style.setProperty("--tint", heroTint(s.colour));

    const update = () => {
      const w = s.p.name.split(" ")[0].toUpperCase(); // first word keeps it bold, e.g. CELESTIAL
      word.textContent = w;
      word.style.setProperty("--len", w.length);
      $("#heroIndex").textContent = String(active + 1).padStart(2, "0");
      $("#heroName").textContent = s.p.name;
      $("#heroMeta").textContent = `${s.colour} · ${money(s.p.price)}`;
      word.parentElement.classList.remove("is-out");
      caption.classList.remove("is-swapping");
    };
    if (first || same) { update(); first = false; return schedule(); }
    word.parentElement.classList.add("is-out");
    caption.classList.add("is-swapping");
    setTimeout(update, 380);
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (!paused && inView && !document.hidden) timer = setTimeout(() => go(active + 1), HERO_INTERVAL);
  }
  function setPaused(p) {
    paused = p;
    hero.classList.toggle("is-paused", p);
    // restarting keeps the progress bar honest after a pause
    if (!p) go(active); else clearTimeout(timer);
  }

  $("#heroPrev").addEventListener("click", () => go(active - 1));
  $("#heroNext").addEventListener("click", () => go(active + 1));
  thumbs.forEach((t) => t.addEventListener("click", () => go(+t.dataset.i)));
  cards.forEach((card) => card.addEventListener("click", () => {
    if (dragged) return;
    const i = +card.dataset.i;
    if (i === active) openModal(slides[i].p.id, slides[i].colourIdx);
    else go(i);
  }));
  $("#heroView").addEventListener("click", () => openModal(slides[active].p.id, slides[active].colourIdx));

  // Pause while the pointer is on the stack, when off-screen, or when the tab is hidden
  const stage = $("#heroStage");
  stage.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") setPaused(true); });
  stage.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") setPaused(false); });
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; schedule(); }, { threshold: 0.2 }).observe(hero);
  document.addEventListener("visibilitychange", schedule);

  // Keyboard: arrow keys while focus is inside the hero
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(active + 1);
    if (e.key === "ArrowLeft") go(active - 1);
  });

  // Swipe / drag
  let startX = null, dragged = false;
  stage.addEventListener("pointerdown", (e) => { startX = e.clientX; dragged = false; });
  window.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 45) { dragged = true; go(active + (dx < 0 ? 1 : -1)); setTimeout(() => (dragged = false), 0); }
  });

  // 3D tilt + sheen following the mouse
  const fine = window.matchMedia("(pointer: fine)").matches;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (fine && !calm) {
    hero.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cardsEl.style.setProperty("--ty", `${x * 10}deg`);
      cardsEl.style.setProperty("--tx", `${-y * 8}deg`);
      const front = cards[active].getBoundingClientRect();
      cards[active].style.setProperty("--mx", `${((e.clientX - front.left) / front.width) * 100}%`);
      cards[active].style.setProperty("--my", `${((e.clientY - front.top) / front.height) * 100}%`);
    });
    hero.addEventListener("pointerleave", () => {
      cardsEl.style.setProperty("--ty", "0deg");
      cardsEl.style.setProperty("--tx", "0deg");
    });
  }

  go(0);
}

/* ---------- Header & mobile menu ---------- */
function initHeader() {
  const header = $("#header");
  const hero = $("#hero");
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    header.classList.toggle("on-dark", !!hero && hero.getBoundingClientRect().bottom > header.offsetHeight);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#menuToggle");
  const menu = $("#mobileMenu");
  const setMenu = (open) => {
    toggle.classList.toggle("is-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("no-scroll", open);
  };
  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
}

/* ---------- Reveal on scroll + counters ---------- */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("is-visible");
      io.unobserve(el);
      // footer letters: drop the stagger once they've landed so hover feels instant
      if (el.classList.contains("footer__giant")) setTimeout(() => el.classList.add("is-done"), 1800);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  $$("[data-split], .footer__giant").forEach((el) => io.observe(el));

  // Stagger siblings slightly for a softer cascade
  $$(".reveal").forEach((el) => {
    const siblings = $$(":scope > .reveal", el.parentElement);
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 90}ms`;
    io.observe(el);
  });

  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1600;
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => counterIO.observe(el));
}

/* ---------- Reviews wall ---------- */
// Placeholder reviews — replace with real customer reviews before launch.
// [name, tee name, product image file (without .jpg), quote]
const REVIEWS = [
  ["Kavindu R.", "Dopeday", "dopeday-black", "The print is even better in person. I get asked about it every single time I wear it."],
  ["Ishara M.", "Feel My Style", "feel-my-style-white", "Bought matching ones with my partner. The oversized fit is exactly right."],
  ["Nimesh D.", "Savage", "savage-black", "The back print is huge and the fit is spot on. Straight into my weekly rotation."],
  ["Tharushi P.", "Celestial Ethereal", "celestial-green", "That green is unreal. Nothing else in my wardrobe looks like it."],
  ["Ravindu S.", "Gangster Strut", "gangster-strut-black", "Grabbed it on drop day. The artwork hits even harder in person."],
  ["Dilini K.", "Rebel Angel", "rebel-angel-white", "The detail in the artwork is insane. It's like wearing a poster."],
  ["Sahan W.", "Hysteria", "hysteria-green", "Loud in the best way. Hangs perfectly off the shoulders."],
  ["Anjali F.", "Savage", "savage-white", "Tried it in store and walked out wearing it. The team helped me find my size."],
];

function initReviews() {
  const card = ([name, tee, img, text]) => `
    <figure class="review">
      <span class="review__stars" aria-label="5 out of 5 stars">★★★★★</span>
      <blockquote class="review__text">“${text}”</blockquote>
      <figcaption class="review__who">
        <img src="images/products/${img}.jpg" alt="" loading="lazy" />
        <span><span class="review__name">${name}</span><span class="review__tee">${tee} tee</span></span>
      </figcaption>
    </figure>`;
  const half = Math.ceil(REVIEWS.length / 2);
  [["#reviewsA", REVIEWS.slice(0, half)], ["#reviewsB", REVIEWS.slice(half)]].forEach(([sel, list]) => {
    const el = $(sel);
    if (!el) return;
    // Two identical halves (each the set twice, so a half is wider than the screen) -> seamless wrap
    const set = list.map(card).join("");
    el.innerHTML = set.repeat(4);
    $$(".review", el).slice(list.length).forEach((r) => r.setAttribute("aria-hidden", "true"));
  });
  runReviewMarquee();
}

// JS-driven marquee: rows drift in opposite directions, speed up with scrolling
// (and reverse when you scroll back up), and ease to a stop on hover.
function runReviewMarquee() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const BASE = 38; // px per second at rest
  const section = $("#reviews");
  const rows = $$(".reviews__track").map((el) => ({ el, dir: +el.dataset.dir || -1, pos: 0, speed: 1, target: 1, half: 0 }));
  if (!section || !rows.length) return;

  const measure = () => rows.forEach((r) => { r.half = r.el.scrollWidth / 2; });
  measure();
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);

  rows.forEach((r) => {
    r.el.addEventListener("pointerenter", () => { r.target = 0; });
    r.el.addEventListener("pointerleave", () => { r.target = 1; });
  });

  let boost = 0, lastY = window.scrollY, last = 0, raf = null;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    boost = Math.max(Math.min(boost + (y - lastY) * 0.5, 40), -40);
    lastY = y;
  }, { passive: true });

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    boost *= 0.93;
    rows.forEach((r) => {
      r.speed += (r.target - r.speed) * 0.07;
      // scrolling down pushes rows along; scrolling up pulls them back the other way
      const v = BASE * r.speed + boost * 14 * (0.3 + 0.7 * r.speed);
      r.pos -= r.dir * v * dt;
      if (r.half) r.pos = ((r.pos % r.half) + r.half) % r.half;
      r.el.style.setProperty("--tx", `${(-r.pos).toFixed(2)}px`);
    });
    raf = requestAnimationFrame(tick);
  }

  // Only animate while the section is on screen
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !raf) { last = 0; raf = requestAnimationFrame(tick); }
    else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
  }).observe(section);
}

/* ---------- Crossing bands ---------- */
const BAND_WORDS = ["Wear the story", "limited runs", "Original artwork", "made to be noticed", "Oversized fit", "no restocks"];

function initBands() {
  const fill = (sel, words) => {
    const el = $(sel);
    if (!el) return;
    const half = words.concat(words).map((w) => `<span>${w}</span><i>✦</i>`).join("");
    el.innerHTML = half + half;
  };
  fill("#bandNames", PRODUCTS.map((p) => p.name));
  fill("#bandWords", BAND_WORDS);
}

/* ---------- Split headings into words ---------- */
function initSplit() {
  $$("[data-split]").forEach((el) => {
    let i = 0;
    const wrap = (text, inEm) => text.split(/(\s+)/).map((part) => {
      if (!part.trim()) return part;
      const word = inEm ? `<em>${part}</em>` : part;
      return `<span class="sw"><span style="--wi:${i++}">${word}</span></span>`;
    }).join("");
    el.innerHTML = [...el.childNodes].map((n) =>
      n.nodeType === 3 ? wrap(n.textContent, false)
        : n.tagName === "EM" ? wrap(n.textContent, true)
        : n.outerHTML).join("");
  });
}

/* ---------- Manifesto words ---------- */
function splitManifesto() {
  const el = $("#manifesto");
  if (!el) return [];
  const wrap = (text) => text.split(/(\s+)/).map((p) => (p.trim() ? `<span class="w">${p}</span>` : p)).join("");
  el.innerHTML = [...el.childNodes].map((n) =>
    n.nodeType === 3 ? wrap(n.textContent) : `<em>${wrap(n.textContent)}</em>`).join("");
  return $$(".w", el);
}

/* ---------- Scroll-driven effects: progress, parallax, manifesto, band skew ---------- */
function initScrollFX() {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = $("#scrollProgress");
  const floats = calm ? [] : $$("[data-speed]");
  const words = splitManifesto();
  const manifesto = $("#manifesto");
  const bands = $(".bands");
  let lastY = window.scrollY, skew = 0, ticking = false;

  function frame() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar?.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);

    floats.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      el.style.setProperty("--py", `${((r.top + r.height / 2 - vh / 2) * +el.dataset.speed).toFixed(1)}px`);
    });

    if (manifesto && words.length) {
      const r = manifesto.getBoundingClientRect();
      // Starts lighting when the text enters the lower part of the screen, done by the middle
      const p = calm ? 1 : Math.min(Math.max((vh * 0.85 - r.top) / (vh * 0.45 + r.height), 0), 1);
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
    }

    if (bands && !calm) {
      // Bands lean with scroll speed, then ease back
      const v = y - lastY;
      skew += (Math.max(Math.min(v * 0.25, 12), -12) - skew) * 0.2;
      if (Math.abs(skew) < 0.05) skew = 0;
      bands.style.setProperty("--skew", `${skew.toFixed(2)}deg`);
      if (skew !== 0) requestFrame();
    }
    lastY = y;
  }
  function requestFrame() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame);
  window.addEventListener("load", requestFrame); // images change layout once loaded
  frame();
}

/* ---------- Pointer effects: feature spotlight + magnetic buttons ---------- */
function initPointerFX() {
  $$(".feature__icon path").forEach((p) => p.setAttribute("pathLength", "1"));
  if (!window.matchMedia("(pointer: fine)").matches) return;

  $$(".feature").forEach((card) => card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  }));

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  $$(".hero__cta .btn, #arrivals .center .btn").forEach((b) => b.classList.add("magnetic"));
  $$(".magnetic").forEach((btn) => {
    btn.addEventListener("pointermove", (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.22}px, ${y * 0.35}px)`;
    });
    btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
  });
}

/* ---------- Forms ---------- */
function initForms() {
  $("#newsForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    $("#newsMsg").textContent = "You're on the list. We'll let you know when the next drop lands.";
    e.target.reset();
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initReviews();
  initBands();
  initSplit();
  initHero();
  initHeader();
  initReveal();
  initScrollFX();
  initPointerFX();
  initForms();

  $$(".filter").forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));

  // Collection tiles pre-filter the product grid
  $$(".collection[data-filter]").forEach((c) =>
    c.addEventListener("click", () => applyFilter(c.dataset.filter)));

  // Links inside the modal navigate away, so don't pull focus back to the card
  $$("[data-close]", modal).forEach((el) => el.addEventListener("click", () => closeModal(el.tagName !== "A")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

  $("#year").textContent = new Date().getFullYear();
});
