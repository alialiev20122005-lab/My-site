/**
 * SELECTED WORKS & SYSTEMS — EDITORIAL PORTFOLIO JAVASCRIPT
 * Features:
 *  1. Hero Parametric Topography (Harmonic, Vortex, Topology modes + Mouse Kinematics)
 *  2. Project 01: Aura Kinematics & Frequency Playground
 *  3. Project 02: Prism Force-Directed Graph Engine & Benchmark Simulator
 *  4. Project 03: Hermes Telegram Bot Simulator & Command Dispatcher
 *  5. Curated Exhibition vs Technical Specification View Switcher
 *  6. Light Paper / Dark Slate Theme Toggle
 *  7. Live UTC Ticking Clock & Copy Transmission Address
 *  8. Custom Interpolated Cursor Follower
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. UTILITIES & HELPERS
  // =========================================================================
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // Setup HiDPI Canvas
  function setupHiDPICanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height, dpr };
  }

  // =========================================================================
  // 2. LIVE UTC CLOCK & THEME SYSTEM
  // =========================================================================
  function initHeaderAndTheme() {
    const clockEl = document.getElementById("liveClock");
    function updateClock() {
      if (!clockEl) return;
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      clockEl.textContent = `${h}:${m}:${s}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Theme Toggle
    const themeBtn = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("portfolio_theme");
    if (savedTheme === "slate") {
      document.body.classList.add("theme-slate");
    }

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("theme-slate");
        const isSlate = document.body.classList.contains("theme-slate");
        localStorage.setItem("portfolio_theme", isSlate ? "slate" : "paper");
      });
    }

    // View Switcher (Curated vs Technical)
    const btnCurated = document.getElementById("btnCuratedView");
    const btnTechnical = document.getElementById("btnTechnicalView");

    function setViewMode(mode) {
      if (mode === "technical") {
        document.body.classList.add("mode-technical");
        btnTechnical?.classList.add("active");
        btnCurated?.classList.remove("active");
        btnTechnical?.setAttribute("aria-checked", "true");
        btnCurated?.setAttribute("aria-checked", "false");
      } else {
        document.body.classList.remove("mode-technical");
        btnCurated?.classList.add("active");
        btnTechnical?.classList.remove("active");
        btnCurated?.setAttribute("aria-checked", "true");
        btnTechnical?.setAttribute("aria-checked", "false");
      }
    }

    btnCurated?.addEventListener("click", () => setViewMode("curated"));
    btnTechnical?.addEventListener("click", () => setViewMode("technical"));

    // Copy Address Button
    const copyBtn = document.getElementById("copyEmailBtn");
    const copyBadge = document.getElementById("copyBadge");
    if (copyBtn && copyBadge) {
      copyBtn.addEventListener("click", () => {
        const email = "contact@domain.dev";
        navigator.clipboard.writeText(email).then(() => {
          const original = copyBadge.textContent;
          copyBadge.textContent = "СКОПИРОВАНО // 0.1с";
          copyBadge.style.backgroundColor = "var(--status-green)";
          setTimeout(() => {
            copyBadge.textContent = original;
            copyBadge.style.backgroundColor = "";
          }, 2400);
        }).catch(() => {
          copyBadge.textContent = "ВЫДЕЛИТЕ И СКОПИРУЙТЕ";
        });
      });
    }
  }

  // =========================================================================
  // 3. SUBTLE CUSTOM CURSOR
  // =========================================================================
  function initCustomCursor() {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    if (!dot || !ring || window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isVisible = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      isVisible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    });

    // Render loop for smooth trailing ring
    function renderCursor() {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover effect on interactives
    const interactives = document.querySelectorAll("a, button, input, .project-card, canvas");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
    });
  }

  // =========================================================================
  // 4. HERO SECTION: INTERACTIVE PARAMETRIC TOPOGRAPHY
  // =========================================================================
  function initHeroCanvas() {
    const canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    let { ctx, width, height } = setupHiDPICanvas(canvas);
    let mode = "harmonic"; // 'harmonic', 'vortex', 'topography'
    let time = 0;
    let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5, isHovered: false };
    
    // FPS counter
    const fpsDisplay = document.getElementById("fpsDisplay");
    let lastTime = performance.now();
    let frameCount = 0;
    let currentFps = 60;

    // Mode Buttons
    const modeBtns = document.querySelectorAll(".hero-visual-card .mode-btn");
    modeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        modeBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        mode = btn.dataset.mode;
      });
    });

    function onResize() {
      const res = setupHiDPICanvas(canvas);
      ctx = res.ctx;
      width = res.width;
      height = res.height;
    }
    window.addEventListener("resize", onResize);

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    });

    canvas.addEventListener("mouseleave", () => {
      mouse.isHovered = false;
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.5;
    });

    const rows = 24;
    const cols = 60;

    function renderHero() {
      // Smooth mouse lerp
      mouse.x = lerp(mouse.x, mouse.targetX, 0.08);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.08);

      time += 0.016;

      // Calculate FPS
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 500) {
        currentFps = Math.round((frameCount * 1000) / (now - lastTime));
        if (fpsDisplay) fpsDisplay.textContent = `${currentFps} FPS`;
        frameCount = 0;
        lastTime = now;
      }

      ctx.clearRect(0, 0, width, height);

      const isSlate = document.body.classList.contains("theme-slate");
      const baseColor = isSlate ? "rgba(240, 238, 230, " : "rgba(24, 24, 23, ";

      const cellW = width / (cols - 1);
      const rowSpacing = height / (rows + 2);

      for (let r = 0; r < rows; r++) {
        const yBase = (r + 1.5) * rowSpacing;
        ctx.beginPath();

        const rowAlpha = 0.12 + 0.5 * Math.sin((r / rows) * Math.PI);
        ctx.strokeStyle = `${baseColor}${rowAlpha.toFixed(3)})`;
        ctx.lineWidth = 1;

        for (let c = 0; c < cols; c++) {
          const x = c * cellW;
          let yOffset = 0;

          // Distance from mouse
          const dx = x - mouse.x;
          const dy = yBase - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influence = Math.max(0, 1 - dist / (width * 0.45));

          if (mode === "harmonic") {
            const wave1 = Math.sin(c * 0.14 + time * 1.8 + r * 0.25) * 16;
            const wave2 = Math.cos(c * 0.08 - time * 1.2 + r * 0.15) * 8;
            const mouseLift = Math.sin(influence * Math.PI) * -42;
            yOffset = wave1 + wave2 + mouseLift;
          } else if (mode === "vortex") {
            const angle = Math.atan2(dy, dx);
            const swirl = Math.sin(angle * 3 + time * 2) * (influence * 35);
            const wave = Math.sin(c * 0.15 + time) * 10;
            yOffset = swirl + wave;
          } else if (mode === "topography") {
            const noise1 = Math.sin(c * 0.12 + r * 0.3) * Math.cos(c * 0.05 + time * 0.8) * 22;
            const mouseCrater = influence * 48 * Math.cos(dist * 0.05 - time * 2);
            yOffset = noise1 + mouseCrater;
          }

          const py = yBase + yOffset;

          if (c === 0) {
            ctx.moveTo(x, py);
          } else {
            ctx.lineTo(x, py);
          }
        }
        ctx.stroke();
      }

      // Draw subtle focal coordinate crosshair around mouse
      if (mouse.isHovered) {
        ctx.save();
        ctx.strokeStyle = isSlate ? "rgba(224, 108, 82, 0.45)" : "rgba(196, 77, 52, 0.45)";
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(mouse.x - 30, mouse.y);
        ctx.lineTo(mouse.x + 30, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 30);
        ctx.lineTo(mouse.x, mouse.y + 30);
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(renderHero);
    }
    renderHero();
  }

  // =========================================================================
  // 5. PROJECT 01: AURA KINETIC TYPOGRAPHY & CHRONO-TOPOLOGY
  // =========================================================================
  function initAuraProject() {
    const canvas = document.getElementById("auraCanvas");
    if (!canvas) return;

    let { ctx, width, height } = setupHiDPICanvas(canvas);
    const freqInput = document.getElementById("auraFreq");
    const tensionInput = document.getElementById("auraTension");
    const freqVal = document.getElementById("freqVal");
    const tensionVal = document.getElementById("tensionVal");
    const impulseBtn = document.getElementById("auraImpulseBtn");

    let frequency = 1.6;
    let tension = 0.75;
    let impulse = 0;
    let t = 0;
    let mouse = { x: width * 0.5, y: height * 0.5, targetX: width * 0.5, targetY: height * 0.5 };

    freqInput?.addEventListener("input", (e) => {
      frequency = parseFloat(e.target.value);
      if (freqVal) freqVal.textContent = `${frequency.toFixed(1)} Гц`;
    });

    tensionInput?.addEventListener("input", (e) => {
      tension = parseFloat(e.target.value);
      if (tensionVal) tensionVal.textContent = `${tension.toFixed(2)}`;
    });

    impulseBtn?.addEventListener("click", () => {
      impulse = 42;
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    });

    function onResize() {
      const res = setupHiDPICanvas(canvas);
      ctx = res.ctx;
      width = res.width;
      height = res.height;
    }
    window.addEventListener("resize", onResize);

    const ribbons = 7;
    const points = 48;

    function renderAura() {
      t += 0.02 * frequency;
      impulse = lerp(impulse, 0, 0.05 * tension);
      mouse.x = lerp(mouse.x, mouse.targetX, 0.1);
      mouse.y = lerp(mouse.y, mouse.targetY, 0.1);

      ctx.clearRect(0, 0, width, height);

      const isSlate = document.body.classList.contains("theme-slate");
      const baseColor = isSlate ? "240, 238, 230" : "20, 20, 20";

      const stepX = width / (points - 1);
      const centerY = height * 0.5;

      for (let r = 0; r < ribbons; r++) {
        const offsetR = (r - (ribbons - 1) / 2) * 16;
        ctx.beginPath();

        const alpha = 0.18 + 0.7 * (1 - Math.abs(offsetR) / 70);
        ctx.strokeStyle = `rgba(${baseColor}, ${alpha.toFixed(2)})`;
        ctx.lineWidth = r === Math.floor(ribbons / 2) ? 1.6 : 1;

        for (let p = 0; p < points; p++) {
          const px = p * stepX;
          const distMouse = Math.abs(px - mouse.x);
          const mouseLift = Math.exp(-distMouse / 70) * (mouse.y - centerY) * 0.7;

          const wave = Math.sin(p * 0.22 * frequency + t + r * 0.4) * (24 + impulse);
          const waveHarmonic = Math.cos(p * 0.11 * frequency - t * 0.5) * 12;
          const py = centerY + offsetR + wave + waveHarmonic + mouseLift;

          if (p === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      }

      // Subtle dynamic glyph accents
      const glyphX = mouse.x;
      const glyphY = centerY + Math.sin(t * 2) * 20;
      ctx.fillStyle = isSlate ? "rgba(224, 108, 82, 0.85)" : "rgba(196, 77, 52, 0.85)";
      ctx.beginPath();
      ctx.arc(glyphX, glyphY, 3, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(renderAura);
    }
    renderAura();
  }

  // =========================================================================
  // 6. PROJECT 02: PRISM LATENT WORKSPACE & SYNTACTIC GRAPH
  // =========================================================================
  function initPrismProject() {
    const canvas = document.getElementById("prismCanvas");
    if (!canvas) return;

    let { ctx, width, height } = setupHiDPICanvas(canvas);
    const activeNodeEl = document.getElementById("prismActiveNode");
    const edgeCountEl = document.getElementById("prismEdgeCount");
    const tooltipEl = document.getElementById("prismTooltip");
    const benchmarkBtn = document.getElementById("prismBenchmarkBtn");
    const statusEl = document.getElementById("prismStatus");

    // Graph Nodes Definition
    const nodes = [
      { id: "ast", label: "Синтаксический AST", x: 0.32, y: 0.45, vx: 0, vy: 0, r: 8, links: ["core", "parser", "index"] },
      { id: "core", label: "Семантическое ядро", x: 0.52, y: 0.38, vx: 0, vy: 0, r: 10, links: ["ast", "crdt", "graph", "cache"] },
      { id: "parser", label: "Токенизатор Markdown", x: 0.20, y: 0.30, vx: 0, vy: 0, r: 7, links: ["ast"] },
      { id: "index", label: "Векторный индекс", x: 0.40, y: 0.72, vx: 0, vy: 0, r: 7, links: ["ast", "core", "graph"] },
      { id: "crdt", label: "Синхронизация CRDT", x: 0.68, y: 0.28, vx: 0, vy: 0, r: 8, links: ["core", "cache"] },
      { id: "graph", label: "Двунаправленные связи", x: 0.62, y: 0.68, vx: 0, vy: 0, r: 8, links: ["core", "index"] },
      { id: "cache", label: "Кэш памяти", x: 0.82, y: 0.52, vx: 0, vy: 0, r: 6, links: ["core", "crdt"] }
    ];

    let selectedNode = nodes[0];
    let draggedNode = null;
    let pulseWave = 0;

    function onResize() {
      const res = setupHiDPICanvas(canvas);
      ctx = res.ctx;
      width = res.width;
      height = res.height;
    }
    window.addEventListener("resize", onResize);

    function getNodeAt(x, y) {
      for (const n of nodes) {
        const nx = n.x * width;
        const ny = n.y * height;
        const dist = Math.hypot(nx - x, ny - y);
        if (dist <= n.r + 10) return n;
      }
      return null;
    }

    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const found = getNodeAt(mx, my);
      if (found) {
        selectedNode = found;
        draggedNode = found;
        updateUI();
      }
    });

    window.addEventListener("mouseup", () => {
      draggedNode = null;
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      if (draggedNode) {
        draggedNode.x = clamp(mx / width, 0.08, 0.92);
        draggedNode.y = clamp(my / height, 0.12, 0.88);
      } else {
        const hovered = getNodeAt(mx, my);
        canvas.style.cursor = hovered ? "pointer" : "default";
        if (tooltipEl) {
          tooltipEl.textContent = hovered 
            ? `Узел: ${hovered.label} · Связей: ${hovered.links.length}`
            : "Нажмите и перетаскивайте узлы для анализа графа связей";
        }
      }
    });

    function updateUI() {
      if (activeNodeEl) activeNodeEl.textContent = selectedNode.label;
      if (edgeCountEl) {
        const count = selectedNode.links.length;
        const word = (count === 1) ? "СВЯЗЬ" : (count >= 2 && count <= 4 ? "СВЯЗИ" : "СВЯЗЕЙ");
        edgeCountEl.textContent = `${count} ${word}`;
      }
    }

    benchmarkBtn?.addEventListener("click", () => {
      pulseWave = 1.0;
      if (statusEl) {
        statusEl.textContent = "ПАРСИНГ...";
        statusEl.style.color = "var(--text-accent)";
      }
      setTimeout(() => {
        if (statusEl) {
          statusEl.textContent = "ИНДЕКСИРОВАНО";
          statusEl.style.color = "var(--status-green)";
        }
      }, 500);
    });

    function renderPrism() {
      ctx.clearRect(0, 0, width, height);

      const isSlate = document.body.classList.contains("theme-slate");
      const baseEdge = isSlate ? "rgba(255, 255, 255, 0.12)" : "rgba(20, 20, 20, 0.12)";
      const highlightEdge = isSlate ? "rgba(224, 108, 82, 0.65)" : "rgba(196, 77, 52, 0.65)";

      // Draw Edges
      nodes.forEach((source) => {
        const sx = source.x * width;
        const sy = source.y * height;

        source.links.forEach((targetId) => {
          const target = nodes.find((n) => n.id === targetId);
          if (!target) return;
          const tx = target.x * width;
          const ty = target.y * height;

          const isHighlighted = (source === selectedNode || target === selectedNode);
          ctx.beginPath();
          ctx.strokeStyle = isHighlighted ? highlightEdge : baseEdge;
          ctx.lineWidth = isHighlighted ? 1.6 : 1;
          ctx.moveTo(sx, sy);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        });
      });

      // Draw Benchmark Pulse
      if (pulseWave > 0) {
        pulseWave -= 0.02;
        nodes.forEach((n) => {
          const nx = n.x * width;
          const ny = n.y * height;
          ctx.beginPath();
          ctx.arc(nx, ny, n.r + (1 - pulseWave) * 22, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(43, 130, 70, ${pulseWave * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      // Draw Nodes
      nodes.forEach((n) => {
        const nx = n.x * width;
        const ny = n.y * height;
        const isSelected = (n === selectedNode);

        // Node Glow / Outer Ring
        ctx.beginPath();
        ctx.arc(nx, ny, n.r + (isSelected ? 5 : 2), 0, Math.PI * 2);
        ctx.strokeStyle = isSelected 
          ? (isSlate ? "#E06C52" : "#C44D34") 
          : (isSlate ? "rgba(255,255,255,0.2)" : "rgba(20,20,20,0.18)");
        ctx.stroke();

        // Node Inner Core
        ctx.beginPath();
        ctx.arc(nx, ny, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isSelected 
          ? (isSlate ? "#E06C52" : "#C44D34") 
          : (isSlate ? "#F4F3EE" : "#1A1A1A");
        ctx.fill();

        // Node Label
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected 
          ? (isSlate ? "#F4F3EE" : "#1A1A1A") 
          : (isSlate ? "#A8A59C" : "#5C5952");
        ctx.textAlign = "center";
        ctx.fillText(n.label, nx, ny + n.r + 14);
      });

      requestAnimationFrame(renderPrism);
    }
    renderPrism();
  }

  // =========================================================================
  // 7. PROJECT 03: HERMES TELEGRAM BOT SIMULATOR
  // =========================================================================
  function initHermesBot() {
    const chatHistory = document.getElementById("tgChatHistory");
    const inputField = document.getElementById("tgInput");
    const sendBtn = document.getElementById("tgSendBtn");
    const quickCmds = document.querySelectorAll(".tg-cmd-btn");
    if (!chatHistory) return;

    function getCurrentTime() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    }

    function addMessage(htmlContent, isOutgoing = false) {
      const msgDiv = document.createElement("div");
      msgDiv.className = `tg-msg ${isOutgoing ? "tg-outgoing" : "tg-incoming"}`;
      
      msgDiv.innerHTML = `
        <div class="tg-bubble">
          <div class="tg-text">${htmlContent}</div>
          <span class="tg-time">${getCurrentTime()}</span>
        </div>
      `;
      chatHistory.appendChild(msgDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
      return msgDiv;
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement("div");
      typingDiv.className = "tg-msg tg-incoming tg-typing";
      typingDiv.innerHTML = `
        <div class="tg-bubble" style="padding: 6px 12px; font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">
          <span>Hermes печатает...</span>
        </div>
      `;
      chatHistory.appendChild(typingDiv);
      chatHistory.scrollTop = chatHistory.scrollHeight;
      return typingDiv;
    }

    function processCommand(rawCommand) {
      const cmd = rawCommand.trim().toLowerCase();
      if (!cmd) return;

      // Add user command message
      addMessage(`<code>${escapeHTML(rawCommand)}</code>`, true);

      // Show typing indicator
      const typing = showTypingIndicator();

      setTimeout(() => {
        typing.remove();

        let responseHTML = "";

        if (cmd === "/status" || cmd === "status") {
          responseHTML = `
            <strong>⚡ СОСТОЯНИЕ СИСТЕМЫ: В НОРМЕ</strong><br>
            • Edge-кластер: <code>14 узлов активны</code><br>
            • Задержка P99: <code>18.4 мс</code><br>
            • Диспетчер Redis: <code>0 ошибок / 24ч</code><br>
            • Вебхук Ingress: <code>Подтверждён 200 OK</code>
          `;
        } else if (cmd === "/metrics" || cmd === "metrics") {
          responseHTML = `
            <strong>📊 ТЕЛЕМЕТРИЯ КЛАСТЕРА</strong><br>
            • Нагрузка CPU: <code>14.2%</code><br>
            • Память (Resident): <code>182 МБ / 512 МБ</code><br>
            • Пропускная способность: <code>4 290 событий/сек</code><br>
            • Аптайм: <code>99.98% (42 дня без сбоев)</code>
          `;
        } else if (cmd === "/anomalies" || cmd === "anomalies") {
          responseHTML = `
            <strong>🔍 РЕЗУЛЬТАТЫ СКАНИРОВАНИЯ АНОМАЛИЙ</strong><br>
            • Входящий трафик регионов: <code>0 аномалий</code><br>
            • Потеря пакетов: <code>0.001% (номинально)</code><br>
            • Истечение TLS: <code>Осталось 284 дня</code><br>
            <em>Все проверки безопасности строго пройдены.</em>
          `;
        } else if (cmd === "/deploy" || cmd === "deploy") {
          responseHTML = `
            <strong>🚀 КОНВЕЙЕР РАЗВЁРТЫВАНИЯ</strong><br>
            • Целевая среда: <code>Production Edge Mesh</code><br>
            • SHA релиза: <code>#a8f23c9</code><br>
            • Канареечный тест: <code>Пройден (100% трафика переключено)</code><br>
            • Статус: <code>Автооткат в случае сбоя активирован.</code>
          `;
        } else if (cmd === "/ping" || cmd === "ping") {
          responseHTML = `<code>pong (задержка: 16 мс, джиттер: 0.8 мс)</code>`;
        } else if (cmd === "/help" || cmd === "help") {
          responseHTML = `
            <strong>ДОСТУПНЫЕ КОМАНДЫ ТЕЛЕМЕТРИИ:</strong><br>
            • <code>/status</code> — Состояние и работоспособность edge-кластера<br>
            • <code>/metrics</code> — Пропускная способность и потребление ресурсов в реальном времени<br>
            • <code>/anomalies</code> — Анализ журналов исключений по регионам<br>
            • <code>/deploy</code> — Оркестратор канареечного развёртывания
          `;
        } else {
          responseHTML = `
            <em>Команда <code>${escapeHTML(rawCommand)}</code> принята как пользовательский запрос.</em><br>
            Симулятор Hermes обработал запрос с кодом возврата <code>0</code>. Введите <code>/help</code> для списка доступных команд.
          `;
        }

        addMessage(responseHTML, false);
      }, 420);
    }

    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, (tag) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[tag] || tag));
    }

    // Submit handler
    sendBtn?.addEventListener("click", () => {
      const val = inputField.value;
      if (val.trim()) {
        processCommand(val);
        inputField.value = "";
      }
    });

    inputField?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = inputField.value;
        if (val.trim()) {
          processCommand(val);
          inputField.value = "";
        }
      }
    });

    quickCmds.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cmd = btn.dataset.cmd;
        if (cmd) processCommand(cmd);
      });
    });
  }

  // =========================================================================
  // INITIALIZATION ON DOM READY
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    initHeaderAndTheme();
    initCustomCursor();
    initHeroCanvas();
    initAuraProject();
    initPrismProject();
    initHermesBot();
  });
})();
