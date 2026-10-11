#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 查找 Claude Code 安装路径
function findClaudeCodePath() {
  const possiblePaths = [
    path.join(process.env.LOCALAPPDATA, 'Programs', 'Claude', 'Claude.exe'),
    path.join(process.env.PROGRAMFILES, 'Claude', 'Claude.exe'),
    'C:\\Program Files\\Claude\\Claude.exe'
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`✅ 找到 Claude Code: ${p}`);
      return p;
    }
  }

  console.error('❌ 找不到 Claude Code 安装路径');
  console.log('请手动指定: claude-code-zh --claude-path "C:\\Your\\Path\\Claude.exe"');
  process.exit(1);
}

// 启动 Claude Code
async function launchClaudeCode() {
  const claudePath = findClaudeCodePath();
  const debugPort = 9333;

  const args = [
    `--remote-debugging-port=${debugPort}`,
    '--remote-debugging-address=127.0.0.1'
  ];

  console.log('🚀 启动 Claude Code (中文)...');
  console.log(`   调试端口: ${debugPort}`);
  console.log('   保持此窗口打开以维持中文化');
  console.log('   输入 u 回车更新词典，输入 q 回车退出\n');

  const child = spawn(claudePath, args, {
    detached: false,
    stdio: 'ignore'
  });

  // 等待 3 秒后连接 CDP
  setTimeout(async () => {
    try {
      const { injectTranslator } = require('./cdp-client');
      await injectTranslator(debugPort);
    } catch (err) {
      console.error('❌ 注入失败:', err.message);
    }
  }, 3000);

  // 监听用户输入
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.on('data', (key) => {
      const char = key.toString();
      if (char === 'q' || char === '\u0003') {
        console.log('\n👋 退出中...');
        child.kill();
        process.exit(0);
      } else if (char === 'u') {
        console.log('\n🔄 更新词典...');
        const { reloadDictionary } = require('./dictionary');
        reloadDictionary();
      }
    });
  }

  child.on('exit', () => {
    console.log('Claude Code 已退出');
    process.exit(0);
  });
}

// 主入口
if (require.main === module) {
  launchClaudeCode();
}

module.exports = { launchClaudeCode };
