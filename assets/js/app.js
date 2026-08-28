(function () {
  const navItems = [
    ["Home", "/index.html"],
    ["About", "/pages/about.html"],
    ["Projects", "/pages/projects.html"],
    ["Experience", "/pages/experience.html"],
    ["Resume", "/pages/resume.html"],
    ["Contact", "/pages/contact.html"]
  ];

  const path = window.location.pathname;
  const repoPrefix = path.includes("/portfolio/") ? "/portfolio" : "";

  const fixHref = (href) => {
    if (!repoPrefix) return href;
    return href.startsWith("/portfolio") ? href : `${repoPrefix}${href}`;
  };

  const headerTarget = document.getElementById("site-header");
  const footerTarget = document.getElementById("site-footer");

  if (headerTarget) {
    const navLinks = navItems
      .map(([label, href]) => {
        const fixed = fixHref(href);
        const active = path.endsWith(href) || (href === "/index.html" && (path.endsWith("/") || path.endsWith("index.html")));
        return `<li><a class="nav-link ${active ? "active" : ""}" href="${fixed}">${label}</a></li>`;
      })
      .join("");

    headerTarget.className = "site-header";
    headerTarget.innerHTML = `
      <div class="container nav-wrap">
        <a class="brand" href="${fixHref("/index.html")}">Rakesh Olanda</a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">Menu</button>
      </div>
      <div class="container">
        <ul class="nav-links" id="nav-links">${navLinks}</ul>
      </div>
    `;

    const toggle = document.getElementById("nav-toggle");
    const links = document.getElementById("nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const isOpen = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }
  }

  if (footerTarget) {
    footerTarget.className = "site-footer";
    footerTarget.innerHTML = `<div class="container">© ${new Date().getFullYear()} Rakesh Olanda · Built with HTML, CSS, and JavaScript.</div>`;
  }

  const animateNodes = document.querySelectorAll(".animate");
  if ("IntersectionObserver" in window && animateNodes.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    animateNodes.forEach((node) => observer.observe(node));
  } else {
    animateNodes.forEach((node) => node.classList.add("in"));
  }

  const typingTarget = document.querySelector("[data-typing]");
  if (typingTarget) {
    const words = ["Software Engineer", "Cybersecurity", "AI"]; 
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typingTarget.textContent = current.slice(0, charIndex);

      if (!deleting && charIndex === current.length) {
        deleting = true;
        return setTimeout(tick, 950);
      }
      if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
      setTimeout(tick, deleting ? 45 : 90);
    };

    tick();
  }

  const pageTitle = document.querySelector("main h1.section-title");
  if (pageTitle) {
    const fullTitle = pageTitle.textContent ? pageTitle.textContent.trim() : "";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (fullTitle && !reduceMotion) {
      const titleWords = [fullTitle];
      let titleWordIndex = 0;
      let titleCharIndex = 0;
      let deletingTitle = false;

      pageTitle.textContent = "";
      pageTitle.classList.add("is-typing");

      const tickTitle = () => {
        const current = titleWords[titleWordIndex];
        titleCharIndex += deletingTitle ? -1 : 1;
        pageTitle.textContent = current.slice(0, titleCharIndex);

        if (!deletingTitle && titleCharIndex === current.length) {
          deletingTitle = true;
          window.setTimeout(tickTitle, 950);
          return;
        }

        if (deletingTitle && titleCharIndex === 0) {
          deletingTitle = false;
          titleWordIndex = (titleWordIndex + 1) % titleWords.length;
          window.setTimeout(tickTitle, 180);
          return;
        }

        window.setTimeout(tickTitle, deletingTitle ? 45 : 90);
      };

      tickTitle();
    }
  }

  const filterButtons = document.querySelectorAll("[data-filter-btn]");
  const projectCards = document.querySelectorAll("[data-project-card]");
  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter-btn");

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
          const tags = card.getAttribute("data-tags") || "";
          const show = filter === "all" || tags.includes(filter);
          card.style.display = show ? "block" : "none";
        });
      });
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    const contactStatus = contactForm.querySelector("[data-contact-status]");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      if (contactStatus) {
        contactStatus.textContent = "Opening your email app...";
      }

      const subject = `Portfolio contact from ${name || "Website Visitor"}`;
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      window.location.href = `mailto:rakeshbarker@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const pixelGame = document.querySelector("[data-pixel-game]");
  if (pixelGame) {
    const canvas = pixelGame.querySelector("[data-game-canvas]");
    const context = canvas.getContext("2d");
    const scoreTarget = pixelGame.querySelector("[data-game-score]");
    const levelTarget = pixelGame.querySelector("[data-game-level]");
    const abilityTarget = pixelGame.querySelector("[data-game-ability]");
    const livesTarget = pixelGame.querySelector("[data-game-lives]");
    const game = {
      playerX: canvas.width / 2,
      autoDirection: 1,
      score: 0,
      level: 1,
      waveStarted: false,
      abilityType: "STANDARD",
      abilityTimeLeft: 0,
      lives: 3,
      lastTime: 0,
      spawnTimer: 0,
      shootTimer: 0,
      bullets: [],
      blocks: [],
      powerups: [],
      stars: Array.from({ length: 42 }, (_, index) => ({
        x: (index * 83) % canvas.width,
        y: (index * 47) % canvas.height,
        size: index % 3 === 0 ? 2 : 1
      }))
    };

    const updateHud = () => {
      scoreTarget.textContent = String(game.score).padStart(4, "0");
      levelTarget.textContent = String(game.level);
      abilityTarget.textContent = game.abilityType;
      livesTarget.textContent = String(game.lives);
    };

    const shoot = () => {
      const startX = game.playerX;
      const startY = canvas.height - 35;
      const target = game.blocks.reduce((closest, block) => {
        const targetX = block.x + block.size / 2;
        if (Math.abs(targetX - startX) > 12) return closest;
        if (!closest || block.y > closest.y) return block;
        return closest;
      }, null);
      if (!target) return;
      game.bullets.push({
        x: startX,
        y: startY,
        velocityY: -260
      });
    };

    const resetGame = () => {
      game.playerX = canvas.width / 2;
      game.autoDirection = 1;
      game.score = 0;
      game.level = 1;
      game.waveStarted = false;
      game.abilityType = "STANDARD";
      game.abilityTimeLeft = 0;
      game.lives = 3;
      game.bullets = [];
      game.blocks = [];
      game.powerups = [];
      game.shootTimer = 0;
      updateHud();
    };

    const drawPixelShip = () => {
      const shipY = canvas.height - 25;
      context.fillStyle = "#79c0ff";
      context.fillRect(game.playerX - 3, shipY - 20, 6, 20);
      context.fillRect(game.playerX - 10, shipY - 12, 20, 12);
      context.fillStyle = "#7ee787";
      context.fillRect(game.playerX - 15, shipY - 6, 5, 6);
      context.fillRect(game.playerX + 10, shipY - 6, 5, 6);
      if (game.abilityType === "SHIELD") {
        context.strokeStyle = "#79c0ff";
        context.strokeRect(game.playerX - 18, shipY - 24, 36, 26);
      }
      context.fillStyle = "#ffa657";
      context.fillRect(game.playerX - 3, shipY, 6, 4);
    };

    const drawEnemyShip = (enemy) => {
      const centerX = enemy.x + enemy.size / 2;
      context.fillStyle = "#ff6b6b";
      context.fillRect(centerX - 3, enemy.y, 6, 4);
      context.fillRect(centerX - 7, enemy.y + 4, 14, 5);
      context.fillStyle = "#ffa657";
      context.fillRect(centerX - 11, enemy.y + 8, 22, 4);
      context.fillStyle = "#d2a8ff";
      context.fillRect(centerX - 3, enemy.y + 4, 6, 4);
      context.fillStyle = "#7ee787";
      context.fillRect(centerX - 8, enemy.y + 12, 4, 3);
      context.fillRect(centerX + 4, enemy.y + 12, 4, 3);
    };

    const draw = () => {
      context.fillStyle = "#07151d";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#1b5662";
      game.stars.forEach((star) => context.fillRect(star.x, star.y, star.size, star.size));
      game.blocks.forEach(drawEnemyShip);
      game.powerups.forEach((powerup) => {
        context.fillStyle = powerup.type === "SHIELD" ? "#79c0ff" : "#7ee787";
        context.fillRect(powerup.x - 5, powerup.y - 5, 10, 10);
        context.fillStyle = "#07151d";
        context.fillRect(powerup.x - 2, powerup.y - 2, 4, 4);
      });
      context.fillStyle = "#f3f3f3";
      game.bullets.forEach((bullet) => context.fillRect(bullet.x - 1, bullet.y, 2, 7));
      drawPixelShip();
    };

    const update = (elapsed) => {
      const delta = Math.min(elapsed / 1000, .04);
      game.abilityTimeLeft = Math.max(0, game.abilityTimeLeft - elapsed);
      if (game.abilityTimeLeft === 0) game.abilityType = "STANDARD";
      const nearestBlock = game.blocks.reduce((closest, block) => {
        if (!closest || block.y > closest.y) return block;
        return closest;
      }, null);
      if (nearestBlock) {
        const targetX = nearestBlock.x + nearestBlock.size / 2;
        const distanceToTarget = targetX - game.playerX;
        if (Math.abs(distanceToTarget) > 5) {
          game.playerX += Math.sign(distanceToTarget) * 165 * delta;
        }
      } else {
        game.playerX += game.autoDirection * 70 * delta;
      }
      if (game.playerX >= canvas.width - 18) {
        game.playerX = canvas.width - 18;
        game.autoDirection = -1;
      }
      if (game.playerX <= 18) {
        game.playerX = 18;
        game.autoDirection = 1;
      }
      game.spawnTimer += elapsed;
      game.shootTimer += elapsed;
      const waveDelay = Math.max(350, 850 - game.level * 35);
      if (game.spawnTimer > waveDelay && game.blocks.length === 0) {
        if (game.waveStarted) game.level += 1;
        game.waveStarted = true;
        const shipCount = Math.min(3 + game.level, 7);
        const columns = Math.min(shipCount, 4);
        const spacing = 62;
        const startX = (canvas.width - ((columns - 1) * spacing)) / 2;
        const formation = game.level % 4;
        for (let index = 0; index < shipCount; index += 1) {
          const column = index % columns;
          const row = Math.floor(index / columns);
          const centeredColumn = column - (columns - 1) / 2;
          const formationOffset = formation === 1
            ? centeredColumn
            : formation === 2
              ? (index % 2 === 0 ? centeredColumn : centeredColumn + .5)
              : formation === 3
                ? (index < columns ? centeredColumn : centeredColumn * .5)
                : centeredColumn;
          game.blocks.push({
            x: canvas.width / 2 + formationOffset * spacing - 7,
            y: -14 - (formation === 1 ? Math.abs(centeredColumn) * 18 : row * 30),
            size: 14,
            speed: Math.min(34 + game.level * 4, 92),
            horizontalSpeed: Math.min(14 + game.level * 2, 42) + Math.random() * 10,
            horizontalDirection: index % 2 === 0 ? 1 : -1
          });
        }
        game.spawnTimer = 0;
      }
      if (game.shootTimer > (game.abilityType === "RAPID" ? 140 : 300)) {
        shoot();
        game.shootTimer = 0;
      }
      game.bullets.forEach((bullet) => {
        bullet.y += bullet.velocityY * delta;
      });
      game.blocks.forEach((block) => {
        block.y += block.speed * delta;
        block.x += block.horizontalDirection * block.horizontalSpeed * delta;
        if (block.x <= 14 || block.x >= canvas.width - 28) block.horizontalDirection *= -1;
      });
      game.powerups.forEach((powerup) => { powerup.y += 42 * delta; });
      game.powerups = game.powerups.filter((powerup) => {
        if (powerup.y > canvas.height - 48 && Math.abs(powerup.x - game.playerX) < 24) {
          game.abilityType = powerup.type;
          game.abilityTimeLeft = 7000;
          return false;
        }
        return powerup.y < canvas.height + 12;
      });
      game.bullets = game.bullets.filter((bullet) => bullet.y > -10);
      game.blocks = game.blocks.filter((block) => {
        const hit = game.bullets.some((bullet) => Math.abs(bullet.x - (block.x + block.size / 2)) < 17 && Math.abs(bullet.y - (block.y + block.size / 2)) < 19);
        if (hit) {
          game.score += 10;
          if (Math.random() < .08 && game.powerups.length === 0) {
            game.powerups.push({
              x: block.x + block.size / 2,
              y: block.y,
              type: Math.random() > .5 ? "SHIELD" : "RAPID"
            });
          }
          game.bullets = game.bullets.filter((bullet) => !(Math.abs(bullet.x - (block.x + block.size / 2)) < 17 && Math.abs(bullet.y - (block.y + block.size / 2)) < 19));
          return false;
        }
        if (block.y > canvas.height) {
          if (game.abilityType === "SHIELD") return false;
          game.lives -= 1;
          if (game.lives <= 0) resetGame();
          return false;
        }
        return true;
      });
      updateHud();
    };

    const frame = (time) => {
      const elapsed = game.lastTime ? time - game.lastTime : 0;
      game.lastTime = time;
      update(elapsed);
      draw();
      window.requestAnimationFrame(frame);
    };

    updateHud();
    window.requestAnimationFrame(frame);
  }

  const photoRotator = document.querySelector("[data-photo-rotator]");
  const rotatingPhotos = Array.from(document.querySelectorAll("[data-rotating-photo]"));
  if (photoRotator && rotatingPhotos.length > 1) {
    let activeIndex = 0;
    window.setInterval(() => {
      rotatingPhotos[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % rotatingPhotos.length;
      rotatingPhotos[activeIndex].classList.add("is-active");
    }, 3500);
  }

})();
