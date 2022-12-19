import { IItem } from './interfaces'
import {fetchItems} from './api'

const moreInfo = document.querySelector("#more-information")
const moreInfoText = document.querySelector("#info-text")
const infoDiv = document.querySelector("#fade-background")

// array för att hämta item från API
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

moreInfoText!.innerHTML = `<p>Hej hej hej</p>`