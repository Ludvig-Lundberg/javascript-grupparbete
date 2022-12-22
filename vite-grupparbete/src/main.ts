import { IItem } from './interfaces'
import { fetchItems } from './api'
import './style.css'

// HTML elements
const infoDiv = document.querySelector("#fade-background") as HTMLElement
const gridEl = document.querySelector("#grid") as HTMLElement

// arrays
let items: {data: Array<IItem>}

// // Array som kommer att hålla alla sina varor man valt i korgen
let cartArray: Array<any> = [];
const cartListEl = document.querySelector("#cartList");
const cartPayButton = document.querySelector("#cartPay");
const cartNumber = document.querySelector("#cartNumber");
// Funktion för att rendera ut DOM:en på 'cart'
let renderCart = () => {
    // först tömmer man sin cart
    cartListEl!.innerHTML = ``;
    // kollar om det finns minst 1 vara så att det visas "betala" knapp
    if (cartArray.length === 0) {
        cartPayButton?.classList.add("d-none")
        cartNumber?.classList.add("d-none")
    } else {
        cartPayButton?.classList.remove("d-none")
        cartNumber?.classList.remove("d-none")
        cartNumber!.innerHTML = `${cartArray.length}`;
        totalCostFunc();
        cartListEl!.innerHTML += `
        <li id="totalCost" class="text-right float-right">Totalt: ${totalCost} kr</li>`
        // sedan fyller man på igen
        for (let i = 0; i < cartArray.length; i++) {

            cartListEl!.innerHTML += `<li>
            <span class="cartItem1">${cartArray[i].item_name}</span>
            <br>
            <span class="cartItem2">${cartArray[i].qty} st <i class="fa-solid fa-trash-can removeButton float-right"></i></span>
            <br>
            <span class="cartItem3">
                <i class="fa-solid fa-circle-plus plusButton float-left"></i>
                <i class="fa-solid fa-circle-minus minusButton float-left"></i>
                ${(cartArray[i].item_price) * (cartArray[i].qty)} kr
            </span>
                
            </li>`
        }
    }
};
let totalCost = 0;
let totalCostFunc = () => {
    totalCost = 0;
    for (let i = 0; i < cartArray.length; i++) {
            // beräknar totala värdet på varje vara
            cartArray[i].item_total = (cartArray[i].item_price) * (cartArray[i].qty);
            totalCost += cartArray[i].item_total;
    }
}

// Håller föräldren på vilken knapp man trycker på, den visar vilken DOM 'li' som varan är i
let productName: any;
// Eventlistener för shopping cart 
cartListEl?.addEventListener("click", e => {
    if ((e.target as HTMLElement).tagName === "I") {
        
    } if ((e.target as HTMLElement).classList.contains("plusButton")) {
        productName = (e.target as HTMLElement).parentElement!.parentElement?.querySelector(".cartItem1")?.textContent;

        let i = 0;
        for (; i < cartArray.length; i++) {
            if (cartArray[i].item_name.includes(productName)) {
                cartArray[i].qty ++;
                renderCart();
                return;
            }
        }

    } else if ((e.target as HTMLElement).classList.contains("minusButton")) {
        productName = (e.target as HTMLElement).parentElement!.parentElement?.querySelector(".cartItem1")?.textContent;
        
        let i = 0;
        for (; i < cartArray.length; i++) {
            if (cartArray[i].item_name.includes(productName)) {
                cartArray[i].qty --;
                if (cartArray[i].qty === 0) {
                    cartArray.splice(i, 1);
                }
                renderCart();
                return;
            }
        }
    }
});

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

const cartEl = document.querySelector("#cart");
const activeCartEl = document.querySelector("#activeCart");
// visa och dölj sin varukorg
cartEl?.addEventListener("click", function () {
    activeCartEl?.classList.toggle("d-none");
})


const getItems = async () => {
    items = await fetchItems()
    console.log(items.data)

    renderDom()
    return items

}
// ÄNDRA INTE NAMN, används också för att lägga till saker i varukorgen
const renderItems = document.querySelector('#grid')!;

const renderDom = (() => {

    renderItems.innerHTML += items.data.map(item =>
        `
        <div id="${item.id}" class="card col-sm-6 col-md-4 col-lg-3">
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

})
// eventlistener som kollar om man trycker på "Lägg till i varukorgen"
renderItems?.addEventListener("click", e => {
    const target = e.target as HTMLElement;
    if (target.tagName === "BUTTON" && target.classList.contains("addButton")) {
        let price: string = target.parentElement?.querySelector("#priceTitles")?.textContent!,
            productId: number = Number(target.parentElement?.parentElement?.getAttribute("id")),
            // ta bort allt förutom siffrorna
            item_price: number = Number(price?.replace(/\D/g, '')),
            item_name: string = target.parentElement?.querySelector("h5")?.textContent!;
        // kollar om det redan finns det typen av varan då 'qty ++;' och returerar, slutar alltså hela funktionen. Annars pushar den in ett nytt object.
        for (let i = 0; i < cartArray.length; i++) {
            if(cartArray.some(e => e.id === productId)) {
                let o = cartArray.findIndex(e => e.id === productId);
                cartArray[o].qty ++;
                renderCart();
                return;
            }
        }
        cartArray.push({
            item_name: item_name,
            id: productId,
            qty: 1,
            item_price: item_price,
            item_total: item_price
        });
        renderCart();
    }
});

interface IDetails {
    firstname?: string,
    lastname?: string,
    email: any,
    phonenumber: any,
    postcode: any,
    zip: any,
    city?: string,
}

document.querySelector('#form')?.addEventListener('submit', async e => {
    e.preventDefault()
    console.log("clicking")

    const newFirstNameTitle = document.querySelector<HTMLInputElement>('#firstName')?.value
    const newLastNameTitle = document.querySelector<HTMLInputElement>('#lastName')?.value
    const newEmailTitle = document.querySelector<HTMLInputElement>('#c-Email')?.value
    const newPhoneNumberTitle = document.querySelector<HTMLInputElement>('#c-Phone')?.value
    const newPostCodeTitle = document.querySelector<HTMLInputElement>('#c-Postcode')?.value
    const newZipTitle = document.querySelector<HTMLInputElement>('#c-Zip')?.value
    const newCityTitle = document.querySelector<HTMLInputElement>('#c-City')?.value
    let newDetails: IDetails[] = []
    console.log("Sent", newDetails)
    if (!newFirstNameTitle && !newLastNameTitle && !newEmailTitle && !newPostCodeTitle && !newZipTitle && !newCityTitle) {
        console.log("empty input");
        return
    }
    if (newFirstNameTitle && newLastNameTitle && newEmailTitle && newPhoneNumberTitle && newPostCodeTitle && newZipTitle && newCityTitle) {
        
    }else if (newFirstNameTitle && newLastNameTitle && newEmailTitle && !newPhoneNumberTitle && newPostCodeTitle && newZipTitle && newCityTitle) {
        
    }
    
    const newCollectTitles: IDetails = {
        firstname: newFirstNameTitle,
        lastname: newLastNameTitle,
        email: newEmailTitle,
        phonenumber: newPhoneNumberTitle,
        postcode: newPostCodeTitle,
        zip: newZipTitle,
        city: newCityTitle,

    }

    console.log("Skickat in", newCollectTitles)
    
})

getItems()
renderDom()

// kod som inte används atm
