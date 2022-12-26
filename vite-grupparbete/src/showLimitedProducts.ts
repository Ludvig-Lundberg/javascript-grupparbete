import { items } from `./main`
export {};

export const showMoreEl = document.querySelector("#showMoreDiv");
export const amountEl1 = document.querySelector("#productAmount1");
export const amountEl2 = document.querySelector("#productAmount2");
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
    renderAmount();
};
showMoreEl?.addEventListener("click", e => {
    if ((e.target as HTMLElement).id === "showMoreButton") {
        showMax += 20;
        showFirst20();
    }
});
export const renderAmount = () => {
    amountEl1!.textContent = `Visar ${showMax} av ${items.data.length} produkter`;
    amountEl2!.textContent = `Visar ${showMax} av ${items.data.length} produkter`;
}