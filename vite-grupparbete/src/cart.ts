import { toggleFormFunc, toggleCheckoutCart, checkoutCartList } from "./main"
import { ICartItem } from "./interfaces"


//* Globala variablar och konstanter *//
export let cartArray: Array<ICartItem> = [],
            totalCost = 0

export const cartListEl = document.querySelector("#cartList"),
            cartPayButton = document.querySelector("#cartPay"),
            cartNumber = document.querySelector("#cartNumber"),
            activeCartEl = document.querySelector("#activeCart")
            

//* Lokala variablar och konstanter *//
let productName: any

const cartEl = document.querySelector("#cart")


//* EVENTLISTENERS EVENTLISTENERS EVENTLISTENERS *//

document.querySelector("#empty-cart")!.addEventListener("click", () => {
    emptyCart()
    renderCart()
    document.querySelector("#empty-cart")!.classList.add("d-none")
    activeCartEl?.classList.toggle("d-none")

})

// eventlistener som kollar om man trycker på "Lägg till i varukorgen"
document.querySelector('#grid')!.addEventListener("click", e => {
    let productIndex;
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.classList.contains("addButton")) {
        document.querySelector("#empty-cart")!.classList.remove("d-none")
        let price: string = target.parentElement?.querySelector(".priceTitles")?.textContent!,
            productId: number = Number(target.parentElement?.parentElement?.getAttribute("id")),
            // ta bort allt förutom siffrorna
            item_price: number = Number(price?.replace(/\D/g, '')),
            item_name: string = target.parentElement?.querySelector("h3")?.textContent!,
            item_quantity_temp: string = target.parentElement?.querySelector(".item-qty")?.textContent!,
            item_quantity: number = Number(item_quantity_temp?.replace(/\D/g, ''))
        // kollar om det redan finns det typen av varan då 'qty ++;' och returerar, slutar alltså hela funktionen. Annars pushar den in ett nytt object.
        for (let i = 0; i < cartArray.length; i++) {
            if (cartArray.some(h => h.product_id === productId)) {
                productIndex = cartArray.findIndex(e => e.product_id === productId)

                if (cartArray[productIndex].qty < cartArray[productIndex].stock_qty!) {
                    cartArray[productIndex].qty ++
                    renderCart()
                    return;
                } else {
                    return
                }
            }
        }
        cartArray.push({
            item_name: item_name,
            product_id: productId,
            qty: 1,
            item_price: item_price,
            item_total: item_price,
            stock_qty: item_quantity
        })
        renderCart()
    }
})

// visa och dölj sin varukorg
cartEl?.addEventListener("click", function () {
    activeCartEl?.classList.toggle("d-none")
    
    if (cartArray.length > 0) {
        document.querySelector("#empty-cart")!.classList.remove("d-none")
    }
})

// Eventlistener för shopping cart 
cartListEl?.addEventListener("click", e => {
    if ((e.target as HTMLElement).tagName === "I") {
        
        // Lägger till +1
    } if ((e.target as HTMLElement).classList.contains("plusButton")) {
        productName = (e.target as HTMLElement).parentElement!.parentElement!.querySelector(".cartItem1")?.textContent

        let i = 0;
        for (; i < cartArray.length; i++) {

            if (cartArray[i].item_name?.includes(productName) && cartArray[i].qty < cartArray[i].stock_qty!) {
                
                cartArray[i].qty ++
                renderCart()
                return;
            }
        }
        // Tar bort -1
    } else if ((e.target as HTMLElement).classList.contains("minusButton")) {
        productName = (e.target as HTMLElement).parentElement!.parentElement!.querySelector(".cartItem1")?.textContent
        
        let i = 0
        for (; i < cartArray.length; i++) {
            if (cartArray[i].item_name?.includes(productName)) {
                cartArray[i].qty --;
                if (cartArray[i].qty === 0) {
                    cartArray.splice(i, 1)
                }
                renderCart()
                return
            }
        }
        // Tar bort hela varan
    } else if ((e.target as HTMLElement).classList.contains("removeButton")) {
        productName = (e.target as HTMLElement).parentElement!.parentElement?.querySelector(".cartItem1")?.textContent
        
        let i = 0;
        for (; i < cartArray.length; i++) {
            if (cartArray[i].item_name?.includes(productName)) {
                cartArray.splice(i, 1)
                renderCart()
                return
            }
        }
    }
})

cartPayButton?.addEventListener("click", async () => {

    await toggleCheckoutCart()
    await renderCheckoutCart()

    const totalCostCheckout = document.querySelector("#total-cost") as HTMLElement

    totalCostCheckout.innerText = `Totalt: ${totalCost} kr`

    await toggleFormFunc()
})

//* FUNKTIONER FUNKTIONER FUNKTIONER *//

// funktion för att tömma cartArray
export const emptyCart = () => {
    cartArray = []
}

// Funktion för att rendera ut DOM:en på 'cart'
export const renderCart = () => {
    // Fyller på localStorage med nytt innehåll
    localStorage.setItem("cart", JSON.stringify(cartArray))
    // först tömmer man sin cart
    cartListEl!.innerHTML = ``
    // kollar om det finns minst 1 vara så att det visas "betala" knapp
    if (cartArray.length === 0) {
        cartPayButton?.classList.add("d-none")
        cartNumber?.classList.add("d-none")
        document.querySelector("#empty-cart")!.classList.add("d-none")
    } else {
        cartPayButton?.classList.remove("d-none")
        cartNumber?.classList.remove("d-none")
        cartNumber!.innerHTML = `${cartArray.length}`
        totalCostFunc()
        cartListEl!.innerHTML += `
        <li id="totalCost" class="text-right float-right d-block">Totalt: ${totalCost} kr</li>`
        // sedan fyller man på igen
        for (let i = 0; i < cartArray.length; i++) {
            cartListEl!.innerHTML += `
            <li>
                <span class="cartItem1">${cartArray[i].item_name}</span>
                <span class="cartItem2">
                <i class="fa-solid fa-circle-minus minusButton float-left"></i>
                    ${cartArray[i].qty} st
                    <i class="fa-solid fa-circle-plus plusButton float-left"></i>
                </span>
                <span class="cartItem3">
                    <i class="fa-solid fa-circle-xmark removeButton"></i>
                </span>
                <span class="cartItem4">Lagerstatus: ${cartArray[i].stock_qty} st kvar / ${cartArray[i].item_price} kr styck</span>
                <span class="cartItem5">
                ${(cartArray[i].item_price) * (cartArray[i].qty)} kr
                </span>
            </li>`
        }
    }
}

// renderar ut nuvarande shopping cart till en lista på "checkout" sidan
const renderCheckoutCart = async () => {

    checkoutCartList.innerHTML = `
    <li>Namn<span><span>Antal</span><span>Pris</span></span></li>`

    checkoutCartList.innerHTML += cartArray
    .map(e =>
        `<li data-cart-item:"${e.product_id}">${e.item_name}<span><span>${e.qty} st</span><span>${e.item_price * e.qty} kr</span></span>
        </li>
        `
    )
    .join("")
}

// funktion för att räkna ut total kostnaden för alla sina varor
export const totalCostFunc = () => {
    totalCost = 0
    for (let i = 0; i < cartArray.length; i++) {
        // beräknar totala värdet på varje vara
        cartArray[i].item_total = (cartArray[i].item_price) * (cartArray[i].qty)
        totalCost += cartArray[i].item_total
    }
}

// localStorage för cart
const storageCart = localStorage.getItem("cart")
if (storageCart !== null) {
    cartArray = JSON.parse(storageCart!)
}