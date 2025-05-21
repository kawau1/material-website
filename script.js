document.addEventListener('DOMContentLoaded', function () {
    // ページトップFAB
    document.querySelector('.fab-pagetop')?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // メニューアイコンボタン
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // selected属性をトグル
            menuBtn.toggleAttribute('selected');
            // ツールチップも状態に応じて変更
            if (menuBtn.hasAttribute('selected')) {
                menuBtn.setAttribute('title', 'メニューを閉じる');
            } else {
                menuBtn.setAttribute('title', 'メニューを開く');
            }
        });
    }

    // テーマ切り替えボタン
    const themeBtn = document.getElementById('themeBtn');
    const themeStyle = document.getElementById('theme-style');
    if (themeBtn && themeStyle) {
        const linkElem = document.getElementById('theme-style');
        themeBtn.addEventListener('click', () => {
            themeBtn.toggleAttribute('selected');
            if (linkElem) {
                if (themeBtn.hasAttribute('selected')) {
                    linkElem.setAttribute('href', 'style-dark.css');
                    themeBtn.setAttribute('title', 'ライトモードに切り替える');
                } else {
                    linkElem.setAttribute('href', 'style-light.css');
                    themeBtn.setAttribute('title', 'ダークモードに切り替える');
                }
            }
        });
    }
});
