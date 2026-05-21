
let solutions = [];
let activeCategory = "all";

const resultsEl = document.querySelector("#results");
const resultsTitle = document.querySelector("#resultsTitle");
const resultsHint = document.querySelector("#resultsHint");
const buttons = document.querySelectorAll(".choice-btn");

const filters = {
  industry: document.querySelector("#industryFilter"),
  income: document.querySelector("#incomeFilter"),
  difficulty: document.querySelector("#difficultyFilter"),
  risk: document.querySelector("#riskFilter")
};

async function loadSolutions() {
  try {
    const response = await fetch("./data/solutions.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    solutions = await response.json();
    trackAction("view_home");
    renderSolutions();
  } catch (err) {
    resultsEl.innerHTML = `
      <div class="empty-state">
        <div>
          <strong>数据加载失败</strong>
          <p>请确认已用本地服务器打开，并且 data/solutions.json 存在。</p>
          <p>${escapeHTML(err.message)}</p>
        </div>
      </div>
    `;
  }
}

function matchRisk(itemRisk, maxRisk) {
  if (maxRisk === "all") return true;
  const order = { low: 1, medium: 2, high: 3 };
  return (order[itemRisk] || 2) <= (order[maxRisk] || 3);
}

function getFilteredSolutions() {
  const industry = filters.industry.value;
  const income = filters.income.value;
  const difficulty = filters.difficulty.value;
  const risk = filters.risk.value;

  return solutions.filter(item => {
    if (activeCategory !== "all" && item.category !== activeCategory) return false;
    if (industry !== "all" && item.industry_category !== industry) return false;
    if (income !== "all" && item.income_model !== income) return false;
    if (difficulty !== "all" && Number(item.difficulty || 3) > Number(difficulty)) return false;
    if (!matchRisk(item.risk_level || "medium", risk)) return false;
    return true;
  });
}

function renderSolutions() {
  const matched = getFilteredSolutions();
  resultsEl.innerHTML = "";
  resultsTitle.textContent = activeCategory === "all" ? "全部推荐方案" : categoryText[activeCategory];
  resultsHint.textContent = `当前匹配 ${matched.length} 个方案。登录后可收藏方案和领取资料包。`;

  if (!matched.length) {
    resultsEl.innerHTML = `<div class="empty-state"><div><strong>暂无匹配方案</strong><p>请调整分类、难度或风险筛选条件。</p></div></div>`;
    return;
  }

  matched.forEach(item => {
    const card = document.createElement("article");
    card.className = "solution-card";
    const tags = Array.isArray(item.industry_tags) ? item.industry_tags : [];
    const favorited = isFavorite(item.id);
    card.innerHTML = `
      <div class="solution-top">
        <h4>${escapeHTML(item.title)}</h4>
        <span class="tag">${categoryText[item.category] || item.category}</span>
      </div>
      <p>${escapeHTML(item.description || "")}</p>
      <div class="tag-row">
        <span class="pill">${industryText[item.industry_category] || item.industry_category || "未分类"}</span>
        <span class="pill">${incomeText[item.income_model] || item.income_model || "未分类"}</span>
        <span class="pill ${riskClass(item.risk_level)}">风险：${levelText[item.risk_level] || item.risk_level || "中"}</span>
        <span class="pill">可信度：${item.credibility_score || 3}/5</span>
      </div>
      <div class="meta-grid">
        <div class="meta-item">难度：${renderStars(item.difficulty)}</div>
        <div class="meta-item">时间：${levelText[item.required_time] || "中"}</div>
        <div class="meta-item">技能：${levelText[item.required_skill] || "中"}</div>
        <div class="meta-item">资金：${levelText[item.required_money] || "低"}</div>
      </div>
      <div class="tag-row">
        ${tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}
      </div>
      <details>
        <summary>查看行动层步骤</summary>
        <ol class="steps">
          ${(item.steps || []).map(step => `<li>${escapeHTML(step)}</li>`).join("")}
        </ol>
      </details>
      <div class="card-actions">
        <a class="ghost-btn" href="solution-detail.html?id=${encodeURIComponent(item.id)}&title=${encodeURIComponent(item.title || '')}" data-detail="${escapeHTML(item.id)}">查看详情</a>
        <button class="primary-btn" data-fav="${escapeHTML(item.id)}">${favorited ? "已收藏" : "收藏"}</button>
        <a class="ghost-btn" href="resources.html">领取资料</a>
      </div>
    `;
    resultsEl.appendChild(card);
  });
}

document.addEventListener("click", e => {
  const favId = e.target.getAttribute("data-fav");
  if (favId) {
    const item = solutions.find(s => s.id === favId);
    if (!item) return;
    const status = toggleFavorite(item);
    renderSolutions();
  }
  const detailLink = e.target.closest("[data-detail]");
  const detailId = detailLink ? detailLink.getAttribute("data-detail") : "";
  if (detailId) {
    e.preventDefault();
    const item = solutions.find(s => String(s.id) === String(detailId));
    const titleQuery = item && item.title ? `&title=${encodeURIComponent(item.title)}` : "";
    const targetUrl = `solution-detail.html?id=${encodeURIComponent(detailId)}${titleQuery}`;

    localStorage.setItem("mp_selected_solution_id", String(detailId));
    if (item && item.title) {
      localStorage.setItem("mp_selected_solution_title", item.title);
    }

    const user = getCurrentUser();
    if (!user) {
      alert("方案详情仅对注册用户开放。请先注册或登录。");
      location.href = `login.html?next=${encodeURIComponent(targetUrl)}`;
      return;
    }
    location.href = targetUrl;
  }
});

buttons.forEach(button => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    buttons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    trackAction("filter_category", activeCategory);
    renderSolutions();
  });
});
Object.values(filters).forEach(select => select.addEventListener("change", () => {
  trackAction("filter_change", "", {
    industry: filters.industry.value,
    income: filters.income.value,
    difficulty: filters.difficulty.value,
    risk: filters.risk.value
  });
  renderSolutions();
}));

loadSolutions();
