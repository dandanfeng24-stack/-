# 财富路径引导 Codex 工作区

这是“财富路径引导”网页 App 的 Codex 工作区版本。

## 项目结构

```txt
index.html                 首页，动态主视觉
app.html                   赚钱方案库
solution-detail.html        注册用户专属详情页
admin-content.html          内容管理页
admin.html                  用户统计页
resources.html              资料领取页
profile.html                用户中心
login.html                  登录页
register.html               注册页

data/solutions.json         正式方案数据库，当前 80 条
assets/home-hero.png        首页主视觉
assets/logo-*.png           LOGO 文件

app.js                      方案库逻辑
solution-detail.js          详情页逻辑
admin-content.js            内容管理逻辑
auth.js                     本地注册登录逻辑
labels.js                   分类标签映射
server.js                   本地快速启动服务器
start-fast.bat              Windows 快速启动脚本

docs/money-path-content-skill.md   内容采集与详情生成 Skill
docs/CODEX_NEXT_TASKS.md           后续开发任务
docs/MOVE_TO_CODEX_FOLDER.md       移动到本地 Codex 文件夹说明
```

## 本地启动

Windows 下双击：

```txt
start-fast.bat
```

或运行：

```bash
node server.js
```

浏览器打开：

```txt
http://localhost:61188
```

## 当前状态

```txt
方案总数：80 条
详情页：80 条均已重写为定制版
管理页：已新增
注册登录：本地 localStorage 原型
客户数据库：本地 localStorage 原型
正式后台：尚未接入
```

## 内容更新流程

```txt
1. 在 ChatGPT / Codex 中执行 docs/money-path-content-skill.md 的 Skill
2. 生成 candidate_solutions.json
3. 打开 admin-content.html
4. 导入 candidate_solutions.json
5. 审核、修改、删除
6. 合并到正式库
7. 导出新版 solutions.json
8. 替换 data/solutions.json
```

## 重要限制

当前仍是纯静态本地原型：

```txt
1. 用户注册数据保存在浏览器 localStorage
2. 收藏记录保存在浏览器 localStorage
3. 管理页编辑不会直接写入电脑文件
4. 需要导出 solutions.json 后手动替换
5. 正式上线需要接真实后台数据库
```
