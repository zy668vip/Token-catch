// ==UserScript==
// @name         番茄token提取脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取本地存储中键名为 token 的值并提供按钮以便复制到剪贴板
// @author       You
// @match        *://*/*
// @grant        none
// @updateURL    https://github.com/zy668vip/Token-catch/raw/main/%E6%8F%90%E5%8F%96token.js
// @downloadURL  https://github.com/zy668vip/Token-catch/raw/main/%E6%8F%90%E5%8F%96token.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(copyText, buttonId, buttonText, buttonPosition) {
        if (document.getElementById(buttonId)) return;

        const button = document.createElement('button');
        button.id = buttonId;
        button.textContent = buttonText;
        button.style.position = 'fixed';
        button.style[buttonPosition.vertical] = '10px';
        button.style[buttonPosition.horizontal] = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '10000';

        button.addEventListener('click', function() {
            const textarea = document.createElement('textarea');
            textarea.value = copyText;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    alert('数据已复制到剪贴板');
                } else {
                    alert('复制失败');
                }
            } catch (err) {
                console.error('复制到剪贴板失败:', err);
                alert('复制到剪贴板失败: ' + err.message);
            }
            document.body.removeChild(textarea);
        });

        document.body.appendChild(button);
    }

    function extractToken() {
        const token = localStorage.getItem('token');  // 从本地存储中获取 token
        if (token) {
            // 创建并显示复制按钮
            createButton(token, 'token-copy-button', '复制 token', { vertical: 'bottom', horizontal: 'left' });
        } else {
            console.log('在本地存储中未找到 token');
        }
    }

    // 确保文档已完全加载后再执行
    window.onload = function() {
        extractToken();
    };
})();
