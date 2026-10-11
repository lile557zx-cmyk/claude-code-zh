const fs = require('fs');
const path = require('path');

function loadDictionary() {
  const dictPath = path.join(__dirname, '../dict');
  const dict = {
    exact: {},
    patterns: []
  };

  try {
    // 加载所有 JSON 文件
    const files = fs.readdirSync(dictPath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = fs.readFileSync(
          path.join(dictPath, file),
          'utf-8'
        );
        const data = JSON.parse(content);

        if (data.exact) {
          Object.assign(dict.exact, data.exact);
        }
        if (data.patterns) {
          dict.patterns.push(...data.patterns);
        }
      }
    }

    return dict;
  } catch (err) {
    console.error('❌ 加载词典失败:', err.message);
    return dict;
  }
}

function reloadDictionary() {
  console.log('🔄 重新加载词典...');
  const dict = loadDictionary();
  console.log(`✅ 已加载 ${Object.keys(dict.exact).length} 个词条`);
  return dict;
}

module.exports = { loadDictionary, reloadDictionary };
