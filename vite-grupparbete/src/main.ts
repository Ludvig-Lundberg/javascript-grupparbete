import './style.css'

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