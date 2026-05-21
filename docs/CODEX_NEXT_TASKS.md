# Codex 后续开发任务清单

## 第一阶段：修复与整理

### 1. 检查详情页展示

目标：确保所有新增字段都在详情页中自然展示。

重点文件：

```txt
solution-detail.html
solution-detail.js
style.css
```

检查字段：

```txt
target_customer
payment_reason
first_order_strategy
delivery_process
key_failure_point
resource_pack_suggestions
```

### 2. 优化详情页排版

目标：让详情页从“信息堆叠”变成更像正式产品页面。

建议结构：

```txt
顶部：项目标题 + 分类 + 可信度 + 风险
第一屏：为什么成立 / 谁会付钱 / 第一单怎么来
中部：交付流程 / 第一周计划 / 工具资料
底部：风险 / 失败点 / 升级路径 / 资料包领取
```

### 3. 检查管理页字段编辑

目标：确保 `admin-content.html` 可以编辑新增字段。

重点文件：

```txt
admin-content.html
admin-content.js
```

## 第二阶段：产品能力升级

### 4. 增加“个人条件测评”

新增：

```txt
assessment.html
assessment.js
```

功能：

```txt
用户回答时间、技能、资金、风险、线上线下偏好
↓
系统推荐 5 条方案
↓
登录后查看完整推荐报告
```

### 5. 增加“我的赚钱路径”

在用户中心增加：

```txt
我的备选方案
我的首选方案
我的第一周行动表
已领取资料包
下一步建议
```

### 6. 资料包与方案绑定

让每个方案的：

```txt
resource_pack_suggestions
```

可以直接跳转到资料领取页，并显示对应资料。

## 第三阶段：正式上线准备

### 7. 接真实后台

可选方案：

```txt
Supabase
Firebase
腾讯云 CloudBase
Node.js + SQLite/PostgreSQL
```

需要替换：

```txt
localStorage 注册登录
localStorage 收藏
localStorage 领取记录
管理页导出 JSON
```

### 8. 访问统计与转化漏斗

统计：

```txt
首页访问
点击进入方案库
点击详情
注册
收藏
领取资料
热门方案
热门行业
```

## 推荐 Codex 首个任务提示词

```txt
请阅读 README_CODEX.md、docs/money-path-content-skill.md 和当前项目代码。

第一步，请检查 solution-detail.js 和 admin-content.js 是否已经完整支持 detail 新增字段：
target_customer、payment_reason、first_order_strategy、delivery_process、key_failure_point。

第二步，请优化 solution-detail.html / solution-detail.js / style.css 的详情页排版，让详情页更像正式产品页面，而不是字段堆叠。

要求：
1. 不破坏现有注册登录限制。
2. 不修改 data/solutions.json 的结构。
3. 保持纯静态本地版可运行。
4. 完成后说明修改了哪些文件。
```
