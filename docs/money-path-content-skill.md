# 每日赚钱思路采集与详情页生成 Skill

## 1. Skill 定位

本 Skill 用于维护“财富路径引导”网页 App 的内容库。

流程：

```txt
联网搜索 / 案例采集
↓
可信度初筛
↓
赚钱逻辑总结
↓
分类与风险评级
↓
生成卡片字段
↓
生成注册用户专属详情页字段
↓
输出 candidate_solutions.json
↓
导入管理页审核后合并
```

## 2. 重要原则

### 2.1 不直接污染正式库

Skill 默认输出：

```txt
candidate_solutions.json
```

不要直接覆盖正式库：

```txt
data/solutions.json
```

正式库应通过 `admin-content.html` 导入候选内容、人工审核、合并并导出。

### 2.2 禁止模板化详情页

详情页必须逐条定制，不能大量使用可套用到任何项目的泛化话术。

低价值写法示例：

```txt
从朋友圈、小红书、微信群获客。
制作报价表、客户登记表、服务清单。
注意不要夸大收益。
```

合格写法示例：

```txt
宠物老年护理陪诊：
第一批客户是家里有10岁以上猫狗、经常复查、需要喂药和观察饮食的宠物主人。
第一单可从宠物医院复查人群、宠物店老客户群、老年宠物小红书笔记切入。
交付物不是“陪诊”两个字，而是复查预约提醒、就诊资料整理、医生医嘱记录、喂药提醒表、7天观察反馈。
最大风险是不能替代兽医诊断，必须把服务边界写进客户确认单。
```

## 3. 每条方案必须回答 8 个问题

```txt
1. 这个项目为什么成立？
2. 谁会付钱？
3. 客户为什么愿意付钱？
4. 第一单从哪里来？
5. 具体怎么交付？
6. 最容易失败在哪里？
7. 应该配什么资料包？
8. 如何从小单升级为长期收入？
```

## 4. 推荐字段结构

每条方案进入 `solutions.json` 时，应包含：

```json
{
  "id": "unique-id",
  "title": "方案标题",
  "description": "卡片概要",
  "steps": ["基础步骤1", "基础步骤2"],
  "category": "part-time | skill | investment",
  "industry_category": "local-service",
  "income_model": "service-fee",
  "difficulty": 3,
  "required_time": "low | medium | high",
  "required_skill": "low | medium | high",
  "required_money": "low | medium | high",
  "risk_level": "low | medium | high",
  "industry_tags": ["标签1", "标签2"],
  "source_title": "来源标题",
  "source_url": "来源链接",
  "source_evidence_summary": "来源依据与本方案的关系说明",
  "credibility_score": 4,
  "detail_quality": "skill_custom_rewrite_v2",
  "detail": {
    "core_logic": "这个项目为什么成立，为什么有人愿意为它付费。",
    "target_customer": "第一批最可能付费的客户是谁。",
    "payment_reason": "客户具体为什么掏钱。",
    "first_order_strategy": "第一单从哪里来，怎么拿下第一单。",
    "delivery_process": ["交付步骤1", "交付步骤2", "交付步骤3"],
    "suitable_people": ["适合人群1", "适合人群2"],
    "unsuitable_people": ["不适合人群1", "不适合人群2"],
    "startup_cost": "启动成本说明。",
    "first_week_plan": ["第1天行动", "第2天行动", "第3天行动", "第4-7天行动"],
    "customer_channels": ["获客渠道1", "获客渠道2"],
    "tools_needed": ["工具1", "工具2"],
    "deliverables": ["交付物1", "交付物2"],
    "pricing_reference": "定价参考，不承诺收益。",
    "key_failure_point": "这个项目最容易失败在哪里。",
    "risk_notes": ["风险1", "风险2"],
    "resource_pack_suggestions": ["资料包1", "资料包2"],
    "upgrade_path": "如何从小单升级为长期收入。"
  }
}
```

## 5. 输出格式

Skill 执行后建议输出：

```json
{
  "candidate_solutions": [],
  "quality_report": {
    "total": 0,
    "with_custom_detail": 0,
    "generic_risk_count": 0,
    "missing_source_count": 0,
    "duplicate_title_count": 0
  }
}
```

## 6. 日常使用指令

```txt
执行“每日赚钱思路采集 Skill”。

请搜索近期各行各业可行的赚钱思路、小生意、副业模式和轻资产项目。
本次抓取 10 条。
要求：
1. 不限 AI，要覆盖本地服务、银发经济、宠物经济、文旅、数字产品、商家服务等。
2. 排除博彩、刷单、虚假投资、灰产和高风险金融项目。
3. 每条都必须包含完整 detail 字段。
4. 详情页必须逐条定制，不要模板化。
5. 输出 candidate_solutions.json，不要直接合并正式库。
```

## 7. 管理页配合方式

```txt
Skill 输出 candidate_solutions.json
↓
打开 admin-content.html
↓
导入候选内容
↓
人工审核 / 修改 / 删除
↓
合并到正式库
↓
导出新版 solutions.json
↓
替换 data/solutions.json
```
