
const currentUser = requireLogin("login.html");

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

function buildWeekPlan(item) {
  const steps = Array.isArray(item.steps) ? item.steps : [];
  if (steps.length >= 4) return steps.slice(0, 4);
  return [
    "明确目标用户，并记录他们最常见的需求和痛点。",
    "设计一个最小服务或产品版本，不急于做复杂功能。",
    "找到 3-5 个真实用户试用，收集反馈。",
    "根据反馈优化报价、交付流程和获客话术。"
  ];
}

function inferFitPeople(item) {
  const category = item.category;
  if (category === "part-time") return ["每天有一定碎片时间", "希望低成本开始", "愿意先从小范围测试", "能持续执行基础服务或内容发布"];
  if (category === "skill") return ["已有某项专业能力", "能把经验转化成服务或模板", "愿意与客户沟通", "希望提高单位时间收益"];
  if (category === "investment") return ["能接受小额试错", "愿意看数据复盘", "能承担一定失败风险", "希望通过工具、投放或轻资产项目放大收益"];
  return ["希望寻找低成本赚钱路径", "愿意根据自身条件筛选方向"];
}

function inferNotFitPeople(item) {
  const risk = item.risk_level || "medium";
  const arr = ["希望短期暴富的人", "不愿意持续执行和复盘的人"];
  if (risk === "high") arr.push("完全不能承受失败成本的人");
  if ((item.required_skill || "medium") === "high") arr.push("暂时没有相关经验且不愿学习的人");
  return arr;
}

function renderSource(item) {
  if (item.source_url) {
    return `<a href="${escapeHTML(item.source_url)}" target="_blank" rel="noopener" class="detail-source-link">${escapeHTML(item.source_title || "查看来源")}</a>`;
  }
  return `<span class="detail-source-link muted">暂无来源链接</span>`;
}

async function loadDetail() {
  if (!currentUser) return;

  let id = getParam("id");
  let titleParam = getParam("title");

  if (!id) {
    id = localStorage.getItem("mp_selected_solution_id") || "";
  }
  if (!titleParam) {
    titleParam = localStorage.getItem("mp_selected_solution_title") || "";
  }
  const box = document.querySelector("#detailContent");

  try {
    const response = await fetch("./data/solutions.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const solutions = await response.json();
    let item = solutions.find(s => String(s.id) === String(id));
    if (!item && titleParam) {
      item = solutions.find(s => String(s.title) === String(titleParam));
    }
    if (!item && id) {
      item = solutions.find(s => String(s.title) === String(id));
    }
    if (!item && Array.isArray(solutions) && solutions.length) {
      item = solutions[0];
    }

    if (!item) {
      box.innerHTML = `<div class="empty-state"><div><strong>未找到方案</strong><p>请确认 data/solutions.json 是否正常加载。</p></div></div>`;
      return;
    }

    localStorage.setItem("mp_selected_solution_id", String(item.id || ""));
    localStorage.setItem("mp_selected_solution_title", String(item.title || ""));

    document.title = `${item.title} - 财富路径引导`;
    document.querySelector("#detailTitle").textContent = item.title;
    document.querySelector("#detailDesc").textContent = item.description || "";

    trackAction("view_solution_detail", item.id, { title: item.title });

    const d = item.detail || {};
    const tags = Array.isArray(item.industry_tags) ? item.industry_tags : [];
    const weekPlan = Array.isArray(d.first_week_plan) && d.first_week_plan.length ? d.first_week_plan : buildWeekPlan(item);
    const fitPeople = Array.isArray(d.suitable_people) && d.suitable_people.length ? d.suitable_people : inferFitPeople(item);
    const notFit = Array.isArray(d.unsuitable_people) && d.unsuitable_people.length ? d.unsuitable_people : inferNotFitPeople(item);
    const customerChannels = Array.isArray(d.customer_channels) && d.customer_channels.length ? d.customer_channels : ["从最接近目标用户的社群、朋友圈、小红书、抖音或本地微信群开始测试。", "先用 1 个明确服务或产品做样板，不要同时铺开太多方向。", "记录咨询、收藏、付费和复购数据，用数据判断是否继续投入。"];
    const riskNotes = Array.isArray(d.risk_notes) && d.risk_notes.length ? d.risk_notes : ["不承诺固定收益，不建议投入超出自身承受能力的资金。", "涉及线下服务时，需要明确责任边界、服务流程和安全规则。", "涉及内容和资料售卖时，避免侵权搬运和虚假宣传。"];
    const toolsNeeded = Array.isArray(d.tools_needed) ? d.tools_needed : [];
    const deliverables = Array.isArray(d.deliverables) ? d.deliverables : [];
    const resourcePacks = Array.isArray(d.resource_pack_suggestions) ? d.resource_pack_suggestions : [];
    const favorited = isFavorite(item.id);

    box.innerHTML = `
      <aside class="detail-side panel-card">
        <div class="detail-score">
          <strong>${item.credibility_score || 3}/5</strong>
          <span>可信度评分</span>
        </div>

        <div class="detail-meta-list">
          <div><span>一级入口</span><b>${categoryText[item.category] || item.category || "未分类"}</b></div>
          <div><span>行业方向</span><b>${industryText[item.industry_category] || item.industry_category || "未分类"}</b></div>
          <div><span>赚钱模式</span><b>${incomeText[item.income_model] || item.income_model || "未分类"}</b></div>
          <div><span>执行难度</span><b>${renderStars(item.difficulty || 3)}</b></div>
          <div><span>风险等级</span><b>${levelText[item.risk_level] || item.risk_level || "中"}</b></div>
          <div><span>时间投入</span><b>${levelText[item.required_time] || item.required_time || "中"}</b></div>
          <div><span>技能要求</span><b>${levelText[item.required_skill] || item.required_skill || "中"}</b></div>
          <div><span>资金要求</span><b>${levelText[item.required_money] || item.required_money || "低"}</b></div>
        </div>

        <div class="tag-row">
          ${tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join("")}
        </div>

        <div class="detail-actions">
          <button class="primary-btn" id="favBtn">${favorited ? "已收藏" : "收藏方案"}</button>
          <a href="resources.html" class="ghost-btn">领取相关资料</a>
        </div>
      </aside>

      <article class="detail-main">
        <section class="detail-block">
          <h2>核心逻辑</h2>
          <p>${escapeHTML(d.core_logic || item.description || "暂无说明。")}</p>
        </section>

        <section class="detail-grid-2">
          <div class="detail-block">
            <h2>目标客户与成交理由</h2>
            <p><strong>谁会付钱：</strong>${escapeHTML(d.target_customer || "暂无明确目标客户。")}</p>
            <p style="margin-top:12px;"><strong>为什么付钱：</strong>${escapeHTML(d.payment_reason || "暂无成交理由。")}</p>
          </div>
          <div class="detail-block">
            <h2>第一单怎么来</h2>
            <p>${escapeHTML(d.first_order_strategy || "暂无第一单策略。")}</p>
          </div>
        </section>

        <section class="detail-block">
          <h2>具体交付流程</h2>
          <ol class="detail-steps">
            ${((Array.isArray(d.delivery_process) && d.delivery_process.length ? d.delivery_process : item.steps || [])).map(step => `<li>${escapeHTML(step)}</li>`).join("")}
          </ol>
        </section>

        <section class="detail-block">
          <h2>行动步骤</h2>
          <ol class="detail-steps">
            ${(item.steps || []).map(step => `<li>${escapeHTML(step)}</li>`).join("")}
          </ol>
        </section>

        <section class="detail-grid-2">
          <div class="detail-block">
            <h2>适合人群</h2>
            <ul class="detail-list">
              ${fitPeople.map(x => `<li>${escapeHTML(x)}</li>`).join("")}
            </ul>
          </div>
          <div class="detail-block">
            <h2>不适合人群</h2>
            <ul class="detail-list">
              ${notFit.map(x => `<li>${escapeHTML(x)}</li>`).join("")}
            </ul>
          </div>
        </section>

        <section class="detail-block">
          <h2>第一周行动计划</h2>
          <div class="week-plan">
            ${weekPlan.map((step, idx) => `
              <div class="week-card">
                <span>Day ${idx + 1}</span>
                <strong>${escapeHTML(step)}</strong>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="detail-grid-2">
          <div class="detail-block">
            <h2>获客渠道建议</h2>
            <ul class="detail-list">
              ${customerChannels.map(x => `<li>${escapeHTML(x)}</li>`).join("")}
            </ul>
          </div>
          <div class="detail-block">
            <h2>风险提醒</h2>
            <p><strong>最容易失败的地方：</strong>${escapeHTML(d.key_failure_point || "暂无失败点说明。")}</p>
            <ul class="detail-list" style="margin-top:12px;">
              ${riskNotes.map(x => `<li>${escapeHTML(x)}</li>`).join("")}
            </ul>
          </div>
        </section>

        <section class="detail-grid-2">
          <div class="detail-block">
            <h2>所需工具 / 资料</h2>
            <ul class="detail-list">
              ${(toolsNeeded.length ? toolsNeeded : ["服务报价表", "客户记录表", "推广文案", "复盘表"]).map(x => `<li>${escapeHTML(x)}</li>`).join("")}
            </ul>
          </div>
          <div class="detail-block">
            <h2>可交付内容</h2>
            <ul class="detail-list">
              ${(deliverables.length ? deliverables : ["基础服务", "执行清单", "客户反馈记录", "阶段复盘"]).map(x => `<li>${escapeHTML(x)}</li>`).join("")}
            </ul>
          </div>
        </section>

        <section class="detail-grid-2">
          <div class="detail-block">
            <h2>定价参考</h2>
            <p>${escapeHTML(d.pricing_reference || "建议先以小范围测试价格验证需求，不承诺固定收益。")}</p>
          </div>
          <div class="detail-block">
            <h2>升级路径</h2>
            <p>${escapeHTML(d.upgrade_path || "从单次服务或单个产品开始，积累案例后再升级为套餐、会员或长期服务。")}</p>
          </div>
        </section>

        <section class="detail-block">
          <h2>可配套资料包</h2>
          <div class="tag-row">
            ${(resourcePacks.length ? resourcePacks : ["执行清单", "客户沟通话术", "报价表", "风险说明模板"]).map(x => `<span class="tag">${escapeHTML(x)}</span>`).join("")}
          </div>
        </section>

        <section class="detail-block">
          <h2>来源依据</h2>
          <p>${renderSource(item)}</p>
        </section>
      </article>
    `;

    document.querySelector("#favBtn").addEventListener("click", () => {
      toggleFavorite(item);
      loadDetail();
    });
  } catch (err) {
    box.innerHTML = `<div class="empty-state"><div><strong>加载失败</strong><p>${escapeHTML(err.message)}</p></div></div>`;
  }
}

loadDetail();
