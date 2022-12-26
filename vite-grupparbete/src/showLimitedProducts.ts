export {};

export const showMoreEl = document.querySelector("#showMoreDiv");
// Används i for loopen
let s = 0;
// används för att först visa 20, sedan 20 mer osv.
let showMax = 20;
export let showFirst20 = async () => {
    for (; s < showMax; s++) {
        let showItem = document.getElementsByClassName("card")[s];
        if (showItem !== undefined) {
            showItem.classList.remove("d-none")
        } else {
            showMoreEl?.classList.add("d-none");
            showMoreEl?.setAttribute("id", "hide");
            return
        }
    }
};
showMoreEl?.addEventListener("click", e => {
    if ((e.target as HTMLElement).id === "showMoreButton") {
        showMax += 20;
        showFirst20();
    }
});