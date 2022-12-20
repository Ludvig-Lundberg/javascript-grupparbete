import { IItem } from './interfaces'
import {fetchItems} from './api'

const moreInfo = document.querySelector("#more-information")
const moreInfoText = document.querySelector("#info-text")
const infoDiv = document.querySelector("#fade-background")
const infoBtn = document.querySelector("#info-btn")
const closeInfoBtn = document.querySelector("#close-info-btn")

// array för att hämta item (product) från API
let items : IItem[] = []

import './style.css'

// Temporär knapp för att lägga in temporär object i cart array:en
let cartArray: Array<any> = [];
let button = document.querySelector("#addButton");
const cartListEl = document.querySelector("#cartList");
button?.addEventListener("click", function(){
    cartArray.push({
        product: "Banan",
        quantity: 2,
        cost: 10,
        id: 1403
    },
    {
        product: "Cola",
        quantity: 1,
        cost: 20,
        id: 1183
    },
    {
        product: "Choklad",
        quantity: 5,
        cost: 25,
        id: 639
    })
    console.log(cartArray.length);
    console.log(cartArray);

    renderCart();   
})
// Funktion för att rendera ut DOM:en på 'cart'
let renderCart = () => {
    // först tömmer man sin cart
    cartListEl!.innerHTML = ``;

    // sedan fyller man på igen
    for (let i = 0; i < cartArray.length; i++) {
    cartListEl!.innerHTML += `<li>
    <span class="cartItem1">${cartArray[i].product}</span><br>
    <span class="cartItem2">${cartArray[i].quantity} st</span>
    <span class="cartItem3">${(cartArray[i].cost) * (cartArray[i].quantity)} kr</span>
        <i class="fa-solid fa-circle-plus plusButton"></i>
        <i class="fa-solid fa-circle-minus minusButton"></i>
    </li>`
}};

// Temporär knapp för att lägga in temporär object i cart array:en
// Håller föräldren på vilken knapp man trycker på, den visar vilken DOM 'li' som varan är i
let productName: any;
// Eventlistener för shopping cart 
cartListEl?.addEventListener("click", e => {
    if ((e.target as HTMLElement).tagName === "I") {
        
    } if ((e.target as HTMLElement).classList.contains("plusButton")) {
        productName = (e.target as HTMLElement).parentElement?.querySelector(".cartItem1")?.textContent;

        let i = 0;
        for (; i < cartArray.length; i++) {
            if (cartArray[i].product.includes(productName)) {
                cartArray[i].quantity ++;
                renderCart();
                return;
            }
        }
    } else if ((e.target as HTMLElement).classList.contains("minusButton")) {
        productName = (e.target as HTMLElement).parentElement?.querySelector(".cartItem1")?.textContent;
        
        let i = 0;
        for (; i < cartArray.length; i++) {
            if (cartArray[i].product.includes(productName)) {
                cartArray[i].quantity --;
                if (cartArray[i].quantity === 0) {
                    cartArray.splice(i, 1);
                }
                renderCart();
                return;
            }
        }
    }
});

//testing
moreInfoText!.innerHTML = `
    <h3>Title</h3> 
    <span class="price">Pris: 20</span>
    <div id="ingredients">
    </div>    
`

document.querySelector("#ingredients")!.innerHTML = "<p>En mix av lakrits och gelé med fruktsmak</p>\n<p>Innehållsförteckning: Socker, glukossirap, glukos-fruktossirap, stärkelse, VETEMJÖL, melass, syra (citronsyra), fuktighetsbevarande medel (sorbitoler, glycerol), lakritsextrakt, salt, vegetabiliska oljor (kokos, palm), aromer, färgämnen (E153, E120, E100, E141), ytbehandlingsmedel (bivax), stabiliseringsmedel (E471).</p>\n<p><em>Alla priser är per skopa.</em></p>\n"

// EventListeners
closeInfoBtn?.addEventListener("click", () => {
    infoDiv!.classList.toggle("d-none")
})

infoBtn?.addEventListener("click", () => {
    infoDiv!.classList.toggle("d-none")
})

infoDiv?.addEventListener("click", e => {

    const target = e.target as HTMLElement

    if (target.tagName === "DIV") {
        infoDiv!.classList.toggle("d-none")
    }

})

const cartEl = document.querySelector("#cart");
const activeCartEl = document.querySelector("#activeCart");

cartEl?.addEventListener("click", function(){
    activeCartEl?.classList.toggle("d-none");
})

// const getItems = async () => {
//   items[0]= await fetchItems()
//     console.log(items)
//     renderDom()
// }

const getItems = async () => {
    let items: IItem = await fetchItems()
      console.log(items)
      renderDom()
  }

const renderDom = () => {
    
    const renderItems = document.querySelector<any>('#card')!;
    
    renderItems!.innerHTML += items.map(item => 
        `
        <div id="card" class="card col-6">
            <img class="card-img-top" src="${item.images}" alt="Card image cap">
            <div class="card-body">
                <h5 class="card-title">${item.name[0]}</h5>
                <p class="card-text">${item.description[0]}asd</p>
                <a href="#" class="btn btn-primary">Lägg till i varukorgen</a>
                <!-- testar att ha en button som visar mer info -->
                <button class="btn btn-secondary" id="info-btn">Läs mer</button>
            </div>
        </div>

        `
        ).join('')
    
    console.log(renderItems)
}
getItems()
renderDom()