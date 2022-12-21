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
let cartArray: Array<any> = [];
let button = document.querySelector("#addButton");

const cartListEl = document.querySelector("#cartList");
button?.addEventListener("click", function () {
    cart.push({
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
const cartPayButton = document.querySelector("#cartPay");
const cartNumber = document.querySelector("#cartNumber");
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
        // sedan fyller man på igen
        for (let i = 0; i < cartArray.length; i++) {
            cartListEl!.innerHTML += `<li>
            <span class="cartItem1">${cartArray[i].product}</span><br>
            <span class="cartItem2">${cartArray[i].quantity} st</span>
            <span class="cartItem3">${(cartArray[i].cost) * (cartArray[i].quantity)} kr</span>
                <i class="fa-solid fa-circle-plus plusButton"></i>
                <i class="fa-solid fa-circle-minus minusButton"></i>
            </li>`
        }
    }
};

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