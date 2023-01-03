import { items } from './main'

export const amountEl1 = document.querySelector("#productAmount1")
export const amountEl2 = document.querySelector("#productAmount2")
export const showMoreEl = document.querySelector("#showMoreDiv")
export let instockArray: any = []

// Används i for loopen
let s = 0
// används för att först visa 20, sedan 20 mer osv.
let showMax = 20

export let showFirst20 = async () => {
    for (; s < showMax; s++) {
        let showItem = document.getElementsByClassName("card")[s]
        if (showItem !== undefined) {
            showItem.classList.remove("d-none")
        } else {
            showMoreEl?.classList.add("d-none")
            showMoreEl?.setAttribute("id", "hide")
            renderAmount()
            return
        }
    }
    renderAmount()
}

//* EventListeners *//
showMoreEl?.addEventListener("click", e => {
    if ((e.target as HTMLElement).id === "showMoreButton") {
        showMax += 20
        showFirst20()
    }
})

//* Functions *//
export const instockFunc = () => {
    items.data.map(item => {
        if (item.stock_status === "instock") {
            instockArray.push({
                name: item.name,
                instock: true
            })
        }
    })
}

export const renderAmount = () => {
    if (showMax < items.data.length) {
        amountEl1!.textContent = `Visar ${showMax} av ${items.data.length} produkter varav ${instockArray.length} finns i lager`
    } else {
        amountEl1!.textContent = `Visar ${items.data.length} av ${items.data.length} produkter varav ${instockArray.length} finns i lager`
    }
    amountEl2!.textContent = `Visar ${showMax} av ${items.data.length} produkter varav ${instockArray.length} finns i lager`
}