document.addEventListener('DOMContentLoaded', function () {
    // ページトップFAB
    document
        .querySelector(".fab-pagetop")
        ?.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

    // ページトップFABの表示制御
    const fabPageTop = document.querySelector(".fab-pagetop");
    function toggleFabVisibility() {
        if (!fabPageTop || !(fabPageTop instanceof HTMLElement)) return;
        if (window.scrollY === 0) {
            fabPageTop.style.display = "none";
        } else {
            fabPageTop.style.display = "";
        }
    }
    toggleFabVisibility();
    window.addEventListener("scroll", toggleFabVisibility);

    // メニューアイコンボタン + サイドバー
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarScrim = document.getElementById("sidebarScrim");
    let lastFocusedElement = null;

    function setSidebarOpen(isOpen) {
        if (!menuBtn || !sidebar || !sidebarScrim) return;
        if (isOpen) {
            const scrollbarWidth =
                window.innerWidth - document.documentElement.clientWidth;
            document.body.style.setProperty(
                "--scrollbar-width",
                `${scrollbarWidth}px`
            );
        } else {
            document.body.style.removeProperty("--scrollbar-width");
        }
        sidebar.classList.toggle("is-open", isOpen);
        sidebarScrim.classList.toggle("is-open", isOpen);
        document.body.classList.toggle("sidebar-open", isOpen);
        sidebar.setAttribute("aria-hidden", isOpen ? "false" : "true");
        sidebarScrim.setAttribute("aria-hidden", isOpen ? "false" : "true");
        menuBtn.toggleAttribute("selected", isOpen);
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuBtn.setAttribute(
            "title",
            isOpen ? "メニューを閉じる" : "メニューを開く"
        );
        if (isOpen) {
            lastFocusedElement =
                document.activeElement instanceof HTMLElement
                    ? document.activeElement
                    : null;
        } else if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    if (menuBtn && sidebar && sidebarScrim) {
        menuBtn.addEventListener("click", () => {
            setSidebarOpen(!sidebar.classList.contains("is-open"));
        });
    }

    sidebarScrim?.addEventListener("click", () => setSidebarOpen(false));

    sidebar
        ?.querySelectorAll("[data-sidebar-close]")
        .forEach((item) =>
            item.addEventListener("click", () => setSidebarOpen(false))
        );

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
            setSidebarOpen(false);
        }
    });

    setSidebarOpen(false);

    // テーマ切り替えボタン
    const themeBtn = document.getElementById("themeBtn");
    const themeStyle = document.getElementById("theme-style");
    if (themeBtn && themeStyle) {
        const linkElem = document.getElementById("theme-style");
        themeBtn.addEventListener("click", () => {
            themeBtn.toggleAttribute("selected");
            if (linkElem) {
                if (themeBtn.hasAttribute("selected")) {
                    linkElem.setAttribute("href", "style-dark.css");
                    themeBtn.setAttribute("title", "ライトモードに切り替える");
                } else {
                    linkElem.setAttribute("href", "style-light.css");
                    themeBtn.setAttribute("title", "ダークモードに切り替える");
                }
            }
        });

        // デバイスのカラースキームに合わせて自動切り替え
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        function applySystemTheme() {
            if (!themeStyle || !themeBtn) return;
            if (prefersDark.matches) {
                themeStyle.setAttribute("href", "style-dark.css");
                themeBtn.setAttribute("selected", "");
                themeBtn.setAttribute("title", "ライトモードに切り替える");
            } else {
                themeStyle.setAttribute("href", "style-light.css");
                themeBtn.removeAttribute("selected");
                themeBtn.setAttribute("title", "ダークモードに切り替える");
            }
        }
        applySystemTheme();
        prefersDark.addEventListener("change", applySystemTheme);
    }
});
