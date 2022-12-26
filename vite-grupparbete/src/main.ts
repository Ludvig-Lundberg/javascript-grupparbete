import { ICartitem, IItem, IOrder, IResponse } from './interfaces'
import { createOrder, fetchItems } from './api'
import { amountEl1, showFirst20, showMoreEl } from './showLimitedProducts'
import { cartArray, emptyCart, renderCart, totalCost, activeCartEl } from './cart'
import './style.css'

// HTML elements
const infoDiv = document.querySelector("#fade-background") as HTMLElement
const gridEl = document.querySelector("#grid") as HTMLElement

// arrays
export let items: {data: Array<IItem>}

// test POST req
/* const testCart : Array<ICartitem> = [{
    product_id: 5216,
    qty: 2,
    item_price: 12,
    item_total: 24
}, 
{
    product_id: 6545,
    qty: 3,
    item_price: 8,
    item_total: 24
}] */

/* const testOrder : IOrder = {
    customer_first_name: "Gotte",
    customer_last_name: "Grisen",
    customer_address: "Karamellvägen 42",
    customer_postcode: "111 22",
    customer_city: "Sötdal",
    customer_email: "gottegrisen@godis.se",
    order_total: 48,
    order_items: testCart
} */

let orderObj : IOrder

let orderResponse : IResponse


const getOrderRes = async () => {
    orderResponse = await createOrder(orderObj)

    console.log(orderResponse)
    console.log("Order ID:" + orderResponse.data.id + " " + "Order Date:" + orderResponse.data.order_date)
    return orderResponse

}

const continueShoppingEl = document.querySelector("#continueShopping");
document.querySelector("#form")?.classList.add("d-none");
export let toggleFormFunc = async () => {
    gridEl.classList.toggle("d-none");
    document.querySelector("#form")?.classList.toggle("d-none");
    continueShoppingEl?.classList.toggle("d-none");
    showMoreEl?.classList.toggle("d-none");
    activeCartEl?.classList.add("d-none");
    amountEl1?.classList.toggle("d-none");
}

continueShoppingEl?.addEventListener("click", toggleFormFunc);

// EventListeners
gridEl!.addEventListener("click", async e => {
    const target = e.target as HTMLElement

    // console.log("e target", e.target)

    if (target.tagName === "BUTTON" && target.classList.contains("read-more")) {
		
		const itemId = Number(target.dataset.itemIdButton);     // `data-item-id-button`

        // console.log("item ID", itemId)

		const foundItem = items.data.find(item => item.id === itemId)!

        infoDiv.classList.toggle("d-none")
        infoDiv.innerHTML = `                
            <div id="more-information">
                <button class="btn btn-secondary close-info-btn" id="close-info-btn">Stäng</button>
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

infoDiv?.addEventListener("click", e => {

    const target = e.target as HTMLElement

    if (target.tagName === "DIV" && target.id.includes("fade-background") || target.tagName === "BUTTON") {
        infoDiv?.classList.toggle("d-none")
    }

})




export const getItems = async () => {
    items = await fetchItems()

    renderDom();
    return items

}

export const renderItems = document.querySelector('#grid')!;

const renderDom = (() => {
    renderItems.innerHTML += items.data.map(item =>
        `
        <div id="${item.id}" class="card col-6 col-md-4 col-lg-3 col-xl-3 d-none">
            <img class="card-img-top" src="https://bortakvall.se/${item.images.thumbnail}" alt="Card image cap">
            <div id="Cardsbox" class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <div id="priceTitles">${item.price}kr per skopa</div>
                <div id="hideDescription">${item.description}</div>
                <button class="btn btn-primary addButton">Lägg till i varukorgen</button>
                <button class="btn btn-secondary read-more" data-item-id-button="${item.id}">Läs mer</button>
            </div>
        </div>
        `
    ).join('')

    showFirst20();
})


/* interface IDetails {
    customer_firstname?: string,
    customer_lastname?: string,
    customer_email: any,
    customer_phonenumber: any,
    customer_adress: any,
    customer_postcode: any,
    customer_city?: string,
} */

document.querySelector('#form')?.addEventListener('submit', async e => {
    e.preventDefault()
    console.log("clicking")

    const newFirstNameTitle = document.querySelector<HTMLInputElement>('#firstName')!.value
    const newLastNameTitle = document.querySelector<HTMLInputElement>('#lastName')!.value
    const newEmailTitle = document.querySelector<HTMLInputElement>('#c-Email')!.value
    const newPhoneNumberTitle = document.querySelector<HTMLInputElement>('#c-Phone')?.value
    const newAdressTitle = document.querySelector<HTMLInputElement>('#c-Adress')!.value
    const newPostCodeTitle = document.querySelector<HTMLInputElement>('#c-Postcode')!.value
    const newCityTitle = document.querySelector<HTMLInputElement>('#c-City')!.value
    // let newDetails: IDetails[] = []
    // console.log("Sent", newDetails)
    if (!newFirstNameTitle && !newLastNameTitle && !newEmailTitle && !newAdressTitle && !newPostCodeTitle && !newCityTitle) {
        console.log("empty input");
        return
    }
    if (newFirstNameTitle && newLastNameTitle && newEmailTitle && newPhoneNumberTitle && newAdressTitle && newPostCodeTitle && newCityTitle) {
        
    }else if (newFirstNameTitle && newLastNameTitle && newEmailTitle && !newPhoneNumberTitle && newAdressTitle && newPostCodeTitle && newCityTitle) {
        
    }
    
/*     const newCollectTitles: IDetails = {
        customer_firstname: newFirstNameTitle,
        customer_lastname: newLastNameTitle,
        customer_email: newEmailTitle,
        customer_phonenumber: newPhoneNumberTitle,
        customer_adress: newAdressTitle,
        customer_postcode: newPostCodeTitle,
        customer_city: newCityTitle,

    } */

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

    // console.log("Skickat in", newCollectTitles)
    
    const confirmationEl = document.querySelector('#confirmation')! as HTMLElement;
    

    let cartItems = cartArray
        .map(e => 
        `<li>${e.item_name}</li>
        <li>Pris: ${e.item_price}kr</li>
        `
        )
        .join("")

    confirmationEl!.innerHTML = `
    <h2>Beställningen är slutförd!</h2>
    <p>Din order:</p>
        <ul>
            ${cartItems} Totala priset: ${totalCost}kr
        </ul>
    <button id="submitAgain" type="submit">Stäng</button>
    <p>Tack för du handlade hos oss!</p>
    `
    
    const submitAgainEl = document.querySelector('#submitAgain') as HTMLElement
    submitAgainEl?.addEventListener('click', e => {
        e.preventDefault()
        return window.location.assign("index.html")
    })

    getOrderRes()
})
let toggleRemoveForm = () => {
    document.querySelector("#form")?.classList.toggle("d-none");
    emptyCart();
    renderCart()
}
document.querySelector('#form')?.addEventListener('submit', toggleRemoveForm);



// localStorage för formuläret
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

renderCart()
getItems()
// getOrderRes() // skickar iväg testorder till api