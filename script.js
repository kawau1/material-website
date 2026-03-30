document.addEventListener('DOMContentLoaded', function () {
    // ページトップFAB + Top App Bar スクロール制御
    const fabPageTop = document.querySelector(".fab-pagetop");
    const topAppBar = document.getElementById("topAppBar");
    let wasScrolled = false;

    fabPageTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    function handleScroll() {
        const isScrolled = window.scrollY > 0;
        if (isScrolled === wasScrolled) return;
        wasScrolled = isScrolled;
        if (fabPageTop instanceof HTMLElement) {
            fabPageTop.style.display = isScrolled ? "" : "none";
        }
        topAppBar?.classList.toggle("is-scrolled", isScrolled);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    // メニューアイコンボタン + サイドバー
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarScrim = document.getElementById("sidebarScrim");
    const sidebarLinks = sidebar?.querySelectorAll(".sidebar-link");
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

    sidebarLinks?.forEach((item) =>
        item.addEventListener("click", () => {
            sidebarLinks.forEach((link) =>
                link.classList.toggle("is-active", link === item)
            );
            setSidebarOpen(false);
        })
    );

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && sidebar?.classList.contains("is-open")) {
            setSidebarOpen(false);
        }
    });

    // テーマ切り替え
    const themeBtn = document.getElementById("themeBtn");
    const themeStyle = document.getElementById("theme-style");

    function setTheme(isDark) {
        if (!themeStyle || !themeBtn) return;
        themeStyle.setAttribute("href", isDark ? "style-dark.css" : "style-light.css");
        themeBtn.setAttribute("title", isDark ? "ライトモードに切り替える" : "ダークモードに切り替える");
        if (isDark) {
            themeBtn.setAttribute("selected", "");
        } else {
            themeBtn.removeAttribute("selected");
        }
    }

    if (themeBtn && themeStyle) {
        themeBtn.addEventListener("click", () => {
            themeBtn.toggleAttribute("selected");
            setTheme(themeBtn.hasAttribute("selected"));
        });

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
        setTheme(prefersDark.matches);
        prefersDark.addEventListener("change", (e) => setTheme(e.matches));
    }
});
