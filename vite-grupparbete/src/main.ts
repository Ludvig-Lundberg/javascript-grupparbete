import { IItem, IOrder, IResponse } from './interfaces'
import { createOrder, fetchItems } from './api'
import { amountEl1, showFirst20, showMoreEl, instockFunc } from './showLimitedProducts'
import { cartArray, emptyCart, renderCart, totalCost, activeCartEl } from './cart'
import './intro'
import '/src/style.css'

//* HTML elements *//
export const checkoutCart = document.querySelector("#checkout-cart") as HTMLElement
export const checkoutCartList = document.querySelector("#checkout-cart-list") as HTMLElement
const confirmationEl = document.querySelector("#confirmation") as HTMLElement
const continueShoppingEl = document.querySelector("#continueShopping") as HTMLElement
const gridEl = document.querySelector("#grid") as HTMLElement
const homeLinkEl = document.querySelector("#home-link") as HTMLElement
const infoDiv = document.querySelector("#fade-background") as HTMLElement


//* Arrays *//
export let items: {data: Array<IItem>}

//* Objects *//
let orderObj : IOrder
let orderResponse : IResponse

//* Functions *//
export const getItems = async () => {
    items = await fetchItems()

    instockFunc();
    renderDom()
    return items

}

const getOrderRes = async () => {
    orderResponse = await createOrder(orderObj)

    console.log(orderResponse)
    console.log("Order ID:" + orderResponse.data.id + " " + "Order Date:" + orderResponse.data.order_date)

    return orderResponse

}

const renderDom = (() => {

    items.data.sort((aItem,bItem)=> {
        if (aItem.name.toUpperCase() < bItem.name.toUpperCase()) {
            return -1;
        }
    
        if (aItem.name.toUpperCase() > bItem.name.toUpperCase()) {
            return 1;
        }
    
        return 0;
    })

    gridEl.innerHTML += items.data.map(item => {

        if(item.stock_status === "outofstock") {
            
            return `<div id="${item.id}" class="card col-5 col-md-3 col-lg-3 col-xl-2 d-none">
                <img class="card-img-top" src="https://bortakvall.se/${item.images.thumbnail}" alt="Card image cap" draggable="false">
                <div class="card-body cardsBox">
                <h3 class="card-title">${item.name}</h3>
                <div class="priceTitles">${item.price} kr per skopa</div>
                <div class="item-qty item-not-instock">Varan är tyvärr slut</div>
                    <button class="btn btn-primary addButton disabled">Lägg till i varukorgen</button>
                    <button class="btn btn-secondary read-more" data-item-id-button="${item.id}">Läs mer</button>
                </div>
            </div>
        `}

        return `<div id="${item.id}" class="card col-5 col-md-3 col-lg-3 col-xl-2 d-none">
            <img class="card-img-top" src="https://bortakvall.se/${item.images.thumbnail}" alt="Card image cap" draggable="false">
            <div class="card-body cardsBox">
                <h3 class="card-title">${item.name}</h3>
                <div class="priceTitles">${item.price} kr per skopa</div>
                <div class="item-qty">${item.stock_quantity} st i lager</div>
                <button class="btn btn-primary addButton">Lägg till i varukorgen</button>
                <button class="btn btn-secondary read-more" data-item-id-button="${item.id}">Läs mer</button>
            </div>
        </div>
        `
    }).join('')

    showFirst20()
})

export const toggleFormFunc = async () => {
    gridEl.classList.toggle("d-none")
    document.querySelector("#form")?.classList.toggle("d-none")
    continueShoppingEl?.classList.toggle("d-none")
    showMoreEl?.classList.toggle("d-none")
    activeCartEl?.classList.add("d-none")
    amountEl1?.classList.toggle("d-none")
    document.querySelector("#amount-in-stock")?.classList.toggle("d-none")
}

export const toggleCheckoutCart = async () => {
    document.querySelector(".checkout-section")?.classList.toggle("d-none")
    checkoutCart.classList.toggle("d-none")
    document.querySelector("h2")?.classList.toggle("d-none")
}

const toggleRemoveForm = () => {
    document.querySelector("#form")?.classList.toggle("d-none")
    emptyCart()
    renderCart()
}

//* EventListeners *//
continueShoppingEl.addEventListener("click", () => {
    toggleFormFunc()
    toggleCheckoutCart()
})

gridEl.addEventListener("click", async e => {
    const target = e.target as HTMLElement

    if (target.tagName === "BUTTON" && target.classList.contains("read-more")) {
		
		const itemId = Number(target.dataset.itemIdButton);

		const foundItem = items.data.find(item => item.id === itemId)!

        infoDiv.classList.toggle("d-none")
        infoDiv.innerHTML = `                
            <div id="more-information">
                <button class="btn" id="close-info-btn"><i class="fa-solid fa-xmark"></i></button>
                <img src="https://bortakvall.se/${foundItem.images.large}" alt="Bild av ${foundItem.name}">
                <div id="info-text">
                    <h3>${foundItem.name}</h3> 
                    <span id="price">Pris: ${foundItem.price} kronor</span>
                    <div id="ingredients">
                        ${foundItem.description}
                    </div>
                </div>
            </div>`
	}
})

homeLinkEl.addEventListener("click", () => {

    if (!checkoutCart.classList.contains("d-none")) {
        toggleFormFunc()
        toggleCheckoutCart()
    }

    if (confirmationEl.innerText.length > 0) {
        window.location.assign("index.html")
    }

})

infoDiv.addEventListener("click", e => {

    const target = e.target as HTMLElement

    if (target.tagName === "DIV" && target.id.includes("fade-background") || target.tagName === "I") {
        infoDiv?.classList.toggle("d-none")
    }

})


document.querySelector('#form')?.addEventListener('submit', async e => {
    e.preventDefault()

    const newFirstNameTitle = document.querySelector<HTMLInputElement>('#firstName')!.value
    const newLastNameTitle = document.querySelector<HTMLInputElement>('#lastName')!.value
    const newEmailTitle = document.querySelector<HTMLInputElement>('#c-Email')!.value
    const newPhoneNumberTitle = document.querySelector<HTMLInputElement>('#c-Phone')?.value
    const newAdressTitle = document.querySelector<HTMLInputElement>('#c-Adress')!.value
    const newPostCodeTitle = document.querySelector<HTMLInputElement>('#c-Postcode')!.value
    const newCityTitle = document.querySelector<HTMLInputElement>('#c-City')!.value

    let storageFormArray = [{
        firstName: newFirstNameTitle,
        lastName: newLastNameTitle,
        email: newEmailTitle,
        phone: newPhoneNumberTitle,
        adress: newAdressTitle,
        postCode: newPostCodeTitle,
        city: newCityTitle
    }]

    //* localStorage för formuläret *//
    localStorage.setItem("form", JSON.stringify(storageFormArray))

    if (!newFirstNameTitle && !newLastNameTitle && !newEmailTitle && !newAdressTitle && !newPostCodeTitle && !newCityTitle) {
        console.log("empty input");
        return
    }

    //* Check if the phone number has the correct format *//
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

    if (newPhoneNumberTitle!.length > 0) {

        if (!re.test(newPhoneNumberTitle!)) {
            alert("Vänligen skriv in ett giltigt telefonnummer")
            return
        }
    }

    orderObj = {
        customer_first_name: newFirstNameTitle,
        customer_last_name: newLastNameTitle,
        customer_address: newAdressTitle,
        customer_postcode: newPostCodeTitle,
        customer_city: newCityTitle,
        customer_email: newEmailTitle,
        customer_phone: newPhoneNumberTitle,
        order_total: totalCost,
        order_items: cartArray
    }
    
    let cartItems = cartArray
        .map(e =>
            `<li data-cart-item:"${e.product_id}">${e.item_name}<span><span>${e.qty} st</span><span>${e.item_price * e.qty} kr</span></span>
            </li>
            `
        )
        .join("")

    toggleCheckoutCart()
    document.querySelector(".checkout-section")?.classList.toggle("d-none")

    confirmationEl.classList.toggle("d-none")

    const writeConfirmation = async () => {

        document.querySelector("h2")?.classList.toggle("d-none")
        continueShoppingEl.classList.toggle("d-none")
        await getOrderRes()

        confirmationEl.innerHTML = `
        <button id="close-confirm" class="btn" type="button">Stäng</button>
        <h3>Beställningen är slutförd!</h3>
        <p>Din order skickades in: <em>${orderResponse.data.order_date}</em> och har fått order-id <strong>${orderResponse.data.id}</strong>.
        <h5>Din order:</h5>
            <ul>
                <li>Namn<span><span>Antal</span><span>Pris</span></span></li>
                ${cartItems}
            </ul>
        Totala kostnaden: ${totalCost} kr
        <p>Tack för du handlade hos oss!</p>
        `

        if (totalCost >= 100) {
            confirmationEl.innerHTML += `<p>Tack för att du handlade för över 100kr! Här har du en rabattkod på 10% till ditt nästa köp: <strong>GREATCANDY10</strong></p>`
        }

        const closeConfirmEl = document.querySelector('#close-confirm') as HTMLElement

        closeConfirmEl.addEventListener('click', () => {
            return window.location.assign("index.html")
        })
    }

    writeConfirmation()
    toggleRemoveForm()

})

//* localStorage för formuläret *//
const storageForm = localStorage.getItem("form");
let storageFormArrayJS;
if (storageForm !== null) {
    storageFormArrayJS = JSON.parse(storageForm!);

    document.querySelector<HTMLInputElement>('#firstName')!.value   = storageFormArrayJS[0].firstName
    document.querySelector<HTMLInputElement>('#lastName')!.value    = storageFormArrayJS[0].lastName
    document.querySelector<HTMLInputElement>('#c-Email')!.value     = storageFormArrayJS[0].email
    document.querySelector<HTMLInputElement>('#c-Phone')!.value     = storageFormArrayJS[0].phone
    document.querySelector<HTMLInputElement>('#c-Adress')!.value    = storageFormArrayJS[0].adress
    document.querySelector<HTMLInputElement>('#c-Postcode')!.value  = storageFormArrayJS[0].postCode
    document.querySelector<HTMLInputElement>('#c-City')!.value      = storageFormArrayJS[0].city

}

//* Active functions *//
renderCart()
getItems()