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

// Temporär knapp
let cart: object [] = [];
let button = document.querySelector("#addButton");
button?.addEventListener("click", e => {
    cart.push({
        produkt: "banan",
        quantity: 2,
        cost: 10
    })
    console.log(cart.length);
    console.log(cart);
})
// Temporär knapp

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