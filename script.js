const topAppBar = document.getElementById("topAppBar");
const fabPageTop = document.querySelector(".fab-pagetop");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const navigationItems = Array.from(sidebar.querySelectorAll(".sidebar-link"), (link) => ({
    link,
    section: document.getElementById(link.hash.slice(1)),
}));

let currentNavigationLink;
let navigationUpdatePending = false;

function updateScrollState() {
    const isScrolled = window.scrollY > 0;

    const anchorOffset = Number.parseFloat(getComputedStyle(navigationItems[0].section).scrollMarginTop);
    const activationLine = Math.max(anchorOffset, topAppBar.getBoundingClientRect().bottom) + 1;
    let activeLink = navigationItems[0].link;
    for (const { link, section } of navigationItems) {
        if (section.getBoundingClientRect().top <= activationLine) {
            activeLink = link;
        }
    }

    // 最後のセクションが画面上端まで届かない場合も、ページ末尾で選択する。
    if (isScrolled && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1) {
        activeLink = navigationItems.at(-1).link;
    }

    const hideFab = !isScrolled;
    if (fabPageTop.hidden !== hideFab) fabPageTop.hidden = hideFab;
    topAppBar.classList.toggle("is-scrolled", isScrolled);

    if (activeLink !== currentNavigationLink) {
        currentNavigationLink?.removeAttribute("aria-current");
        activeLink.setAttribute("aria-current", "location");
        currentNavigationLink = activeLink;
    }
}

function scheduleScrollUpdate() {
    if (navigationUpdatePending) return;
    navigationUpdatePending = true;
    window.requestAnimationFrame(() => {
        navigationUpdatePending = false;
        updateScrollState();
    });
}

for (const event of ["scroll", "resize", "hashchange", "pageshow"]) {
    window.addEventListener(event, scheduleScrollUpdate, { passive: true });
}
const sectionResizeObserver = new ResizeObserver(scheduleScrollUpdate);
for (const { section } of navigationItems) {
    sectionResizeObserver.observe(section);
}
updateScrollState();

fabPageTop.addEventListener("click", () => {
    navigationItems[0].section.focus({ preventScroll: true });
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
});

menuBtn.addEventListener("click", () => {
    // ポインター操作でボタンにフォーカスしないブラウザーでも、閉じた際の復帰先にする。
    menuBtn.focus({ preventScroll: true });
    sidebar.showModal();
    menuBtn.setAttribute("aria-expanded", "true");
});
sidebar.addEventListener("close", () => menuBtn.setAttribute("aria-expanded", String(sidebar.open)));
sidebarCloseBtn.addEventListener("click", () => sidebar.close());

for (const { link } of navigationItems) {
    link.addEventListener("click", (event) => {
        if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            sidebar.close();
        }
    });
}

if (!("closedBy" in HTMLDialogElement.prototype)) {
    function isOutsideDrawer(event) {
        if (event.target !== sidebar) return false;
        const { left, right, top, bottom } = sidebar.getBoundingClientRect();
        return event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom;
    }

    let startedOnBackdrop = false;
    sidebar.addEventListener("pointerdown", (event) => {
        startedOnBackdrop = isOutsideDrawer(event);
    });
    sidebar.addEventListener("click", (event) => {
        if (startedOnBackdrop && isOutsideDrawer(event)) sidebar.close();
        startedOnBackdrop = false;
    });
}

const themeBtn = document.getElementById("themeBtn");
const colorScheme = document.querySelector('meta[name="color-scheme"]');
const darkTheme = document.getElementById("dark-theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function isDarkTheme() {
    return colorScheme.content === "dark" || (colorScheme.content === "light dark" && systemTheme.matches);
}

function updateThemeButton() {
    const isDark = isDarkTheme();
    const label = isDark ? "ライトモードに切り替える" : "ダークモードに切り替える";
    themeBtn.toggleAttribute("selected", isDark);
    themeBtn.setAttribute("aria-label", label);
    themeBtn.title = label;
}

function applyTheme(theme) {
    colorScheme.content = theme ?? "light dark";
    darkTheme.media = theme === null ? systemTheme.media : theme === "dark" ? "all" : "not all";
    updateThemeButton();
}

themeBtn.addEventListener("click", () => {
    const useDark = !isDarkTheme();
    const theme = useDark === systemTheme.matches ? null : useDark ? "dark" : "light";
    applyTheme(theme);
    try {
        if (theme === null) {
            localStorage.removeItem("portfolio-theme");
        } else {
            localStorage.setItem("portfolio-theme", theme);
        }
    } catch (error) {
        // 保存できない場合も現在のページには反映する。
        if (!(error instanceof DOMException)) throw error;
    }
});
systemTheme.addEventListener("change", updateThemeButton);
window.addEventListener("storage", (event) => {
    if (event.storageArea === localStorage && (event.key === "portfolio-theme" || event.key === null)) {
        const theme = event.newValue;
        applyTheme(theme === "light" || theme === "dark" ? theme : null);
    }
});
updateThemeButton();
