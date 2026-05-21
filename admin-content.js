
const DETAIL_FIELDS = [
  "core_logic",
  "suitable_people",
  "unsuitable_people",
  "startup_cost",
  "first_week_plan",
  "customer_channels",
  "tools_needed",
  "deliverables",
  "pricing_reference",
  "risk_notes",
  "resource_pack_suggestions",
  "upgrade_path",
  "target_customer",
  "payment_reason",
  "first_order_strategy",
  "delivery_process",
  "key_failure_point"
];

let officialSolutions = [];
let candidateSolutions = [];
let mode = "official";
let selectedIndex = -1;

const listEl = document.querySelector("#solutionList");
const form = document.querySelector("#editorForm");
const editorEmpty = document.querySelector("#editorEmpty");

function currentArray() {
  return mode === "official" ? officialSolutions : candidateSolutions;
}

function makeId(title = "solution") {
  const clean = String(title)
    .trim()
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "solution";
  return `${clean}-${Date.now().toString(36)}`;
}

function asLines(value) {
  if (Array.isArray(value)) return value.join("\n");
  if (value == null) return "";
  return String(value);
}

function linesToArray(value) {
  return String(value || "")
    .split(/\n|；|;/)
    .map(x => x.trim())
    .filter(Boolean);
}

function csvToArray(value) {
  return String(value || "")
    .split(/,|，/)
    .map(x => x.trim())
    .filter(Boolean);
}

function getDetail(item) {
  if (!item.detail || typeof item.detail !== "object") item.detail = {};
  return item.detail;
}

function isDetailComplete(item) {
  const d = item.detail;
  if (!d || typeof d !== "object") return false;
  return DETAIL_FIELDS.every(field => {
    const value = d[field];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && String(value).trim() !== "";
  });
}

function updateStats() {
  const incomplete = officialSolutions.filter(x => !isDetailComplete(x)).length;
  document.querySelector("#statTotal").textContent = officialSolutions.length;
  document.querySelector("#statCandidates").textContent = candidateSolutions.length;
  document.querySelector("#statSelected").textContent = selectedIndex >= 0 ? selectedIndex + 1 : 0;
  document.querySelector("#statIncomplete").textContent = incomplete;
}

async function loadOfficial() {
  const response = await fetch("./data/solutions.json");
  if (!response.ok) throw new Error(`无法读取 data/solutions.json：HTTP ${response.status}`);
  officialSolutions = await response.json();
  if (!Array.isArray(officialSolutions)) throw new Error("solutions.json 不是数组。");
  selectedIndex = officialSolutions.length ? 0 : -1;
  mode = "official";
  render();
  fillEditor();
}

function getFilters() {
  return {
    q: document.querySelector("#searchInput").value.trim().toLowerCase(),
    category: document.querySelector("#categoryFilter").value,
    risk: document.querySelector("#riskFilterAdmin").value,
    detail: document.querySelector("#detailFilter").value
  };
}

function matchItem(item, filters) {
  const hay = [
    item.title,
    item.description,
    item.category,
    item.industry_category,
    item.income_model,
    Array.isArray(item.industry_tags) ? item.industry_tags.join(" ") : "",
    item.source_title
  ].join(" ").toLowerCase();

  if (filters.q && !hay.includes(filters.q)) return false;
  if (filters.category !== "all" && item.category !== filters.category) return false;
  if (filters.risk !== "all" && item.risk_level !== filters.risk) return false;
  if (filters.detail === "complete" && !isDetailComplete(item)) return false;
  if (filters.detail === "incomplete" && isDetailComplete(item)) return false;
  return true;
}

function renderList() {
  const arr = currentArray();
  const filters = getFilters();
  const rows = arr
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => matchItem(item, filters));

  listEl.innerHTML = "";

  if (!rows.length) {
    listEl.innerHTML = `<div class="notice">暂无匹配内容。</div>`;
    return;
  }

  rows.forEach(({ item, index }) => {
    const div = document.createElement("button");
    div.type = "button";
    div.className = `admin-solution-item ${index === selectedIndex ? "active" : ""}`;
    div.innerHTML = `
      <div class="admin-solution-title">${escapeHTML(item.title || "未命名方案")}</div>
      <div class="admin-solution-meta">
        <span>${categoryText[item.category] || item.category || "未分类"}</span>
        <span>${industryText[item.industry_category] || item.industry_category || "未分类"}</span>
        <span class="${isDetailComplete(item) ? "ok" : "bad"}">${isDetailComplete(item) ? "详情完整" : "详情缺失"}</span>
      </div>
    `;
    div.addEventListener("click", () => {
      selectedIndex = index;
      renderList();
      fillEditor();
      updateStats();
    });
    listEl.appendChild(div);
  });
}

function render() {
  document.querySelectorAll("[data-mode]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  renderList();
  updateStats();
}

function setValue(name, value) {
  const el = form.elements[name];
  if (el) el.value = value ?? "";
}

function getValue(name) {
  const el = form.elements[name];
  return el ? el.value : "";
}

function fillEditor() {
  const arr = currentArray();
  const item = arr[selectedIndex];

  if (!item) {
    form.classList.add("hidden");
    editorEmpty.classList.remove("hidden");
    return;
  }

  form.classList.remove("hidden");
  editorEmpty.classList.add("hidden");

  const d = getDetail(item);

  setValue("id", item.id || "");
  setValue("title", item.title || "");
  setValue("description", item.description || "");
  setValue("category", item.category || "part-time");
  setValue("industry_category", item.industry_category || "");
  setValue("income_model", item.income_model || "");
  setValue("difficulty", item.difficulty || 3);
  setValue("required_time", item.required_time || "medium");
  setValue("required_skill", item.required_skill || "medium");
  setValue("required_money", item.required_money || "low");
  setValue("risk_level", item.risk_level || "medium");
  setValue("industry_tags", Array.isArray(item.industry_tags) ? item.industry_tags.join("，") : "");
  setValue("credibility_score", item.credibility_score || 3);
  setValue("steps", asLines(item.steps));
  setValue("source_title", item.source_title || "");
  setValue("source_url", item.source_url || "");
  setValue("source_evidence_summary", item.source_evidence_summary || "");

  setValue("detail.core_logic", d.core_logic || "");
  setValue("detail.target_customer", d.target_customer || "");
  setValue("detail.payment_reason", d.payment_reason || "");
  setValue("detail.first_order_strategy", d.first_order_strategy || "");
  setValue("detail.key_failure_point", d.key_failure_point || "");
  setValue("detail.delivery_process", asLines(d.delivery_process));
  setValue("detail.suitable_people", asLines(d.suitable_people));
  setValue("detail.unsuitable_people", asLines(d.unsuitable_people));
  setValue("detail.startup_cost", d.startup_cost || "");
  setValue("detail.first_week_plan", asLines(d.first_week_plan));
  setValue("detail.customer_channels", asLines(d.customer_channels));
  setValue("detail.tools_needed", asLines(d.tools_needed));
  setValue("detail.deliverables", asLines(d.deliverables));
  setValue("detail.resource_pack_suggestions", asLines(d.resource_pack_suggestions));
  setValue("detail.pricing_reference", d.pricing_reference || "");
  setValue("detail.risk_notes", asLines(d.risk_notes));
  setValue("detail.upgrade_path", d.upgrade_path || "");
}

function readEditor() {
  const current = currentArray()[selectedIndex] || {};
  const item = { ...current };

  item.id = getValue("id").trim() || makeId(getValue("title"));
  item.title = getValue("title").trim() || "未命名方案";
  item.description = getValue("description").trim();
  item.category = getValue("category");
  item.industry_category = getValue("industry_category").trim();
  item.income_model = getValue("income_model").trim();
  item.difficulty = Number(getValue("difficulty") || 3);
  item.required_time = getValue("required_time");
  item.required_skill = getValue("required_skill");
  item.required_money = getValue("required_money");
  item.risk_level = getValue("risk_level");
  item.industry_tags = csvToArray(getValue("industry_tags"));
  item.credibility_score = Number(getValue("credibility_score") || 3);
  item.steps = linesToArray(getValue("steps"));
  item.source_title = getValue("source_title").trim();
  item.source_url = getValue("source_url").trim();
  item.source_evidence_summary = getValue("source_evidence_summary").trim();

  item.detail = {
    core_logic: getValue("detail.core_logic").trim(),
    target_customer: getValue("detail.target_customer").trim(),
    payment_reason: getValue("detail.payment_reason").trim(),
    first_order_strategy: getValue("detail.first_order_strategy").trim(),
    key_failure_point: getValue("detail.key_failure_point").trim(),
    delivery_process: linesToArray(getValue("detail.delivery_process")),
    suitable_people: linesToArray(getValue("detail.suitable_people")),
    unsuitable_people: linesToArray(getValue("detail.unsuitable_people")),
    startup_cost: getValue("detail.startup_cost").trim(),
    first_week_plan: linesToArray(getValue("detail.first_week_plan")),
    customer_channels: linesToArray(getValue("detail.customer_channels")),
    tools_needed: linesToArray(getValue("detail.tools_needed")),
    deliverables: linesToArray(getValue("detail.deliverables")),
    resource_pack_suggestions: linesToArray(getValue("detail.resource_pack_suggestions")),
    pricing_reference: getValue("detail.pricing_reference").trim(),
    risk_notes: linesToArray(getValue("detail.risk_notes")),
    upgrade_path: getValue("detail.upgrade_path").trim()
  };

  return item;
}

function saveCurrent() {
  const arr = currentArray();
  if (selectedIndex < 0) return alert("请先选择一条方案。");
  arr[selectedIndex] = readEditor();
  render();
  fillEditor();
  alert("已保存到当前页面内存。导出 JSON 后才会形成文件。");
}

function deleteCurrent() {
  const arr = currentArray();
  if (selectedIndex < 0) return alert("请先选择一条方案。");
  if (!confirm("确定删除当前方案？")) return;
  arr.splice(selectedIndex, 1);
  selectedIndex = Math.min(selectedIndex, arr.length - 1);
  render();
  fillEditor();
}

function duplicateCurrent() {
  const arr = currentArray();
  if (selectedIndex < 0) return alert("请先选择一条方案。");
  const copy = JSON.parse(JSON.stringify(arr[selectedIndex]));
  copy.id = makeId(copy.title);
  copy.title = `${copy.title} 副本`;
  arr.splice(selectedIndex + 1, 0, copy);
  selectedIndex = selectedIndex + 1;
  render();
  fillEditor();
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function mergeCandidate(item) {
  const idSet = new Set(officialSolutions.map(x => x.id));
  let copy = JSON.parse(JSON.stringify(item));
  if (!copy.id || idSet.has(copy.id)) {
    copy.id = makeId(copy.title);
  }
  officialSolutions.push(copy);
}

function mergeAllCandidates() {
  if (!candidateSolutions.length) return alert("候选库为空。");
  if (!confirm(`确定将 ${candidateSolutions.length} 条候选内容合并到正式库？`)) return;
  candidateSolutions.forEach(mergeCandidate);
  candidateSolutions = [];
  mode = "official";
  selectedIndex = officialSolutions.length ? officialSolutions.length - 1 : -1;
  render();
  fillEditor();
}

async function importJSONFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  let items = [];
  if (Array.isArray(data)) {
    items = data;
  } else if (Array.isArray(data.solutions)) {
    items = data.solutions;
  } else if (Array.isArray(data.candidate_solutions)) {
    items = data.candidate_solutions;
  } else {
    throw new Error("JSON 格式不支持。请导入数组、{solutions:[]} 或 {candidate_solutions:[]}。");
  }

  candidateSolutions = items.map((x, idx) => {
    const item = { ...x };
    if (!item.id) item.id = makeId(item.title || `candidate-${idx + 1}`);
    if (!item.detail) item.detail = {};
    return item;
  });

  mode = "candidate";
  selectedIndex = candidateSolutions.length ? 0 : -1;
  render();
  fillEditor();
  alert(`已导入 ${candidateSolutions.length} 条候选内容。`);
}

document.querySelector("#saveBtn").addEventListener("click", saveCurrent);
document.querySelector("#deleteBtn").addEventListener("click", deleteCurrent);
document.querySelector("#duplicateBtn").addEventListener("click", duplicateCurrent);
document.querySelector("#exportBtn").addEventListener("click", () => downloadJSON("solutions.json", officialSolutions));
document.querySelector("#reloadBtn").addEventListener("click", () => {
  if (confirm("重新载入会丢失未导出的修改，确定继续？")) loadOfficial().catch(err => alert(err.message));
});
document.querySelector("#mergeAllBtn").addEventListener("click", mergeAllCandidates);
document.querySelector("#clearCandidatesBtn").addEventListener("click", () => {
  if (!confirm("确定清空候选库？")) return;
  candidateSolutions = [];
  if (mode === "candidate") selectedIndex = -1;
  render();
  fillEditor();
});

document.querySelector("#importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  importJSONFile(file).catch(err => alert(`导入失败：${err.message}`));
  e.target.value = "";
});

document.querySelectorAll("[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => {
    mode = btn.dataset.mode;
    selectedIndex = currentArray().length ? 0 : -1;
    render();
    fillEditor();
  });
});

["#searchInput", "#categoryFilter", "#riskFilterAdmin", "#detailFilter"].forEach(sel => {
  document.querySelector(sel).addEventListener("input", renderList);
  document.querySelector(sel).addEventListener("change", renderList);
});

loadOfficial().catch(err => {
  listEl.innerHTML = `<div class="notice">加载失败：${escapeHTML(err.message)}</div>`;
});
