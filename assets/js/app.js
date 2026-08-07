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
})();
