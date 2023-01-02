export {};

const headerEl = document.querySelector("header")!,
      navbarEl = document.querySelector("#navbar")!;
let viewportHeight = window.innerHeight;
window.addEventListener("scroll", () => {
    let navbarBounding = navbarEl.getBoundingClientRect();
    if (navbarBounding.top <= (viewportHeight - 20) && navbarBounding.top >= (viewportHeight - 50)) {
        headerEl.classList.add("headerIntro")
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        setTimeout(() => {
            document.querySelector("#intro")!.classList.add("d-none")
        }, 1000);
    }
})