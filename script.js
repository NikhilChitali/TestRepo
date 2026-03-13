const filterChips = document.querySelectorAll(".filter-chip");
const skillCards = document.querySelectorAll(".skill-card");
const detailGroups = document.querySelectorAll(".timeline-card");
const copyButtons = document.querySelectorAll("[data-copy]");
const toast = document.querySelector(".toast");
const revealTargets = document.querySelectorAll(
  ".section, .skill-card, .timeline-card, .panel, .stat-card, .console-card"
);

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
};

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");

    const filter = chip.dataset.filter;
    skillCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const matches = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !matches);
    });
  });
});

detailGroups.forEach((group) => {
  const pills = group.querySelectorAll(".detail-pill");
  const panels = group.querySelectorAll(".detail-panel");
  if (!pills.length) {
    return;
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const target = pill.dataset.detail;
      pills.forEach((item) => item.classList.toggle("is-selected", item === pill));
      panels.forEach((panel) => {
        panel.classList.toggle("is-hidden", panel.dataset.panel !== target);
      });
    });
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast(`Copied ${value}`);
    } catch (error) {
      showToast("Copy failed on this browser");
    }
  });
});

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", `${Math.min(index * 45, 260)}ms`);
    target.classList.add("reveal");
    observer.observe(target);
  });
}
