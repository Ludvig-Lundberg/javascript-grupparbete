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
    <p>Hej hej hej</p>`

infoBtn?.addEventListener("click", () => {
    infoDiv!.classList.toggle("d-none")
})

infoDiv?.addEventListener("click", e => {

    const target = e.target as HTMLElement

    if (target.tagName === "DIV") {
        infoDiv!.classList.toggle("d-none")
    }

})

closeInfoBtn?.addEventListener("click", () => {
    infoDiv!.classList.toggle("d-none")
})