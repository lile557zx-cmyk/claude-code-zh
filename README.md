# claude-code-zh — Claude Code 界面中文化

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

把 Claude Code（Anthropic 官方桌面应用）的界面在运行时替换为中文。

**一句话原理**：以 Chromium 标准调试参数启动 Claude Code，通过 Chrome DevTools Protocol 向每个窗口注入翻译脚本，按本地词典替换界面文本。

**不做的事**：不修改 Claude Code 安装目录下任何文件，不改 JS 包，不发任何网络请求。

## 快速开始

1. **克隆仓库**
   ```bash
   git clone https://github.com/yourusername/claude-code-zh.git
   cd claude-code-zh
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动**
   ```bash
   npm start
   ```

   保持命令行窗口打开，输入 `u` 更新词典，输入 `q` 退出。

## 效果范围

| 区域 | 状态 |
|---|---|
| 侧边栏导航 | ✅ 已覆盖 |
| 对话界面 | ✅ 已覆盖 |
| 设置界面 | ✅ 已覆盖 |
| 命令面板 | 🚧 进行中 |
| 错误提示 | 🚧 进行中 |

## 工作原理

```
claude-code-zh ──启动──▶ Claude Code --remote-debugging-port=9333
      │
      └──CDP (WebSocket)──▶ 发现所有窗口/webview
                              │
                              └── 注入 translator.js + 词典
                                    ├─ 遍历文本节点与属性
                                    ├─ 精确匹配替换
                                    └─ MutationObserver 监听动态更新
```

## 贡献

欢迎提交 Pull Request 补充词典！

### 添加词汇

1. 编辑对应的词典文件 `dict/*.json`
2. 添加新的键值对
3. 提交 Pull Request

## 开发

```bash
# 开发模式
npm run dev

# 更新词典
npm run update-dict

# 运行测试
npm test
```

## 许可证

MIT

## 致谢

参考项目：[cursor-zh](https://github.com/Ver3ce/cursor-zh)
