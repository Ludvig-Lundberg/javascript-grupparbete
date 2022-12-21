// import { IItem } from './interfaces'
import { fetchItems } from './api'
import './style.css'

// const moreInfo = document.querySelector("#more-information")
// const moreInfoText = document.querySelector("#info-text")
const infoDiv = document.querySelector("#fade-background")!
// const infoBtn = document.querySelector("#info-btn")
const closeInfoBtn = document.querySelector("#close-info-btn")
const gridEl = document.querySelector("#grid")

// array för att hämta item (product) från API
// let items : IItem[] = []
let items: []
let itemArray;


// Temporär knapp för att lägga in temporär object i cart array:en
let cart: Array<any> = [];
let button = document.querySelector("#addButton");
button?.addEventListener("click", function () {
    cart.push({
        product: "Banan",
        quantity: 2,
        cost: 10
    })
    console.log(cart.length);
    console.log(cart);

    const cartListEl = document.querySelector("#cartList");
    cartListEl!.innerHTML += `<li>
    <span class="cartItem1">${cart[0].product}</span><br>
    <span class="cartItem2">${cart[0].quantity} st</span>
    <span class="cartItem3">${cart[0].cost} kr</span>
    </li>`

})
// Temporär knapp för att lägga in temporär object i cart array:en

//testing
/* moreInfoText!.innerHTML = `
    <h3>Title</h3> 
    <span class="price">Pris: 20</span>
    <div id="ingredients">
    </div>    
` */

// document.querySelector("#ingredients")!.innerHTML = "<p>En mix av lakrits och gelé med fruktsmak</p>\n<p>Innehållsförteckning: Socker, glukossirap, glukos-fruktossirap, stärkelse, VETEMJÖL, melass, syra (citronsyra), fuktighetsbevarande medel (sorbitoler, glycerol), lakritsextrakt, salt, vegetabiliska oljor (kokos, palm), aromer, färgämnen (E153, E120, E100, E141), ytbehandlingsmedel (bivax), stabiliseringsmedel (E471).</p>\n<p><em>Alla priser är per skopa.</em></p>\n"

// EventListeners
closeInfoBtn?.addEventListener("click", () => {
    infoDiv!.classList.toggle("d-none")
})

// infoBtn?.addEventListener("click", () => {
//     infoDiv!.classList.toggle("d-none")
// })

gridEl!.addEventListener("click", async e => {
    const target = e.target as HTMLElement

    console.log("e target", e.target)

    if (target.tagName === "BUTTON") {
		
		const itemId = Number(target.dataset.itemIdButton);     // `data-item-id-button`

        console.log("item ID", itemId)

		const foundItem = itemArray.find(item => item.id === itemId)!

        console.log("hej")
        console.log(infoDiv)
        console.log(foundItem, foundItem.name)

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

    if (target.tagName === "DIV") {
        infoDiv?.classList.toggle("d-none")
    }

})

const cartEl = document.querySelector("#cart");
const activeCartEl = document.querySelector("#activeCart");

cartEl?.addEventListener("click", function () {
    activeCartEl?.classList.toggle("d-none");
})


const getItems = async () => {
    items = await fetchItems()
    console.log(items.data)

    renderDom()
    return items.data

}



const renderDom = (() => {

    itemArray = items.data

    const renderItems = document.querySelector('#grid')!;

    renderItems.innerHTML += itemArray.map(item =>
        `
        <div id="${item.id}" class="card col-6">
            <img class="card-img-top" src="https://bortakvall.se/${item.images.thumbnail}" alt="Card image cap">
            <div id="Cardsbox" class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <div id="priceTitles">${item.price}kr per skopa</div>
                <div id="hideDescription">${item.description}</div>
                <a href="#" class="btn btn-primary">Lägg till i varukorgen</a>
                <button class="btn btn-secondary" data-item-id-button="${item.id}">Läs mer</button>
            </div>
        </div>
        `
    ).join('')

})

getItems()
renderDom()

// kod som inte används atm

/* <div class="d-none" id="fade-background">
<div class="more-information">
    <button class="btn btn-secondary close-info-btn">Stäng</button>
    <img src="https://bortakvall.se/${item.images.large}" alt="">
        <div id="info-text">
        <h3>${item.name}</h3> 
        <span class="price">Pris: ${item.price}</span>
        <div class="ingredients">
        ${item.description}
        </div>
    </div>
</div>
</div> */