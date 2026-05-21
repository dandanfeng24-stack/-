# 如何转移到本地 Codex 文件夹

## 方法一：直接解压

1. 下载本 ZIP。
2. 解压得到文件夹：

```txt
money-path-codex-workspace
```

3. 复制整个文件夹到你的 Codex 工作目录，例如：

```txt
E:\AI编程\财富路径\money-path-codex-workspace
```

4. 在 Codex / VS Code 中打开该文件夹。

## 方法二：命令行复制

假设你下载并解压到了“下载”目录，可复制到：

```bat
xcopy "%USERPROFILE%\Downloads\money-path-codex-workspace" "E:\AI编程\财富路径\money-path-codex-workspace" /E /I /Y
```

## 启动

进入文件夹，双击：

```txt
start-fast.bat
```

或运行：

```bash
node server.js
```

## 在 Codex 中继续开发

打开文件夹后，建议先让 Codex 阅读：

```txt
README_CODEX.md
docs/money-path-content-skill.md
docs/CODEX_NEXT_TASKS.md
```
