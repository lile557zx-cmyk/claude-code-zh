const CDP = require('chrome-remote-interface');
const { loadDictionary } = require('./dictionary');
const fs = require('fs');
const path = require('path');

async function injectTranslator(port = 9333) {
  try {
    const client = await CDP({ port });
    const { Runtime, Target } = client;

    console.log('✅ 已连接到 Claude Code 调试端口');

    // 加载词典
    const dict = loadDictionary();
    console.log(`📖 加载词典: ${Object.keys(dict.exact).length} 个词条`);

    // 读取注入脚本
    const translatorCode = fs.readFileSync(
      path.join(__dirname, 'translator.js'),
      'utf-8'
    );

    // 获取所有目标
    const targets = await Target.getTargets();

    let injected = 0;
    for (const target of targets.targetInfos) {
      if (target.type === 'page' || target.type === 'webview') {
        try {
          const code = translatorCode.replace(
            '__DICTIONARY__',
            JSON.stringify(dict)
          );

          await Runtime.evaluate({
            expression: code,
            contextId: target.targetId
          });

          console.log(`✅ 已注入: ${target.title || target.url}`);
          injected++;
        } catch (err) {
          // 忽略注入失败的目标
        }
      }
    }

    console.log(`\n✨ Claude Code 中文化已激活！(已注入 ${injected} 个窗口)\n`);

    await client.close();

  } catch (err) {
    console.error('❌ CDP 连接失败:', err.message);
    console.log('提示: 请确保 Claude Code 已启动并开启了调试端口');
    throw err;
  }
}

module.exports = { injectTranslator };
