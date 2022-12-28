import { IItem, IOrder, IResponse } from './interfaces'
import { createOrder, fetchItems } from './api'
import { amountEl1, showFirst20, showMoreEl } from './showLimitedProducts'
import { cartArray, emptyCart, renderCart, totalCost, activeCartEl } from './cart'
import './style.css'

//* HTML elements *//
const checkoutCart = document.querySelector("#checkout-cart") as HTMLElement
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

    gridEl.innerHTML += items.data.map(item =>
        `
        <div id="${item.id}" class="card col-6 col-md-4 col-lg-3 col-xl-3 d-none">
            <img class="card-img-top" src="https://bortakvall.se/${item.images.thumbnail}" alt="Card image cap">
            <div class="card-body cardsBox">
                <h3 class="card-title">${item.name}</h3>
                <div class="priceTitles">${item.price}kr per skopa</div>
                <div class="hideDescription">${item.description}</div>
                <button class="btn btn-primary addButton">Lägg till i varukorgen</button>
                <button class="btn btn-secondary read-more" data-item-id-button="${item.id}">Läs mer</button>
            </div>
        </div>
        `
    ).join('')

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
                    <h4>${foundItem.name}</h4> 
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
        `<li>${e.item_name}</li>
        <li>Pris: ${e.item_price}kr</li>
        `
        )
        .join("")

    toggleCheckoutCart()

    const writeConfirmation = async () => {

        document.querySelector("h2")?.classList.toggle("d-none")
        continueShoppingEl.classList.toggle("d-none")
        await getOrderRes()

        confirmationEl.innerHTML = `
        <button id="close-confirm" type="button">Stäng</button>
        <h2>Beställningen är slutförd!</h2>
        <p>Din order skickades in: ${orderResponse.data.order_date} och har fått IDt ${orderResponse.data.id}.
        <p>Din order:</p>
            <ul>
                ${cartItems} Totala kostnaden: ${totalCost}kr
            </ul>
        <p>Tack för du handlade hos oss!</p>
        `
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