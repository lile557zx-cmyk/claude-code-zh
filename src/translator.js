(function() {
  const dictionary = __DICTIONARY__;

  console.log('🌏 Claude Code 中文化已激活');
  console.log(`📖 词典: ${Object.keys(dictionary.exact).length} 个词条`);

  // 翻译文本节点
  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text && dictionary.exact[text]) {
        node.textContent = node.textContent.replace(text, dictionary.exact[text]);
      }
    }
  }

  // 翻译属性
  function translateAttributes(element) {
    const attrs = ['title', 'placeholder', 'aria-label', 'alt'];
    attrs.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && dictionary.exact[value.trim()]) {
        element.setAttribute(attr, dictionary.exact[value.trim()]);
      }
    });
  }

  // 遍历 DOM 树
  function translateDOM(root) {
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.nodeType === Node.TEXT_NODE) {
        translateNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        translateAttributes(node);
      }
    }
  }

  // 监听 DOM 变化
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          translateDOM(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          translateNode(node);
        }
      });
    });
  });

  // 初始翻译
  if (document.body) {
    translateDOM(document.body);

    // 开始监听
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['title', 'placeholder', 'aria-label', 'alt']
    });
  } else {
    // 等待 body 加载
    document.addEventListener('DOMContentLoaded', () => {
      translateDOM(document.body);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['title', 'placeholder', 'aria-label', 'alt']
      });
    });
  }
})();
