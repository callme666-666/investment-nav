const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterButtons = document.querySelectorAll(".filter");
const tutorialCards = document.querySelectorAll(".tutorial-card");

menuToggle?.addEventListener("click", () => {
  navLinks?.classList.toggle("open");
});

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    tutorialCards.forEach((card) => {
      const shouldShow = selected === "all" || card.dataset.category === selected;
      card.hidden = !shouldShow;
    });
  });
});
