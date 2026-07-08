const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterButtons = document.querySelectorAll(".filter");
const tutorialCards = document.querySelectorAll(".tutorial-card");
const portfolioForm = document.querySelector("#portfolio-form");
const portfolioSave = document.querySelector("#portfolio-save");
const portfolioRows = document.querySelector("#portfolio-rows");
const portfolioTotal = document.querySelector("[data-portfolio-total]");
const portfolioStorageKey = "investment-nav-portfolio";

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

const readPortfolio = () => {
  try {
    return JSON.parse(localStorage.getItem(portfolioStorageKey)) || [];
  } catch {
    return [];
  }
};

const writePortfolio = (items) => {
  localStorage.setItem(portfolioStorageKey, JSON.stringify(items));
};

const formatMoney = (value) =>
  new Intl.NumberFormat("zh-CN", {
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

const renderPortfolio = () => {
  if (!portfolioRows || !portfolioTotal) return;

  const items = readPortfolio();
  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  portfolioTotal.textContent = formatMoney(total);

  if (!items.length) {
    portfolioRows.innerHTML =
      '<tr class="empty-row"><td colspan="8">还没有记录。先添加一笔持仓，建立自己的资产地图。</td></tr>';
    return;
  }

  portfolioRows.innerHTML = items
    .map((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const cost = Number(item.cost) || 0;
      const price = Number(item.price) || 0;
      const pnl = (price - cost) * quantity;
      const pnlClass = pnl >= 0 ? "gain" : "loss";

      return `
        <tr>
          <td>${item.type}</td>
          <td>${item.platform || "-"}</td>
          <td><strong>${item.asset}</strong></td>
          <td>${formatMoney(quantity)}</td>
          <td>${formatMoney(cost)}</td>
          <td>${formatMoney(price)}</td>
          <td class="${pnlClass}">${pnl >= 0 ? "+" : ""}${formatMoney(pnl)}</td>
          <td><button type="button" data-delete-portfolio="${index}">删除</button></td>
        </tr>
      `;
    })
    .join("");
};

const savePortfolioEntry = () => {
  if (!portfolioForm) return;

  const formData = new FormData(portfolioForm);
  const item = {
    type: formData.get("type"),
    platform: formData.get("platform")?.trim(),
    asset: formData.get("asset")?.trim(),
    quantity: Number(formData.get("quantity")) || 0,
    cost: Number(formData.get("cost")) || 0,
    price: Number(formData.get("price")) || 0,
  };

  if (!item.asset) return;

  const items = readPortfolio();
  items.push(item);
  writePortfolio(items);
  portfolioForm.reset();
  renderPortfolio();
};

portfolioForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  savePortfolioEntry();
});

portfolioSave?.addEventListener("click", () => {
  savePortfolioEntry();
});

portfolioRows?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-portfolio]");
  if (!button) return;

  const index = Number(button.dataset.deletePortfolio);
  const items = readPortfolio();
  items.splice(index, 1);
  writePortfolio(items);
  renderPortfolio();
});

renderPortfolio();
