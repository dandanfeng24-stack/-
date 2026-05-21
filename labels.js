
const categoryText = {
  "part-time": "我有闲暇时间",
  "skill": "我有专业技能",
  "investment": "我有小额资金"
};
const industryText = {
  "online-light": "线上轻资产",
  "local-service": "本地生活服务",
  "skill-service": "专业技能服务",
  "small-trade": "小买卖 / 轻库存",
  "content-media": "内容账号 / 自媒体",
  "knowledge-product": "知识产品 / 数字产品",
  "tourism-culture": "文旅 / 导览 / 城市服务",
  "pet-economy": "宠物经济",
  "senior-economy": "银发经济",
  "parenting": "母婴 / 亲子",
  "food-beverage": "餐饮 / 小吃 / 饮品",
  "enterprise-service": "企业服务",
  "ai-service": "AI 工具 / AI 服务",
  "resale": "二手交易 / 转卖",
  "handmade": "手作 / 文创 / 定制"
};
const incomeText = {
  "service-fee": "服务收费",
  "product-sale": "产品销售",
  "subscription": "订阅收费",
  "commission": "佣金 / 分成",
  "traffic-monetize": "流量变现",
  "consulting": "咨询诊断",
  "training": "培训课程",
  "template-sale": "模板 / 资料包售卖",
  "agency": "代运营 / 代理服务",
  "resale-margin": "低买高卖差价",
  "membership": "会员制",
  "lead-generation": "线索转化"
};
const levelText = { low: "低", medium: "中", high: "高" };
function riskClass(level) {
  if (level === "low") return "good";
  if (level === "high") return "danger";
  return "warn";
}
function renderStars(level) {
  const n = Number(level || 3);
  return "★".repeat(n) + "☆".repeat(5 - n);
}
function escapeHTML(str="") {
  return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
