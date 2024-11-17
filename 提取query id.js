// ==UserScript==
// @name         综合提取脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  从 __telegram__initParams 和 sessionStorage 中提取数据并提供按钮以便复制到剪贴板
// @author       You
// @match        *://*/*
// @grant        none
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

    function extractFromInitParams() {
        const initParams = sessionStorage.getItem('__telegram__initParams');
        if (initParams) {
            try {
                const parsedData = JSON.parse(initParams);
                const tgWebAppData = parsedData.tgWebAppData;
                if (tgWebAppData) {
                    const formattedData = JSON.stringify(tgWebAppData).replace(/^\"|\"$/g, ''); // 删除开头和结尾的双引号
                    createButton(formattedData, 'init-params-copy-button', '复制query_id', { vertical: 'bottom', horizontal: 'right' });
                } else {
                    console.log('在 __telegram__initParams 中未找到 tgWebAppData 字段');
                }
            } catch (error) {
                console.log('解析 __telegram__initParams 时出错:', error);
            }
        } else {
            console.log('未找到 __telegram__initParams 项');
        }
    }

    function extractFromLaunchParams() {
        const launchParams = sessionStorage.getItem('telegram-apps/launch-params');
        if (launchParams) {
            try {
                const params = new URLSearchParams(launchParams);
                const tgWebAppData = params.get('tgWebAppData');
                if (tgWebAppData) {
                    const dataParams = new URLSearchParams(tgWebAppData);
                    const query_id = dataParams.get('query_id');
                    const user = dataParams.get('user');
                    const auth_date = dataParams.get('auth_date');
                    const hash = dataParams.get('hash');

                    const formattedData = `query_id=${query_id}&user=${encodeURIComponent(user)}&auth_date=${auth_date}&hash=${hash}`.replace(/^\"|\"$/g, ''); // 删除开头和结尾的双引号
                    createButton(formattedData, 'launch-params-copy-button', '复制query_id', { vertical: 'bottom', horizontal: 'right' });
                } else {
                    console.log('在 launchParams 中未找到 tgWebAppData 字段');
                }
            } catch (error) {
                console.log('解析 sessionStorage 时出错:', error);
            }
        } else {
            console.log('未找到 sessionStorage 项');
        }
    }

    extractFromInitParams();
    extractFromLaunchParams();
})();