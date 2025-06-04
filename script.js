document.addEventListener('DOMContentLoaded', function () {
    // ページトップFAB
    document.querySelector('.fab-pagetop')?.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ページトップFABの表示制御
    const fabPageTop = document.querySelector('.fab-pagetop');
    function toggleFabVisibility() {
        if (!fabPageTop || !(fabPageTop instanceof HTMLElement)) return;
        if (window.scrollY === 0) {
            fabPageTop.style.display = 'none';
        } else {
            fabPageTop.style.display = '';
        }
    }
    toggleFabVisibility();
    window.addEventListener('scroll', toggleFabVisibility);

    // メニューアイコンボタン
    const menuBtn = document.getElementById('menuBtn');
    const menuTooltip = document.getElementById('menuTooltip');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // selected属性をトグル
            menuBtn.toggleAttribute('selected');
            // ツールチップも状態に応じて変更
            if (menuBtn.hasAttribute('selected')) {
                menuBtn.setAttribute('title', 'メニューを閉じる');
                if (menuTooltip) menuTooltip.textContent = 'メニューを閉じる';
            } else {
                menuBtn.setAttribute('title', 'メニューを開く');
                if (menuTooltip) menuTooltip.textContent = 'メニューを開く';
            }
        });
    }

    // テーマ切り替えボタン
    const themeBtn = document.getElementById('themeBtn');
    const themeTooltip = document.getElementById('themeTooltip');
    const themeStyle = document.getElementById('theme-style');
    if (themeBtn && themeStyle) {
        const linkElem = document.getElementById('theme-style');
        themeBtn.addEventListener('click', () => {
            themeBtn.toggleAttribute('selected');
            if (linkElem) {
                if (themeBtn.hasAttribute('selected')) {
                    linkElem.setAttribute('href', 'style-dark.css');
                    themeBtn.setAttribute('title', 'ライトモードに切り替える');
                    if (themeTooltip) themeTooltip.textContent = 'ライトモードに切り替える';
                } else {
                    linkElem.setAttribute('href', 'style-light.css');
                    themeBtn.setAttribute('title', 'ダークモードに切り替える');
                    if (themeTooltip) themeTooltip.textContent = 'ダークモードに切り替える';
                }
            }
        });

        // デバイスのカラースキームに合わせて自動切り替え
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        function applySystemTheme() {
            if (!themeStyle || !themeBtn) return;
            if (prefersDark.matches) {
                themeStyle.setAttribute('href', 'style-dark.css');
                themeBtn.setAttribute('selected', '');
                themeBtn.setAttribute('title', 'ライトモードに切り替える');
                if (themeTooltip) themeTooltip.textContent = 'ライトモードに切り替える';
            } else {
                themeStyle.setAttribute('href', 'style-light.css');
                themeBtn.removeAttribute('selected');
                themeBtn.setAttribute('title', 'ダークモードに切り替える');
                if (themeTooltip) themeTooltip.textContent = 'ダークモードに切り替える';
            }
        }
        applySystemTheme();
        prefersDark.addEventListener('change', applySystemTheme);
    }
});
