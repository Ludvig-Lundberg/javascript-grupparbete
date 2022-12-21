import { IItem } from './interfaces'
import {fetchItems} from './api'
import './style.css'

const moreInfo = document.querySelector("#more-information")
const moreInfoText = document.querySelector("#info-text")
const infoDiv = document.querySelector("#fade-background")
const infoBtn = document.querySelector("#info-btn")
const closeInfoBtn = document.querySelector("#close-info-btn")

// array för att hämta item (product) från API
// let items : IItem[] = []
let items : []


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
        <li class="text-right float-right">Totalt: ${totalCost} kr</li>`
        // sedan fyller man på igen
        for (let i = 0; i < cartArray.length; i++) {

            cartListEl!.innerHTML += `<li>
            <span class="cartItem1">${cartArray[i].item_name}</span><br>
            <span class="cartItem2">${cartArray[i].qty} st</span>
            <span class="cartItem3">${(cartArray[i].item_price) * (cartArray[i].qty)} kr</span>
                <i class="fa-solid fa-circle-plus plusButton"></i>
                <i class="fa-solid fa-circle-minus minusButton"></i>
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
        productName = (e.target as HTMLElement).parentElement?.querySelector(".cartItem1")?.textContent;

        let i = 0;
        for (; i < cartArray.length; i++) {
            if (cartArray[i].item_name.includes(productName)) {
                cartArray[i].qty ++;
                renderCart();
                return;
            }
        }

    } else if ((e.target as HTMLElement).classList.contains("minusButton")) {
        productName = (e.target as HTMLElement).parentElement?.querySelector(".cartItem1")?.textContent;
        
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


const getItems = async () => {
    items = await fetchItems()
      console.log(items.data)

    renderDom()
    return items.data
 
  }

const renderItems = document.querySelector('#grid')!;

const renderDom = (() => {
    
    
    console.log(items.data)

    let itemArray = items.data

    console.log(itemArray.map(e => e.name))
    
    renderItems.innerHTML += itemArray.map(item => 
        `
        <div id="${item.id}" class="card col-6">
            <img class="card-img-top" src="https://bortakvall.se/${item.images.thumbnail}" alt="Card image cap">
            <div id="Cardsbox" class="card-body">
                <h5 class="card-title">${item.name}</h5>
                <div id="priceTitles">${item.price}kr per skopa</div>
                <div id="hideDescription">${item.description}</div>
                <button class="btn btn-primary addButton">Lägg till i varukorgen</button>
                <!-- testar att ha en button som visar mer info -->
                <button class="btn btn-secondary" id="info-btn">Läs mer</button>
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
            item_total: number = 1 * item_price,
            item_name: string = target.parentElement?.querySelector("h5")?.textContent!;

            // kollar om det redan finns det typen av varan då 'qty ++;' och returerar, slutar alltså hela funktionen. Annars pushar den in ett nytt object.
        for (let i = 0; i < cartArray.length; i++) {
            if(cartArray.some(e => e.id === productId)) {
                let o = cartArray.findIndex(e => e.id === productId);
                console.log("Object found inside the array.");
                console.log(o);
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
        console.log(cartArray)
    }
});

getItems()
renderDom()